import { StyleSheet, Text, type TextProps } from 'react-native';

import { colors, fonts, fontSize, type FontWeight } from '@/theme';

export type AppTextProps = TextProps & {
  size?: number;
  weight?: FontWeight;
  color?: string;
  center?: boolean;
  /** Line-height multiplier (CSS `line-height: 1.7` → 1.7). */
  lineHeight?: number;
};

/**
 * Every piece of text in the app goes through this, so it always uses Cairo.
 * Alignment and writing direction stay "natural": inside the RTL root Arabic is
 * right-aligned, while LTR content like "+20" keeps its own order.
 */
export function AppText({
  size = fontSize.body,
  weight = 'regular',
  color = colors.text,
  center,
  lineHeight,
  style,
  ...rest
}: AppTextProps) {
  return (
    <Text
      {...rest}
      style={[
        { fontSize: size, fontFamily: fonts[weight], color },
        lineHeight ? { lineHeight: Math.round(size * lineHeight) } : null,
        center && styles.center,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
});
