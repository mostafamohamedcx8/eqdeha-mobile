import { useSyncExternalStore } from 'react';

/**
 * Local-only flag so pressing "قريت وموافق" on the Terms screen ticks the
 * checkbox on the phone screen you came from. (UI phase: no persistence.)
 */
let agreed = false;
const listeners = new Set<() => void>();

export function setTermsAgreed(value: boolean) {
  agreed = value;
  listeners.forEach((l) => l());
}

export function useTermsAgreed() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => agreed,
    // server render (web): always starts unticked
    () => false,
  );
}
