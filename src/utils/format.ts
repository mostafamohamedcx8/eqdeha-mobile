const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';

/** 120 → "١٢٠" (Arabic-Indic digits, like the design). */
export function ar(value: number | string): string {
  return String(value).replace(/[0-9]/g, (d) => AR_DIGITS[Number(d)]);
}

/** 15 → "١٥ ج" */
export function money(value: number): string {
  return `${ar(value)} ج`;
}

/** 5 → "+٥ ج" */
export function moneyPlus(value: number): string {
  return `+${ar(value)} ج`;
}

/** "1042" → "#١٠٤٢" */
export function orderNo(id: string | number): string {
  return `#${ar(id)}`;
}

/** 4.8 → "٤٫٨" */
export function rating(value: number): string {
  return ar(value.toFixed(1)).replace('.', '٫');
}
