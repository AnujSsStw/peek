import { NextResponse } from "next/server";

// ── Pure helper functions extracted for testing ──────────────────────────
// These mirror the internal helpers in google-cal.ts and todoist-task.ts

function normalizeRange(from: Date | string, to: Date | string) {
  const normalizedFrom = from instanceof Date ? from : new Date(from);
  const normalizedTo = to instanceof Date ? to : new Date(to);

  if (
    Number.isNaN(normalizedFrom.getTime()) ||
    Number.isNaN(normalizedTo.getTime())
  ) {
    throw new Error("Invalid time range");
  }

  if (normalizedFrom >= normalizedTo) {
    throw new Error("The `from` date must be before `to`");
  }

  return { from: normalizedFrom.toISOString(), to: normalizedTo.toISOString() };
}

function resolveGoogleBoundary(input?: {
  date?: string | null;
  dateTime?: string | null;
}) {
  if (!input) return null;

  if (input.dateTime) {
    return { iso: new Date(input.dateTime).toISOString(), isAllDay: false };
  }

  if (input.date) {
    const d = new Date(`${input.date}T00:00:00.000Z`);
    if (!isNaN(d.getTime())) {
      return { iso: d.toISOString(), isAllDay: true };
    }
  }

  return null;
}

function resolveTodoistSchedule(task: {
  due: { date: string; datetime?: string | null } | null;
  deadline: { date: string } | null;
}) {
  if (task.due?.datetime) {
    return {
      iso: new Date(task.due.datetime).toISOString(),
      isAllDay: false,
      kind: "due" as const,
    };
  }

  if (task.due?.date) {
    const d = new Date(`${task.due.date}T00:00:00.000Z`);
    if (!isNaN(d.getTime())) {
      return { iso: d.toISOString(), isAllDay: true, kind: "due" as const };
    }
  }

  if (task.deadline?.date) {
    const d = new Date(`${task.deadline.date}T00:00:00.000Z`);
    if (!isNaN(d.getTime())) {
      return {
        iso: d.toISOString(),
        isAllDay: true,
        kind: "deadline" as const,
      };
    }
  }

  return null;
}

function isTodoistTaskInRange(
  task: {
    due: { date: string; datetime?: string | null } | null;
    deadline: { date: string } | null;
  },
  range: { from: Date; to: Date },
  includeUndated: boolean,
) {
  const schedule = resolveTodoistSchedule(task);
  if (!schedule) return includeUndated;

  const when = new Date(schedule.iso).getTime();
  return when >= range.from.getTime() && when <= range.to.getTime();
}

// ── Test endpoint ────────────────────────────────────────────────────────

export async function POST(request: Request) {
  // Only available in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 404 });
  }

  let body: { fn: string; args: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { fn, args } = body;

  try {
    switch (fn) {
      case "normalizeRange": {
        const { from, to } = args as { from: string; to: string };
        const result = normalizeRange(from, to);
        return NextResponse.json({ result });
      }

      case "resolveGoogleBoundary": {
        const input = args as {
          date?: string | null;
          dateTime?: string | null;
        } | undefined;
        const result = resolveGoogleBoundary(input);
        return NextResponse.json({ result });
      }

      case "resolveTodoistSchedule": {
        const task = args as {
          due: { date: string; datetime?: string | null } | null;
          deadline: { date: string } | null;
        };
        const result = resolveTodoistSchedule(task);
        return NextResponse.json({ result });
      }

      case "isTodoistTaskInRange": {
        const { task, range, includeUndated } = args as {
          task: {
            due: { date: string; datetime?: string | null } | null;
            deadline: { date: string } | null;
          };
          range: { from: string; to: string };
          includeUndated: boolean;
        };
        const result = isTodoistTaskInRange(
          task,
          { from: new Date(range.from), to: new Date(range.to) },
          includeUndated,
        );
        return NextResponse.json({ result });
      }

      default:
        return NextResponse.json(
          { error: `Unknown function: ${fn}` },
          { status: 400 },
        );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
