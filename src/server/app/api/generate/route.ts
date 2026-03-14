import { NextResponse } from "next/server";
import type { LayoutType } from "../screenshot/types";
import { renderScreenshot } from "../screenshot/render-screenshot";
import { getCalendarData } from "./calendar";
import { getWeather } from "./weather";
import { generateWidgetData } from "./ai";
import { auth } from "@/lib/auth";
import { UTApi, UTFile } from "uploadthing/server";

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
    location?: string; // e.g. "lat,lng" or "auto:ip"
    timezone?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { width, height, layout, date, currentTime, timezone, location } = body;
  console.log("Generation request received with parameters:", {
    width,
    height,
    layout,
    date,
    currentTime,
    timezone,
    location,
  });

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
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const [calendar, weather] = await Promise.all([
      getCalendarData(session.user.id, timezone || "UTC"),
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

    // const variant = getRandomVariant(layout as LayoutType);
    // const widgetData = getMockData(layout as LayoutType, variant)!;
    // const buf = await renderScreenshot({
    //   width,
    //   height,
    //   layout: layout as LayoutType,
    //   variant,
    //   data: widgetData,
    // });

    const utapi = new UTApi();
    const file = new UTFile(
      [new Uint8Array(buf)],
      `widget-${layout}-${width}x${height}-${Date.now()}.png`,
      { type: "image/png" },
    );
    const uploaded = await utapi.uploadFiles(file);

    if (!uploaded.data?.ufsUrl) {
      return NextResponse.json(
        { error: "Failed to upload widget image" },
        { status: 500 },
      );
    }

    console.log("Widget generated and uploaded:", {
      imageUrl: uploaded.data.ufsUrl,
    });

    return NextResponse.json({ url: uploaded.data.ufsUrl });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown generation error";
    console.error("Generation error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
