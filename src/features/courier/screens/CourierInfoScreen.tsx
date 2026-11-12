import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { WalletType } from '@/api/auth';
import {
  AppText,
  Button,
  Card,
  DateField,
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
import { PasswordPair } from '@/features/auth/components/PasswordPair';
import { useSignupDraft, type CourierInfoField } from '@/features/auth/signupDraft';
import { colors, fontSize, radii, spacing } from '@/theme';
import { resetTo } from '@/utils/nav';
import {
  confirmPasswordError,
  dobError,
  emptyDate,
  fullNameError,
  onlyDigits,
  passwordError,
  requiredError,
  walletError,
  type DateParts,
} from '@/utils/validation';

const FIELDS = ['photo', 'name', 'address', 'dob', 'wallet', 'password', 'confirm'] as const;
type FieldKey = (typeof FIELDS)[number];

const WALLETS: { value: WalletType; label: string }[] = [
  { value: 'vodafone_cash', label: 'فودافون كاش' },
  { value: 'instapay', label: 'إنستاباي' },
];

/** 23-CInfo (+ password & confirm). Saved in the sign-up draft; sent to the backend with step 4. */
export default function CourierInfoScreen() {
  // Start from the draft so coming back to this screen keeps what was typed.
  const [saved] = useState(() => useSignupDraft.getState().courierInfo);
  const [photo, setPhoto] = useState<string | null>(saved?.photoUri ?? null);
  const [name, setName] = useState(saved?.fullName ?? '');
  const [address, setAddress] = useState(saved?.address ?? '');
  const [dob, setDob] = useState<DateParts>(saved?.dob ?? emptyDate);
  const [walletType, setWalletType] = useState<WalletType>(saved?.walletType ?? 'vodafone_cash');
  const [wallet, setWallet] = useState(saved?.walletNumber ?? '');
  const [password, setPassword] = useState(saved?.password ?? '');
  const [confirm, setConfirm] = useState(saved?.password ?? '');
  const [submitted, setSubmitted] = useState(false);
  const form = useFormFocus<FieldKey>();
  const { focusFirst } = form;

  // Snapshot at mount: clearing the draft after the final step must not trigger the redirect below.
  const [verificationToken] = useState(() => useSignupDraft.getState().verificationToken);
  const setCourierInfo = useSignupDraft((s) => s.setCourierInfo);
  /** Errors the backend returned for this screen's fields (set by the vehicle screen). */
  const serverErrors = useSignupDraft((s) => s.courierInfoErrors);
  const setServerErrors = useSignupDraft((s) => s.setCourierInfoErrors);

  // Opened without a verified phone (e.g. app reload) → start sign-up again.
  useEffect(() => {
    if (!verificationToken) resetTo('/courier-phone');
  }, [verificationToken]);

  // Sent back here by the vehicle screen because the backend rejected a field → go to the first one.
  useFocusEffect(
    useCallback(() => {
      const errs = useSignupDraft.getState().courierInfoErrors;
      if (!errs) return;
      const t = setTimeout(() => focusFirst(FIELDS, (k) => !!errs[k as CourierInfoField]), 350);
      return () => clearTimeout(t);
    }, [focusFirst]),
  );

  const local: Record<FieldKey, string | null> = {
    photo: photo ? null : 'لازم تصوّر نفسك',
    name: fullNameError(name),
    address: requiredError(address, 'اكتب عنوانك'),
    dob: dobError(dob, 18),
    wallet: walletError(walletType, wallet),
    password: passwordError(password),
    confirm: confirmPasswordError(password, confirm),
  };
  const errorOf = (k: FieldKey) => serverErrors?.[k as CourierInfoField] ?? (submitted ? local[k] : null);
  const clearServer = (k: CourierInfoField) => {
    if (!serverErrors?.[k]) return;
    const { [k]: _, ...rest } = serverErrors;
    setServerErrors(Object.keys(rest).length ? rest : null);
  };

  const next = () => {
    setSubmitted(true);
    // go to the first wrong field (a server error still showing counts too)
    if (form.focusFirst(FIELDS, (k) => !!errorOf(k) || !!local[k])) return;
    setCourierInfo({
      photoUri: photo!,
      fullName: name,
      address,
      dob,
      walletType,
      walletNumber: wallet,
      password,
    });
    router.push('/courier-vehicle');
  };

  return (
    <ScreenContainer paddingTop={44} paddingBottom={24} contentStyle={styles.content} scrollRef={form.scrollRef}>
      <StepProgress total={4} current={3} label="خطوة ٣ من ٤ · بياناتك الشخصية" gap={spacing.md} />

      <View style={styles.titles}>
        <AppText size={fontSize.h1} weight="bold">
          عرّفنا بنفسك
        </AppText>
        <AppText size={fontSize.body} color={colors.textMuted}>
          البيانات دي بتظهر للعميل وقت الأوردر، ماعدا عنوانك
        </AppText>
      </View>

      <FieldAnchor ref={form.anchor('photo')}>
        <View style={styles.photoBlock}>
          <Card radius={radii.button} padding={spacing.lg} style={styles.photoCard}>
            <ImagePickerBox
              variant="avatar"
              value={photo}
              onChange={(uri) => {
                setPhoto(uri);
                clearServer('photo');
              }}
              source="camera"
              front
              aspect={[1, 1]}
              badgeBorder={colors.surface}
              hasError={!!errorOf('photo')}
              accessibilityLabel="صوّر نفسك"
            />
            <View style={styles.photoText}>
              <AppText size={fontSize.md} weight="bold">
                صورتك الشخصية <AppText color={colors.dangerStrong}>*</AppText>
              </AppText>
              <AppText size={fontSize.sm} lineHeight={1.5} color={colors.textMuted}>
                صورة واضحة لوشّك، من غير نضارة شمس. بتتاخد من الكاميرا دلوقتي.
              </AppText>
            </View>
          </Card>
          {errorOf('photo') ? <FieldError message={errorOf('photo')!} /> : null}
        </View>
      </FieldAnchor>

      <View style={styles.form}>
        <FieldAnchor ref={form.anchor('name')}>
          <TextField
            ref={form.input('name')}
            label="الاسم بالكامل زي البطاقة"
            placeholder="محمود سعيد عبد الله"
            value={name}
            onChangeText={(t) => {
              setName(t);
              clearServer('name');
            }}
            error={errorOf('name')}
            textContentType="name"
          />
        </FieldAnchor>
        <FieldAnchor ref={form.anchor('address')}>
          <TextField
            ref={form.input('address')}
            label="العنوان"
            placeholder="الشارع، رقم العمارة، المنطقة"
            value={address}
            onChangeText={(t) => {
              setAddress(t);
              clearServer('address');
            }}
            error={errorOf('address')}
            textContentType="fullStreetAddress"
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
        <FieldAnchor ref={form.anchor('wallet')}>
          <View style={styles.walletBlock}>
            <AppText size={fontSize.md} weight="bold">
              نوع محفظتك <AppText color={colors.dangerStrong}>*</AppText>
            </AppText>
            <View style={styles.walletTypes}>
              {WALLETS.map((w) => (
                <OptionButton
                  key={w.value}
                  size="md"
                  label={w.label}
                  selected={walletType === w.value}
                  onPress={() => {
                    setWalletType(w.value);
                    clearServer('wallet');
                    // a name@instapay address isn't valid for Vodafone Cash → keep digits only
                    if (w.value === 'vodafone_cash') setWallet((v) => onlyDigits(v).slice(0, 11));
                  }}
                />
              ))}
            </View>
            <TextField
              ref={form.input('wallet')}
              label={walletType === 'instapay' ? 'رقم إنستاباي أو العنوان' : 'رقم فودافون كاش'}
              hint="العميل هيحوّلك عليه تمن الأوردر"
              placeholder={walletType === 'instapay' ? '01X XXXX XXXX أو name@instapay' : '01X XXXX XXXX'}
              value={wallet}
              onChangeText={(t) => {
                setWallet(walletType === 'instapay' ? t.trim() : onlyDigits(t).slice(0, 11));
                clearServer('wallet');
              }}
              error={errorOf('wallet')}
              keyboardType={walletType === 'instapay' ? 'email-address' : 'phone-pad'}
              autoCapitalize="none"
              ltr
            />
          </View>
        </FieldAnchor>
        <FieldAnchor
          ref={(el) => {
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
            passwordServerError={serverErrors?.password}
            passwordRef={form.input('password')}
            confirmRef={form.input('confirm')}
          />
        </FieldAnchor>
      </View>

      <Spacer />

      <Button title="التالي: البطاقة والعربية" onPress={next} style={styles.button} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.s24, gap: spacing.xl },
  titles: { gap: spacing.xs },
  photoBlock: { gap: spacing.sm },
  photoCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl },
  photoText: { flex: 1, gap: spacing.xxs },
  form: { gap: spacing.xl },
  walletBlock: { gap: spacing.md },
  walletTypes: { flexDirection: 'row', gap: spacing.md },
  button: { marginTop: spacing.md },
});
