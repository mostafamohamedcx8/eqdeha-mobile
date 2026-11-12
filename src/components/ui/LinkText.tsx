import { Text, type TextStyle, type StyleProp } from 'react-native';

import { colors, fonts, type FontWeight } from '@/theme';

type Props = {
  children: React.ReactNode;
  onPress: () => void;
  weight?: FontWeight;
  color?: string;
  underline?: boolean;
  size?: number;
  style?: StyleProp<TextStyle>;
};

/** Inline teal link. Can be nested inside an <AppText> paragraph. */
export function LinkText({ children, onPress, weight = 'extrabold', color = colors.primary, underline, size, style }: Props) {
  return (
    <Text
      onPress={onPress}
      accessibilityRole="link"
      suppressHighlighting
      style={[
        { fontFamily: fonts[weight], color },
        size ? { fontSize: size } : null,
        underline && { textDecorationLine: 'underline' },
        style,
      ]}>
      {children}
    </Text>
  );
}
