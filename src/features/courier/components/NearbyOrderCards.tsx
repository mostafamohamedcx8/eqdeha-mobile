import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Button, Card, StatusPill } from '@/components/ui';
import type { NearbyOrder } from '@/mocks/courier';
import { colors, fontSize, radii, spacing } from '@/theme';
import { ar, money } from '@/utils/format';

type Fixed = Extract<NearbyOrder, { kind: 'fixed_shops' }>;
type Anything = Extract<NearbyOrder, { kind: 'anything' }>;
type Simple = Extract<NearbyOrder, { kind: 'fixed_simple' }>;

/** Accept button, or the grey "finish your order first" box while busy. */
function AcceptOrLocked({ canAccept, locked, onAccept, label, small }: { canAccept: boolean; locked: boolean; onAccept: () => void; label: string; small?: boolean }) {
  if (canAccept) {
    return <Button title={label} weight="extrabold" textSize={small ? 14 : 15} onPress={onAccept} style={small ? styles.acceptSm : styles.accept} />;
  }
  if (locked) {
    return (
      <View style={styles.locked}>
        <AppText size={fontSize.body2} weight="bold" color={colors.disabledText}>
          استلم أوردرك الأول
        </AppText>
      </View>
    );
  }
  return null;
}

/** Fixed-price shop order with the pickup → drop-off route. */
export function FixedShopsCard({ order, canAccept, locked, onAccept }: { order: Fixed; canAccept: boolean; locked: boolean; onAccept: () => void }) {
  return (
    <Card padding={spacing.xl} gap={spacing.ml}>
      <View style={styles.head}>
        <StatusPill label="سعر ثابت · من المحلات" tone="primary" compact />
        <AppText size={fontSize.sm} color={colors.textMuted}>
          {order.ago}
        </AppText>
      </View>
      <View style={styles.route}>
        <View style={styles.rail}>
          <View style={styles.ring} />
          <View style={styles.railLine} />
          <View style={styles.dotEnd} />
        </View>
        <View style={styles.routeTexts}>
          <View>
            <AppText size={fontSize.md} weight="bold">
              {order.shops}
            </AppText>
            <AppText size={fontSize.sm} color={colors.textMuted}>
              {order.shopsMeta}
            </AppText>
          </View>
          <View>
            <AppText size={fontSize.body} weight="bold">
              {order.dropoff}
            </AppText>
            <AppText size={fontSize.sm} color={colors.textMuted}>
              {order.dropoffMeta}
            </AppText>
          </View>
        </View>
      </View>
      <View style={styles.foot}>
        <View>
          <AppText size={fontSize.h3} weight="extrabold">
            {money(order.fee)}
          </AppText>
          <AppText size={fontSize.xs} color={colors.textMuted}>
            {`ليك ${money(order.courierShare)} بعد العمولة`}
          </AppText>
        </View>
        <AcceptOrLocked canAccept={canAccept} locked={locked} onAccept={onAccept} label="اقبل وابدأ" />
      </View>
    </Card>
  );
}

type AnythingProps = {
  order: Anything;
  offer: number;
  sent: boolean;
  onChange: (delta: number) => void;
  onSend: () => void;
  onWithdraw: () => void;
};

