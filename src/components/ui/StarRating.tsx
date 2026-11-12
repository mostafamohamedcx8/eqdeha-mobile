import { Pressable, StyleSheet, View } from 'react-native';

import { RatingStar, StarFilledIcon } from '@/components/icons';
import { colors } from '@/theme';
import { ar, rating as fmtRating } from '@/utils/format';

import { AppText } from './AppText';
import { DirectionView } from './DirectionView';

/** 5 tappable stars, 1 on the left like the design (dir="ltr"). */
export function StarRating({ value, onChange, size = 38 }: { value: number; onChange: (v: number) => void; size?: number }) {
  return (
    <DirectionView dir="ltr" style={styles.row} accessibilityRole="adjustable" accessibilityValue={{ min: 1, max: 5, now: value }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Pressable
          key={i}
          onPress={() => onChange(i)}
          accessibilityRole="button"
          accessibilityLabel={`${ar(i)} نجوم`}
          style={{ width: size + 10, height: size + 10, alignItems: 'center', justifyContent: 'center' }}>
          <RatingStar size={size} filled={i <= value} />
        </Pressable>
      ))}
    </DirectionView>
  );
}

/** Read-only row of small filled stars. */
export function StarRow({ count = 5, size = 14 }: { count?: number; size?: number }) {
  return (
    <DirectionView dir="ltr" style={styles.small}>
      {Array.from({ length: count }, (_, i) => (
        <StarFilledIcon key={i} size={size} />
      ))}
    </DirectionView>
  );
}

/** "★ ٤٫٩ · ..." meta line used on courier cards. */
export function RatingMeta({ rating, text, size = 12, starSize = 14 }: { rating: number; text: string; size?: number; starSize?: number }) {
  return (
    <View style={styles.meta}>
      <StarFilledIcon size={starSize} />
      <AppText size={size} color={colors.textMuted} style={styles.metaText}>
        {`${fmtRating(rating)} · ${text}`}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 0 },
  small: { flexDirection: 'row', gap: 1 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { flexShrink: 1 },
});
