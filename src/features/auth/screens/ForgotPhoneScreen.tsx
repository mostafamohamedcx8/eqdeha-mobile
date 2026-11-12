import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { WhatsappIcon } from '@/components/icons';
import { Button, PhoneField, ScreenContainer, Spacer } from '@/components/ui';
import { colors, spacing } from '@/theme';
import { goBack } from '@/utils/nav';
import { normalizeEgPhone, phoneError } from '@/utils/validation';

import { AuthHeader } from '../components/AuthHeader';

/** Forgot password 1/3: phone number (same style as 00c-Login). */
export default function ForgotPhoneScreen() {
  const { role } = useLocalSearchParams<{ role?: string }>();
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const send = () => {
    setSubmitted(true);
    if (phoneError(phone)) return;
    router.push({ pathname: '/forgot-otp', params: { phone: normalizeEgPhone(phone), role } });
  };

  return (
    <ScreenContainer statusBar="light" paddingBottom={28}>
      <AuthHeader
        title="نسيت الباسورد؟"
        subtitle="اكتب رقمك وهنبعتلك كود على واتساب تعمل بيه باسورد جديد"
        onBack={() => goBack('/login')}
      />
      <View style={styles.body}>
        <PhoneField value={phone} onChangeText={setPhone} error={submitted ? phoneError(phone) : null} autoFocus onSubmitEditing={send} />
        <Spacer />
        <Button title="ابعتلي الكود على واتساب" icon={<WhatsappIcon color={colors.accentText} />} onPress={send} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingTop: spacing.s28, paddingHorizontal: spacing.s24, gap: spacing.s18 },
});
