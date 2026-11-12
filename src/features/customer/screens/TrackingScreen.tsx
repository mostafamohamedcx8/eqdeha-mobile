import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { LockIcon, ReceiptIcon } from '@/components/icons';
import {
  AppText,
  Button,
  Card,
  DevSwitch,
  Divider,
  KeyValueRow,
  LinkText,
  Notice,
  ScreenContainer,
  SectionTitle,
  StatusPill,
  StatusStepper,
  TopBar,
} from '@/components/ui';
import { invoicesResponse } from '@/mocks/orders';
import { shopById } from '@/mocks/shops';
import { type TrackingStage, useActiveOrder } from '@/store/activeOrder';
import { useOrderDraft } from '@/store/orderDraft';
import { colors, fontSize, radii, spacing } from '@/theme';
import { confirmAction, showInfo } from '@/utils/alert';
import { ar, money, orderNo } from '@/utils/format';
import { resetTo } from '@/utils/nav';
import { formatLocalPhone } from '@/utils/phone';

import { CourierCard } from '../components/CourierCard';

/** 12-Tracking. Dev switch previews "before / after the first invoice". */
export default function TrackingScreen() {
  const { order, stage, setStage, reset } = useActiveOrder();
  const resetDraft = useOrderDraft((s) => s.reset);
  const after = stage === 'after';
  const current = after ? 2 : 1;
  const firstInvoice = invoicesResponse.data[0];
  const firstTotal = firstInvoice.items.reduce((s, i) => s + i.price, 0);

  const cancel = () =>
    confirmAction('إلغاء الأوردر', 'متأكد إنك عايز تلغي الأوردر؟', 'إلغاء الأوردر', () => {
      reset();
      resetDraft();
      resetTo('/home');
    });

  return (
    <ScreenContainer
      statusBar="light"
      header={
        <TopBar
          title={`أوردر ${orderNo(order.id)}`}
          subtitle={after ? 'المندوب بيشتري من المحلات' : 'المندوب في الطريق للمحل'}
          onBack={() => resetTo('/home')}
          radius={radii.header}
          paddingBottom={20}>
          <CourierCard courier={order.courier} unread={order.unreadMessages} />
        </TopBar>
      }
      contentStyle={styles.body}>
      <DevSwitch<TrackingStage>
        value={stage}
        onChange={setStage}
        options={[
          { value: 'before', label: 'قبل أي فاتورة' },
          { value: 'after', label: 'بعد أول فاتورة' },
        ]}
      />

      {after ? (
        <Pressable onPress={() => router.push({ pathname: '/invoice', params: { shop: String(firstInvoice.shopId) } })} accessibilityRole="button" style={styles.invoiceBanner}>
          <View style={styles.invoiceIcon}>
            <ReceiptIcon color={colors.accentText} />
          </View>
          <View style={styles.flex}>
            <AppText size={fontSize.md} weight="extrabold" color={colors.accentText}>
              {`فاتورة جديدة من ${firstInvoice.shopName}`}
            </AppText>
            <AppText size={fontSize.body2} color={colors.warningText}>
              {`${money(firstTotal)} · المندوب اشترى أول حاجة`}
            </AppText>
          </View>
          <AppText size={fontSize.body2} weight="extrabold" color={colors.accentText}>
            شوفها
          </AppText>
        </Pressable>
      ) : null}

      <Card padding={spacing.xxl} gap={0}>
        <StatusStepper current={current} steps={order.steps.map((s) => ({ title: s.title, subtitle: after && s.subtitleAfter ? s.subtitleAfter : s.subtitle }))} />
      </Card>

      <Card padding={spacing.xl} gap={spacing.ml}>
        <SectionTitle>المحلات في الأوردر</SectionTitle>
        {order.shopIds.map((id, i) => {
          const invoiced = after && id === firstInvoice.shopId;
          return (
            <KeyValueRow
              key={id}
              label={`${ar(i + 1)}. ${shopById(id)?.name ?? ''}`}
              value={<StatusPill label={invoiced ? 'الفاتورة وصلت' : 'لسه'} tone={invoiced ? 'warning' : 'neutral'} />}
            />
          );
        })}
        <Divider />
        <KeyValueRow label="التوصيل" value={money(order.deliveryFee)} color={colors.textMuted} valueColor={colors.text} valueWeight="bold" />
        <KeyValueRow label="الدفع" value="للمندوب: كاش أو تحويل" color={colors.textMuted} valueColor={colors.text} valueWeight="bold" />
        <KeyValueRow
          label="محفظة المندوب"
          color={colors.textMuted}
          value={
            <AppText size={fontSize.body} weight="bold" style={styles.ltr}>
              {`${order.courier.wallet.label} ${formatLocalPhone(order.courier.wallet.number)}`}
            </AppText>
          }
        />
      </Card>

      {after ? (
        <Notice tone="neutral" icon={<LockIcon size={20} color={colors.textMuted} strokeWidth={2} />}>
          <AppText size={fontSize.body2} lineHeight={1.6} color={colors.textMuted}>
            مينفعش تلغي دلوقتي لأن المندوب اشترى أول حاجة. لو في مشكلة كلّم المندوب أو{' '}
            <LinkText weight="bold" onPress={() => showInfo('الدعم', 'فريق الدعم هيتواصل معاك على رقمك في أقرب وقت.')}>
              الدعم
            </LinkText>
            .
          </AppText>
        </Notice>
      ) : (
        <>
          <Button variant="danger" title="إلغاء الأوردر" onPress={cancel} style={styles.cancel} />
          <AppText size={fontSize.sm} color={colors.textMuted} center>
            تقدر تلغي لحد ما المندوب يعمل أول فاتورة. المندوب يقدر يلغي لحد ما يستلم الحاجة من المحل، وساعتها طلبك بيرجع لباقي المناديب أوتوماتيك.
          </AppText>
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  body: { padding: spacing.xxl, gap: spacing.lg },
  invoiceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.xl,
    backgroundColor: colors.accentLight,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radii.button,
  },
  invoiceIcon: { width: 42, height: 42, borderRadius: radii.md, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  ltr: { writingDirection: 'ltr' },
  cancel: { height: 50, borderRadius: radii.input, backgroundColor: colors.surface },
});
