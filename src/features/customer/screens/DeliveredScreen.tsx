import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { CheckIcon, InfoIcon, StarFilledIcon } from '@/components/icons';
import { AppText, Avatar, Button, FilterChip, LinkText, ScreenContainer, StarRating, TextArea, useDesignInsets } from '@/components/ui';
import { RATING_TAGS, RATING_WORDS } from '@/mocks/orders';
import { useActiveOrder } from '@/store/activeOrder';
import { useOrderDraft } from '@/store/orderDraft';
import { usePoints } from '@/store/points';
import { colors, fontSize, radii, spacing } from '@/theme';
import { showInfo } from '@/utils/alert';
import { money, orderNo } from '@/utils/format';
import { resetTo } from '@/utils/nav';

import { useOrderTotals } from '../orderTotals';

const DELIVERED_POINTS = 10;
const RATING_POINTS = 2;

/** 16-Delivered: done + rate the courier (stars, tags, comment). */
export default function DeliveredScreen() {
  const inset = useDesignInsets();
  const { order, due } = useOrderTotals();
  const finalPayment = useActiveOrder((s) => s.finalPayment);
  const resetOrder = useActiveOrder((s) => s.reset);
  const resetDraft = useOrderDraft((s) => s.reset);
  const award = usePoints((s) => s.award);
  const [stars, setStars] = useState(5);
  const [tags, setTags] = useState<string[]>(['سريع']);
  const [comment, setComment] = useState('');
  const c = order.courier;

  // +10 points for a delivered order (once).
  useEffect(() => award(`delivered-${order.id}`, DELIVERED_POINTS), [award, order.id]);

  const finish = (rated: boolean) => {
    if (rated) award(`rated-${order.id}`, RATING_POINTS);
    resetOrder();
    resetDraft();
    resetTo('/home');
  };

  const toggle = (t: string) => setTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  return (
    <ScreenContainer
      paddingTop={60}
      contentStyle={styles.body}
      footer={
        <View style={[styles.footer, { paddingBottom: inset.bottom(28) }]}>
          <Button title="ابعت التقييم" weight="extrabold" onPress={() => finish(true)} />
          <Pressable onPress={() => finish(false)} accessibilityRole="button" style={styles.later}>
            <AppText size={fontSize.body} weight="bold" color={colors.textMuted}>
              بعدين
            </AppText>
          </Pressable>
        </View>
      }>
      <View style={styles.hero}>
        <View style={styles.ring}>
          <View style={styles.core}>
            <CheckIcon size={32} color={colors.surface} strokeWidth={3} />
          </View>
        </View>
        <AppText size={fontSize.h1} weight="extrabold" center>
          أوردرك وصل، بالهنا
        </AppText>
        <AppText size={fontSize.body} color={colors.textMuted} center>
          {`أوردر ${orderNo(order.id)} · دفعت ${money(due)} ${finalPayment === 'cash' ? 'كاش' : 'تحويل'}`}
        </AppText>
        <View style={styles.points}>
          <StarFilledIcon size={18} />
          <AppText size={fontSize.body} weight="extrabold" color={colors.warningText}>
            +١٠ نقاط اتضافوا لحسابك
          </AppText>
        </View>
        <LinkText weight="bold" size={fontSize.body} onPress={() => router.push('/final-invoice')}>
          شوف الفاتورة
        </LinkText>
      </View>

      <View style={styles.rateCard}>
        <Avatar initial={c.initial} bg={c.avatarBg} fg={c.avatarFg} size={60} fontSize={24} />
        <AppText size={fontSize.lg} weight="bold">
          {`إيه رأيك في ${c.firstName}؟`}
        </AppText>
        <StarRating value={stars} onChange={setStars} />
        <AppText size={fontSize.body2} weight="bold" color={colors.accentIcon}>
          {RATING_WORDS[stars]}
        </AppText>
        <View style={styles.tags}>
          {RATING_TAGS.map((t) => (
            <FilterChip key={t} variant="tag" label={t} selected={tags.includes(t)} onPress={() => toggle(t)} />
          ))}
        </View>
        <View style={styles.comment}>
          <TextArea value={comment} onChangeText={setComment} rows={2} placeholder="عايز تقول حاجة؟ (اختياري)" accessibilityLabel="تعليق" />
        </View>
      </View>

      <Pressable
        onPress={() => showInfo('في مشكلة في الأوردر؟', 'فريق الدعم هيتواصل معاك على رقمك في أقرب وقت.')}
        accessibilityRole="button"
        style={styles.problem}>
        <InfoIcon size={18} color={colors.dangerStrong} />
        <AppText size={fontSize.body} weight="bold" color={colors.dangerStrong}>
          في مشكلة في الأوردر؟
        </AppText>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: spacing.s20, paddingBottom: spacing.xxl, gap: spacing.xxl },
  hero: { alignItems: 'center', gap: spacing.ml },
  ring: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.successBg, alignItems: 'center', justifyContent: 'center' },
  core: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' },
  points: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.pill,
    backgroundColor: colors.accentLight,
  },
  rateCard: { backgroundColor: colors.surface, borderRadius: 20, padding: spacing.s18, alignItems: 'center', gap: spacing.lg },
  tags: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.md },
  comment: { alignSelf: 'stretch' },
  problem: { alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  footer: { paddingTop: spacing.lg, paddingHorizontal: spacing.xxl, gap: spacing.md },
  later: { height: 40, alignItems: 'center', justifyContent: 'center' },
});
