import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { BackIcon, BellIcon, CameraIcon, ChatIcon, DocIcon, OrdersIcon, PinIcon } from '@/components/icons';
import {
  AppText,
  Avatar,
  Button,
  Card,
  DateField,
  Header,
  KeyValueRow,
  LinkText,
  ScreenContainer,
  TextField,
} from '@/components/ui';
import { addressesResponse, meResponse } from '@/mocks/customer';
import { useCustomer } from '@/store/customer';
import { usePoints } from '@/store/points';
import { useSession } from '@/store/session';
import { colors, fontSize, radii, spacing } from '@/theme';
import { confirmAction, showInfo } from '@/utils/alert';
import { ar } from '@/utils/format';
import { resetTo } from '@/utils/nav';
import { pickImage } from '@/utils/pickImage';
import { dobError, formatEgPhone, fullNameError, isValidEmail, isValidWallet, onlyDigits } from '@/utils/validation';

function MenuRow({ icon, label, value, onPress, last }: { icon: React.ReactNode; label: string; value?: string; onPress: () => void; last?: boolean }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={[styles.menuRow, !last && styles.menuBorder]}>
      {icon}
      <AppText size={fontSize.md} weight="semibold" style={styles.flex}>
        {label}
      </AppText>
      {value ? (
        <AppText size={fontSize.body2} color={colors.textMuted}>
          {value}
        </AppText>
      ) : null}
    </Pressable>
  );
}

