/**
 * Shapes of the sample data, written like real API responses so screens can
 * later switch to the backend without changing how they read the data.
 */

export type ApiList<T> = { data: T[]; total: number };
export type ApiItem<T> = { data: T };

export type PaymentMethod = 'cash' | 'wallet';

/* ---------- customer ---------- */

export type CustomerProfile = {
  id: number;
  fullName: string;
  firstName: string;
  phone: string; // 10 digits after +20
  email: string | null;
  photoUrl: string | null;
  points: number;
  unreadNotifications: number;
  memberSince: string;
  ordersCount: number;
};

export type Address = {
  id: number;
  label: string; // "البيت"
  street: string; // "ش. الجمهورية"
  details: string; // "عمارة ١٢، الدور ٣"
  building?: string;
  floor?: string;
  apartment?: string;
  landmark?: string;
  lat: number;
  lng: number;
};

/** Icon keys drawn in components/categoryIcons.tsx */
export type CategoryIcon = 'grill' | 'pharmacy' | 'market' | 'veggies' | 'fish' | 'butcher' | 'clothes' | 'bakery';

export type ShopCategory = {
  id: string;
  name: string; // "مشويات"
  icon: CategoryIcon;
  bg: string;
  fg: string;
};

export type Shop = {
  id: number;
  name: string;
  categoryId: string;
  street: string;
  open: boolean;
  hours: string;
  /** Example text for the order box. */
  orderHint: string;
};

export type PointsEntry = { id: number; title: string; when: string; points: number };

export type PointsSummary = {
  balance: number;
  goal: number; // 1000
  rewardEgp: number; // 20
  rules: { label: string; value: string }[];
  history: PointsEntry[];
};

export type MapPlace = { title: string; subtitle: string; lat: number; lng: number };

/* ---------- orders (customer side) ---------- */

export type WalletType = 'vodafone_cash' | 'instapay';

export type CourierSummary = {
  id: number;
  name: string;
  firstName: string;
  initial: string;
  avatarBg: string;
  avatarFg: string;
  rating: number;
  trips: number;
  vehicle: string; // "موتوسيكل أحمر"
  phone: string; // 11 digits, LTR
  wallet: { type: WalletType; label: string; number: string };
  memberSince: string;
  completionRate: number; // %
  verified: boolean;
};

export type Offer = {
  id: number;
  courier: CourierSummary;
  price: number;
  etaText: string; // "على بعد ٤ دقايق"
  acceptsYourPrice: boolean;
};

export type InvoiceItem = { name: string; price: number; tag?: string };

export type ShopInvoice = {
  id: number;
  orderId: number;
  shopId: number;
  shopName: string;
  index: number; // 1-based
  of: number;
  items: InvoiceItem[];
  photoTime: string;
  hasPaperPhoto: boolean;
};

export type TrackingStep = { title: string; subtitle: string; subtitleAfter?: string };

export type ActiveOrder = {
  id: number;
  kind: 'shops' | 'anything';
  createdAt: string; // "٢:٣٠ م"
  date: string; // "٦ نوفمبر ٢٠٢٦"
  courier: CourierSummary;
  shopIds: number[];
  deliveryFee: number;
  unreadMessages: number;
  steps: TrackingStep[];
  wishSummary: string;
};

export type ChatMessage = {
  id: string;
  from: 'me' | 'them' | 'system';
  text?: string;
  /** Local photo URI, or `placeholder` for the sample photo in the design. */
  image?: string;
  imageCaption?: string;
  time?: string;
  /** System cards in the courier chat: invoice sent / goods picked up. */
  variant?: 'invoice' | 'unlock';
  invoice?: { total: number; count: number };
};

export type Review = { id: number; initial: string; name: string; date: string; stars: number; text: string };

export type CourierReviews = {
  courierId: number;
  total: number;
  distribution: { stars: number; count: number }[];
  tags: { label: string; count: number }[];
  reviews: Review[];
};

/* ---------- notifications / history / profile ---------- */

export type NotificationKind = 'invoice' | 'order' | 'offer' | 'chat' | 'money' | 'pending' | 'cancel';

/** App route the notification opens (a plain path, like a deep link). */
export type NotificationTarget = '/invoice' | '/chat' | '/tracking' | '/offers' | '/points' | '/delivered';

export type AppNotification = {
  id: number;
  kind: NotificationKind;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  target: NotificationTarget;
};

export type PushPreview = { title: string; body: string; time: string };

export type OrderStatus = 'on_the_way' | 'searching' | 'delivered' | 'cancelled';

export type OrderAction = { label: string; to: '/tracking' | '/chat' | '/offers' | '/final-invoice' | '/delivered' | 'reorder' };

export type OrderHistoryItem = {
  id: number;
  tab: 'now' | 'past' | 'cancel';
  kind: 'shops' | 'anything';
  date: string;
  title: string;
  detail: string;
  status: OrderStatus;
  statusLabel: string;
  totalLabel: string;
  total: number;
  shopIds: number[];
  primary: OrderAction;
  secondary?: OrderAction;
};

export type CustomerDetails = {
  fullName: string;
  email: string;
  dob: { day: string; month: string; year: string };
  gender: 'male' | 'female';
  secondPhone: string;
  photoUri: string | null;
};
