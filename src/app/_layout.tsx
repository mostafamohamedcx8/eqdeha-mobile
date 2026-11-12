import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { I18nManager, Platform, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DirectionView } from '@/components/ui';
import { colors, fontAssets } from '@/theme';

// Arabic app: force RTL. In standalone/dev builds this sticks after the first
// launch. Expo Go resets it, so the root is also wrapped in <DirectionView dir="rtl">
// (Yoga `direction` on native, HTML `dir` on web) — RTL everywhere, Expo Go included.
if (Platform.OS !== 'web' && !I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts(fontAssets);

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <DirectionView dir="rtl" style={styles.root}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            // Native RTL already mirrors the push animation; in Expo Go (LTR native) mirror it ourselves.
            animation: I18nManager.isRTL ? 'default' : 'slide_from_left',
          }}>
          <Stack.Screen name="(auth)/index" options={{ animation: 'fade' }} />
          <Stack.Screen name="(customer)/(tabs)" options={{ animation: 'fade', gestureEnabled: false }} />
          <Stack.Screen name="(courier)/(tabs)" options={{ animation: 'fade', gestureEnabled: false }} />
        </Stack>
      </DirectionView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
});
