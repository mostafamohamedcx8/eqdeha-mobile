import { create } from 'zustand';

import { getCurrentTerms, type Terms, type TermsAudience } from '@/api/terms';
import type { Role } from '@/utils/nav';

export const audienceFor = (role: Role): TermsAudience => (role === 'courier' ? 'COURIER' : 'CUSTOMER');

type TermsState = {
  byAudience: Partial<Record<TermsAudience, Terms>>;
  /** Fetches the current version (always from the server, so a newly published version is picked up). */
  load: (audience: TermsAudience) => Promise<Terms>;
};

/** Current terms per audience, shared by the phone screen (sends its version) and the Terms screen (shows its text). */
export const useTermsStore = create<TermsState>((set) => ({
  byAudience: {},
  load: async (audience) => {
    const terms = await getCurrentTerms(audience);
    set((s) => ({ byAudience: { ...s.byAudience, [audience]: terms } }));
    return terms;
  },
}));
