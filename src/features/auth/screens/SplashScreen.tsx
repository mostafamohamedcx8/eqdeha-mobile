import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { getMe } from '@/api/auth';
import { ApiError } from '@/api/client';
import { Logo } from '@/components/icons';
import { AppText } from '@/components/ui';
import { goAfterLogin } from '@/features/auth/afterLogin';
import { useSession } from '@/store/session';
import { colors, fontSize, spacing } from '@/theme';

/**
 * Where to go from the splash: a saved session → refresh the profile (GET /me) and go home;
 * otherwise → RolePick.
 */
async function startDestination(): Promise<() => void> {
  const session = useSession.getState();
  if (!session.hydrated) await session.hydrate();
  const { token, user, setUser, signOut } = useSession.getState();
  if (!token || !user) return () => router.replace('/role');
  try {
    const fresh = await getMe();
    await setUser(fresh);
    return () => goAfterLogin(fresh);
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      // token expired / revoked (password reset, approval changed…) → log in again
      await signOut();
      return () => router.replace({ pathname: '/login', params: { role: user.role } });
    }
    // 403 = needs_fix courier (limited token can't call /me); no internet → use the saved profile
    return () => goAfterLogin(user);
  }
}

/** 00a-Splash: teal welcome screen, shown at least 2 seconds (or until tapped), then continues. */
export default function SplashScreen() {
  const [dot, setDot] = useState(0);
  const [next, setNext] = useState<(() => void) | null>(null);
  const [minTimeDone, setMinTimeDone] = useState(false);
  const [tapped, setTapped] = useState(false);

  useEffect(() => {
    const tick = setInterval(() => setDot((d) => (d + 1) % 3), 400);
    const min = setTimeout(() => setMinTimeDone(true), 2000);
    let active = true;
    startDestination()
      .catch(() => () => router.replace('/role'))
      .then((go) => active && setNext(() => go));
    return () => {
      active = false;
      clearInterval(tick);
      clearTimeout(min);
    };
  }, []);

  // Leave once the destination is known and the 2 seconds passed (or the user tapped).
  useEffect(() => {
    if (next && (minTimeDone || tapped)) next();
  }, [next, minTimeDone, tapped]);

  return (
    <Pressable
      style={styles.root}
      onPress={() => setTapped(true)}
      accessibilityRole="button"
      accessibilityLabel="ادخل على التطبيق">
      <StatusBar style="light" />
      <View style={[styles.blob, styles.blobTop]} />
      <View style={[styles.blob, styles.blobBottom]} />

      <Logo size={112} />

      <View style={styles.texts}>
        <AppText size={fontSize.splash} weight="extrabold" color={colors.textOnPrimary} lineHeight={1.3} center>
          أهلاً بكم
        </AppText>
        <AppText size={fontSize.h1} weight="bold" color={colors.accent} lineHeight={1.5} center>
          أهالي عزبة سكينة الكرام
        </AppText>
      </View>

      <View style={styles.dots} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.dot, { backgroundColor: dot === i ? colors.accent : colors.textOnPrimaryMuted }]} />
        ))}
      </View>

      <AppText size={fontSize.h4} weight="extrabold" color={colors.textOnPrimary} style={styles.brand}>
        اقضيها
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 22,
    paddingVertical: 40,
    paddingHorizontal: spacing.s28,
    overflow: 'hidden',
  },
  // top-left / bottom-right physical corners, as in the HTML
  blob: { position: 'absolute', borderRadius: 999, backgroundColor: colors.primaryLight },
  blobTop: { top: -90, left: -90, width: 240, height: 240 },
  blobBottom: { bottom: -120, right: -80, width: 300, height: 300 },
  texts: { alignItems: 'center', gap: spacing.sm },
  dots: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.s18 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  brand: { position: 'absolute', bottom: 40 },
});
