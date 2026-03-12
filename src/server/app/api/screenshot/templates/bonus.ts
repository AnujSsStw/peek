import type {
  ProgressRingData,
  CompanionQuoteData,
  StreakFlameData,
  DailyScoreData,
} from "../types";
import { esc } from "./utils";

const RING_CIRCUMFERENCE = 408; // 2 * π * 65

export function renderProgressRing(
  variant: string,
  data: ProgressRingData,
): string {
  const v = variant === "light" ? "light" : "dark";
  const offset = RING_CIRCUMFERENCE - (RING_CIRCUMFERENCE * data.percent) / 100;
  return `<div class="wc-ring wc-ring-${v}">
  <svg viewBox="0 0 140 140"><circle class="ring-bg" cx="70" cy="70" r="65"/><circle class="ring-fg" cx="70" cy="70" r="65" style="stroke-dashoffset:${Math.round(offset)};"/></svg>
  <div class="ring-center"><div class="ring-pct">${data.percent}%</div><div class="ring-label">${esc(data.label)}</div></div>
</div>`;
}

export function renderCompanionQuote(
  variant: string,
  data: CompanionQuoteData,
): string {
  const v = variant === "frost" ? "frost" : "warm";
  return `<div class="wc-quote wc-quote-${v}">
  <div class="q-mark">\u201C</div>
  <div class="q-text">${esc(data.text)}</div>
  <div class="q-from">${esc(data.from)}</div>
</div>`;
}

export function renderStreakFlame(
  variant: string,
  data: StreakFlameData,
): string {
  const v = variant === "cool" ? "cool" : "fire";
  return `<div class="wc-streak wc-streak-${v}">
  <div class="flame">${esc(data.flame)}</div>
  <div class="streak-num">${data.num}</div>
  <div class="streak-lab">${esc(data.label)}</div>
</div>`;
}

export function renderDailyScore(
  variant: string,
  data: DailyScoreData,
): string {
  const v = variant === "light" ? "light" : "dark";
  const bars = data.bars
    .map(
      (b) =>
        `<div class="wc-score-bar"><div class="wc-score-bar-label">${esc(b.label)}</div><div class="wc-score-bar-track"><div class="wc-score-bar-fill" style="width:${b.percent}%; background:${esc(b.color)};"></div></div></div>`,
    )
    .join("\n      ");
  return `<div class="wc-score wc-score-${v}">
  <div class="wc-score-number">${data.score}</div>
  <div class="wc-score-details">
    <div class="wc-score-title">${esc(data.title)}</div>
    <div class="wc-score-bars">
      ${bars}
    </div>
  </div>
</div>`;
}
