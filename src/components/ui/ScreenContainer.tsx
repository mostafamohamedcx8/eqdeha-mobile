import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View, type ScrollViewInstance, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/theme';

import { DirectionView } from './DirectionView';
import { useDesignInsets } from './useDesignInsets';

type Props = {
  children: React.ReactNode;
  /** Status bar icon color: light on teal headers, dark on beige screens. */
  statusBar?: 'light' | 'dark';
  /** Fixed area above the scroll view (02-Terms header, 24-CVehicle steps). */
  header?: React.ReactNode;
  /** Fixed area pinned under the scroll view (02-Terms, 24-CVehicle). */
  footer?: React.ReactNode;
  /** Style for the scroll content. Use `flexGrow`-friendly layouts: a `<Spacer />` pushes buttons down. */
  contentStyle?: StyleProp<ViewStyle>;
  /** Design top padding when the screen has no Header (includes the status bar). */
  paddingTop?: number;
  /** Design bottom padding (ignored when a footer is given). */
  paddingBottom?: number;
  scroll?: boolean;
  /** Lets a form scroll to a field (see useFormFocus). */
  scrollRef?: React.Ref<ScrollViewInstance>;
  /** e.g. keep a chat scrolled to the newest message. */
  onContentSizeChange?: (w: number, h: number) => void;
};

/**
 * Every screen sits in this: beige background, keyboard-safe, scrollable.
 * Content grows to at least the screen height, so short forms keep their
 * buttons at the bottom like the 844px designs, and long ones just scroll.
 */
export function ScreenContainer({
  children,
  statusBar = 'dark',
  header,
  footer,
  contentStyle,
  paddingTop,
  paddingBottom,
  scroll = true,
  scrollRef,
  onContentSizeChange,
}: Props) {
  const inset = useDesignInsets();
  // Only set the sides we own: in RN `paddingTop: 0` would override a screen's
  // `padding` / `paddingVertical` in contentStyle, whatever the order.
  const pad: ViewStyle = {
    ...(paddingTop !== undefined ? { paddingTop: inset.top(paddingTop) } : null),
    ...(paddingBottom !== undefined && !footer ? { paddingBottom: inset.bottom(paddingBottom) } : null),
  };

  return (
    <DirectionView dir="rtl" style={styles.root}>
      <StatusBar style={statusBar} />
      {header}
      <KeyboardAvoidingView behavior="padding" style={styles.flex}>
        {scroll ? (
          <ScrollView
            ref={scrollRef}
            onContentSizeChange={onContentSizeChange}
            style={styles.flex}
            contentContainerStyle={[styles.grow, pad, contentStyle]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
            overScrollMode="never">
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.flex, pad, contentStyle]}>{children}</View>
        )}
        {footer}
      </KeyboardAvoidingView>
    </DirectionView>
  );
}

/** White bar with a top divider holding the main action (02-Terms, 24-CVehicle). */
export function FooterBar({ children, paddingTop = 14, paddingBottom = 30 }: { children: React.ReactNode; paddingTop?: number; paddingBottom?: number }) {
  const inset = useDesignInsets();
  return <View style={[styles.footer, { paddingTop, paddingBottom: inset.bottom(paddingBottom) }]}>{children}</View>;
}

/** `<div style="flex: 1">` from the HTML. */
export function Spacer() {
  return <View style={styles.flex} />;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  grow: { flexGrow: 1 },
  footer: {
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});
