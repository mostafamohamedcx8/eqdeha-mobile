import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { customerCompleteSignup } from '@/api/auth';
import { ApiError, errorMessage } from '@/api/client';
import { FemaleIcon, MaleIcon } from '@/components/icons';
import {
  AppText,
  Button,
  DateField,
  Field,
  FieldAnchor,
  FieldError,
  ImagePickerBox,
  OptionButton,
  ScreenContainer,
  Spacer,
  StepProgress,
  TextField,
  useFormFocus,
} from '@/components/ui';
import { useSession } from '@/store/session';
import { colors, fontSize, spacing } from '@/theme';
import { showErrorPopup } from '@/utils/alert';
import { resetTo } from '@/utils/nav';
import {
  confirmPasswordError,
  dobError,
  dobToIso,
  emptyDate,
  fullNameError,
  isValidEmail,
  passwordError,
  type DateParts,
} from '@/utils/validation';

import { PasswordPair } from '../components/PasswordPair';
import { useSignupDraft } from '../signupDraft';

type Gender = 'male' | 'female';

/** Screen fields, in the order they appear (first one with a problem gets the focus). */
const FIELDS = ['photo', 'name', 'email', 'dob', 'gender', 'password', 'confirm'] as const;
type FieldKey = (typeof FIELDS)[number];

/** Backend field name → screen field. Anything else (e.g. verificationToken) is shown in a popup. */
const SERVER_FIELD: Record<string, FieldKey> = {
  photo: 'photo',
  fullName: 'name',
  email: 'email',
  birthDate: 'dob',
  gender: 'gender',
  password: 'password',
};

