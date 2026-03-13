import { TodoistApi } from "@doist/todoist-api-typescript";
import { and, asc, eq, inArray, notInArray, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { integrationSource } from "@/lib/db/schema";

const TODOIST_PROVIDER_ID = "todoist";
const TODOIST_SOURCE_KIND = "project";

type IntegrationSourceRow = typeof integrationSource.$inferSelect;

export type TodoistTaskListSource = {
  sourceId: string;
  projectId: string;
  provider: "todoist";
  kind: "project";
  name: string;
  description: string | null;
  color: string | null;
  enabled: boolean;
  isAvailable: boolean;
  lastSyncedAt: Date | null;
  metadata: Record<string, unknown> | null;
};

export type TodoistTask = {
  provider: "todoist";
  sourceId: string;
  projectId: string;
  sourceName: string;
  taskId: string;
  title: string;
  description: string | null;
  url: string;
  priority: number;
  completed: boolean;
  isAllDay: boolean;
  dueAt: string | null;
  scheduledKind: "due" | "deadline" | "undated";
  addedAt: string | null;
  updatedAt: string | null;
  completedAt: string | null;
  labels: string[];
};

type TodoistRange = {
  from: Date;
  to: Date;
};

type ListTodoistTaskListsOptions = {
  enabledOnly?: boolean;
  includeUnavailable?: boolean;
  projectIds?: string[];
};

type FetchTodoistTasksOptions = {
  userId: string;
  from: Date | string;
  to: Date | string;
  projectIds?: string[];
  includeDisabled?: boolean;
  includeUndated?: boolean;
};

function mapTodoistTaskListSource(
  source: IntegrationSourceRow,
): TodoistTaskListSource {
  return {
    sourceId: source.id,
    projectId: source.externalId,
    provider: "todoist",
    kind: "project",
    name: source.name,
    description: source.description,
    color: source.color,
    enabled: source.enabled,
    isAvailable: source.isAvailable,
    lastSyncedAt: source.lastSyncedAt,
    metadata:
      (source.metadata as Record<string, unknown> | null | undefined) ?? null,
  };
}

function normalizeRange(from: Date | string, to: Date | string): TodoistRange {
  const normalizedFrom = from instanceof Date ? from : new Date(from);
  const normalizedTo = to instanceof Date ? to : new Date(to);

  if (Number.isNaN(normalizedFrom.getTime()) || Number.isNaN(normalizedTo.getTime())) {
    throw new Error("Invalid time range");
  }

  if (normalizedFrom >= normalizedTo) {
    throw new Error("The `from` date must be before `to`");
  }

  return {
    from: normalizedFrom,
    to: normalizedTo,
  };
}

function resolveTodoistSchedule(task: {
  due: {
    date: string;
    datetime?: string | null;
  } | null;
  deadline: {
    date: string;
  } | null;
}) {
  if (task.due?.datetime) {
    return {
      iso: new Date(task.due.datetime).toISOString(),
      isAllDay: false,
      kind: "due" as const,
    };
  }

  if (task.due?.date) {
    return {
      iso: new Date(`${task.due.date}T00:00:00.000Z`).toISOString(),
      isAllDay: true,
      kind: "due" as const,
    };
  }

  if (task.deadline?.date) {
    return {
      iso: new Date(`${task.deadline.date}T00:00:00.000Z`).toISOString(),
      isAllDay: true,
      kind: "deadline" as const,
    };
  }

  return null;
}

function isTodoistTaskInRange(
  task: {
    due: {
      date: string;
      datetime?: string | null;
    } | null;
    deadline: {
      date: string;
    } | null;
  },
  range: TodoistRange,
  includeUndated: boolean,
) {
  const schedule = resolveTodoistSchedule(task);

  if (!schedule) {
    return includeUndated;
  }

  const when = new Date(schedule.iso).getTime();
  return when >= range.from.getTime() && when <= range.to.getTime();
}

async function getTodoistAccessToken(userId: string) {
  const { auth } = await import("@/lib/auth");
  const tokens = await auth.api.getAccessToken({
    body: {
      providerId: TODOIST_PROVIDER_ID,
      userId,
    },
  });

  if (!tokens.accessToken) {
    throw new Error("Todoist access token is missing");
  }

  return tokens.accessToken;
}

async function getTodoistApiForUser(userId: string) {
  const accessToken = await getTodoistAccessToken(userId);
  return new TodoistApi(accessToken);
}

async function markTodoistProjectsUnavailable(userId: string) {
  await db
    .update(integrationSource)
    .set({
      isAvailable: false,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(integrationSource.userId, userId),
        eq(integrationSource.provider, TODOIST_PROVIDER_ID),
        eq(integrationSource.kind, TODOIST_SOURCE_KIND),
      ),
    );
}

export async function listTodoistTaskLists(
  userId: string,
  options: ListTodoistTaskListsOptions = {},
) {
  const filters = [
    eq(integrationSource.userId, userId),
    eq(integrationSource.provider, TODOIST_PROVIDER_ID),
    eq(integrationSource.kind, TODOIST_SOURCE_KIND),
  ];

  if (options.enabledOnly) {
    filters.push(eq(integrationSource.enabled, true));
  }

  if (!options.includeUnavailable) {
    filters.push(eq(integrationSource.isAvailable, true));
  }

  if (options.projectIds?.length) {
    filters.push(inArray(integrationSource.externalId, options.projectIds));
  }

  const projects = await db
    .select()
    .from(integrationSource)
    .where(and(...filters))
    .orderBy(asc(integrationSource.name));

  return projects.map(mapTodoistTaskListSource);
}

export async function setTodoistTaskListEnabled(args: {
  userId: string;
  projectId: string;
  enabled: boolean;
}) {
  const [updatedProject] = await db
    .update(integrationSource)
    .set({
      enabled: args.enabled,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(integrationSource.userId, args.userId),
        eq(integrationSource.provider, TODOIST_PROVIDER_ID),
        eq(integrationSource.kind, TODOIST_SOURCE_KIND),
        eq(integrationSource.externalId, args.projectId),
      ),
    )
    .returning();

  return updatedProject ? mapTodoistTaskListSource(updatedProject) : null;
}

export async function syncTodoistTaskLists(userId: string) {
  const syncedAt = new Date();
  const projects = [];

  try {
    const todoistApi = await getTodoistApiForUser(userId);

    let cursor: string | null | undefined = null;
    do {
      const response = await todoistApi.getProjects({
        cursor,
        limit: 100,
      });

      projects.push(
        ...response.results.filter(
          (project) => !project.isArchived && !project.isDeleted,
        ),
      );
      cursor = response.nextCursor;
    } while (cursor);
  } catch {
    await markTodoistProjectsUnavailable(userId);
    return [];
  }

  if (!projects.length) {
    await markTodoistProjectsUnavailable(userId);
    return [];
  }

  const upsertRows = projects.map((project) => ({
    id: crypto.randomUUID(),
    userId,
    provider: TODOIST_PROVIDER_ID,
    kind: TODOIST_SOURCE_KIND,
    externalId: project.id,
    name: project.name,
    description: project.description ?? null,
    color: project.color ?? null,
    enabled: true,
    isAvailable: true,
    metadata: {
      url: project.url,
      isFavorite: project.isFavorite,
      isShared: project.isShared,
      viewStyle: project.viewStyle,
      inboxProject:
        "inboxProject" in project ? Boolean(project.inboxProject) : false,
    },
    lastSyncedAt: syncedAt,
    createdAt: syncedAt,
    updatedAt: syncedAt,
  }));

  await db
    .insert(integrationSource)
    .values(upsertRows)
    .onConflictDoUpdate({
      target: [
        integrationSource.userId,
        integrationSource.provider,
        integrationSource.kind,
        integrationSource.externalId,
      ],
      set: {
        name: sql`excluded.name`,
        description: sql`excluded.description`,
        color: sql`excluded.color`,
        isAvailable: true,
        metadata: sql`excluded.metadata`,
        lastSyncedAt: syncedAt,
        updatedAt: syncedAt,
      },
    });

  const syncedProjectIds = upsertRows.map((row) => row.externalId);
  const unavailableFilters = [
    eq(integrationSource.userId, userId),
    eq(integrationSource.provider, TODOIST_PROVIDER_ID),
    eq(integrationSource.kind, TODOIST_SOURCE_KIND),
  ];

  if (syncedProjectIds.length) {
    unavailableFilters.push(
      notInArray(integrationSource.externalId, syncedProjectIds),
    );
  }

  await db
    .update(integrationSource)
    .set({
      isAvailable: false,
      updatedAt: syncedAt,
    })
    .where(and(...unavailableFilters));

  return listTodoistTaskLists(userId, {
    includeUnavailable: true,
  });
}

export async function fetchTodoistTasks(
  options: FetchTodoistTasksOptions,
) {
  const range = normalizeRange(options.from, options.to);
  const projects = await listTodoistTaskLists(options.userId, {
    enabledOnly: !options.includeDisabled,
    includeUnavailable: false,
    projectIds: options.projectIds,
  });

  if (!projects.length) {
    return [];
  }

  const todoistApi = await getTodoistApiForUser(options.userId);
  const tasksByProject = await Promise.all(
    projects.map(async (project) => {
      const tasks: TodoistTask[] = [];
      let cursor: string | null | undefined = null;

      do {
        const response = await todoistApi.getTasks({
          projectId: project.projectId,
          cursor,
          limit: 200,
        });

        for (const task of response.results) {
          if (
            !isTodoistTaskInRange(
              task,
              range,
              options.includeUndated ?? false,
            )
          ) {
            continue;
          }

          const schedule = resolveTodoistSchedule(task);

          tasks.push({
            provider: "todoist",
            sourceId: project.sourceId,
            projectId: project.projectId,
            sourceName: project.name,
            taskId: task.id,
            title: task.content,
            description: task.description || null,
            url: task.url,
            priority: task.priority,
            completed: task.checked,
            isAllDay: schedule?.isAllDay ?? false,
            dueAt: schedule?.iso ?? null,
            scheduledKind: schedule?.kind ?? "undated",
            addedAt: task.addedAt,
            updatedAt: task.updatedAt,
            completedAt: task.completedAt,
            labels: task.labels,
          });
        }

        cursor = response.nextCursor;
      } while (cursor);

      return tasks;
    }),
  );

  return tasksByProject.flat().sort((left, right) => {
    if (!left.dueAt && !right.dueAt) {
      return left.title.localeCompare(right.title);
    }

    if (!left.dueAt) {
      return 1;
    }

    if (!right.dueAt) {
      return -1;
    }

    return left.dueAt.localeCompare(right.dueAt);
  });
}
