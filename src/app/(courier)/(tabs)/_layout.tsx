import { Tabs } from 'expo-router/js-tabs';

import { BottomTabBar, type TabItem } from '@/components/BottomTabBar';
import { AccountIcon, OrdersIcon, WalletIcon } from '@/components/icons';

const TABS: TabItem[] = [
  { name: 'courier-home', label: 'الأوردرات', icon: (c) => <OrdersIcon size={24} color={c} /> },
  { name: 'courier-wallet', label: 'المحفظة', icon: (c) => <WalletIcon size={24} color={c} /> },
  { name: 'courier-account', label: 'حسابي', icon: (c) => <AccountIcon size={24} color={c} /> },
];

/** Courier bottom tabs: الأوردرات 26 · المحفظة 30 · حسابي 31 */
export default function CourierTabs() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <BottomTabBar {...props} items={TABS} />}>
      <Tabs.Screen name="courier-home" />
      <Tabs.Screen name="courier-wallet" />
      <Tabs.Screen name="courier-account" />
    </Tabs>
  );
}
