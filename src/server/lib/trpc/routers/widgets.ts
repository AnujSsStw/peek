import type { LayoutType } from "../../../app/api/screenshot/types";
import { createTRPCRouter, publicProcedure } from "../trpc";

const widgetLayouts = [
  "contextual-hero",
  "bento-box",
  "timeline",
  "timeline-tasks",
  "minimalist-stack",
  "progress-ring",
  "companion-quote",
  "streak-flame",
  "daily-score",
] satisfies LayoutType[];

export const widgetsRouter = createTRPCRouter({
  layouts: publicProcedure.query(() =>
    widgetLayouts.map((id) => ({
      id,
      label: id
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
    })),
  ),
});
