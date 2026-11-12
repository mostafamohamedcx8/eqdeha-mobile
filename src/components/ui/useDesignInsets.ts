import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DESIGN_HOME_INDICATOR, DESIGN_STATUS_BAR } from '@/theme';

/**
 * The HTML screens are drawn on a 390x844 iPhone whose top padding already
 * includes a 47px status bar. These helpers turn a design padding into the
 * right padding for the real device's safe area.
 */
export function useDesignInsets() {
  const insets = useSafeAreaInsets();
  return {
    top: (designTop: number) => insets.top + Math.max(designTop - DESIGN_STATUS_BAR, 8),
    // The HTML bottom paddings (24–30) ignore the home indicator, so keep at least that much above it.
    bottom: (designBottom: number) => Math.max(designBottom, insets.bottom + DESIGN_HOME_INDICATOR / 3),
  };
}
