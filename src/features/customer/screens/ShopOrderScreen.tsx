import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { PlusIcon, TrashIcon } from '@/components/icons';
import {
  AppText,
  Button,
  Card,
  Divider,
  FooterBar,
  KeyValueRow,
  ScreenContainer,
  SectionTitle,
  TextArea,
  TopBar,
} from '@/components/ui';
import { categoryById, DELIVERY, shopById } from '@/mocks/shops';
import { useActiveOrder } from '@/store/activeOrder';
import { shopDeliveryFee, useOrderDraft } from '@/store/orderDraft';
import { colors, fontSize, radii, spacing } from '@/theme';
import { ar, money, moneyPlus } from '@/utils/format';
import { goBack } from '@/utils/nav';

import { DeliveryAddressRow, PaymentChoice } from '../components/OrderFormParts';

/** 07-ShopOrder: one box per shop (max 5), live delivery fee (15 + 5 per extra shop). */
export default function ShopOrderScreen() {
  const draft = useOrderDraft();
  const [submitted, setSubmitted] = useState(false);
  const n = draft.shops.length;
  const extra = Math.max(0, n - 1);
  const total = shopDeliveryFee(n);
  const full = n >= DELIVERY.maxShops;

  const order = () => {
    setSubmitted(true);
    if (n === 0 || draft.shops.some((s) => !s.note.trim())) return;
    useActiveOrder.getState().startShopOrder(draft.shops.map((s) => s.shopId), total);
    router.push('/tracking');
  };

  return (
    <ScreenContainer
      statusBar="light"
      header={
        <TopBar
          title="طلبك من المحلات"
          subtitle={`${ar(n)} ${n === 1 ? 'محل' : 'محلات'} في نفس الأوردر`}
          onBack={() => goBack('/shops')}
        />
      }
      footer={
        <FooterBar paddingTop={12} paddingBottom={28}>
          <Button title="اطلب دلوقتي" weight="extrabold" endText={`${money(total)} توصيل`} onPress={order} />
        </FooterBar>
      }
      contentStyle={styles.body}>
      {draft.shops.map((d, i) => {
        const shop = shopById(d.shopId);
        if (!shop) return null;
        const missing = submitted && !d.note.trim();
        return (
          <Card key={d.shopId} padding={spacing.xl} gap={spacing.ml}>
            <View style={styles.shopHead}>
              <View style={styles.num}>
                <AppText size={fontSize.xl} weight="extrabold" color={colors.textOnPrimary}>
                  {ar(i + 1)}
                </AppText>
              </View>
              <View style={styles.flex}>
                <AppText size={fontSize.lg} weight="bold">
                  {shop.name}
                </AppText>
                <AppText size={fontSize.sm} color={colors.textMuted}>
                  {`${categoryById(shop.categoryId)?.name ?? ''} · ${shop.street}`}
                </AppText>
              </View>
              {n > 1 ? (
                <Pressable
                  onPress={() => draft.removeShop(d.shopId)}
                  accessibilityRole="button"
                  accessibilityLabel="شيل المحل ده"
                  style={styles.remove}>
                  <TrashIcon size={18} color={colors.dangerText} />
                </Pressable>
              ) : null}
            </View>
            <TextArea
              value={d.note}
              onChangeText={(t) => draft.setShopNote(d.shopId, t)}
              placeholder={shop.orderHint}
              accessibilityLabel={`عايز إيه من ${shop.name}`}
              error={missing ? 'اكتب عايز إيه من المحل ده' : null}
            />
          </Card>
        );
      })}

      {n === 0 ? (
        <Card padding={spacing.xl}>
          <AppText size={fontSize.body} color={colors.textMuted} center>
            {submitted ? 'لازم تختار محل واحد على الأقل' : 'لسه مختارتش محلات، اختار محل وابدأ طلبك'}
          </AppText>
        </Card>
      ) : null}

      {full ? (
        <AppText size={fontSize.body2} color={colors.textMuted} center>
          {`وصلت لأقصى عدد (${ar(DELIVERY.maxShops)} محلات في الأوردر)`}
        </AppText>
      ) : (
        <Pressable
          onPress={() => router.push({ pathname: '/shops', params: { pick: '1' } })}
          accessibilityRole="button"
          style={styles.add}>
          <PlusIcon size={20} color={colors.primary} />
          <AppText size={fontSize.md} weight="bold" color={colors.primary}>
            {n === 0 ? 'اختار محل' : `ضيف محل تاني (${moneyPlus(DELIVERY.perExtraShop)})`}
          </AppText>
        </Pressable>
      )}

      <Card padding={spacing.xl} gap={spacing.md}>
        <SectionTitle>توصل فين؟</SectionTitle>
        <DeliveryAddressRow address={draft.delivery} />
      </Card>

      <Card padding={spacing.xl} gap={spacing.md}>
        <SectionTitle>هتدفع إزاي؟</SectionTitle>
        <PaymentChoice value={draft.payment} onChange={draft.setPayment} />
        <AppText size={fontSize.sm} color={colors.textMuted}>
          وهتكسب نقاط على كل أوردر يتسلّم
        </AppText>
      </Card>

      <Card padding={spacing.xl} gap={spacing.md}>
        <SectionTitle>سعر التوصيل</SectionTitle>
        <KeyValueRow label="أول محل" value={money(DELIVERY.base)} color={colors.textMuted} />
        {extra > 0 ? (
          <KeyValueRow label={`محلات زيادة × ${ar(extra)}`} value={moneyPlus(extra * DELIVERY.perExtraShop)} color={colors.textMuted} />
        ) : null}
        <Divider />
        <KeyValueRow label="إجمالي التوصيل" value={money(total)} size={fontSize.lg} weight="extrabold" />
        <AppText size={fontSize.sm} lineHeight={1.6} color={colors.textMuted}>
          تمن الحاجات بيظهرلك في فاتورة كل محل بعد ما المندوب يشتري، ومعاها صورة الحاجة.
        </AppText>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  body: { padding: spacing.xxl, gap: spacing.lg },
  shopHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.ml },
  num: { width: 40, height: 40, borderRadius: radii.md, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  remove: { width: 40, height: 40, borderRadius: radii.md, backgroundColor: colors.dangerBg, alignItems: 'center', justifyContent: 'center' },
  add: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: radii.button,
  },
});
