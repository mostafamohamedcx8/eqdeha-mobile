import { Pressable, StyleSheet } from 'react-native';

import { BackIcon } from '@/components/icons';
import { colors, radii, sizes } from '@/theme';

type Props = {
  onPress: () => void;
  /** onPrimary = teal-light square inside a teal header; onLight = white bordered square. */
  tone?: 'onPrimary' | 'onLight';
};

export function BackButton({ onPress, tone = 'onPrimary' }: Props) {
  const onPrimary = tone === 'onPrimary';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="رجوع"
      hitSlop={6}
      style={({ pressed }) => [styles.base, onPrimary ? styles.onPrimary : styles.onLight, pressed && styles.pressed]}>
      <BackIcon color={onPrimary ? colors.textOnPrimary : colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: sizes.backButton,
    height: sizes.backButton,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  onPrimary: { backgroundColor: colors.primaryLight },
  onLight: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.divider },
  pressed: { opacity: 0.8 },
});
