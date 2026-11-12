import { create } from 'zustand';

import type { VehicleType, WalletType } from '@/api/auth';
import type { DateParts } from '@/utils/validation';

/** Courier step 3 (23-CInfo), kept until step 4 sends everything in one request. */
export type CourierInfoDraft = {
  photoUri: string;
  fullName: string;
  address: string;
  dob: DateParts;
  walletType: WalletType;
  walletNumber: string;
  password: string;
};

/** Courier step 4 (24-CVehicle), kept so a trip back to step 3 (backend error there) doesn't lose the photos. */
export type CourierVehicleDraft = {
  idFrontUri: string | null;
  idBackUri: string | null;
  vehicleType: VehicleType;
  vehicleColor: string;
  plateNumber: string;
  vehiclePhotoUri: string | null;
};

/** Fields of the courier info screen that the backend can reject. */
export type CourierInfoField = 'photo' | 'name' | 'address' | 'dob' | 'wallet' | 'password';

/**
 * In-memory state shared by the sign-up steps (phone → OTP → profile / courier info → vehicle).
 * The verification token and the password are kept here, not in route params, so they never end up in a URL.
 * Memory only: nothing here is written to storage.
 */
type SignupDraft = {
  /** 10 digits after +20 */
  phone: string | null;
  /** seconds to wait before "resend" is allowed, from the last send-otp response */
  resendAfterSeconds: number;
  /** terms version accepted on the phone screen (sent again on resend) */
  termsVersion: number | null;
  verificationToken: string | null;
  courierInfo: CourierInfoDraft | null;
  courierVehicle: CourierVehicleDraft | null;
  /**
   * Backend errors for fields on the courier info screen, found when step 4 was sent.
   * The info screen shows them and focuses the first one, then clears this.
   */
  courierInfoErrors: Partial<Record<CourierInfoField, string>> | null;
  setOtpSent: (phone: string, resendAfterSeconds: number, termsVersion: number) => void;
  setVerified: (verificationToken: string) => void;
  setCourierInfo: (info: CourierInfoDraft) => void;
  setCourierVehicle: (vehicle: CourierVehicleDraft) => void;
  setCourierInfoErrors: (errors: Partial<Record<CourierInfoField, string>> | null) => void;
  reset: () => void;
};

const empty = {
  phone: null,
  resendAfterSeconds: 60,
  termsVersion: null,
  verificationToken: null,
  courierInfo: null,
  courierVehicle: null,
  courierInfoErrors: null,
};

export const useSignupDraft = create<SignupDraft>((set) => ({
  ...empty,
  setOtpSent: (phone, resendAfterSeconds, termsVersion) =>
    set({ phone, resendAfterSeconds, termsVersion, verificationToken: null }),
  setVerified: (verificationToken) => set({ verificationToken }),
  setCourierInfo: (courierInfo) => set({ courierInfo }),
  setCourierVehicle: (courierVehicle) => set({ courierVehicle }),
  setCourierInfoErrors: (courierInfoErrors) => set({ courierInfoErrors }),
  reset: () => set(empty),
}));
