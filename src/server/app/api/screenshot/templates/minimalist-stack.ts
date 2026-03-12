import type { MinimalistStackData } from "../types";
import { esc } from "./utils";

const VARIANTS = [
  "light",
  "dark",
  "editorial",
  "ink",
  "brutal",
  "neon",
  "eink",
] as const;

export function renderMinimalistStack(
  variant: string,
  data: MinimalistStackData,
): string {
  const v = VARIANTS.includes(variant as (typeof VARIANTS)[number])
    ? variant
    : VARIANTS[0];
  return `<div class="w4 w4-${v}">
  <div class="top">${esc(data.top)}</div>
  <div class="mid">${esc(data.mid)}</div>
  <div class="bot">${esc(data.bot)}</div>
</div>`;
}
