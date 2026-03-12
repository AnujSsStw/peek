import type {
  LayoutType,
  ContextualHeroData,
  BentoBoxData,
  TimelineData,
  TimelineTasksData,
  MinimalistStackData,
  ProgressRingData,
  CompanionQuoteData,
  StreakFlameData,
  DailyScoreData,
  WidgetData,
} from "../types";

// ─── Contextual Hero ────────────────────────────────────────────
const contextualHero: Record<string, ContextualHeroData> = {
  morning: { icon: "☀️", val: "9:15", sub: "Good morning" },
  urgent: { icon: "⚡", val: "In 5m", sub: "Team standup" },
  night: { icon: "🌙", val: "22:30", sub: "Wind down" },
  focus: { icon: "🧘", val: "47m", sub: "Focus remaining" },
  alert: { icon: "🚨", val: "NOW", sub: "Meeting started" },
  calm: { icon: "💜", val: "Relax", sub: "No more events" },
  weather: { icon: "⛅", val: "34°", sub: "Partly cloudy" },
  energy: { icon: "🔋", val: "82%", sub: "Energy level" },
  eink: { icon: "📋", val: "3 / 7", sub: "Tasks done" },
};

// ─── Bento Box ──────────────────────────────────────────────────
const bentoBox: Record<string, BentoBoxData> = {
  frost: {
    cells: [
      {
        icon: "📅",
        iconBg: "rgba(99,179,255,.2)",
        head: "Next Up",
        val: "Design Review",
      },
      {
        icon: "🎯",
        iconBg: "rgba(255,149,0,.2)",
        head: "Focus",
        val: "47 min left",
      },
      {
        icon: "🔥",
        iconBg: "rgba(196,242,74,.18)",
        head: "Streak",
        val: "12 days",
      },
      {
        icon: "✅",
        iconBg: "rgba(191,148,255,.2)",
        head: "Tasks",
        val: "3 of 7",
      },
    ],
  },
  cream: {
    cells: [
      {
        icon: "📅",
        iconBg: "rgba(60,120,200,.12)",
        head: "Next Up",
        val: "Factory Call",
      },
      {
        icon: "🎯",
        iconBg: "rgba(220,120,30,.12)",
        head: "Focus",
        val: "23 min left",
      },
      {
        icon: "🔥",
        iconBg: "rgba(50,160,60,.12)",
        head: "Streak",
        val: "5 days",
      },
      {
        icon: "✅",
        iconBg: "rgba(140,90,200,.12)",
        head: "Tasks",
        val: "6 of 8",
      },
    ],
  },
  charcoal: {
    cells: [
      {
        icon: "📅",
        iconBg: "rgba(99,179,255,.12)",
        head: "Next Up",
        val: "Lunch Break",
      },
      {
        icon: "🎯",
        iconBg: "rgba(255,149,0,.12)",
        head: "Focus",
        val: "Done!",
      },
      {
        icon: "🔥",
        iconBg: "rgba(196,242,74,.12)",
        head: "Streak",
        val: "30 days",
      },
      {
        icon: "✅",
        iconBg: "rgba(191,148,255,.12)",
        head: "Tasks",
        val: "7 of 7",
      },
    ],
  },
  ocean: {
    cells: [
      {
        icon: "📅",
        iconBg: "rgba(80,170,255,.15)",
        head: "Next Up",
        val: "Team Sync",
      },
      {
        icon: "🎯",
        iconBg: "rgba(80,220,200,.15)",
        head: "Focus",
        val: "90 min left",
      },
      {
        icon: "🔥",
        iconBg: "rgba(80,230,160,.15)",
        head: "Streak",
        val: "8 days",
      },
      {
        icon: "✅",
        iconBg: "rgba(130,140,255,.15)",
        head: "Tasks",
        val: "2 of 5",
      },
    ],
  },
  neon: {
    cells: [
      {
        icon: "📅",
        iconBg: "rgba(196,242,74,.1)",
        head: "Next Up",
        val: "Ship v2.0",
      },
      {
        icon: "🎯",
        iconBg: "rgba(196,242,74,.1)",
        head: "Focus",
        val: "Deep work",
      },
      {
        icon: "🔥",
        iconBg: "rgba(196,242,74,.1)",
        head: "Streak",
        val: "15 days",
      },
      {
        icon: "✅",
        iconBg: "rgba(196,242,74,.1)",
        head: "Tasks",
        val: "4 of 6",
      },
    ],
  },
  eink: {
    cells: [
      {
        icon: "📅",
        iconBg: "rgba(0,0,0,.06)",
        head: "Next Up",
        val: "Journaling",
      },
      { icon: "🎯", iconBg: "rgba(0,0,0,.06)", head: "Focus", val: "15 min" },
      { icon: "🔥", iconBg: "rgba(0,0,0,.06)", head: "Streak", val: "7 days" },
      { icon: "✅", iconBg: "rgba(0,0,0,.06)", head: "Tasks", val: "1 of 3" },
    ],
  },
};

