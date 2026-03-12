import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@/hooks/use-app-theme";
import { authClient } from "@/utils/auth";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/(tabs)",
      });
      router.replace("/(tabs)");
    } catch (e) {
      setError("Sign in failed. Please try again.");
      console.error("Google sign-in error:", e);
    } finally {
      setLoading(false);
    }
  };

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
            loading && { opacity: 0.6 },
          ]}
          onPress={handleGoogleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={c.t1} />
          ) : (
            <GoogleLogo />
          )}
          <Text style={[styles.googleBtnText, { color: c.t1 }]}>
            {loading ? "Signing in..." : "Continue with Google"}
          </Text>
        </Pressable>
        {error && (
          <Text style={[styles.errorText, { color: c.red }]}>{error}</Text>
        )}
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
  errorText: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
  },
});
