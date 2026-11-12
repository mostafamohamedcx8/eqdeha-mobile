import { useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputInstance } from 'react-native';

import { colors, fonts, radii } from '@/theme';
import { onlyDigits } from '@/utils/validation';

import { AppText } from './AppText';
import { DirectionView } from './DirectionView';

type Props = {
  value: string;
  onChangeText: (code: string) => void;
  length?: number;
  hasError?: boolean;
  autoFocus?: boolean;
};

/**
 * 6 boxes (03-Otp): filled = green border, current = teal 2px, empty = grey.
 * One hidden TextInput drives them so paste / SMS autofill work.
 */
export function OtpInput({ value, onChangeText, length = 6, hasError, autoFocus = true }: Props) {
  const ref = useRef<TextInputInstance>(null);
  const [focused, setFocused] = useState(false);
  const active = Math.min(value.length, length - 1);

  return (
    <DirectionView dir="ltr">
    <Pressable onPress={() => ref.current?.focus()} accessibilityLabel="كود التفعيل" style={styles.row}>
      {Array.from({ length }, (_, i) => {
        const digit = value[i] ?? '';
        const isActive = focused && i === active && value.length < length;
        return (
          <View
            key={i}
            style={[
              styles.box,
              hasError && !digit
                ? styles.error
                : isActive
                  ? styles.active
                  : digit
                    ? styles.filled
                    : styles.empty,
            ]}>
            <AppText size={26} weight="bold">
              {digit}
            </AppText>
          </View>
        );
      })}
      <TextInput
        ref={ref}
        value={value}
        onChangeText={(t) => onChangeText(onlyDigits(t).slice(0, length))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={length}
        autoFocus={autoFocus}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        caretHidden
        style={styles.hidden}
      />
    </Pressable>
    </DirectionView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  box: {
    width: 48,
    height: 60,
    borderRadius: radii.input,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: { borderWidth: 1, borderColor: colors.border },
  filled: { borderWidth: 1.5, borderColor: colors.success },
  active: { borderWidth: 2, borderColor: colors.primary },
  error: { borderWidth: 1.5, borderColor: colors.danger },
  // Kept on screen (not display:none) so the keyboard can still target it.
  hidden: { position: 'absolute', width: 1, height: 1, opacity: 0, fontFamily: fonts.regular },
});
