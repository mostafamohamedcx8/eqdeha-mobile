import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { CameraIcon, CheckIcon, UserIcon } from '@/components/icons';
import { colors, radii, spacing } from '@/theme';
import { pickImage, type ImageSource } from '@/utils/pickImage';

import { AppText } from './AppText';

type Common = {
  value: string | null;
  onChange: (uri: string) => void;
  source?: ImageSource;
  front?: boolean;
  aspect?: [number, number];
  hasError?: boolean;
  accessibilityLabel: string;
};

type AvatarProps = Common & {
  variant: 'avatar';
  /** Ring around the yellow camera badge = the surface behind it. */
  badgeBorder?: string;
};

type TileProps = Common & {
  variant: 'tile';
  /** Empty-state icon (receives its color). */
  icon: React.ReactNode;
  label: string;
  /** Shown on the picked image, e.g. "الوش اتصوّر". */
  doneLabel: string;
  height?: number;
};

type Props = AvatarProps | TileProps;

/**
 * Dashed box that opens the camera/gallery and shows the picked photo.
 * avatar = 76px circle with camera badge (04-Profile, 23-CInfo);
 * tile   = dashed rectangle (24-CVehicle ID / vehicle photos).
 */
export function ImagePickerBox(props: Props) {
  const { value, onChange, source = 'both', front, aspect, hasError, accessibilityLabel } = props;

  const open = async () => {
    const uri = await pickImage({ source, front, aspect });
    if (uri) onChange(uri);
  };

  if (props.variant === 'avatar') {
    return (
      <Pressable
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={[styles.avatar, value ? styles.avatarFilled : hasError ? styles.avatarError : styles.avatarEmpty]}>
        {value ? (
          <Image source={{ uri: value }} style={styles.avatarImage} contentFit="cover" />
        ) : (
          <UserIcon size={34} color={colors.primary} />
        )}
        <View style={[styles.badge, { borderColor: props.badgeBorder ?? colors.background }]}>
          <CameraIcon size={14} color={colors.accentText} />
        </View>
      </Pressable>
    );
  }

  const height = props.height ?? 104;
  return (
    <Pressable
      onPress={open}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[styles.tile, { height }, value ? styles.tileDone : hasError ? styles.tileError : styles.tileEmpty]}>
      {value ? (
        <>
          <Image source={{ uri: value }} style={StyleSheet.absoluteFill} contentFit="cover" />
          <View style={styles.doneBand}>
            <CheckIcon size={16} color={colors.successText} />
            <AppText size={12} weight="bold" color={colors.successText}>
              {props.doneLabel}
            </AppText>
            <AppText size={11} color={colors.successText}>
              · صوّر تاني
            </AppText>
          </View>
        </>
      ) : (
        <>
          {props.icon}
          <AppText size={13} weight="bold" color={colors.primary} center>
            {props.label}
          </AppText>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmpty: { borderWidth: 2, borderStyle: 'dashed', borderColor: colors.primary },
  avatarError: { borderWidth: 2, borderStyle: 'dashed', borderColor: colors.danger },
  avatarFilled: { borderWidth: 2, borderColor: colors.success },
  avatarImage: { width: 72, height: 72, borderRadius: 36 },
  badge: {
    position: 'absolute',
    bottom: -2,
    end: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tile: {
    flex: 1,
    borderRadius: radii.input,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    overflow: 'hidden',
    backgroundColor: colors.background,
  },
  tileEmpty: { borderWidth: 2, borderStyle: 'dashed', borderColor: colors.primary },
  tileError: { borderWidth: 2, borderStyle: 'dashed', borderColor: colors.danger },
  tileDone: { borderWidth: 2, borderColor: colors.success, backgroundColor: colors.successBg },
  doneBand: {
    position: 'absolute',
    bottom: 0,
    start: 0,
    end: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    backgroundColor: colors.successBg,
  },
});
