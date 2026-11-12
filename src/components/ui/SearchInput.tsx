import { StyleSheet, TextInput, View } from 'react-native';

import { SearchIcon } from '@/components/icons';
import { colors, fonts, radii } from '@/theme';

import { shadow } from './shadow';

type Props = {
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  onSubmit?: () => void;
  height?: number;
  /** Floating over the map (09-MapPick). */
  elevated?: boolean;
};

/** White search box with the magnifier at the start side (06-Shops, 09-MapPick). */
export function SearchInput({ value, onChangeText, placeholder, onSubmit, height = 50, elevated }: Props) {
  return (
    <View style={[styles.wrap, elevated && shadow.card]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        accessibilityLabel={placeholder}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        cursorColor={colors.primary}
        selectionColor={colors.primary}
        style={[styles.input, { height }]}
      />
      <View pointerEvents="none" style={styles.icon}>
        <SearchIcon size={20} color={colors.textMuted} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: radii.input, backgroundColor: colors.surface },
  input: {
    paddingStart: 46,
    paddingEnd: 16,
    paddingVertical: 0,
    borderRadius: radii.input,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
  },
  icon: { position: 'absolute', start: 15, top: 0, bottom: 0, justifyContent: 'center' },
});
