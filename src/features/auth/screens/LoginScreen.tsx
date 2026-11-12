import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, View, type TextInputInstance } from 'react-native';

import { login as loginRequest } from '@/api/auth';
import { ApiError, errorMessage } from '@/api/client';

import { CheckIcon } from '@/components/icons';
import {
  AppText,
  Button,
  LinkText,
  PasswordField,
  PhoneField,
  ScreenContainer,
  Segmented,
  Spacer,
} from '@/components/ui';
import { useSession } from '@/store/session';
import { colors, fontSize, radii, spacing } from '@/theme';
import { showErrorPopup } from '@/utils/alert';
import { goBack, type Role } from '@/utils/nav';
import { normalizeEgPhone, phoneError, requiredError } from '@/utils/validation';

import { goAfterLogin } from '../afterLogin';
import { AuthHeader } from '../components/AuthHeader';

/**
 * 00c-Login — POST /api/v1/auth/login (same endpoint for customer and courier).
 * The tab only changes the sign-up / forgot-password links; after login the account's real role decides the home.
 */
export default function LoginScreen() {
  const params = useLocalSearchParams<{ role?: Role; reset?: string }>();
  const [role, setRole] = useState<Role>(params.role === 'courier' ? 'courier' : 'customer');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  /** Errors from the backend, shown under the field. */
  const [serverErrors, setServerErrors] = useState<{ phone?: string; password?: string }>({});
  const phoneRef = useRef<TextInputInstance>(null);
  const passwordRef = useRef<TextInputInstance>(null);
  const signIn = useSession((s) => s.signIn);

  const local = {
    phone: phoneError(phone),
    password: requiredError(password, 'اكتب الباسورد'),
  };
  const errorOf = (k: 'phone' | 'password') => serverErrors[k] ?? (submitted ? local[k] : null);
  const courier = role === 'courier';

  const login = async () => {
    setSubmitted(true);
    if (busy) return;
    // wrong field → cursor in it
    if (local.phone) return phoneRef.current?.focus();
    if (local.password) return passwordRef.current?.focus();

    setBusy(true);
    setServerErrors({});
    try {
      const auth = await loginRequest(normalizeEgPhone(phone), password);
      await signIn(auth);
      goAfterLogin(auth.user);
    } catch (e) {
      handleError(e);
    } finally {
      setBusy(false);
    }
  };

  const handleError = (e: unknown) => {
    if (e instanceof ApiError) {
      if (e.code === 'INVALID_CREDENTIALS') {
        // the backend doesn't say which one is wrong → under the password, cursor there
        setServerErrors({ password: e.message });
        passwordRef.current?.focus();
        return;
      }
      if (e.code === 'COURIER_PENDING_APPROVAL') {
        // no token yet: show the "under review" screen
        router.push({ pathname: '/courier-pending', params: { mode: 'wait', message: e.message } });
        return;
      }
      if (e.fieldErrors.phone || e.fieldErrors.password) {
        setServerErrors({ phone: e.fieldErrors.phone, password: e.fieldErrors.password });
        (e.fieldErrors.phone ? phoneRef : passwordRef).current?.focus();
        return;
      }
    }
    // rejected courier, suspended / banned account, no internet… → popup
    showErrorPopup(errorMessage(e));
  };

  return (
    <ScreenContainer statusBar="light" paddingBottom={28}>
      <AuthHeader title="أهلاً بيك تاني" subtitle="ادخل برقم موبايلك والباسورد" onBack={() => goBack('/role')}>
        <Segmented
          value={role}
          onChange={setRole}
          options={[
            { value: 'customer', label: 'عميل' },
            { value: 'courier', label: 'مندوب' },
          ]}
        />
      </AuthHeader>

      <View style={styles.body}>
        {params.reset ? (
          <View style={styles.notice}>
            <CheckIcon size={18} color={colors.successText} />
            <AppText size={fontSize.body2} weight="bold" color={colors.successText}>
              الباسورد اتغيّر، ادخل بالباسورد الجديد
            </AppText>
          </View>
        ) : null}

        <PhoneField
          ref={phoneRef}
          value={phone}
          onChangeText={(t) => {
            setPhone(t);
            setServerErrors({});
          }}
          error={errorOf('phone')}
          onSubmitEditing={() => passwordRef.current?.focus()}
        />

        <View style={styles.passBlock}>
          <PasswordField
            ref={passwordRef}
            label="الباسورد"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              setServerErrors({});
            }}
            error={errorOf('password')}
            returnKeyType="go"
            onSubmitEditing={login}
          />
          <LinkText weight="bold" size={fontSize.body} style={styles.forgot} onPress={() => router.push({ pathname: '/forgot-password', params: { role } })}>
            نسيت الباسورد؟
          </LinkText>
        </View>

        <Spacer />

        <Button title="دخول" weight="extrabold" onPress={login} loading={busy} />
        <AppText size={fontSize.body} color={colors.textMuted} center>
          مش عندك حساب؟{' '}
          <LinkText onPress={() => router.push(courier ? '/courier-phone' : '/phone')}>
            {courier ? 'سجّل كمندوب' : 'اعمل حساب'}
          </LinkText>
        </AppText>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingTop: spacing.s28, paddingHorizontal: spacing.s24, gap: spacing.s18 },
  passBlock: { gap: spacing.md },
  forgot: { alignSelf: 'flex-start' },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.input,
    backgroundColor: colors.successBg,
  },
});