/** 18-Account (tab: حسابي): profile, edit details, menu, sign out. */
export default function AccountScreen() {
  const me = meResponse.data;
  const { details, saveDetails } = useCustomer();
  const points = usePoints((s) => s.balance);
  const signOut = useSession((s) => s.signOut);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(details);
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    name: fullNameError(form.fullName),
    email: form.email.trim() && !isValidEmail(form.email) ? 'الإيميل مش صحيح' : null,
    dob: dobError(form.dob),
    phone: form.secondPhone && !isValidWallet(form.secondPhone) ? 'الرقم لازم يكون ١١ رقم ويبدأ بـ 01' : null,
  };
  const show = (e: string | null) => (submitted ? e : null);

  const toggleEdit = () => {
    setForm(details);
    setSubmitted(false);
    setEditing((e) => !e);
  };

  const save = () => {
    setSubmitted(true);
    if (Object.values(errors).some(Boolean)) return;
    saveDetails(form);
    setEditing(false);
  };

  const changePhoto = async () => {
    const uri = await pickImage({ source: 'both', aspect: [1, 1] });
    if (uri) saveDetails({ photoUri: uri });
  };

  const logout = () =>
    confirmAction('تسجيل الخروج', 'متأكد إنك عايز تخرج من حسابك؟', 'خروج', () => {
      signOut().finally(() => resetTo('/phone'));
    });

  const deleteAccount = () =>
    confirmAction('مسح الحساب', 'هيتمسح حسابك ونقاطك وكل طلباتك، ومش هتقدر ترجعهم.', 'امسح حسابي', () => {
      signOut().finally(() => resetTo('/phone'));
    });

  const dobText = `${ar(details.dob.day)} / ${ar(details.dob.month)} / ${ar(details.dob.year)}`;

  return (
    <ScreenContainer
      statusBar="light"
      header={
        <Header paddingTop={50} paddingBottom={22} paddingHorizontal={spacing.xxl} radius={radii.header} gap={spacing.ml} center>
          <View style={styles.topRow}>
            <Pressable onPress={() => router.navigate('/home')} accessibilityRole="button" accessibilityLabel="رجوع" style={styles.back}>
              <BackIcon color={colors.textOnPrimary} />
            </Pressable>
            <AppText size={fontSize.h3} weight="bold" color={colors.textOnPrimary}>
              حسابي
            </AppText>
            <View style={styles.backSpacer} />
          </View>
          <Pressable onPress={changePhoto} accessibilityRole="button" accessibilityLabel="غيّر صورتك" style={styles.avatarWrap}>
            <Avatar initial={details.fullName.charAt(0)} uri={details.photoUri} size={88} fontSize={34} bg={colors.accentSoft} fg={colors.primary} style={styles.avatar} />
            <View style={styles.camera}>
              <CameraIcon size={15} color={colors.accentText} />
            </View>
          </Pressable>
          <View style={styles.center}>
            <AppText size={fontSize.h3} weight="extrabold" color={colors.textOnPrimary}>
              {details.fullName}
            </AppText>
            <AppText size={fontSize.body} color={colors.textOnPrimaryMuted} style={styles.ltr}>
              {`+20 ${formatEgPhone(me.phone)}`}
            </AppText>
          </View>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <AppText size={fontSize.h4} weight="extrabold" color={colors.textOnPrimary} center>
                {ar(me.ordersCount)}
              </AppText>
              <AppText size={fontSize.xs} color={colors.textOnPrimaryMuted} center>
                أوردر
              </AppText>
            </View>
            <Pressable onPress={() => router.push('/points')} accessibilityRole="button" style={styles.stat}>
              <AppText size={fontSize.h4} weight="extrabold" color={colors.accent} center>
                {ar(points)}
              </AppText>
              <AppText size={fontSize.xs} color={colors.textOnPrimaryMuted} center>
                نقطة
              </AppText>
            </Pressable>
            <View style={styles.stat}>
              <AppText size={fontSize.h4} weight="extrabold" color={colors.textOnPrimary} center>
                {me.memberSince}
              </AppText>
              <AppText size={fontSize.xs} color={colors.textOnPrimaryMuted} center>
                معانا من
              </AppText>
            </View>
          </View>
        </Header>
      }
      contentStyle={styles.body}>
      <Card padding={spacing.xl} gap={spacing.lg}>
        <View style={styles.cardHead}>
          <AppText size={fontSize.lg} weight="extrabold">
            بياناتي
          </AppText>
          <Button
            variant={editing ? 'outline' : 'primary'}
            title={editing ? 'إلغاء' : 'تعديل'}
            textSize={13}
            textColor={editing ? colors.primary : colors.textOnPrimary}
            onPress={toggleEdit}
            style={[styles.editBtn, !editing && styles.editBtnOn]}
          />
        </View>

        {editing ? (
          <View style={styles.form}>
            <TextField size="xs" label="الاسم بالكامل" value={form.fullName} onChangeText={(t) => setForm({ ...form, fullName: t })} error={show(errors.name)} />
            <TextField
              size="xs"
              label="الإيميل"
              value={form.email}
              onChangeText={(t) => setForm({ ...form, email: t })}
              keyboardType="email-address"
              autoCapitalize="none"
              ltr
              error={show(errors.email)}
            />
            <DateField label="تاريخ الميلاد" value={form.dob} onChange={(dob) => setForm({ ...form, dob })} error={show(errors.dob)} />
            <TextField
              size="xs"
              label="رقم تاني (اختياري)"
              placeholder="01X XXXX XXXX"
              value={form.secondPhone}
              onChangeText={(t) => setForm({ ...form, secondPhone: onlyDigits(t).slice(0, 11) })}
              keyboardType="phone-pad"
              ltr
              error={show(errors.phone)}
            />
            <View style={styles.phoneRow}>
              <View style={styles.flex}>
                <AppText size={fontSize.body2} weight="semibold">
                  رقم الموبايل
                </AppText>
                <AppText size={fontSize.body} weight="bold" style={styles.ltr}>
                  {`+20 ${formatEgPhone(me.phone)}`}
                </AppText>
              </View>
              <LinkText weight="bold" size={fontSize.body2} onPress={() => router.push('/phone')}>
                غيّره بكود واتساب
              </LinkText>
            </View>
            <Button title="احفظ التعديلات" weight="extrabold" textSize={16} onPress={save} style={styles.save} />
          </View>
        ) : (
          <View style={styles.form}>
            <KeyValueRow label="الاسم" value={details.fullName} color={colors.textMuted} valueColor={colors.text} valueWeight="bold" />
            <KeyValueRow
              label="الإيميل"
              color={colors.textMuted}
              value={
                <AppText size={fontSize.body} weight="bold" style={styles.ltr}>
                  {details.email || '—'}
                </AppText>
              }
            />
            <KeyValueRow label="تاريخ الميلاد" value={dobText} color={colors.textMuted} valueColor={colors.text} valueWeight="bold" />
            <KeyValueRow label="النوع" value={details.gender === 'male' ? 'ذكر' : 'أنثى'} color={colors.textMuted} valueColor={colors.text} valueWeight="bold" />
            <KeyValueRow
              label="رقم تاني"
              color={colors.textMuted}
              value={
                details.secondPhone ? (
                  <AppText size={fontSize.body} weight="bold" style={styles.ltr}>
                    {details.secondPhone}
                  </AppText>
                ) : (
                  <AppText size={fontSize.body} weight="semibold" color={colors.placeholder}>
                    مش متضاف
                  </AppText>
                )
              }
            />
          </View>
        )}
      </Card>

      <Card padding={spacing.xl} gap={0} style={styles.menu}>
        <MenuRow
          icon={<PinIcon color={colors.primary} />}
          label="عناويني المحفوظة"
          value={ar(addressesResponse.data.length)}
          onPress={() => router.push({ pathname: '/map-pick', params: { mode: 'end' } })}
        />
        <MenuRow icon={<OrdersIcon color={colors.primary} />} label="طلباتي" onPress={() => router.navigate('/orders')} />
        <MenuRow icon={<BellIcon color={colors.primary} />} label="الإشعارات" onPress={() => router.push('/notifications')} />
        <MenuRow icon={<ChatIcon color={colors.primary} />} label="كلّم الدعم" onPress={() => showInfo('كلّم الدعم', 'فريق الدعم هيتواصل معاك على رقمك في أقرب وقت.')} />
        <MenuRow icon={<DocIcon color={colors.primary} />} label="الشروط والأحكام" onPress={() => router.push({ pathname: '/terms', params: { role: 'customer' } })} last />
      </Card>

      <Button variant="danger" title="تسجيل الخروج" onPress={logout} style={styles.logout} />
      <LinkText weight="regular" size={fontSize.sm} color={colors.textMuted} style={styles.delete} onPress={deleteAccount}>
        مسح الحساب
      </LinkText>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { alignItems: 'center' },
  ltr: { writingDirection: 'ltr' },
  topRow: { alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { width: 44, height: 44, borderRadius: radii.md, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  backSpacer: { width: 44 },
  avatarWrap: { width: 88, height: 88 },
  avatar: { borderWidth: 3, borderColor: colors.surface },
  // bottom-left = end side in RTL
  camera: {
    position: 'absolute',
    bottom: -2,
    end: -2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stats: { alignSelf: 'stretch', flexDirection: 'row', gap: spacing.md },
  stat: { flex: 1, padding: spacing.md, borderRadius: radii.md, backgroundColor: colors.primaryLight },
  body: { padding: spacing.xxl, gap: spacing.lg },
  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  editBtn: { height: 36, borderRadius: 10, paddingHorizontal: spacing.xl, borderWidth: 1, borderColor: colors.primary },
  editBtnOn: { backgroundColor: colors.primary },
  form: { gap: spacing.ml },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.ml, paddingVertical: spacing.ml, paddingHorizontal: spacing.lg, borderRadius: radii.md, backgroundColor: colors.background },
  save: { height: 50, borderRadius: radii.input },
  menu: { paddingVertical: spacing.sm },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, paddingVertical: spacing.lg },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: colors.dividerLight },
  logout: { borderRadius: radii.input, backgroundColor: colors.surface },
  delete: { alignSelf: 'center' },
});
