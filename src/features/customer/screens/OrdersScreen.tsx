import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { OrderCard } from '@/components/OrderCard';
import { AppText, Button, Header, ScreenContainer, Segmented } from '@/components/ui';
import { ordersResponse } from '@/mocks/orderHistory';
import type { OrderAction, OrderHistoryItem } from '@/mocks/types';
import { useOrderDraft } from '@/store/orderDraft';
import { colors, fontSize, spacing } from '@/theme';
import { ar } from '@/utils/format';

type Tab = OrderHistoryItem['tab'];

/** 20-Orders (tab: طلباتي): current / past / cancelled. */
export default function OrdersScreen() {
  const [tab, setTab] = useState<Tab>('now');
  const draft = useOrderDraft();
  const list = ordersResponse.data.filter((o) => o.tab === tab);
  const nowCount = ordersResponse.data.filter((o) => o.tab === 'now').length;

  const act = (order: OrderHistoryItem, a: OrderAction) => {
    if (a.to !== 'reorder') {
      router.push(a.to);
      return;
    }
    // "اطلب تاني": same shops in a new shop order.
    draft.reset();
    order.shopIds.forEach((id) => draft.addShop(id));
    router.push('/shop-order');
  };

  return (
    <ScreenContainer
      statusBar="light"
      header={
        <Header paddingTop={50} paddingBottom={16} paddingHorizontal={spacing.xxl} radius={0} gap={spacing.xl}>
          <AppText size={fontSize.h2} weight="extrabold" color={colors.textOnPrimary}>
            طلباتي
          </AppText>
          <Segmented
            tone="onPrimarySm"
            value={tab}
            onChange={setTab}
            options={[
              { value: 'now', label: `الحالية (${ar(nowCount)})` },
              { value: 'past', label: 'السابقة' },
              { value: 'cancel', label: 'الملغية' },
            ]}
          />
        </Header>
      }
      contentStyle={styles.list}>
      {list.map((o) => (
        <OrderCard key={o.id} order={o} onAction={(a) => act(o, a)} />
      ))}
      {list.length === 0 ? (
        <View style={styles.empty}>
          <AppText size={fontSize.lg} weight="bold" center>
            مفيش طلبات هنا
          </AppText>
          <Button title="اطلب حاجة" textSize={14} onPress={() => router.navigate('/home')} style={styles.emptyBtn} />
        </View>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.xxl, gap: spacing.lg },
  empty: { paddingVertical: 48, paddingHorizontal: spacing.xxl, alignItems: 'center', gap: spacing.md },
  emptyBtn: { height: 44, borderRadius: 12, marginTop: spacing.sm },
});
