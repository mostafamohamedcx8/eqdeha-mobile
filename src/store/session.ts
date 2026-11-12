import { create } from 'zustand';

import type { AuthResponse, UserProfile } from '@/api/auth';
import { secureStorage } from '@/utils/secureStorage';

const TOKEN_KEY = 'eqdeha.accessToken';
const USER_KEY = 'eqdeha.user';

type SessionState = {
  token: string | null;
  user: UserProfile | null;
  /** true once the stored session has been read at startup */
  hydrated: boolean;
  signIn: (auth: AuthResponse) => Promise<void>;
  /** Replace the stored profile (after GET /me, or after accepting new terms). */
  setUser: (user: UserProfile) => Promise<void>;
  signOut: () => Promise<void>;
  hydrate: () => Promise<void>;
};

/** Logged-in session. The JWT lives in secure storage, never in AsyncStorage. */
export const useSession = create<SessionState>((set) => ({
  token: null,
  user: null,
  hydrated: false,

  signIn: async (auth) => {
    await secureStorage.set(TOKEN_KEY, auth.accessToken);
    await secureStorage.set(USER_KEY, JSON.stringify(auth.user));
    set({ token: auth.accessToken, user: auth.user });
  },

  setUser: async (user) => {
    await secureStorage.set(USER_KEY, JSON.stringify(user));
    set({ user });
  },

  signOut: async () => {
    await secureStorage.remove(TOKEN_KEY);
    await secureStorage.remove(USER_KEY);
    set({ token: null, user: null });
  },

  hydrate: async () => {
    try {
      const [token, user] = await Promise.all([secureStorage.get(TOKEN_KEY), secureStorage.get(USER_KEY)]);
      set({ token, user: user ? (JSON.parse(user) as UserProfile) : null, hydrated: true });
    } catch {
      set({ hydrated: true });
    }
  },
}));
