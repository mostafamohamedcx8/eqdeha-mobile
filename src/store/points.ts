import { create } from 'zustand';

import { pointsResponse } from '@/mocks/customer';

type PointsState = {
  balance: number;
  /** true after "استبدل" until the next order uses the discount. */
  redeemed: boolean;
  redeem: () => void;
  /** Dev preview of another balance (design toggle ١٢٠ / ١٠٤٠). */
  preview: (balance: number) => void;
  /** Add points once per reason key (e.g. "delivered-1042"). */
  award: (key: string, points: number) => void;
  awarded: string[];
};

const { balance, goal } = pointsResponse.data;

/** Customer points (local only). Home's points chip and 10-Points read this. */
export const usePoints = create<PointsState>((set, get) => ({
  balance,
  redeemed: false,
  redeem: () => {
    if (get().balance >= goal && !get().redeemed) set((s) => ({ balance: s.balance - goal, redeemed: true }));
  },
  preview: (b) => set({ balance: b, redeemed: false }),
  awarded: [],
  award: (key, points) => {
    if (get().awarded.includes(key)) return;
    set((s) => ({ balance: s.balance + points, awarded: [...s.awarded, key] }));
  },
}));
