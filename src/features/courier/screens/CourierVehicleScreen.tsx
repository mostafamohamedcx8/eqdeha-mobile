import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { courierCompleteSignup, type VehicleType } from '@/api/auth';
import { ApiError, errorMessage } from '@/api/client';
import { BikeIcon, IdCardIcon, LockIcon } from '@/components/icons';
import {
  AppText,
  Button,
  Card,
  Chip,
  FieldError,
  FooterBar,
  FieldAnchor,
  ImagePickerBox,
  OptionButton,
  ScreenContainer,
  StepProgress,
  TextField,
  useFormFocus,
  useDesignInsets,
} from '@/components/ui';
import { useSignupDraft, type CourierInfoField } from '@/features/auth/signupDraft';
import { colors, fontSize, spacing } from '@/theme';
import { showErrorPopup } from '@/utils/alert';
import { resetTo } from '@/utils/nav';
import { dobToIso, PLATE_MAX_LENGTH, sanitizePlate } from '@/utils/validation';

const VEHICLE_TYPES: { label: string; value: VehicleType }[] = [
  { label: 'موتوسيكل', value: 'motorcycle' },
  { label: 'سكوتر', value: 'scooter' },
  { label: 'عجلة', value: 'bicycle' },
  { label: 'عربية', value: 'car' },
];
/**
 * The Arabic label is what the backend stores as the vehicle color (max 30 chars).
 * The first six are from the design; the rest are the other common vehicle colors.
 * The hex values are only the swatch dot, not theme colors. "تاني" (other) stays last.
 */
const VEHICLE_COLORS = [
  { label: 'أحمر', value: '#D62828' },
  { label: 'أسود', value: '#1F2A30' },
  { label: 'أبيض', value: '#FFFFFF' },
  { label: 'أزرق', value: '#1D4ED8' },
  { label: 'فضي', value: '#B8C2C7' },
  { label: 'رمادي', value: '#6B7280' },
  { label: 'أخضر', value: '#2E7D32' },
  { label: 'أصفر', value: '#FACC15' },
  { label: 'برتقالي', value: '#F97316' },
  { label: 'بني', value: '#7C4A21' },
  { label: 'بيج', value: '#D8C3A5' },
  { label: 'ذهبي', value: '#C9A227' },
  { label: 'نبيتي', value: '#7F1D1D' },
  { label: 'تاني', value: '#E6E2D8' },
];

/** This screen's parts, in screen order. */
const FIELDS = ['idCard', 'vehicle', 'plate', 'vehiclePhoto'] as const;
type FieldKey = (typeof FIELDS)[number];

/** Backend field → field on this screen. */
const VEHICLE_FIELD: Record<string, FieldKey> = {
  idCardFront: 'idCard',
  idCardBack: 'idCard',
  vehicleType: 'vehicle',
  vehicleColor: 'vehicle',
  plateNumber: 'plate',
  vehiclePhoto: 'vehiclePhoto',
};
/** Backend field → field on the info screen (step 3). */
const INFO_FIELD: Record<string, CourierInfoField> = {
  photo: 'photo',
  fullName: 'name',
  address: 'address',
  birthDate: 'dob',
  walletType: 'wallet',
  walletNumber: 'wallet',
  password: 'password',
};

function Required({ children }: { children: string }) {
  return (
    <AppText size={fontSize.md} weight="bold">
      {children} <AppText color={colors.dangerStrong}>*</AppText>
    </AppText>
  );
}

