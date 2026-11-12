import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { Category } from '@/api/catalog';
import { fileUrl } from '@/api/config';
import { CategoryIcon, isCategoryIconKey } from '@/components/CategoryIcon';
import { BellIcon, GlobeIcon, HomeIcon, StarFilledIcon } from '@/components/icons';
import { AppText, Header, LinkText, ScreenContainer } from '@/components/ui';
import { meResponse } from '@/mocks/customer';
import { useCategories } from '@/store/categories';
import { useUnreadCount } from '@/store/customer';
import { usePoints } from '@/store/points';
import { colors, fontSize, radii, spacing } from '@/theme';
import { safeColor } from '@/utils/color';
import { ar } from '@/utils/format';

/** Size of a category icon on Home (was the size of its colored background square). */
const CAT_SIZE = 56;

/** "صباح الخير" from 5:00 AM to 4:59 PM, "مساء الخير" from 5:00 PM to 4:59 AM (phone's local time). */
function greeting() {
  const h = new Date().getHours();
  return h >= 5 && h < 17 ? 'صباح الخير' : 'مساء الخير';
}

/**
 * Icon of a backend category, filling the whole 56×56 square (no colored background behind it):
 * uploaded image → predefined icon (iconKey) → first letter of the name.
 */
function CategoryGlyph({ category, color }: { category: Category; color: string }) {
  const uri = fileUrl(category.iconUrl);
  if (uri) return <Image source={{ uri }} style={styles.catImage} contentFit="cover" />;
  if (isCategoryIconKey(category.iconKey)) return <CategoryIcon icon={category.iconKey} color={color} size={CAT_SIZE} />;
  return (
    <AppText size={CAT_SIZE * 0.6} weight="extrabold" color={color} lineHeight={1.2}>
      {category.name.trim().charAt(0)}
    </AppText>
  );
}

