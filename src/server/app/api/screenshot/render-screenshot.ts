import type { LayoutType, WidgetData } from "./types";
import { renderWidget } from "./templates";
import { getBrowser } from "./browser";

export interface RenderScreenshotOpts {
  width: number;
  height: number;
  layout: LayoutType;
  variant: string;
  data: WidgetData;
  scale?: number;
}

export async function renderScreenshot(
  opts: RenderScreenshotOpts,
): Promise<Buffer> {
  const { width, height, layout, variant, data, scale = 10 } = opts;

  // For timeline-tasks, variant may be "subVariant/theme" — extract theme for renderer
  const renderVariant =
    layout === "timeline-tasks" && variant.includes("/")
      ? variant.split("/")[1]
      : variant;

  const html = renderWidget(layout, renderVariant, data);
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.setViewport({ width, height, deviceScaleFactor: scale });
    await page.setContent(html, { waitUntil: "networkidle0" });

    const screenshot = await page.screenshot({
      type: "png",
      clip: { x: 0, y: 0, width, height },
      omitBackground: true,
    });

    return Buffer.from(screenshot);
  } finally {
    await page.close().catch(() => {});
  }
}
