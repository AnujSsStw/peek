import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@/hooks/use-app-theme";
import { Toggle } from "@/components/toggle";

export default function CustomizeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const c = useAppTheme();

  const [showNextEvent, setShowNextEvent] = useState(true);
  const [showTaskCount, setShowTaskCount] = useState(true);
  const [contextColors, setContextColors] = useState(true);
  const [showWeather, setShowWeather] = useState(false);
  const [activeSources, setActiveSources] = useState<Record<string, boolean>>({
    google: true,
    outlook: false,
    todoist: true,
  });

  const toggleSource = (key: string) => {
    setActiveSources((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const sources = [
    { key: "google", label: "Google", color: c.google },
    { key: "outlook", label: "Outlook", color: c.outlook },
    { key: "todoist", label: "Todoist", color: c.todoist },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: c.bg }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 20 },
      ]}
    >
      <Pressable onPress={() => router.back()}>
        <Text style={[styles.backBtn, { color: c.blue }]}>{"← Back"}</Text>
      </Pressable>

      <Text style={[styles.pageTitle, { color: c.t1 }]}>Customize</Text>
      <Text style={[styles.pageSub, { color: c.t3 }]}>
        Configure what this widget shows.
      </Text>

      <View style={styles.previewWrap}>
        <View style={[styles.previewHero, { backgroundColor: c.heroGradient }]}>
          <Text style={{ fontSize: 22 }}>{"☀️"}</Text>
          <Text style={styles.heroVal}>9:15</Text>
          <Text style={styles.heroSub}>Good morning</Text>
        </View>
      </View>

      <Text style={[styles.sectionHeader, { color: c.t3 }]}>Data Sources</Text>
      <View style={styles.pills}>
        {sources.map((s) => (
          <Pressable
            key={s.key}
            style={[
              styles.pill,
              {
                backgroundColor: c.surface,
                borderColor: activeSources[s.key] ? c.t1 : c.border,
              },
            ]}
            onPress={() => toggleSource(s.key)}
          >
            <View style={[styles.pillDot, { backgroundColor: s.color }]} />
            <Text
              style={[
                styles.pillText,
                { color: activeSources[s.key] ? c.t1 : c.t3 },
              ]}
            >
              {s.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.sectionHeader, { color: c.t3 }]}>
        Display Options
      </Text>
      <View
        style={[
          styles.card,
          { backgroundColor: c.surface, borderColor: c.border },
        ]}
      >
        {[
          {
            label: "Show next event",
            value: showNextEvent,
            setter: setShowNextEvent,
          },
          {
            label: "Show task count",
            value: showTaskCount,
            setter: setShowTaskCount,
          },
          {
            label: "Context colors",
            value: contextColors,
            setter: setContextColors,
          },
          { label: "Show weather", value: showWeather, setter: setShowWeather },
        ].map((opt, i, arr) => (
          <View
            key={opt.label}
            style={[
              styles.custRow,
              { borderBottomColor: c.border },
              i === arr.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
            <Text style={[styles.custLabel, { color: c.t1 }]}>{opt.label}</Text>
            <Toggle
              on={opt.value}
              onToggle={() => opt.setter(!opt.value)}
              c={c}
            />
          </View>
        ))}
      </View>

      <Text style={[styles.sectionHeader, { color: c.t3 }]}>Theme</Text>
      <View
        style={[
          styles.card,
          { backgroundColor: c.surface, borderColor: c.border },
        ]}
      >
        <View
          style={[
            styles.custRow,
            { borderBottomWidth: 0, borderBottomColor: c.border },
          ]}
        >
          <Text style={[styles.custLabel, { color: c.t1 }]}>Appearance</Text>
          <Text style={[styles.custVal, { color: c.t3 }]}>{"Auto ›"}</Text>
        </View>
      </View>

      <Pressable
        style={[styles.btnPrimary, { backgroundColor: c.t1 }]}
        onPress={() => router.push("/widget/sources")}
      >
        <Text style={styles.btnPrimaryText}>Save Widget</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  backBtn: { fontSize: 14, marginBottom: 8 },
  pageTitle: { fontSize: 28, fontWeight: "800", marginBottom: 4 },
  pageSub: { fontSize: 14, marginBottom: 16 },
  previewWrap: { alignItems: "center", marginBottom: 20 },
  previewHero: {
    width: 120,
    height: 120,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  heroVal: { fontSize: 28, fontWeight: "800", color: "#1a0e04" },
  heroSub: { fontSize: 10, color: "rgba(26,14,4,0.55)" },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  pills: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  pillDot: { width: 7, height: 7, borderRadius: 4 },
  pillText: { fontSize: 13, fontWeight: "500" },
  card: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 16 },
  custRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  custLabel: { fontSize: 15, fontWeight: "500" },
  custVal: { fontSize: 14 },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    padding: 2,
    justifyContent: "center",
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#fff",
  },
  toggleThumbOn: { alignSelf: "flex-end" },
  btnPrimary: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 24,
  },
  btnPrimaryText: { fontSize: 16, fontWeight: "700" },
});
