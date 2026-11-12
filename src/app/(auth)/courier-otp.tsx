import { router, useLocalSearchParams } from 'expo-router';

import { signupSendOtp, signupVerifyOtp } from '@/api/auth';
import { OtpScreen } from '@/features/auth/screens/OtpScreen';
import { useSignupDraft } from '@/features/auth/signupDraft';
import { goBack } from '@/utils/nav';

/** 22-COtp — courier sign-up step 2: verify the WhatsApp code → verification token. */
export default function CourierOtp() {
  const params = useLocalSearchParams<{ phone?: string }>();
  const draft = useSignupDraft();
  const phone = draft.phone ?? params.phone ?? '';

  return (
    <OtpScreen
      phone={phone}
      resendSeconds={draft.resendAfterSeconds}
      onBack={() => goBack('/courier-phone')}
      onChangeNumber={() => goBack('/courier-phone')}
      onResend={async () => {
        const sent = await signupSendOtp('courier', phone, draft.termsVersion ?? 0);
        draft.setOtpSent(phone, sent.resendAfterSeconds, draft.termsVersion ?? 0);
        return sent.resendAfterSeconds;
      }}
      onConfirm={async (code) => {
        const verified = await signupVerifyOtp('courier', phone, code);
        draft.setVerified(verified.verificationToken);
        router.push('/courier-info');
      }}
    />
  );
}
