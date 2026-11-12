import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { CameraIcon, StarFilledIcon } from '@/components/icons';
import { AppText, Avatar, Button, Card, Header, KeyValueRow, LinkText, ScreenContainer } from '@/components/ui';
import { courierMeResponse } from '@/mocks/courier';
import { useCourier } from '@/store/courier';
import { useSession } from '@/store/session';
import { colors, fontSize, radii, spacing } from '@/theme';
import { confirmAction, showInfo } from '@/utils/alert';
import { ar, rating } from '@/utils/format';
import { resetTo } from '@/utils/nav';
import { formatLocalPhone } from '@/utils/phone';
import { pickImage } from '@/utils/pickImage';
import { formatEgPhone } from '@/utils/validation';

/** 1000 → "١٬٠٠٠" */
const thousands = (n: number) => ar(n.toLocaleString('en-US').replace(/,/g, '٬'));

function Section({ title, action, onAction, children }: { title: string; action: string; onAction: () => void; children: React.ReactNode }) {
  return (
    <Card padding={spacing.xl} gap={spacing.md}>
      <View style={styles.sectionHead}>
        <AppText size={fontSize.lg} weight="extrabold">
          {title}
        </AppText>
        <LinkText weight="bold" size={fontSize.body2} onPress={onAction}>
          {action}
        </LinkText>
      </View>
      {children}
    </Card>
  );
}

