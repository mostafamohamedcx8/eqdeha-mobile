import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/theme';

import { AppText } from './AppText';

export type Step = { title: string; subtitle?: string };

/** Vertical timeline from 12-Tracking: done = green check, current = teal ring, later = grey. */
export function StatusStepper({ steps, current }: { steps: Step[]; current: number }) {
  return (
    <View>
      {steps.map((s, i) => {
        const done = i < current;
        const now = i === current;
        const last = i === steps.length - 1;
        return (
          <View key={s.title} style={styles.row}>
            <View style={styles.rail}>
              <View style={[styles.dot, done ? styles.dotDone : now ? styles.dotNow : styles.dotLater]}>
                {done ? (
                  <AppText size={13} weight="extrabold" color={colors.surface}>
                    ✓
                  </AppText>
                ) : null}
              </View>
              {last ? null : <View style={[styles.line, { backgroundColor: done ? colors.success : colors.divider }]} />}
            </View>
            <View style={[styles.texts, !last && styles.textsGap]}>
              <AppText
                size={15}
                weight={now ? 'extrabold' : done ? 'bold' : 'semibold'}
                color={now ? colors.primary : done ? colors.text : colors.placeholder}>
                {s.title}
              </AppText>
              {s.subtitle ? (
                <AppText size={12} color={colors.textMuted}>
                  {s.subtitle}
                </AppText>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.lg },
  rail: { alignItems: 'center' },
  dot: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  dotDone: { backgroundColor: colors.success },
  dotNow: { backgroundColor: colors.surface, borderWidth: 6, borderColor: colors.primary },
  dotLater: { backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border },
  line: { flex: 1, width: 2, minHeight: 18, marginVertical: 2 },
  texts: { flex: 1 },
  textsGap: { paddingBottom: spacing.xl },
});
