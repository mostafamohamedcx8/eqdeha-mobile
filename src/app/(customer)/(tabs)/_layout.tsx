import { Tabs } from 'expo-router/js-tabs';

import { BottomTabBar, type TabItem } from '@/components/BottomTabBar';
import { AccountIcon, HomeIcon, OrdersIcon } from '@/components/icons';

const TABS: TabItem[] = [
  { name: 'home', label: 'الرئيسية', icon: (c) => <HomeIcon size={24} color={c} /> },
  { name: 'orders', label: 'طلباتي', icon: (c) => <OrdersIcon size={24} color={c} /> },
  { name: 'account', label: 'حسابي', icon: (c) => <AccountIcon size={24} color={c} /> },
];

/** Customer bottom tabs: الرئيسية 05 · طلباتي 20 · حسابي 18 */
export default function CustomerTabs() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <BottomTabBar {...props} items={TABS} />}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="orders" />
      <Tabs.Screen name="account" />
    </Tabs>
  );
}
