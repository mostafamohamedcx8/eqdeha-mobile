import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, ScreenContainer, Spacer } from '@/components/ui';
import { spacing } from '@/theme';
import { goBack } from '@/utils/nav';

import { AuthHeader } from '../components/AuthHeader';
import { PasswordPair, passwordPairValid } from '../components/PasswordPair';

/** Forgot password 3/3: new password + confirm. */
export default function ResetPasswordScreen() {
  const { role } = useLocalSearchParams<{ role?: string }>();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const save = () => {
    setSubmitted(true);
    if (!passwordPairValid(password, confirm)) return;
    // Back to the login screen with a success note; drop the forgot screens from history.
    router.dismissTo({ pathname: '/login', params: { role, reset: '1' } });
  };

  return (
    <ScreenContainer statusBar="light" paddingBottom={28}>
      <AuthHeader title="باسورد جديد" subtitle="اختار باسورد قوي وماتقولوش لحد" onBack={() => goBack('/forgot-password')} />
      <View style={styles.body}>
        <PasswordPair
          label="الباسورد الجديد"
          size="lg"
          password={password}
          confirm={confirm}
          onChangePassword={setPassword}
          onChangeConfirm={setConfirm}
          showErrors={submitted}
        />
        <Spacer />
        <Button title="حفظ الباسورد" onPress={save} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingTop: spacing.s28, paddingHorizontal: spacing.s24, gap: spacing.s18 },
});
