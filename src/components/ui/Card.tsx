import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii, spacing } from '@/theme';

type Props = {
  children: React.ReactNode;
  /** card = 18 radius (default), cardLg = 22, sm = 16 (terms sections / courier photo row). */
  radius?: number;
  padding?: number;
  gap?: number;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, radius = radii.card, padding = spacing.xl, gap = spacing.ml, style }: Props) {
  return <View style={[styles.card, { borderRadius: radius, padding, gap }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface },
});
