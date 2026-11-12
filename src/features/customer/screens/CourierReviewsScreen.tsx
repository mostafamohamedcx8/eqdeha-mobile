import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CheckIcon } from '@/components/icons';
import { AppText, Avatar, BackButton, Card, Header, OptionButton, ScreenContainer, SectionTitle, StarRow } from '@/components/ui';
import { courierReviewsResponse, couriers } from '@/mocks/orders';
import { colors, fontSize, radii, spacing } from '@/theme';
import { ar, rating } from '@/utils/format';
import { goBack } from '@/utils/nav';

type Filter = 'all' | 'good' | 'bad';

/** 19-CourierReviews (`?courier=<id>`). */
export default function CourierReviewsScreen() {
  const params = useLocalSearchParams<{ courier?: string }>();
  const [filter, setFilter] = useState<Filter>('all');
  const c = Object.values(couriers).find((x) => String(x.id) === params.courier) ?? couriers.mahmoud;
  const r = courierReviewsResponse.data;
  const list = r.reviews.filter((x) => filter === 'all' || (filter === 'good' ? x.stars >= 4 : x.stars <= 3));

  return (
    <ScreenContainer
      statusBar="light"
      header={
        <Header paddingTop={50} paddingBottom={22} paddingHorizontal={spacing.xxl} radius={radii.header} gap={spacing.ml} center>
          <View style={styles.backRow}>
            <BackButton onPress={() => goBack('/tracking')} />
          </View>
          <Avatar initial={c.initial} bg={c.avatarBg} fg={c.avatarFg} size={84} fontSize={32} style={styles.avatar} />
          <View style={styles.center}>
            <AppText size={21} weight="extrabold" color={colors.textOnPrimary}>
              {c.name}
            </AppText>
            {c.verified ? (
              <View style={styles.verified}>
                <CheckIcon size={14} color={colors.success} strokeWidth={3} />
                <AppText size={fontSize.sm} weight="bold" color={colors.textOnPrimary}>
                  بياناته اتراجعت من الإدارة
                </AppText>
              </View>
            ) : null}
            <AppText size={fontSize.body2} color={colors.textOnPrimaryMuted}>
              {`${c.vehicle} · معانا من ${c.memberSince}`}
            </AppText>
          </View>
          <View style={styles.stats}>
            {[
              { v: rating(c.rating), l: 'التقييم' },
              { v: ar(c.trips), l: 'مشوار' },
              { v: `${ar(c.completionRate)}٪`, l: 'كمّل أوردراته' },
            ].map((s) => (
              <View key={s.l} style={styles.stat}>
                <AppText size={fontSize.h4} weight="extrabold" color={colors.textOnPrimary} center>
                  {s.v}
                </AppText>
                <AppText size={fontSize.xs} color={colors.textOnPrimaryMuted} center>
                  {s.l}
                </AppText>
              </View>
            ))}
          </View>
        </Header>
      }
      contentStyle={styles.body}>
      <Card padding={spacing.xl} style={styles.summary}>
        <View style={styles.bigRating}>
          <AppText size={38} weight="extrabold" lineHeight={1.1}>
            {rating(c.rating)}
          </AppText>
          <StarRow />
          <AppText size={fontSize.sm} color={colors.textMuted}>
            {`${ar(r.total)} تقييم`}
          </AppText>
        </View>
        <View style={styles.bars}>
          {r.distribution.map((d) => (
            <View key={d.stars} style={styles.barRow}>
              <AppText size={fontSize.sm} color={colors.textMuted} style={styles.barN}>
                {ar(d.stars)}
              </AppText>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${Math.round((d.count / r.total) * 100)}%` }]} />
              </View>
              <View style={styles.barCount}>
                <AppText size={fontSize.sm} color={colors.textMuted}>
                  {ar(d.count)}
                </AppText>
              </View>
            </View>
          ))}
        </View>
      </Card>

      <Card padding={spacing.xl} gap={spacing.ml}>
        <SectionTitle>الناس قالوا عنه</SectionTitle>
        <View style={styles.tags}>
          {r.tags.map((t) => (
            <View key={t.label} style={styles.tag}>
              <AppText size={fontSize.body2} weight="bold" color={colors.successText}>
                {`${t.label} · ${ar(t.count)}`}
              </AppText>
            </View>
          ))}
        </View>
      </Card>

      <View style={styles.filters}>
        {(
          [
            ['all', 'الكل'],
            ['good', 'الإيجابية'],
            ['bad', 'السلبية'],
          ] as const
        ).map(([v, l]) => (
          <OptionButton key={v} size="xs" label={l} selected={filter === v} onPress={() => setFilter(v)} />
        ))}
      </View>

      {list.map((rv) => (
        <Card key={rv.id} radius={radii.button} padding={spacing.lg} gap={spacing.sm} style={styles.review}>
          <View style={styles.reviewHead}>
            <Avatar initial={rv.initial} size={36} fontSize={14} bg={colors.neutralBg} fg={colors.textMuted} />
            <View style={styles.flex}>
              <AppText size={fontSize.body} weight="bold">
                {rv.name}
              </AppText>
              <AppText size={fontSize.xs} color={colors.placeholder}>
                {rv.date}
              </AppText>
            </View>
            <View style={[styles.badge, rv.stars >= 4 ? styles.badgeGood : styles.badgeBad]}>
              <AppText size={fontSize.sm} weight="extrabold" color={rv.stars >= 4 ? colors.warningText : colors.textMuted}>
                {`${ar(rv.stars)} ★`}
              </AppText>
            </View>
          </View>
          <AppText size={fontSize.body} lineHeight={1.6}>
            {rv.text}
          </AppText>
        </Card>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { alignItems: 'center', gap: spacing.xs },
  backRow: { alignSelf: 'stretch', flexDirection: 'row' },
  avatar: { marginTop: -20, borderWidth: 3, borderColor: colors.surface },
  verified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.ml,
    paddingVertical: spacing.xxs,
    borderRadius: radii.pill,
    backgroundColor: colors.primaryLight,
  },
  stats: { alignSelf: 'stretch', flexDirection: 'row', gap: spacing.md },
  stat: { flex: 1, padding: spacing.md, borderRadius: radii.md, backgroundColor: colors.primaryLight },
  body: { padding: spacing.xxl, gap: spacing.lg },
  summary: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxl },
  bigRating: { minWidth: 80, alignItems: 'center', gap: spacing.xxs },
  bars: { flex: 1, gap: spacing.xs },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  barN: { width: 10 },
  barTrack: { flex: 1, height: 8, borderRadius: 4, backgroundColor: colors.neutralBg, overflow: 'hidden', flexDirection: 'row' },
  barFill: { height: '100%', borderRadius: 4, backgroundColor: colors.accent },
  // text-align: left in the design = the end side in RTL
  barCount: { width: 26, alignItems: 'flex-end' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  tag: { paddingHorizontal: spacing.lg, paddingVertical: spacing.xs, borderRadius: radii.pill, backgroundColor: colors.successBg },
  filters: { flexDirection: 'row', gap: spacing.sm },
  review: { paddingHorizontal: spacing.xl },
  reviewHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.ml },
  badge: { paddingHorizontal: spacing.md, paddingVertical: spacing.xxs, borderRadius: 8 },
  badgeGood: { backgroundColor: colors.accentLight },
  badgeBad: { backgroundColor: colors.neutralBg },
});
