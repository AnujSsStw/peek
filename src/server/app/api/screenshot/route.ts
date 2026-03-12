import { NextResponse } from "next/server";
import type { LayoutType, ScreenshotRequestBody } from "./types";
import { renderWidget } from "./templates";
import { getMockData } from "./templates/mock-data";
import { getBrowser } from "./browser";

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
  let body: ScreenshotRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { width, height, layout, variant, data, useMockData } = body;

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

  // Validate variant
  if (!variant || typeof variant !== "string") {
    return NextResponse.json({ error: "variant is required" }, { status: 400 });
  }

  // Resolve data
  const widgetData = useMockData
    ? getMockData(layout as LayoutType, variant)
    : data;
  if (!widgetData) {
    return NextResponse.json(
      { error: "data is required when useMockData is not true." },
      { status: 400 },
    );
  }

  let page;
  try {
    // For timeline-tasks, variant may be "subVariant/theme" — extract theme for renderer
    const renderVariant =
      layout === "timeline-tasks" && variant.includes("/")
        ? variant.split("/")[1]
        : variant;
    const html = renderWidget(layout as LayoutType, renderVariant, widgetData);
    const browser = await getBrowser();
    page = await browser.newPage();
    const scale = body.scale ?? 10;
    await page.setViewport({
      width,
      height,
      deviceScaleFactor: scale,
    });
    await page.setContent(html, { waitUntil: "networkidle0" });

    const screenshot = await page.screenshot({
      type: "png",
      clip: { x: 0, y: 0, width, height },
      omitBackground: true,
    });

    return new Response(Buffer.from(screenshot), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown rendering error";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    await page?.close().catch(() => {});
  }
}
