import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii, sizes, spacing, type FontWeight } from '@/theme';

import { AppText } from './AppText';

export type ButtonVariant = 'primary' | 'outline' | 'secondary' | 'disabled' | 'danger' | 'teal' | 'success' | 'dangerSolid';

type Props = {
  title: string;
  onPress?: () => void;
  /**
   * primary = yellow action, outline = white with teal border,
   * secondary = white with grey border, disabled = grey (still pressable so a
   * screen can show a hint, like the terms checkbox nudge in the design).
   */
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  weight?: FontWeight;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  /** Shows a spinner instead of the icon and ignores presses (e.g. while a request is running). */
  loading?: boolean;
  /** Text on the far end (e.g. "١٥ ج توصيل"): title and this spread apart, like the order footers. */
  endText?: string;
  /** Override the label size / color (e.g. smaller buttons inside cards). */
  textSize?: number;
  textColor?: string;
};

const variantStyles = {
  primary: { bg: colors.accent, fg: colors.accentText, height: sizes.button, size: 17, border: undefined },
  outline: { bg: colors.surface, fg: colors.primary, height: sizes.buttonSm, size: 16, border: { width: 1.5, color: colors.primary } },
  secondary: { bg: colors.surface, fg: colors.text, height: sizes.buttonSm, size: 15, border: { width: 1, color: colors.border } },
  disabled: { bg: colors.disabledBg, fg: colors.disabledText, height: sizes.button, size: 17, border: undefined },
  danger: { bg: 'transparent', fg: colors.dangerStrong, height: 48, size: 15, border: { width: 1, color: colors.danger } },
  /** Solid teal (27-CChat step button). */
  teal: { bg: colors.primary, fg: colors.textOnPrimary, height: 50, size: 16, border: undefined },
  /** Solid green (27 deliver step, 29 تم التسليم). */
  success: { bg: colors.success, fg: colors.textOnPrimary, height: 56, size: 17, border: undefined },
  /** Solid red (26 سدّد دلوقتي, 27 أيوه الغي). */
  dangerSolid: { bg: colors.danger, fg: colors.textOnPrimary, height: 48, size: 15, border: undefined },
} as const;

export function Button({ title, onPress, variant = 'primary', icon, weight = 'bold', style, accessibilityLabel, loading = false, endText, textSize, textColor }: Props) {
  const v = variantStyles[variant];
  return (
    <Pressable
      onPress={loading ? undefined : onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: variant === 'disabled', busy: loading }}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: v.bg, height: v.height },
        v.border && { borderWidth: v.border.width, borderColor: v.border.color },
        pressed && variant !== 'disabled' && !loading && styles.pressed,
        loading && styles.loading,
        endText ? styles.spread : null,
        style,
      ]}>
      {loading ? <ActivityIndicator color={v.fg} /> : icon ? <View>{icon}</View> : null}
      <AppText size={textSize ?? v.size} weight={weight} color={textColor ?? v.fg}>
        {title}
      </AppText>
      {endText ? (
        <AppText size={15} weight="bold" color={v.fg}>
          {endText}
        </AppText>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.ml,
    borderRadius: radii.button,
    paddingHorizontal: spacing.xxl,
  },
  pressed: { opacity: 0.85 },
  loading: { opacity: 0.9 },
  spread: { justifyContent: 'space-between', paddingHorizontal: 20 },
});
