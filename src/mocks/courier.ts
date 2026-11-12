import type { ApiItem, ApiList, ChatMessage, InvoiceItem, PointsSummary } from './types';

export type CourierProfile = {
  id: number;
  name: string;
  firstName: string;
  initial: string;
  phone: string; // 10 digits after +20
  address: string;
  dob: string;
  wallet: { label: string; number: string };
  vehicle: { type: string; color: string; plate: string };
  idVerified: boolean;
  rating: number;
  reviewsCount: number;
  points: number;
  earnings: { today: number; week: number; month: number };
  monthCommission: number;
  warnings: { count: number; max: number };
};

export type NearbyOrder =
  | { id: number; kind: 'fixed_shops'; ago: string; shops: string; shopsMeta: string; dropoff: string; dropoffMeta: string; fee: number; courierShare: number }
  | { id: number; kind: 'anything'; ago: string; wish: string; route: string; customerOffer: number }
  | { id: number; kind: 'fixed_simple'; shop: string; route: string; fee: number };

export type ShopRequest = { shopId: number; shopName: string; request: string; invoiceItems: InvoiceItem[] };

export type CourierCurrentOrder = {
  id: number;
  customer: { name: string; firstName: string; initial: string; phone: string };
  address: string;
  shops: ShopRequest[];
  fee: number;
  courierShare: number;
  commission: number;
  commissionPct: number;
  payment: string;
  acceptedAt: string;
};

/** One step of the courier's order flow (27-CChat). */
export type FlowStep = {
  action: string;
  kind: 'plain' | 'invoice' | 'deliver';
  status: string;
  /** Shop index for invoice steps / arrival steps. */
  shop?: number;
  event?: { kind: 'pill' | 'unlock'; text: string };
};

export type WalletTxn = { id: number; title: string; sub: string; amount: number; confirmed?: boolean };

export type CourierWallet = {
  debt: number;
  stopAt: number;
  advance: number; // سلفة
  payTo: { code: 'VC' | 'IP'; label: string; value: string }[];
  transactions: WalletTxn[];
};

export const courierMeResponse: ApiItem<CourierProfile> = {
  data: {
    id: 7,
    name: 'محمود سعيد',
    firstName: 'محمود',
    initial: 'م',
    phone: '1122334455',
    address: 'ش. المدارس، عمارة ٣',
    dob: '٣ / ٨ / ١٩٩٨',
    wallet: { label: 'فودافون كاش', number: '01122334455' },
    vehicle: { type: 'موتوسيكل', color: 'أحمر', plate: 'س ع د ١٢٣' },
    idVerified: true,
    rating: 4.9,
    reviewsCount: 184,
    points: 640,
    earnings: { today: 70, week: 490, month: 3240 },
    monthCommission: 345,
    warnings: { count: 1, max: 3 },
  },
};

export const nearbyOrdersResponse: ApiList<NearbyOrder> = {
  total: 3,
  data: [
    {
      id: 1042,
      kind: 'fixed_shops',
      ago: 'من دقيقة',
      shops: 'مشويات أبو علي + سوبر ماركت الأمانة',
      shopsMeta: 'محلين · ش. الجمهورية · على بعد ٤٠٠ م',
      dropoff: 'ش. الجمهورية، عمارة ١٢',
      dropoffMeta: '١٫٢ كم من المحل',
      fee: 20,
      courierShare: 14,
    },
    { id: 1043, kind: 'anything', ago: 'من ٣ دقايق', wish: 'علبة سجاير وكيس شيبسي وزجاجة مية كبيرة', route: 'من أي مكان قريب ← ش. النصر، عمارة ٤ · ٧٠٠ م', customerOffer: 15 },
    { id: 1044, kind: 'fixed_simple', shop: 'صيدلية الشفاء', route: 'ش. النصر ← ش. المدارس · ٥٠٠ م', fee: 15 },
  ],
};

