import * as Location from 'expo-location';
import { Platform } from 'react-native';

import type { LatLng } from '@/components/map/types';
import { pinPlaceResponse } from '@/mocks/customer';
import type { MapPlace } from '@/mocks/types';

import { showErrorPopup } from './alert';

/** Current position, asking for permission first. null if refused / unavailable. */
export async function getMyLocation(): Promise<LatLng | null> {
  const perm = await Location.requestForegroundPermissionsAsync();
  if (!perm.granted) {
    showErrorPopup('افتح إذن الموقع من الإعدادات عشان نحدد مكانك.', 'محتاجين الموقع');
    return null;
  }
  try {
    const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    return { lat: pos.coords.latitude, lng: pos.coords.longitude };
  } catch {
    showErrorPopup('مقدرناش نحدد مكانك دلوقتي، جرّب تاني أو حرّك الخريطة.');
    return null;
  }
}

/** Street name under the pin (device geocoder). Falls back to sample data on web / errors. */
export async function placeAt(p: LatLng): Promise<MapPlace> {
  if (Platform.OS === 'web') return { ...pinPlaceResponse.data, ...p };
  try {
    const [a] = await Location.reverseGeocodeAsync({ latitude: p.lat, longitude: p.lng });
    if (!a) return { ...pinPlaceResponse.data, ...p };
    const street = a.street ?? a.name ?? pinPlaceResponse.data.title;
    const area = a.district ?? a.subregion ?? a.city ?? '';
    return { title: street, subtitle: [street, area].filter(Boolean).join('، '), ...p };
  } catch {
    return { ...pinPlaceResponse.data, ...p };
  }
}

/** Search a street / place name. */
export async function findPlace(query: string): Promise<LatLng | null> {
  if (Platform.OS === 'web' || !query.trim()) return null;
  try {
    const [r] = await Location.geocodeAsync(query);
    return r ? { lat: r.latitude, lng: r.longitude } : null;
  } catch {
    return null;
  }
}
