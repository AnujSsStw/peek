import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Appearance,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@/hooks/use-app-theme";
import { authClient } from "@/utils/auth";
import { getBaseUrl } from "@/utils/base-url";
import { useTRPC } from "@/utils/trpc";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { GOOGLE_CALENDAR_SCOPES } from "../onboarding/connect";

function SectionHeader({ title, c }: { title: string; c: any }) {
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
  c: any;
}) {
  return (
    <Pressable
      style={[styles.row, { borderBottomColor: c.border }]}
      onPress={onPress}
      disabled={!onPress}
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

function IntegrationsSection({ c }: { c: any }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [pendingProvider, setPendingProvider] = useState<string | null>(null);

  const {
    data: integrations,
    isLoading,
    error,
  } = useQuery(trpc.integrations.list.queryOptions());

  const handleConnect = async (providerId: string) => {
    setPendingProvider(providerId);
    try {
      if (providerId === "google") {
        await authClient.linkSocial({
          provider: "google",
          callbackURL: "/(tabs)/settings",
          scopes: [...GOOGLE_CALENDAR_SCOPES],
        });
      } else if (providerId === "todoist") {
        await authClient.linkSocial({
          provider: "todoist",
          scopes: ["data:read"],
          callbackURL: "/(tabs)/settings",
        });
      }
      await queryClient.invalidateQueries({
        queryKey: trpc.integrations.list.queryKey(),
      });
    } catch (err) {
      console.error(`${providerId} connect error`, err);
    } finally {
      setPendingProvider(null);
    }
  };

  if (isLoading) {
    return (
      <>
        <SectionHeader title="Integrations" c={c} />
        <View
          style={[
            styles.card,
            styles.loadingCard,
            { backgroundColor: c.surface, borderColor: c.border },
          ]}
        >
          <ActivityIndicator size="small" color={c.t3} />
        </View>
      </>
    );
  }

  if (error || !integrations) {
    return (
      <>
        <SectionHeader title="Integrations" c={c} />
        <View
          style={[
            styles.card,
            styles.loadingCard,
            { backgroundColor: c.surface, borderColor: c.border },
          ]}
        >
          <Text style={[styles.rowDesc, { color: c.t3 }]}>
            Failed to load integrations
          </Text>
        </View>
      </>
    );
  }

  return (
    <>
      <SectionHeader title="Integrations" c={c} />
      <View
        style={[
          styles.card,
          { backgroundColor: c.surface, borderColor: c.border },
        ]}
      >
        {integrations.map((integration, idx) => {
          const isLast = idx === integrations.length - 1;
          const sourceCount = integration.sources.filter(
            (s: { isAvailable: boolean }) => s.isAvailable,
          ).length;

          const desc = integration.connected
            ? `${integration.accountId ?? "Connected"}${sourceCount > 0 ? ` · ${sourceCount} ${integration.section === "Calendars" ? (sourceCount === 1 ? "calendar" : "calendars") : sourceCount === 1 ? "project" : "projects"}` : ""}`
            : "Not connected";

          return (
            <View
              key={integration.id}
              style={
                isLast
                  ? undefined
                  : {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: c.border,
                    }
              }
            >
              {integration.connected ? (
                <Pressable
                  style={styles.integrationRow}
                  onPress={() =>
                    router.push(
                      `/integration-detail?provider=${integration.id}`,
                    )
                  }
                >
                  <View
                    style={[
                      styles.rowIcon,
                      { backgroundColor: integration.iconBg },
                    ]}
                  >
                    <Text style={{ fontSize: 16 }}>{integration.icon}</Text>
                  </View>
                  <View style={styles.rowInfo}>
                    <Text style={[styles.rowName, { color: c.t1 }]}>
                      {integration.name}
                    </Text>
                    <Text style={[styles.rowDesc, { color: c.t3 }]}>
                      {desc}
                    </Text>
                  </View>
                  <Text style={[styles.rowArrow, { color: c.t3 }]}>{"›"}</Text>
                </Pressable>
              ) : (
                <View style={styles.integrationRow}>
                  <View
                    style={[
                      styles.rowIcon,
                      { backgroundColor: integration.iconBg },
                    ]}
                  >
                    <Text style={{ fontSize: 16 }}>{integration.icon}</Text>
                  </View>
                  <View style={styles.rowInfo}>
                    <Text style={[styles.rowName, { color: c.t1 }]}>
                      {integration.name}
                    </Text>
                    <Text style={[styles.rowDesc, { color: c.t3 }]}>
                      {desc}
                    </Text>
                  </View>
                  <Pressable
                    style={[
                      styles.connectBtn,
                      { backgroundColor: c.t1 },
                      pendingProvider === integration.id && { opacity: 0.65 },
                    ]}
                    disabled={pendingProvider !== null}
                    onPress={() => handleConnect(integration.id)}
                  >
                    <Text style={[styles.connectBtnText, { color: c.bg }]}>
                      {pendingProvider === integration.id
                        ? "Connecting..."
                        : "Connect"}
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const c = useAppTheme();
  const colorScheme = useColorScheme();
  const { data: session } = authClient.useSession();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: c.bg }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 80 },
      ]}
    >
      <Text style={[styles.pageTitle, { color: c.t1 }]}>Settings</Text>

      {session?.user && (
        <View
          style={[
            styles.card,
            {
              backgroundColor: c.surface,
              borderColor: c.border,
              marginBottom: 8,
            },
          ]}
        >
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <View style={[styles.rowIcon, { backgroundColor: c.blueTint }]}>
              {session.user.image ? (
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    source={{ uri: session.user.image }}
                    style={{ width: "100%", height: "100%" }}
                  />
                </View>
              ) : (
                <Text style={{ fontSize: 16 }}>
                  {session.user.name?.[0]?.toUpperCase() ?? "?"}
                </Text>
              )}
            </View>
            <View style={styles.rowInfo}>
              <Text style={[styles.rowName, { color: c.t1 }]}>
                {session.user.name ?? "User"}
              </Text>
              <Text style={[styles.rowDesc, { color: c.t3 }]}>
                {session.user.email}
              </Text>
            </View>
          </View>
        </View>
      )}

      <IntegrationsSection c={c} />

      {/* <SectionHeader title="Widgets" c={c} />
      <View
        style={[
          styles.card,
          { backgroundColor: c.surface, borderColor: c.border },
        ]}
      >
        <SettingsRow
          icon="🔄"
          iconBg={c.card}
          name="Refresh Interval"
          desc="Every 15 minutes"
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
              {
                backgroundColor: colorScheme === "dark" ? c.green : c.toggleOff,
              },
            ]}
            onPress={() => {
              Appearance.setColorScheme(
                colorScheme === "dark" ? "light" : "dark",
              );
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
        <SettingsRow
          icon="❓"
          iconBg={c.card}
          name="Help & Support"
          c={c}
          onPress={() => Linking.openURL(`${getBaseUrl()}/help`)}
        />
      </View>

      <Pressable
        style={styles.logoutBtn}
        onPress={async () => {
          await authClient.signOut();
          router.replace("/onboarding/welcome");
        }}
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
  },
  loadingCard: {
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  integrationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
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
  connectBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  connectBtnText: {
    fontSize: 12,
    fontWeight: "600",
  },
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
