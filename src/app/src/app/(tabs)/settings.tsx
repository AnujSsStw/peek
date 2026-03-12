import { useRouter } from "expo-router";
import React from "react";
import {
  Appearance,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { type AppTheme } from "@/constants/colors";
import { useAppTheme } from "@/hooks/use-app-theme";

function SectionHeader({ title, c }: { title: string; c: AppTheme }) {
  return <Text style={[styles.sectionHeader, { color: c.t3 }]}>{title}</Text>;
}

function SettingsRow({
  icon,
  iconBg,
  name,
  desc,
  onPress,
  c,
}: {
  icon: string;
  iconBg: string;
  name: string;
  desc?: string;
  onPress?: () => void;
  c: AppTheme;
}) {
  return (
    <Pressable
      style={[styles.row, { borderBottomColor: c.border }]}
      onPress={onPress}
    >
      <View style={[styles.rowIcon, { backgroundColor: iconBg }]}>
        <Text style={{ fontSize: 16 }}>{icon}</Text>
      </View>
      <View style={styles.rowInfo}>
        <Text style={[styles.rowName, { color: c.t1 }]}>{name}</Text>
        {desc ? (
          <Text style={[styles.rowDesc, { color: c.t3 }]}>{desc}</Text>
        ) : null}
      </View>
      <Text style={[styles.rowArrow, { color: c.t3 }]}>{"›"}</Text>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const c = useAppTheme();
  const colorScheme = useColorScheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: c.bg }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 80 },
      ]}
    >
      <Text style={[styles.pageTitle, { color: c.t1 }]}>Settings</Text>

      <SectionHeader title="Integrations" c={c} />
      <View
        style={[
          styles.card,
          { backgroundColor: c.surface, borderColor: c.border },
        ]}
      >
        <SettingsRow
          icon="📅"
          iconBg="rgba(66,133,244,0.1)"
          name="Google Calendar"
          desc="user@gmail.com · 3 calendars"
          onPress={() => router.push("/integration-detail")}
          c={c}
        />
        <SettingsRow
          icon="📆"
          iconBg="rgba(0,120,212,0.1)"
          name="Outlook"
          desc="Not connected"
          c={c}
        />
        <SettingsRow
          icon="🗓"
          iconBg="rgba(0,0,0,0.04)"
          name="Device Calendar"
          desc="2 calendars synced"
          c={c}
        />
        <SettingsRow
          icon="✅"
          iconBg="rgba(228,66,52,0.08)"
          name="Todoist"
          desc="user@gmail.com · 3 projects"
          c={c}
        />
      </View>

      <SectionHeader title="Widgets" c={c} />
      <View
        style={[
          styles.card,
          { backgroundColor: c.surface, borderColor: c.border },
        ]}
      >
        {/* <SettingsRow
          icon="🧩"
          iconBg={c.card}
          name="Active Widgets"
          desc="2 widgets on home screen"
          c={c}
        /> */}
        <SettingsRow
          icon="🔄"
          iconBg={c.card}
          name="Refresh Interval"
          desc="Every 15 minutes"
          c={c}
        />
      </View>

      {/* <SectionHeader title="Notifications" c={c} />
      <View
        style={[
          styles.card,
          { backgroundColor: c.surface, borderColor: c.border },
        ]}
      >
        <SettingsRow
          icon="🔔"
          iconBg={c.card}
          name="Event reminders"
          desc="5 min before"
          onPress={() => router.push("/notifications")}
          c={c}
        />
        <SettingsRow
          icon="📋"
          iconBg={c.card}
          name="Task nudges"
          desc="Morning summary at 8:00"
          c={c}
        />
      </View> */}

      <SectionHeader title="App" c={c} />
      <View
        style={[
          styles.card,
          { backgroundColor: c.surface, borderColor: c.border },
        ]}
      >
        <View style={[styles.row, { borderBottomColor: c.border }]}>
          <View style={[styles.rowIcon, { backgroundColor: c.card }]}>
            <Text style={{ fontSize: 16 }}>{"🎨"}</Text>
          </View>
          <View style={styles.rowInfo}>
            <Text style={[styles.rowName, { color: c.t1 }]}>Dark Mode</Text>
          </View>
          <Pressable
            style={[
              styles.toggle,
              { backgroundColor: colorScheme === "dark" ? c.green : c.toggleOff },
            ]}
            onPress={() => {
              Appearance.setColorScheme(colorScheme === "dark" ? "light" : "dark");
            }}
          >
            <View
              style={[
                styles.toggleThumb,
                colorScheme === "dark" && styles.toggleThumbOn,
              ]}
            />
          </Pressable>
        </View>
        <SettingsRow icon="❓" iconBg={c.card} name="Help & Support" c={c} />
      </View>

      <Pressable
        style={styles.logoutBtn}
        onPress={() => router.replace("/onboarding/welcome")}
      >
        <Text style={[styles.logoutText, { color: c.red }]}>Log Out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  pageTitle: { fontSize: 28, fontWeight: "800", marginBottom: 16 },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 20,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    // paddingVertical: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rowInfo: { flex: 1 },
  rowName: { fontSize: 15, fontWeight: "600" },
  rowDesc: { fontSize: 12, marginTop: 1 },
  rowArrow: { fontSize: 20, fontWeight: "300" },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    padding: 2,
    justifyContent: "center" as const,
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#fff",
  },
  toggleThumbOn: { alignSelf: "flex-end" as const },
  logoutBtn: {
    marginTop: 28,
    backgroundColor: "rgba(232,64,64,0.08)",
    borderWidth: 1,
    borderColor: "rgba(232,64,64,0.15)",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center" as const,
  },
  logoutText: { fontSize: 15, fontWeight: "600" as const },
});
