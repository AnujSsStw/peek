import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';

import { AppColors } from '@/constants/colors';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? AppColors.dark : AppColors.light;

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding/welcome" options={{ animation: 'fade' }} />
        <Stack.Screen name="onboarding/connect" />
        <Stack.Screen name="onboarding/login" />
        <Stack.Screen
          name="widget/pick"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="widget/customize" />
        <Stack.Screen name="widget/sources" />
        <Stack.Screen name="integration-detail" />
        <Stack.Screen name="notifications" />
      </Stack>
    </ThemeProvider>
  );
}
