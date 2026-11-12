import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii, spacing } from '@/theme';

import { AppText } from './AppText';

type OptionButtonProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** Receives the text color so icons follow it (`currentColor` in the HTML). */
  icon?: (color: string) => React.ReactNode;
  /** lg = gender buttons (04-Profile); md = vehicle type (24-CVehicle); sm = 44px white choice (07/08 payment). */
  size?: 'lg' | 'md' | 'sm' | 'xs' | 'chip';
  style?: StyleProp<ViewStyle>;
};

/** Square-ish choice button: teal when selected. */
export function OptionButton({ label, selected, onPress, icon, size = 'lg', style }: OptionButtonProps) {
  const s = optionSizes[size];
  const fg = selected ? colors.textOnPrimary : colors.text;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={[
        styles.option,
        { height: s.height, borderRadius: s.radius },
        selected
          ? { backgroundColor: colors.primary, borderColor: colors.primary, borderWidth: s.onBorder }
          : { backgroundColor: s.offBg, borderColor: colors.border, borderWidth: 1 },
        style,
      ]}>
      {icon?.(fg)}
      <AppText size={s.fontSize} weight="bold" color={fg}>
        {label}
      </AppText>
    </Pressable>
  );
}

const optionSizes = {
  lg: { height: 56, radius: radii.input, fontSize: 16, offBg: colors.surface, onBorder: 2 },
  md: { height: 46, radius: radii.md, fontSize: 13, offBg: colors.background, onBorder: 1 },
  sm: { height: 44, radius: radii.md, fontSize: 13, offBg: colors.surface, onBorder: 1 },
  /** 38px filter buttons (19-CourierReviews). */
  xs: { height: 38, radius: 10, fontSize: 13, offBg: colors.surface, onBorder: 1 },
  /** 42px amount choices (11-Offers bump). */
  chip: { height: 42, radius: radii.md, fontSize: 14, offBg: colors.background, onBorder: 1 },
};

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** Color swatch dot (24-CVehicle colors). */
  swatch?: string;
};

/** Pill chip, optionally with a color dot. */
export function Chip({ label, selected, onPress, swatch }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={[styles.chip, selected ? styles.chipOn : styles.chipOff]}>
      {swatch ? <View style={[styles.swatch, { backgroundColor: swatch }]} /> : null}
      <AppText size={13} weight="bold">
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  chip: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingStart: spacing.lg,
    paddingEnd: spacing.ml,
    borderRadius: radii.pill,
  },
  chipOn: { backgroundColor: colors.primaryTint, borderWidth: 2, borderColor: colors.primary },
  chipOff: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  swatch: { width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: colors.swatchBorder },
});
