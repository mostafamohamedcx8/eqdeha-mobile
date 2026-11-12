import { create } from 'zustand';

import { customerChatDraft, customerChatResponse } from '@/mocks/orders';
import type { ChatMessage } from '@/mocks/types';

export type ThreadId = 'customer-1042' | 'courier-1042';

type Thread = { messages: ChatMessage[]; draft: string };

type ChatState = {
  threads: Record<string, Thread>;
  seed: (id: ThreadId, messages: ChatMessage[], draft?: string) => void;
  setDraft: (id: ThreadId, draft: string) => void;
  sendText: (id: ThreadId, text: string) => void;
  sendImage: (id: ThreadId, uri: string) => void;
  addSystem: (id: ThreadId, text: string, variant?: ChatMessage['variant'], invoice?: ChatMessage['invoice']) => void;
};

let seq = 0;
const newId = () => `m${Date.now()}-${seq++}`;

/** Chat threads (local only): messages you send are appended to the list. */
export const useChat = create<ChatState>((set, get) => ({
  threads: {
    'customer-1042': { messages: customerChatResponse.data, draft: customerChatDraft },
  },
  seed: (id, messages, draft = '') => {
    if (!get().threads[id]) set((s) => ({ threads: { ...s.threads, [id]: { messages, draft } } }));
  },
  setDraft: (id, draft) =>
    set((s) => ({ threads: { ...s.threads, [id]: { ...(s.threads[id] ?? { messages: [] }), draft } } })),
  sendText: (id, text) => {
    const t = text.trim();
    if (!t) return;
    set((s) => {
      const th = s.threads[id] ?? { messages: [], draft: '' };
      return { threads: { ...s.threads, [id]: { messages: [...th.messages, { id: newId(), from: 'me', text: t }], draft: '' } } };
    });
  },
  addSystem: (id, text, variant, invoice) =>
    set((s) => {
      const th = s.threads[id] ?? { messages: [], draft: '' };
      return { threads: { ...s.threads, [id]: { ...th, messages: [...th.messages, { id: newId(), from: 'system', text, variant, invoice }] } } };
    }),
  sendImage: (id, uri) =>
    set((s) => {
      const th = s.threads[id] ?? { messages: [], draft: '' };
      return { threads: { ...s.threads, [id]: { ...th, messages: [...th.messages, { id: newId(), from: 'me', image: uri }] } } };
    }),
}));
