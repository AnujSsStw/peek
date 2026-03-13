import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@/hooks/use-app-theme";
import { useTRPC } from "@/utils/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Toggle } from "@/components/toggle";

function formatSyncTime(date: Date | string | null) {
  if (!date) return null;
  const d = typeof date === "string" ? new Date(date) : date;
  const now = Date.now();
  const diffMs = now - d.getTime();
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays}d ago`;
}

export default function IntegrationDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const c = useAppTheme();
  const { provider } = useLocalSearchParams<{ provider: string }>();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: detail, isLoading } = useQuery(
    trpc.integrations.detail.queryOptions({ provider: provider ?? "" }),
  );

  const toggleMutation = useMutation(
    trpc.integrations.toggleSource.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.integrations.detail.queryKey({
            provider: provider ?? "",
          }),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.integrations.list.queryKey(),
        });
      },
    }),
  );

  const disconnectMutation = useMutation(
    trpc.integrations.disconnect.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.integrations.list.queryKey(),
        });
        router.back();
      },
    }),
  );

  const handleDisconnect = () => {
    if (!detail) return;

    if (Platform.OS === "web") {
      if (window.confirm(`Disconnect ${detail.name}?`)) {
        disconnectMutation.mutate({ provider: detail.id });
      }
    } else {
      Alert.alert(
        `Disconnect ${detail.name}?`,
        "This will remove the integration and its synced data.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Disconnect",
            style: "destructive",
            onPress: () => disconnectMutation.mutate({ provider: detail.id }),
          },
        ],
      );
    }
  };

  if (isLoading) {
    return (
      <View
        style={[styles.container, styles.centered, { backgroundColor: c.bg }]}
      >
        <ActivityIndicator size="small" color={c.t3} />
      </View>
    );
  }

  if (!detail || !detail.connected) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: c.bg, paddingTop: insets.top + 12 },
        ]}
      >
        <View style={{ paddingHorizontal: 20 }}>
          <Pressable onPress={() => router.back()}>
            <Text style={[styles.backBtn, { color: c.blue }]}>
              {"← Settings"}
            </Text>
          </Pressable>
          <Text style={[styles.headerName, { color: c.t1, marginTop: 20 }]}>
            Integration not found
          </Text>
        </View>
      </View>
    );
  }

  const availableSources = detail.sources.filter(
    (s: { isAvailable: boolean }) => s.isAvailable,
  );
  const unavailableSources = detail.sources.filter(
    (s: { isAvailable: boolean }) => !s.isAvailable,
  );

  const lastSync = detail.sources.reduce(
    (latest: Date | null, s: { lastSyncedAt: Date | string | null }) => {
      if (!s.lastSyncedAt) return latest;
      const d = new Date(s.lastSyncedAt as string);
      return !latest || d > latest ? d : latest;
    },
    null as Date | null,
  );

  const sourceLabel = detail.section === "Calendars" ? "Calendars" : "Projects";

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
        <View style={[styles.headerIcon, { backgroundColor: detail.iconBg }]}>
          <Text style={{ fontSize: 26 }}>{detail.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerName, { color: c.t1 }]}>
            {detail.name}
          </Text>
          {detail.accountId && (
            <Text style={[styles.headerEmail, { color: c.t3 }]}>
              {detail.accountId}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.statusRow}>
        <View style={[styles.statusDot, { backgroundColor: c.green }]} />
        <Text style={[styles.statusText, { color: c.green }]}>
          Connected
          {lastSync ? ` · Last synced ${formatSyncTime(lastSync)}` : ""}
        </Text>
      </View>

      {availableSources.length > 0 && (
        <>
          <Text style={[styles.sectionHeader, { color: c.t3 }]}>
            {sourceLabel}
          </Text>
          <View
            style={[
              styles.card,
              { backgroundColor: c.surface, borderColor: c.border },
            ]}
          >
            {availableSources.map(
              (
                source: {
                  id: string;
                  name: string;
                  color: string | null;
                  enabled: boolean;
                  isAvailable: boolean;
                },
                idx: number,
              ) => (
                <View
                  key={source.id}
                  style={[
                    styles.sourceRow,
                    { borderBottomColor: c.border },
                    idx === availableSources.length - 1 && {
                      borderBottomWidth: 0,
                    },
                  ]}
                >
                  <View style={styles.sourceInfo}>
                    <View
                      style={[
                        styles.sourceDot,
                        { backgroundColor: source.color ?? c.t3 },
                      ]}
                    />
                    <Text
                      style={[styles.sourceName, { color: c.t1 }]}
                      numberOfLines={1}
                    >
                      {source.name}
                    </Text>
                  </View>
                  <Toggle
                    on={source.enabled}
                    disabled={toggleMutation.isPending}
                    onToggle={() =>
                      toggleMutation.mutate({
                        sourceId: source.id,
                        enabled: !source.enabled,
                      })
                    }
                    c={c}
                  />
                </View>
              ),
            )}
          </View>
        </>
      )}

      {unavailableSources.length > 0 && (
        <>
          <Text style={[styles.sectionHeader, { color: c.t3 }]}>
            Unavailable
          </Text>
          <View
            style={[
              styles.card,
              { backgroundColor: c.surface, borderColor: c.border },
            ]}
          >
            {unavailableSources.map(
              (
                source: {
                  id: string;
                  name: string;
                  color: string | null;
                },
                idx: number,
              ) => (
                <View
                  key={source.id}
                  style={[
                    styles.sourceRow,
                    { borderBottomColor: c.border },
                    idx === unavailableSources.length - 1 && {
                      borderBottomWidth: 0,
                    },
                  ]}
                >
                  <View style={styles.sourceInfo}>
                    <View
                      style={[
                        styles.sourceDot,
                        {
                          backgroundColor: source.color ?? c.t3,
                          opacity: 0.3,
                        },
                      ]}
                    />
                    <Text
                      style={[styles.sourceName, { color: c.t3 }]}
                      numberOfLines={1}
                    >
                      {source.name}
                    </Text>
                  </View>
                  <Text style={[styles.unavailableTag, { color: c.t3 }]}>
                    Unavailable
                  </Text>
                </View>
              ),
            )}
          </View>
        </>
      )}

      <Pressable
        style={[
          styles.disconnectBtn,
          disconnectMutation.isPending && { opacity: 0.5 },
        ]}
        onPress={handleDisconnect}
        disabled={disconnectMutation.isPending}
      >
        <Text style={[styles.disconnectText, { color: c.red }]}>
          {disconnectMutation.isPending
            ? "Disconnecting..."
            : `Disconnect ${detail.name}`}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { alignItems: "center", justifyContent: "center" },
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
  sourceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sourceInfo: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  sourceDot: { width: 8, height: 8, borderRadius: 4 },
  sourceName: { fontSize: 15, fontWeight: "500", flex: 1 },
  unavailableTag: { fontSize: 12, fontStyle: "italic" },
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
