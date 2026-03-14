"use no memo";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import type { WidgetConfigurationScreenProps } from "react-native-android-widget";
import { requestWidgetUpdateById } from "react-native-android-widget";
import { PeekWidget, PeekWidgetLoading } from "./PeekWidget";
import { setWidgetLayout } from "./widget-storage";
import { fetchWidgetImage } from "./widget-task-handler";

const LAYOUTS_BY_SIZE: Record<string, { id: string; label: string }[]> = {
  peek_small: [
    { id: "contextual-hero", label: "Contextual Hero" },
    { id: "progress-ring", label: "Progress Ring" },
    { id: "streak-flame", label: "Streak Flame" },
  ],
  peek_medium: [
    { id: "bento-box", label: "Bento Box" },
    { id: "minimalist-stack", label: "Minimalist Stack" },
    { id: "companion-quote", label: "Companion Quote" },
    { id: "daily-score", label: "Daily Score" },
  ],
  peek_large: [
    { id: "timeline", label: "Timeline" },
    { id: "timeline-tasks", label: "Timeline + Tasks" },
  ],
};

export function WidgetConfigurationScreen({
  widgetInfo,
  renderWidget,
  setResult,
}: WidgetConfigurationScreenProps) {
  const handleSelect = async (layoutId: string) => {
    await setWidgetLayout(widgetInfo.widgetId, layoutId);
    renderWidget(<PeekWidgetLoading />);
    setResult("ok");

    const { widgetName, widgetId, width, height } = widgetInfo;
    const w = Math.round(width);
    const h = Math.round(height);

    // Ensure loading state shows on home screen
    await requestWidgetUpdateById({
      widgetName,
      widgetId,
      renderWidget: () => <PeekWidgetLoading />,
    });

    const imageUrl = await fetchWidgetImage(w, h, layoutId);

    if (imageUrl) {
      await requestWidgetUpdateById({
        widgetName,
        widgetId,
        renderWidget: () => (
          <PeekWidget
            imageUrl={imageUrl as `https:${string}`}
            width={w}
            height={h}
          />
        ),
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a layout</Text>
      <Text style={styles.subtitle}>
        Pick how your {widgetInfo.widgetName.replace("peek_", "")} widget looks
      </Text>
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
      >
        {(LAYOUTS_BY_SIZE[widgetInfo.widgetName] ?? []).map((layout) => (
          <TouchableOpacity
            key={layout.id}
            style={styles.option}
            onPress={() => handleSelect(layout.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>{layout.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.cancel}
        onPress={() => setResult("cancel")}
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 24,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: 8,
  },
  option: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  cancel: {
    marginTop: 16,
    alignItems: "center",
    padding: 16,
  },
  cancelText: {
    fontSize: 16,
    color: "#888",
  },
});