/** "محلات عزبة سكينة" grid — categories come from GET /api/v1/categories (the admin's order). */
function ShopCategories() {
  const items = useCategories((s) => s.items);
  const loading = useCategories((s) => s.loading);
  const error = useCategories((s) => s.error);
  const load = useCategories((s) => s.load);

  // Refresh every time Home is shown, so the admin's changes appear without restarting the app.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (!items) {
    if (error && !loading) {
      return (
        <View style={styles.state}>
          <AppText size={fontSize.body2} color={colors.textMuted} center>
            {error}
          </AppText>
          <LinkText weight="bold" size={fontSize.body} onPress={load}>
            جرب تاني
          </LinkText>
        </View>
      );
    }
    // first load: grey placeholders in the grid's shape
    return (
      <View style={styles.grid} accessibilityLabel="بنحمّل الأقسام">
        {Array.from({ length: 8 }, (_, i) => (
          <View key={i} style={styles.cat}>
            <View style={[styles.catIcon, styles.skeleton]} />
            <View style={[styles.skeletonText, styles.skeleton]} />
          </View>
        ))}
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.state}>
        <AppText size={fontSize.body2} color={colors.textMuted} center>
          لسه مفيش أقسام محلات، هتظهر هنا أول ما تتضاف
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {items.map((c) => {
        const fg = safeColor(c.color, colors.primary);
        return (
          <Pressable
            key={c.id}
            // categoryId = backend id. `category` (= icon key) keeps the Shops screen's mock filter working
            // until that screen is connected to GET /api/v1/shops.
            onPress={() =>
              router.push({
                pathname: '/shops',
                params: c.iconKey ? { categoryId: String(c.id), category: c.iconKey } : { categoryId: String(c.id) },
              })
            }
            accessibilityRole="button"
            accessibilityLabel={c.name}
            style={styles.cat}>
            <View style={styles.catIcon}>
              <CategoryGlyph category={c} color={fg} />
            </View>
            <AppText size={fontSize.sm} weight="semibold" center numberOfLines={1}>
              {c.name}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

/** 05-Home (tab: الرئيسية) */
export default function HomeScreen() {
  const me = meResponse.data;
  const points = usePoints((s) => s.balance);
  const unread = useUnreadCount();

  return (
    <ScreenContainer
      statusBar="light"
      header={
        <Header paddingTop={50} paddingBottom={16} radius={radii.header}>
          <View style={styles.topRow}>
            <View>
              <AppText size={fontSize.body2} color={colors.textOnPrimaryMuted}>
                {greeting()}
              </AppText>
              <AppText size={fontSize.h2} weight="bold" color={colors.textOnPrimary}>
                {`أهلاً يا ${me.firstName}`}
              </AppText>
            </View>
            <View style={styles.actions}>
              <Pressable
                onPress={() => router.push('/points')}
                accessibilityRole="button"
                accessibilityLabel={`نقاطك ${ar(points)} نقطة`}
                style={styles.pointsChip}>
                <StarFilledIcon size={20} />
                <View>
                  <AppText size={10} color={colors.textOnPrimaryMuted} lineHeight={1.2}>
                    نقاطك
                  </AppText>
                  <AppText size={fontSize.body} weight="extrabold" color={colors.textOnPrimary} lineHeight={1.2}>
                    {ar(points)}
                  </AppText>
                </View>
              </Pressable>
              <Pressable
                onPress={() => router.push('/notifications')}
                accessibilityRole="button"
                accessibilityLabel="الإشعارات"
                style={styles.iconBtn}>
                <BellIcon color={colors.textOnPrimary} />
                {unread > 0 ? <View style={styles.dot} /> : null}
              </Pressable>
            </View>
          </View>
        </Header>
      }
      contentStyle={styles.body}>
      <View style={styles.tiles}>
        <Pressable onPress={() => router.push('/any-order')} style={[styles.tile, styles.tileYellow]} accessibilityRole="button">
          <View style={[styles.tileIcon, { backgroundColor: colors.accentSoft }]}>
            <GlobeIcon color={colors.primary} />
          </View>
          <View>
            <AppText size={fontSize.body2} weight="semibold" color={colors.accentTextSoft}>
              اطلب أي حاجة
            </AppText>
            <AppText size={fontSize.xl} weight="extrabold" color={colors.accentText} lineHeight={1.3}>
              من أي مكان
            </AppText>
          </View>
        </Pressable>
        <Pressable onPress={() => router.push('/any-order')} style={[styles.tile, styles.tileTeal]} accessibilityRole="button">
          <View style={[styles.tileIcon, { backgroundColor: colors.primaryLight }]}>
            <HomeIcon color={colors.accent} />
          </View>
          <View>
            <AppText size={fontSize.body2} weight="semibold" color={colors.textOnPrimaryMuted}>
              اطلب أي حاجة
            </AppText>
            <AppText size={fontSize.xl} weight="extrabold" color={colors.textOnPrimary} lineHeight={1.3}>
              من داخل سكينة
            </AppText>
          </View>
        </Pressable>
      </View>

      <View style={styles.shopsCard}>
        <View style={styles.shopsHead}>
          <View style={styles.flex}>
            <AppText size={19} weight="extrabold">
              محلات عزبة سكينة
            </AppText>
            <AppText size={fontSize.body2} color={colors.textMuted}>
              اختار محل أو أكتر في نفس الأوردر
            </AppText>
          </View>
          <LinkText weight="bold" size={fontSize.body} onPress={() => router.push('/shops')}>
            الكل
          </LinkText>
        </View>
        <ShopCategories />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actions: { flexDirection: 'row', gap: spacing.md },
  pointsChip: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    backgroundColor: colors.primaryLight,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // top-left corner of the bell button (= end side in RTL)
  dot: {
    position: 'absolute',
    top: 8,
    end: 9,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.danger,
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  body: { paddingVertical: spacing.s18, paddingHorizontal: spacing.s20, gap: spacing.xl },
  tiles: { flexDirection: 'row', gap: spacing.ml },
  tile: { flex: 1, gap: spacing.md, padding: spacing.xl, borderRadius: radii.card },
  tileYellow: { backgroundColor: colors.accent },
  tileTeal: { backgroundColor: colors.primary },
  tileIcon: { width: 38, height: 38, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  shopsCard: { backgroundColor: colors.surface, borderRadius: radii.cardLg, padding: spacing.s18, gap: spacing.xl },
  shopsHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: spacing.lg },
  cat: { width: '25%', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.xs },
  catIcon: { width: CAT_SIZE, height: CAT_SIZE, alignItems: 'center', justifyContent: 'center' },
  // same rounded square the background used to have
  catImage: { width: CAT_SIZE, height: CAT_SIZE, borderRadius: 18 },
  skeleton: { backgroundColor: colors.border, opacity: 0.5, borderRadius: 18 },
  skeletonText: { width: 44, height: 10, borderRadius: 5 },
  state: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
});
