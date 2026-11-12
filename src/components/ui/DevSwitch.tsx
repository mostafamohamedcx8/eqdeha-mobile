import { StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '@/theme';

import { AppText } from './AppText';
import { Segmented } from './Segmented';

type Props<T extends string> = {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
};

/**
 * Dev-only state preview (the design files' toggles that aren't part of the real UI).
 * Hidden in production builds (`__DEV__` is false there).
 */
export function DevSwitch<T extends string>({ value, onChange, options }: Props<T>) {
  if (!__DEV__) return null;
  return (
    <View style={styles.box}>
      <AppText size={11} weight="bold" color={colors.textMuted}>
        معاينة (للتطوير بس)
      </AppText>
      <Segmented tone="onLight" value={value} onChange={onChange} options={options} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
});
