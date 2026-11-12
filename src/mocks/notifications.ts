import type { ApiList, AppNotification, NotificationKind, PushPreview } from './types';

/** Icon letter + colors per kind (17-Notifications). */
export const NOTIFICATION_KINDS: Record<NotificationKind, { glyph: string; bg: string; fg: string }> = {
  invoice: { glyph: 'ف', bg: '#FFF1CC', fg: '#8A5A00' },
  order: { glyph: '✓', bg: '#DDF1EE', fg: '#1B6B61' },
  offer: { glyph: 'ع', bg: '#E1EEF0', fg: '#0F4C5C' },
  chat: { glyph: 'ش', bg: '#EEEDFE', fg: '#534AB7' },
  money: { glyph: '★', bg: '#FFF1CC', fg: '#8A5A00' },
  pending: { glyph: '…', bg: '#F1EFE8', fg: '#5B6770' },
  cancel: { glyph: '×', bg: '#FBE3E4', fg: '#A32D2D' },
};

export const notificationsResponse: ApiList<AppNotification> = {
  total: 7,
  data: [
    { id: 1, kind: 'invoice', title: 'فاتورة جديدة من مشويات أبو علي', body: 'المندوب اشترى أول حاجة · ١٩٥ ج', time: 'دلوقتي', unread: true, target: '/invoice' },
    { id: 2, kind: 'chat', title: 'رسالة من محمود', body: 'الفراخ المشوية خلصت، ينفع بانيه بدلها؟', time: 'من دقيقة', unread: true, target: '/chat' },
    { id: 3, kind: 'order', title: 'محمود قبل أوردرك', body: 'في الطريق لمشويات أبو علي', time: 'من ٣ دقايق', unread: false, target: '/tracking' },
    { id: 4, kind: 'offer', title: 'عرض جديد على طلبك', body: 'كريم عرض توصيل بـ ٢٠ ج', time: 'من ٥ دقايق', unread: false, target: '/offers' },
    { id: 5, kind: 'money', title: 'اتضافلك ١٠ نقاط', body: 'على أوردر #١٠٤٠ · مجموع نقاطك بقى ١٢٠', time: 'أمس', unread: false, target: '/points' },
    { id: 6, kind: 'order', title: 'أوردرك وصل', body: 'قيّم المندوب وقولنا رأيك', time: '٣ نوفمبر', unread: false, target: '/delivered' },
    { id: 7, kind: 'cancel', title: 'المندوب لغى الأوردر', body: 'ولا يهمك، طلبك رجع لباقي المناديب', time: '٢ نوفمبر', unread: false, target: '/tracking' },
  ],
};

/** How pushes look on the lock screen (design preview, shown in dev only). */
export const pushPreviews: PushPreview[] = [
  { title: 'المندوب اشترى من مشويات أبو علي', body: 'الفاتورة ١٩٥ ج. افتح وشوفها', time: 'دلوقتي' },
  { title: 'محمود قبل أوردرك', body: 'في الطريق للمحل، وتقدر تكلّمه من الشات', time: 'من ٣ دقايق' },
];
