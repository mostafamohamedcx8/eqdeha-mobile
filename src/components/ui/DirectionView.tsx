import { Platform, View, type ViewProps } from 'react-native';

type Props = ViewProps & { dir: 'rtl' | 'ltr' };

/**
 * Sets layout direction for a subtree on every platform.
 * - Native: the Yoga `direction` style (works in Expo Go, where forceRTL is reset).
 * - Web: react-native-web doesn't support that style; it uses the HTML `dir`
 *   attribute instead, which CSS flex rows and start/end (logical) styles follow.
 */
export function DirectionView({ dir, style, ...rest }: Props) {
  if (Platform.OS === 'web') {
    // `dir` is a react-native-web View prop that RN's types don't declare.
    const webProps = { dir } as object;
    return <View {...rest} {...webProps} style={style} />;
  }
  return <View {...rest} style={[{ direction: dir }, style]} />;
}
