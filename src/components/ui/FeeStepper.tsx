import { Pressable, StyleSheet, View } from 'react-native';

import { MinusIcon, PlusIcon } from '@/components/icons';
import { colors, radii, spacing } from '@/theme';
import { ar } from '@/utils/format';

import { AppText } from './AppText';

type Props = {
  value: number;
  onChange: (delta: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
};

/** "+ ١٥ جنيه −" stepper from 08-AnyOrder (plus on the start side, minus on the end side). */
export function FeeStepper({ value, onChange, min, max, step = 5, unit = 'جنيه' }: Props) {
  const atMin = value <= min;
  const atMax = value >= max;
  return (
    <View style={styles.track}>
      <Pressable
        onPress={() => !atMax && onChange(step)}
        accessibilityRole="button"
        accessibilityLabel={`زوّد ${ar(step)} جنيه`}
        accessibilityState={{ disabled: atMax }}
        style={[styles.btn, styles.plus, atMax && styles.dim]}>
        <PlusIcon size={20} color={colors.surface} strokeWidth={2.6} />
      </Pressable>
      <View style={styles.value}>
        <AppText size={32} weight="extrabold">
          {ar(value)}
        </AppText>
        <AppText size={15} weight="semibold" color={colors.textMuted}>
          {unit}
        </AppText>
      </View>
      <Pressable
        onPress={() => !atMin && onChange(-step)}
        accessibilityRole="button"
        accessibilityLabel={`قلّل ${ar(step)} جنيه`}
        accessibilityState={{ disabled: atMin }}
        style={[styles.btn, styles.minus, atMin && styles.dim]}>
        <MinusIcon size={20} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: radii.button,
  },
  btn: { width: 48, height: 48, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  plus: { backgroundColor: colors.primary },
  minus: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  dim: { opacity: 0.4 },
  value: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
});
