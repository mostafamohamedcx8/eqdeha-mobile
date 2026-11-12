import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ReceiptIcon } from '@/components/icons';
import { AppText, Button, Card, FieldError, FooterBar, PhotoPlaceholder, ScreenContainer, SectionTitle, TopBar } from '@/components/ui';
import { courierOrderResponse } from '@/mocks/courier';
import { useCourier } from '@/store/courier';
import { colors, fonts, fontSize, radii, spacing } from '@/theme';
import { ar, money, orderNo } from '@/utils/format';
import { goBack } from '@/utils/nav';
import { pickImage } from '@/utils/pickImage';
import { onlyDigits } from '@/utils/validation';

type Row = { name: string; price: string };

function nowTime() {
  const d = new Date();
  const h = d.getHours() % 12 || 12;
  return `${ar(h)}:${ar(String(d.getMinutes()).padStart(2, '0'))} ${d.getHours() < 12 ? 'ص' : 'م'}`;
}

/** 28-CInvoice (`?shop=<index>`): photo from the camera + items and prices, sent to the customer. */
export default function CourierInvoiceScreen() {
  const { shop } = useLocalSearchParams<{ shop?: string }>();
  const order = courierOrderResponse.data;
  const idx = Math.min(Number(shop ?? 0) || 0, order.shops.length - 1);
  const req = order.shops[idx];
  const sendInvoice = useCourier((s) => s.sendInvoice);

  const [photo, setPhoto] = useState<{ uri: string; time: string } | null>(null);
  const [paper, setPaper] = useState<string | null>(null);
  const [rows, setRows] = useState<Row[]>(req.invoiceItems.map((i) => ({ name: i.name, price: String(i.price) })));
  const [submitted, setSubmitted] = useState(false);

  const filled = rows.filter((r) => r.name.trim() && Number(r.price) > 0);
  const total = filled.reduce((s, r) => s + Number(r.price), 0);
  const photoError = submitted && !photo ? 'لازم تصوّر الحاجة قدام المحل' : null;
  const itemsError = submitted && filled.length === 0 ? 'ضيف صنف واحد على الأقل بسعره' : null;

  const shoot = async () => {
    const uri = await pickImage({ source: 'camera' });
    if (uri) setPhoto({ uri, time: nowTime() });
  };

  const setRow = (i: number, patch: Partial<Row>) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  const send = () => {
    setSubmitted(true);
    if (!photo || filled.length === 0) return;
    sendInvoice(idx, { total, count: filled.length });
    router.back();
  };

  return (
    <ScreenContainer
      statusBar="light"
      header={
        <TopBar
          title={`فاتورة ${req.shopName}`}
          titleSize={fontSize.h4}
          subtitle={`محل ${ar(idx + 1)} من ${ar(order.shops.length)} · أوردر ${orderNo(order.id)}`}
          onBack={() => goBack('/courier-chat')}
          paddingTop={48}
          paddingBottom={14}
        />
      }
      footer={
        <FooterBar paddingTop={12} paddingBottom={26}>
          <View style={styles.footer}>
            <Button title={`ابعت الفاتورة للعميل · ${money(total)}`} weight="extrabold" textSize={16} onPress={send} style={styles.sendBtn} />
            <AppText size={fontSize.xs} color={colors.textMuted} center>
              بعد أول فاتورة العميل مايقدرش يلغي الأوردر
            </AppText>
          </View>
        </FooterBar>
      }
      contentStyle={styles.body}>
      <Card padding={spacing.ml} gap={spacing.md}>
        {photo ? (
          <PhotoPlaceholder uri={photo.uri} height={150}>
            <View style={styles.stamp}>
              <AppText size={11} color={colors.surface}>
                {`✓ اتصورت · ${photo.time} · GPS`}
              </AppText>
            </View>
            <Pressable onPress={shoot} accessibilityRole="button" style={styles.reshoot}>
              <AppText size={fontSize.sm} weight="bold" color={colors.primary}>
                صوّر تاني
              </AppText>
            </Pressable>
          </PhotoPlaceholder>
        ) : (
          <>
            <View style={[styles.viewfinder, photoError && styles.viewfinderError]}>
              <View style={styles.gps}>
                <View style={styles.gpsDot} />
                <AppText size={11} color={colors.surface}>
                  GPS شغال · جوه المحل
                </AppText>
              </View>
              <View style={styles.frame}>
                <AppText size={fontSize.sm} color={colors.surface} center>
                  خلّي الحاجة واسم المحل باينين
                </AppText>
              </View>
              <Pressable onPress={shoot} accessibilityRole="button" accessibilityLabel="صوّر" style={styles.shutter} />
            </View>
            <AppText size={fontSize.sm} color={colors.textMuted} center>
              الصورة بتتاخد من الكاميرا دلوقتي بس، مينفعش من المعرض
            </AppText>
          </>
        )}
        {photoError ? <FieldError message={photoError} center /> : null}
      </Card>

      <Card padding={spacing.xl} gap={spacing.ml}>
        <SectionTitle>اللي اشتريته وسعره</SectionTitle>
        <View style={styles.requested}>
          <AppText size={fontSize.sm} color={colors.textMuted}>
            {`العميل طالب: ${req.request}`}
          </AppText>
        </View>
        {rows.map((r, i) => (
          <View key={i} style={styles.itemRow}>
            <TextInput
              value={r.name}
              onChangeText={(t) => setRow(i, { name: t.slice(0, 80) })}
              placeholder="الصنف"
              accessibilityLabel="الصنف"
              placeholderTextColor={colors.placeholder}
              style={[styles.input, styles.flex]}
            />
            <TextInput
              value={r.price ? ar(r.price) : ''}
              onChangeText={(t) => setRow(i, { price: onlyDigits(t).slice(0, 5) })}
              placeholder="السعر"
              accessibilityLabel="السعر"
              keyboardType="number-pad"
              placeholderTextColor={colors.placeholder}
              style={[styles.input, styles.price]}
            />
          </View>
        ))}
        {itemsError ? <FieldError message={itemsError} /> : null}
        <Pressable onPress={() => setRows((rs) => [...rs, { name: '', price: '' }])} accessibilityRole="button" style={styles.addItem}>
          <AppText size={fontSize.body} weight="bold" color={colors.primary}>
            + ضيف صنف
          </AppText>
        </Pressable>
        <View style={styles.total}>
          <AppText size={fontSize.xl} weight="extrabold">
            إجمالي المحل
          </AppText>
          <AppText size={fontSize.xl} weight="extrabold">
            {money(total)}
          </AppText>
        </View>
      </Card>

      <Pressable
        onPress={async () => {
          const uri = await pickImage({ source: 'camera' });
          if (uri) setPaper(uri);
        }}
        accessibilityRole="button"
        style={styles.paper}>
        {paper ? <Image source={{ uri: paper }} style={styles.paperThumb} contentFit="cover" /> : <ReceiptIcon color={colors.textMuted} strokeWidth={1.8} />}
        <View style={styles.flex}>
          <AppText size={fontSize.body} weight="bold">
            {paper ? 'اتصورت الفاتورة الورقية' : 'صوّر الفاتورة الورقية'}
          </AppText>
          <AppText size={fontSize.sm} color={colors.textMuted}>
            {paper ? 'دوس عشان تصوّرها تاني' : 'اختياري، لو المحل اداك فاتورة'}
          </AppText>
        </View>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  body: { padding: spacing.lg, gap: spacing.lg },
  viewfinder: { height: 190, borderRadius: radii.input, backgroundColor: colors.text, alignItems: 'center', justifyContent: 'center' },
  viewfinderError: { borderWidth: 2, borderColor: colors.danger },
  // top-right (= start side in RTL)
  gps: {
    position: 'absolute',
    top: 10,
    start: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: colors.gpsBadge,
  },
  gpsDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  frame: { width: 150, height: 110, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.surface, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center', padding: spacing.sm },
  shutter: { position: 'absolute', bottom: 10, alignSelf: 'center', width: 60, height: 60, borderRadius: 30, backgroundColor: colors.surface, borderWidth: 5, borderColor: colors.accent },
  stamp: { position: 'absolute', bottom: 8, start: 8, paddingHorizontal: spacing.md, paddingVertical: 3, borderRadius: 8, backgroundColor: colors.text },
  // top-left (= end side in RTL)
  reshoot: { position: 'absolute', top: 8, end: 8, height: 30, paddingHorizontal: spacing.ml, borderRadius: 8, backgroundColor: colors.surface, justifyContent: 'center' },
  requested: { paddingVertical: spacing.md, paddingHorizontal: spacing.ml, borderRadius: 10, backgroundColor: colors.background },
  itemRow: { flexDirection: 'row', gap: spacing.md },
  input: {
    height: 44,
    paddingHorizontal: spacing.lg,
    paddingVertical: 0,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
  },
  price: { width: 76, textAlign: 'center', fontFamily: fonts.bold },
  addItem: { height: 42, borderRadius: 10, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  total: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.dividerLight },
  paper: { flexDirection: 'row', alignItems: 'center', gap: spacing.ml, padding: spacing.lg, borderRadius: radii.input, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  paperThumb: { width: 22, height: 22, borderRadius: 4 },
  footer: { gap: spacing.sm },
  sendBtn: { height: 54 },
});
