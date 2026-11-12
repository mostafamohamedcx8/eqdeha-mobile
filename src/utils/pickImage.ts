import * as ImagePicker from 'expo-image-picker';
import { Alert, Linking, Platform } from 'react-native';

export type ImageSource = 'camera' | 'gallery' | 'both';

type Options = {
  source: ImageSource;
  /** Front camera for selfies. */
  front?: boolean;
  aspect?: [number, number];
};

async function fromCamera({ front, aspect }: Options): Promise<string | null> {
  const perm = await ImagePicker.requestCameraPermissionsAsync();
  if (!perm.granted) {
    Alert.alert('محتاجين الكاميرا', 'افتح إذن الكاميرا من الإعدادات عشان تقدر تصوّر.', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'الإعدادات', onPress: () => Linking.openSettings() },
    ]);
    return null;
  }
  const res = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    quality: 0.7,
    allowsEditing: !!aspect,
    aspect,
    cameraType: front ? ImagePicker.CameraType.front : ImagePicker.CameraType.back,
  });
  return res.canceled ? null : (res.assets[0]?.uri ?? null);
}

async function fromGallery({ aspect }: Options): Promise<string | null> {
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.7,
    allowsEditing: !!aspect,
    aspect,
  });
  return res.canceled ? null : (res.assets[0]?.uri ?? null);
}

/** Opens the camera / gallery (or asks which one) and returns the picked image URI. */
export function pickImage(opts: Options): Promise<string | null> {
  // No camera on web — fall back to a file picker.
  if (opts.source === 'gallery' || Platform.OS === 'web') return fromGallery(opts);
  if (opts.source === 'camera') return fromCamera(opts);

  return new Promise((resolve) => {
    Alert.alert(
      'اختار الصورة منين',
      undefined,
      [
        { text: 'الكاميرا', onPress: () => fromCamera(opts).then(resolve) },
        { text: 'المعرض', onPress: () => fromGallery(opts).then(resolve) },
        { text: 'إلغاء', style: 'cancel', onPress: () => resolve(null) },
      ],
      { cancelable: true, onDismiss: () => resolve(null) },
    );
  });
}
