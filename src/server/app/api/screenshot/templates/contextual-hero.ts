import type { ContextualHeroData } from "../types";
import { esc } from "./utils";

const VARIANTS = [
  "morning",
  "urgent",
  "night",
  "focus",
  "alert",
  "calm",
  "weather",
  "energy",
  "eink",
] as const;

export function renderContextualHero(
  variant: string,
  data: ContextualHeroData,
): string {
  const v = VARIANTS.includes(variant as (typeof VARIANTS)[number])
    ? variant
    : VARIANTS[0];
  return `<div class="w1 w1-${v}">
  <div class="icon">${esc(data.icon)}</div>
  <div class="val">${esc(data.val)}</div>
  <div class="sub">${esc(data.sub)}</div>
</div>`;
}
