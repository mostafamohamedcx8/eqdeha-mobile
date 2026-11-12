import { create } from 'zustand';

import { customerDetailsResponse } from '@/mocks/customer';
import { notificationsResponse } from '@/mocks/notifications';
import type { AppNotification, CustomerDetails } from '@/mocks/types';

type CustomerState = {
  details: CustomerDetails;
  notifications: AppNotification[];
  saveDetails: (d: Partial<CustomerDetails>) => void;
  markRead: (id: number) => void;
  markAllRead: () => void;
};

/** Customer profile + notifications (local only). */
export const useCustomer = create<CustomerState>((set) => ({
  details: customerDetailsResponse.data,
  notifications: notificationsResponse.data,
  saveDetails: (d) => set((s) => ({ details: { ...s.details, ...d } })),
  markRead: (id) => set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, unread: false } : n)) })),
  markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, unread: false })) })),
}));

export const useUnreadCount = () => useCustomer((s) => s.notifications.filter((n) => n.unread).length);
