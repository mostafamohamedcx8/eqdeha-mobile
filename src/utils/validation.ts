/** Converts Arabic-Indic (٠-٩) and Persian (۰-۹) digits to 0-9. */
export function toLatinDigits(s: string): string {
  return s
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

export function onlyDigits(s: string): string {
  return toLatinDigits(s).replace(/\D/g, '');
}

/**
 * Egyptian mobile, the part after +20: 10 digits starting with 10/11/12/15.
 * A leading 0 (01xxxxxxxxx) is accepted and dropped.
 */
export function normalizeEgPhone(raw: string): string {
  const d = onlyDigits(raw);
  return d.startsWith('0') ? d.slice(1) : d;
}

export function isValidEgPhone(raw: string): boolean {
  return /^1[0125]\d{8}$/.test(normalizeEgPhone(raw));
}

/** "1012345678" → "10 1234 5678" */
export function formatEgPhone(raw: string): string {
  const d = normalizeEgPhone(raw);
  return [d.slice(0, 2), d.slice(2, 6), d.slice(6, 10)].filter(Boolean).join(' ');
}

/** Wallet numbers are written with the leading 0: 01X XXXX XXXX */
export function isValidWallet(raw: string): boolean {
  return /^01[0125]\d{8}$/.test(onlyDigits(raw));
}

/** InstaPay address, e.g. name@instapay (same rule as the backend). */
export function isValidInstapayAddress(raw: string): boolean {
  return /^[a-z0-9._-]{3,50}@instapay$/.test(raw.trim().toLowerCase());
}

/** Vodafone Cash: 01XXXXXXXXX. InstaPay: the same, or name@instapay. */
export function walletError(type: 'vodafone_cash' | 'instapay', raw: string): string | null {
  if (!raw.trim()) return 'اكتب رقم محفظتك';
  if (isValidWallet(raw)) return null;
  if (type === 'instapay') {
    return isValidInstapayAddress(raw) ? null : 'اكتب رقم موبايل ١١ رقم يبدأ بـ 01، أو عنوان إنستاباي زي name@instapay';
  }
  return 'رقم المحفظة لازم يكون ١١ رقم ويبدأ بـ 01';
}

export function phoneError(raw: string): string | null {
  if (!onlyDigits(raw)) return 'اكتب رقم موبايلك';
  if (!isValidEgPhone(raw)) return 'رقم الموبايل مش صحيح، لازم يبدأ بـ 10 أو 11 أو 12 أو 15';
  return null;
}

export function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());
}

export function requiredError(value: string, message: string): string | null {
  return value.trim() ? null : message;
}

export function fullNameError(value: string): string | null {
  const v = value.trim();
  if (!v) return 'اكتب اسمك';
  if (v.split(/\s+/).length < 2) return 'اكتب اسمك الأول واسم الأب على الأقل';
  return null;
}

/* ---------- Date of birth (separate day / month / year boxes) ---------- */

/** Digits only (0-9), as typed in the three DateField boxes. */
export type DateParts = { day: string; month: string; year: string };

export const emptyDate: DateParts = { day: '', month: '', year: '' };

/** { day: '5', month: '3', year: '1998' } → "1998-03-05" (the format the backend expects). Assumes dobError() passed. */
export function dobToIso({ day, month, year }: DateParts): string {
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

export function dobError({ day: d, month: mo, year: y }: DateParts, minAge = 0): string | null {
  if (!d && !mo && !y) return 'اكتب تاريخ ميلادك';
  if (!d) return 'اكتب يوم الميلاد';
  if (!mo) return 'اكتب شهر الميلاد';
  if (y.length !== 4) return 'اكتب سنة الميلاد كاملة (٤ أرقام)';
  const [day, month, year] = [Number(d), Number(mo), Number(y)];
  if (month < 1 || month > 12) return 'الشهر لازم يكون من ١ لـ ١٢';
  if (day < 1 || day > 31) return 'اليوم لازم يكون من ١ لـ ٣١';
  const date = new Date(year, month - 1, day);
  const valid = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  const now = new Date();
  if (!valid || year < 1900 || date > now) return 'التاريخ ده مش صحيح';
  if (minAge) {
    const limit = new Date(year + minAge, month - 1, day);
    if (limit > now) return `لازم يكون سنك ${minAge} سنة أو أكتر`;
  }
  return null;
}

/* ---------- Password ---------- */

export type PasswordRule = { key: string; label: string; test: (p: string) => boolean };

export const passwordRules: PasswordRule[] = [
  { key: 'length', label: '٨ حروف أو أرقام على الأقل', test: (p) => p.length >= 8 },
  { key: 'letter', label: 'فيه حروف', test: (p) => /\p{L}/u.test(p) },
  { key: 'number', label: 'فيه أرقام', test: (p) => /[0-9٠-٩]/.test(p) },
  { key: 'special', label: 'فيه رمز زي @ # ! $', test: (p) => /[^\p{L}\p{N}\s]/u.test(p) },
];

export function isStrongPassword(p: string): boolean {
  return passwordRules.every((r) => r.test(p));
}

export function passwordError(p: string): string | null {
  if (!p) return 'اكتب الباسورد';
  if (!isStrongPassword(p)) return 'الباسورد لسه مش مكمّل الشروط اللي تحت';
  return null;
}

export function confirmPasswordError(p: string, confirm: string): string | null {
  if (!confirm) return 'اكتب الباسورد تاني للتأكيد';
  if (p !== confirm) return 'الباسوردين مش زي بعض';
  return null;
}

export function otpError(code: string): string | null {
  return /^\d{6}$/.test(code) ? null : 'اكتب الكود كامل (٦ أرقام)';
}

/* ---------- Vehicle plate ---------- */

export const PLATE_MAX_LENGTH = 8;

/**
 * Plate number as typed: letters (Arabic or English) and digits only — no
 * spaces or symbols — up to 8 characters. "س ع د ١٢٣" → "سعد١٢٣".
 */
export function sanitizePlate(raw: string): string {
  return Array.from(raw.replace(/[^\p{L}\p{Nd}]/gu, '')).slice(0, PLATE_MAX_LENGTH).join('');
}
