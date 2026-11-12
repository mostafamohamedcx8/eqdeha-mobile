import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { OfferCard } from '@/components/OfferCard';
import { AppText, Button, Card, OptionButton, ScreenContainer, SectionTitle, TopBar } from '@/components/ui';
import { OFFER_BUMPS } from '@/mocks/orders';
import { useActiveOrder, visibleOffers } from '@/store/activeOrder';
import { useOrderDraft } from '@/store/orderDraft';
import { colors, fontSize, radii, spacing } from '@/theme';
import { confirmAction } from '@/utils/alert';
import { ar, money, orderNo } from '@/utils/format';
import { goBack, resetTo } from '@/utils/nav';

/** 11-Offers: couriers' answers to an "anything" order. */
export default function OffersScreen() {
  const { order, rejectedOfferIds, rejectOffer, acceptOffer, reset } = useActiveOrder();
  const draft = useOrderDraft();
  const offers = visibleOffers(rejectedOfferIds);

  const cancel = () =>
    confirmAction('إلغاء الطلب', 'متأكد إنك عايز تلغي الطلب؟', 'إلغاء الطلب', () => {
      reset();
      draft.reset();
      resetTo('/home');
    });

  return (
    <ScreenContainer
      statusBar="light"
      header={
        <TopBar
          title="عروض المناديب"
          subtitle={`أوردر ${orderNo(order.id)} · طلبك اتبعت للمناديب القريبين`}
          onBack={() => goBack('/any-order')}
          paddingBottom={20}>
          <View style={styles.summary}>
            <View style={styles.flex}>
              <AppText size={fontSize.sm} color={colors.textOnPrimaryMuted}>
                عرضك لسعر التوصيل
              </AppText>
              <AppText size={fontSize.h2} weight="extrabold" color={colors.textOnPrimary}>
                {money(draft.offer)}
              </AppText>
            </View>
            <View style={styles.wish}>
              <AppText size={fontSize.sm} color={colors.textOnPrimaryMuted}>
                طلبك
              </AppText>
              <AppText size={fontSize.body2} weight="semibold" color={colors.textOnPrimary} numberOfLines={1}>
                {draft.wish.trim() || order.wishSummary}
              </AppText>
            </View>
          </View>
        </TopBar>
      }
      contentStyle={styles.body}>
      <View style={styles.live}>
        <View style={styles.ring}>
          <View style={styles.dot} />
        </View>
        <AppText size={fontSize.body} weight="bold">
          {offers.length ? `وصلك ${ar(offers.length)} عروض لحد دلوقتي` : 'مستنيين عروض جديدة...'}
        </AppText>
      </View>

      {offers.map((o) => (
        <OfferCard
          key={o.id}
          offer={o}
          onReject={() => rejectOffer(o.id)}
          onAccept={() => {
            acceptOffer(o.courier, o.price);
            router.replace('/tracking');
          }}
        />
      ))}

      <Card padding={spacing.xl} gap={spacing.ml}>
        <SectionTitle>محدش عاجبك؟ زوّد عرضك</SectionTitle>
        <View style={styles.bumps}>
          {OFFER_BUMPS.map((v) => (
            <OptionButton key={v} size="chip" label={money(v)} selected={draft.offer === v} onPress={() => draft.changeOffer(v - draft.offer)} />
          ))}
        </View>
        <AppText size={fontSize.sm} color={colors.textMuted}>
          العرض الجديد بيوصل لكل المناديب القريبين تاني
        </AppText>
      </Card>

      <Button variant="danger" title="إلغاء الطلب" onPress={cancel} style={styles.cancel} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.primaryLight,
    borderRadius: radii.input,
  },
  wish: { alignItems: 'flex-end', maxWidth: '55%' },
  body: { padding: spacing.xxl, gap: spacing.lg },
  live: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  ring: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.successBg, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.success },
  bumps: { flexDirection: 'row', gap: spacing.md },
  cancel: { borderRadius: radii.input },
});
