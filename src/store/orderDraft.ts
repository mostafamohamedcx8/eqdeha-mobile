import { create } from 'zustand';

import { addressesResponse, samplePickupPlace } from '@/mocks/customer';
import { DELIVERY } from '@/mocks/shops';
import type { Address, PaymentMethod } from '@/mocks/types';

export type DraftShop = { shopId: number; note: string };

/** Which point the map screen is choosing. */
export type MapMode = 'start' | 'end';

type OrderDraftState = {
  /* 07-ShopOrder */
  shops: DraftShop[];
  /* 08-AnyOrder */
  wish: string;
  pickupFrom: 'any' | 'map';
  pickupPlace: string;
  offer: number;
  /* shared */
  payment: PaymentMethod;
  delivery: Address;

  addShop: (shopId: number) => boolean;
  removeShop: (shopId: number) => void;
  setShopNote: (shopId: number, note: string) => void;
  setWish: (v: string) => void;
  setPickupFrom: (v: 'any' | 'map') => void;
  setPickupPlace: (v: string) => void;
  changeOffer: (delta: number) => void;
  setPayment: (v: PaymentMethod) => void;
  setDelivery: (a: Address) => void;
  reset: () => void;
};

const initial = {
  shops: [] as DraftShop[],
  wish: '',
  pickupFrom: 'any' as const,
  pickupPlace: samplePickupPlace,
  offer: DELIVERY.base,
  payment: 'cash' as PaymentMethod,
  delivery: addressesResponse.data[0],
};

/** Order being built (shop order or "anything" order). Local only in this phase. */
export const useOrderDraft = create<OrderDraftState>((set, get) => ({
  ...initial,
  addShop: (shopId) => {
    const { shops } = get();
    if (shops.some((s) => s.shopId === shopId)) return true;
    if (shops.length >= DELIVERY.maxShops) return false;
    set({ shops: [...shops, { shopId, note: '' }] });
    return true;
  },
  removeShop: (shopId) => set((s) => ({ shops: s.shops.filter((x) => x.shopId !== shopId) })),
  setShopNote: (shopId, note) => set((s) => ({ shops: s.shops.map((x) => (x.shopId === shopId ? { ...x, note } : x)) })),
  setWish: (wish) => set({ wish }),
  setPickupFrom: (pickupFrom) => set({ pickupFrom }),
  setPickupPlace: (pickupPlace) => set({ pickupPlace }),
  changeOffer: (delta) =>
    set((s) => ({ offer: Math.min(DELIVERY.maxOffer, Math.max(DELIVERY.minOffer, s.offer + delta)) })),
  setPayment: (payment) => set({ payment }),
  setDelivery: (delivery) => set({ delivery }),
  reset: () => set(initial),
}));

/** 15 for the first shop + 5 for each extra shop. */
export function shopDeliveryFee(count: number) {
  return DELIVERY.base + Math.max(0, count - 1) * DELIVERY.perExtraShop;
}
