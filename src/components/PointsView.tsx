import type { Href } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { StarFilledIcon } from '@/components/icons';
import { AppText, Button, Card, KeyValueRow, ScreenContainer, Segmented, TopBar } from '@/components/ui';
import type { PointsSummary } from '@/mocks/types';
import { colors, fontSize, radii, spacing } from '@/theme';
import { ar } from '@/utils/format';
import { goBack } from '@/utils/nav';

type Props = {
  summary: PointsSummary;
  balance: number;
  redeemed: boolean;
  onRedeem: () => void;
  /** Dev-only header toggle values (design preview). */
  previewValues: readonly number[];
  onPreview: (p: number) => void;
  rewardSubtitle: string;
  doneText: string;
  backTo: Href;
};

/** Points screen shared by the customer (10-Points) and the courier (32-CPoints). */
export function PointsView({ summary, balance, redeemed, onRedeem, previewValues, onPreview, rewardSubtitle, doneText, backTo }: Props) {
  const { goal, rewardEgp, rules, history } = summary;
  const ready = balance >= goal && !redeemed;
  const remaining = Math.max(0, goal - balance);

  return (
    <ScreenContainer
      statusBar="light"
      header={
        <TopBar
          title="نقاطي"
          onBack={() => goBack(backTo)}
          radius={radii.header}
          paddingBottom={22}
          end={
            __DEV__ ? (
              <Segmented
                tone="compact"
                value={String(redeemed ? -1 : balance)}
                onChange={(v) => onPreview(Number(v))}
                options={previewValues.map((p) => ({ value: String(p), label: ar(p) }))}
              />
            ) : undefined
          }>
          <View style={styles.big}>
            <StarFilledIcon size={44} />
            <AppText size={42} weight="extrabold" color={colors.textOnPrimary} lineHeight={1.1}>
              {ar(balance)}
            </AppText>
            <AppText size={fontSize.body} color={colors.textOnPrimaryMuted}>
              نقطة
            </AppText>
          </View>
          <View style={styles.progress}>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${Math.min(100, (balance / goal) * 100)}%` }]} />
            </View>
            <View style={styles.progressText}>
              <AppText size={fontSize.sm} color={colors.textOnPrimaryMuted}>
                {balance >= goal ? 'وصلت للهدف' : `فاضلك ${ar(remaining)} نقطة`}
              </AppText>
              <AppText size={fontSize.sm} color={colors.textOnPrimaryMuted}>
                {`${ar(goal)} نقطة = ${ar(rewardEgp)} ج`}
              </AppText>
            </View>
          </View>
        </TopBar>
      }
      contentStyle={styles.body}>
      <View style={[styles.reward, ready ? styles.rewardReady : styles.rewardIdle]}>
        <View style={styles.rewardBadge}>
          <AppText size={fontSize.h3} weight="extrabold" color={colors.accentText} lineHeight={1.1}>
            {ar(rewardEgp)}
          </AppText>
          <AppText size={fontSize.xs} weight="bold" color={colors.accentText} lineHeight={1.1}>
            جنيه
          </AppText>
        </View>
        <View style={styles.flex}>
          <AppText size={fontSize.lg} weight="extrabold">
            {`جمّع ${ar(goal)} نقطة وليك ${ar(rewardEgp)} ج`}
          </AppText>
          <AppText size={fontSize.body2} lineHeight={1.6} color={colors.textMuted}>
            {rewardSubtitle}
          </AppText>
        </View>
      </View>

      {ready ? <Button title={`استبدل ${ar(goal)} نقطة بـ ${ar(rewardEgp)} ج`} weight="extrabold" onPress={onRedeem} style={styles.redeem} /> : null}
      {redeemed ? (
        <View style={styles.done}>
          <AppText size={fontSize.body} weight="bold" lineHeight={1.6} color={colors.successText} center>
            {doneText}
          </AppText>
        </View>
      ) : null}
      {!ready && !redeemed ? (
        <View style={styles.notYet}>
          <AppText size={fontSize.md} weight="bold" color={colors.disabledText}>
            {`فاضلك ${ar(remaining)} نقطة وتاخد الـ ${ar(rewardEgp)} ج`}
          </AppText>
        </View>
      ) : null}

      <Card padding={spacing.xl} gap={spacing.ml}>
        <AppText size={fontSize.md} weight="extrabold">
          إزاي تجمع نقاط؟
        </AppText>
        {rules.map((r) => (
          <KeyValueRow key={r.label} label={r.label} value={r.value} valueWeight="extrabold" valueColor={colors.accentIcon} />
        ))}
      </Card>

      <Card padding={spacing.xl} gap={0} style={styles.historyCard}>
        <AppText size={fontSize.md} weight="extrabold" style={styles.historyTitle}>
          آخر النقاط
        </AppText>
        {history.map((h, i) => (
          <View key={h.id} style={[styles.historyRow, i < history.length - 1 && styles.historyBorder]}>
            <View>
              <AppText size={fontSize.body} weight="bold">
                {h.title}
              </AppText>
              <AppText size={fontSize.sm} color={colors.textMuted}>
                {h.when}
              </AppText>
            </View>
            <AppText size={fontSize.body} weight="extrabold" color={colors.accentIcon}>
              {`+${ar(h.points)}`}
            </AppText>
          </View>
        ))}
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  big: { alignItems: 'center', gap: spacing.xs },
  progress: { gap: spacing.sm },
  track: { height: 10, borderRadius: 5, backgroundColor: colors.primaryLight, overflow: 'hidden', flexDirection: 'row' },
  fill: { height: '100%', backgroundColor: colors.accent },
  progressText: { flexDirection: 'row', justifyContent: 'space-between' },
  body: { padding: spacing.xxl, gap: spacing.lg },
  reward: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, padding: spacing.xl, backgroundColor: colors.surface, borderRadius: radii.card },
  rewardReady: { borderWidth: 2, borderColor: colors.accent },
  rewardIdle: { borderWidth: 1, borderColor: colors.divider },
  rewardBadge: { width: 56, height: 56, borderRadius: radii.button, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  redeem: { height: 54 },
  done: { padding: spacing.xl, borderRadius: radii.input, backgroundColor: colors.successBg },
  notYet: { height: 54, borderRadius: radii.button, backgroundColor: colors.disabledBg, alignItems: 'center', justifyContent: 'center' },
  historyCard: { paddingVertical: spacing.sm },
  historyTitle: { marginTop: spacing.md, marginBottom: spacing.xxs },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.ml },
  historyBorder: { borderBottomWidth: 1, borderBottomColor: colors.dividerLight },
});
