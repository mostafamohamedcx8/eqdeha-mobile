import { create } from 'zustand';

import { COURIER_FLOW, courierChatResponse, courierMeResponse, courierOrderResponse, courierPointsResponse, courierWalletResponse, type WalletTxn } from '@/mocks/courier';

import { useChat } from './chat';

export type HomeMode = 'free' | 'busy' | 'stop';
export type WalletView = 'ok' | 'stop' | 'pend';
export type SentInvoice = { total: number; count: number };

export const COURIER_THREAD = 'courier-1042' as const;

type CourierState = {
  online: boolean;
  /** 26-CHome preview (dev switch): free / has an order / suspended. */
  homeMode: HomeMode;
  /** Counter-offer on the "anything" order (26-CHome). */
  counterOffer: number;
  offerSent: boolean;
  /** Index in COURIER_FLOW for the current order (27-CChat). */
  stage: number;
  invoices: Record<number, SentInvoice>;
  debt: number;
  transactions: WalletTxn[];
  paymentSubmitted: boolean;
  /** 30-CWallet preview (dev switch); null = real state. */
  walletPreview: WalletView | null;
  points: number;
  pointsRedeemed: boolean;

  toggleOnline: () => void;
  setHomeMode: (m: HomeMode) => void;
  changeCounter: (delta: number) => void;
  sendOffer: () => void;
  withdrawOffer: () => void;
  acceptOrder: () => void;
  advance: () => void;
  sendInvoice: (shop: number, inv: SentInvoice) => void;
  cancelOrder: () => void;
  completeDelivery: () => void;
  submitPayment: () => void;
  setWalletPreview: (v: WalletView | null) => void;
  redeemPoints: () => void;
  previewPoints: (p: number) => void;
};

const order = courierOrderResponse.data;
const wallet = courierWalletResponse.data;
const POINT_GOAL = courierPointsResponse.data.goal;
const REWARD = courierPointsResponse.data.rewardEgp;

/** Push the flow step's event into the chat (pill / unlock banner). */
function logEvent(stage: number) {
  const ev = COURIER_FLOW[stage]?.event;
  if (!ev) return;
  const chat = useChat.getState();
  chat.seed(COURIER_THREAD, courierChatResponse.data);
  chat.addSystem(COURIER_THREAD, ev.text, ev.kind === 'unlock' ? 'unlock' : undefined);
}

/** Courier side of the app (local only in this phase). */
export const useCourier = create<CourierState>((set, get) => ({
  online: true,
  homeMode: 'free',
  counterOffer: 20,
  offerSent: false,
  stage: 0,
  invoices: {},
  debt: wallet.debt,
  transactions: wallet.transactions,
  paymentSubmitted: false,
  walletPreview: null,
  points: courierMeResponse.data.points,
  pointsRedeemed: false,

  toggleOnline: () => set((s) => ({ online: !s.online })),
  setHomeMode: (homeMode) => set({ homeMode }),
  changeCounter: (d) => set((s) => ({ counterOffer: Math.max(10, Math.min(100, s.counterOffer + d)) })),
  sendOffer: () => {
    if (get().homeMode === 'free') set({ offerSent: true });
  },
  withdrawOffer: () => set({ offerSent: false }),
  acceptOrder: () => {
    useChat.getState().seed(COURIER_THREAD, courierChatResponse.data);
    set({ homeMode: 'busy', stage: 0, invoices: {} });
  },
  advance: () => {
    const { stage } = get();
    if (stage >= COURIER_FLOW.length - 1) return;
    logEvent(stage);
    set({ stage: stage + 1 });
  },
  sendInvoice: (shop, inv) => {
    const { stage } = get();
    const name = order.shops[shop]?.shopName ?? '';
    const chat = useChat.getState();
    chat.seed(COURIER_THREAD, courierChatResponse.data);
    chat.addSystem(COURIER_THREAD, name, 'invoice', inv);
    set((s) => ({ invoices: { ...s.invoices, [shop]: inv }, stage: Math.min(stage + 1, COURIER_FLOW.length - 1) }));
  },
  cancelOrder: () => set({ homeMode: 'free', stage: 0, invoices: {} }),
  completeDelivery: () =>
    set((s) => ({
      homeMode: 'free',
      stage: 0,
      invoices: {},
      debt: s.debt + order.commission,
      points: s.points + 10,
      transactions: [
        { id: Date.now(), title: `عمولة أوردر #${order.id}`, sub: `${order.commissionPct}٪ من توصيل ${order.fee} ج`, amount: -order.commission },
        ...s.transactions,
      ],
    })),
  submitPayment: () => set({ paymentSubmitted: true, walletPreview: null }),
  setWalletPreview: (walletPreview) => set({ walletPreview }),
  redeemPoints: () => {
    const { points, pointsRedeemed } = get();
    if (points >= POINT_GOAL && !pointsRedeemed) set((s) => ({ points: s.points - POINT_GOAL, pointsRedeemed: true, debt: Math.max(0, s.debt - REWARD) }));
  },
  previewPoints: (p) => set({ points: p, pointsRedeemed: false }),
}));

/** What the wallet shows: dev preview, or the real state. */
export function walletView(s: Pick<CourierState, 'walletPreview' | 'paymentSubmitted' | 'debt'>): WalletView {
  if (s.walletPreview) return s.walletPreview;
  if (s.paymentSubmitted) return 'pend';
  return s.debt >= wallet.stopAt ? 'stop' : 'ok';
}
