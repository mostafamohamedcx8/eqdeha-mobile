import Constants from 'expo-constants';
import { Platform } from 'react-native';

const BACKEND_PORT = 8080;

/**
 * Backend base URL.
 * 1. `EXPO_PUBLIC_API_URL` (set it in `.env.local`, e.g. http://192.168.1.10:8080) — always wins.
 * 2. Dev fallback: the same machine that serves the JS bundle (Metro), port 8080. That is your PC's
 *    LAN IP on a phone with Expo Go, so the backend running on the PC is reachable without config.
 * 3. Last resort: localhost (web) / 10.0.2.2 (Android emulator → host PC).
 */
function resolveBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, '');

  if (Platform.OS === 'web') return `http://localhost:${BACKEND_PORT}`;

  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  if (host) return `http://${host}:${BACKEND_PORT}`;

  return Platform.OS === 'android' ? `http://10.0.2.2:${BACKEND_PORT}` : `http://localhost:${BACKEND_PORT}`;
}

export const API_BASE_URL = resolveBaseUrl();

/** Backend file paths come back relative (e.g. /files/public/categories/x.png) → absolute URL for <Image>. */
export function fileUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}
