export type LayoutType =
  | "contextual-hero"
  | "bento-box"
  | "timeline"
  | "timeline-tasks"
  | "minimalist-stack"
  | "progress-ring"
  | "companion-quote"
  | "streak-flame"
  | "daily-score";

export interface ContextualHeroData {
  icon: string;
  val: string;
  sub: string;
}

export interface BentoBoxCell {
  icon: string;
  iconBg: string;
  head: string;
  val: string;
}

export interface BentoBoxData {
  cells: [BentoBoxCell, BentoBoxCell, BentoBoxCell, BentoBoxCell];
}

export interface TimelineEvent {
  time: string;
  title: string;
  meta: string;
  status?: "past" | "active";
}

export interface TimelineData {
  heading: string;
  events: TimelineEvent[];
}

export interface TaskItem {
  text: string;
  done: boolean;
}

export interface SubTask {
  text: string;
  done: boolean;
}

export interface TimelineTaskEvent extends TimelineEvent {
  type?: "event" | "task";
  subtasks?: SubTask[];
}

export interface FloatingTask {
  icon: string;
  label: string;
  title: string;
  sub: string;
}

export interface ProgressHeader {
  greeting: string;
  fraction: string;
  percent: number;
}

export interface TimelineTasksData {
  heading: string;
  events: TimelineTaskEvent[];
  subVariant?: "inline" | "pinned" | "nested" | "floating" | "progress";
  taskBlock?: {
    title: string;
    count: string;
    tasks: TaskItem[];
  };
  floatingTask?: FloatingTask;
  progressHeader?: ProgressHeader;
}

export interface MinimalistStackData {
  top: string;
  mid: string;
  bot: string;
}

export interface ProgressRingData {
  percent: number;
  label: string;
}

export interface CompanionQuoteData {
  text: string;
  from: string;
}

export interface StreakFlameData {
  flame: string;
  num: number;
  label: string;
}

export interface ScoreBar {
  label: string;
  percent: number;
  color: string;
}

export interface DailyScoreData {
  score: number;
  title: string;
  bars: ScoreBar[];
}

export type WidgetData =
  | ContextualHeroData
  | BentoBoxData
  | TimelineData
  | TimelineTasksData
  | MinimalistStackData
  | ProgressRingData
  | CompanionQuoteData
  | StreakFlameData
  | DailyScoreData;

export interface ScreenshotRequestBody {
  width: number;
  height: number;
  layout: LayoutType;
  variant: string;
  data?: WidgetData;
  useMockData?: boolean;
  /** Device scale factor (default 3). Higher = crisper. Max 4. */
  scale?: number;
}
