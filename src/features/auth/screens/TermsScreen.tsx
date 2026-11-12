import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { errorMessage } from '@/api/client';
import { acceptTerms, parseTerms } from '@/api/terms';
import { AppText, BackButton, Button, Card, FieldError, FooterBar, Header, LinkText, ScreenContainer } from '@/components/ui';
import { useSession } from '@/store/session';
import { colors, fontSize, radii, spacing } from '@/theme';
import { showErrorPopup } from '@/utils/alert';
import { goBack, resetTo, type Role } from '@/utils/nav';

import { homeAfterLogin } from '../afterLogin';
import { setTermsAgreed } from '../termsAgreement';
import { audienceFor, useTermsStore } from '../termsStore';

/**
 * 02-Terms — the current version's text comes from the server (GET /api/v1/terms).
 * - sign-up (default): "agree" ticks the box on the phone screen and goes back.
 * - `mode=update`: after login with `termsUpToDate=false` — "agree" calls POST /api/v1/terms/accept, then home.
 *   Back = sign out (the new terms must be accepted to continue).
 */
export default function TermsScreen() {
  const { role: roleParam, mode } = useLocalSearchParams<{ role?: string; mode?: string }>();
  const role: Role = roleParam === 'courier' ? 'courier' : 'customer';
  const audience = audienceFor(role);
  const updating = mode === 'update';
  const user = useSession((s) => s.user);
  const setUser = useSession((s) => s.setUser);
  const signOut = useSession((s) => s.signOut);
  const [accepting, setAccepting] = useState(false);

  const back = () => {
    if (!updating) return goBack(role === 'courier' ? '/courier-phone' : '/phone');
    signOut().finally(() => resetTo({ pathname: '/login', params: { role } }));
  };

  const agree = async () => {
    if (!terms || accepting) return;
    if (!updating) {
      setTermsAgreed(true);
      back();
      return;
    }
    setAccepting(true);
    try {
      await acceptTerms(terms.id);
      if (user) {
        const updated = { ...user, termsUpToDate: true };
        await setUser(updated);
        resetTo(homeAfterLogin(updated));
      } else {
        resetTo({ pathname: '/login', params: { role } });
      }
    } catch (e) {
      // e.g. an even newer version was published meanwhile → show it
      showErrorPopup(errorMessage(e));
      fetchTerms();
    } finally {
      setAccepting(false);
    }
  };

  const terms = useTermsStore((s) => s.byAudience[audience]);
  const load = useTermsStore((s) => s.load);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Always refresh: a newer version may have been published since the phone screen loaded it.
  useEffect(() => {
    let active = true;
    load(audience)
      .then(() => active && setError(null))
      .catch((e) => active && setError(errorMessage(e)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [audience, load, attempt]);

  const fetchTerms = useCallback(() => {
    setLoading(true);
    setError(null);
    setAttempt((n) => n + 1);
  }, []);

  const sections = useMemo(() => (terms ? parseTerms(terms.content) : []), [terms]);
  const updated = terms ? new Date(terms.publishedAt).toLocaleDateString('ar-EG') : null;

  return (
    <ScreenContainer
      statusBar="light"
      footer={
        <FooterBar>
          <Button title="قريت وموافق" variant={terms ? 'primary' : 'disabled'} onPress={agree} loading={accepting} />
        </FooterBar>
      }
      header={
        <Header paddingTop={52} paddingBottom={20} paddingHorizontal={spacing.xxl} radius={0} style={styles.header}>
          <BackButton onPress={back} />
          <View>
            <AppText size={fontSize.h3} weight="bold" color={colors.textOnPrimary}>
              {updating ? 'الشروط والأحكام اتحدّثت' : 'الشروط والأحكام'}
            </AppText>
            {updated ? (
              <AppText size={fontSize.sm} color={colors.textOnPrimaryMuted}>
                {`آخر تحديث: ${updated} · نسخة ${terms?.version}`}
              </AppText>
            ) : null}
          </View>
        </Header>
      }>
      <View style={styles.body}>
        {loading && !terms ? <ActivityIndicator color={colors.primary} style={styles.loader} /> : null}

        {error && !terms ? (
          <View style={styles.center}>
            <FieldError message={error} center />
            <LinkText weight="bold" onPress={fetchTerms}>
              جرب تاني
            </LinkText>
          </View>
        ) : null}

        {sections.map((s, i) => (
          <Card key={`${i}-${s.title}`} radius={radii.button} padding={spacing.xxl} gap={spacing.sm} style={styles.section}>
            {s.title ? (
              <AppText size={fontSize.lg} weight="bold" color={colors.primary}>
                {s.title}
              </AppText>
            ) : null}
            <AppText size={fontSize.body} lineHeight={1.8}>
              {s.body}
            </AppText>
          </Card>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  body: { paddingTop: spacing.s20, paddingHorizontal: spacing.s20, paddingBottom: spacing.s24, gap: spacing.xl },
  loader: { marginTop: spacing.s28 },
  center: { alignItems: 'center', gap: spacing.md, marginTop: spacing.s20 },
  section: { paddingHorizontal: spacing.s18 },
});
