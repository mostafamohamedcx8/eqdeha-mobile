import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View, type ScrollViewInstance } from 'react-native';

import { CameraLensIcon, PhoneCallIcon, PinIcon } from '@/components/icons';
import { AppText, Avatar, BackButton, Button, ChatBubble, ChatComposer, Header, ScreenContainer, useDesignInsets } from '@/components/ui';
import { COURIER_FLOW, courierChatResponse, courierOrderResponse } from '@/mocks/courier';
import { useChat } from '@/store/chat';
import { COURIER_THREAD, useCourier } from '@/store/courier';
import { colors, fontSize, radii, spacing } from '@/theme';
import { ar, money, orderNo } from '@/utils/format';
import { goBack, resetTo } from '@/utils/nav';
import { callPhone } from '@/utils/phone';

const DELIVER_STAGE = COURIER_FLOW.length - 1;

/** 27-CChat: chat with the customer + the next step of the order at the bottom. */
export default function CourierChatScreen() {
  const inset = useDesignInsets();
  const order = courierOrderResponse.data;
  const { stage, advance, cancelOrder, sendInvoice } = useCourier();
  const chat = useChat();
  const thread = chat.threads[COURIER_THREAD];
  const [askCancel, setAskCancel] = useState(false);
  const scroll = useRef<ScrollViewInstance>(null);
  const step = COURIER_FLOW[Math.min(stage, DELIVER_STAGE)];

  useEffect(() => useChat.getState().seed(COURIER_THREAD, courierChatResponse.data), []);

  const cancel = () => {
    cancelOrder();
    resetTo('/courier-home');
  };

  /** Dev shortcut from the design ("جرّب: اتبعتت"): send this shop's sample invoice. */
  const devSendInvoice = () => {
    const shop = step.shop ?? 0;
    const items = order.shops[shop].invoiceItems;
    sendInvoice(shop, { total: items.reduce((s, i) => s + i.price, 0), count: items.length });
  };

  return (
    <ScreenContainer
      statusBar="light"
      scrollRef={scroll}
      onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}
      header={
        <>
          <Header paddingTop={48} paddingBottom={12} paddingHorizontal={spacing.xl} radius={0} gap={spacing.ml}>
            <View style={styles.topRow}>
              <BackButton onPress={() => goBack('/courier-home')} />
              <Avatar initial={order.customer.initial} size={42} fontSize={17} bg={colors.accentSoft} fg={colors.primary} />
              <View style={styles.flex}>
                <AppText size={fontSize.lg} weight="bold" color={colors.textOnPrimary}>
                  {`${order.customer.firstName} – العميل`}
                </AppText>
                <AppText size={fontSize.sm} color={colors.textOnPrimaryMuted}>
                  {`${orderNo(order.id)} · ${step.status}`}
                </AppText>
              </View>
              <Pressable onPress={() => callPhone(order.customer.phone)} accessibilityRole="button" accessibilityLabel="اتصل بالعميل" style={styles.call}>
                <PhoneCallIcon size={20} color={colors.surface} />
              </Pressable>
              {stage < DELIVER_STAGE ? (
                <Pressable onPress={() => setAskCancel(true)} accessibilityRole="button" style={styles.cancelBtn}>
                  <AppText size={fontSize.sm} weight="bold" color={colors.dangerSoft}>
                    إلغاء
                  </AppText>
                </Pressable>
              ) : null}
            </View>
            <View style={styles.progress}>
              {[0, 1, 2, 3, 4].map((i) => (
                <View
                  key={i}
                  style={[styles.bar, { backgroundColor: i < stage ? colors.accent : i === stage ? colors.surface : colors.primaryLight }]}
                />
              ))}
            </View>
          </Header>
          {askCancel ? (
            <View style={styles.confirm}>
              <AppText size={fontSize.body2} lineHeight={1.6} color={colors.dangerDeep}>
                متأكد إنك عايز تلغي؟ الأوردر هيرجع لباقي المناديب، والإلغاء بيتسجل عندك.
              </AppText>
              <View style={styles.confirmRow}>
                <Button variant="dangerSolid" title="أيوه، الغي" weight="bold" textSize={14} onPress={cancel} style={styles.confirmBtn} />
                <Button variant="secondary" title="لا، كمّل" textSize={14} onPress={() => setAskCancel(false)} style={styles.confirmBtn} />
              </View>
            </View>
          ) : null}
        </>
      }
      footer={
        <View style={[styles.actionBar, { paddingBottom: inset.bottom(26) }]}>
          {step.kind === 'invoice' ? (
            <View style={styles.invoiceRow}>
              <Button
                title={step.action}
                weight="extrabold"
                textSize={15}
                icon={<CameraLensIcon size={20} color={colors.accentText} />}
                onPress={() => router.push({ pathname: '/courier-invoice', params: { shop: String(step.shop ?? 0) } })}
                style={[styles.stepBtn, styles.main]}
              />
              {__DEV__ ? (
                <Button variant="secondary" title="جرّب: اتبعتت" textSize={12} textColor={colors.textMuted} onPress={devSendInvoice} style={[styles.stepBtn, styles.side, styles.devBtn]} />
              ) : null}
            </View>
          ) : step.kind === 'deliver' ? (
            <Button variant="success" title={step.action} weight="extrabold" textSize={16} onPress={() => router.push('/courier-deliver')} style={styles.stepBtn} />
          ) : (
            <Button variant="teal" title={step.action} weight="extrabold" onPress={advance} style={styles.stepBtn} />
          )}
          <ChatComposer
            compact
            placeholder="اكتب رسالة للعميل..."
            value={thread?.draft ?? ''}
            onChangeText={(t) => chat.setDraft(COURIER_THREAD, t)}
            onSend={() => chat.sendText(COURIER_THREAD, thread?.draft ?? '')}
            onImage={(uri) => chat.sendImage(COURIER_THREAD, uri)}
          />
        </View>
      }
      contentStyle={styles.list}>
      <View style={styles.request}>
        <AppText size={fontSize.body2} weight="extrabold" color={colors.primary}>
          طلب العميل
        </AppText>
        {order.shops.map((s, i) => (
          <AppText key={s.shopId} size={fontSize.body2} lineHeight={1.6}>
            <AppText size={fontSize.body2} weight="bold">{`${ar(i + 1)}. ${s.shopName}:`}</AppText>
            {` ${s.request}`}
          </AppText>
        ))}
        <Pressable onPress={() => router.push({ pathname: '/map-pick', params: { mode: 'end' } })} accessibilityRole="button" style={styles.address}>
          <PinIcon size={18} color={colors.primary} />
          <AppText size={fontSize.body2} style={styles.flex}>
            {order.address}
          </AppText>
          <AppText size={fontSize.body2} weight="bold" color={colors.primary}>
            الخريطة
          </AppText>
        </Pressable>
        <AppText size={fontSize.sm} color={colors.textMuted}>
          {`التوصيل ${money(order.fee)} · ليك ${money(order.courierShare)} · الدفع ${order.payment}`}
        </AppText>
      </View>
      {thread?.messages.map((m) => <ChatBubble key={m.id} message={m} compact />)}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.ml },
  call: { width: 42, height: 42, borderRadius: radii.md, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' },
  cancelBtn: { height: 42, paddingHorizontal: spacing.ml, borderRadius: radii.md, backgroundColor: colors.primaryLight, justifyContent: 'center' },
  progress: { flexDirection: 'row', gap: spacing.sm },
  bar: { flex: 1, height: 5, borderRadius: 3 },
  confirm: {
    marginTop: spacing.ml,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    gap: spacing.md,
    borderRadius: radii.input,
    backgroundColor: colors.dangerBg,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  confirmRow: { flexDirection: 'row', gap: spacing.md },
  confirmBtn: { flex: 1, height: 40, borderRadius: 10 },
  list: { padding: spacing.lg, gap: spacing.md },
  request: { gap: spacing.md, padding: spacing.lg, borderRadius: radii.button, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.divider },
  address: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, paddingHorizontal: spacing.ml, borderRadius: 10, backgroundColor: colors.background },
  actionBar: { paddingTop: spacing.ml, paddingHorizontal: spacing.lg, gap: spacing.md, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.divider },
  invoiceRow: { flexDirection: 'row', gap: spacing.md },
  stepBtn: { height: 50, borderRadius: radii.input },
  main: { flex: 2 },
  side: { flex: 1 },
  devBtn: { backgroundColor: colors.background },
});