// ─── Timeline ───────────────────────────────────────────────────
const timeline: Record<string, TimelineData> = {
  light: {
    heading: "Good afternoon, Harsh",
    events: [
      {
        time: "9:00",
        title: "Morning journaling",
        meta: "15 min · Complete",
        status: "past",
      },
      {
        time: "10:30",
        title: "Standup with eng",
        meta: "30 min · Complete",
        status: "past",
      },
      {
        time: "13:00",
        title: "Deep work block",
        meta: "Now · 47 min left",
        status: "active",
      },
      {
        time: "15:00",
        title: "Factory call — Shenzhen",
        meta: "45 min · Zoom",
      },
      { time: "17:00", title: "Evening walk", meta: "30 min" },
    ],
  },
  dark: {
    heading: "Your evening, Harsh",
    events: [
      {
        time: "14:00",
        title: "Marketing review",
        meta: "Done",
        status: "past",
      },
      { time: "16:00", title: "Code review PRs", meta: "Done", status: "past" },
      { time: "18:30", title: "Dinner prep", meta: "Now", status: "active" },
      { time: "20:00", title: "Reading time", meta: "1 hr" },
      { time: "22:00", title: "Wind down", meta: "Sleep prep" },
    ],
  },
  emerald: {
    heading: "Wellness Wednesday",
    events: [
      {
        time: "6:30",
        title: "Yoga flow",
        meta: "30 min · Complete",
        status: "past",
      },
      {
        time: "7:15",
        title: "Healthy breakfast",
        meta: "Complete",
        status: "past",
      },
      {
        time: "10:00",
        title: "Walk in the park",
        meta: "Now · 20 min left",
        status: "active",
      },
      { time: "12:00", title: "Meditation", meta: "15 min" },
      { time: "18:00", title: "Stretch routine", meta: "20 min" },
    ],
  },
  amber: {
    heading: "Late night, Harsh",
    events: [
      {
        time: "19:00",
        title: "Investor pitch prep",
        meta: "Done",
        status: "past",
      },
      { time: "20:30", title: "Dinner", meta: "Done", status: "past" },
      {
        time: "22:00",
        title: "Reading — Tainted Cup",
        meta: "Now",
        status: "active",
      },
      { time: "23:00", title: "Lights out", meta: "Sleep" },
    ],
  },
  eink: {
    heading: "THU 12 MAR",
    events: [
      { time: "09:00", title: "Journal", meta: "Done", status: "past" },
      { time: "10:30", title: "Standup", meta: "Done", status: "past" },
      { time: "13:00", title: "Deep work", meta: "Now", status: "active" },
      { time: "15:00", title: "Factory call", meta: "Zoom" },
      { time: "17:00", title: "Walk", meta: "30m" },
    ],
  },
};

