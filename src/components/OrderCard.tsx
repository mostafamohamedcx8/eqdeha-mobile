import { StyleSheet, View } from 'react-native';

import { AppText, Button, Card, StatusPill } from '@/components/ui';
import { ORDER_STATUS_STYLE } from '@/mocks/orderHistory';
import type { OrderAction, OrderHistoryItem } from '@/mocks/types';
import { colors, fontSize, radii, spacing } from '@/theme';
import { money, orderNo } from '@/utils/format';

type Props = { order: OrderHistoryItem; onAction: (a: OrderAction) => void };

/** One order in 20-Orders: icon, title, status, details, total + actions. */
export function OrderCard({ order, onAction }: Props) {
  const st = ORDER_STATUS_STYLE[order.status];
  const glyph = order.status === 'cancelled' ? '×' : order.kind === 'anything' ? '؟' : 'م';
  return (
    <Card padding={spacing.xl} gap={spacing.ml}>
      <View style={styles.head}>
        <View style={[styles.icon, { backgroundColor: st.iconBg }]}>
          <AppText size={fontSize.xl} weight="extrabold" color={st.iconFg}>
            {glyph}
          </AppText>
        </View>
        <View style={styles.flex}>
          <AppText size={fontSize.md} weight="extrabold">
            {order.title}
          </AppText>
          <AppText size={fontSize.sm} color={colors.textMuted}>
            {`أوردر ${orderNo(order.id)} · ${order.date}`}
          </AppText>
        </View>
        <StatusPill label={order.statusLabel} tone={st.pill} />
      </View>
      <AppText size={fontSize.body2} lineHeight={1.6} color={colors.textMuted}>
        {order.detail}
      </AppText>
      <View style={styles.foot}>
        <View>
          <AppText size={fontSize.xs} color={colors.placeholder}>
            {order.totalLabel}
          </AppText>
          <AppText size={fontSize.xl} weight="extrabold">
            {money(order.total)}
          </AppText>
        </View>
        <View style={styles.actions}>
          {order.secondary ? (
            <Button
              variant="secondary"
              title={order.secondary.label}
              textSize={13}
              onPress={() => onAction(order.secondary!)}
              style={styles.btn}
            />
          ) : null}
          <Button title={order.primary.label} weight="extrabold" textSize={13} onPress={() => onAction(order.primary)} style={[styles.btn, styles.primary]} />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.ml },
  icon: { width: 42, height: 42, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  foot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.dividerLight,
  },
  actions: { flexDirection: 'row', gap: spacing.sm },
  btn: { height: 38, borderRadius: 10, paddingHorizontal: spacing.lg },
  primary: { paddingHorizontal: spacing.xl },
});
