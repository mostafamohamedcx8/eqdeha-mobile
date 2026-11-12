import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { CheckIcon, InfoIcon, ReceiptIcon } from '@/components/icons';
import {
  AppText,
  Button,
  Card,
  Divider,
  FooterBar,
  InvoiceItemRow,
  KeyValueRow,
  LinkText,
  Notice,
  PhotoPlaceholder,
  ScreenContainer,
  SectionTitle,
  TopBar,
} from '@/components/ui';
import { invoicesResponse } from '@/mocks/orders';
import { useActiveOrder } from '@/store/activeOrder';
import { colors, fontSize, radii, spacing } from '@/theme';
import { ar, money, orderNo } from '@/utils/format';
import { goBack } from '@/utils/nav';

/** 14-Invoice: one shop's invoice (`?shop=<shopId>`), for information only. */
export default function InvoiceScreen() {
  const { shop } = useLocalSearchParams<{ shop?: string }>();
  const order = useActiveOrder((s) => s.order);
  const [paperOpen, setPaperOpen] = useState(false);
  const inv = invoicesResponse.data.find((i) => String(i.shopId) === shop) ?? invoicesResponse.data[0];
  const total = inv.items.reduce((s, i) => s + i.price, 0);

  return (
    <ScreenContainer
      statusBar="light"
      header={
        <TopBar
          title={`فاتورة ${inv.shopName}`}
          titleSize={19}
          subtitle={`فاتورة ${ar(inv.index)} من ${ar(inv.of)} · أوردر ${orderNo(order.id)}`}
          onBack={() => goBack('/tracking')}
        />
      }
      footer={
        <FooterBar paddingTop={12} paddingBottom={28}>
          <View style={styles.actions}>
            <Button title="تمام، رجوع للمتابعة" weight="extrabold" textSize={16} onPress={() => goBack('/tracking')} style={[styles.btn, styles.main]} />
            <Button variant="secondary" title="كلّم المندوب" textSize={14} onPress={() => router.push('/chat')} style={[styles.btn, styles.side]} />
          </View>
        </FooterBar>
      }
      contentStyle={styles.body}>
      <Card padding={spacing.ml} gap={spacing.md}>
        <PhotoPlaceholder height={170} caption="صورة الحاجة قدام المحل">
          <View style={styles.stamp}>
            <CheckIcon size={12} color={colors.success} strokeWidth={3} />
            <AppText size={11} color={colors.surface}>
              {`اتصورت في المحل · ${inv.photoTime}`}
            </AppText>
          </View>
        </PhotoPlaceholder>
        {inv.hasPaperPhoto ? (
          <View style={styles.paper}>
            <View style={styles.paperIcon}>
              <ReceiptIcon color={colors.textMuted} strokeWidth={1.8} />
            </View>
            <AppText size={fontSize.body2} color={colors.textMuted} style={styles.flex}>
              المندوب رفع صورة الفاتورة الورقية
            </AppText>
            <LinkText weight="bold" size={fontSize.body2} onPress={() => setPaperOpen(true)}>
              افتحها
            </LinkText>
          </View>
        ) : null}
      </Card>

      <Card padding={spacing.xl} gap={spacing.ml}>
        <SectionTitle>اللي اتشترى</SectionTitle>
        {inv.items.map((it) => (
          <InvoiceItemRow key={it.name} name={it.name} price={it.price} tag={it.tag} />
        ))}
        <Divider />
        <KeyValueRow label="إجمالي المحل" value={money(total)} size={fontSize.xl} weight="extrabold" />
      </Card>

      <Notice icon={<InfoIcon size={20} color={colors.accentIcon} />}>
        <AppText size={fontSize.body2} lineHeight={1.6} color={colors.warningText}>
          الفاتورة دي للعلم، ومش محتاجة موافقة منك، وبتتجمع أوتوماتيك في الفاتورة النهائية. ومن ساعة أول فاتورة مبقاش ينفع تلغي الأوردر. لو في حاجة غلط كلّم المندوب.
        </AppText>
      </Notice>

      <Modal visible={paperOpen} transparent animationType="fade" onRequestClose={() => setPaperOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setPaperOpen(false)} accessibilityLabel="اقفل">
          <PhotoPlaceholder height={420} caption="صورة الفاتورة الورقية" style={styles.paperPhoto} />
          <AppText size={fontSize.body2} color={colors.surface} center>
            دوس في أي حتة عشان تقفل
          </AppText>
        </Pressable>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  body: { padding: spacing.xxl, gap: spacing.lg },
  // bottom-right corner (= start side in RTL)
  stamp: {
    position: 'absolute',
    bottom: 8,
    start: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: colors.text,
  },
  paper: { flexDirection: 'row', alignItems: 'center', gap: spacing.ml, paddingVertical: spacing.xs, paddingHorizontal: spacing.sm },
  paperIcon: { width: 48, height: 48, borderRadius: 10, backgroundColor: colors.neutralBg, alignItems: 'center', justifyContent: 'center' },
  actions: { flexDirection: 'row', gap: spacing.md },
  btn: { height: 54, borderRadius: radii.input, paddingHorizontal: spacing.md },
  main: { flex: 2 },
  side: { flex: 1 },
  backdrop: { flex: 1, backgroundColor: colors.backdrop, justifyContent: 'center', padding: spacing.s24, gap: spacing.lg },
  paperPhoto: { alignSelf: 'stretch' },
});
