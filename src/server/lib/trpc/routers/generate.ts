import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import type { LayoutType } from "@/app/api/screenshot/types";
import { renderWidget } from "@/app/api/screenshot/templates";
import { getCalendarData } from "@/app/api/generate/calendar";
import { getWeather } from "@/app/api/generate/weather";
import { generateBatchWidgetData } from "@/app/api/generate/ai";

const VALID_LAYOUTS = new Set([
  "contextual-hero",
  "bento-box",
  "timeline",
  "timeline-tasks",
  "minimalist-stack",
  "progress-ring",
  "companion-quote",
  "streak-flame",
  "daily-score",
]);

export const generateRouter = createTRPCRouter({
  batchHtml: protectedProcedure
    .input(
      z.object({
        layouts: z
          .array(z.string())
          .min(1)
          .max(9)
          .refine((arr) => arr.every((l) => VALID_LAYOUTS.has(l)), {
            message: "Invalid layout in request",
          }),
        date: z.string(),
        currentTime: z.string(),
        timezone: z.string().optional(),
        location: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { layouts, date, currentTime, timezone, location } = input;
      const userId = ctx.session.user.id;

      const [calendar, weather] = await Promise.all([
        getCalendarData(userId, timezone || "UTC"),
        getWeather(location || "auto:ip"),
      ]);

      // Deduplicate layouts — one AI call for unique layouts
      const uniqueLayouts = [...new Set(layouts)] as LayoutType[];

      const batchResults = await generateBatchWidgetData(uniqueLayouts, {
        calendar,
        weather,
        date,
        currentTime,
      });

      // Render HTML for each requested layout
      const results: Record<string, string> = {};
      for (const layout of layouts) {
        const result = batchResults[layout];
        if (!result) continue;

        const renderVariant =
          layout === "timeline-tasks" && result.variant.includes("/")
            ? result.variant.split("/")[1]
            : result.variant;

        results[layout] = renderWidget(
          layout as LayoutType,
          renderVariant,
          result.data as any,
        );
      }

      return results;
    }),
});
