import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Logo } from '@/components/icons';
import { colors, fontSize, radii, spacing } from '@/theme';

import { AppText } from './AppText';
import { useDesignInsets } from './useDesignInsets';

type HeaderProps = {
  children: React.ReactNode;
  /** Padding values exactly as in the HTML (top includes the status bar). */
  paddingTop?: number;
  paddingBottom?: number;
  paddingHorizontal?: number;
  /** Bottom corner radius; 0 for a flat bar (02-Terms). */
  radius?: number;
  gap?: number;
  center?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Teal header that runs under the status bar, with rounded bottom corners. */
export function Header({
  children,
  paddingTop = 52,
  paddingBottom = 34,
  paddingHorizontal = spacing.s20,
  radius = radii.header,
  gap = spacing.s18,
  center,
  style,
}: HeaderProps) {
  const inset = useDesignInsets();
  return (
    <View
      style={[
        styles.base,
        {
          paddingTop: inset.top(paddingTop),
          paddingBottom,
          paddingHorizontal,
          gap,
          borderBottomLeftRadius: radius,
          borderBottomRightRadius: radius,
        },
        center && styles.center,
        style,
      ]}>
      {children}
    </View>
  );
}

type BrandHeaderProps = {
  logoSize: number;
  title: string;
  titleSize: number;
  subtitle: string;
  badge?: string;
  paddingTop: number;
  paddingBottom: number;
  gap: number;
  /** Gap between the title and the subtitle. */
  textGap?: number;
};

/** Centered logo + app name header (00b, 01-Main, 21-CPhone). */
export function BrandHeader({ logoSize, title, titleSize, subtitle, badge, paddingTop, paddingBottom, gap, textGap = 2 }: BrandHeaderProps) {
  return (
    <Header center paddingTop={paddingTop} paddingBottom={paddingBottom} paddingHorizontal={spacing.s24} radius={radii.headerLg} gap={gap}>
      <Logo size={logoSize} />
      <View style={[styles.center, { gap: textGap }]}>
        <View style={styles.titleRow}>
          <AppText size={titleSize} weight="extrabold" color={colors.textOnPrimary} lineHeight={1.3}>
            {title}
          </AppText>
          {badge ? (
            <View style={styles.badge}>
              <AppText size={fontSize.body2} weight="extrabold" color={colors.accentText}>
                {badge}
              </AppText>
            </View>
          ) : null}
        </View>
        <AppText size={fontSize.md} color={colors.textOnPrimaryMuted} center>
          {subtitle}
        </AppText>
      </View>
    </Header>
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: colors.primary },
  center: { alignItems: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  badge: {
    paddingHorizontal: spacing.ml,
    paddingVertical: spacing.xxs,
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
  },
});
