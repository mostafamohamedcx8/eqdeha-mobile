import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, Card, Checkbox, FieldError, FooterBar, KeyValueRow, OptionButton, ScreenContainer, SectionTitle, TopBar } from '@/components/ui';
import { courierOrderResponse } from '@/mocks/courier';
import { DELIVERY } from '@/mocks/shops';
import { useCourier } from '@/store/courier';
import { colors, fontSize, radii, spacing } from '@/theme';
import { ar, money, orderNo } from '@/utils/format';
import { goBack, resetTo } from '@/utils/nav';
import { formatLocalPhone } from '@/utils/phone';

/** 29-CDeliver: final invoice, how the customer paid, then "تم التسليم". */
export default function CourierDeliverScreen() {
  const order = courierOrderResponse.data;
  const { invoices, debt, completeDelivery } = useCourier();
  const [pay, setPay] = useState<'cash' | 'wallet'>('cash');
  const [got, setGot] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  // Sent invoices, or the sample totals when previewing this screen directly.
  const shopTotals = order.shops.map((s, i) => invoices[i]?.total ?? s.invoiceItems.reduce((a, it) => a + it.price, 0));
  const due = shopTotals.reduce((a, b) => a + b, 0) + order.fee;
  const extra = Math.max(0, order.shops.length - 1) * DELIVERY.perExtraShop;

  const done = () => {
    setSubmitted(true);
    if (!got) return;
    completeDelivery();
    resetTo('/courier-home');
  };

  return (
    <ScreenContainer
      statusBar="light"
      header={
        <TopBar
          title="سلّم وحصّل"
          titleSize={19}
          subtitle={`أوردر ${orderNo(order.id)} · ${order.customer.firstName} · ${order.address.split('، الدور')[0]}`}
          onBack={() => goBack('/courier-chat')}
          paddingTop={48}
          paddingBottom={14}
        />
      }
      footer={
        <FooterBar paddingTop={12} paddingBottom={26}>
          <Button variant="success" title="تم التسليم" weight="extrabold" onPress={done} />
        </FooterBar>
      }
      contentStyle={styles.body}>
      <Card padding={spacing.xl} gap={spacing.md}>
        <SectionTitle>الفاتورة النهائية</SectionTitle>
        {order.shops.map((s, i) => (
          <KeyValueRow key={s.shopId} label={s.shopName} value={money(shopTotals[i])} color={colors.textMuted} />
        ))}
        <KeyValueRow label={`التوصيل (${ar(DELIVERY.base)} + ${ar(extra)})`} value={money(order.fee)} color={colors.textMuted} />
        <View style={styles.due}>
          <AppText size={fontSize.md} weight="extrabold">
            تحصّل من العميل
          </AppText>
          <AppText size={fontSize.h1} weight="extrabold" color={colors.primary}>
            {money(due)}
          </AppText>
        </View>
      </Card>

      <Card padding={spacing.xl} gap={spacing.ml}>
        <SectionTitle>العميل دفع إزاي؟</SectionTitle>
        <View style={styles.grid}>
          <OptionButton size="sm" label="كاش في إيدي" selected={pay === 'cash'} onPress={() => setPay('cash')} style={styles.opt} />
          <OptionButton size="sm" label="حوّل على محفظتي" selected={pay === 'wallet'} onPress={() => setPay('wallet')} style={styles.opt} />
        </View>
        <View style={styles.gotBox}>
          <Checkbox checked={got} onChange={setGot} tone="success" hasError={submitted && !got}>
            {pay === 'cash' ? (
              <AppText size={fontSize.body} weight="semibold">{`استلمت ${money(due)} كاش من العميل`}</AppText>
            ) : (
              <View>
                <AppText size={fontSize.body} weight="semibold">{`وصلني ${money(due)} على محفظتي`}</AppText>
                <AppText size={fontSize.sm} color={colors.textMuted} style={styles.ltr}>
                  {`فودافون كاش · ${formatLocalPhone('01122334455')}`}
                </AppText>
              </View>
            )}
          </Checkbox>
        </View>
        {pay === 'wallet' ? (
          <AppText size={fontSize.sm} lineHeight={1.6} color={colors.textMuted}>
            اتأكد إن التحويل وصل قبل ما تسلّم.
          </AppText>
        ) : null}
        {submitted && !got ? <FieldError message="أكّد إنك استلمت الفلوس الأول" /> : null}
      </Card>

      <View style={styles.earn}>
        <KeyValueRow label="ليك من التوصيل" value={`+${money(order.courierShare)}`} valueWeight="extrabold" valueColor={colors.successText} />
        <KeyValueRow
          label={`عمولة التطبيق (${ar(order.commissionPct)}٪ من ${ar(order.fee)})`}
          value={`−${money(order.commission)}`}
          valueWeight="extrabold"
          valueColor={colors.dangerText}
        />
        <AppText size={fontSize.sm} color={colors.primary} style={styles.earnNote}>
          {`العمولة بتتضاف على اللي عليك: من −${ar(debt)} لـ −${ar(debt + order.commission)} ج`}
        </AppText>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, gap: spacing.lg },
  ltr: { writingDirection: 'ltr' },
  due: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    paddingVertical: spacing.ml,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    backgroundColor: colors.background,
  },
  grid: { flexDirection: 'row', gap: spacing.md },
  opt: { height: 48 },
  gotBox: { paddingVertical: spacing.xs, paddingHorizontal: spacing.lg, borderRadius: radii.md, backgroundColor: colors.background },
  earn: { gap: spacing.xs, paddingVertical: spacing.lg, paddingHorizontal: spacing.xl, borderRadius: radii.button, backgroundColor: colors.primaryTint },
  earnNote: { marginTop: 2 },
});
