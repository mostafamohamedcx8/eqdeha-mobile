import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/theme';

import { AppText } from './AppText';

type Props = { total: number; current: number; label: string; gap?: number };

/** Bars on top of the sign-up forms: done = green, current = teal, later = grey. */
export function StepProgress({ total, current, label, gap = spacing.ml }: Props) {
  return (
    <View style={{ gap }} accessibilityLabel={label}>
      <View style={styles.bars}>
        {Array.from({ length: total }, (_, i) => (
          <View
            key={i}
            style={[
              styles.bar,
              { backgroundColor: i + 1 < current ? colors.success : i + 1 === current ? colors.primary : colors.divider },
            ]}
          />
        ))}
      </View>
      <AppText size={13} color={colors.textMuted}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  bars: { flexDirection: 'row', gap: spacing.sm },
  bar: { flex: 1, height: 6, borderRadius: 3 },
});
