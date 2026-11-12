import { Pressable, StyleSheet, View } from 'react-native';

import { CheckIcon } from '@/components/icons';
import { colors, spacing } from '@/theme';

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Label content; may contain <LinkText> (those keep their own onPress). */
  children: React.ReactNode;
  hasError?: boolean;
  /** success = green box (29-CDeliver "استلمت الفلوس"). */
  tone?: 'primary' | 'success';
};

/** 22px teal checkbox with a multi-line label beside it (01-Main, 21-CPhone). */
export function Checkbox({ checked, onChange, children, hasError, tone = 'primary' }: Props) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      style={styles.row}>
      <View style={[styles.box, checked ? (tone === 'success' ? styles.onSuccess : styles.on) : hasError ? styles.error : styles.off]}>
        {checked ? <CheckIcon size={16} color={colors.surface} strokeWidth={3} /> : null}
      </View>
      <View style={styles.label}>{children}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.lg, paddingVertical: spacing.xs },
  box: { width: 22, height: 22, marginTop: 3, borderRadius: 5, alignItems: 'center', justifyContent: 'center' },
  on: { backgroundColor: colors.primary },
  onSuccess: { backgroundColor: colors.success },
  off: { borderWidth: 2, borderColor: colors.primary, backgroundColor: colors.surface },
  error: { borderWidth: 2, borderColor: colors.danger, backgroundColor: colors.surface },
  label: { flex: 1 },
});
