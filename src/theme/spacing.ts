/** Spacing scale (px) used across the designs. */
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 6,
  md: 8,
  ml: 10,
  lg: 12,
  xl: 14,
  xxl: 16,
  s18: 18,
  s20: 20,
  s24: 24,
  s28: 28,
  s32: 32,
} as const;

/** Corner radii from CLAUDE.md + design files. */
export const radii = {
  sm: 9,
  md: 12,
  input: 14,
  button: 16,
  card: 18,
  cardLg: 22,
  header: 28,
  headerLg: 36,
  pill: 999,
} as const;

/** Control heights. */
export const sizes = {
  button: 56,
  buttonSm: 52,
  input: 52,
  inputLg: 54,
  backButton: 44,
} as const;

/** The design canvas is 390x844 (iPhone 12/13); its top padding includes a 47px status bar. */
export const DESIGN_STATUS_BAR = 47;
export const DESIGN_HOME_INDICATOR = 34;
