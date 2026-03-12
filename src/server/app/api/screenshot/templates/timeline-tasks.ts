import type { TimelineTasksData, TimelineTaskEvent } from "../types";
import { esc } from "./utils";

const VARIANTS = ["light", "dark"] as const;

function resolveVariant(variant: string): string {
  return VARIANTS.includes(variant as (typeof VARIANTS)[number])
    ? variant
    : VARIANTS[0];
}

function renderRow(
  ev: TimelineTaskEvent,
  isLast: boolean,
  subVariant?: string,
): string {
  const isTask = ev.type === "task";
  const isDone = ev.status === "past";
  const rowClasses = [
    "w3-row",
    isDone ? "is-past" : ev.status === "active" ? "is-active" : "",
    isTask ? "is-task" : "",
    isTask && isDone ? "is-done" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const dotClasses = [
    "w3-dot",
    isTask ? "task-dot" : "",
    isDone && isTask
      ? "done"
      : isDone
        ? "past"
        : ev.status === "active"
          ? "active"
          : "",
  ]
    .filter(Boolean)
    .join(" ");

  const line = isLast ? "" : `<div class="w3-line"></div>`;

  const tagType = isTask ? "tag-task" : "";
  const tagLabel = isTask ? "task" : "event";
  const tag =
    subVariant === "inline"
      ? ` <span class="w3-tag ${tagType}">${tagLabel}</span>`
      : "";

  let subtasksHtml = "";
  if (subVariant === "nested" && ev.subtasks?.length) {
    const items = ev.subtasks
      .map(
        (st) =>
          `<div class="w3-subtask"><div class="w3-subtask-check${st.done ? " checked" : ""}">${st.done ? "✓" : ""}</div><div class="w3-subtask-text${st.done ? " done" : ""}">${esc(st.text)}</div></div>`,
      )
      .join("");
    subtasksHtml = `<div class="w3-subtasks">${items}</div>`;
  }

  return `<div class="${rowClasses}"><div class="w3-gut"><div class="w3-time">${esc(ev.time)}</div><div class="${dotClasses}"></div>${line}</div><div class="w3-body"><div class="w3-ev">${esc(ev.title)}${tag}</div><div class="w3-meta">${esc(ev.meta)}</div>${subtasksHtml}</div></div>`;
}

export function renderTimelineTasks(
  variant: string,
  data: TimelineTasksData,
): string {
  const v = resolveVariant(variant);
  const sub = data.subVariant ?? "inline";
  const listStyle = sub === "floating" ? ' style="flex:0;"' : "";

  const rows = data.events
    .map((ev, i) => renderRow(ev, i === data.events.length - 1, sub))
    .join("\n          ");

  let extra = "";

  if (sub === "pinned" && data.taskBlock) {
    const tb = data.taskBlock;
    const items = tb.tasks
      .map(
        (t) =>
          `<div class="w3-task-item"><div class="w3-task-check${t.done ? " checked" : ""}">${t.done ? "✓" : ""}</div><div class="w3-task-text${t.done ? " done" : ""}">${esc(t.text)}</div></div>`,
      )
      .join("");
    extra = `<div class="w3-task-block">
          <div class="w3-task-block-head">
            <div class="w3-task-block-title">${esc(tb.title)}</div>
            <div class="w3-task-block-count">${esc(tb.count)}</div>
          </div>
          ${items}
        </div>`;
  }

  if (sub === "floating" && data.floatingTask) {
    const ft = data.floatingTask;
    extra = `<div class="w3-float-task">
          <div class="w3-float-icon">${esc(ft.icon)}</div>
          <div class="w3-float-content">
            <div class="w3-float-label">${esc(ft.label)}</div>
            <div class="w3-float-title">${esc(ft.title)}</div>
            <div class="w3-float-sub">${esc(ft.sub)}</div>
          </div>
        </div>`;
  }

  let headHtml: string;
  if (sub === "progress" && data.progressHeader) {
    const ph = data.progressHeader;
    headHtml = `<div class="w3-progress-head">
          <div class="w3-progress-top">
            <div class="w3-progress-greeting">${esc(ph.greeting)}</div>
            <div class="w3-progress-fraction">${esc(ph.fraction)}</div>
          </div>
          <div class="w3-progress-track"><div class="w3-progress-fill" style="width:${ph.percent}%;"></div></div>
        </div>`;
  } else {
    headHtml = `<div class="w3-head">${esc(data.heading)}</div>`;
  }

  return `<div class="w3 w3-${v}">
        ${headHtml}
        <div class="w3-list"${listStyle}>
          ${rows}
        </div>
        ${extra}
      </div>`;
}
