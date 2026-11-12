import { Alert, Platform } from 'react-native';

/**
 * Popup for problems that don't belong to one field (no internet, server error, expired step…).
 * Field problems are shown under the field instead (see useFormFocus).
 * react-native-web's Alert does nothing, so web uses window.alert.
 */
export function showErrorPopup(message: string, title = 'حصلت مشكلة', onClose?: () => void) {
  if (Platform.OS === 'web') {
    globalThis.alert?.(`${title}\n\n${message}`);
    onClose?.();
    return;
  }
  Alert.alert(title, message, [{ text: 'تمام', onPress: onClose }], { cancelable: true, onDismiss: onClose });
}

/** Yes/no question before something that can't be undone (cancel order...). */
export function confirmAction(title: string, message: string, confirmText: string, onConfirm: () => void) {
  if (Platform.OS === 'web') {
    if (globalThis.confirm?.(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: 'لأ', style: 'cancel' },
    { text: confirmText, style: 'destructive', onPress: onConfirm },
  ]);
}

/** Short info popup. */
export function showInfo(title: string, message: string) {
  if (Platform.OS === 'web') {
    globalThis.alert?.(`${title}\n\n${message}`);
    return;
  }
  Alert.alert(title, message, [{ text: 'تمام' }]);
}
