import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, fontSize, spacing } from '@/theme';

type Props = {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  selected: boolean;
  onPress: () => void;
};

/** Big radio card from 00b-RolePick. */
export function RoleCard({ title, subtitle, icon, iconBg, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={[styles.card, selected ? styles.cardOn : styles.cardOff]}>
      <View style={[styles.icon, { backgroundColor: iconBg }]}>{icon}</View>
      <View style={styles.texts}>
        <AppText size={fontSize.h4} weight="extrabold">
          {title}
        </AppText>
        <AppText size={fontSize.body2} color={colors.textMuted}>
          {subtitle}
        </AppText>
      </View>
      <View style={[styles.radio, selected ? styles.radioOn : styles.radioOff]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
    padding: spacing.xxl,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  cardOn: { borderWidth: 2, borderColor: colors.primary },
  // 1px border + 1px extra padding keeps the content from jumping when selected
  cardOff: { borderWidth: 1, borderColor: colors.divider, padding: spacing.xxl + 1 },
  icon: { width: 60, height: 60, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  texts: { flex: 1, alignItems: 'flex-start' },
  radio: { width: 24, height: 24, borderRadius: 12 },
  radioOn: { borderWidth: 7, borderColor: colors.primary, backgroundColor: colors.surface },
  radioOff: { borderWidth: 2, borderColor: colors.border },
});
