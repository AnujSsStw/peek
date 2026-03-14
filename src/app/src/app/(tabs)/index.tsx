import React, { useCallback, useRef, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";

import { useAppTheme } from "@/hooks/use-app-theme";
import { getWidgetLayout } from "@/widget/widget-storage";
import { fetchWidgetImage } from "@/widget/widget-task-handler";
import { PeekWidget, PeekWidgetLoading } from "@/widget/PeekWidget";

import type { WidgetInfo } from "react-native-android-widget";
import {
  WidgetPreview,
  requestWidgetUpdateById,
} from "react-native-android-widget";

const WIDGET_NAMES = ["peek_small", "peek_medium", "peek_large"] as const;

const SIZE_LABELS: Record<string, string> = {
  peek_small: "Small",
  peek_medium: "Medium",
  peek_large: "Large",
};

interface PlacedWidget extends WidgetInfo {
  layout: string | null;
  imageUrl: string | null;
}

export default function WidgetsScreen() {
  const insets = useSafeAreaInsets();
  const c = useAppTheme();
  const { width: screenWidth } = useWindowDimensions();
  const [widgets, setWidgets] = useState<PlacedWidget[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const hasLoadedImages = useRef(false);
  const maxPreviewWidth = screenWidth - (20 + 16) * 2;

  const loadWidgets = useCallback(
    async (forceRefresh = false) => {
      if (Platform.OS !== "android") {
        setLoading(false);
        return;
      }

      try {
        const { getWidgetInfo } = await import("react-native-android-widget");

        const results = await Promise.all(
          WIDGET_NAMES.map((name) => getWidgetInfo(name)),
        );

        const allWidgets = results.flat();

        // First pass: set widgets with layout but no image yet
        const withLayouts = await Promise.all(
          allWidgets.map(async (w) => ({
            ...w,
            layout: await getWidgetLayout(w.widgetId),
            imageUrl: null as string | null,
          })),
        );

        setWidgets(withLayouts);
        setLoading(false);

        // Only fetch images on first load or when pull-to-refresh
        if (hasLoadedImages.current && !forceRefresh) return;

        // Second pass: fetch images and update home screen widgets
        const withImages = await Promise.all(
          withLayouts.map(async (w) => {
            if (!w.layout) return w;
            const width = Math.round(w.width);
            const height = Math.round(w.height);
            const url = await fetchWidgetImage(width, height, w.layout);

            if (url) {
              await requestWidgetUpdateById({
                widgetName: w.widgetName,
                widgetId: w.widgetId,
                renderWidget: () => (
                  <PeekWidget
                    imageUrl={url as `https:${string}`}
                    width={width}
                    height={height}
                  />
                ),
              });
            }

            return { ...w, imageUrl: url };
          }),
        );

        setWidgets(withImages);
        hasLoadedImages.current = true;
      } catch (err) {
        console.error("Failed to load widgets:", err);
        setLoading(false);
      }
    },
    [],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadWidgets(true);
    setRefreshing(false);
  }, [loadWidgets]);

  useFocusEffect(
    useCallback(() => {
      loadWidgets();
    }, [loadWidgets]),
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: c.bg }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 80 },
      ]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={[styles.pageTitle, { color: c.t1 }]}>Your widgets</Text>

      {loading && (
        <Text style={[styles.emptyText, { color: c.t3 }]}>Loading...</Text>
      )}

      {!loading && widgets.length === 0 && (
        <View
          style={[
            styles.emptyCard,
            { backgroundColor: c.surface, borderColor: c.border },
          ]}
        >
          <Text style={[styles.emptyTitle, { color: c.t1 }]}>
            No widgets placed
          </Text>
          <Text style={[styles.emptyText, { color: c.t3 }]}>
            Long-press your home screen to add a Peek widget
          </Text>
        </View>
      )}

      {widgets.map((w) => {
        const width = Math.round(w.width);
        const height = Math.round(w.height);
        const scale = Math.min(1, maxPreviewWidth / width);
        const scaledWidth = width * scale;
        const scaledHeight = height * scale;

        return (
          <View
            key={w.widgetId}
            style={[
              styles.widgetCard,
              { backgroundColor: c.surface, borderColor: c.border },
            ]}
          >
            <View style={styles.widgetHeader}>
              <Text style={[styles.widgetTitle, { color: c.t1 }]}>
                {SIZE_LABELS[w.widgetName] ?? w.widgetName}
              </Text>
              <View
                style={[styles.badge, { backgroundColor: c.statusGreenBg }]}
              >
                <Text style={[styles.badgeText, { color: c.green }]}>Live</Text>
              </View>
            </View>

            <View
              style={[
                styles.previewContainer,
                { width: scaledWidth, height: scaledHeight, alignSelf: "center" },
              ]}
            >
              <View
                style={{
                  width,
                  height,
                  transform: [{ scale }],
                  transformOrigin: "top left",
                }}
              >
                <WidgetPreview
                  renderWidget={() =>
                    w.imageUrl ? (
                      <PeekWidget
                        imageUrl={w.imageUrl as `https:${string}`}
                        width={width}
                        height={height}
                      />
                    ) : (
                      <PeekWidgetLoading />
                    )
                  }
                  width={width}
                  height={height}
                />
              </View>
            </View>

            {w.layout && (
              <Text style={[styles.metaText, { color: c.t3 }]}>
                {w.layout.replace(/-/g, " ")}
              </Text>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  pageTitle: { fontSize: 28, fontWeight: "800", marginBottom: 16 },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  emptyTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  emptyText: { fontSize: 13, textAlign: "center" },
  widgetCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  widgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  widgetTitle: { fontSize: 16, fontWeight: "700" },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: { fontSize: 11, fontWeight: "600" },
  previewContainer: {
    marginBottom: 8,
    borderRadius: 16,
    overflow: "hidden",
  },
  metaText: { fontSize: 12, textTransform: "capitalize" },
});
