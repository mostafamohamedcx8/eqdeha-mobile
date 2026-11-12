import { forwardRef, useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputInstance } from 'react-native';

import { formatEgPhone, onlyDigits } from '@/utils/validation';
import { colors, fonts, radii, sizes, spacing } from '@/theme';

import { AppText } from './AppText';
import { DirectionView } from './DirectionView';
import { Field, inputBorder } from './Field';

type Props = {
  label?: string;
  /** Raw digits as typed (may start with 0). */
  value: string;
  onChangeText: (digits: string) => void;
  error?: string | null;
  autoFocus?: boolean;
  onSubmitEditing?: () => void;
};

/** "+20" box + number input. Always LTR, like the design (dir="ltr"). */
export const PhoneField = forwardRef<TextInputInstance, Props>(function PhoneField(
  { label = 'رقم الموبايل', value, onChangeText, error, autoFocus, onSubmitEditing },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const border = inputBorder(focused, !!error);
  const leading0 = value.startsWith('0');

  return (
    <Field label={label} error={error} gap={spacing.md}>
      <DirectionView dir="ltr" style={styles.row}>
        <View style={styles.code}>
          <AppText size={16} weight="semibold">
            +20
          </AppText>
        </View>
        <TextInput
          ref={ref}
          value={leading0 ? value : formatEgPhone(value)}
          onChangeText={(t) => onChangeText(onlyDigits(t).slice(0, 11))}
          placeholder="10 1234 5678"
          placeholderTextColor={colors.placeholder}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
          maxLength={13}
          autoFocus={autoFocus}
          returnKeyType="done"
          onSubmitEditing={onSubmitEditing}
          cursorColor={colors.primary}
          selectionColor={colors.primary}
          accessibilityLabel={label}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[styles.input, border, { paddingHorizontal: spacing.xxl - (border.borderWidth - 1) }]}
        />
      </DirectionView>
    </Field>
  );
});

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md },
  code: {
    height: sizes.inputLg,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.input,
  },
  input: {
    flex: 1,
    minWidth: 0,
    height: sizes.inputLg,
    paddingVertical: 0,
    backgroundColor: colors.surface,
    borderRadius: radii.input,
    fontFamily: fonts.regular,
    fontSize: 17,
    letterSpacing: 1,
    color: colors.text,
    textAlign: 'left',
    writingDirection: 'ltr',
  },
});