/** "Anything" order: customer's price + counter-offer stepper (− value +). */
export function AnythingCard({ order, offer, sent, onChange, onSend, onWithdraw }: AnythingProps) {
  const same = offer === order.customerOffer;
  return (
    <Card padding={spacing.xl} gap={spacing.ml}>
      <View style={styles.head}>
        <StatusPill label="العميل حاطط السعر · أي حاجة" tone="warning" compact />
        <AppText size={fontSize.sm} color={colors.textMuted}>
          {order.ago}
        </AppText>
      </View>
      <AppText size={fontSize.md} weight="bold" lineHeight={1.6}>
        {`"${order.wish}"`}
      </AppText>
      <AppText size={fontSize.sm} color={colors.textMuted}>
        {order.route}
      </AppText>
      <View style={styles.offerBox}>
        <View style={styles.head}>
          <AppText size={fontSize.body2} color={colors.textMuted}>
            العميل عارض
          </AppText>
          <AppText size={fontSize.h4} weight="extrabold">
            {money(order.customerOffer)}
          </AppText>
        </View>
        {sent ? (
          <View style={styles.sent}>
            <View style={styles.sentDot} />
            <AppText size={fontSize.body2} weight="bold" color={colors.primary} style={styles.flex}>
              {`عرضك ${money(offer)} اتبعت، مستني رد العميل`}
            </AppText>
            <Pressable onPress={onWithdraw} accessibilityRole="button" hitSlop={6}>
              <AppText size={fontSize.sm} weight="bold" color={colors.dangerStrong}>
                اسحبه
              </AppText>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.stepper}>
              <Pressable onPress={() => onChange(-5)} accessibilityRole="button" accessibilityLabel="قلّل" style={[styles.stepBtn, styles.minus]}>
                <AppText size={fontSize.h3} weight="extrabold" color={colors.primary}>
                  −
                </AppText>
              </Pressable>
              <AppText size={fontSize.h3} weight="extrabold" center style={styles.flex}>
                {money(offer)}
              </AppText>
              <Pressable onPress={() => onChange(5)} accessibilityRole="button" accessibilityLabel="زوّد" style={[styles.stepBtn, styles.plus]}>
                <AppText size={fontSize.h3} weight="extrabold" color={colors.surface}>
                  +
                </AppText>
              </Pressable>
            </View>
            <Button
              title={same ? `وافق على ${money(order.customerOffer)} وابدأ` : `ابعت عرضك ${money(offer)}`}
              weight="extrabold"
              textSize={15}
              onPress={onSend}
              style={styles.send}
            />
          </>
        )}
      </View>
    </Card>
  );
}

/** Small fixed-price order (one shop). */
export function SimpleOrderCard({ order, canAccept, onAccept }: { order: Simple; canAccept: boolean; onAccept: () => void }) {
  return (
    <Card padding={spacing.xl} style={styles.simple}>
      <View style={styles.flex}>
        <View style={styles.startSelf}>
          <StatusPill label="سعر ثابت" tone="primary" compact />
        </View>
        <AppText size={fontSize.md} weight="bold" style={styles.simpleName}>
          {order.shop}
        </AppText>
        <AppText size={fontSize.sm} color={colors.textMuted}>
          {order.route}
        </AppText>
      </View>
      <View style={styles.simpleEnd}>
        <AppText size={fontSize.h4} weight="extrabold">
          {money(order.fee)}
        </AppText>
        {canAccept ? <AcceptOrLocked canAccept locked={false} onAccept={onAccept} label="اقبل" small /> : null}
      </View>
    </Card>
  );
}

export const nearbyCountLabel = (n: number) => `أوردرات جنبك (${ar(n)})`;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  startSelf: { alignSelf: 'flex-start' },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  route: { flexDirection: 'row', gap: spacing.ml },
  rail: { alignItems: 'center', paddingTop: spacing.sm },
  ring: { width: 10, height: 10, borderRadius: 5, borderWidth: 3, borderColor: colors.primary },
  railLine: { flex: 1, width: 2, marginVertical: 3, backgroundColor: colors.border },
  dotEnd: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accent },
  routeTexts: { flex: 1, gap: spacing.md },
  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: spacing.ml, borderTopWidth: 1, borderTopColor: colors.dividerLight },
  accept: { height: 46, borderRadius: radii.md, paddingHorizontal: 22 },
  acceptSm: { height: 40, borderRadius: 10, paddingHorizontal: spacing.xxl },
  locked: { height: 46, paddingHorizontal: spacing.xxl, borderRadius: radii.md, backgroundColor: colors.disabledBg, justifyContent: 'center' },
  offerBox: { gap: spacing.md, paddingTop: spacing.ml, borderTopWidth: 1, borderTopColor: colors.dividerLight },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stepBtn: { width: 42, height: 42, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  minus: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  plus: { backgroundColor: colors.primary },
  send: { height: 46, borderRadius: radii.md },
  sent: { flexDirection: 'row', alignItems: 'center', gap: spacing.ml, paddingVertical: spacing.ml, paddingHorizontal: spacing.lg, borderRadius: radii.md, backgroundColor: colors.primaryTint },
  sentDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  simple: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  simpleName: { marginTop: spacing.sm },
  simpleEnd: { alignItems: 'center', gap: spacing.sm },
});
