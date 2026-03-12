import { NextResponse } from "next/server";
import type { LayoutType } from "../screenshot/types";
import { renderScreenshot } from "../screenshot/render-screenshot";
import { getMockCalendarData } from "./calendar";
import { getWeather } from "./weather";
import { generateWidgetData } from "./ai";

const VALID_LAYOUTS: Set<string> = new Set<string>([
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

export async function POST(request: Request) {
  let body: {
    width?: number;
    height?: number;
    layout?: string;
    date?: string; // e.g. "Thursday, March 13"
    currentTime?: string; // e.g. "13:42" or "1:42 PM"
    location?: string; //TODO: will be db call
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { width, height, layout, date, currentTime, location } = body;

  // Validate dimensions
  if (
    typeof width !== "number" ||
    typeof height !== "number" ||
    width < 10 ||
    width > 1920 ||
    height < 10 ||
    height > 1920
  ) {
    return NextResponse.json(
      { error: "width and height must be numbers between 10 and 1920" },
      { status: 400 },
    );
  }

  // Validate layout
  if (!layout || !VALID_LAYOUTS.has(layout)) {
    return NextResponse.json(
      {
        error: `Invalid layout. Must be one of: ${[...VALID_LAYOUTS].join(", ")}`,
      },
      { status: 400 },
    );
  }

  // Validate client-provided date and time
  if (!date || typeof date !== "string") {
    return NextResponse.json(
      { error: "date is required (e.g. 'Thursday, March 13')" },
      { status: 400 },
    );
  }
  if (!currentTime || typeof currentTime !== "string") {
    return NextResponse.json(
      { error: "currentTime is required (e.g. '13:42')" },
      { status: 400 },
    );
  }

  try {
    const [calendar, weather] = await Promise.all([
      Promise.resolve(getMockCalendarData()),
      getWeather(location || "auto:ip"),
    ]);

    const { variant, data } = await generateWidgetData(layout as LayoutType, {
      calendar,
      weather,
      date,
      currentTime,
    });

    const buf = await renderScreenshot({
      width,
      height,
      layout: layout as LayoutType,
      variant,
      data: data as any,
    });

    // @ts-ignore
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown generation error";
    console.error("Generation error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
