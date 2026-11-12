import { StyleSheet, View, type TextInputInstance } from 'react-native';

import { PasswordField } from '@/components/ui';
import { spacing } from '@/theme';
import { confirmPasswordError, passwordError } from '@/utils/validation';

type Props = {
  password: string;
  confirm: string;
  onChangePassword: (v: string) => void;
  onChangeConfirm: (v: string) => void;
  showErrors: boolean;
  label?: string;
  size?: 'md' | 'lg';
  /** Error from the backend for the password (shown instead of the local one). */
  passwordServerError?: string | null;
  passwordRef?: React.Ref<TextInputInstance>;
  confirmRef?: React.Ref<TextInputInstance>;
};

/** Password + confirm, with the live rules under the first field. */
export function PasswordPair({
  password,
  confirm,
  onChangePassword,
  onChangeConfirm,
  showErrors,
  label = 'الباسورد',
  size = 'md',
  passwordServerError,
  passwordRef,
  confirmRef,
}: Props) {
  // Show mismatch as soon as the confirm field is as long as the password.
  const confirmErr = showErrors || confirm.length >= password.length ? confirmPasswordError(password, confirm) : null;
  return (
    <View style={styles.wrap}>
      <PasswordField
        ref={passwordRef}
        label={label}
        required
        size={size}
        value={password}
        onChangeText={onChangePassword}
        error={passwordServerError ?? (showErrors ? passwordError(password) : null)}
        textContentType="newPassword"
        showRules
      />
      <PasswordField
        ref={confirmRef}
        label="تأكيد الباسورد"
        required
        size={size}
        value={confirm}
        onChangeText={onChangeConfirm}
        error={confirm || showErrors ? confirmErr : null}
        textContentType="newPassword"
      />
    </View>
  );
}

export function passwordPairValid(password: string, confirm: string) {
  return !passwordError(password) && !confirmPasswordError(password, confirm);
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xxl },
});
