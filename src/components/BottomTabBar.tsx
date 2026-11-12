import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { Tabs } from 'expo-router/js-tabs';

import { AppText, DirectionView, useDesignInsets } from '@/components/ui';
import { colors, spacing } from '@/theme';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

export type TabItem = { name: string; label: string; icon: (color: string) => React.ReactNode };

/** The design's bottom <nav>: white bar, teal active item, grey others. */
export function BottomTabBar({ state, navigateToTab, items }: TabBarProps & { items: TabItem[] }) {
  const inset = useDesignInsets();
  return (
    <DirectionView dir="rtl" style={[styles.bar, { paddingBottom: inset.bottom(26) }]}>
      {state.routes.map((route, i) => {
        const item = items.find((t) => t.name === route.name);
        if (!item) return null;
        const active = state.index === i;
        const color = active ? colors.primary : colors.textMuted;
        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => {
              if (!active) navigateToTab(route.key);
            }}
            style={styles.item}>
            <View>{item.icon(color)}</View>
            <AppText size={12} weight={active ? 'bold' : 'semibold'} color={color}>
              {item.label}
            </AppText>
          </Pressable>
        );
      })}
    </DirectionView>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.ml,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  item: { minWidth: 64, alignItems: 'center', gap: spacing.xxs },
});
