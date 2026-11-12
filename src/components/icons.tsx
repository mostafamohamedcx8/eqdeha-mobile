import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import { colors } from '@/theme';

export type IconProps = { size?: number; color?: string; strokeWidth?: number };

/** Shared wrapper: 24x24 viewBox, stroked line icons (same as the HTML). */
export function Line({
  size = 22,
  color = colors.text,
  strokeWidth = 2,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round">
      {children}
    </Svg>
  );
}

/** Points right: "back" in RTL. */
export const BackIcon = (p: IconProps) => (
  <Line strokeWidth={2.2} {...p}>
    <Path d="M9 6l6 6-6 6" />
  </Line>
);

export const WhatsappIcon = (p: IconProps) => (
  <Line {...p}>
    <Path d="M3 21l1.6-4.5A8.5 8.5 0 1 1 8 20.2z" />
    <Path d="M9 11.5c.5 1.5 1.8 2.8 3.5 3.5" />
  </Line>
);

export const WhatsappCheckIcon = (p: IconProps) => (
  <Line strokeWidth={1.8} {...p}>
    <Path d="M3 21l1.6-4.5A8.5 8.5 0 1 1 8 20.2z" />
    <Path d="M9 12l2 2 4-4" />
  </Line>
);

export const EyeIcon = (p: IconProps) => (
  <Line {...p}>
    <Path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <Circle cx="12" cy="12" r="3" />
  </Line>
);

export const EyeOffIcon = (p: IconProps) => (
  <Line {...p}>
    <Path d="M3 3l18 18" />
    <Path d="M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6C3.8 8.4 2 12 2 12s3.5 7 10 7a9.8 9.8 0 0 0 5.4-1.6" />
  </Line>
);

export const UserIcon = (p: IconProps) => (
  <Line strokeWidth={1.8} {...p}>
    <Circle cx="12" cy="9" r="4" />
    <Path d="M5 20a7 7 0 0 1 14 0" />
  </Line>
);

export const CameraIcon = (p: IconProps) => (
  <Line strokeWidth={2.4} {...p}>
    <Path d="M4 8h3l2-3h6l2 3h3v11H4z" />
    <Circle cx="12" cy="13" r="3" />
  </Line>
);

export const CalendarIcon = (p: IconProps) => (
  <Line strokeWidth={1.8} {...p}>
    <Rect x="4" y="5" width="16" height="15" rx="2" />
    <Path d="M8 3v4M16 3v4M4 10h16" />
  </Line>
);

export const MaleIcon = (p: IconProps) => (
  <Line {...p}>
    <Circle cx="10" cy="14" r="5" />
    <Path d="M14 10l6-6M15 4h5v5" />
  </Line>
);

export const FemaleIcon = (p: IconProps) => (
  <Line {...p}>
    <Circle cx="12" cy="9" r="5" />
    <Path d="M12 14v7M9 18h6" />
  </Line>
);

export const BagIcon = (p: IconProps) => (
  <Line strokeWidth={1.8} {...p}>
    <Path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" />
    <Path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </Line>
);

export const BikeIcon = (p: IconProps) => (
  <Line strokeWidth={1.8} {...p}>
    <Circle cx="6" cy="17" r="3" />
    <Circle cx="18" cy="17" r="3" />
    <Path d="M6 17l4-7h5l3 7M10 10l-1-3H6M15 10l1-3h3" />
  </Line>
);

export const LockIcon = (p: IconProps) => (
  <Line strokeWidth={2.2} {...p}>
    <Rect x="5" y="11" width="14" height="10" rx="2" />
    <Path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Line>
);

export const CheckIcon = (p: IconProps) => (
  <Line strokeWidth={2.2} {...p}>
    <Path d="M5 12l5 5 9-10" />
  </Line>
);

export const IdCardIcon = (p: IconProps) => (
  <Line strokeWidth={1.8} {...p}>
    <Rect x="3" y="6" width="18" height="12" rx="2" />
    <Path d="M7 14h6M7 10h3" />
  </Line>
);

export const PhoneCallIcon = (p: IconProps) => (
  <Line {...p}>
    <Path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </Line>
);

/** Eqdeha logo (64x64 artwork, scaled). */
export function Logo({ size = 84 }: { size?: number }) {
  const p = colors.primary;
  const bg = colors.background;
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Rect x="0" y="0" width="64" height="64" rx="16" fill={colors.accent} />
      <Path d="M27 13 q2 -4 5 -1 q2 -4 5 0" fill="none" stroke={p} strokeWidth="2" strokeLinecap="round" />
      <Circle cx="32" cy="21" r="8" fill={bg} stroke={p} strokeWidth="2.2" />
      <Circle cx="29" cy="20" r="1.6" fill={p} />
      <Circle cx="35" cy="20" r="1.6" fill={p} />
      <Ellipse cx="32" cy="25" rx="1.6" ry="1.9" fill={p} />
      <Path d="M14 27 H50 L47 51 a4 4 0 0 1 -4 3.5 H21 a4 4 0 0 1 -4 -3.5 Z" fill={p} />
      <Path d="M24 37 a8 8 0 0 0 16 0" fill="none" stroke={colors.accent} strokeWidth="2.6" strokeLinecap="round" />
      <Circle cx="22" cy="27" r="3.2" fill={bg} stroke={p} strokeWidth="2" />
      <Circle cx="42" cy="27" r="3.2" fill={bg} stroke={p} strokeWidth="2" />
    </Svg>
  );
}

/* ---------- phase 2 ---------- */

