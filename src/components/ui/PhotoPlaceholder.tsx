import { Image } from 'expo-image';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ImageIcon } from '@/components/icons';
import { colors, radii, spacing } from '@/theme';

import { AppText } from './AppText';

type Props = {
  /** Real photo URI; without it the beige sample box from the design is shown. */
  uri?: string | null;
  caption?: string;
  height: number;
  width?: number;
  iconSize?: number;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Photo box: a picked/sent image, or the design's "صورة ..." placeholder. */
export function PhotoPlaceholder({ uri, caption, height, width, iconSize = 40, children, style }: Props) {
  return (
    <View style={[styles.box, { height, width }, style]}>
      {uri && uri !== 'placeholder' ? (
        <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" />
      ) : (
        <>
          <ImageIcon size={iconSize} color={colors.photoIcon} strokeWidth={1.6} />
          {caption ? (
            <AppText size={13} color={colors.photoText}>
              {caption}
            </AppText>
          ) : null}
        </>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: radii.input,
    backgroundColor: colors.photoBg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    overflow: 'hidden',
  },
});