/** 04-Profile (+ password & confirm, designed in the same style). */
export default function ProfileScreen() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState<DateParts>(emptyDate);
  const [gender, setGender] = useState<Gender>('male');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  /** Errors returned by the backend, per screen field. */
  const [serverErrors, setServerErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const form = useFormFocus<FieldKey>();

  // Snapshot at mount: clearing the draft after success must not trigger the redirect below.
  const [verificationToken] = useState(() => useSignupDraft.getState().verificationToken);
  const resetDraft = useSignupDraft((s) => s.reset);
  const signIn = useSession((s) => s.signIn);

  // Opened without a verified phone (e.g. app reload) → start sign-up again.
  useEffect(() => {
    if (!verificationToken) resetTo('/phone');
  }, [verificationToken]);

  const local: Record<FieldKey, string | null> = {
    photo: null,
    name: fullNameError(name),
    email: email.trim() && !isValidEmail(email) ? 'الإيميل مش صحيح' : null,
    dob: dobError(dob),
    gender: null,
    password: passwordError(password),
    confirm: confirmPasswordError(password, confirm),
  };
  const errorOf = (k: FieldKey) => serverErrors[k] ?? (submitted ? local[k] : null);
  const clearServer = (k: FieldKey) => {
    if (serverErrors[k]) setServerErrors(({ [k]: _, ...rest }) => rest);
  };

  const submit = async () => {
    setSubmitted(true);
    if (busy || !verificationToken) return;
    // Client-side problem → go to the first wrong field.
    if (form.focusFirst(FIELDS, (k) => !!local[k])) return;

    setBusy(true);
    setServerErrors({});
    try {
      const auth = await customerCompleteSignup({
        verificationToken,
        fullName: name,
        password,
        birthDate: dobToIso(dob),
        gender,
        email,
        photoUri: photo,
      });
      await signIn(auth);
      resetDraft();
      resetTo('/home');
    } catch (e) {
      handleServerError(e);
    } finally {
      setBusy(false);
    }
  };

  /** Field errors → under the field + focus it. Everything else → popup. */
  const handleServerError = (e: unknown) => {
    if (e instanceof ApiError && e.code === 'VERIFICATION_TOKEN_INVALID') {
      // The 15-minute verification expired or was used: the phone must be verified again.
      showErrorPopup(e.message, 'لازم نأكد رقمك تاني', () => resetTo('/phone'));
      return;
    }
    const mapped: Partial<Record<FieldKey, string>> = {};
    const unmapped: string[] = [];
    if (e instanceof ApiError) {
      for (const [field, message] of Object.entries(e.fieldErrors)) {
        const key = SERVER_FIELD[field];
        if (key) mapped[key] = message;
        else unmapped.push(message);
      }
    }
    setServerErrors(mapped);
    const first = FIELDS.find((k) => mapped[k]);
    if (first) form.focusField(first);
    if (unmapped.length) showErrorPopup(unmapped.join('\n'));
    else if (!first) showErrorPopup(errorMessage(e));
  };

  return (
    <ScreenContainer paddingTop={48} paddingBottom={28} contentStyle={styles.content} scrollRef={form.scrollRef}>
      <StepProgress total={3} current={3} label="خطوة ٣ من ٣" />

      <View style={styles.titles}>
        <AppText size={fontSize.h1} weight="bold">
          كمّل بياناتك
        </AppText>
        <AppText size={fontSize.md} color={colors.textMuted}>
          خطوة أخيرة وتبدأ تطلب
        </AppText>
      </View>

      <View style={styles.form}>
        <FieldAnchor ref={form.anchor('photo')}>
          <View style={styles.photoBlock}>
            <View style={styles.photoRow}>
              <ImagePickerBox
                variant="avatar"
                value={photo}
                onChange={(uri) => {
                  setPhoto(uri);
                  clearServer('photo');
                }}
                hasError={!!errorOf('photo')}
                aspect={[1, 1]}
                accessibilityLabel="ضيف صورتك"
              />
              <View>
                <AppText size={fontSize.md} weight="bold">
                  صورتك الشخصية
                </AppText>
                <AppText size={fontSize.body2} color={colors.textMuted}>
                  اختياري · من الكاميرا أو المعرض
                </AppText>
              </View>
            </View>
            {errorOf('photo') ? <FieldError message={errorOf('photo')!} /> : null}
          </View>
        </FieldAnchor>

        <FieldAnchor ref={form.anchor('name')}>
          <TextField
            ref={form.input('name')}
            label="الاسم بالكامل"
            placeholder="أحمد محمد علي"
            value={name}
            onChangeText={(t) => {
              setName(t);
              clearServer('name');
            }}
            error={errorOf('name')}
            textContentType="name"
            autoComplete="name"
            returnKeyType="next"
          />
        </FieldAnchor>
        <FieldAnchor ref={form.anchor('email')}>
          <TextField
            ref={form.input('email')}
            label="الإيميل"
            placeholder="name@gmail.com"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              clearServer('email');
            }}
            error={errorOf('email')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            ltr
          />
        </FieldAnchor>
        <FieldAnchor ref={form.anchor('dob')}>
          <DateField
            ref={form.input('dob')}
            label="تاريخ الميلاد"
            value={dob}
            onChange={(d) => {
              setDob(d);
              clearServer('dob');
            }}
            error={errorOf('dob')}
          />
        </FieldAnchor>

        <FieldAnchor ref={form.anchor('gender')}>
          <Field label="النوع" error={errorOf('gender')}>
            <View style={styles.genders}>
              <OptionButton
                label="ذكر"
                selected={gender === 'male'}
                onPress={() => {
                  setGender('male');
                  clearServer('gender');
                }}
                icon={(c) => <MaleIcon color={c} />}
              />
              <OptionButton
                label="أنثى"
                selected={gender === 'female'}
                onPress={() => {
                  setGender('female');
                  clearServer('gender');
                }}
                icon={(c) => <FemaleIcon color={c} />}
              />
            </View>
          </Field>
        </FieldAnchor>

        {/* one anchor for both: password and confirm sit together */}
        <FieldAnchor ref={(el) => {
          form.anchor('password')(el);
          form.anchor('confirm')(el);
        }}>
          <PasswordPair
            password={password}
            confirm={confirm}
            onChangePassword={(t) => {
              setPassword(t);
              clearServer('password');
            }}
            onChangeConfirm={setConfirm}
            showErrors={submitted}
            passwordServerError={serverErrors.password}
            passwordRef={form.input('password')}
            confirmRef={form.input('confirm')}
          />
        </FieldAnchor>
      </View>

      <Spacer />

      <View style={styles.actions}>
        <Button title="يلا نبدأ" onPress={submit} loading={busy} />
        <AppText size={fontSize.sm} color={colors.textMuted} center>
          بياناتك محفوظة ومش هتظهر لحد غير المندوب وقت الأوردر
        </AppText>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.s24, gap: spacing.s18 },
  titles: { gap: spacing.xs },
  form: { gap: spacing.xxl },
  photoBlock: { gap: spacing.sm },
  photoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl },
  genders: { flexDirection: 'row', gap: spacing.ml },
  actions: { gap: spacing.ml, marginTop: spacing.md },
});
