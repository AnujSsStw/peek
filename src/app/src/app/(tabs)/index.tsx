import { useRouter } from 'expo-router';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { type AppTheme } from '@/constants/colors';
import { useAppTheme } from '@/hooks/use-app-theme';

function WidgetMiniHero({ c }: { c: AppTheme }) {
  return (
    <View style={[styles.miniHero, { backgroundColor: c.heroGradient }]}>
      <Text style={{ fontSize: 18 }}>{'☀️'}</Text>
      <Text style={styles.miniHeroVal}>9:15</Text>
      <Text style={styles.miniHeroSub}>Good morning</Text>
    </View>
  );
}

function WidgetMiniTimeline({ c }: { c: AppTheme }) {
  const rows = [
    { time: '9:00', active: true },
    { time: '11:00', active: true },
    { time: '13:00', active: false },
    { time: '15:00', active: false },
  ];
  return (
    <View style={[styles.miniTimeline, { backgroundColor: c.bg, borderColor: c.border }]}>
      <Text style={[styles.miniTimelineHead, { color: c.t1 }]}>Today</Text>
      {rows.map((r) => (
        <View key={r.time} style={styles.tlRow}>
          <Text style={[styles.tlTime, { color: c.t3 }]}>{r.time}</Text>
          <View
            style={[
              styles.tlDot,
              { backgroundColor: r.active ? c.blue : c.border },
            ]}
          />
          <View
            style={[
              styles.tlBar,
              {
                backgroundColor: r.active
                  ? c.blueTint
                  : c.card,
              },
            ]}
          />
        </View>
      ))}
    </View>
  );
}

function SourceDot({ color }: { color: string }) {
  return <View style={[styles.srcDot, { backgroundColor: color }]} />;
}

function ActiveWidget({
  title,
  badge,
  preview,
  sources,
  c,
}: {
  title: string;
  badge: string;
  preview: React.ReactNode;
  sources: { label: string; color: string }[];
  c: AppTheme;
}) {
  return (
    <View style={[styles.activeWidget, { backgroundColor: c.surface, borderColor: c.border }]}>
      <View style={styles.awHead}>
        <Text style={[styles.awTitle, { color: c.t1 }]}>{title}</Text>
        <View style={[styles.awBadgeLive, { backgroundColor: c.statusGreenBg }]}>
          <Text style={[styles.awBadgeText, { color: c.green }]}>{badge}</Text>
        </View>
      </View>
      <View style={styles.awPreview}>{preview}</View>
      <View style={styles.awSources}>
        {sources.map((s) => (
          <View key={s.label} style={[styles.awSrc, { backgroundColor: c.card }]}>
            <SourceDot color={s.color} />
            <Text style={[styles.awSrcText, { color: c.t3 }]}>{s.label}</Text>
          </View>
        ))}
      </View>
      <View style={styles.awActions}>
        <Pressable style={[styles.awAction, { borderColor: c.border, backgroundColor: c.surface }]}>
          <Text style={[styles.awActionText, { color: c.t2 }]}>Edit</Text>
        </Pressable>
        <Pressable style={[styles.awAction, { backgroundColor: c.blueTint, borderColor: c.blueBorder }]}>
          <Text style={[styles.awActionText, { color: c.blue }]}>Customize</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function WidgetsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const c = useAppTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: c.bg }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 80 },
      ]}>
      <Text style={[styles.pageTitle, { color: c.t1 }]}>Your widgets</Text>

      <View style={[styles.statusOk, { backgroundColor: c.statusGreenBg, borderColor: c.statusGreenBorder }]}>
        <View style={[styles.statusDot, { backgroundColor: c.green }]} />
        <Text style={[styles.statusText, { color: c.green }]}>
          All sources synced · Updated 2 min ago
        </Text>
      </View>

      <ActiveWidget
        title="Contextual Hero"
        badge="Live"
        preview={<WidgetMiniHero c={c} />}
        sources={[
          { label: 'Google', color: c.google },
          { label: 'Todoist', color: c.todoist },
        ]}
        c={c}
      />

      <ActiveWidget
        title="Timeline Flow"
        badge="Live"
        preview={<WidgetMiniTimeline c={c} />}
        sources={[
          { label: 'Google', color: c.google },
          { label: 'Outlook', color: c.outlook },
          { label: 'Todoist', color: c.todoist },
        ]}
        c={c}
      />

      <Pressable
        style={[styles.addWidget, { borderColor: c.border }]}
        onPress={() => router.push('/widget/pick')}>
        <Text style={[styles.addWidgetIcon, { color: c.t3 }]}>+</Text>
        <Text style={[styles.addWidgetTitle, { color: c.t1 }]}>Add a widget</Text>
        <Text style={[styles.addWidgetSub, { color: c.t3 }]}>
          Pick a layout for your home screen
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  pageTitle: { fontSize: 28, fontWeight: '800', marginBottom: 16 },
  statusOk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12, fontWeight: '500' },
  activeWidget: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  awHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  awTitle: { fontSize: 15, fontWeight: '700' },
  awBadgeLive: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  awBadgeText: { fontSize: 11, fontWeight: '600' },
  awPreview: { alignItems: 'center', marginBottom: 12 },
  awSources: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  awSrc: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  srcDot: { width: 5, height: 5, borderRadius: 3 },
  awSrcText: { fontSize: 11 },
  awActions: { flexDirection: 'row', gap: 8 },
  awAction: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  awActionText: { fontSize: 13, fontWeight: '600' },
  miniHero: {
    width: 100,
    height: 100,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  miniHeroVal: { fontSize: 24, fontWeight: '800', color: '#1a0e04' },
  miniHeroSub: { fontSize: 9, color: 'rgba(26,14,4,0.55)' },
  miniTimeline: {
    width: 120,
    height: 120,
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
  },
  miniTimelineHead: { fontSize: 10, fontWeight: '700', marginBottom: 6 },
  tlRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  tlTime: { fontSize: 7, width: 22 },
  tlDot: { width: 5, height: 5, borderRadius: 3 },
  tlBar: { flex: 1, height: 8, borderRadius: 3 },
  addWidget: {
    alignItems: 'center',
    paddingVertical: 24,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    marginTop: 4,
  },
  addWidgetIcon: { fontSize: 28, marginBottom: 4 },
  addWidgetTitle: { fontSize: 14, fontWeight: '700' },
  addWidgetSub: { fontSize: 12, marginTop: 2 },
});