// ─── Timeline + Tasks ───────────────────────────────────────────
// Keyed as "subVariant/variant" e.g. "inline/light"
const inlineEvents: TimelineTasksData["events"] = [
  {
    time: "10:30",
    title: "Standup with eng",
    meta: "30 min · Complete",
    status: "past",
    type: "event",
  },
  {
    time: "",
    title: "Review KS backer email",
    meta: "Complete",
    status: "past",
    type: "task",
  },
  {
    time: "13:00",
    title: "Deep work block",
    meta: "Now · 47 min left",
    status: "active",
    type: "event",
  },
  {
    time: "",
    title: "Ship onboarding flow",
    meta: "During focus block",
    type: "task",
  },
  { time: "", title: "Fix push notif copy", meta: "Quick win", type: "task" },
  {
    time: "15:00",
    title: "Factory call — Shenzhen",
    meta: "45 min · Zoom",
    type: "event",
  },
];

const timelineTasks: Record<string, TimelineTasksData> = {
  "inline/light": {
    heading: "Thursday afternoon",
    subVariant: "inline",
    events: inlineEvents,
  },
  "inline/dark": {
    heading: "Thursday afternoon",
    subVariant: "inline",
    events: inlineEvents,
  },
  "pinned/light": {
    heading: "Good afternoon",
    subVariant: "pinned",
    events: [
      {
        time: "10:30",
        title: "Standup",
        meta: "Done",
        status: "past",
        type: "event",
      },
      {
        time: "13:00",
        title: "Deep work block",
        meta: "Now",
        status: "active",
        type: "event",
      },
      { time: "15:00", title: "Factory call", meta: "Zoom", type: "event" },
    ],
    taskBlock: {
      title: "Tasks",
      count: "3 / 5",
      tasks: [
        { text: "Review backer email", done: true },
        { text: "Update App Store copy", done: true },
        { text: "Merge onboarding PR", done: true },
        { text: "Ship push notif flow", done: false },
        { text: "Write influencer brief", done: false },
      ],
    },
  },
  "pinned/dark": {
    heading: "Your evening",
    subVariant: "pinned",
    events: [
      {
        time: "16:00",
        title: "Code review",
        meta: "Done",
        status: "past",
        type: "event",
      },
      {
        time: "18:30",
        title: "Dinner",
        meta: "Now",
        status: "active",
        type: "event",
      },
      { time: "20:00", title: "Reading", meta: "1 hr", type: "event" },
    ],
    taskBlock: {
      title: "Remaining",
      count: "2 left",
      tasks: [
        { text: "Prep factory QC checklist", done: false },
        { text: "Reply to investor email", done: false },
      ],
    },
  },
  "nested/light": {
    heading: "Thursday, focused",
    subVariant: "nested",
    events: [
      {
        time: "10:30",
        title: "Standup",
        meta: "Done",
        status: "past",
        type: "event",
      },
      {
        time: "13:00",
        title: "Deep work block",
        meta: "Now · 47 min left",
        status: "active",
        type: "event",
        subtasks: [
          { text: "Merge onboarding PR", done: true },
          { text: "Ship push notif flow", done: false },
          { text: "Fix tutorial page 3", done: false },
        ],
      },
      {
        time: "15:00",
        title: "Factory call — Shenzhen",
        meta: "45 min · Zoom",
        type: "event",
        subtasks: [
          { text: "Review QC photos", done: false },
          { text: "Confirm trial run date", done: false },
        ],
      },
      { time: "17:00", title: "Evening walk", meta: "30 min", type: "event" },
    ],
  },
  "nested/dark": {
    heading: "Thursday, focused",
    subVariant: "nested",
    events: [
      {
        time: "10:30",
        title: "Standup",
        meta: "Done",
        status: "past",
        type: "event",
      },
      {
        time: "13:00",
        title: "Deep work block",
        meta: "Now · 47 min left",
        status: "active",
        type: "event",
        subtasks: [
          { text: "Merge onboarding PR", done: true },
          { text: "Ship push notif flow", done: false },
          { text: "Fix tutorial page 3", done: false },
        ],
      },
      {
        time: "15:00",
        title: "Factory call — Shenzhen",
        meta: "45 min · Zoom",
        type: "event",
        subtasks: [
          { text: "Review QC photos", done: false },
          { text: "Confirm trial run date", done: false },
        ],
      },
      { time: "17:00", title: "Evening walk", meta: "30 min", type: "event" },
    ],
  },
  "floating/light": {
    heading: "Good afternoon",
    subVariant: "floating",
    events: [
      {
        time: "10:30",
        title: "Standup",
        meta: "Done",
        status: "past",
        type: "event",
      },
      {
        time: "13:00",
        title: "Deep work block",
        meta: "Now",
        status: "active",
        type: "event",
      },
      { time: "15:00", title: "Factory call", meta: "Zoom", type: "event" },
    ],
    floatingTask: {
      icon: "→",
      label: "Up Next Task",
      title: "Ship onboarding flow",
      sub: "Highest priority · During focus block",
    },
  },
  "floating/dark": {
    heading: "Your afternoon",
    subVariant: "floating",
    events: [
      {
        time: "10:30",
        title: "Standup",
        meta: "Done",
        status: "past",
        type: "event",
      },
      {
        time: "13:00",
        title: "Deep work block",
        meta: "Now",
        status: "active",
        type: "event",
      },
      { time: "15:00", title: "Factory call", meta: "Zoom", type: "event" },
    ],
    floatingTask: {
      icon: "→",
      label: "Up Next Task",
      title: "Ship onboarding flow",
      sub: "Highest priority · During focus block",
    },
  },
  "progress/light": {
    heading: "Thursday",
    subVariant: "progress",
    events: [
      {
        time: "10:30",
        title: "Standup",
        meta: "Done",
        status: "past",
        type: "event",
      },
      {
        time: "13:00",
        title: "Deep work block",
        meta: "Now · 47 min left",
        status: "active",
        type: "event",
      },
      {
        time: "15:00",
        title: "Factory call — Shenzhen",
        meta: "45 min",
        type: "event",
      },
      { time: "17:00", title: "Evening walk", meta: "30 min", type: "event" },
    ],
    progressHeader: {
      greeting: "Thursday",
      fraction: "3 of 7 tasks",
      percent: 43,
    },
  },
  "progress/dark": {
    heading: "Thursday",
    subVariant: "progress",
    events: [
      {
        time: "14:00",
        title: "Marketing review",
        meta: "Done",
        status: "past",
        type: "event",
      },
      {
        time: "18:30",
        title: "Dinner prep",
        meta: "Now",
        status: "active",
        type: "event",
      },
      { time: "20:00", title: "Reading time", meta: "1 hr", type: "event" },
      { time: "22:00", title: "Wind down", meta: "Sleep", type: "event" },
    ],
    progressHeader: {
      greeting: "Thursday",
      fraction: "5 of 7 tasks",
      percent: 71,
    },
  },
};

