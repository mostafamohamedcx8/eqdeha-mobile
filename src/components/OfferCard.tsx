import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText, Avatar, Button, Card, LinkText, RatingMeta, StatusPill } from '@/components/ui';
import type { Offer } from '@/mocks/types';
import { colors, fontSize, radii, spacing } from '@/theme';
import { ar, money } from '@/utils/format';

type Props = { offer: Offer; onAccept: () => void; onReject: () => void };

/** A courier's offer (11-Offers): avatar, rating, price, accept / reject. */
export function OfferCard({ offer, onAccept, onReject }: Props) {
  const c = offer.courier;
  return (
    <Card padding={spacing.xl} gap={spacing.lg}>
      <View style={styles.head}>
        <Avatar initial={c.initial} bg={c.avatarBg} fg={c.avatarFg} size={50} fontSize={20} />
        <View style={styles.flex}>
          <AppText size={fontSize.lg} weight="bold">
            {c.name}
          </AppText>
          <RatingMeta rating={c.rating} text={`${ar(c.trips)} مشوار · ${offer.etaText}`} />
          <LinkText weight="bold" size={fontSize.sm} style={styles.link} onPress={() => router.push({ pathname: '/courier-reviews', params: { courier: String(c.id) } })}>
            شوف التقييمات
          </LinkText>
        </View>
        <View style={styles.price}>
          <AppText size={fontSize.h2} weight="extrabold">
            {money(offer.price)}
          </AppText>
          <StatusPill compact size={11} label={offer.acceptsYourPrice ? 'موافق على سعرك' : 'عرض سعر تاني'} tone={offer.acceptsYourPrice ? 'success' : 'warning'} />
        </View>
      </View>
      <View style={styles.actions}>
        <Button
          title={`قبول بـ ${money(offer.price)}`}
          weight="extrabold"
          textSize={15}
          onPress={onAccept}
          style={[styles.btn, styles.accept]}
        />
        <Button variant="secondary" title="رفض" textSize={14} textColor={colors.textMuted} onPress={onReject} style={[styles.btn, styles.reject]} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  link: { alignSelf: 'flex-start' },
  price: { alignItems: 'flex-end', gap: spacing.xxs },
  actions: { flexDirection: 'row', gap: spacing.md },
  btn: { height: 46, borderRadius: radii.md, paddingHorizontal: spacing.md },
  accept: { flex: 2 },
  reject: { flex: 1 },
});
