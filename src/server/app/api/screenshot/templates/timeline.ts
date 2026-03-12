import type { TimelineData, TimelineEvent } from "../types";
import { esc } from "./utils";

const VARIANTS = ["light", "dark", "emerald", "amber", "eink"] as const;

function renderRow(ev: TimelineEvent, isLast: boolean): string {
  const rowClass =
    ev.status === "past"
      ? " is-past"
      : ev.status === "active"
        ? " is-active"
        : "";
  const dotClass =
    ev.status === "past" ? " past" : ev.status === "active" ? " active" : "";
  const line = isLast ? "" : `<div class="w3-line"></div>`;
  return `<div class="w3-row${rowClass}"><div class="w3-gut"><div class="w3-time">${esc(ev.time)}</div><div class="w3-dot${dotClass}"></div>${line}</div><div class="w3-body"><div class="w3-ev">${esc(ev.title)}</div><div class="w3-meta">${esc(ev.meta)}</div></div></div>`;
}

export function renderTimeline(variant: string, data: TimelineData): string {
  const v = VARIANTS.includes(variant as (typeof VARIANTS)[number])
    ? variant
    : VARIANTS[0];
  const rows = data.events
    .map((ev, i) => renderRow(ev, i === data.events.length - 1))
    .join("\n          ");
  return `<div class="w3 w3-${v}">
        <div class="w3-head">${esc(data.heading)}</div>
        <div class="w3-list">
          ${rows}
        </div>
      </div>`;
}