export const courierOrderResponse: ApiItem<CourierCurrentOrder> = {
  data: {
    id: 1042,
    customer: { name: 'أحمد محمد', firstName: 'أحمد', initial: 'أ', phone: '01012345678' },
    address: 'ش. الجمهورية، عمارة ١٢، الدور ٣',
    fee: 20,
    courierShare: 14,
    commission: 6,
    commissionPct: 30,
    payment: 'كاش',
    acceptedAt: '٢:٣٠ م',
    shops: [
      {
        shopId: 1,
        shopName: 'مشويات أبو علي',
        request: 'نص كيلو كفتة من غير بصل، ربع فراخ مشوية، ٥ عيش',
        invoiceItems: [
          { name: 'نص كيلو كفتة', price: 120 },
          { name: 'ربع فراخ بانيه (بديل)', price: 65 },
          { name: 'عيش × ٥', price: 10 },
        ],
      },
      {
        shopId: 3,
        shopName: 'سوبر ماركت الأمانة',
        request: '٢ لبن، كيس سكر كيلو',
        invoiceItems: [
          { name: 'لبن × ٢', price: 40 },
          { name: 'سكر ١ كيلو', price: 35 },
        ],
      },
    ],
  },
};

/** The courier's steps for order #1042 (27-CChat script). */
export const COURIER_FLOW: FlowStep[] = [
  { action: 'وصلت مشويات أبو علي', kind: 'plain', status: 'في الطريق للمحل', event: { kind: 'pill', text: 'وصلت مشويات أبو علي · ٢:٤٢ م' } },
  { action: 'صوّر واعمل فاتورة المحل', kind: 'invoice', status: 'في مشويات أبو علي', shop: 0 },
  { action: 'وصلت سوبر ماركت الأمانة', kind: 'plain', status: 'بيشتري', event: { kind: 'pill', text: 'وصلت سوبر ماركت الأمانة · ٢:٥٠ م' } },
  { action: 'صوّر واعمل فاتورة المحل', kind: 'invoice', status: 'في سوبر ماركت الأمانة', shop: 1 },
  {
    action: 'استلمت كل الحاجة · في الطريق للعميل',
    kind: 'plain',
    status: 'استلم الحاجة',
    event: { kind: 'unlock', text: 'كده استلمت الحاجة: تقدر تقبل أوردر جديد، ومبقاش ينفع إلغاء من الطرفين' },
  },
  { action: 'وصلت للعميل · سلّم وحصّل', kind: 'deliver', status: 'في الطريق للعميل' },
];

export const courierChatResponse: ApiList<ChatMessage> = {
  total: 3,
  data: [
    { id: 'k1', from: 'system', text: 'قبلت الأوردر · ٢:٣٠ م' },
    { id: 'k2', from: 'me', text: 'أهلاً يا أستاذ أحمد، أنا في الطريق لمشويات أبو علي' },
    { id: 'k3', from: 'them', text: 'تمام، ياريت الكفتة من غير بصل' },
  ],
};

export const courierWalletResponse: ApiItem<CourierWallet> = {
  data: {
    debt: 45,
    stopAt: 100,
    advance: 50,
    payTo: [
      { code: 'VC', label: 'فودافون كاش', value: '[رقم المحفظة]' },
      { code: 'IP', label: 'إنستاباي', value: '[عنوان إنستاباي]' },
    ],
    transactions: [
      { id: 2, title: 'سداد عمولة', sub: 'الإدارة أكدته', amount: 100, confirmed: true },
      { id: 1, title: 'عمولة أوردر #١٠٣٨', sub: '٣٠٪ من توصيل ١٥ ج', amount: -4.5 },
    ],
  },
};

export const courierPointsResponse: ApiItem<PointsSummary> = {
  data: {
    balance: 640,
    goal: 1000,
    rewardEgp: 20,
    rules: [
      { label: 'كل مشوار بيتسلّم', value: '+١٠ نقاط' },
      { label: 'تقييم ٥ نجوم من العميل', value: '+٥ نقاط' },
      { label: 'هدايا من الإدارة في المواسم', value: 'حسب العرض' },
    ],
    history: [
      { id: 1, title: 'أوردر #١٠٤٢', when: 'النهارده', points: 10 },
      { id: 2, title: 'تقييم ٥ نجوم', when: 'النهارده', points: 5 },
      { id: 3, title: 'أوردر #١٠٤٠', when: 'أمس', points: 10 },
    ],
  },
};

export const COURIER_POINTS_PREVIEW = [640, 1040] as const;
