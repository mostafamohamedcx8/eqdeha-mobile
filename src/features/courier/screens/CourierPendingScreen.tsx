import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { PhoneCallIcon } from '@/components/icons';
import { AppText, Button, Card, LinkText, ScreenContainer, Segmented, Spacer } from '@/components/ui';
import { colors, fontSize, spacing } from '@/theme';
import { useSession } from '@/store/session';
import { resetTo } from '@/utils/nav';

type Status = 'wait' | 'fix' | 'ok';

const STATES: Record<Status, { title: string; body: string; glyph: string; ring: string; core: string; fg: string }> = {
  wait: {
    title: 'بياناتك عند الإدارة',
    body: 'هنراجعها ونكلّمك على رقمك خلال [المدة]. هيوصلك إشعار أول ما حسابك يتفعّل.',
    glyph: '…',
    ring: colors.accentLight,
    core: colors.accent,
    fg: colors.accentText,
  },
  fix: {
    title: 'محتاجين حاجة صغيرة',
    body: 'صورة ضهر البطاقة مش واضحة. صوّرها تاني في مكان فيه نور.',
    glyph: '!',
    ring: colors.dangerBg,
    core: colors.danger,
    fg: colors.surface,
  },
  ok: {
    title: 'حسابك اتفعّل، أهلاً بيك',
    body: 'تقدر تبدأ تستقبل أوردرات من دلوقتي.',
    glyph: '✓',
    ring: colors.successBg,
    core: colors.success,
    fg: colors.surface,
  },
};

const ITEMS = ['صورتك الشخصية', 'بياناتك والعنوان', 'البطاقة – الوش', 'البطاقة – الضهر', 'العربية ولونها وصورتها'];
const BAD_ITEM = 3;

const FIX_DEFAULT = 'الإدارة راجعت بياناتك ومحتاجة تعديل فيها.';

/**
 * 25-CPending.
 * Real states (from sign-up or login):
 * - `mode=wait` (or only `message`, right after sign-up): under review. No token.
 * - `mode=fix`: login of a needs_fix courier; `message` = the admin's note. Signed in with the limited token
 *   (the resubmit screen isn't built yet).
 * Opened with neither, the tabs on top preview its 3 states (design preview).
 */
export default function CourierPendingScreen() {
  const { message, mode } = useLocalSearchParams<{ message?: string; mode?: 'wait' | 'fix' }>();
  const real = !!mode || !!message;
  const [preview, setPreview] = useState<Status>('wait');
  const status: Status = real ? (mode === 'fix' ? 'fix' : 'wait') : preview;
  const s = real ? { ...STATES[status], body: message || (status === 'fix' ? FIX_DEFAULT : STATES.wait.body) } : STATES[status];
  const signOut = useSession((st) => st.signOut);

  const backToLogin = async () => {
    await signOut(); // the needs_fix token is dropped; nothing stored for "wait"
    resetTo({ pathname: '/login', params: { role: 'courier' } });
  };

  return (
    <ScreenContainer paddingTop={52} paddingBottom={28} contentStyle={styles.content}>
      {real ? null : (
        <Segmented
          tone="onLight"
          value={preview}
          onChange={setPreview}
          options={[
            { value: 'wait', label: 'قيد المراجعة' },
            { value: 'fix', label: 'محتاجين تعديل' },
            { value: 'ok', label: 'اتقبل' },
          ]}
        />
      )}

      <View style={styles.hero}>
        <View style={[styles.ring, { backgroundColor: s.ring }]}>
          <View style={[styles.core, { backgroundColor: s.core }]}>
            <AppText size={30} weight="extrabold" color={s.fg}>
              {s.glyph}
            </AppText>
          </View>
        </View>
        <AppText size={23} weight="extrabold" center>
          {s.title}
        </AppText>
        <AppText size={fontSize.md} lineHeight={1.7} color={colors.textMuted} center>
          {s.body}
        </AppText>
      </View>

      {/* real "needs a fix": which items are flagged isn't loaded yet, so the checklist is only shown in the preview */}
      {real && status === 'fix' ? null : (
      <Card>
        <AppText size={fontSize.body} weight="bold">
          اللي بعته
        </AppText>
        {ITEMS.map((label, i) => {
          const bad = status === 'fix' && i === BAD_ITEM;
          const done = status === 'ok';
          return (
            <View key={label} style={styles.item}>
              <View style={[styles.mark, bad ? styles.markBad : done ? styles.markDone : styles.markWait]}>
                <AppText size={fontSize.body2} weight="extrabold" color={bad ? colors.dangerText : done ? colors.surface : colors.primary}>
                  {bad ? '!' : '✓'}
                </AppText>
              </View>
              <AppText size={fontSize.body} style={styles.itemLabel}>
                {label}
              </AppText>
              {bad ? (
                <LinkText weight="bold" size={fontSize.body2} color={colors.dangerStrong} onPress={() => router.push('/courier-vehicle')}>
                  صوّرها تاني
                </LinkText>
              ) : null}
            </View>
          );
        })}
      </Card>
      )}

      <Spacer />

      {status === 'ok' ? (
        <Button title="يلا نبدأ الشغل" weight="extrabold" onPress={() => resetTo('/courier-home')} />
      ) : (
        <Button
          variant="secondary"
          title="كلّم الإدارة"
          icon={<PhoneCallIcon size={20} color={colors.primary} />}
          onPress={() => Alert.alert('كلّم الإدارة', 'رقم الإدارة هيتضاف لما نربط التطبيق بالسيرفر.')}
        />
      )}
      {real ? (
        <LinkText weight="bold" size={fontSize.body} style={styles.back} onPress={backToLogin}>
          رجوع لتسجيل الدخول
        </LinkText>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.s20, gap: spacing.xxl },
  back: { alignSelf: 'center' },
  hero: { alignItems: 'center', gap: spacing.ml, paddingTop: spacing.md },
  ring: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
  core: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  item: { flexDirection: 'row', alignItems: 'center', gap: spacing.ml },
  itemLabel: { flex: 1 },
  mark: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  markWait: { backgroundColor: colors.primaryTint },
  markDone: { backgroundColor: colors.success },
  markBad: { backgroundColor: colors.dangerBg },
});
