import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { WhatsappCheckIcon } from '@/components/icons';
import { AppText, BackButton, Button, FieldError, LinkText, OtpInput, ScreenContainer, Spacer } from '@/components/ui';
import { ApiError, errorMessage } from '@/api/client';
import { colors, fontSize, spacing } from '@/theme';
import { showErrorPopup } from '@/utils/alert';
import { formatEgPhone, otpError } from '@/utils/validation';

const RESEND_SECONDS = 45;

/** Backend errors about the typed code itself (shown under the boxes). */
const CODE_ERRORS = new Set(['OTP_INVALID', 'OTP_EXPIRED', 'OTP_TOO_MANY_ATTEMPTS', 'VALIDATION_FAILED']);

type Props = {
  /** 10 digits after +20. */
  phone?: string;
  onBack: () => void;
  onChangeNumber: () => void;
  /**
   * Called with a 6-digit code. May be async: while it runs the button shows a spinner,
   * and if it throws, the error message (Arabic, from the backend) is shown under the code.
   */
  onConfirm: (code: string) => void | Promise<void>;
  /** Asks the backend for a new code; resolves with the new cooldown in seconds. Throws on failure. */
  onResend?: () => Promise<number>;
  /** Cooldown before "resend" is allowed (from the send-otp response). */
  resendSeconds?: number;
  title?: string;
};

/** 03-Otp / 22-COtp, also reused by the forgot-password flow. */
export function OtpScreen({
  phone,
  onBack,
  onChangeNumber,
  onConfirm,
  onResend,
  resendSeconds = RESEND_SECONDS,
  title = 'اكتب الكود اللي وصلك',
}: Props) {
  const [code, setCode] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [seconds, setSeconds] = useState(resendSeconds);
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const error = serverError ?? (submitted ? otpError(code) : null);

  const confirm = async () => {
    setSubmitted(true);
    if (otpError(code) || busy) return;
    setBusy(true);
    setServerError(null);
    try {
      await onConfirm(code);
    } catch (e) {
      // wrong / expired code → under the boxes; anything else (no internet…) → popup
      if (e instanceof ApiError && CODE_ERRORS.has(e.code)) setServerError(e.message);
      else showErrorPopup(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    setCode('');
    setServerError(null);
    if (!onResend) {
      setSeconds(RESEND_SECONDS);
      return;
    }
    try {
      setSeconds(await onResend());
    } catch (e) {
      showErrorPopup(errorMessage(e));
    }
  };

  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <ScreenContainer paddingTop={52} paddingBottom={30} contentStyle={styles.content}>
      <BackButton tone="onLight" onPress={onBack} />

      <View style={styles.intro}>
        <View style={styles.iconBox}>
          <WhatsappCheckIcon size={38} color={colors.primary} />
        </View>
        <AppText size={fontSize.h1} weight="bold" center>
          {title}
        </AppText>
        <View style={styles.center}>
          <AppText size={fontSize.md} lineHeight={1.7} color={colors.textMuted} center>
            بعتنالك كود من ٦ أرقام على واتساب على رقم
          </AppText>
          <AppText size={fontSize.md} lineHeight={1.7} weight="bold" style={styles.ltr}>
            {`+20 ${formatEgPhone(phone ?? '') || '10 1234 5678'}`}
          </AppText>
        </View>
        <LinkText weight="bold" size={fontSize.body} onPress={onChangeNumber}>
          تغيير الرقم
        </LinkText>
      </View>

      <View style={styles.otp}>
        <OtpInput
          value={code}
          onChangeText={(c) => {
            setCode(c);
            setServerError(null);
            if (c.length === 6) setSubmitted(false);
          }}
          hasError={!!error}
        />
        {error ? <FieldError message={error} center /> : null}
      </View>

      <View style={styles.resend}>
        {seconds > 0 ? (
          <AppText size={fontSize.body} color={colors.textMuted} center>
            مجالكش الكود؟ تقدر تطلب كود جديد بعد{' '}
            <AppText size={fontSize.body} weight="bold">
              {mmss}
            </AppText>
          </AppText>
        ) : (
          <AppText size={fontSize.body} color={colors.textMuted} center>
            مجالكش الكود؟{' '}
            <LinkText onPress={resend}>
              ابعتلي كود جديد
            </LinkText>
          </AppText>
        )}
        <AppText size={fontSize.body2} color={colors.placeholder} center>
          ومش لازم تقفل التطبيق، هنقرأ الكود لوحدنا
        </AppText>
      </View>

      <Spacer />

      <Button title="تأكيد" onPress={confirm} loading={busy} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.s24, gap: spacing.s28 },
  intro: { alignItems: 'center', gap: spacing.xl },
  center: { alignItems: 'center' },
  iconBox: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ltr: { writingDirection: 'ltr' },
  otp: { gap: spacing.md },
  resend: { alignItems: 'center', gap: spacing.sm },
});
