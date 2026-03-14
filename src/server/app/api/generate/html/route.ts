import { NextResponse } from "next/server";
import type { LayoutType } from "../../screenshot/types";
import { renderWidget } from "../../screenshot/templates";
import { getCalendarData } from "../calendar";
import { getWeather } from "../weather";
import { generateWidgetData } from "../ai";
import { auth } from "@/lib/auth";

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
    layout?: string;
    date?: string;
    currentTime?: string;
    location?: string;
    timezone?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { layout, date, currentTime, timezone, location } = body;

  if (!layout || !VALID_LAYOUTS.has(layout)) {
    return NextResponse.json(
      { error: `Invalid layout. Must be one of: ${[...VALID_LAYOUTS].join(", ")}` },
      { status: 400 },
    );
  }
  if (!date || typeof date !== "string") {
    return NextResponse.json({ error: "date is required" }, { status: 400 });
  }
  if (!currentTime || typeof currentTime !== "string") {
    return NextResponse.json({ error: "currentTime is required" }, { status: 400 });
  }

  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
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

    // For timeline-tasks, variant may be "subVariant/theme" — extract theme for renderer
    const renderVariant =
      layout === "timeline-tasks" && variant.includes("/")
        ? variant.split("/")[1]
        : variant;

    const html = renderWidget(layout as LayoutType, renderVariant, data as any);

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown generation error";
    console.error("HTML generation error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
