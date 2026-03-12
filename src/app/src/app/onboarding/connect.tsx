import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@/hooks/use-app-theme";

type IntegrationStatus = "idle" | "connected";

export default function ConnectScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const c = useAppTheme();
  const [statuses, setStatuses] = useState<Record<string, IntegrationStatus>>({
    google: "connected",
  });

  const integrations = [
    {
      id: "google",
      name: "Google Calendar",
      desc: "Gmail, Google Workspace",
      color: c.google,
      section: "Calendars",
    },
    {
      id: "outlook",
      name: "Outlook",
      desc: "Microsoft 365, Exchange",
      color: c.outlook,
      section: "Calendars",
    },
    {
      id: "device",
      name: "Device Calendar",
      desc: "Apple Calendar, local events",
      color: c.local,
      section: "Calendars",
    },
    {
      id: "todoist",
      name: "Todoist",
      desc: "Tasks, projects, due dates",
      color: c.todoist,
      section: "Tasks",
    },
  ];

  const toggleConnect = (id: string) => {
    setStatuses((prev) => ({
      ...prev,
      [id]: prev[id] === "connected" ? "idle" : "connected",
    }));
  };

  let lastSection = "";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: c.bg }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 20 },
      ]}
    >
      <Text style={[styles.pageTitle, { color: c.t1 }]}>
        {"Connect your\nsources"}
      </Text>
      <Text style={[styles.pageSub, { color: c.t3 }]}>
        We pull events and tasks in. You see them on your widget. That's it.
      </Text>

      {integrations.map((item) => {
        const showSection = item.section !== lastSection;
        lastSection = item.section;
        const connected = statuses[item.id] === "connected";

        return (
          <View key={item.id}>
            {showSection && (
              <Text style={[styles.sectionHeader, { color: c.t3 }]}>
                {item.section}
              </Text>
            )}
            <View
              style={[
                styles.integrationRow,
                { backgroundColor: c.surface, borderColor: c.border },
              ]}
            >
              <View
                style={[
                  styles.integrationIcon,
                  { backgroundColor: item.color + "18" },
                ]}
              >
                <Text style={{ fontSize: 18 }}>{"📅"}</Text>
              </View>
              <View style={styles.integrationInfo}>
                <Text style={[styles.integrationName, { color: c.t1 }]}>
                  {item.name}
                </Text>
                <Text style={[styles.integrationDesc, { color: c.t3 }]}>
                  {item.desc}
                </Text>
              </View>
              <Pressable
                style={[
                  styles.connectBtn,
                  { backgroundColor: connected ? c.statusGreenBg : c.t1 },
                ]}
                onPress={() => toggleConnect(item.id)}
              >
                <Text
                  style={[
                    styles.connectBtnText,
                    connected && { color: c.green },
                  ]}
                >
                  {connected ? "✓ Connected" : "Connect"}
                </Text>
              </Pressable>
            </View>
          </View>
        );
      })}

      <View style={styles.buttons}>
        <Pressable
          style={[styles.btnPrimary, { backgroundColor: c.t1 }]}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={styles.btnPrimaryText}>Continue</Text>
        </Pressable>
        <Pressable
          style={styles.btnGhost}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={[styles.btnGhostText, { color: c.t3 }]}>
            Skip for now
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
    marginBottom: 8,
  },
  pageSub: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  integrationRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    gap: 12,
  },
  integrationIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  integrationInfo: { flex: 1 },
  integrationName: { fontSize: 15, fontWeight: "600" },
  integrationDesc: { fontSize: 12, marginTop: 1 },
  connectBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8 },
  connectBtnText: { fontSize: 12, fontWeight: "600" },
  buttons: { marginTop: 24, gap: 10 },
  btnPrimary: { paddingVertical: 16, borderRadius: 14, alignItems: "center" },
  btnPrimaryText: { fontSize: 16, fontWeight: "700" },
  btnGhost: { paddingVertical: 14, alignItems: "center" },
  btnGhostText: { fontSize: 14, fontWeight: "500" },
});
