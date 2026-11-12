import { forwardRef, useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputInstance, type TextInputProps } from 'react-native';

import { colors, fonts, radii, spacing } from '@/theme';
import { ar } from '@/utils/format';

import { AppText } from './AppText';
import { Field, inputBorder } from './Field';

type Props = Omit<TextInputProps, 'style' | 'multiline' | 'maxLength' | 'value' | 'onChangeText'> & {
  value: string;
  onChangeText: (v: string) => void;
  label?: string;
  error?: string | null;
  /** Visible lines (HTML `rows`). */
  rows?: number;
  /** Max characters; a live "٠/٥٠٠" counter shows under the box. */
  maxLength?: number;
  /** white = 23px white box (chat composer etc.); default beige box inside cards. */
  tone?: 'beige' | 'white';
};

const LINE = 24; // 15px * 1.6

/** Multi-line input with a character counter (07-ShopOrder, 08-AnyOrder, 16-Delivered...). */
export const TextArea = forwardRef<TextInputInstance, Props>(function TextArea(
  { value, onChangeText, label, error, rows = 3, maxLength = 500, tone = 'beige', onFocus, onBlur, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const near = value.length >= maxLength * 0.9;
  return (
    <Field label={label} error={error}>
      <View style={styles.wrap}>
        <TextInput
          ref={ref}
          {...rest}
          value={value}
          onChangeText={(t) => onChangeText(t.slice(0, maxLength))}
          maxLength={maxLength}
          multiline
          textAlignVertical="top"
          placeholderTextColor={colors.placeholder}
          cursorColor={colors.primary}
          selectionColor={colors.primary}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[
            styles.input,
            { minHeight: rows * LINE + 24, backgroundColor: tone === 'white' ? colors.surface : colors.background },
            inputBorder(focused, !!error),
          ]}
        />
        <AppText size={11} color={near ? colors.dangerStrong : colors.textMuted} style={styles.counter}>
          {`${ar(value.length)}/${ar(maxLength)}`}
        </AppText>
      </View>
    </Field>
  );
});

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  input: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: radii.input,
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: LINE,
    color: colors.text,
  },
  counter: { alignSelf: 'flex-end' },
});
