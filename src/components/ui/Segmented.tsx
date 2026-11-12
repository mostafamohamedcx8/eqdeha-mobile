import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii, spacing } from '@/theme';

import { AppText } from './AppText';

type Option<T extends string> = { value: T; label: string };

export type SegmentedTone = keyof typeof tones;

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  /**
   * onPrimary = inside the teal header (00c-Login); onLight = on beige (25-CPending);
   * onWhite = white track, teal selected (09-MapPick); compact = small pill in a header (10-Points).
   */
  tone?: SegmentedTone;
  style?: StyleProp<ViewStyle>;
};

export function Segmented<T extends string>({ options, value, onChange, tone = 'onPrimary', style }: Props<T>) {
  const t = tones[tone];
  return (
    <View
      style={[styles.track, { backgroundColor: t.track, borderRadius: t.trackRadius, padding: t.pad, gap: t.gap }, style]}
      accessibilityRole="tablist">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            style={[
              styles.item,
              t.fill ? styles.fill : { paddingHorizontal: 10 },
              { height: t.height, borderRadius: t.itemRadius },
              on && { backgroundColor: t.onBg },
            ]}>
            <AppText size={t.fontSize} weight={t.weight} color={on ? t.onText : t.offText}>
              {o.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const base = { pad: spacing.xs, gap: spacing.xs, trackRadius: radii.md, itemRadius: radii.sm, fill: true };

const tones = {
  onPrimary: { ...base, track: colors.primaryLight, onBg: colors.surface, onText: colors.primary, offText: colors.textOnPrimaryMuted, height: 40, fontSize: 14, weight: 'extrabold' as const },
  /** 36px tabs inside a teal header (20-Orders). */
  onPrimarySm: { ...base, track: colors.primaryLight, onBg: colors.surface, onText: colors.primary, offText: colors.textOnPrimaryMuted, height: 36, fontSize: 13, weight: 'bold' as const },
  onLight: { ...base, track: colors.divider, onBg: colors.surface, onText: colors.primary, offText: colors.textMuted, height: 36, fontSize: 12, weight: 'bold' as const },
  onWhite: { ...base, track: colors.surface, trackRadius: radii.input, itemRadius: 10, onBg: colors.primary, onText: colors.textOnPrimary, offText: colors.textMuted, height: 40, fontSize: 14, weight: 'bold' as const },
  compact: { ...base, pad: 3, track: colors.primaryLight, trackRadius: 10, itemRadius: 8, fill: false, onBg: colors.surface, onText: colors.primary, offText: colors.textOnPrimaryMuted, height: 30, fontSize: 12, weight: 'bold' as const },
};

const styles = StyleSheet.create({
  track: { flexDirection: 'row' },
  item: { alignItems: 'center', justifyContent: 'center' },
  fill: { flex: 1 },
});
