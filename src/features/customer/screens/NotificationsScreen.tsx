import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppMiniLogo } from '@/components/icons';
import { AppText, BackButton, ScreenContainer, useDesignInsets } from '@/components/ui';
import { NOTIFICATION_KINDS, pushPreviews } from '@/mocks/notifications';
import type { AppNotification } from '@/mocks/types';
import { useCustomer } from '@/store/customer';
import { colors, fontSize, radii, spacing } from '@/theme';
import { goBack } from '@/utils/nav';

/** Lock-screen look of the pushes (the dark strip in the design) — dev preview only. */
function PushPreviewStrip() {
  const inset = useDesignInsets();
  return (
    <View style={[styles.pushStrip, { paddingTop: inset.top(46) }]}>
      <AppText size={fontSize.sm} weight="semibold" color={colors.pushHint} style={styles.pushHint}>
        كده هتظهر على شاشة الموبايل (معاينة للتطوير)
      </AppText>
      {pushPreviews.map((p) => (
        <View key={p.title} style={styles.push}>
          <AppMiniLogo />
          <View style={styles.flex}>
            <View style={styles.pushHead}>
              <AppText size={fontSize.sm} weight="bold" color={colors.textMuted}>
                اقضيها
              </AppText>
              <AppText size={fontSize.xs} color={colors.textMuted}>
                {p.time}
              </AppText>
            </View>
            <AppText size={fontSize.body} weight="extrabold">
              {p.title}
            </AppText>
            <AppText size={fontSize.body2}>{p.body}</AppText>
          </View>
        </View>
      ))}
    </View>
  );
}

function NotificationRow({ n, onPress }: { n: AppNotification; onPress: () => void }) {
  const k = NOTIFICATION_KINDS[n.kind];
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={[styles.card, n.unread && styles.cardUnread]}>
      <View style={[styles.icon, { backgroundColor: k.bg }]}>
        <AppText size={fontSize.h4} weight="extrabold" color={k.fg}>
          {k.glyph}
        </AppText>
      </View>
      <View style={styles.flex}>
        <AppText size={fontSize.body} weight="extrabold">
          {n.title}
        </AppText>
        <AppText size={fontSize.body2} lineHeight={1.5} color={colors.textMuted}>
          {n.body}
        </AppText>
        <AppText size={fontSize.xs} color={colors.placeholder}>
          {n.time}
        </AppText>
      </View>
      {n.unread ? <View style={styles.dot} /> : null}
    </Pressable>
  );
}

/** 17-Notifications. Tapping one marks it read and opens its screen. */
export default function NotificationsScreen() {
  const inset = useDesignInsets();
  const { notifications, markRead, markAllRead } = useCustomer();

  return (
    <ScreenContainer
      statusBar={__DEV__ ? 'light' : 'dark'}
      header={
        <>
          {__DEV__ ? <PushPreviewStrip /> : null}
          <View style={[styles.titleRow, !__DEV__ && { paddingTop: inset.top(52) }]}>
            <View style={styles.titleStart}>
              <BackButton tone="onLight" onPress={() => goBack('/home')} />
              <AppText size={fontSize.h3} weight="extrabold">
                الإشعارات
              </AppText>
            </View>
            <Pressable onPress={markAllRead} accessibilityRole="button" style={styles.readAll}>
              <AppText size={fontSize.body2} weight="bold" color={colors.primary}>
                اعتبرها كلها مقروءة
              </AppText>
            </Pressable>
          </View>
        </>
      }
      contentStyle={styles.list}>
      {notifications.map((n) => (
        <NotificationRow
          key={n.id}
          n={n}
          onPress={() => {
            markRead(n.id);
            router.push(n.target);
          }}
        />
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  pushStrip: { backgroundColor: colors.text, paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl, gap: spacing.md },
  pushHint: { marginHorizontal: spacing.xs, marginBottom: spacing.xxs },
  push: { flexDirection: 'row', gap: spacing.ml, paddingVertical: spacing.ml, paddingHorizontal: spacing.lg, borderRadius: radii.card, backgroundColor: colors.pushBg },
  pushHead: { flexDirection: 'row', justifyContent: 'space-between' },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: spacing.xxl, paddingHorizontal: spacing.xxl, paddingBottom: spacing.md },
  titleStart: { flexDirection: 'row', alignItems: 'center', gap: spacing.ml },
  readAll: { height: 36, paddingHorizontal: spacing.lg, justifyContent: 'center' },
  list: { paddingHorizontal: spacing.xxl, paddingBottom: spacing.s24, gap: spacing.md },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.lg,
    padding: spacing.lg,
    borderRadius: radii.button,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surface,
  },
  cardUnread: { borderColor: colors.accent },
  icon: { width: 42, height: 42, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.danger },
});
