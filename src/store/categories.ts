import { create } from 'zustand';

import { getCategories, type Category } from '@/api/catalog';
import { errorMessage } from '@/api/client';

type CategoriesState = {
  items: Category[] | null;
  loading: boolean;
  /** Arabic message of the last failed load (null after a success) */
  error: string | null;
  /** Fetches the list; the last good list stays visible while refreshing or if a refresh fails. */
  load: () => Promise<void>;
};

/** Shop categories from the backend, shared by Home and (later) the Shops screen. */
export const useCategories = create<CategoriesState>((set, get) => ({
  items: null,
  loading: false,
  error: null,
  load: async () => {
    if (get().loading) return;
    set({ loading: true });
    try {
      set({ items: await getCategories(), error: null });
    } catch (e) {
      set({ error: errorMessage(e) });
    } finally {
      set({ loading: false });
    }
  },
}));
