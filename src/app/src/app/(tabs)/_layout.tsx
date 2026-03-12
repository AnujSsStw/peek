import { NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';

import { useAppTheme } from '@/hooks/use-app-theme';

export default function TabLayout() {
  const colors = useAppTheme();

  return (
    <NativeTabs
      backgroundColor={colors.bg}
      indicatorColor={colors.card}
      labelStyle={{ selected: { color: colors.t1 } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Widgets</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/explore.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
