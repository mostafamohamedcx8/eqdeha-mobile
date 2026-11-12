import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '@/theme';
import { money } from '@/utils/format';

import { AppText } from './AppText';

/** One bought item: name (+ small tag like "بديل") ...... price. */
export function InvoiceItemRow({ name, price, tag, muted }: { name: string; price: number; tag?: string; muted?: boolean }) {
  const size = muted ? 13 : 14;
  return (
    <View style={styles.itemRow}>
      <View style={styles.itemName}>
        <AppText size={size} color={muted ? colors.textMuted : colors.text} style={styles.shrink}>
          {name}
        </AppText>
        {tag ? (
          <View style={styles.tag}>
            <AppText size={11} color={colors.accentIcon}>
              {tag}
            </AppText>
          </View>
        ) : null}
      </View>
      <AppText size={size} weight={muted ? 'regular' : 'bold'} color={muted ? colors.textMuted : colors.text}>
        {money(price)}
      </AppText>
    </View>
  );
}

type RadioCardProps = { title: string; subtitle?: string; selected: boolean; onPress: () => void };

/** Big radio option (15-FinalInvoice payment method). */
export function RadioCard({ title, subtitle, selected, onPress }: RadioCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={[styles.radioCard, selected ? styles.radioCardOn : styles.radioCardOff]}>
      <View style={[styles.radio, selected ? styles.radioOn : styles.radioOff]} />
      <View style={styles.shrink}>
        <AppText size={15} weight="bold">
          {title}
        </AppText>
        {subtitle ? (
          <AppText size={12} color={colors.textMuted}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
    </Pressable>
  );
}

/** Coloured banner (info / warning / success / neutral) with an optional leading icon. */
export function Notice({
  children,
  icon,
  tone = 'warning',
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  tone?: 'warning' | 'neutral' | 'success' | 'danger';
}) {
  const bg = { warning: colors.warningBg, neutral: colors.neutralBg, success: colors.successBg, danger: colors.dangerBg }[tone];
  return (
    <View style={[styles.notice, { backgroundColor: bg }]}>
      {icon ? <View style={styles.noticeIcon}>{icon}</View> : null}
      <View style={styles.shrink}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shrink: { flexShrink: 1, flex: 1 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md },
  itemName: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  tag: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 6, backgroundColor: colors.accentLight },
  radioCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, padding: spacing.lg, borderRadius: radii.input },
  radioCardOn: { backgroundColor: colors.primaryTint, borderWidth: 2, borderColor: colors.primary },
  radioCardOff: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, padding: spacing.lg + 1 },
  radio: { width: 20, height: 20, borderRadius: 10 },
  radioOn: { borderWidth: 6, borderColor: colors.primary, backgroundColor: colors.surface },
  radioOff: { borderWidth: 2, borderColor: colors.border },
  notice: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.ml, paddingVertical: spacing.lg, paddingHorizontal: spacing.xl, borderRadius: radii.input },
  noticeIcon: { marginTop: 2 },
});
