import React from "react";
import type { WidgetTaskHandlerProps } from "react-native-android-widget";
import { PeekWidget, PeekWidgetLoading } from "./PeekWidget";
import { getBaseUrl } from "@/utils/base-url";
import {
  getWidgetLayout,
  removeWidgetLayout,
  getStoredLocation,
} from "./widget-storage";
import { authClient } from "@/utils/auth";

const RESIZE_THROTTLE_MS = 2000;
const lastResizeByWidget = new Map<number, number>();

export async function fetchWidgetImage(
  width: number,
  height: number,
  layout: string,
): Promise<string | null> {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = new Date();
  const date = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: timezone,
  });
  const currentTime = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone,
  });
  const location = (await getStoredLocation()) ?? undefined;

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const cookies = authClient.getCookie?.();
    if (cookies) {
      headers["Cookie"] = cookies;
    }

    const res = await fetch(`${getBaseUrl()}/api/generate`, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify({
        width: Math.round(width),
        height: Math.round(height),
        layout,
        date,
        currentTime,
        timezone,
        location,
      }),
    });

    if (!res.ok) {
      console.error("Widget fetch failed:", res.status, await res.text());
      return null;
    }

    const data = await res.json();
    return data.url ?? null;
  } catch (err) {
    console.error("Widget fetch error:", err);
    return null;
  }
}

export async function fetchAndRenderWidget(
  renderWidget: (widget: React.JSX.Element) => void,
  width: number,
  height: number,
  layout: string,
): Promise<void> {
  const w = Math.round(width);
  const h = Math.round(height);

  const imageUrl = await fetchWidgetImage(w, h, layout);

  if (imageUrl) {
    renderWidget(
      <PeekWidget
        imageUrl={imageUrl as `https:${string}`}
        width={w}
        height={h}
      />,
    );
  }
}

async function renderPeekWidget(props: WidgetTaskHandlerProps): Promise<void> {
  const { width, height, widgetId } = props.widgetInfo;

  const layout = await getWidgetLayout(widgetId);
  if (!layout) return;

  props.renderWidget(<PeekWidgetLoading />);
  await fetchAndRenderWidget(props.renderWidget, width, height, layout);
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  switch (props.widgetAction) {
    case "WIDGET_ADDED":
      await renderPeekWidget(props);
      break;

    case "WIDGET_UPDATE":
      await renderPeekWidget(props);
      break;

    case "WIDGET_RESIZED": {
      const widgetId = props.widgetInfo.widgetId;
      const now = Date.now();
      const lastResize = lastResizeByWidget.get(widgetId) ?? 0;

      if (now - lastResize < RESIZE_THROTTLE_MS) {
        break;
      }

      lastResizeByWidget.set(widgetId, now);
      await renderPeekWidget(props);
      break;
    }

    case "WIDGET_DELETED":
      await removeWidgetLayout(props.widgetInfo.widgetId);
      break;

    case "WIDGET_CLICK":
      break;

    default:
      break;
  }
}
