import { z } from "zod";
import type { LayoutType } from "../screenshot/types";

// ─── Contextual Hero ────────────────────────────────────────────
const contextualHeroSchema = z.object({
  variant: z
    .enum([
      "morning",
      "urgent",
      "night",
      "focus",
      "alert",
      "calm",
      "weather",
      "energy",
      "eink",
    ])
    .describe(
      "Pick based on time-of-day and urgency: morning/night for time, urgent/alert for imminent events, focus for deep work, calm for free time, weather/energy for ambient info, eink for minimal display",
    ),
  data: z.object({
    icon: z.string().describe("Single emoji that represents the widget state"),
    val: z
      .string()
      .describe(
        "Primary value shown large — time, countdown, percentage, or short word. Max 6 chars.",
      ),
    sub: z
      .string()
      .describe("Subtitle below the value — context phrase. Max 20 chars."),
  }),
});

// ─── Bento Box ──────────────────────────────────────────────────
const bentoCellSchema = z.object({
  icon: z.string().describe("Single emoji for the cell"),
  iconBg: z
    .string()
    .describe(
      "CSS rgba background for the icon badge, e.g. rgba(99,179,255,.2)",
    ),
  head: z
    .string()
    .describe("Category label, e.g. 'Next Up', 'Focus'. Max 10 chars."),
  val: z
    .string()
    .describe("Value text, e.g. 'Design Review', '47 min left'. Max 15 chars."),
});

const bentoBoxSchema = z.object({
  variant: z
    .enum(["frost", "cream", "charcoal", "ocean", "neon", "eink"])
    .describe(
      "frost: glass/blue, cream: warm/light, charcoal: dark, ocean: deep blue, neon: cyber green on black, eink: grayscale minimal",
    ),
  data: z.object({
    cells: z
      .array(bentoCellSchema)
      .min(4)
      .max(4)
      .describe(
        "Exactly 4 cells. Recommended order: Next event, Focus/time, Streak, Tasks.",
      ),
  }),
});

// ─── Timeline ───────────────────────────────────────────────────
const timelineEventSchema = z.object({
  time: z.string().describe("HH:MM format, e.g. '13:00'"),
  title: z.string().describe("Event name. Max 25 chars."),
  meta: z
    .string()
    .describe(
      "Duration or status text, e.g. '30 min · Complete', 'Now · 47 min left'. Max 20 chars.",
    ),
  status: z
    .enum(["past", "active"])
    .nullable()
    .describe(
      "Set 'past' for completed events, 'active' for current one. null for future.",
    ),
});

const timelineSchema = z.object({
  variant: z
    .enum(["light", "dark", "emerald", "amber", "eink"])
    .describe(
      "light: daytime, dark: evening, emerald: wellness/nature, amber: late night warm, eink: grayscale minimal",
    ),
  data: z.object({
    heading: z
      .string()
      .describe("Top heading, e.g. 'Good afternoon, Harsh'. Max 30 chars."),
    events: z
      .array(timelineEventSchema)
      .min(3)
      .max(5)
      .describe("3-5 events in chronological order. One should be 'active'."),
  }),
});

// ─── Timeline Tasks ─────────────────────────────────────────────
const subTaskSchema = z.object({
  text: z.string().describe("Subtask label. Max 25 chars."),
  done: z.boolean(),
});

const timelineTaskEventSchema = z.object({
  time: z.string().describe("HH:MM for events, empty string for inline tasks"),
  title: z.string().describe("Event or task name. Max 25 chars."),
  meta: z.string().describe("Status/duration. Max 20 chars."),
  status: z
    .enum(["past", "active"])
    .nullable()
    .describe("'past' for completed, 'active' for current, null for future"),
  type: z
    .enum(["event", "task"])
    .nullable()
    .describe("'task' for inline task items, 'event' for calendar events, null if obvious"),
  subtasks: z
    .array(subTaskSchema)
    .nullable()
    .describe("Only used with nested subVariant, null otherwise"),
});

const taskItemSchema = z.object({
  text: z.string().describe("Task label. Max 25 chars."),
  done: z.boolean(),
});

