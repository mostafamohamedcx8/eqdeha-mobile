import type { Address, ApiItem, CustomerDetails, CustomerProfile, MapPlace, PointsSummary } from './types';

export const meResponse: ApiItem<CustomerProfile> = {
  data: {
    id: 1,
    fullName: 'أحمد محمد علي',
    firstName: 'أحمد',
    phone: '1012345678',
    email: 'ahmed@gmail.com',
    photoUrl: null,
    points: 120,
    unreadNotifications: 2,
    memberSince: 'نوفمبر',
    ordersCount: 12,
  },
};

/** Ezbet Sekina area (sample coordinates). */
export const AREA_CENTER = { lat: 30.0726, lng: 31.2457 };

export const addressesResponse: ApiItem<Address[]> = {
  data: [
    {
      id: 1,
      label: 'البيت',
      street: 'ش. الجمهورية',
      details: 'عمارة ١٢، الدور ٣',
      building: '١٢',
      floor: '٣',
      apartment: '٥',
      lat: AREA_CENTER.lat,
      lng: AREA_CENTER.lng,
    },
    {
      id: 2,
      label: 'الشغل',
      street: 'ش. النصر',
      details: 'عمارة ٤، الدور ١',
      building: '٤',
      floor: '١',
      lat: AREA_CENTER.lat + 0.002,
      lng: AREA_CENTER.lng + 0.0015,
    },
  ],
};

/** Editable profile details (18-Account). */
export const customerDetailsResponse: ApiItem<CustomerDetails> = {
  data: {
    fullName: 'أحمد محمد علي',
    email: 'ahmed@gmail.com',
    dob: { day: '12', month: '4', year: '1995' },
    gender: 'male',
    secondPhone: '',
    photoUri: null,
  },
};

/** Where the map pin lands (sample reverse-geocode result). */
export const pinPlaceResponse: ApiItem<MapPlace> = {
  data: { title: 'ش. الجمهورية', subtitle: 'ش. الجمهورية، قدام جنينة الحي', lat: AREA_CENTER.lat, lng: AREA_CENTER.lng },
};

/** Sample pickup place for "اطلب أي حاجة" → "أحدد من الخريطة". */
export const samplePickupPlace = 'كشك عم محمد – ناصية ش. النصر';

export const pointsResponse: ApiItem<PointsSummary> = {
  data: {
    balance: 120,
    goal: 1000,
    rewardEgp: 20,
    rules: [
      { label: 'كل أوردر بيتسلّم', value: '+١٠ نقاط' },
      { label: 'لما تقيّم المندوب', value: '+٢ نقطة' },
      { label: 'هدايا من الإدارة في المواسم', value: 'حسب العرض' },
    ],
    history: [
      { id: 1, title: 'أوردر #١٠٤٢', when: 'النهارده', points: 10 },
      { id: 2, title: 'قيّمت المندوب', when: 'النهارده', points: 2 },
      { id: 3, title: 'أوردر #١٠٤٠', when: 'أمس', points: 10 },
    ],
  },
};

/** Dev-only preview balances from the design's toggle (١٢٠ / ١٠٤٠). */
export const POINTS_PREVIEW = [120, 1040] as const;
