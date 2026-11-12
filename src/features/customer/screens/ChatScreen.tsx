import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, type ScrollViewInstance } from 'react-native';

import { PhoneCallIcon } from '@/components/icons';
import { Avatar, ChatBubble, ChatComposer, ScreenContainer, TopBar } from '@/components/ui';
import { useActiveOrder } from '@/store/activeOrder';
import { useChat } from '@/store/chat';
import { colors, radii, spacing } from '@/theme';
import { orderNo } from '@/utils/format';
import { goBack } from '@/utils/nav';
import { callPhone } from '@/utils/phone';

const THREAD = 'customer-1042' as const;

/** 13-Chat with the courier. Sent messages / photos are added to the list. */
export default function ChatScreen() {
  const { order, markChatRead } = useActiveOrder();
  const thread = useChat((s) => s.threads[THREAD]);
  const { setDraft, sendText, sendImage } = useChat();
  const scroll = useRef<ScrollViewInstance>(null);
  const c = order.courier;

  useEffect(() => markChatRead(), [markChatRead]);

  return (
    <ScreenContainer
      statusBar="light"
      scrollRef={scroll}
      onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}
      header={
        <TopBar
          title={`${c.firstName} – المندوب`}
          titleSize={17}
          subtitle={`أوردر ${orderNo(order.id)} · في المحل دلوقتي`}
          onBack={() => goBack('/tracking')}
          paddingBottom={16}
          leading={<Avatar initial={c.initial} bg={c.avatarBg} fg={c.avatarFg} size={44} fontSize={18} />}
          end={
            <Pressable onPress={() => callPhone(c.phone)} accessibilityRole="button" accessibilityLabel="اتصل بالمندوب" style={styles.call}>
              <PhoneCallIcon color={colors.surface} />
            </Pressable>
          }
        />
      }
      footer={
        <ChatComposer
          value={thread?.draft ?? ''}
          onChangeText={(t) => setDraft(THREAD, t)}
          onSend={() => sendText(THREAD, thread?.draft ?? '')}
          onImage={(uri) => sendImage(THREAD, uri)}
        />
      }
      contentStyle={styles.list}>
      {thread?.messages.map((m) => <ChatBubble key={m.id} message={m} />)}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.xxl, gap: spacing.ml },
  call: { width: 46, height: 46, borderRadius: radii.input, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' },
});
