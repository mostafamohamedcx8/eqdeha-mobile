import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, StatusPill } from '@/components/ui';
import { categoryById, shopInitial } from '@/mocks/shops';
import type { Shop } from '@/mocks/types';
import { colors, fontSize, radii, spacing } from '@/theme';

type Props = { shop: Shop; onPress: () => void; added?: boolean };

/** Shop row from 06-Shops: colored letter tile, name, category · street, hours, open/closed pill. */
export function ShopCard({ shop, onPress, added }: Props) {
  const cat = categoryById(shop.categoryId);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={shop.name}
      style={({ pressed }) => [styles.card, !shop.open && styles.closed, pressed && styles.pressed]}>
      <View style={[styles.tile, { backgroundColor: cat?.bg }]}>
        <AppText size={24} weight="extrabold" color={cat?.fg}>
          {shopInitial(shop.name)}
        </AppText>
      </View>
      <View style={styles.texts}>
        <AppText size={fontSize.lg} weight="bold" numberOfLines={1}>
          {shop.name}
        </AppText>
        <AppText size={fontSize.body2} color={colors.textMuted}>
          {`${cat?.name ?? ''} · ${shop.street}`}
        </AppText>
        <AppText size={fontSize.sm} color={colors.textMuted}>
          {shop.hours}
        </AppText>
      </View>
      {added ? (
        <StatusPill label="في الأوردر" tone="primary" />
      ) : (
        <StatusPill label={shop.open ? 'مفتوح' : 'مقفول'} tone={shop.open ? 'success' : 'danger'} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
  },
  closed: { opacity: 0.6 },
  pressed: { opacity: 0.85 },
  tile: { width: 56, height: 56, borderRadius: radii.button, alignItems: 'center', justifyContent: 'center' },
  texts: { flex: 1, minWidth: 0, gap: spacing.xxs },
});
