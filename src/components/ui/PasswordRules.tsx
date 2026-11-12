import { StyleSheet, View } from 'react-native';

import { CheckIcon } from '@/components/icons';
import { colors, fontSize, spacing } from '@/theme';
import { passwordRules } from '@/utils/validation';

import { AppText } from './AppText';

/** Live checklist under a password field: grey ring → green check as each rule is met. */
export function PasswordRules({ password }: { password: string }) {
  return (
    <View style={styles.list} accessibilityLabel="شروط الباسورد">
      {passwordRules.map((rule) => {
        const ok = rule.test(password);
        return (
          <View key={rule.key} style={styles.row} accessibilityState={{ checked: ok }}>
            <View style={[styles.dot, ok ? styles.dotOk : styles.dotOff]}>
              {ok ? <CheckIcon size={12} color={colors.surface} strokeWidth={3} /> : null}
            </View>
            <AppText size={fontSize.body2} weight={ok ? 'semibold' : 'regular'} color={ok ? colors.successText : colors.textMuted}>
              {rule.label}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  dot: { width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  dotOk: { backgroundColor: colors.success },
  dotOff: { borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
});
