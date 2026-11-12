import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fontSize, type FontWeight } from '@/theme';

import { AppText } from './AppText';

type RowProps = {
  label: React.ReactNode;
  value: React.ReactNode;
  size?: number;
  weight?: FontWeight;
  color?: string;
  valueColor?: string;
  valueWeight?: FontWeight;
  style?: StyleProp<ViewStyle>;
};

/** "label ....... value" line (fees, invoice totals, points rules). */
export function KeyValueRow({ label, value, size = fontSize.body, weight = 'regular', color = colors.text, valueColor, valueWeight, style }: RowProps) {
  return (
    <View style={[styles.row, style]}>
      {typeof label === 'string' ? (
        <AppText size={size} weight={weight} color={color} style={styles.label}>
          {label}
        </AppText>
      ) : (
        label
      )}
      {typeof value === 'string' ? (
        <AppText size={size} weight={valueWeight ?? weight} color={valueColor ?? color}>
          {value}
        </AppText>
      ) : (
        value
      )}
    </View>
  );
}

/** Dashed separator (15-FinalInvoice between shops). */
export function DashedDivider({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.dashed, style]}>
      {Array.from({ length: 60 }, (_, i) => (
        <View key={i} style={styles.dash} />
      ))}
    </View>
  );
}

/** 1px separator line. */
export function Divider({ color = colors.divider, style }: { color?: string; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.divider, { backgroundColor: color }, style]} />;
}

/** Card section title (14px bold). */
export function SectionTitle({ children, size = fontSize.body, weight = 'bold' }: { children: React.ReactNode; size?: number; weight?: FontWeight }) {
  return (
    <AppText size={size} weight={weight}>
      {children}
    </AppText>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  label: { flexShrink: 1 },
  divider: { height: 1 },
  dashed: { height: 1, flexDirection: 'row', gap: 3, overflow: 'hidden' },
  dash: { width: 4, height: 1, backgroundColor: colors.border },
});
