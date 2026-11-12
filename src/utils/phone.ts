import * as Clipboard from 'expo-clipboard';
import { Linking } from 'react-native';

import { ar } from './format';
import { showErrorPopup, showInfo } from './alert';

/** "01122334455" → "٠١١ ٢٢٣٣ ٤٤٥٥" (shown LTR). */
export function formatLocalPhone(d: string, arabic = true): string {
  const s = `${d.slice(0, 3)} ${d.slice(3, 7)} ${d.slice(7)}`.trim();
  return arabic ? ar(s) : s;
}

/** Opens the phone dialer. */
export async function callPhone(number: string) {
  try {
    await Linking.openURL(`tel:${number}`);
  } catch {
    showErrorPopup('مش قادرين نفتح الاتصال من الجهاز ده.');
  }
}

export async function copyText(text: string, what = 'الرقم') {
  await Clipboard.setStringAsync(text);
  showInfo('اتنسخ', `${what} اتنسخ، تقدر تلزقه في تطبيق المحفظة.`);
}
