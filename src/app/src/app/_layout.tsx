import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { useColorScheme } from "react-native";

import { AppColors } from "@/constants/colors";
import { authClient } from "@/utils/auth";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? AppColors.dark : AppColors.light;

  const { data: session, isPending } = authClient.useSession();

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return; // here show splash screen or loader

    const inAuthGroup = segments[0] === "onboarding";

    if (!session && !inAuthGroup) {
      router.replace("/onboarding/welcome");
    } else if (session && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [session, isPending, segments]);

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="onboarding/welcome"
          options={{ animation: "fade" }}
        />
        <Stack.Screen name="onboarding/connect" />
        <Stack.Screen name="onboarding/login" />
        <Stack.Screen
          name="widget/pick"
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />
        <Stack.Screen name="widget/customize" />
        <Stack.Screen name="widget/sources" />
        <Stack.Screen name="integration-detail" />
        <Stack.Screen name="notifications" />
      </Stack>
    </ThemeProvider>
  );
}
