import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, type TextInputInstance } from 'react-native';

import { signupSendOtp } from '@/api/auth';
import { ApiError, errorMessage } from '@/api/client';
import { WhatsappIcon } from '@/components/icons';
import {
  AppText,
  BrandHeader,
  Button,
  Checkbox,
  FieldError,
  LinkText,
  PhoneField,
  ScreenContainer,
  Spacer,
} from '@/components/ui';
import { colors, fontSize, spacing } from '@/theme';
import { showErrorPopup } from '@/utils/alert';
import type { Role } from '@/utils/nav';
import { normalizeEgPhone, phoneError } from '@/utils/validation';

import { useSignupDraft } from '../signupDraft';
import { audienceFor, useTermsStore } from '../termsStore';
import { setTermsAgreed, useTermsAgreed } from '../termsAgreement';

const copy = {
  customer: {
    header: { logoSize: 84, titleSize: fontSize.hero, subtitle: 'أي حاجة من أي محل، لحد باب البيت', paddingTop: 72, paddingBottom: 64, gap: 14 },
    title: 'أهلاً بيك',
    subtitle: 'اكتب رقم موبايلك وهنبعتلك كود تفعيل على واتساب',
    terms: ['قريت وموافق على ', 'الشروط والأحكام', ' وسياسة الخصوصية'],
    termsHint: 'لازم توافق على الشروط والأحكام الأول',
    next: '/otp',
    bodyPadTop: 32,
  },
  courier: {
    header: { logoSize: 80, titleSize: 32, subtitle: 'اشتغل في منطقتك، واكسب من كل مشوار', paddingTop: 64, paddingBottom: 52, gap: 12, badge: 'مندوب' },
    title: 'سجّل كمندوب',
    subtitle: 'اكتب رقمك وهيوصلك كود على واتساب',
    terms: ['قريت وموافق على ', 'شروط المناديب', ' ونسبة العمولة وقواعد الإيقاف'],
    termsHint: 'لازم توافق على شروط المناديب الأول',
    next: '/courier-otp',
    bodyPadTop: 30,
  },
} as const;

/** 01-Main (customer) and 21-CPhone (courier). */
export function SignupPhoneScreen({ role }: { role: Role }) {
  const c = copy[role];
  const agreed = useTermsAgreed();
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const setOtpSent = useSignupDraft((s) => s.setOtpSent);
  const phoneRef = useRef<TextInputInstance>(null);
  const audience = audienceFor(role);
  const loadTerms = useTermsStore((s) => s.load);

  // Start every sign-up unticked, and fetch the current terms (their version is sent with the phone).
  useEffect(() => {
    setTermsAgreed(false);
    loadTerms(audience).catch(() => undefined); // retried on send
  }, [audience, loadTerms]);

  const error = serverError ?? (submitted ? phoneError(phone) : null);

  // Single gate for every way of submitting (button, keyboard Enter/Done):
  // the terms must be accepted and the phone valid before anything is sent.
  const send = async () => {
    setSubmitted(true);
    if (sending) return;
    if (!agreed) setShowHint(true);
    if (phoneError(phone)) {
      // wrong number → cursor back in the field
      phoneRef.current?.focus();
      return;
    }
    if (!agreed) return;
    const normalized = normalizeEgPhone(phone);

    setSending(true);
    setServerError(null);
    try {
      const terms = useTermsStore.getState().byAudience[audience] ?? (await loadTerms(audience));
      const sent = await signupSendOtp(role, normalized, terms.version);
      setOtpSent(normalized, sent.resendAfterSeconds, terms.version);
      router.push({ pathname: c.next, params: { phone: normalized } });
    } catch (e) {
      if (e instanceof ApiError && e.fieldErrors.phone) {
        // wrong / already registered number → under the field, cursor back in it
        setServerError(e.fieldErrors.phone);
        phoneRef.current?.focus();
        return;
      }
      if (e instanceof ApiError && e.code === 'TERMS_NOT_ACCEPTED') {
        // Terms changed since they were loaded: get the new version and ask for agreement again.
        setTermsAgreed(false);
        loadTerms(audience).catch(() => undefined);
      }
      // anything else (no internet, too many codes, terms changed…) → popup
      showErrorPopup(errorMessage(e));
    } finally {
      setSending(false);
    }
  };

  return (
    <ScreenContainer statusBar="light" paddingBottom={28}>
      <BrandHeader title="اقضيها" {...c.header} />

      <View style={[styles.body, { paddingTop: c.bodyPadTop }]}>
        <View style={styles.titles}>
          <AppText size={fontSize.h1} weight="bold">
            {c.title}
          </AppText>
          <AppText size={fontSize.md} color={colors.textMuted}>
            {c.subtitle}
          </AppText>
        </View>

        <PhoneField
          ref={phoneRef}
          value={phone}
          onChangeText={(t) => {
            setPhone(t);
            setServerError(null);
          }}
          error={error}
          onSubmitEditing={send}
        />

        <Checkbox
          checked={agreed}
          hasError={showHint}
          onChange={(v) => {
            setTermsAgreed(v);
            setShowHint(false);
          }}>
          <AppText size={fontSize.body} lineHeight={1.7}>
            {c.terms[0]}
            <LinkText weight="bold" underline onPress={() => router.push({ pathname: '/terms', params: { role } })}>
              {c.terms[1]}
            </LinkText>
            {c.terms[2]}
          </AppText>
        </Checkbox>

        <Spacer />

        <View style={styles.actions}>
          {agreed ? (
            <Button
              title="ابعتلي الكود على واتساب"
              icon={role === 'customer' ? <WhatsappIcon color={colors.accentText} /> : undefined}
              onPress={send}
              loading={sending}
            />
          ) : (
            <>
              <Button variant="disabled" title="ابعتلي الكود على واتساب" onPress={() => setShowHint(true)} />
              {showHint ? <FieldError message={c.termsHint} center /> : null}
            </>
          )}
          <AppText size={role === 'customer' ? fontSize.body : fontSize.body2} color={colors.textMuted} center>
            عندك حساب؟{' '}
            <LinkText onPress={() => router.push({ pathname: '/login', params: { role } })}>سجّل دخول</LinkText>
          </AppText>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: spacing.s24, gap: spacing.s20 },
  titles: { gap: spacing.xs },
  actions: { gap: spacing.ml },
});