/** 31-CProfile (tab: حسابي). */
export default function CourierProfileScreen() {
  const me = courierMeResponse.data;
  const points = useCourier((s) => s.points);
  const signOut = useSession((s) => s.signOut);
  const [photo, setPhoto] = useState<string | null>(null);

  // Editing goes through admin review and needs the backend (sign-up screens need a verified session).
  const reviewNotice = () => showInfo('التعديل بيتراجع من الإدارة', 'تعديل البيانات والعربية هيتفعّل لما نربط التطبيق بالسيرفر، وأي تغيير بيرجع للإدارة تراجعه تاني.');

  const logout = () =>
    confirmAction('تسجيل الخروج', 'متأكد إنك عايز تخرج من حسابك؟', 'خروج', () => {
      signOut().finally(() => resetTo('/courier-phone'));
    });

  return (
    <ScreenContainer
      statusBar="light"
      header={
        <Header paddingTop={50} paddingBottom={20} paddingHorizontal={spacing.xxl} radius={radii.header} gap={spacing.md} center>
          <Pressable
            onPress={async () => {
              const uri = await pickImage({ source: 'camera', front: true, aspect: [1, 1] });
              if (uri) setPhoto(uri);
            }}
            accessibilityRole="button"
            accessibilityLabel="غيّر صورتك"
            style={styles.avatarWrap}>
            <Avatar initial={me.initial} uri={photo} size={84} fontSize={32} style={styles.avatar} />
            <View style={styles.camera}>
              <CameraIcon size={14} color={colors.accentText} />
            </View>
          </Pressable>
          <AppText size={fontSize.h3} weight="extrabold" color={colors.textOnPrimary}>
            {me.name}
          </AppText>
          <View style={styles.verified}>
            <AppText size={fontSize.sm} weight="bold" color={colors.textOnPrimary}>
              {`✓ حساب متفعّل · ${me.vehicle.type} ${me.vehicle.color}`}
            </AppText>
          </View>
          <Pressable
            onPress={() => router.push({ pathname: '/courier-reviews', params: { courier: String(me.id) } })}
            accessibilityRole="button"
            style={styles.ratingCard}>
            <StarFilledIcon size={22} />
            <AppText size={fontSize.h4} weight="extrabold" color={colors.textOnPrimary} style={styles.flex}>
              {`${rating(me.rating)} `}
              <AppText size={fontSize.sm} weight="semibold" color={colors.textOnPrimaryMuted}>
                {`من ${ar(me.reviewsCount)} تقييم`}
              </AppText>
            </AppText>
            <AppText size={fontSize.body2} weight="bold" color={colors.accent}>
              شوف تقييماتي ←
            </AppText>
          </Pressable>
        </Header>
      }
      contentStyle={styles.body}>
      <View style={styles.stats}>
        <Pressable onPress={() => router.push('/courier-points')} accessibilityRole="button" style={styles.stat}>
          <AppText size={fontSize.h4} weight="extrabold" color={colors.accentIcon} center>
            {`★ ${ar(points)}`}
          </AppText>
          <AppText size={fontSize.xs} color={colors.textMuted} center>
            نقطة
          </AppText>
        </Pressable>
        <View style={styles.stat}>
          <AppText size={fontSize.h4} weight="extrabold" center>
            {`${thousands(me.earnings.month)} ج`}
          </AppText>
          <AppText size={fontSize.xs} color={colors.textMuted} center>
            أرباح الشهر
          </AppText>
        </View>
        <View style={styles.stat}>
          <AppText size={fontSize.h4} weight="extrabold" center>
            {`${ar(me.warnings.count)} من ${ar(me.warnings.max)}`}
          </AppText>
          <AppText size={fontSize.xs} color={colors.textMuted} center>
            تحذيرات
          </AppText>
        </View>
      </View>

      <Section title="بياناتي" action="تعديل" onAction={reviewNotice}>
        <KeyValueRow
          label="الموبايل"
          color={colors.textMuted}
          value={
            <AppText size={fontSize.body} weight="bold" style={styles.ltr}>
              {`+20 ${formatEgPhone(me.phone)}`}
            </AppText>
          }
        />
        <KeyValueRow label="العنوان" value={me.address} color={colors.textMuted} valueColor={colors.text} valueWeight="bold" />
        <KeyValueRow label="تاريخ الميلاد" value={me.dob} color={colors.textMuted} valueColor={colors.text} valueWeight="bold" />
        <KeyValueRow
          label="محفظتك (للعملاء)"
          color={colors.textMuted}
          value={
            <AppText size={fontSize.body} weight="bold" style={styles.ltr}>
              {`${me.wallet.label} ${formatLocalPhone(me.wallet.number)}`}
            </AppText>
          }
        />
      </Section>

      <Section title="العربية والبطاقة" action="تحديث" onAction={reviewNotice}>
        <KeyValueRow label="النوع واللون" value={`${me.vehicle.type} · ${me.vehicle.color}`} color={colors.textMuted} valueColor={colors.text} valueWeight="bold" />
        <KeyValueRow label="اللوحة" value={me.vehicle.plate} color={colors.textMuted} valueColor={colors.text} valueWeight="bold" />
        <KeyValueRow
          label="البطاقة"
          value={me.idVerified ? '✓ اتراجعت' : 'لسه'}
          color={colors.textMuted}
          valueColor={me.idVerified ? colors.successText : colors.textMuted}
          valueWeight="bold"
        />
        <AppText size={fontSize.sm} color={colors.textMuted}>
          أي تغيير في البطاقة أو العربية بيرجع للإدارة تراجعه تاني.
        </AppText>
      </Section>

      <Card padding={spacing.xl} gap={0} style={styles.menu}>
        {[
          { l: 'المحفظة والعمولة', on: () => router.navigate('/courier-wallet') },
          { l: 'سجل الأوردرات', on: () => showInfo('سجل الأوردرات', 'سجل أوردراتك هيظهر هنا لما نربط التطبيق بالسيرفر.') },
          { l: 'كلّم الإدارة', on: () => showInfo('كلّم الإدارة', 'الإدارة هتتواصل معاك على رقمك في أقرب وقت.') },
          { l: 'شروط المناديب', on: () => router.push({ pathname: '/terms', params: { role: 'courier' } }) },
        ].map((m, i, arr) => (
          <Pressable key={m.l} onPress={m.on} accessibilityRole="button" style={[styles.menuRow, i < arr.length - 1 && styles.menuBorder]}>
            <AppText size={fontSize.md} weight="semibold">
              {m.l}
            </AppText>
          </Pressable>
        ))}
      </Card>

      <Button variant="danger" title="تسجيل الخروج" onPress={logout} style={styles.logout} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  ltr: { writingDirection: 'ltr' },
  avatarWrap: { width: 84, height: 84 },
  avatar: { borderWidth: 3, borderColor: colors.surface },
  // bottom-left = end side in RTL
  camera: {
    position: 'absolute',
    bottom: -2,
    end: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verified: { paddingHorizontal: spacing.ml, paddingVertical: spacing.xxs, borderRadius: radii.pill, backgroundColor: colors.primaryLight },
  ratingCard: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.ml,
    paddingVertical: spacing.ml,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.input,
    backgroundColor: colors.primaryLight,
  },
  body: { padding: spacing.xl, gap: spacing.lg },
  stats: { flexDirection: 'row', gap: spacing.md },
  stat: { flex: 1, padding: spacing.ml, borderRadius: radii.input, backgroundColor: colors.surface },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  menu: { paddingVertical: spacing.xs },
  menuRow: { paddingVertical: spacing.lg },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: colors.dividerLight },
  logout: { borderRadius: radii.input, backgroundColor: colors.surface },
});
