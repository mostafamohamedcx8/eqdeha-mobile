import { StyleSheet, View } from 'react-native';

import { AppText, BackButton, Header } from '@/components/ui';
import { colors, fontSize, spacing } from '@/theme';

type Props = { title: string; subtitle: string; onBack: () => void; children?: React.ReactNode };

/** Teal header with back button + title, as on 00c-Login. Used by the forgot-password screens. */
export function AuthHeader({ title, subtitle, onBack, children }: Props) {
  return (
    <Header paddingTop={52} paddingBottom={34} radius={32}>
      <BackButton onPress={onBack} />
      <View style={styles.titles}>
        <AppText size={fontSize.title} weight="extrabold" color={colors.textOnPrimary}>
          {title}
        </AppText>
        <AppText size={fontSize.md} color={colors.textOnPrimaryMuted}>
          {subtitle}
        </AppText>
      </View>
      {children}
    </Header>
  );
}

const styles = StyleSheet.create({
  titles: { gap: spacing.xxs },
});
