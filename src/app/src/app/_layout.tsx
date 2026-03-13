import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, useColorScheme, View } from "react-native";

import { AppColors } from "@/constants/colors";
import { authClient } from "@/utils/auth";
import { TRPCReactProvider } from "@/utils/trpc";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? AppColors.dark : AppColors.light;

  const { data: session, isPending } = authClient.useSession();

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;

    const inAuthGroup = segments[0] === "onboarding";

    if (!session && !inAuthGroup) {
      router.replace("/onboarding/welcome");
    } else if (session && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [session, isPending, segments]);

  if (isPending) {
    return (
      // show splash/loading screen while checking auth
      <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.bg,
          }}
        >
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      </ThemeProvider>
    );
  }

  return (
    <TRPCReactProvider>
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
    </TRPCReactProvider>
  );
}