// ─── Minimalist Stack ───────────────────────────────────────────
const minimalistStack: Record<string, MinimalistStackData> = {
  light: {
    top: "Wednesday · Focus Day",
    mid: "Ship the onboarding flow today.",
    bot: "3 tasks remaining — you've got this",
  },
  dark: {
    top: "Evening · Wind Down",
    mid: "Tomorrow starts with a clean slate.",
    bot: "All tasks complete — rest well",
  },
  editorial: {
    top: "Thursday · Deep Work",
    mid: "Build something that matters today.",
    bot: "Two focus blocks scheduled — stay in the zone",
  },
  ink: {
    top: "Late Evening · Reflect",
    mid: "You moved the needle forward today.",
    bot: "Four tasks completed — well done",
  },
  brutal: {
    top: "Monday · Sprint Start",
    mid: "STOP PLANNING. START SHIPPING.",
    bot: "0 of 5 tasks done. Clock is ticking.",
  },
  neon: {
    top: "Friday · Ship Day",
    mid: "Push the release. You're ready.",
    bot: "All checks passing — deploy with confidence",
  },
  eink: {
    top: "THU 12 MAR · Focus",
    mid: "Deep work block until 15:00",
    bot: "3 tasks queued — factory call at 15:00",
  },
};

// ─── Progress Ring ──────────────────────────────────────────────
const progressRing: Record<string, ProgressRingData> = {
  dark: { percent: 65, label: "Day complete" },
  light: { percent: 80, label: "Day complete" },
};

