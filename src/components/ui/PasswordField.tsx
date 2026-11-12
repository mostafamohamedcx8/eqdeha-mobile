import { forwardRef, useState } from 'react';
import { Pressable, StyleSheet, View, type TextInputInstance } from 'react-native';

import { EyeIcon, EyeOffIcon } from '@/components/icons';
import { colors } from '@/theme';

import { PasswordRules } from './PasswordRules';
import { TextField, type TextFieldProps } from './TextField';

type Props = Omit<TextFieldProps, 'secureTextEntry' | 'trailing' | 'trailingInteractive'> & {
  /** Show the live rule checklist under the field. */
  showRules?: boolean;
};

/** Password input with the eye toggle at the end side (left in RTL), as in 00c-Login. */
export const PasswordField = forwardRef<TextInputInstance, Props>(function PasswordField(
  { showRules, value = '', size = 'lg', ...rest },
  ref,
) {
  const [shown, setShown] = useState(false);

  return (
    <View style={styles.wrap}>
      <TextField
        ref={ref}
        {...rest}
        size={size}
        value={value}
        secureTextEntry={!shown}
        autoCapitalize="none"
        autoCorrect={false}
        textContentType={rest.textContentType ?? 'password'}
        trailingInteractive
        trailing={
          <Pressable
            onPress={() => setShown((s) => !s)}
            accessibilityRole="button"
            accessibilityLabel={shown ? 'اخفي الباسورد' : 'اظهر الباسورد'}
            style={styles.eye}>
            {shown ? <EyeOffIcon color={colors.textMuted} /> : <EyeIcon color={colors.textMuted} />}
          </Pressable>
        }
      />
      {showRules ? <PasswordRules password={value} /> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  eye: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
