import { Platform, StyleSheet } from 'react-native';

/** Soft teal shadows from the map screen (`box-shadow: 0 2px 8px rgba(15,76,92,0.15)`). */
export const shadow = StyleSheet.create({
  card: Platform.select({
    web: { boxShadow: '0 2px 8px rgba(15,76,92,0.15)' },
    default: { shadowColor: '#0F4C5C', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 4 },
  }),
  sheet: Platform.select({
    web: { boxShadow: '0 -4px 16px rgba(15,76,92,0.12)' },
    default: { shadowColor: '#0F4C5C', shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: -4 }, elevation: 12 },
  }),
});