/** 24-CVehicle — courier sign-up step 4: sends steps 3 + 4 to the backend in one request. */
export default function CourierVehicleScreen() {
  const inset = useDesignInsets();
  // Start from the draft: after a trip back to step 3 the photos are still here.
  const [saved] = useState(() => useSignupDraft.getState().courierVehicle);
  const [idFront, setIdFront] = useState<string | null>(saved?.idFrontUri ?? null);
  const [idBack, setIdBack] = useState<string | null>(saved?.idBackUri ?? null);
  const [type, setType] = useState<VehicleType>(saved?.vehicleType ?? 'motorcycle');
  const [color, setColor] = useState(saved?.vehicleColor ?? 'أحمر');
  const [plate, setPlate] = useState(sanitizePlate(saved?.plateNumber ?? ''));
  const [vehiclePhoto, setVehiclePhoto] = useState<string | null>(saved?.vehiclePhotoUri ?? null);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [serverErrors, setServerErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const form = useFormFocus<FieldKey>();

  // Snapshot at mount: clearing the draft after success must not trigger the redirect below.
  const [ready] = useState(() => {
    const s = useSignupDraft.getState();
    return !!s.verificationToken && !!s.courierInfo;
  });
  const setCourierVehicle = useSignupDraft((s) => s.setCourierVehicle);
  const setInfoErrors = useSignupDraft((s) => s.setCourierInfoErrors);
  const resetDraft = useSignupDraft((s) => s.reset);

  // Opened without the earlier steps (e.g. app reload) → start sign-up again.
  useEffect(() => {
    if (!ready) resetTo('/courier-phone');
  }, [ready]);

  // Keep step 4 in the draft while it's being filled.
  useEffect(() => {
    setCourierVehicle({ idFrontUri: idFront, idBackUri: idBack, vehicleType: type, vehicleColor: color, plateNumber: plate, vehiclePhotoUri: vehiclePhoto });
  }, [idFront, idBack, type, color, plate, vehiclePhoto, setCourierVehicle]);

  const local: Record<FieldKey, string | null> = {
    idCard: !idFront || !idBack ? 'لازم تصوّر البطاقة وش وضهر' : null,
    vehicle: null,
    plate: null,
    vehiclePhoto: vehiclePhoto ? null : 'لازم تصوّر العربية',
  };
  const errorOf = (k: FieldKey) => serverErrors[k] ?? (submitted ? local[k] : null);
  const clearServer = (k: FieldKey) => {
    if (serverErrors[k]) setServerErrors(({ [k]: _, ...rest }) => rest);
  };

  const send = async () => {
    setSubmitted(true);
    const { verificationToken, courierInfo: info } = useSignupDraft.getState();
    if (busy || !verificationToken || !info) return;
    // scroll to the first missing photo
    if (form.focusFirst(FIELDS, (k) => !!local[k])) return;

    setBusy(true);
    setServerErrors({});
    setInfoErrors(null);
    try {
      const res = await courierCompleteSignup({
        verificationToken,
        fullName: info.fullName,
        password: info.password,
        birthDate: dobToIso(info.dob),
        address: info.address,
        walletType: info.walletType,
        walletNumber: info.walletNumber,
        vehicleType: type,
        vehicleColor: color,
        plateNumber: plate,
        photoUri: info.photoUri,
        idCardFrontUri: idFront!,
        idCardBackUri: idBack!,
        vehiclePhotoUri: vehiclePhoto!,
      });
      resetDraft();
      // No token: the account waits for the admin. Clear the stack so "back" can't return to the form.
      resetTo({ pathname: '/courier-pending', params: { message: res.message } });
    } catch (e) {
      handleServerError(e);
    } finally {
      setBusy(false);
    }
  };

  /** Errors on this screen → under the field + scroll to it; errors on step 3 → back there; the rest → popup. */
  const handleServerError = (e: unknown) => {
    if (e instanceof ApiError && e.code === 'VERIFICATION_TOKEN_INVALID') {
      // The 15-minute verification expired or was used: the phone must be verified again.
      showErrorPopup(e.message, 'لازم نأكد رقمك تاني', () => resetTo('/courier-phone'));
      return;
    }
    const here: Partial<Record<FieldKey, string>> = {};
    const info: Partial<Record<CourierInfoField, string>> = {};
    const unmapped: string[] = [];
    if (e instanceof ApiError) {
      for (const [field, message] of Object.entries(e.fieldErrors)) {
        const h = VEHICLE_FIELD[field];
        const i = INFO_FIELD[field];
        if (h) here[h] ??= message;
        else if (i) info[i] ??= message;
        else unmapped.push(message);
      }
    }
    const hasInfo = Object.keys(info).length > 0;
    setServerErrors(here);
    setInfoErrors(hasInfo ? info : null);

    if (unmapped.length) showErrorPopup(unmapped.join('\n'));
    const first = FIELDS.find((k) => here[k]);
    if (first) form.focusField(first); // fix this screen first; step 3 errors wait there
    else if (hasInfo) router.back(); // the info screen shows them and focuses the first one
    else if (!unmapped.length) showErrorPopup(errorMessage(e));
  };

  return (
    <ScreenContainer
      header={
        <View style={[styles.top, { paddingTop: inset.top(48) }]}>
          <StepProgress total={4} current={4} label="خطوة ٤ من ٤ · البطاقة والعربية" gap={spacing.md} />
          <AppText size={fontSize.h2} weight="bold">
            البطاقة والعربية
          </AppText>
        </View>
      }
      footer={
        <FooterBar paddingTop={12} paddingBottom={28}>
          <Button title="ابعت بياناتي للمراجعة" onPress={send} loading={busy} />
        </FooterBar>
      }
      contentStyle={styles.content}
      scrollRef={form.scrollRef}>
      <FieldAnchor ref={form.anchor('idCard')}>
        <Card>
          <View style={styles.cardHead}>
            <Required>البطاقة الشخصية</Required>
            <View style={styles.secure}>
              <LockIcon size={14} color={colors.successText} />
              <AppText size={fontSize.sm} weight="bold" color={colors.successText}>
                محفوظة ومشفّرة
              </AppText>
            </View>
          </View>
          <View style={styles.row}>
            <ImagePickerBox
              variant="tile"
              value={idFront}
              onChange={(uri) => {
                setIdFront(uri);
                clearServer('idCard');
              }}
              hasError={!!serverErrors.idCard || (submitted && !idFront)}
              icon={<IdCardIcon size={30} color={colors.primary} />}
              label="صوّر الوش"
              doneLabel="الوش اتصوّر"
              accessibilityLabel="صوّر وش البطاقة"
            />
            <ImagePickerBox
              variant="tile"
              value={idBack}
              onChange={(uri) => {
                setIdBack(uri);
                clearServer('idCard');
              }}
              hasError={!!serverErrors.idCard || (submitted && !idBack)}
              icon={<IdCardIcon size={30} color={colors.primary} />}
              label="صوّر الضهر"
              doneLabel="الضهر اتصوّر"
              accessibilityLabel="صوّر ضهر البطاقة"
            />
          </View>
          {errorOf('idCard') ? <FieldError message={errorOf('idCard')!} /> : null}
        </Card>
      </FieldAnchor>

      <FieldAnchor ref={form.anchor('vehicle')}>
        <Card>
          <Required>بتوصّل بإيه؟</Required>
          <View style={styles.types}>
            {VEHICLE_TYPES.map((t) => (
              <OptionButton
                key={t.value}
                size="md"
                label={t.label}
                selected={type === t.value}
                onPress={() => {
                  setType(t.value);
                  clearServer('vehicle');
                }}
              />
            ))}
          </View>
          <View style={styles.colorTitle}>
            <Required>لونها</Required>
          </View>
          <View style={styles.colors}>
            {VEHICLE_COLORS.map((c) => (
              <Chip
                key={c.label}
                label={c.label}
                swatch={c.value}
                selected={color === c.label}
                onPress={() => {
                  setColor(c.label);
                  clearServer('vehicle');
                }}
              />
            ))}
          </View>
          {errorOf('vehicle') ? <FieldError message={errorOf('vehicle')!} /> : null}
          <FieldAnchor ref={form.anchor('plate')}>
            <View style={styles.plate}>
              <TextField
                ref={form.input('plate')}
                size="sm"
                label="رقم اللوحة (لو موجودة)"
                hint="حروف وأرقام بس، من غير مسافات (٨ بالكتير)"
                placeholder="سعد١٢٣"
                value={plate}
                onChangeText={(t) => {
                  setPlate(sanitizePlate(t));
                  clearServer('plate');
                }}
                error={errorOf('plate')}
                maxLength={PLATE_MAX_LENGTH}
                autoCapitalize="characters"
                autoCorrect={false}
              />
            </View>
          </FieldAnchor>
        </Card>
      </FieldAnchor>

      <FieldAnchor ref={form.anchor('vehiclePhoto')}>
        <Card>
          <Required>صورة العربية</Required>
          <View style={styles.row}>
            <ImagePickerBox
              variant="tile"
              height={120}
              value={vehiclePhoto}
              onChange={(uri) => {
                setVehiclePhoto(uri);
                clearServer('vehiclePhoto');
              }}
              hasError={!!errorOf('vehiclePhoto')}
              icon={<BikeIcon size={36} color={colors.primary} strokeWidth={1.6} />}
              label="صوّر العربية كلها واللوحة باينة"
              doneLabel="العربية اتصوّرت"
              accessibilityLabel="صوّر العربية"
            />
          </View>
          {errorOf('vehiclePhoto') ? <FieldError message={errorOf('vehiclePhoto')!} /> : null}
        </Card>
      </FieldAnchor>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  top: { paddingHorizontal: spacing.s20, paddingBottom: spacing.lg, gap: spacing.md },
  content: { paddingTop: spacing.xs, paddingHorizontal: spacing.s20, paddingBottom: spacing.xxl, gap: spacing.xl },
  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  secure: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  row: { flexDirection: 'row', gap: spacing.ml },
  types: { flexDirection: 'row', gap: spacing.md },
  colorTitle: { marginTop: spacing.sm },
  colors: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.ml },
  plate: { marginTop: spacing.xs },
});
