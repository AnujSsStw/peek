import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@/hooks/use-app-theme";
import { Toggle } from "@/components/toggle";

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const c = useAppTheme();

  const [morningSummary, setMorningSummary] = useState(true);
  const [overdueTasks, setOverdueTasks] = useState(true);
  const [streakUpdates, setStreakUpdates] = useState(false);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: c.bg }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 20 },
      ]}
    >
      <Pressable onPress={() => router.back()}>
        <Text style={[styles.backBtn, { color: c.blue }]}>{"← Settings"}</Text>
      </Pressable>

      <Text style={[styles.pageTitle, { color: c.t1 }]}>Notifications</Text>
      <Text style={[styles.pageSub, { color: c.t3 }]}>
        Gentle nudges, not noise.
      </Text>

      <Text style={[styles.sectionHeader, { color: c.t3 }]}>
        Event Reminders
      </Text>
      <View
        style={[
          styles.card,
          { backgroundColor: c.surface, borderColor: c.border },
        ]}
      >
        <View style={[styles.custRow, { borderBottomColor: c.border }]}>
          <Text style={[styles.custLabel, { color: c.t1 }]}>Before events</Text>
          <Text style={[styles.custVal, { color: c.t3 }]}>{"5 min ›"}</Text>
        </View>
        <View
          style={[
            styles.custRow,
            { borderBottomWidth: 0, borderBottomColor: c.border },
          ]}
        >
          <Text style={[styles.custLabel, { color: c.t1 }]}>
            All-day events
          </Text>
          <Text style={[styles.custVal, { color: c.t3 }]}>{"8:00 AM ›"}</Text>
        </View>
      </View>

      <Text style={[styles.sectionHeader, { color: c.t3 }]}>Task Nudges</Text>
      <View
        style={[
          styles.card,
          { backgroundColor: c.surface, borderColor: c.border },
        ]}
      >
        <View style={[styles.custRow, { borderBottomColor: c.border }]}>
          <Text style={[styles.custLabel, { color: c.t1 }]}>
            Morning summary
          </Text>
          <Toggle
            on={morningSummary}
            onToggle={() => setMorningSummary(!morningSummary)}
            c={c}
          />
        </View>
        <View style={[styles.custRow, { borderBottomColor: c.border }]}>
          <Text style={[styles.custLabel, { color: c.t1 }]}>Overdue tasks</Text>
          <Toggle
            on={overdueTasks}
            onToggle={() => setOverdueTasks(!overdueTasks)}
            c={c}
          />
        </View>
        <View
          style={[
            styles.custRow,
            { borderBottomWidth: 0, borderBottomColor: c.border },
          ]}
        >
          <Text style={[styles.custLabel, { color: c.t1 }]}>
            Streak updates
          </Text>
          <Toggle
            on={streakUpdates}
            onToggle={() => setStreakUpdates(!streakUpdates)}
            c={c}
          />
        </View>
      </View>

      <Text style={[styles.sectionHeader, { color: c.t3 }]}>Preview</Text>
      {[
        {
          icon: "⚡",
          title: "Calendar App",
          text: "Design sync in 5 min — you have 1 prep task unfinished.",
          time: "Just now",
        },
        {
          icon: "📋",
          title: "Morning Summary",
          text: "4 events, 3 tasks today. First up: standup at 9.",
          time: "8:00 AM",
        },
      ].map((n) => (
        <View
          key={n.title}
          style={[
            styles.notif,
            { backgroundColor: c.surface, borderColor: c.border },
          ]}
        >
          <View style={[styles.notifIcon, { backgroundColor: c.card }]}>
            <Text style={{ fontSize: 16 }}>{n.icon}</Text>
          </View>
          <View style={styles.notifBody}>
            <Text style={[styles.notifTitle, { color: c.t1 }]}>{n.title}</Text>
            <Text style={[styles.notifText, { color: c.t2 }]}>{n.text}</Text>
            <Text style={[styles.notifTime, { color: c.t3 }]}>{n.time}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  backBtn: { fontSize: 14, marginBottom: 12 },
  pageTitle: { fontSize: 28, fontWeight: "800", marginBottom: 4 },
  pageSub: { fontSize: 14, marginBottom: 10 },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 20,
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
  notif: {
    flexDirection: "row",
    gap: 10,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
  },
  notifIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  notifBody: { flex: 1 },
  notifTitle: { fontSize: 13, fontWeight: "600" },
  notifText: { fontSize: 12, marginTop: 2, lineHeight: 17 },
  notifTime: { fontSize: 10, marginTop: 4 },
});
