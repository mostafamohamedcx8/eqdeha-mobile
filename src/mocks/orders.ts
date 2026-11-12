import type { ActiveOrder, ApiItem, ApiList, ChatMessage, CourierReviews, CourierSummary, Offer, ShopInvoice } from './types';

export const couriers: Record<string, CourierSummary> = {
  mahmoud: {
    id: 7,
    name: 'محمود سعيد',
    firstName: 'محمود',
    initial: 'م',
    avatarBg: '#E1EEF0',
    avatarFg: '#0F4C5C',
    rating: 4.9,
    trips: 210,
    vehicle: 'موتوسيكل أحمر',
    phone: '01122334455',
    wallet: { type: 'vodafone_cash', label: 'فودافون كاش', number: '01122334455' },
    memberSince: 'مارس ٢٠٢٦',
    completionRate: 98,
    verified: true,
  },
  karim: {
    id: 8,
    name: 'كريم عادل',
    firstName: 'كريم',
    initial: 'ك',
    avatarBg: '#FFF1CC',
    avatarFg: '#8A5A00',
    rating: 4.7,
    trips: 85,
    vehicle: 'سكوتر أسود',
    phone: '01099887766',
    wallet: { type: 'instapay', label: 'إنستاباي', number: '01099887766' },
    memberSince: 'يونيو ٢٠٢٦',
    completionRate: 95,
    verified: true,
  },
  ahmed: {
    id: 9,
    name: 'أحمد فتحي',
    firstName: 'أحمد',
    initial: 'أ',
    avatarBg: '#EEEDFE',
    avatarFg: '#534AB7',
    rating: 4.8,
    trips: 140,
    vehicle: 'عجلة زرقا',
    phone: '01255667788',
    wallet: { type: 'vodafone_cash', label: 'فودافون كاش', number: '01255667788' },
    memberSince: 'أبريل ٢٠٢٦',
    completionRate: 97,
    verified: true,
  },
};

export const offersResponse: ApiList<Offer> = {
  total: 3,
  data: [
    { id: 1, courier: couriers.mahmoud, price: 15, etaText: 'على بعد ٤ دقايق', acceptsYourPrice: true },
    { id: 2, courier: couriers.karim, price: 20, etaText: 'على بعد دقيقتين', acceptsYourPrice: false },
    { id: 3, courier: couriers.ahmed, price: 18, etaText: 'على بعد ٦ دقايق', acceptsYourPrice: false },
  ],
};

/** "زوّد عرضك" choices on 11-Offers. */
export const OFFER_BUMPS = [17, 20, 25] as const;

export const activeOrderResponse: ApiItem<ActiveOrder> = {
  data: {
    id: 1042,
    kind: 'shops',
    createdAt: '٢:٣٠ م',
    date: '٦ نوفمبر ٢٠٢٦',
    courier: couriers.mahmoud,
    shopIds: [1, 3],
    deliveryFee: 20,
    unreadMessages: 2,
    wishSummary: 'سجاير وشيبسي ومية',
    steps: [
      { title: 'المندوب قبل الأوردر', subtitle: '٢:٣٠ م' },
      { title: 'في الطريق للمحلات', subtitle: 'هيوصل مشويات أبو علي خلال ٥ دقايق', subtitleAfter: '٢:٣٤ م' },
      { title: 'بيشتري ويبعت الفواتير', subtitle: 'هتوصلك فاتورة كل محل أول بأول', subtitleAfter: 'فاتورة ١ من ٢ وصلت' },
      { title: 'في الطريق ليك', subtitle: 'وقت الوصول المتوقع ٣:١٥ م' },
      { title: 'تم التسليم', subtitle: 'وبعدها الدفع والتقييم' },
    ],
  },
};

export const invoicesResponse: ApiList<ShopInvoice> = {
  total: 2,
  data: [
    {
      id: 501,
      orderId: 1042,
      shopId: 1,
      shopName: 'مشويات أبو علي',
      index: 1,
      of: 2,
      photoTime: '٢:٤٥ م',
      hasPaperPhoto: true,
      items: [
        { name: 'نص كيلو كفتة (من غير بصل)', price: 120 },
        { name: 'ربع فراخ بانيه', price: 65, tag: 'بديل' },
        { name: 'عيش × ٥', price: 10 },
      ],
    },
    {
      id: 502,
      orderId: 1042,
      shopId: 3,
      shopName: 'سوبر ماركت الأمانة',
      index: 2,
      of: 2,
      photoTime: '٢:٥٨ م',
      hasPaperPhoto: false,
      items: [
        { name: 'لبن × ٢', price: 40 },
        { name: 'سكر ١ كيلو', price: 35 },
      ],
    },
  ],
};

/** Final invoice shows short item names (no notes). */
export const finalItemName = (name: string) => name.replace(/\s*\(.*\)\s*/, '');

export const customerChatResponse: ApiList<ChatMessage> = {
  total: 4,
  data: [
    { id: 'c1', from: 'system', text: 'محمود قبل الأوردر · ٢:٣٠ م' },
    { id: 'c2', from: 'them', text: 'أهلاً يا أستاذ أحمد، أنا في الطريق لمشويات أبو علي' },
    { id: 'c3', from: 'me', text: 'تمام، ياريت الكفتة من غير بصل' },
    { id: 'c4', from: 'them', image: 'placeholder', imageCaption: 'صورة من المندوب', text: 'الفراخ المشوية خلصت، ينفع ربع فراخ بانيه بدلها؟' },
  ],
};

/** Text already typed in the composer in the design. */
export const customerChatDraft = 'ماشي، هات البانيه';

export const courierReviewsResponse: ApiItem<CourierReviews> = {
  data: {
    courierId: 7,
    total: 184,
    distribution: [
      { stars: 5, count: 162 },
      { stars: 4, count: 15 },
      { stars: 3, count: 4 },
      { stars: 2, count: 2 },
      { stars: 1, count: 1 },
    ],
    tags: [
      { label: 'سريع', count: 120 },
      { label: 'محترم', count: 95 },
      { label: 'الحاجة سليمة', count: 80 },
      { label: 'ردّ بسرعة', count: 64 },
    ],
    reviews: [
      { id: 1, initial: 'س', name: 'سارة م.', date: 'من يومين', stars: 5, text: 'جه بسرعة جداً وكان بيبعتلي صور الحاجة قبل ما يشتري. محترم جداً.' },
      { id: 2, initial: 'ع', name: 'عمر ح.', date: 'من ٤ أيام', stars: 5, text: 'الأكل وصل سخن، وكلّمني لما الصنف خلص بدل ما يجيب أي حاجة.' },
      { id: 3, initial: 'م', name: 'مها ع.', date: 'الأسبوع اللي فات', stars: 3, text: 'كويس بس اتأخر شوية عن الوقت اللي قاله.' },
      { id: 4, initial: 'خ', name: 'خالد ي.', date: 'من أسبوعين', stars: 5, text: 'أحسن مندوب اتعاملت معاه في التطبيق.' },
    ],
  },
};

/** 16-Delivered rating words (index = stars) and quick tags. */
export const RATING_WORDS = ['', 'وحش', 'مش أوي', 'كويس', 'حلو', 'ممتاز'] as const;
export const RATING_TAGS = ['سريع', 'محترم', 'الحاجة سليمة', 'ردّ عليا بسرعة'] as const;
