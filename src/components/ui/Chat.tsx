import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { CameraLensIcon, ImageIcon, SendIcon } from '@/components/icons';
import type { ChatMessage } from '@/mocks/types';
import { colors, fonts, radii, spacing } from '@/theme';
import { ar, money } from '@/utils/format';
import { pickImage } from '@/utils/pickImage';

import { AppText } from './AppText';
import { PhotoPlaceholder } from './PhotoPlaceholder';
import { useDesignInsets } from './useDesignInsets';

/**
 * One message (13-Chat / 27-CChat). In RTL: mine on the right (teal),
 * theirs on the left (white), system notes centered.
 */
export function ChatBubble({ message, compact }: { message: ChatMessage; compact?: boolean }) {
  if (message.variant === 'invoice' && message.invoice) {
    return (
      <View style={[styles.bubble, styles.invoiceCard, styles.mine]}>
        <AppText size={12} weight="bold" color={colors.accentIcon}>
          فاتورة اتبعتت للعميل
        </AppText>
        <AppText size={15} weight="extrabold" color={colors.accentText}>
          {`${message.text} · ${money(message.invoice.total)}`}
        </AppText>
        <AppText size={12} color={colors.warningText}>
          {`${ar(message.invoice.count)} ${message.invoice.count > 2 ? 'حاجات' : 'حاجة'} · صورة + GPS`}
        </AppText>
      </View>
    );
  }
  if (message.variant === 'unlock') {
    return (
      <View style={styles.unlock}>
        <AppText size={13} weight="bold" color={colors.successText} center>
          {message.text}
        </AppText>
      </View>
    );
  }
  if (message.from === 'system') {
    return (
      <View style={styles.system}>
        <AppText size={12} color={colors.textMuted}>
          {message.text}
        </AppText>
      </View>
    );
  }
  const mine = message.from === 'me';
  const fg = mine ? colors.textOnPrimary : colors.text;
  if (message.image) {
    return (
      <View style={[styles.bubble, styles.photoBubble, mine ? styles.mine : styles.theirs]}>
        <PhotoPlaceholder uri={message.image} caption={message.imageCaption} width={220} height={150} iconSize={36} />
        {message.text ? (
          <AppText size={15} lineHeight={1.6} color={fg} style={styles.photoText}>
            {message.text}
          </AppText>
        ) : null}
      </View>
    );
  }
  return (
    <View style={[styles.bubble, styles.textBubble, compact && styles.compactBubble, mine ? styles.mine : styles.theirs]}>
      <AppText size={compact ? 14 : 15} lineHeight={1.6} color={fg}>
        {message.text}
      </AppText>
    </View>
  );
}

type ComposerProps = {
  value: string;
  onChangeText: (v: string) => void;
  onSend: () => void;
  onImage: (uri: string) => void;
  placeholder?: string;
  /** 27-CChat: camera only, 42px controls, no own bar (sits inside the action bar). */
  compact?: boolean;
};

/** Bottom bar: camera, gallery, text, send. */
export function ChatComposer({ value, onChangeText, onSend, onImage, placeholder = 'اكتب رسالة...', compact }: ComposerProps) {
  const inset = useDesignInsets();
  const pick = async (source: 'camera' | 'gallery') => {
    const uri = await pickImage({ source });
    if (uri) onImage(uri);
  };
  return (
    <View style={compact ? styles.composerRow : [styles.composer, { paddingBottom: inset.bottom(28) }]}>
      <Pressable onPress={() => pick('camera')} accessibilityRole="button" accessibilityLabel="صوّر وابعت" style={[styles.tool, compact && styles.box42]}>
        <CameraLensIcon color={colors.primary} />
      </Pressable>
      {compact ? null : (
        <Pressable onPress={() => pick('gallery')} accessibilityRole="button" accessibilityLabel="ابعت صورة من المعرض" style={styles.tool}>
          <ImageIcon color={colors.primary} />
        </Pressable>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        accessibilityLabel="اكتب رسالة"
        returnKeyType="send"
        onSubmitEditing={onSend}
        submitBehavior="submit"
        maxLength={500}
        cursorColor={colors.primary}
        selectionColor={colors.primary}
        style={[styles.input, compact && styles.input42]}
      />
      <Pressable onPress={onSend} accessibilityRole="button" accessibilityLabel="ابعت" style={[styles.send, compact && styles.send42]}>
        <SendIcon size={compact ? 18 : 20} color={colors.accentText} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  system: {
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: colors.divider,
  },
  bubble: { maxWidth: '78%', borderRadius: 18 },
  textBubble: { paddingVertical: spacing.ml, paddingHorizontal: spacing.xl },
  compactBubble: { paddingVertical: 9, paddingHorizontal: 13, borderRadius: 16 },
  invoiceCard: {
    width: '78%',
    paddingVertical: spacing.ml,
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
    backgroundColor: colors.accentLight,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 16,
  },
  unlock: { alignSelf: 'stretch', paddingVertical: spacing.ml, paddingHorizontal: spacing.lg, borderRadius: radii.md, backgroundColor: colors.successBg },
  composerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  box42: { width: 42, height: 42 },
  input42: { height: 42, borderRadius: 21, fontSize: 14 },
  send42: { width: 42, height: 42, borderRadius: 21 },
  photoBubble: { padding: spacing.sm, gap: spacing.sm },
  photoText: { paddingHorizontal: spacing.md, paddingBottom: spacing.xs },
  // RTL: flex-start = right side
  mine: { alignSelf: 'flex-start', backgroundColor: colors.primary, borderBottomStartRadius: 4 },
  theirs: { alignSelf: 'flex-end', backgroundColor: colors.surface, borderBottomEndRadius: 4 },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingTop: spacing.ml,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  tool: { width: 44, height: 44, borderRadius: radii.md, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  input: {
    flex: 1,
    minWidth: 0,
    height: 44,
    paddingHorizontal: spacing.xl,
    paddingVertical: 0,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
  },
  send: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
});
