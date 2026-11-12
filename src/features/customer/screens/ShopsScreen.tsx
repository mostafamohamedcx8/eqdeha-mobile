import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PinIcon } from '@/components/icons';
import { ShopCard } from '@/components/ShopCard';
import { AppText, Button, ChipRow, FilterChip, ScreenContainer, SearchInput, TopBar } from '@/components/ui';
import { categoriesResponse, DELIVERY, shopsResponse, streetsResponse } from '@/mocks/shops';
import { useOrderDraft } from '@/store/orderDraft';
import { colors, fontSize, spacing } from '@/theme';
import { showErrorPopup } from '@/utils/alert';
import { ar } from '@/utils/format';
import { goBack } from '@/utils/nav';

const ALL = 'all';

/**
 * 06-Shops. Tapping a shop adds it to the order and opens 07-ShopOrder.
 * With `?pick=1` (from "ضيف محل تاني") it adds the shop and goes back.
 */
export default function ShopsScreen() {
  const params = useLocalSearchParams<{ category?: string; pick?: string }>();
  const [cat, setCat] = useState(params.category ?? ALL);
  const [street, setStreet] = useState(ALL);
  const [q, setQ] = useState('');
  const draftShops = useOrderDraft((s) => s.shops);
  const addShop = useOrderDraft((s) => s.addShop);
  const picking = params.pick === '1';

  const shops = useMemo(() => {
    const query = q.trim();
    return shopsResponse.data.filter(
      (s) => (cat === ALL || s.categoryId === cat) && (street === ALL || s.street === street) && (!query || s.name.includes(query)),
    );
  }, [cat, street, q]);

  const open = (shopId: number) => {
    if (!addShop(shopId)) {
      showErrorPopup(`أقصى حاجة ${ar(DELIVERY.maxShops)} محلات في نفس الأوردر`, 'مينفعش تضيف محل تاني');
      return;
    }
    if (picking) router.back();
    else router.push('/shop-order');
  };

  return (
    <ScreenContainer
      statusBar="light"
      header={
        <>
          <TopBar title={picking ? 'ضيف محل للأوردر' : 'المحلات'} onBack={() => goBack('/home')}>
            <SearchInput value={q} onChangeText={setQ} placeholder="دوّر باسم المحل" />
          </TopBar>
          <View style={styles.filters}>
            <ChipRow>
              <FilterChip label="الكل" selected={cat === ALL} onPress={() => setCat(ALL)} />
              {categoriesResponse.data.map((c) => (
                <FilterChip key={c.id} label={c.name} selected={cat === c.id} onPress={() => setCat(c.id)} />
              ))}
            </ChipRow>
            <ChipRow leading={<PinIcon size={18} color={colors.textMuted} />}>
              <FilterChip variant="street" label="كل الشوارع" selected={street === ALL} onPress={() => setStreet(ALL)} />
              {streetsResponse.data.map((s) => (
                <FilterChip key={s} variant="street" label={s} selected={street === s} onPress={() => setStreet(s)} />
              ))}
            </ChipRow>
          </View>
        </>
      }
      contentStyle={styles.list}>
      <AppText size={fontSize.body2} color={colors.textMuted}>
        {`${ar(shops.length)} محل في منطقتك`}
      </AppText>
      {shops.map((s) => (
        <ShopCard key={s.id} shop={s} added={draftShops.some((d) => d.shopId === s.id)} onPress={() => open(s.id)} />
      ))}
      {shops.length === 0 ? (
        <View style={styles.empty}>
          <AppText size={fontSize.lg} weight="bold" center>
            مفيش محلات بالفلتر ده
          </AppText>
          <AppText size={fontSize.body} color={colors.textMuted} center>
            جرّب تغيّر النوع أو الشارع، أو اطلب أي حاجة والمندوب يدوّرلك
          </AppText>
          <Button title="اطلب أي حاجة" onPress={() => router.push('/any-order')} style={styles.emptyBtn} />
        </View>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  filters: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.md + spacing.sm,
    gap: spacing.ml,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  list: { paddingTop: spacing.xl, paddingHorizontal: spacing.xxl, paddingBottom: spacing.s24, gap: spacing.ml },
  empty: { paddingVertical: 40, paddingHorizontal: spacing.xxl, gap: spacing.md, alignItems: 'center' },
  emptyBtn: { height: 44, marginTop: spacing.sm, borderRadius: 12 },
});
