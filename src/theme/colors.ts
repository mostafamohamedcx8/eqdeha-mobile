/**
 * Color tokens from CLAUDE.md. A few extra shades are taken verbatim from the
 * design HTML files (placeholder, disabled, tints) — never invent new ones.
 */
export const colors = {
  primary: '#0F4C5C',
  primaryLight: '#1A5E70',
  primaryDark: '#0A3540',
  primaryTint: '#E1EEF0',

  accent: '#FFB703',
  accentText: '#3A2A00',
  accentLight: '#FFF1CC',
  accentIcon: '#8A5A00',
  accentSoft: '#FFD15C',
  accentTextSoft: '#4A3600',

  background: '#F7F5F0',
  surface: '#FFFFFF',

  text: '#1F2A30',
  textMuted: '#5B6770',
  placeholder: '#8A949A',
  textOnPrimary: '#FFFFFF',
  textOnPrimaryMuted: '#CFE6EA',

  border: '#D9D6CE',
  divider: '#E6E2D8',
  dividerLight: '#EFECE4',
  swatchBorder: '#B8B4AA',

  disabledBg: '#E6E2D8',
  disabledText: '#6E6A61',

  success: '#2A9D8F',
  successBg: '#DDF1EE',
  successText: '#1B6B61',

  danger: '#E63946',
  dangerBg: '#FBE3E4',
  dangerText: '#A32D2D',
  dangerStrong: '#C1121F',
  /** Text on the red suspended banners (26/27/30). */
  dangerDeep: '#791F1F',
  /** Debt at the limit / cancel text on teal (26, 27, 30). */
  dangerSoft: '#FFB4B4',

  warningBg: '#FFF4D6',
  warningText: '#5C4300',

  /** Rating star outline when filled (16-Delivered). */
  starStroke: '#E0A000',
  /** Neutral chip/box background (#F1EFE8 in 12, 14, 19). */
  neutralBg: '#F1EFE8',
  /** Photo placeholder (chat / invoice photos in the design). */
  photoBg: '#E8DCCB',
  photoIcon: '#8A6A3A',
  photoText: '#6B5230',

  /** Lock-screen push preview (17-Notifications, dev only). */
  pushBg: '#F2F2F0',
  pushHint: '#B8C2C7',

  /** InstaPay badge (30-CWallet). */
  ipBg: '#EEEDFE',
  ipText: '#534AB7',

  /** GPS badge on the camera viewfinder (28-CInvoice). */
  gpsBadge: 'rgba(0,0,0,0.5)',

  /** Dark overlay behind a full-screen photo. */
  backdrop: 'rgba(0,0,0,0.75)',

  /** Map pin ground shadow (09-MapPick). */
  pinShadow: 'rgba(31,42,48,0.25)',
} as const;

export type ColorToken = keyof typeof colors;
