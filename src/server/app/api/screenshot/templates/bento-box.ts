import type { BentoBoxData } from "../types";
import { esc } from "./utils";

const VARIANTS = [
  "frost",
  "cream",
  "charcoal",
  "ocean",
  "neon",
  "eink",
] as const;

export function renderBentoBox(variant: string, data: BentoBoxData): string {
  const v = VARIANTS.includes(variant as (typeof VARIANTS)[number])
    ? variant
    : VARIANTS[0];
  const cells = data.cells
    .map(
      (c) =>
        `<div class="cell"><div><div class="cell-icon" style="background:${esc(c.iconBg)}">${esc(c.icon)}</div><div class="cell-head">${esc(c.head)}</div></div><div class="cell-val">${esc(c.val)}</div></div>`,
    )
    .join("\n        ");
  return `<div class="w2 w2-${v}">
        ${cells}
      </div>`;
}
