import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { HomeIcon } from '@/components/icons';
import { AppText, OptionButton } from '@/components/ui';
import type { Address, PaymentMethod } from '@/mocks/types';
import { colors, fontSize, radii, spacing } from '@/theme';

/** "كاش / تحويل للمندوب" two-choice grid (07, 08). */
export function PaymentChoice({ value, onChange }: { value: PaymentMethod; onChange: (v: PaymentMethod) => void }) {
  return (
    <View style={styles.grid}>
      <OptionButton size="sm" label="كاش" selected={value === 'cash'} onPress={() => onChange('cash')} />
      <OptionButton size="sm" label="تحويل للمندوب" selected={value === 'wallet'} onPress={() => onChange('wallet')} />
    </View>
  );
}

/** Two equal choice buttons (08 "هيجيبها منين؟"). */
export function ChoicePair<T extends string>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <View style={styles.grid}>
      {options.map((o) => (
        <OptionButton key={o.value} size="sm" label={o.label} selected={value === o.value} onPress={() => onChange(o.value)} />
      ))}
    </View>
  );
}

/** "البيت · ش. الجمهورية…  غيّر من الخريطة" row → 09-MapPick (end point). */
export function DeliveryAddressRow({ address, compact }: { address: Address; compact?: boolean }) {
  const open = () => router.push({ pathname: '/map-pick', params: { mode: 'end' } });
  return (
    <Pressable onPress={open} accessibilityRole="button" style={[styles.address, compact && styles.addressCompact]}>
      {compact ? null : (
        <View style={styles.homeIcon}>
          <HomeIcon size={20} color={colors.accentIcon} />
        </View>
      )}
      <View style={styles.flex}>
        <AppText size={fontSize.body} weight="bold">
          {address.label}
        </AppText>
        <AppText size={fontSize.sm} color={colors.textMuted} numberOfLines={1}>
          {`${address.street}، ${address.details}`}
        </AppText>
      </View>
      <AppText size={compact ? fontSize.sm : fontSize.body2} weight="bold" color={colors.primary}>
        {compact ? 'غيّر' : 'غيّر من الخريطة'}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  grid: { flexDirection: 'row', gap: spacing.md },
  address: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.ml,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: radii.input,
  },
  addressCompact: { gap: spacing.ml, borderRadius: radii.md },
  homeIcon: { width: 40, height: 40, borderRadius: radii.md, backgroundColor: colors.accentLight, alignItems: 'center', justifyContent: 'center' },
});