/** Filled star (points). */
export const StarFilledIcon = ({ size = 20, color = colors.accent }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
  </Svg>
);

/** Outline star (ratings). */
export const StarOutlineIcon = (p: IconProps) => (
  <Line {...p}>
    <Path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
  </Line>
);

export const BellIcon = (p: IconProps) => (
  <Line {...p}>
    <Path d="M6 17V11a6 6 0 0 1 12 0v6l2 2H4z" />
    <Path d="M10 21h4" />
  </Line>
);

export const PinIcon = (p: IconProps) => (
  <Line {...p}>
    <Path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
    <Circle cx="12" cy="9.5" r="2.5" />
  </Line>
);

/** Solid map pin (24x30 artwork). */
export function MapPinSolid({ width = 16, height = 20, fill = colors.accent, dot = colors.primary, dotR = 4 }: { width?: number; height?: number; fill?: string; dot?: string; dotR?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 30">
      <Path d="M12 29s-11-9.5-11-17A11 11 0 0 1 23 12c0 7.5-11 17-11 17z" fill={fill} />
      <Circle cx="12" cy="12" r={dotR} fill={dot} />
    </Svg>
  );
}

export const ChevronDownIcon = (p: IconProps) => (
  <Line {...p}>
    <Path d="M6 9l6 6 6-6" />
  </Line>
);

/** Points left: "forward / open" in RTL. */
export const ChevronLeftIcon = (p: IconProps) => (
  <Line {...p}>
    <Path d="M15 6l-6 6 6 6" />
  </Line>
);

export const GlobeIcon = (p: IconProps) => (
  <Line {...p}>
    <Circle cx="12" cy="12" r="9" />
    <Path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
  </Line>
);

export const HomeIcon = (p: IconProps) => (
  <Line {...p}>
    <Path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z" />
  </Line>
);

export const OrdersIcon = (p: IconProps) => (
  <Line {...p}>
    <Rect x="5" y="4" width="14" height="17" rx="2" />
    <Path d="M9 9h6M9 13h6M9 17h3" />
  </Line>
);

export const AccountIcon = (p: IconProps) => (
  <Line {...p}>
    <Circle cx="12" cy="8" r="4" />
    <Path d="M4 21a8 8 0 0 1 16 0" />
  </Line>
);

export const SearchIcon = (p: IconProps) => (
  <Line {...p}>
    <Circle cx="11" cy="11" r="7" />
    <Path d="M20 20l-4-4" />
  </Line>
);

export const PlusIcon = (p: IconProps) => (
  <Line strokeWidth={2.4} {...p}>
    <Path d="M12 5v14M5 12h14" />
  </Line>
);

export const MinusIcon = (p: IconProps) => (
  <Line strokeWidth={2.6} {...p}>
    <Path d="M5 12h14" />
  </Line>
);

export const TrashIcon = (p: IconProps) => (
  <Line {...p}>
    <Path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13" />
  </Line>
);

/** "Use my location" crosshair. */
export const LocateIcon = (p: IconProps) => (
  <Line {...p}>
    <Circle cx="12" cy="12" r="4" />
    <Path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
  </Line>
);

export const WalletIcon = (p: IconProps) => (
  <Line {...p}>
    <Path d="M4 7a2 2 0 0 1 2-2h11v4" />
    <Path d="M4 7v11a2 2 0 0 0 2 2h14V9H6a2 2 0 0 1-2-2" />
  </Line>
);

export const ChatIcon = (p: IconProps) => (
  <Line {...p}>
    <Path d="M4 5h16v11H9l-5 4z" />
  </Line>
);

export const ReceiptIcon = (p: IconProps) => (
  <Line {...p}>
    <Path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
    <Path d="M9 8h6M9 12h6" />
  </Line>
);

export const InfoIcon = (p: IconProps) => (
  <Line {...p}>
    <Circle cx="12" cy="12" r="9" />
    <Path d="M12 8v5M12 16h.01" />
  </Line>
);

export const ImageIcon = (p: IconProps) => (
  <Line {...p}>
    <Rect x="3" y="5" width="18" height="14" rx="2" />
    <Circle cx="9" cy="11" r="2" />
    <Path d="M21 16l-5-5-9 8" />
  </Line>
);

export const SendIcon = (p: IconProps) => (
  <Line strokeWidth={2.2} {...p}>
    <Path d="M20 4L4 11l7 2 2 7z" />
  </Line>
);

/** Camera with a bigger lens (chat composer). */
export const CameraLensIcon = (p: IconProps) => (
  <Line {...p}>
    <Path d="M4 8h3l2-3h6l2 3h3v11H4z" />
    <Circle cx="12" cy="13" r="3.5" />
  </Line>
);

/** Rating star with fill + outline (16-Delivered). */
export function RatingStar({ size = 38, filled }: { size?: number; filled: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"
        fill={filled ? colors.accent : colors.surface}
        stroke={filled ? colors.starStroke : colors.border}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export const DocIcon = (p: IconProps) => (
  <Line {...p}>
    <Path d="M6 3h9l4 4v14H6z" />
    <Path d="M9 12h6M9 16h6" />
  </Line>
);

/** Small app icon used in the push-notification preview. */
export function AppMiniLogo({ size = 36 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Rect width="64" height="64" rx="14" fill={colors.accent} />
      <Circle cx="32" cy="21" r="8" fill={colors.background} stroke={colors.primary} strokeWidth="2.2" />
      <Path d="M14 27H50L47 51a4 4 0 0 1-4 3.5H21a4 4 0 0 1-4-3.5Z" fill={colors.primary} />
    </Svg>
  );
}
