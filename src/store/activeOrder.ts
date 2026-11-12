import { create } from 'zustand';

import { activeOrderResponse, offersResponse } from '@/mocks/orders';
import type { ActiveOrder, CourierSummary } from '@/mocks/types';

export type FinalPayment = 'cash' | 'transfer';
/** 12-Tracking preview: before / after the first shop invoice. */
export type TrackingStage = 'before' | 'after';

type ActiveOrderState = {
  order: ActiveOrder;
  /** Offers the customer rejected on 11-Offers. */
  rejectedOfferIds: number[];
  stage: TrackingStage;
  finalPayment: FinalPayment;
  rejectOffer: (id: number) => void;
  /** Accept an offer: that courier + price become the order's. */
  acceptOffer: (courier: CourierSummary, price: number) => void;
  /** Start a shop order (07 → 12). */
  startShopOrder: (shopIds: number[], fee: number) => void;
  setStage: (s: TrackingStage) => void;
  setFinalPayment: (p: FinalPayment) => void;
  markChatRead: () => void;
  reset: () => void;
};

const initial = {
  order: activeOrderResponse.data,
  rejectedOfferIds: [] as number[],
  stage: 'before' as TrackingStage,
  finalPayment: 'cash' as FinalPayment,
};

/** The customer's current order (local only in this phase). */
export const useActiveOrder = create<ActiveOrderState>((set) => ({
  ...initial,
  rejectOffer: (id) => set((s) => ({ rejectedOfferIds: [...s.rejectedOfferIds, id] })),
  acceptOffer: (courier, price) =>
    set((s) => ({ order: { ...s.order, kind: 'anything', courier, deliveryFee: price }, stage: 'before' })),
  startShopOrder: (shopIds, fee) =>
    set((s) => ({ order: { ...s.order, kind: 'shops', shopIds, deliveryFee: fee }, stage: 'before' })),
  setStage: (stage) => set({ stage }),
  setFinalPayment: (finalPayment) => set({ finalPayment }),
  markChatRead: () => set((s) => ({ order: { ...s.order, unreadMessages: 0 } })),
  reset: () => set({ ...initial, rejectedOfferIds: [] }),
}));

export const visibleOffers = (rejected: number[]) => offersResponse.data.filter((o) => !rejected.includes(o.id));
