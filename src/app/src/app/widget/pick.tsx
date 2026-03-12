import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { type AppTheme } from "@/constants/colors";
import { useAppTheme } from "@/hooks/use-app-theme";

const layouts = [
  { id: "hero", name: "Contextual Hero" },
  { id: "bento", name: "Bento Grid" },
  { id: "timeline", name: "Timeline Flow" },
  { id: "stack", name: "Minimal Stack" },
];

function HeroPreview({ c }: { c: AppTheme }) {
  return (
    <View style={[styles.previewHero, { backgroundColor: c.heroGradient }]}>
      <Text style={{ fontSize: 18 }}>{"☀️"}</Text>
      <Text style={styles.heroVal}>9:15</Text>
      <Text style={styles.heroSub}>Good morning</Text>
    </View>
  );
}

function BentoPreview({ c }: { c: AppTheme }) {
  const cells = [
    { label: "Next", value: "Review" },
    { label: "Focus", value: "47m" },
    { label: "Streak", value: "12" },
    { label: "Tasks", value: "3/7" },
  ];
  return (
    <View style={[styles.previewBento, { borderColor: c.border }]}>
      {cells.map((cell) => (
        <View
          key={cell.label}
          style={[styles.bentoCell, { backgroundColor: c.card }]}
        >
          <Text style={[styles.bentoCellLabel, { color: c.t3 }]}>
            {cell.label}
          </Text>
          <Text style={[styles.bentoCellValue, { color: c.t1 }]}>
            {cell.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

function TimelinePreview({ c }: { c: AppTheme }) {
  const rows = [
    { time: "9:00", active: true },
    { time: "11:00", active: true },
    { time: "13:00", active: false },
    { time: "15:00", active: false },
  ];
  return (
    <View
      style={[
        styles.previewTimeline,
        { backgroundColor: c.bg, borderColor: c.border },
      ]}
    >
      <Text style={[styles.tlHead, { color: c.t1 }]}>Today</Text>
      {rows.map((r) => (
        <View key={r.time} style={styles.tlRow}>
          <Text style={[styles.tlTime, { color: c.t3 }]}>{r.time}</Text>
          <View
            style={[
              styles.tlDot,
              { backgroundColor: r.active ? c.blue : c.border },
            ]}
          />
          <View
            style={[
              styles.tlBar,
              { backgroundColor: r.active ? c.blueTint : c.card },
            ]}
          />
        </View>
      ))}
    </View>
  );
}

function StackPreview({ c }: { c: AppTheme }) {
  return (
    <View
      style={[
        styles.previewStack,
        { backgroundColor: c.card, borderColor: c.border },
      ]}
    >
      <Text style={[styles.stackTop, { color: c.t3 }]}>Wednesday</Text>
      <Text style={[styles.stackMid, { color: c.t1 }]}>
        {"Ship the flow\ntoday."}
      </Text>
      <Text style={[styles.stackBot, { color: c.t3 }]}>3 tasks left</Text>
    </View>
  );
}

const previewMap: Record<string, (c: AppTheme) => React.ReactNode> = {
  hero: (c) => <HeroPreview c={c} />,
  bento: (c) => <BentoPreview c={c} />,
  timeline: (c) => <TimelinePreview c={c} />,
  stack: (c) => <StackPreview c={c} />,
};

export default function PickWidgetScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const c = useAppTheme();
  const [selected, setSelected] = useState("hero");

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: c.bg }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 20 },
      ]}
    >
      <Text style={[styles.pageTitle, { color: c.t1 }]}>Pick a widget</Text>
      <Text style={[styles.pageSub, { color: c.t3 }]}>
        Choose a layout for your home screen.
      </Text>

      <View style={styles.grid}>
        {layouts.map((layout) => {
          const isSelected = layout.id === selected;
          return (
            <Pressable
              key={layout.id}
              style={[
                styles.card,
                {
                  backgroundColor: c.surface,
                  borderColor: isSelected ? c.blue : c.border,
                },
                isSelected && styles.cardSelected,
              ]}
              onPress={() => setSelected(layout.id)}
            >
              {isSelected && (
                <View style={[styles.checkBadge, { backgroundColor: c.blue }]}>
                  <Text style={styles.checkText}>{"✓"}</Text>
                </View>
              )}
              {previewMap[layout.id]?.(c)}
              <Text style={[styles.cardName, { color: c.t1 }]}>
                {layout.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        style={[styles.btnPrimary, { backgroundColor: c.t1 }]}
        onPress={() => router.push("/widget/customize")}
      >
        <Text style={styles.btnPrimaryText}>Use This Widget</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  pageTitle: { fontSize: 28, fontWeight: "800", marginBottom: 4 },
  pageSub: { fontSize: 14, marginBottom: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 24 },
  card: {
    width: "47%",
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
  },
  cardSelected: { borderWidth: 2 },
  checkBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  checkText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  cardName: { fontSize: 12, fontWeight: "600", marginTop: 8 },
  previewHero: {
    width: 100,
    height: 100,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  heroVal: { fontSize: 22, fontWeight: "800", color: "#1a0e04" },
  heroSub: { fontSize: 9, color: "rgba(26,14,4,0.55)" },
  previewBento: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 4,
    gap: 3,
  },
  bentoCell: {
    width: "47%",
    flex: 1,
    borderRadius: 6,
    padding: 6,
    justifyContent: "center",
    minHeight: 42,
  },
  bentoCellLabel: { fontSize: 7 },
  bentoCellValue: { fontSize: 13, fontWeight: "700" },
  previewTimeline: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    padding: 8,
  },
  tlHead: { fontSize: 9, fontWeight: "700", marginBottom: 4 },
  tlRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 3,
  },
  tlTime: { fontSize: 6, width: 18 },
  tlDot: { width: 4, height: 4, borderRadius: 2 },
  tlBar: { flex: 1, height: 6, borderRadius: 3 },
  previewStack: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  stackTop: { fontSize: 8 },
  stackMid: { fontSize: 12, fontWeight: "700", lineHeight: 15 },
  stackBot: { fontSize: 8 },
  btnPrimary: { paddingVertical: 16, borderRadius: 14, alignItems: "center" },
  btnPrimaryText: { fontSize: 16, fontWeight: "700" },
});
