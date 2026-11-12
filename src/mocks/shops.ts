import type { ApiList, Shop, ShopCategory } from './types';

export const categoriesResponse: ApiList<ShopCategory> = {
  total: 8,
  data: [
    { id: 'grill', name: 'مشويات', icon: 'grill', bg: '#FDEBDD', fg: '#B4471B' },
    { id: 'pharmacy', name: 'صيدليات', icon: 'pharmacy', bg: '#E1EEF0', fg: '#0F4C5C' },
    { id: 'market', name: 'سوبر ماركت', icon: 'market', bg: '#FFF1CC', fg: '#8A5A00' },
    { id: 'veggies', name: 'خضار وفاكهة', icon: 'veggies', bg: '#E3F1DF', fg: '#3B6D11' },
    { id: 'fish', name: 'أسماك', icon: 'fish', bg: '#DDEFF7', fg: '#185FA5' },
    { id: 'butcher', name: 'جزارة', icon: 'butcher', bg: '#FBE3E4', fg: '#A32D2D' },
    { id: 'clothes', name: 'ملابس', icon: 'clothes', bg: '#EEEDFE', fg: '#534AB7' },
    { id: 'bakery', name: 'مخبوزات', icon: 'bakery', bg: '#F5EBDD', fg: '#854F0B' },
  ],
};

export const streetsResponse: ApiList<string> = {
  total: 3,
  data: ['ش. الجمهورية', 'ش. النصر', 'ش. المدارس'],
};

export const shopsResponse: ApiList<Shop> = {
  total: 8,
  data: [
    { id: 1, name: 'مشويات أبو علي', categoryId: 'grill', street: 'ش. الجمهورية', open: true, hours: 'مفتوح لحد ١٢ بالليل', orderHint: 'مثلاً: نص كيلو كفتة ورُبع فراخ مشوية وعيش' },
    { id: 2, name: 'صيدلية الشفاء', categoryId: 'pharmacy', street: 'ش. النصر', open: true, hours: 'مفتوح ٢٤ ساعة', orderHint: 'مثلاً: علبة بنادول وشريط فيتامين سي' },
    { id: 3, name: 'سوبر ماركت الأمانة', categoryId: 'market', street: 'ش. الجمهورية', open: true, hours: 'مفتوح لحد ٢ بالليل', orderHint: 'مثلاً: ٢ لبن، كيس سكر، وزيت عباد الشمس' },
    { id: 4, name: 'فكهاني الحاج سيد', categoryId: 'veggies', street: 'ش. المدارس', open: true, hours: 'مفتوح لحد ١١ بالليل', orderHint: 'مثلاً: كيلو طماطم وكيلو موز' },
    { id: 5, name: 'أسماك البحر', categoryId: 'fish', street: 'ش. النصر', open: false, hours: 'بيفتح الساعة ١ الضهر', orderHint: 'مثلاً: كيلو بلطي وسلطة طحينة' },
    { id: 6, name: 'جزارة الإخلاص', categoryId: 'butcher', street: 'ش. المدارس', open: true, hours: 'مفتوح لحد ١٠ بالليل', orderHint: 'مثلاً: كيلو لحمة مفرومة' },
    { id: 7, name: 'ملابس النور', categoryId: 'clothes', street: 'ش. الجمهورية', open: false, hours: 'بيفتح الساعة ١١ الصبح', orderHint: 'مثلاً: تيشيرت قطن مقاس L' },
    { id: 8, name: 'مخبز العيلة', categoryId: 'bakery', street: 'ش. المدارس', open: true, hours: 'مفتوح لحد ٩ بالليل', orderHint: 'مثلاً: ١٠ أرغفة عيش بلدي' },
  ],
};

export const categoryById = (id: string) => categoriesResponse.data.find((c) => c.id === id);
export const shopById = (id: number) => shopsResponse.data.find((s) => s.id === id);

/** Shop tile letter, like the design: the name without its category word and "ال". */
export function shopInitial(name: string): string {
  const prefixes = ['مشويات ', 'صيدلية ', 'سوبر ماركت ', 'فكهاني ', 'أسماك ', 'جزارة ', 'ملابس ', 'مخبز '];
  let n = name;
  for (const p of prefixes) n = n.replace(p, '');
  return n.replace('ال', '').charAt(0);
}

/** Delivery pricing from the design: 15 for the first shop, +5 for each extra one, max 5 shops. */
export const DELIVERY = { base: 15, perExtraShop: 5, maxShops: 5, minOffer: 10, maxOffer: 100, offerStep: 5 } as const;
