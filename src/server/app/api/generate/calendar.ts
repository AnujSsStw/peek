import {
  fetchGoogleCalendarEvents,
  syncGoogleCalendarLists,
} from "@/lib/google-cal";
import { fetchTodoistTasks, syncTodoistTaskLists } from "@/lib/todoist-task";

export interface CalendarEvent {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: "completed" | "in-progress" | "upcoming";
  location?: string;
}

export interface CalendarTask {
  title: string;
  done: boolean;
  priority: "high" | "medium" | "low";
}

export interface CalendarData {
  events: CalendarEvent[];
  tasks: CalendarTask[];
}

function mapTodoistPriority(priority: number): "high" | "medium" | "low" {
  // Todoist priority: 4 = urgent, 3 = high, 2 = medium, 1 = low
  if (priority >= 3) return "high";
  if (priority === 2) return "medium";
  return "low";
}

function formatTime(iso: string, timezone: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone,
  });
}

function resolveEventStatus(
  startAt: string,
  endAt: string | null,
  now: Date,
): "completed" | "in-progress" | "upcoming" {
  const start = new Date(startAt);
  const end = endAt ? new Date(endAt) : start;

  if (now >= end) return "completed";
  if (now >= start && now < end) return "in-progress";
  return "upcoming";
}

export async function getCalendarData(
  userId: string,
  timezone: string,
): Promise<CalendarData> {
  const now = new Date();

  // Build day boundaries in the user's timezone
  const dayStart = new Date(
    now.toLocaleDateString("en-CA", { timeZone: timezone }) + "T00:00:00",
  );
  const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

  // Sync integration sources so we always have the latest list
  await Promise.allSettled([
    syncGoogleCalendarLists(userId),
    syncTodoistTaskLists(userId),
  ]);

  const [googleEvents, todoistTasks] = await Promise.allSettled([
    fetchGoogleCalendarEvents({
      userId,
      from: dayStart,
      to: dayEnd,
    }),
    fetchTodoistTasks({
      userId,
      from: dayStart,
      to: dayEnd,
      includeUndated: true,
    }),
  ]);

  const events: CalendarEvent[] = [];
  const tasks: CalendarTask[] = [];

  if (googleEvents.status === "fulfilled") {
    for (const event of googleEvents.value) {
      if (event.isAllDay) continue;

      events.push({
        title: event.title,
        description: event.description ?? undefined,
        startTime: formatTime(event.startAt, timezone),
        endTime: event.endAt
          ? formatTime(event.endAt, timezone)
          : formatTime(event.startAt, timezone),
        status: resolveEventStatus(event.startAt, event.endAt, now),
        location: event.location ?? undefined,
      });
    }
  } else {
    console.error(
      "Failed to fetch Google Calendar events:",
      googleEvents.reason,
    );
  }

  if (todoistTasks.status === "fulfilled") {
    for (const task of todoistTasks.value) {
      tasks.push({
        title: task.title,
        done: task.completed,
        priority: mapTodoistPriority(task.priority),
      });
    }
  } else {
    console.error("Failed to fetch Todoist tasks:", todoistTasks.reason);
  }

  return { events, tasks };
}
