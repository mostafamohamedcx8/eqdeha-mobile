import { invoicesResponse } from '@/mocks/orders';
import { useActiveOrder } from '@/store/activeOrder';

/** Order totals: every shop invoice of the active order + delivery. */
export function useOrderTotals() {
  const order = useActiveOrder((s) => s.order);
  const invoices = invoicesResponse.data.filter((i) => i.orderId === order.id);
  const goods = invoices.reduce((s, inv) => s + inv.items.reduce((a, i) => a + i.price, 0), 0);
  return { order, invoices, goods, due: goods + order.deliveryFee };
}
