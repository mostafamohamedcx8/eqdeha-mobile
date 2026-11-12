import { StyleSheet, View } from 'react-native';

import { colors, radii } from '@/theme';

import { AppText } from './AppText';

export type PillTone = 'success' | 'danger' | 'warning' | 'primary' | 'neutral';

const tones: Record<PillTone, { bg: string; fg: string }> = {
  success: { bg: colors.successBg, fg: colors.successText },
  danger: { bg: colors.dangerBg, fg: colors.dangerText },
  warning: { bg: colors.accentLight, fg: colors.warningText },
  primary: { bg: colors.primaryTint, fg: colors.primary },
  neutral: { bg: colors.neutralBg, fg: colors.textMuted },
};

/** Small rounded status label ("مفتوح", "اتسلّم", ...). */
export function StatusPill({ label, tone = 'success', size = 12, compact }: { label: string; tone?: PillTone; size?: number; compact?: boolean }) {
  const t = tones[tone];
  return (
    <View style={[styles.pill, compact && styles.compact, { backgroundColor: t.bg }]}>
      <AppText size={size} weight="bold" color={t.fg}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: radii.pill, flexShrink: 0, alignSelf: 'center' },
  compact: { paddingHorizontal: 8, paddingVertical: 1 },
});
