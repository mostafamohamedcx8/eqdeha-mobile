import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { colors, radii, spacing } from '@/theme';

import { AppText } from './AppText';

type Variant = 'category' | 'street' | 'tag';

type Props = { label: string; selected: boolean; onPress: () => void; variant?: Variant };

/**
 * Filter chips from 06-Shops:
 * category = 36px teal pill; street = 32px yellow-tint rounded box.
 */
export function FilterChip({ label, selected, onPress, variant = 'category' }: Props) {
  const v = variants[variant];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={[styles.base, v.box, selected ? v.on : v.off]}>
      <AppText size={v.fontSize} weight={v.weight} color={selected ? v.onText : v.offText} numberOfLines={1}>
        {label}
      </AppText>
    </Pressable>
  );
}

/** Horizontal row of chips (scrolls sideways). */
export function ChipRow({ children, leading }: { children: React.ReactNode; leading?: React.ReactNode }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {leading}
      {children}
    </ScrollView>
  );
}

const variants = {
  category: {
    box: { height: 36, paddingHorizontal: spacing.xl, borderRadius: radii.pill },
    on: { backgroundColor: colors.primary, borderColor: colors.primary },
    off: { backgroundColor: colors.background, borderColor: colors.border },
    onText: colors.textOnPrimary,
    offText: colors.text,
    fontSize: 13,
    weight: 'bold' as const,
  },
  /** Toggle tag on a white card (16-Delivered). */
  tag: {
    box: { height: 36, paddingHorizontal: spacing.xl, borderRadius: radii.pill },
    on: { backgroundColor: colors.primary, borderColor: colors.primary },
    off: { backgroundColor: colors.surface, borderColor: colors.border },
    onText: colors.textOnPrimary,
    offText: colors.text,
    fontSize: 13,
    weight: 'bold' as const,
  },
  street: {
    box: { height: 32, paddingHorizontal: spacing.lg, borderRadius: 10 },
    on: { backgroundColor: colors.accentLight, borderColor: colors.accent },
    off: { backgroundColor: colors.surface, borderColor: colors.border },
    onText: colors.warningText,
    offText: colors.textMuted,
    fontSize: 12,
    weight: 'semibold' as const,
  },
};

const styles = StyleSheet.create({
  base: { borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.xxl },
});
