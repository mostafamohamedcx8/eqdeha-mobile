import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { LockIcon, StarFilledIcon } from '@/components/icons';
import { AppText, Avatar, Button, DevSwitch, Header, Notice, ScreenContainer, StatusPill } from '@/components/ui';
import { courierMeResponse, courierOrderResponse, courierWalletResponse, nearbyOrdersResponse } from '@/mocks/courier';
import { type HomeMode, useCourier } from '@/store/courier';
import { colors, fontSize, radii, spacing } from '@/theme';
import { ar, money, orderNo } from '@/utils/format';

import { AnythingCard, FixedShopsCard, nearbyCountLabel, SimpleOrderCard } from '../components/NearbyOrderCards';

/** 26-CHome (tab: الأوردرات). Dev switch previews free / has an order / suspended. */
export default function CourierHomeScreen() {
  const me = courierMeResponse.data;
  const current = courierOrderResponse.data;
  const { stopAt } = courierWalletResponse.data;
  const c = useCourier();
  const mode = c.homeMode;
  const debt = mode === 'stop' ? stopAt : c.debt;
  const pct = Math.min(100, (debt / stopAt) * 100);
  const free = mode === 'free';
  const nearby = nearbyOrdersResponse.data;

  const accept = () => {
    c.acceptOrder();
    router.push('/courier-chat');
  };

  return (
    <ScreenContainer
      statusBar="light"
      header={
        <Header paddingTop={48} paddingBottom={16} paddingHorizontal={spacing.xxl} radius={26} gap={spacing.lg}>
          <View style={styles.topRow}>
            <Avatar initial={me.initial} size={44} fontSize={18} />
            <View style={styles.flex}>
              <AppText size={fontSize.sm} color={colors.textOnPrimaryMuted}>
                أهلاً يا
              </AppText>
              <AppText size={fontSize.h4} weight="extrabold" color={colors.textOnPrimary}>
                {me.firstName}
              </AppText>
            </View>
            <Pressable
              onPress={() => router.push('/courier-points')}
              accessibilityRole="button"
              accessibilityLabel={`نقاطك ${ar(c.points)} نقطة`}
              style={styles.pointsPill}>
              <StarFilledIcon size={16} />
              <AppText size={fontSize.body2} weight="extrabold" color={colors.textOnPrimary}>
                {ar(c.points)}
              </AppText>
            </Pressable>
            <Pressable
              onPress={c.toggleOnline}
              accessibilityRole="switch"
              accessibilityState={{ checked: c.online }}
              style={[styles.online, c.online ? styles.onlineOn : styles.onlineOff]}>
              <View style={[styles.onlineDot, { backgroundColor: c.online ? colors.success : colors.placeholder }]} />
              <AppText size={fontSize.body2} weight="extrabold" color={c.online ? colors.successText : colors.textOnPrimaryMuted}>
                {c.online ? 'متاح' : 'مش متاح'}
              </AppText>
            </Pressable>
          </View>

          <Pressable onPress={() => router.navigate('/courier-wallet')} accessibilityRole="button" style={styles.stats}>
            <View style={styles.stat}>
              <AppText size={fontSize.sm} color={colors.textOnPrimaryMuted}>
                أرباحك النهارده
              </AppText>
              <AppText size={fontSize.h3} weight="extrabold" color={colors.textOnPrimary}>
                {money(me.earnings.today)}
              </AppText>
              <AppText size={fontSize.xs} color={colors.textOnPrimaryMuted}>
                {`الأسبوع: ${money(me.earnings.week)}`}
              </AppText>
            </View>
            <View style={[styles.stat, styles.statGap]}>
              <AppText size={fontSize.sm} color={colors.textOnPrimaryMuted}>
                عليك للتطبيق
              </AppText>
              <AppText size={fontSize.h3} weight="extrabold" color={debt >= stopAt ? colors.dangerSoft : colors.textOnPrimary}>
                {`−${money(debt)}`}
              </AppText>
              <View style={styles.debtTrack}>
                <View style={[styles.debtFill, { width: `${pct}%`, backgroundColor: pct >= 80 ? colors.danger : colors.accent }]} />
              </View>
              <AppText size={fontSize.xs} color={colors.textOnPrimaryMuted}>
                {`الحساب بيقف عند −${ar(stopAt)}`}
              </AppText>
            </View>
          </Pressable>
        </Header>
      }
      contentStyle={styles.body}>
      <DevSwitch<HomeMode>
        value={mode}
        onChange={c.setHomeMode}
        options={[
          { value: 'free', label: 'فاضي' },
          { value: 'busy', label: 'معاه أوردر' },
          { value: 'stop', label: 'موقوف' },
        ]}
      />

      {mode === 'stop' ? (
        <View style={styles.suspended}>
          <AppText size={fontSize.xl} weight="extrabold" color={colors.dangerText}>
            حسابك واقف مؤقتاً
          </AppText>
          <AppText size={fontSize.body} lineHeight={1.6} color={colors.dangerDeep}>
            {`وصلت لـ −${ar(stopAt)} ج عمولة. سدّدها وارفع صورة التحويل، وهيتفتحلك علطول سلفة ${ar(courierWalletResponse.data.advance)} ج تكمّل بيها شغل لحد ما الإدارة تأكد.`}
          </AppText>
          <Button variant="dangerSolid" title="سدّد دلوقتي" weight="extrabold" onPress={() => router.navigate('/courier-wallet')} style={styles.payNow} />
        </View>
      ) : null}

      {mode === 'busy' ? (
        <>
          <Pressable onPress={() => router.push('/courier-chat')} accessibilityRole="button" style={styles.currentCard}>
            <View style={styles.rowBetween}>
              <AppText size={fontSize.md} weight="extrabold">
                {`أوردرك الحالي ${orderNo(current.id)}`}
              </AppText>
              <StatusPill label="في الطريق للمحل" tone="primary" />
            </View>
            <AppText size={fontSize.body2} color={colors.textMuted}>
              {`${current.shops.map((s) => s.shopName).join('، ')} · العميل ${current.customer.firstName}`}
            </AppText>
            <AppText size={fontSize.body2} weight="bold" color={colors.primary}>
              افتح الشات ←
            </AppText>
          </Pressable>
          <Notice icon={<LockIcon size={20} color={colors.accentIcon} strokeWidth={2} />}>
            <AppText size={fontSize.body2} lineHeight={1.6} color={colors.warningText}>
              تقدر تقبل أوردر جديد بعد ما تستلم الحاجة من المحل في أوردرك الحالي.
            </AppText>
          </Notice>
        </>
      ) : null}

      {mode !== 'stop' && !c.online ? (
        <Notice tone="neutral">
          <AppText size={fontSize.body2} lineHeight={1.6} color={colors.textMuted}>
            إنت مش متاح دلوقتي، ومش هتوصلك أوردرات جديدة. دوس على «مش متاح» فوق عشان ترجع تشتغل.
          </AppText>
        </Notice>
      ) : null}

      {mode !== 'stop' && c.online ? (
        <>
          <AppText size={fontSize.body} weight="bold">
            {nearbyCountLabel(nearby.length)}
          </AppText>
          {nearby.map((o) => {
            if (o.kind === 'fixed_shops') return <FixedShopsCard key={o.id} order={o} canAccept={free} locked={mode === 'busy'} onAccept={accept} />;
            if (o.kind === 'anything')
              return (
                <AnythingCard
                  key={o.id}
                  order={o}
                  offer={c.counterOffer}
                  sent={c.offerSent}
                  onChange={c.changeCounter}
                  onSend={c.sendOffer}
                  onWithdraw={c.withdrawOffer}
                />
              );
            return <SimpleOrderCard key={o.id} order={o} canAccept={free} onAccept={accept} />;
          })}
        </>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.ml },
  pointsPill: { height: 38, flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.ml, borderRadius: radii.pill, backgroundColor: colors.primaryLight },
  online: { height: 38, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: radii.pill },
  onlineOn: { backgroundColor: colors.successBg },
  onlineOff: { backgroundColor: colors.primaryLight },
  onlineDot: { width: 10, height: 10, borderRadius: 5 },
  stats: { flexDirection: 'row', gap: spacing.md },
  stat: { flex: 1, paddingVertical: spacing.ml, paddingHorizontal: spacing.lg, borderRadius: radii.input, backgroundColor: colors.primaryLight },
  statGap: { gap: spacing.xs },
  debtTrack: { height: 6, borderRadius: 3, backgroundColor: colors.primary, overflow: 'hidden', flexDirection: 'row' },
  debtFill: { height: '100%' },
  body: { paddingTop: spacing.lg, paddingHorizontal: spacing.xxl, paddingBottom: spacing.xxl, gap: spacing.lg },
  suspended: { gap: spacing.md, padding: spacing.xxl, borderRadius: radii.card, backgroundColor: colors.dangerBg, borderWidth: 1, borderColor: colors.danger },
  payNow: { borderRadius: radii.md },
  currentCard: { gap: spacing.sm, padding: spacing.xl, borderRadius: radii.card, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.primary },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
