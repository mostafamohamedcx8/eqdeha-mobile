import { router, useLocalSearchParams } from 'expo-router';

import { customerSendOtp, customerVerifyOtp } from '@/api/auth';
import { useSignupDraft } from '@/features/auth/signupDraft';
import { OtpScreen } from '@/features/auth/screens/OtpScreen';
import { goBack } from '@/utils/nav';

/** 03-Otp — customer sign-up step 2: verify the WhatsApp code → verification token. */
export default function CustomerOtp() {
  const params = useLocalSearchParams<{ phone?: string }>();
  const draft = useSignupDraft();
  const phone = draft.phone ?? params.phone ?? '';

  return (
    <OtpScreen
      phone={phone}
      resendSeconds={draft.resendAfterSeconds}
      onBack={() => goBack('/phone')}
      onChangeNumber={() => goBack('/phone')}
      onResend={async () => {
        const sent = await customerSendOtp(phone, draft.termsVersion ?? 0);
        draft.setOtpSent(phone, sent.resendAfterSeconds, draft.termsVersion ?? 0);
        return sent.resendAfterSeconds;
      }}
      onConfirm={async (code) => {
        const verified = await customerVerifyOtp(phone, code);
        draft.setVerified(verified.verificationToken);
        router.push('/profile');
      }}
    />
  );
}
