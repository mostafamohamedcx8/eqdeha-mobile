import { Circle, Path, Rect } from 'react-native-svg';

import type { CategoryIcon as CategoryIconKey } from '@/mocks/types';

import { Line } from './icons';

/** The icon keys this app can draw. The admin picks one of these as a category's `iconKey`. */
export const CATEGORY_ICON_KEYS: readonly CategoryIconKey[] = [
  'grill',
  'pharmacy',
  'market',
  'veggies',
  'fish',
  'butcher',
  'clothes',
  'bakery',
];

export function isCategoryIconKey(key: string | null | undefined): key is CategoryIconKey {
  return !!key && (CATEGORY_ICON_KEYS as readonly string[]).includes(key);
}

/** Shop category icons from 05-Home (28px, stroke 1.8). */
export function CategoryIcon({ icon, color, size = 28 }: { icon: CategoryIconKey; color: string; size?: number }) {
  const p = { size, color, strokeWidth: 1.8 };
  switch (icon) {
    case 'grill':
      return (
        <Line {...p}>
          <Path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-3.5 2-6 1.5 1 2.5 2.5 2.5 4.5C13 10 13 6 12 3z" />
        </Line>
      );
    case 'pharmacy':
      return (
        <Line {...p}>
          <Rect x="4" y="4" width="16" height="16" rx="4" />
          <Path d="M12 8v8M8 12h8" />
        </Line>
      );
    case 'market':
      return (
        <Line {...p}>
          <Path d="M3 4h2l2.4 11h10.2L20 7H6.2" />
          <Circle cx="9" cy="19" r="1.5" />
          <Circle cx="17" cy="19" r="1.5" />
        </Line>
      );
    case 'veggies':
      return (
        <Line {...p}>
          <Path d="M12 8c-4-2-8 1-7 6 1 4 4 7 7 5 3 2 6-1 7-5 1-5-3-8-7-6z" />
          <Path d="M12 8c0-2 1-4 3-5" />
        </Line>
      );
    case 'fish':
      return (
        <Line {...p}>
          <Path d="M3 12c3-4 8-5 12-3l5-3v12l-5-3c-4 2-9 1-12-3z" />
          <Circle cx="8" cy="11.5" r="0.8" />
        </Line>
      );
    case 'butcher':
      return (
        <Line {...p}>
          <Path d="M14 4a6 6 0 0 1 4 10l-6 6-3-3 1-2-2-2-2 1-1.5-1.5A6 6 0 0 1 14 4z" />
          <Circle cx="14" cy="10" r="2" />
        </Line>
      );
    case 'clothes':
      return (
        <Line {...p}>
          <Path d="M8 4l4 2 4-2 4 4-3 3v9H7v-9L4 8z" />
        </Line>
      );
    case 'bakery':
      return (
        <Line {...p}>
          <Path d="M5 11a4 4 0 0 1 1-7.5C8 3 9.5 4 12 4s4-1 6-.5A4 4 0 0 1 19 11v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" />
          <Path d="M10 9l-1 3M15 9l-1 3" />
        </Line>
      );
  }
}
