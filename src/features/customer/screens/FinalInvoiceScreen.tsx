import { router } from 'expo-router';
import { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AppText,
  Button,
  Card,
  DashedDivider,
  FooterBar,
  InvoiceItemRow,
  KeyValueRow,
  LinkText,
  RadioCard,
  ScreenContainer,
  SectionTitle,
  StatusPill,
  TopBar,
} from '@/components/ui';
import { finalItemName } from '@/mocks/orders';
import { DELIVERY } from '@/mocks/shops';
import { type FinalPayment, useActiveOrder } from '@/store/activeOrder';
import { colors, fontSize, radii, spacing } from '@/theme';
import { ar, money, orderNo } from '@/utils/format';
import { goBack } from '@/utils/nav';
import { copyText, formatLocalPhone } from '@/utils/phone';

import { useOrderTotals } from '../orderTotals';

function shopsWord(n: number) {
  if (n === 1) return 'محل واحد';
  if (n === 2) return 'محلين';
  return `${ar(n)} محلات`;
}

/** 15-FinalInvoice: all shops + delivery, then how you'll pay the courier. */
export default function FinalInvoiceScreen() {
  const { order, invoices, goods, due } = useOrderTotals();
  const { finalPayment, setFinalPayment } = useActiveOrder();
  const transfer = finalPayment === 'transfer';
  const c = order.courier;
  const extra = Math.max(0, invoices.length - 1) * DELIVERY.perExtraShop;
  const feeText = extra > 0 ? `${ar(DELIVERY.base)} + ${ar(extra)}` : ar(order.deliveryFee);

  const methods: { id: FinalPayment; title: string; sub: string }[] = [
    { id: 'cash', title: 'كاش للمندوب', sub: 'تدفع الفاتورة كلها وقت الاستلام' },
    { id: 'transfer', title: 'تحويل لمحفظة المندوب', sub: `فودافون كاش أو إنستاباي على رقم ${c.firstName}` },
  ];

  return (
    <ScreenContainer
      statusBar="light"
      header={<TopBar title="الفاتورة النهائية" subtitle={`أوردر ${orderNo(order.id)} · ${order.date}`} onBack={() => goBack('/tracking')} />}
      footer={
        <FooterBar paddingTop={12} paddingBottom={28}>
          <Button title={transfer ? 'حوّلت للمندوب' : 'تمام، هدفع كاش عند الاستلام'} weight="extrabold" onPress={() => router.push('/delivered')} />
        </FooterBar>
      }
      contentStyle={styles.body}>
      <Card padding={spacing.xxl} gap={spacing.md}>
        {invoices.map((inv) => {
          const total = inv.items.reduce((s, i) => s + i.price, 0);
          return (
            <Fragment key={inv.id}>
              <View style={styles.shopHead}>
                <AppText size={fontSize.md} weight="extrabold" color={colors.primary}>
                  {`${ar(inv.index)}. ${inv.shopName}`}
                </AppText>
                <StatusPill label="اتشترت" compact size={11} />
              </View>
              {inv.items.map((it) => (
                <InvoiceItemRow key={it.name} name={finalItemName(it.name)} price={it.price} muted />
              ))}
              <KeyValueRow label="إجمالي المحل" value={money(total)} weight="bold" />
              <DashedDivider style={styles.dashed} />
            </Fragment>
          );
        })}
        <KeyValueRow label="تمن الحاجات" value={money(goods)} color={colors.textMuted} />
        <KeyValueRow label={`التوصيل (${shopsWord(invoices.length)}: ${feeText})`} value={money(order.deliveryFee)} color={colors.textMuted} />
        <View style={styles.due}>
          <AppText size={fontSize.lg} weight="extrabold">
            المطلوب
          </AppText>
          <AppText size={fontSize.h1} weight="extrabold" color={colors.primary}>
            {money(due)}
          </AppText>
        </View>
      </Card>

      <Card padding={spacing.xl} gap={spacing.ml}>
        <SectionTitle>هتدفع إزاي؟</SectionTitle>
        {methods.map((m) => (
          <RadioCard key={m.id} title={m.title} subtitle={m.sub} selected={finalPayment === m.id} onPress={() => setFinalPayment(m.id)} />
        ))}
        {transfer ? (
          <View style={styles.transfer}>
            <AppText size={fontSize.body2} lineHeight={1.6}>
              {'حوّل '}
              <AppText size={fontSize.body2} weight="bold">
                {money(due)}
              </AppText>
              {` للمندوب ${c.firstName} على محفظته:`}
            </AppText>
            <View style={styles.wallet}>
              <View style={[styles.walletBadge, c.wallet.type === 'instapay' && styles.walletBadgeIp]}>
                <AppText size={fontSize.body2} weight="extrabold" color={c.wallet.type === 'instapay' ? colors.primary : colors.dangerText}>
                  {c.wallet.type === 'instapay' ? 'IP' : 'VC'}
                </AppText>
              </View>
              <View style={styles.flex}>
                <AppText size={fontSize.sm} color={colors.textMuted}>
                  {`${c.wallet.label} · ${c.name}`}
                </AppText>
                <AppText size={fontSize.lg} weight="extrabold" style={styles.ltr}>
                  {formatLocalPhone(c.wallet.number)}
                </AppText>
              </View>
              <Button
                variant="secondary"
                title="نسخ"
                textSize={12}
                textColor={colors.primary}
                onPress={() => copyText(c.wallet.number, 'رقم المحفظة')}
                style={styles.copy}
              />
            </View>
            <LinkText weight="bold" size={fontSize.body2} style={styles.start} onPress={() => router.push('/chat')}>
              ابعتله سكرين التحويل في الشات
            </LinkText>
            <AppText size={fontSize.sm} color={colors.textMuted}>
              الفلوس بتروح للمندوب مباشرة، والتطبيق مالوش دعوة بيها.
            </AppText>
          </View>
        ) : null}
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  start: { alignSelf: 'flex-start' },
  body: { padding: spacing.xxl, gap: spacing.lg },
  shopHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dashed: { marginVertical: spacing.sm },
  due: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.background,
    borderRadius: radii.md,
  },
  transfer: { gap: spacing.md, padding: spacing.lg, backgroundColor: colors.background, borderRadius: radii.input },
  wallet: { flexDirection: 'row', alignItems: 'center', gap: spacing.ml, paddingVertical: spacing.ml, paddingHorizontal: spacing.lg, backgroundColor: colors.surface, borderRadius: radii.md },
  walletBadge: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.dangerBg, alignItems: 'center', justifyContent: 'center' },
  walletBadgeIp: { backgroundColor: colors.primaryTint },
  ltr: { writingDirection: 'ltr' },
  copy: { height: 34, borderRadius: 10, paddingHorizontal: spacing.lg },
});
