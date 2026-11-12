import { api } from './client';

export type TermsAudience = 'CUSTOMER' | 'COURIER';

export type Terms = {
  id: number;
  audience: TermsAudience;
  version: number;
  /** Arabic text. A line starting with "## " is a section title; the lines after it are its body. */
  content: string;
  publishedAt: string;
};

export type TermsStatus = { termsUpToDate: boolean; currentTermsVersionId: number; currentVersion: number };

/** Public — shown before sign-up. */
export async function getCurrentTerms(audience: TermsAudience): Promise<Terms> {
  const { data } = await api.get<Terms>('/api/v1/terms', { params: { audience } });
  return data;
}

/** Logged in: accept the current version after login / me returned termsUpToDate = false. */
export async function acceptTerms(termsVersionId: number): Promise<TermsStatus> {
  const { data } = await api.post<TermsStatus>('/api/v1/terms/accept', { termsVersionId });
  return data;
}

export type TermsSection = { title: string; body: string };

/** Splits the server text into the cards the Terms screen shows. */
export function parseTerms(content: string): TermsSection[] {
  const sections: TermsSection[] = [];
  let current: { title: string; lines: string[] } | null = null;
  for (const raw of content.split(/\r?\n/)) {
    const line = raw.trim();
    if (line.startsWith('## ')) {
      if (current) sections.push({ title: current.title, body: current.lines.join('\n').trim() });
      current = { title: line.slice(3).trim(), lines: [] };
    } else if (current) {
      current.lines.push(line);
    } else if (line) {
      current = { title: '', lines: [line] };
    }
  }
  if (current) sections.push({ title: current.title, body: current.lines.join('\n').trim() });
  return sections;
}
