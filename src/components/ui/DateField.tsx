import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputInstance } from 'react-native';

import { colors, fonts, fontSize, radii, sizes, spacing } from '@/theme';
import { onlyDigits, type DateParts } from '@/utils/validation';

import { AppText } from './AppText';
import { Field, inputBorder } from './Field';

type Props = {
  label?: string;
  required?: boolean;
  value: DateParts;
  onChange: (value: DateParts) => void;
  error?: string | null;
};

type Part = keyof DateParts;

const parts: { key: Part; caption: string; placeholder: string; maxLength: number; flex: number }[] = [
  { key: 'day', caption: 'اليوم', placeholder: '٢٠', maxLength: 2, flex: 1 },
  { key: 'month', caption: 'الشهر', placeholder: '٥', maxLength: 2, flex: 1 },
  { key: 'year', caption: 'السنة', placeholder: '١٩٩٨', maxLength: 4, flex: 1.4 },
];

/**
 * Date as three boxes: day · month · year (right → left in RTL).
 * Typing a full day / month moves to the next box; backspace in an empty box goes back.
 * Arabic-Indic digits are accepted and stored as 0-9.
 */
export const DateField = forwardRef<{ focus: () => void }, Props>(function DateField(
  { label, required, value, onChange, error },
  ref,
) {
  const refs = useRef<Record<Part, TextInputInstance | null>>({ day: null, month: null, year: null });

  // focus(): the first box that is empty or not complete (else the day).
  useImperativeHandle(ref, () => ({
    focus: () => {
      const target = parts.find((p) => value[p.key].length < (p.key === 'year' ? 4 : 1)) ?? parts[0];
      refs.current[target.key]?.focus();
    },
  }));
  const [focused, setFocused] = useState<Part | null>(null);

  const change = (index: number, text: string) => {
    const p = parts[index];
    const digits = onlyDigits(text).slice(0, p.maxLength);
    onChange({ ...value, [p.key]: digits });
    const next = parts[index + 1];
    if (next && digits.length === p.maxLength) refs.current[next.key]?.focus();
  };

  return (
    <Field label={label} required={required} error={error}>
      <View style={styles.row}>
        {parts.map((p, i) => {
          const border = inputBorder(focused === p.key, !!error);
          return (
            <View key={p.key} style={[styles.part, { flex: p.flex }]}>
              <TextInput
                ref={(r) => {
                  refs.current[p.key] = r;
                }}
                value={value[p.key]}
                onChangeText={(t) => change(i, t)}
                onKeyPress={({ nativeEvent }) => {
                  const prev = parts[i - 1];
                  if (nativeEvent.key === 'Backspace' && !value[p.key] && prev) refs.current[prev.key]?.focus();
                }}
                onFocus={() => setFocused(p.key)}
                onBlur={() => setFocused((f) => (f === p.key ? null : f))}
                keyboardType="number-pad"
                maxLength={p.maxLength}
                placeholder={p.placeholder}
                placeholderTextColor={colors.placeholder}
                cursorColor={colors.primary}
                selectionColor={colors.primary}
                accessibilityLabel={`${label ?? 'التاريخ'} - ${p.caption}`}
                returnKeyType={i < parts.length - 1 ? 'next' : 'done'}
                onSubmitEditing={() => {
                  const next = parts[i + 1];
                  if (next) refs.current[next.key]?.focus();
                }}
                style={[styles.input, border]}
              />
              <AppText size={fontSize.sm} color={colors.textMuted} center>
                {p.caption}
              </AppText>
            </View>
          );
        })}
      </View>
    </Field>
  );
});

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.ml },
  part: { gap: spacing.xs },
  input: {
    height: sizes.input,
    borderRadius: radii.input,
    backgroundColor: colors.surface,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    writingDirection: 'ltr',
    paddingVertical: 0,
    paddingHorizontal: spacing.md,
    textAlignVertical: 'center',
  },
});
