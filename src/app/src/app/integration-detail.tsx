import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@/hooks/use-app-theme";

function Toggle({
  on,
  onToggle,
  c,
}: {
  on: boolean;
  onToggle: () => void;
  c: { green: string; toggleOff: string };
}) {
  return (
    <Pressable
      style={[styles.toggle, { backgroundColor: on ? c.green : c.toggleOff }]}
      onPress={onToggle}
    >
      <View style={[styles.toggleThumb, on && styles.toggleThumbOn]} />
    </Pressable>
  );
}

export default function IntegrationDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const c = useAppTheme();

  const [cals, setCals] = useState([
    { name: "Personal", color: "#4285F4", enabled: true },
    { name: "Inkboard Work", color: "#0f9d58", enabled: true },
    { name: "Birthdays", color: "#f4b400", enabled: false },
  ]);
  const [bgRefresh, setBgRefresh] = useState(true);

  const toggleCal = (idx: number) => {
    setCals((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], enabled: !next[idx].enabled };
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
        <Text style={[styles.backBtn, { color: c.blue }]}>{"← Settings"}</Text>
      </Pressable>

      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Text style={{ fontSize: 26 }}>{"📅"}</Text>
        </View>
        <View>
          <Text style={[styles.headerName, { color: c.t1 }]}>
            Google Calendar
          </Text>
          <Text style={[styles.headerEmail, { color: c.t3 }]}>
            user@gmail.com
          </Text>
        </View>
      </View>

      <View style={styles.statusRow}>
        <View style={[styles.statusDot, { backgroundColor: c.green }]} />
        <Text style={[styles.statusText, { color: c.green }]}>
          Connected · Last synced 2 min ago
        </Text>
      </View>

      <Text style={[styles.sectionHeader, { color: c.t3 }]}>Calendars</Text>
      <View
        style={[
          styles.card,
          { backgroundColor: c.surface, borderColor: c.border },
        ]}
      >
        {cals.map((cal, idx) => (
          <View
            key={cal.name}
            style={[
              styles.custRow,
              { borderBottomColor: c.border },
              idx === cals.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
            <View style={styles.calRow}>
              <View style={[styles.calDot, { backgroundColor: cal.color }]} />
              <Text style={[styles.custLabel, { color: c.t1 }]}>
                {cal.name}
              </Text>
            </View>
            <Toggle on={cal.enabled} onToggle={() => toggleCal(idx)} c={c} />
          </View>
        ))}
      </View>

      {/* <Text style={[styles.sectionHeader, { color: c.t3 }]}>Sync</Text>
      <View
        style={[
          styles.card,
          { backgroundColor: c.surface, borderColor: c.border },
        ]}
      >
        <View style={[styles.custRow, { borderBottomColor: c.border }]}>
          <Text style={[styles.custLabel, { color: c.t1 }]}>Sync range</Text>
          <Text style={[styles.custVal, { color: c.t3 }]}>
            {"2 weeks ahead ›"}
          </Text>
        </View>
        <View
          style={[
            styles.custRow,
            { borderBottomWidth: 0, borderBottomColor: c.border },
          ]}
        >
          <Text style={[styles.custLabel, { color: c.t1 }]}>
            Background refresh
          </Text>
          <Toggle
            on={bgRefresh}
            onToggle={() => setBgRefresh(!bgRefresh)}
            c={c}
          />
        </View>
      </View> */}

      <Pressable style={styles.disconnectBtn}>
        <Text style={[styles.disconnectText, { color: c.red }]}>
          Disconnect Google Calendar
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  backBtn: { fontSize: 14, marginBottom: 12 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(66,133,244,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerName: { fontSize: 18, fontWeight: "700" },
  headerEmail: { fontSize: 12, marginTop: 1 },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 13, fontWeight: "500" },
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
  calRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  calDot: { width: 8, height: 8, borderRadius: 4 },
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
  disconnectBtn: {
    marginTop: 28,
    backgroundColor: "rgba(232,64,64,0.08)",
    borderWidth: 1,
    borderColor: "rgba(232,64,64,0.15)",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  disconnectText: { fontSize: 15, fontWeight: "600" },
});
