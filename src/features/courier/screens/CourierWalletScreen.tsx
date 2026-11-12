import { router } from 'expo-router';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import {
  AppText,
  BackButton,
  Button,
  Card,
  FieldError,
  Header,
  ScreenContainer,
  Segmented,
} from '@/components/ui';
import { courierMeResponse, courierWalletResponse } from '@/mocks/courier';
import { type WalletView, useCourier, walletView } from '@/store/courier';
import { colors, fonts, fontSize, radii, spacing } from '@/theme';
import { ar, money } from '@/utils/format';
import { copyText } from '@/utils/phone';
import { pickImage } from '@/utils/pickImage';
import { onlyDigits } from '@/utils/validation';

/** 30-CWallet (tab: المحفظة). Dev tabs in the header preview normal / suspended / payment sent. */
export default function CourierWalletScreen() {
  const me = courierMeResponse.data;
  const w = courierWalletResponse.data;
  const c = useCourier();
  const view = walletView(c);
  const debt = view === 'ok' ? c.debt : Math.max(c.debt, w.stopAt);
  const pct = Math.min(100, (debt / w.stopAt) * 100);
  const [amount, setAmount] = useState(String(debt));
  const [proof, setProof] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const amountError = submitted && !(Number(amount) > 0) ? 'اكتب المبلغ اللي حوّلته' : null;
  const proofError = submitted && !proof ? 'ارفع صورة التحويل' : null;

  const submit = () => {
    setSubmitted(true);
    if (!(Number(amount) > 0) || !proof) return;
    c.submitPayment();
  };

  return (
    <ScreenContainer
      statusBar="light"
      header={
        <Header paddingTop={48} paddingBottom={18} paddingHorizontal={spacing.xxl} radius={26} gap={spacing.lg}>
          <View style={styles.topRow}>
            <BackButton onPress={() => router.navigate('/courier-home')} />
            <AppText size={fontSize.h3} weight="bold" color={colors.textOnPrimary} style={styles.flex}>
              محفظتي
            </AppText>
          </View>
          {__DEV__ ? (
            <Segmented<WalletView>
              tone="onPrimarySm"
              value={view}
              onChange={c.setWalletPreview}
              options={[
                { value: 'ok', label: 'عادي' },
                { value: 'stop', label: 'موقوف' },
                { value: 'pend', label: 'بعت السداد' },
              ]}
            />
          ) : null}
          <View style={styles.debtBlock}>
            <AppText size={fontSize.body2} color={colors.textOnPrimaryMuted}>
              عليك للتطبيق (عمولة)
            </AppText>
            <AppText size={38} weight="extrabold" lineHeight={1.2} color={debt >= w.stopAt ? colors.dangerSoft : colors.textOnPrimary}>
              {`−${money(debt)}`}
            </AppText>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${pct}%`, backgroundColor: pct >= 80 ? colors.danger : colors.accent }]} />
            </View>
            <View style={styles.trackLabels}>
              <AppText size={fontSize.xs} color={colors.textOnPrimaryMuted}>
                ٠
              </AppText>
              <AppText size={fontSize.xs} color={colors.textOnPrimaryMuted}>
                {`الحساب بيقف عند −${ar(w.stopAt)}`}
              </AppText>
            </View>
          </View>
        </Header>
      }
      contentStyle={styles.body}>
      {view === 'stop' ? (
        <View style={styles.stopped}>
          <AppText size={fontSize.body2} lineHeight={1.6} color={colors.dangerDeep}>
            <AppText size={fontSize.body2} weight="bold" color={colors.dangerDeep}>
              حسابك واقف.
            </AppText>{' '}
            كمّل الأوردرات اللي معاك، وبعدها مش هتشوف أوردرات جديدة لحد ما تسدد وتتأكد.
          </AppText>
        </View>
      ) : null}
      {view === 'pend' ? (
        <View style={styles.pending}>
          <View style={styles.pendingDot} />
          <AppText size={fontSize.body2} lineHeight={1.6} color={colors.warningText} style={styles.flex}>
            {`بعت إثبات سداد ${money(Number(amount) || w.stopAt)}. اتفتحلك سلفة ${ar(w.advance)} ج وحسابك رجع يشتغل لحد ما الإدارة تأكد وتصفّي حسابك.`}
          </AppText>
        </View>
      ) : null}

      <View style={styles.stats}>
        {[
          { l: 'النهارده', v: money(me.earnings.today) },
          { l: 'الأسبوع', v: money(me.earnings.week) },
          { l: 'عمولة الشهر', v: money(me.monthCommission), danger: true },
        ].map((s) => (
          <View key={s.l} style={styles.stat}>
            <AppText size={fontSize.xs} color={colors.textMuted} center>
              {s.l}
            </AppText>
            <AppText size={fontSize.xl} weight="extrabold" color={s.danger ? colors.dangerText : colors.text} center>
              {s.v}
            </AppText>
          </View>
        ))}
      </View>

      <Card padding={spacing.xl} gap={spacing.ml}>
        <AppText size={fontSize.lg} weight="extrabold">
          سدّد العمولة
        </AppText>
        {w.payTo.map((p) => (
          <View key={p.code} style={styles.account}>
            <View style={[styles.badge, p.code === 'IP' ? styles.badgeIp : styles.badgeVc]}>
              <AppText size={fontSize.body2} weight="extrabold" color={p.code === 'IP' ? colors.ipText : colors.dangerText}>
                {p.code}
              </AppText>
            </View>
            <View style={styles.flex}>
              <AppText size={fontSize.sm} color={colors.textMuted}>
                {p.label}
              </AppText>
              <AppText size={fontSize.md} weight="bold" style={styles.ltr}>
                {p.value}
              </AppText>
            </View>
            <Button variant="secondary" title="نسخ" textSize={12} textColor={colors.primary} onPress={() => copyText(p.value, p.code === 'IP' ? 'العنوان' : 'الرقم')} style={styles.copy} />
          </View>
        ))}
        <View style={styles.payRow}>
          <TextInput
            value={amount ? `${ar(amount)} ج` : ''}
            onChangeText={(t) => setAmount(onlyDigits(t).slice(0, 5))}
            keyboardType="number-pad"
            accessibilityLabel="المبلغ اللي حوّلته"
            placeholder="المبلغ"
            placeholderTextColor={colors.placeholder}
            style={[styles.amount, amountError && styles.inputError]}
          />
          <Pressable
            onPress={async () => {
              const uri = await pickImage({ source: 'both' });
              if (uri) setProof(uri);
            }}
            accessibilityRole="button"
            style={[styles.proof, proofError && styles.inputError]}>
            {proof ? <Image source={{ uri: proof }} style={StyleSheet.absoluteFill} contentFit="cover" /> : null}
            <AppText size={fontSize.body2} weight="bold" color={proof ? colors.surface : colors.primary} style={proof ? styles.proofDone : undefined}>
              {proof ? 'غيّر الصورة' : 'صورة التحويل'}
            </AppText>
          </Pressable>
        </View>
        {amountError || proofError ? <FieldError message={(amountError ?? proofError)!} /> : null}
        <Button title="ابعت إثبات السداد" weight="extrabold" textSize={16} onPress={submit} style={styles.submit} />
        <AppText size={fontSize.sm} lineHeight={1.6} color={colors.textMuted}>
          {`أول ما ترفع صورة التحويل بيتفتحلك سلفة ${ar(w.advance)} ج تكمّل بيها شغل علطول، لحد ما الإدارة تأكد.`}
        </AppText>
      </Card>

      <Card padding={spacing.xl} gap={0} style={styles.txCard}>
        <AppText size={fontSize.lg} weight="extrabold" style={styles.txTitle}>
          الحركات
        </AppText>
        {c.transactions.map((t, i) => (
          <View key={t.id} style={[styles.tx, i < c.transactions.length - 1 && styles.txBorder]}>
            <View style={styles.flex}>
              <AppText size={fontSize.body} weight="bold">
                {t.title}
              </AppText>
              <AppText size={fontSize.sm} color={t.confirmed ? colors.successText : colors.textMuted}>
                {t.sub}
              </AppText>
            </View>
            <AppText size={fontSize.md} weight="extrabold" color={t.amount > 0 ? colors.successText : colors.dangerText}>
              {`${t.amount > 0 ? '+' : '−'}${ar(String(Math.abs(t.amount)).replace('.', '٫'))} ج`}
            </AppText>
          </View>
        ))}
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  ltr: { writingDirection: 'ltr' },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.ml },
  debtBlock: { alignItems: 'center', gap: spacing.xs },
  track: { alignSelf: 'stretch', height: 8, borderRadius: 4, backgroundColor: colors.primaryLight, overflow: 'hidden', flexDirection: 'row' },
  fill: { height: '100%' },
  trackLabels: { alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'space-between' },
  body: { padding: spacing.xl, gap: spacing.lg },
  stopped: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl, borderRadius: radii.input, backgroundColor: colors.dangerBg, borderWidth: 1, borderColor: colors.danger },
  pending: { flexDirection: 'row', alignItems: 'center', gap: spacing.ml, paddingVertical: spacing.lg, paddingHorizontal: spacing.xl, borderRadius: radii.input, backgroundColor: colors.accentLight },
  pendingDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accent },
  stats: { flexDirection: 'row', gap: spacing.md },
  stat: { flex: 1, padding: spacing.ml, borderRadius: radii.input, backgroundColor: colors.surface },
  account: { flexDirection: 'row', alignItems: 'center', gap: spacing.ml, paddingVertical: spacing.ml, paddingHorizontal: spacing.lg, borderRadius: radii.md, backgroundColor: colors.background },
  badge: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  badgeVc: { backgroundColor: colors.dangerBg },
  badgeIp: { backgroundColor: colors.ipBg },
  copy: { height: 34, borderRadius: 10, paddingHorizontal: spacing.lg },
  payRow: { flexDirection: 'row', gap: spacing.md },
  amount: {
    flex: 1,
    minWidth: 0,
    height: 48,
    paddingHorizontal: spacing.xl,
    paddingVertical: 0,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.text,
  },
  proof: { width: 130, height: 48, borderRadius: radii.md, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.primary, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: colors.surface },
  proofDone: { backgroundColor: colors.backdrop, paddingHorizontal: spacing.sm, borderRadius: 6 },
  inputError: { borderColor: colors.danger },
  submit: { height: 52, borderRadius: radii.input },
  txCard: { paddingVertical: spacing.sm },
  txTitle: { marginTop: spacing.md, marginBottom: spacing.xxs },
  tx: { flexDirection: 'row', alignItems: 'center', gap: spacing.ml, paddingVertical: spacing.ml },
  txBorder: { borderBottomWidth: 1, borderBottomColor: colors.dividerLight },
});
