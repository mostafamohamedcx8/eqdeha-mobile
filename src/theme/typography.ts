import {
  Cairo_400Regular,
  Cairo_600SemiBold,
  Cairo_700Bold,
  Cairo_800ExtraBold,
} from '@expo-google-fonts/cairo';

/** Cairo weights used by the design (400, 600, 700, 800). */
export const fontAssets = {
  Cairo_400Regular,
  Cairo_600SemiBold,
  Cairo_700Bold,
  Cairo_800ExtraBold,
};

export const fonts = {
  regular: 'Cairo_400Regular',
  semibold: 'Cairo_600SemiBold',
  bold: 'Cairo_700Bold',
  extrabold: 'Cairo_800ExtraBold',
} as const;

export type FontWeight = keyof typeof fonts;

/** Font sizes that appear in the design files. */
export const fontSize = {
  xs: 11,
  sm: 12,
  body2: 13,
  body: 14,
  md: 15,
  lg: 16,
  xl: 17,
  h4: 18,
  h3: 20,
  h2: 22,
  h1: 24,
  title: 26,
  display: 30,
  hero: 34,
  splash: 40,
} as const;
