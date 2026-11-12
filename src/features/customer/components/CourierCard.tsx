import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ChatIcon, PhoneCallIcon } from '@/components/icons';
import { AppText, Avatar, LinkText, RatingMeta } from '@/components/ui';
import type { CourierSummary } from '@/mocks/types';
import { colors, fontSize, radii, spacing } from '@/theme';
import { ar } from '@/utils/format';
import { callPhone } from '@/utils/phone';

/** White courier card in the 12-Tracking header: info, chat (with unread badge), call. */
export function CourierCard({ courier, unread }: { courier: CourierSummary; unread: number }) {
  return (
    <View style={styles.card}>
      <Avatar initial={courier.initial} bg={courier.avatarBg} fg={courier.avatarFg} size={52} fontSize={21} />
      <View style={styles.flex}>
        <AppText size={fontSize.lg} weight="bold">
          {courier.name}
        </AppText>
        <RatingMeta rating={courier.rating} starSize={13} text={`${courier.vehicle} · ${ar(courier.trips)} مشوار`} />
        <LinkText
          weight="bold"
          size={fontSize.sm}
          style={styles.link}
          onPress={() => router.push({ pathname: '/courier-reviews', params: { courier: String(courier.id) } })}>
          شوف التقييمات
        </LinkText>
      </View>
      <Pressable onPress={() => router.push('/chat')} accessibilityRole="button" accessibilityLabel="شات مع المندوب" style={[styles.btn, styles.chat]}>
        <ChatIcon color={colors.primary} />
        {unread > 0 ? (
          <View style={styles.badge}>
            <AppText size={11} weight="extrabold" color={colors.surface}>
              {ar(unread)}
            </AppText>
          </View>
        ) : null}
      </Pressable>
      <Pressable onPress={() => callPhone(courier.phone)} accessibilityRole="button" accessibilityLabel="اتصل بالمندوب" style={[styles.btn, styles.call]}>
        <PhoneCallIcon color={colors.surface} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, padding: spacing.lg, backgroundColor: colors.surface, borderRadius: radii.card },
  link: { alignSelf: 'flex-start' },
  btn: { width: 46, height: 46, borderRadius: radii.input, alignItems: 'center', justifyContent: 'center' },
  chat: { backgroundColor: colors.primaryTint },
  call: { backgroundColor: colors.success },
  // top-left of the chat button (= end side in RTL)
  badge: {
    position: 'absolute',
    top: -4,
    end: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 4,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
