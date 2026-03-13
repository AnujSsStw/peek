import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@/hooks/use-app-theme";
import { authClient } from "@/utils/auth";
import { useTRPC } from "@/utils/trpc";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const GOOGLE_CALENDAR_SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar.calendarlist.readonly",
] as const;

const INTEGRATIONS = [
  {
    id: "google",
    name: "Google Calendar",
    desc: "Gmail, Google Workspace",
    section: "Calendars",
    supported: true,
  },
  {
    id: "todoist",
    name: "Todoist",
    desc: "Tasks, projects, due dates",
    section: "Tasks",
    supported: true,
  },
] as const;

export default function ConnectScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const c = useAppTheme();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: integrations } = useQuery(
    trpc.integrations.list.queryOptions(),
  );

  const [pendingIntegrationId, setPendingIntegrationId] = useState<
    string | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const isConnected = (id: string) =>
    integrations?.find((i: { id: string }) => i.id === id)?.connected ?? false;

  const handleConnect = async (integrationId: string) => {
    if (isConnected(integrationId)) return;

    setPendingIntegrationId(integrationId);
    setError(null);

    try {
      if (integrationId === "google") {
        await authClient.linkSocial({
          provider: "google",
          callbackURL: "/connect",
          scopes: [...GOOGLE_CALENDAR_SCOPES],
        });
      } else if (integrationId === "todoist") {
        await authClient.linkSocial({
          provider: "todoist",
          scopes: ["data:read"],
          callbackURL: "/connect",
        });
      }

      await queryClient.invalidateQueries({
        queryKey: trpc.integrations.list.queryKey(),
      });
    } catch (connectError) {
      console.error(`${integrationId} connect error`, connectError);
      setError(
        integrationId === "todoist"
          ? "Todoist connection failed. Check the provider config and try again."
          : "Google Calendar connection failed. Please try again.",
      );
    } finally {
      setPendingIntegrationId(null);
    }
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
      {error ? (
        <Text style={[styles.errorText, { color: c.red }]}>{error}</Text>
      ) : null}

      {INTEGRATIONS.map((item) => {
        const showSection = item.section !== lastSection;
        lastSection = item.section;

        const connected = isConnected(item.id);
        const busy = pendingIntegrationId === item.id;
        const disabled = busy || connected || !item.supported;
        const colorValue =
          item.id === "google"
            ? c.google
            : item.id === "todoist"
              ? c.todoist
              : c.local;

        return (
          <View key={item.id}>
            {showSection ? (
              <Text style={[styles.sectionHeader, { color: c.t3 }]}>
                {item.section}
              </Text>
            ) : null}
            <View
              style={[
                styles.integrationRow,
                { backgroundColor: c.surface, borderColor: c.border },
              ]}
            >
              <View
                style={[
                  styles.integrationIcon,
                  { backgroundColor: `${colorValue}18` },
                ]}
              >
                <Text style={{ fontSize: 18 }}>
                  {item.id === "todoist" ? "✓" : "📅"}
                </Text>
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
                  connected
                    ? { backgroundColor: c.statusGreenBg }
                    : !item.supported
                      ? { backgroundColor: c.surface, borderColor: c.border }
                      : { backgroundColor: c.t1 },
                  disabled && !connected && { opacity: 0.65 },
                ]}
                disabled={disabled}
                onPress={() => handleConnect(item.id)}
              >
                <Text
                  style={[
                    styles.connectBtnText,
                    connected
                      ? { color: c.green }
                      : !item.supported
                        ? { color: c.t3 }
                        : undefined,
                  ]}
                >
                  {busy
                    ? "Connecting..."
                    : connected
                      ? "✓ Connected"
                      : item.supported
                        ? "Connect"
                        : "Soon"}
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
  pageSub: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  errorText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
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
  connectBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  connectBtnText: { fontSize: 12, fontWeight: "600" },
  buttons: { marginTop: 24, gap: 10 },
  btnPrimary: { paddingVertical: 16, borderRadius: 14, alignItems: "center" },
  btnPrimaryText: { fontSize: 16, fontWeight: "700" },
  btnGhost: { paddingVertical: 14, alignItems: "center" },
  btnGhostText: { fontSize: 14, fontWeight: "500" },
});
