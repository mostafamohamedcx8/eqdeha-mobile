import axios, { AxiosError } from 'axios';

import { useSession } from '@/store/session';

import { API_BASE_URL } from './config';

/** Error body of every backend endpoint. `message` is already Egyptian Arabic — show it as-is. */
export type ApiErrorBody = {
  code: string;
  message: string;
  fieldErrors?: { field: string; message: string }[];
  timestamp?: string;
};

/** What every API call rejects with. */
export class ApiError extends Error {
  readonly code: string;
  readonly status: number | null;
  /** field name (as the backend names it, e.g. "fullName") → Arabic message */
  readonly fieldErrors: Record<string, string>;

  constructor(code: string, message: string, status: number | null, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.code = code;
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

const NETWORK_MESSAGE = 'مش قادرين نوصل للسيرفر، اتأكد إن النت شغال وجرب تاني';
const UNKNOWN_MESSAGE = 'حصلت مشكلة، جرب تاني بعد شوية';

// eslint-disable-next-line import/no-named-as-default-member -- axios.create is the documented API
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = useSession.getState().token;
  if (token && !config.headers.Authorization) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<ApiErrorBody>) => {
    const body = err.response?.data;
    if (body && typeof body === 'object' && body.code) {
      const fields: Record<string, string> = {};
      for (const f of body.fieldErrors ?? []) if (!fields[f.field]) fields[f.field] = f.message;
      return Promise.reject(new ApiError(body.code, body.message, err.response?.status ?? null, fields));
    }
    if (!err.response) return Promise.reject(new ApiError('NETWORK_ERROR', NETWORK_MESSAGE, null));
    return Promise.reject(new ApiError('UNKNOWN', UNKNOWN_MESSAGE, err.response.status));
  },
);

/** Arabic message for anything thrown by an API call. */
export function errorMessage(e: unknown): string {
  return e instanceof ApiError ? e.message : UNKNOWN_MESSAGE;
}