const timelineTasksSchema = z.object({
  variant: z
    .enum([
      "inline/light",
      "inline/dark",
      "pinned/light",
      "pinned/dark",
      "nested/light",
      "nested/dark",
      "floating/light",
      "floating/dark",
      "progress/light",
      "progress/dark",
    ])
    .describe(
      "Format: subVariant/theme. SubVariants: inline (tasks mixed into timeline), pinned (separate task block), nested (subtasks under events), floating (single floating task card), progress (progress bar header). Theme: light for day, dark for evening.",
    ),
  data: z.object({
    heading: z.string().describe("Section heading. Max 25 chars."),
    subVariant: z
      .enum(["inline", "pinned", "nested", "floating", "progress"])
      .describe("Must match the subVariant part of the chosen variant"),
    events: z
      .array(timelineTaskEventSchema)
      .min(2)
      .max(7)
      .describe(
        "Timeline events, optionally mixed with tasks for inline variant",
      ),
    taskBlock: z
      .object({
        title: z.string().describe("Block title, e.g. 'Tasks'. Max 15 chars."),
        count: z.string().describe("e.g. '3 / 5'. Max 10 chars."),
        tasks: z.array(taskItemSchema).min(2).max(5),
      })
      .nullable()
      .describe("Only for pinned subVariant, null otherwise"),
    floatingTask: z
      .object({
        icon: z.string().describe("Arrow or emoji, e.g. '→'"),
        label: z.string().describe("e.g. 'Up Next Task'. Max 15 chars."),
        title: z.string().describe("Task name. Max 25 chars."),
        sub: z.string().describe("Priority + context. Max 35 chars."),
      })
      .nullable()
      .describe("Only for floating subVariant, null otherwise"),
    progressHeader: z
      .object({
        greeting: z.string().describe("Day name or greeting. Max 15 chars."),
        fraction: z.string().describe("e.g. '3 of 7 tasks'. Max 15 chars."),
        percent: z.number().min(0).max(100),
      })
      .nullable()
      .describe("Only for progress subVariant, null otherwise"),
  }),
});

// ─── Minimalist Stack ───────────────────────────────────────────
const minimalistStackSchema = z.object({
  variant: z
    .enum(["light", "dark", "editorial", "ink", "brutal", "neon", "eink"])
    .describe(
      "light: clean daytime, dark: evening, editorial: refined, ink: reflective, brutal: bold/urgent, neon: cyber, eink: grayscale",
    ),
  data: z.object({
    top: z
      .string()
      .describe(
        "Top line — day + context, e.g. 'Wednesday · Focus Day'. Max 30 chars.",
      ),
    mid: z
      .string()
      .describe("Middle line — main message/motivation. Max 40 chars."),
    bot: z.string().describe("Bottom line — supporting detail. Max 40 chars."),
  }),
});

// ─── Progress Ring ──────────────────────────────────────────────
const progressRingSchema = z.object({
  variant: z.enum(["dark", "light"]).describe("dark or light theme"),
  data: z.object({
    percent: z
      .number()
      .min(0)
      .max(100)
      .describe("Completion percentage for the ring"),
    label: z
      .string()
      .describe("Label below ring, e.g. 'Day complete'. Max 15 chars."),
  }),
});

// ─── Companion Quote ────────────────────────────────────────────
const companionQuoteSchema = z.object({
  variant: z
    .enum(["warm", "frost"])
    .describe("warm: encouraging/afternoon, frost: reflective/evening"),
  data: z.object({
    text: z
      .string()
      .describe("Motivational quote — gentle, not cheesy. Max 70 chars."),
    from: z
      .string()
      .describe(
        "Attribution line, e.g. 'Peek · Your afternoon nudge'. Max 30 chars.",
      ),
  }),
});

// ─── Streak Flame ───────────────────────────────────────────────
const streakFlameSchema = z.object({
  variant: z
    .enum(["fire", "cool"])
    .describe("fire: warm/red flame emoji, cool: electric/lightning emoji"),
  data: z.object({
    flame: z.string().describe("Emoji: 🔥 for fire, ⚡ for cool"),
    num: z.number().min(1).describe("Current streak count"),
    label: z.string().describe("e.g. 'Day streak'. Max 15 chars."),
  }),
});

// ─── Daily Score ────────────────────────────────────────────────
const scoreBarSchema = z.object({
  label: z
    .string()
    .describe("Category, e.g. 'Tasks', 'Focus', 'Move'. Max 10 chars."),
  percent: z.number().min(0).max(100),
  color: z
    .string()
    .describe("CSS color, e.g. '#0d7df2', '#f59e0b', 'var(--accent)'"),
});

const dailyScoreSchema = z.object({
  variant: z.enum(["dark", "light"]).describe("dark or light theme"),
  data: z.object({
    score: z.number().min(0).max(100).describe("Overall day score"),
    title: z.string().describe("e.g. 'Today\\'s Score'. Max 20 chars."),
    bars: z
      .array(scoreBarSchema)
      .min(3)
      .max(3)
      .describe("Exactly 3 score bars: Tasks, Focus, Move"),
  }),
});

// ─── Schema lookup ──────────────────────────────────────────────
const SCHEMAS: Record<LayoutType, z.ZodType> = {
  "contextual-hero": contextualHeroSchema,
  "bento-box": bentoBoxSchema,
  timeline: timelineSchema,
  "timeline-tasks": timelineTasksSchema,
  "minimalist-stack": minimalistStackSchema,
  "progress-ring": progressRingSchema,
  "companion-quote": companionQuoteSchema,
  "streak-flame": streakFlameSchema,
  "daily-score": dailyScoreSchema,
};

export function getSchemaForLayout(layout: LayoutType): z.ZodType {
  return SCHEMAS[layout];
}
