import type { LayoutType, WidgetData } from "../types";
import { buildFullHtml } from "./html";
import { renderContextualHero } from "./contextual-hero";
import { renderBentoBox } from "./bento-box";
import { renderTimeline } from "./timeline";
import { renderTimelineTasks } from "./timeline-tasks";
import { renderMinimalistStack } from "./minimalist-stack";
import {
  renderProgressRing,
  renderCompanionQuote,
  renderStreakFlame,
  renderDailyScore,
} from "./bonus";

type RenderFn = (variant: string, data: WidgetData) => string;

const RENDERERS: Record<LayoutType, RenderFn> = {
  "contextual-hero": renderContextualHero as RenderFn,
  "bento-box": renderBentoBox as RenderFn,
  timeline: renderTimeline as RenderFn,
  "timeline-tasks": renderTimelineTasks as RenderFn,
  "minimalist-stack": renderMinimalistStack as RenderFn,
  "progress-ring": renderProgressRing as RenderFn,
  "companion-quote": renderCompanionQuote as RenderFn,
  "streak-flame": renderStreakFlame as RenderFn,
  "daily-score": renderDailyScore as RenderFn,
};

export function renderWidget(
  layout: LayoutType,
  variant: string,
  data: WidgetData,
): string {
  const render = RENDERERS[layout];
  if (!render) {
    throw new Error(`Unknown layout: ${layout}`);
  }
  const body = render(variant, data);
  return buildFullHtml(body);
}
