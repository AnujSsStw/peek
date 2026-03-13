import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@/hooks/use-app-theme";
import { Toggle } from "@/components/toggle";

type CalendarItem = { name: string; color: string; enabled: boolean };

export default function SourcesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const c = useAppTheme();

  const [calendars, setCalendars] = useState<Record<string, CalendarItem[]>>({
    "Google Calendar": [
      { name: "Personal", color: "#4285F4", enabled: true },
      { name: "Work", color: "#0f9d58", enabled: true },
      { name: "Birthdays", color: "#f4b400", enabled: false },
    ],
    Outlook: [{ name: "Main Calendar", color: "#0078D4", enabled: true }],
    "Device Calendar": [
      { name: "iCloud Calendar", color: "#555", enabled: false },
    ],
    Todoist: [
      { name: "Inbox", color: "#E44234", enabled: true },
      { name: "Work project", color: "#E44234", enabled: true },
      { name: "Personal errands", color: "#E44234", enabled: false },
    ],
  });

  const toggleItem = (section: string, idx: number) => {
    setCalendars((prev) => {
      const next = { ...prev };
      next[section] = [...next[section]];
      next[section][idx] = {
        ...next[section][idx],
        enabled: !next[section][idx].enabled,
      };
      return next;
    });
  };

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

      <Text style={[styles.pageTitle, { color: c.t1 }]}>
        {"Calendars &\ntask lists"}
      </Text>
      <Text style={[styles.pageSub, { color: c.t3 }]}>
        Toggle which calendars and lists feed this widget.
      </Text>

      {Object.entries(calendars).map(([section, items]) => (
        <View key={section}>
          <Text style={[styles.sectionHeader, { color: c.t3 }]}>{section}</Text>
          <View
            style={[
              styles.card,
              { backgroundColor: c.surface, borderColor: c.border },
            ]}
          >
            {items.map((item, idx) => (
              <View
                key={item.name}
                style={[
                  styles.custRow,
                  { borderBottomColor: c.border },
                  idx === items.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={styles.calRow}>
                  <View
                    style={[styles.calDot, { backgroundColor: item.color }]}
                  />
                  <Text style={[styles.custLabel, { color: c.t1 }]}>
                    {item.name}
                  </Text>
                </View>
                <Toggle
                  on={item.enabled}
                  onToggle={() => toggleItem(section, idx)}
                  c={c}
                />
              </View>
            ))}
          </View>
        </View>
      ))}

      <Pressable
        style={[styles.btnPrimary, { backgroundColor: c.t1 }]}
        onPress={() => router.dismissAll()}
      >
        <Text style={styles.btnPrimaryText}>Done</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  backBtn: { fontSize: 14, marginBottom: 8 },
  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
    marginBottom: 4,
  },
  pageSub: { fontSize: 14, marginBottom: 10 },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  card: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 16 },
  custRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  calRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  calDot: { width: 8, height: 8, borderRadius: 4 },
  custLabel: { fontSize: 15, fontWeight: "500" },
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
