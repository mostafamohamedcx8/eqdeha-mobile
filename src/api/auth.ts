import { Platform } from 'react-native';

import { api } from './client';

/* ---------- types (mirror the backend DTOs) ---------- */

export type OtpSent = { message: string; expiresInSeconds: number; resendAfterSeconds: number };
export type OtpVerified = { verificationToken: string; expiresInSeconds: number };

export type UserProfile = {
  id: number;
  role: 'customer' | 'courier';
  name: string;
  phone: string;
  email?: string;
  gender?: 'male' | 'female';
  birthDate?: string;
  photoUrl?: string;
  status: string;
  createdAt?: string;
  /** Couriers only. */
  courier?: CourierInfo;
  /** false → a newer terms version exists; show it and call acceptTerms() */
  termsUpToDate?: boolean;
};

export type ApprovalStatus = 'pending' | 'needs_fix' | 'approved' | 'rejected';

export type CourierInfo = {
  address?: string;
  vehicleType?: string;
  vehicleColor?: string;
  plateNumber?: string;
  vehiclePhotoUrl?: string;
  approvalStatus: ApprovalStatus;
  /** the admin's note (rejected / needs_fix) */
  reviewNote?: string;
  walletNumber?: string;
  walletType?: string;
};

export type AuthResponse = {
  accessToken: string;
  tokenType: string;
  expiresAt: string;
  /** null = home; 'fix_application' = courier must fix the application (limited token); 'add_wallet' */
  nextStep: 'fix_application' | 'add_wallet' | null;
  user: UserProfile;
};

export type CustomerSignupInput = {
  verificationToken: string;
  fullName: string;
  password: string;
  /** yyyy-MM-dd */
  birthDate: string;
  gender: 'male' | 'female';
  email?: string;
  /** local image URI from the picker (optional) */
  photoUri?: string | null;
};

/** Backend wants +201XXXXXXXXX; screens keep the 10 digits after +20. */
const e164 = (phone10: string) => `+20${phone10}`;

/* ---------- login (customer and courier: same endpoint, the response says which) ---------- */

export async function login(phone10: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/api/v1/auth/login', { phone: e164(phone10), password });
  return data;
}

/** Current account (customer / approved courier). A needs_fix courier's limited token gets 403 here. */
export async function getMe(timeout = 8_000): Promise<UserProfile> {
  // short timeout: the splash waits for this; on failure the saved profile is used
  const { data } = await api.get<UserProfile>('/api/v1/auth/me', { timeout });
  return data;
}

/* ---------- signup steps 1–2 (same for customer and courier) ---------- */

export type SignupRole = 'customer' | 'courier';

/** `termsVersion` = the version of the terms the user agreed to (from GET /api/v1/terms). */
export async function signupSendOtp(role: SignupRole, phone10: string, termsVersion: number): Promise<OtpSent> {
  const { data } = await api.post<OtpSent>(`/api/v1/auth/${role}/signup/send-otp`, {
    phone: e164(phone10),
    acceptTerms: true,
    termsVersion,
  });
  return data;
}

export async function signupVerifyOtp(role: SignupRole, phone10: string, code: string): Promise<OtpVerified> {
  const { data } = await api.post<OtpVerified>(`/api/v1/auth/${role}/signup/verify-otp`, {
    phone: e164(phone10),
    code,
  });
  return data;
}

export const customerSendOtp = (phone10: string, termsVersion: number) => signupSendOtp('customer', phone10, termsVersion);
export const customerVerifyOtp = (phone10: string, code: string) => signupVerifyOtp('customer', phone10, code);

/* ---------- customer signup step 3 ---------- */

export async function customerCompleteSignup(input: CustomerSignupInput): Promise<AuthResponse> {
  const form = new FormData();
  form.append('verificationToken', input.verificationToken);
  form.append('fullName', input.fullName.trim());
  form.append('password', input.password);
  form.append('birthDate', input.birthDate);
  form.append('gender', input.gender);
  if (input.email?.trim()) form.append('email', input.email.trim());
  if (input.photoUri) await appendImage(form, 'photo', input.photoUri);

  const { data } = await api.post<AuthResponse>('/api/v1/auth/customer/signup/complete', form, multipart());
  return data;
}

/* ---------- courier signup step 3 ---------- */

export type VehicleType = 'motorcycle' | 'scooter' | 'bicycle' | 'car';
export type WalletType = 'vodafone_cash' | 'instapay';

export type CourierSignupInput = {
  verificationToken: string;
  fullName: string;
  password: string;
  /** yyyy-MM-dd */
  birthDate: string;
  address: string;
  walletType: WalletType;
  /** 01XXXXXXXXX, or name@instapay for InstaPay */
  walletNumber: string;
  vehicleType: VehicleType;
  vehicleColor: string;
  plateNumber?: string;
  /** local image URIs — all four are required */
  photoUri: string;
  idCardFrontUri: string;
  idCardBackUri: string;
  vehiclePhotoUri: string;
};

/** No token: the account stays pending until an admin approves it. */
export type CourierSignupResponse = { userId: number; status: string; approvalStatus: string; message: string };

export async function courierCompleteSignup(input: CourierSignupInput): Promise<CourierSignupResponse> {
  const form = new FormData();
  form.append('verificationToken', input.verificationToken);
  form.append('fullName', input.fullName.trim());
  form.append('password', input.password);
  form.append('birthDate', input.birthDate);
  form.append('address', input.address.trim());
  form.append('walletType', input.walletType);
  form.append('walletNumber', input.walletNumber.trim());
  form.append('vehicleType', input.vehicleType);
  form.append('vehicleColor', input.vehicleColor);
  if (input.plateNumber?.trim()) form.append('plateNumber', input.plateNumber.trim());
  await appendImage(form, 'photo', input.photoUri);
  await appendImage(form, 'idCardFront', input.idCardFrontUri);
  await appendImage(form, 'idCardBack', input.idCardBackUri);
  await appendImage(form, 'vehiclePhoto', input.vehiclePhotoUri);

  // four photos: allow more time than the default 30 s on slow connections
  const { data } = await api.post<CourierSignupResponse>('/api/v1/auth/courier/signup/complete', form, {
    ...multipart(),
    timeout: 120_000,
  });
  return data;
}

/* ---------- multipart helpers ---------- */

function multipart() {
  // Native: RN's networking adds the boundary itself. Web: let the browser set the whole header.
  return Platform.OS === 'web' ? {} : { headers: { 'Content-Type': 'multipart/form-data' }, transformRequest: (d: unknown) => d };
}

function mimeFromUri(uri: string): { type: string; ext: string } {
  const ext = uri.split('?')[0].split('.').pop()?.toLowerCase();
  if (ext === 'png') return { type: 'image/png', ext: 'png' };
  if (ext === 'webp') return { type: 'image/webp', ext: 'webp' };
  return { type: 'image/jpeg', ext: 'jpg' };
}

async function appendImage(form: FormData, field: string, uri: string) {
  if (Platform.OS === 'web') {
    // Web picker gives blob:/data: URLs → send the real file.
    const blob = await (await fetch(uri)).blob();
    const ext = blob.type.split('/')[1] ?? 'jpg';
    form.append(field, blob, `${field}.${ext}`);
    return;
  }
  const { type, ext } = mimeFromUri(uri);
  // React Native's FormData accepts { uri, name, type } for files.
  form.append(field, { uri, name: `${field}.${ext}`, type } as unknown as Blob);
}
