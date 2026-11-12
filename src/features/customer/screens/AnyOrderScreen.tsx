import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { MapPinSolid, PinIcon } from '@/components/icons';
import { AppText, Button, Card, FeeStepper, FooterBar, ScreenContainer, SectionTitle, TextArea, TopBar } from '@/components/ui';
import { DELIVERY } from '@/mocks/shops';
import { useOrderDraft } from '@/store/orderDraft';
import { colors, fontSize, radii, spacing } from '@/theme';
import { money } from '@/utils/format';
import { goBack } from '@/utils/nav';

import { ChoicePair, DeliveryAddressRow, PaymentChoice } from '../components/OrderFormParts';

/** Dashed vertical line between the two route points. */
function DashedLine() {
  return (
    <View style={styles.dashes}>
      {Array.from({ length: 20 }, (_, i) => (
        <View key={i} style={styles.dash} />
      ))}
    </View>
  );
}

/** 08-AnyOrder: free-text order, optional pickup point, delivery point, offered fee (min 10). */
export default function AnyOrderScreen() {
  const d = useOrderDraft();
  const [submitted, setSubmitted] = useState(false);
  const wishError = submitted && !d.wish.trim() ? 'اكتب عايز إيه الأول' : null;

  const send = () => {
    setSubmitted(true);
    if (!d.wish.trim()) return;
    router.push('/offers');
  };

  return (
    <ScreenContainer
      statusBar="light"
      header={<TopBar title="اطلب أي حاجة" subtitle="اكتب، حدد المكان، واعرض سعرك" onBack={() => goBack('/home')} />}
      footer={
        <FooterBar paddingTop={12} paddingBottom={28}>
          <Button title="ابعت الطلب" weight="extrabold" endText={`${money(d.offer)} توصيل`} onPress={send} />
        </FooterBar>
      }
      contentStyle={styles.body}>
      <Card padding={spacing.xl} gap={spacing.md}>
        <SectionTitle>عايز إيه؟</SectionTitle>
        <TextArea
          rows={4}
          value={d.wish}
          onChangeText={d.setWish}
          accessibilityLabel="عايز إيه؟"
          placeholder="اكتب كل اللي محتاجه بالتفصيل، مثلاً: علبة سجاير وكيس شيبسي وزجاجة مية كبيرة، أو هات الشنطة من عند البواب"
          error={wishError}
        />
      </Card>

      <Card padding={spacing.xl} gap={spacing.xs}>
        <View style={styles.leg}>
          <View style={styles.rail}>
            <View style={styles.ring} />
            <DashedLine />
          </View>
          <View style={[styles.flex, styles.legBody, styles.legPad]}>
            <AppText size={fontSize.body} weight="bold">
              هيجيبها منين؟{' '}
              <AppText size={fontSize.sm} weight="semibold" color={colors.textMuted}>
                (اختياري)
              </AppText>
            </AppText>
            <ChoicePair
              value={d.pickupFrom}
              onChange={d.setPickupFrom}
              options={[
                { value: 'any', label: 'سيبها للمندوب' },
                { value: 'map', label: 'أحدد من الخريطة' },
              ]}
            />
            {d.pickupFrom === 'map' ? (
              <Pressable
                onPress={() => router.push({ pathname: '/map-pick', params: { mode: 'start' } })}
                accessibilityRole="button"
                style={styles.place}>
                <PinIcon size={18} color={colors.primary} />
                <AppText size={fontSize.body2} style={styles.flex} numberOfLines={1}>
                  {d.pickupPlace}
                </AppText>
                <AppText size={fontSize.sm} weight="bold" color={colors.primary}>
                  غيّر
                </AppText>
              </Pressable>
            ) : (
              <AppText size={fontSize.sm} color={colors.textMuted}>
                المندوب هيجيبها من أقرب مكان فيه الحاجة
              </AppText>
            )}
          </View>
        </View>
        <View style={styles.leg}>
          <View style={styles.pinRail}>
            <MapPinSolid />
          </View>
          <View style={[styles.flex, styles.legBody]}>
            <SectionTitle>توصل فين؟</SectionTitle>
            <DeliveryAddressRow address={d.delivery} compact />
          </View>
        </View>
      </Card>

      <Card padding={spacing.xl} gap={spacing.ml}>
        <View>
          <SectionTitle>سعر التوصيل اللي تعرضه</SectionTitle>
          <AppText size={fontSize.sm} lineHeight={1.6} color={colors.textMuted}>
            المعتاد ١٥ ج لمكان واحد، وكل مكان زيادة +٥ ج. المندوب يقدر يوافق أو يرد عليك بسعر تاني.
          </AppText>
        </View>
        <FeeStepper value={d.offer} onChange={d.changeOffer} min={DELIVERY.minOffer} max={DELIVERY.maxOffer} step={DELIVERY.offerStep} />
      </Card>

      <Card padding={spacing.xl} gap={spacing.md}>
        <SectionTitle>هتدفع إزاي؟</SectionTitle>
        <PaymentChoice value={d.payment} onChange={d.setPayment} />
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  body: { padding: spacing.xxl, gap: spacing.lg },
  leg: { flexDirection: 'row', gap: spacing.lg },
  legBody: { gap: spacing.md },
  legPad: { paddingBottom: spacing.lg },
  rail: { alignItems: 'center', paddingTop: spacing.xl, width: 16 },
  ring: { width: 14, height: 14, borderRadius: 7, borderWidth: 3, borderColor: colors.primary, backgroundColor: colors.surface },
  dashes: { flex: 1, width: 2, marginVertical: spacing.xs, overflow: 'hidden', gap: 4 },
  dash: { width: 2, height: 4, backgroundColor: colors.border },
  pinRail: { paddingTop: spacing.ml, width: 16, alignItems: 'center' },
  place: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.ml,
    paddingVertical: spacing.ml,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: radii.md,
  },
});
