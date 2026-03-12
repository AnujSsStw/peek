import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@/hooks/use-app-theme";

function GoogleLogo() {
  return (
    <View style={gStyles.logoWrap}>
      <Text style={gStyles.g}>{"G"}</Text>
    </View>
  );
}

const gStyles = StyleSheet.create({
  logoWrap: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  g: { fontSize: 13, fontWeight: "700", color: "#4285F4" },
});

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const c = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: c.bg,
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 20,
        },
      ]}
    >
      <Pressable onPress={() => router.back()} style={styles.backWrap}>
        <Text style={[styles.backBtn, { color: c.blue }]}>{"← Back"}</Text>
      </Pressable>

      <View style={styles.hero}>
        <Text style={styles.icon}>{"👋"}</Text>
        <Text style={[styles.title, { color: c.t1 }]}>Welcome back</Text>
        <Text style={[styles.subtitle, { color: c.t2 }]}>
          Sign in to sync your widgets and settings.
        </Text>
      </View>

      <View style={styles.buttons}>
        <Pressable
          style={[
            styles.googleBtn,
            { backgroundColor: c.surface, borderColor: c.border },
          ]}
          onPress={() => router.replace("/(tabs)" as const)}
        >
          <GoogleLogo />
          <Text style={[styles.googleBtnText, { color: c.t1 }]}>
            Continue with Google
          </Text>
        </Pressable>
      </View>

      <Text style={[styles.terms, { color: c.t3 }]}>
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 28 },
  backWrap: { paddingTop: 12 },
  backBtn: { fontSize: 14 },
  hero: { flex: 1, justifyContent: "center", alignItems: "center" },
  icon: { fontSize: 48, marginBottom: 16 },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 260,
  },
  buttons: { gap: 12 },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  googleBtnText: { fontSize: 16, fontWeight: "600" },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  dividerLine: { flex: 1, height: StyleSheet.hairlineWidth },
  dividerText: { fontSize: 13 },
  appleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
  },
  appleBtnText: { fontSize: 16, fontWeight: "600" },
  terms: {
    fontSize: 11,
    textAlign: "center",
    lineHeight: 16,
    marginTop: 20,
    paddingHorizontal: 12,
  },
});
