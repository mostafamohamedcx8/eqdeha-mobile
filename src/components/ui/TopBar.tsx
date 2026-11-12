import { StyleSheet, View } from 'react-native';

import { colors, fontSize, spacing } from '@/theme';

import { AppText } from './AppText';
import { BackButton } from './BackButton';
import { Header } from './Header';

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  /** Content at the end of the title row (e.g. a small toggle). */
  end?: React.ReactNode;
  /** Content between the back button and the title (e.g. an avatar in 13-Chat). */
  leading?: React.ReactNode;
  /** Content under the title row (search box, big numbers...). */
  children?: React.ReactNode;
  /** Bottom corner radius (0 = flat bar like 06/07/08). */
  radius?: number;
  paddingTop?: number;
  paddingBottom?: number;
  titleSize?: number;
};

/** Teal screen header: back button + title (+ subtitle), as in 06–17. */
export function TopBar({ title, subtitle, onBack, end, leading, children, radius = 0, paddingTop = 50, paddingBottom = 18, titleSize = fontSize.h3 }: Props) {
  return (
    <Header paddingTop={paddingTop} paddingBottom={paddingBottom} paddingHorizontal={spacing.xxl} radius={radius} gap={spacing.xl}>
      <View style={styles.row}>
        {onBack ? <BackButton onPress={onBack} /> : null}
        {leading}
        <View style={styles.titles}>
          <AppText size={titleSize} weight="bold" color={colors.textOnPrimary}>
            {title}
          </AppText>
          {subtitle ? (
            <AppText size={fontSize.sm} color={colors.textOnPrimaryMuted}>
              {subtitle}
            </AppText>
          ) : null}
        </View>
        {end}
      </View>
      {children}
    </Header>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  titles: { flex: 1 },
});
