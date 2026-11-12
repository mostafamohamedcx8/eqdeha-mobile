import { forwardRef, useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputInstance, type TextInputProps } from 'react-native';

import { colors, fonts, radii, sizes, spacing } from '@/theme';

import { Field, inputBorder } from './Field';

export type TextFieldProps = Omit<TextInputProps, 'style'> & {
  label?: string;
  required?: boolean;
  hint?: string;
  error?: string | null;
  /** Icon shown at the end side of the box (left in RTL), e.g. calendar. */
  trailing?: React.ReactNode;
  /** md = 52px white box; sm = 48px beige box used inside cards. */
  size?: 'md' | 'lg' | 'sm' | 'xs';
  /** Trailing element is a button (eye toggle) instead of a decorative icon. */
  trailingInteractive?: boolean;
  /** Input content that is always LTR (email, wallet, phone). */
  ltr?: boolean;
};

export const TextField = forwardRef<TextInputInstance, TextFieldProps>(function TextField(
  { label, required, hint, error, trailing, size = 'md', trailingInteractive, ltr, onFocus, onBlur, ...input },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const s = sizeStyles[size];
  const border = inputBorder(focused, !!error);
  // keep text from shifting when the border gets thicker
  const pad = spacing.xxl - (border.borderWidth - 1);

  return (
    <Field label={label} required={required} hint={hint} error={error}>
      <View>
        <TextInput
          ref={ref}
          placeholderTextColor={colors.placeholder}
          cursorColor={colors.primary}
          selectionColor={colors.primary}
          {...input}
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
            s,
            border,
            { paddingStart: pad, paddingEnd: trailing ? (trailingInteractive ? 52 : 48) : pad },
            ltr && styles.ltrText,
          ]}
        />
        {trailing ? (
          <View
            pointerEvents={trailingInteractive ? 'box-none' : 'none'}
            style={[styles.trailing, trailingInteractive && styles.trailingButton]}>
            {trailing}
          </View>
        ) : null}
      </View>
    </Field>
  );
});

const sizeStyles = StyleSheet.create({
  md: { height: sizes.input, borderRadius: radii.input, fontSize: 16, backgroundColor: colors.surface },
  lg: { height: sizes.inputLg, borderRadius: radii.input, fontSize: 16, backgroundColor: colors.surface },
  sm: { height: 48, borderRadius: radii.md, fontSize: 15, backgroundColor: colors.background },
  xs: { height: 46, borderRadius: radii.md, fontSize: 14, backgroundColor: colors.background },
});

const styles = StyleSheet.create({
  input: {
    fontFamily: fonts.regular,
    color: colors.text,
    paddingVertical: 0,
    textAlignVertical: 'center',
  },
  ltrText: { writingDirection: 'ltr' },
  trailing: {
    position: 'absolute',
    end: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  trailingButton: { end: 6 },
});
