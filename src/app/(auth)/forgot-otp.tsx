import { router, useLocalSearchParams } from 'expo-router';

import { OtpScreen } from '@/features/auth/screens/OtpScreen';
import { goBack } from '@/utils/nav';

/** Forgot password 2/3: WhatsApp code. */
export default function ForgotOtp() {
  const { phone, role } = useLocalSearchParams<{ phone?: string; role?: string }>();
  return (
    <OtpScreen
      phone={phone}
      onBack={() => goBack('/forgot-password')}
      onChangeNumber={() => goBack('/forgot-password')}
      onConfirm={() => router.push({ pathname: '/reset-password', params: { role } })}
    />
  );
}
