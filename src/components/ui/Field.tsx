import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fontSize, spacing } from '@/theme';

import { AppText } from './AppText';

type Props = {
  label?: string;
  required?: boolean;
  /** Small grey line under the label (e.g. wallet field hint). */
  hint?: string;
  error?: string | null;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  gap?: number;
};

/** Label + control + error message. Shared by every input. */
export function Field({ label, required, hint, error, children, style, gap = spacing.sm }: Props) {
  return (
    <View style={[{ gap }, style]}>
      {label ? (
        <View style={styles.labelBlock}>
          <AppText size={fontSize.body} weight="semibold">
            {label}
            {required ? <AppText color={colors.dangerStrong}> *</AppText> : null}
          </AppText>
          {hint ? (
            <AppText size={fontSize.sm} color={colors.textMuted}>
              {hint}
            </AppText>
          ) : null}
        </View>
      ) : null}
      {children}
      {error ? <FieldError message={error} /> : null}
    </View>
  );
}

export function FieldError({ message, center }: { message: string; center?: boolean }) {
  return (
    <AppText size={fontSize.body2} color={colors.dangerStrong} center={center} accessibilityLiveRegion="polite">
      {message}
    </AppText>
  );
}

/** Border for an input box in its current state. */
export function inputBorder(focused: boolean, hasError: boolean) {
  if (hasError) return { borderWidth: 1.5, borderColor: colors.danger };
  if (focused) return { borderWidth: 2, borderColor: colors.primary };
  return { borderWidth: 1, borderColor: colors.border };
}

const styles = StyleSheet.create({
  labelBlock: { gap: 0 },
});
