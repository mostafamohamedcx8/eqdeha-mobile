import { Image } from 'expo-image';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/theme';

import { AppText } from './AppText';

type Props = {
  initial: string;
  size?: number;
  bg?: string;
  fg?: string;
  uri?: string | null;
  /** Font size of the letter (defaults to ~40% of size). */
  fontSize?: number;
  style?: StyleProp<ViewStyle>;
};

/** Round avatar with the first letter (couriers, reviewers, customers). */
export function Avatar({ initial, size = 50, bg = colors.primaryTint, fg = colors.primary, uri, fontSize, style }: Props) {
  return (
    <View style={[styles.base, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg }, style]}>
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} contentFit="cover" />
      ) : (
        <AppText size={fontSize ?? Math.round(size * 0.4)} weight="extrabold" color={fg}>
          {initial}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 },
});