// ─── Companion Quote ────────────────────────────────────────────
const companionQuote: Record<string, CompanionQuoteData> = {
  warm: {
    text: "You don't have to finish everything — just keep the thread going.",
    from: "Peek · Your afternoon nudge",
  },
  frost: {
    text: "The hardest part was starting. You already did that today.",
    from: "Peek · Evening reflection",
  },
};

// ─── Streak Flame ───────────────────────────────────────────────
const streakFlame: Record<string, StreakFlameData> = {
  fire: { flame: "🔥", num: 12, label: "Day streak" },
  cool: { flame: "⚡", num: 30, label: "Day streak" },
};

// ─── Daily Score ────────────────────────────────────────────────
const dailyScore: Record<string, DailyScoreData> = {
  dark: {
    score: 78,
    title: "Today's Score",
    bars: [
      { label: "Tasks", percent: 71, color: "var(--accent)" },
      { label: "Focus", percent: 85, color: "#0d7df2" },
      { label: "Move", percent: 60, color: "#f59e0b" },
    ],
  },
  light: {
    score: 92,
    title: "Today's Score",
    bars: [
      { label: "Tasks", percent: 100, color: "#0d7df2" },
      { label: "Focus", percent: 90, color: "#16a34a" },
      { label: "Move", percent: 78, color: "#f59e0b" },
    ],
  },
};

// ─── Per-variant lookup ─────────────────────────────────────────
const VARIANT_DATA: Record<LayoutType, Record<string, WidgetData>> = {
  "contextual-hero": contextualHero,
  "bento-box": bentoBox,
  timeline: timeline,
  "timeline-tasks": timelineTasks,
  "minimalist-stack": minimalistStack,
  "progress-ring": progressRing,
  "companion-quote": companionQuote,
  "streak-flame": streakFlame,
  "daily-score": dailyScore,
};

/**
 * Get mock data for a layout + variant. For timeline-tasks, variant
 * can be "subVariant/theme" (e.g. "inline/light") or just "light"
 * which defaults to the first available sub-variant match.
 */
export function getMockData(
  layout: LayoutType,
  variant: string,
): WidgetData | undefined {
  const variants = VARIANT_DATA[layout];
  if (!variants) return undefined;

  // Direct match (works for most layouts + "subVariant/theme" keys)
  if (variants[variant]) return variants[variant];

  // For timeline-tasks: if just "light" or "dark" is passed, find first matching
  if (layout === "timeline-tasks") {
    for (const key of Object.keys(variants)) {
      if (key.endsWith(`/${variant}`)) return variants[key];
    }
  }

  // Fallback: first available
  const keys = Object.keys(variants);
  return keys.length > 0 ? variants[keys[0]] : undefined;
}

/** Flat default data (first variant per layout) — for backward compat */
export const MOCK_DATA: Record<LayoutType, WidgetData> = Object.fromEntries(
  Object.entries(VARIANT_DATA).map(([layout, variants]) => {
    const firstKey = Object.keys(variants)[0];
    return [layout, variants[firstKey]];
  }),
) as Record<LayoutType, WidgetData>;
