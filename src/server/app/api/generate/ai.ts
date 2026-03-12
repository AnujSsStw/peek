import { generateObject, generateText, Output } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import type { LayoutType } from "../screenshot/types";
import type { CalendarData } from "./calendar";
import type { WeatherData } from "./weather";
import { getSchemaForLayout } from "./schemas";

const openai = createOpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY,
});

export interface GenerateContext {
  calendar: CalendarData;
  weather: WeatherData;
  date: string;
  currentTime: string;
}

const LAYOUT_PROMPTS: Record<LayoutType, string> = {
  "contextual-hero": `You are generating data for a "Contextual Hero" widget — a single large icon + value + subtitle.
Variants and when to use them:
- morning: before noon, general greeting
- urgent: event starting in <10 minutes
- night: after 20:00
- focus: during a focus/deep-work block
- alert: event already started or overdue
- calm: no upcoming events, relaxed schedule
- weather: weather is notable or user is outdoors
- energy: energy level is relevant context
- eink: grayscale minimal display
Pick the variant that best matches the current calendar context.
Data shape: { icon (single emoji), val (max 6 chars — time, countdown, %), sub (max 20 chars — context phrase) }`,

  "bento-box": `You are generating data for a "Bento Box" widget — a 2×2 grid of info cells.
Variants: frost (glass/blue), cream (warm/light), charcoal (dark), ocean (deep blue), neon (cyber green on black), eink (grayscale).
Pick variant based on time-of-day and mood: light themes for daytime, dark for evening, neon for late night, eink for minimal.
Each cell: { icon (emoji), iconBg (rgba CSS color), head (category label ≤10 chars), val (value ≤15 chars) }.
Recommended cell order: 1) Next event, 2) Focus/time remaining, 3) Streak, 4) Tasks progress.`,

  timeline: `You are generating data for a "Timeline" widget — a vertical list of today's events.
Variants: light (daytime), dark (evening), emerald (wellness/nature), amber (late night), eink (grayscale).
Pick variant based on time-of-day and schedule mood.
Data: heading (≤30 chars), events (3-5 items, chronological). Each event: time (HH:MM), title (≤25 chars), meta (≤20 chars), status ('past'|'active'|omit).
Mark completed events as 'past', the current one as 'active', and leave future ones without status.`,

  "timeline-tasks": `You are generating data for a "Timeline + Tasks" widget — events with integrated task tracking.
Variant format: "subVariant/theme" where theme is light or dark.
SubVariants and when to use:
- inline: tasks mixed directly into the timeline (best when tasks relate to specific time slots)
- pinned: separate task block below timeline (best for a clear task list)
- nested: subtasks nested under events (best when tasks belong to specific events)
- floating: single floating priority task card (best when one task dominates)
- progress: progress bar header showing completion (best for task-heavy days)
Pick theme: light for daytime, dark for evening.
Important: set subVariant field to match the chosen sub-variant. Only populate taskBlock for pinned, floatingTask for floating, progressHeader for progress, and subtasks for nested.`,

  "minimalist-stack": `You are generating data for a "Minimalist Stack" widget — three lines of text stacked vertically.
Variants: light (clean day), dark (evening), editorial (refined), ink (reflective), brutal (bold/urgent), neon (cyber), eink (grayscale).
Pick variant based on energy and time: brutal for urgency, editorial for calm productivity, neon for late night.
Data: top (≤30 chars, day + context), mid (≤40 chars, main message), bot (≤40 chars, supporting detail).
Write concise, motivational-but-not-cheesy copy based on the calendar context.`,

  "progress-ring": `You are generating data for a "Progress Ring" widget — a circular progress indicator.
Variants: dark, light. Pick based on time-of-day.
Data: percent (0-100, based on task completion ratio), label (≤15 chars, e.g. "Day complete").
Calculate percent from tasks done vs total.`,

  "companion-quote": `You are generating data for a "Companion Quote" widget — an encouraging message.
Variants: warm (afternoon/encouraging), frost (evening/reflective).
Data: text (≤70 chars, gentle motivational quote relevant to the day's progress), from (≤30 chars, attribution like "Peek · Your afternoon nudge").
Write original, non-cliché encouragement based on what the user accomplished today.`,

  "streak-flame": `You are generating data for a "Streak Flame" widget — a streak counter with emoji.
Variants: fire (🔥, warm/achievement), cool (⚡, electric/momentum).
Pick fire for milestone streaks, cool for building momentum.
Data: flame (emoji matching variant), num (streak count from calendar), label (≤15 chars, e.g. "Day streak").`,

  "daily-score": `You are generating data for a "Daily Score" widget — an overall score with 3 category bars.
Variants: dark, light. Pick based on time-of-day.
Data: score (0-100, weighted average of the 3 bars), title (≤20 chars, e.g. "Today's Score"), bars (exactly 3).
Bars: Tasks (from completion ratio), Focus (from focus time usage), Move (estimate from schedule activity).
Each bar: label (≤10 chars), percent (0-100), color (CSS hex color).`,
};

export async function generateWidgetData(
  layout: LayoutType,
  ctx: GenerateContext,
): Promise<{ variant: string; data: Record<string, unknown> }> {
  const schema = getSchemaForLayout(layout);
  const systemPrompt = LAYOUT_PROMPTS[layout];
  const { calendar, weather, date, currentTime } = ctx;

  const userPrompt = `Here is today's context. Pick the best variant and generate widget data.

Date: ${date}
Current time: ${currentTime}

Events:
${calendar.events.map((e) => `- ${e.startTime}-${e.endTime}: ${e.title} [${e.status}]${e.location ? ` (${e.location})` : ""}`).join("\n")}

Tasks (${calendar.tasks.filter((t) => t.done).length}/${calendar.tasks.length} done):
${calendar.tasks.map((t) => `- [${t.done ? "x" : " "}] ${t.title} (${t.priority})`).join("\n")}

Weather: ${weather.icon} ${weather.temp_c}°C ${weather.condition}`;

  const result = await generateText({
    model: openai("gpt-4o-mini"),
    system: systemPrompt,
    prompt: userPrompt,
    output: Output.object({ schema }),
  });

  const object = (result as any).object as {
    variant: string;
    data: Record<string, unknown>;
  };
  return { variant: object.variant, data: object.data };
}
