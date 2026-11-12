import { forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path, Rect, Text } from 'react-native-svg';

import { fonts } from '@/theme';

import type { LatLng, MapCanvasHandle } from './types';

type Props = { initial: LatLng; onCenterChange: (center: LatLng) => void };

/**
 * Web preview only: react-native-maps has no web version, so this draws the
 * static map from 09-MapPick. On phones the real map (MapCanvas.tsx) is used.
 */
export const MapCanvas = forwardRef<MapCanvasHandle, Props>(function MapCanvas(_props, ref) {
  useImperativeHandle(ref, () => ({ animateTo: () => {} }));
  return (
    <View style={[StyleSheet.absoluteFill, styles.bg]}>
      <Svg width="100%" height="100%" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">
        <Rect width="390" height="844" fill="#ECEEE7" />
        <Rect x="250" y="120" width="160" height="150" rx="8" fill="#D4E8CC" />
        <Path d="M-10 640 C 80 610, 160 680, 260 650 S 390 600, 400 620 L400 700 L-10 720 Z" fill="#CFE3EE" />
        {[
          [20, 140, 90, 80],
          [130, 140, 90, 80],
          [20, 260, 90, 110],
          [130, 260, 90, 110],
          [250, 300, 130, 70],
          [20, 410, 90, 90],
          [130, 410, 90, 90],
          [250, 410, 130, 90],
          [20, 530, 200, 60],
          [250, 530, 130, 60],
        ].map(([x, y, w, h]) => (
          <Rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx="6" fill="#E0E2DA" />
        ))}
        <Path d="M0 240 H390" stroke="#FFFFFF" strokeWidth="16" />
        <Path d="M0 390 H390" stroke="#FFE6A3" strokeWidth="22" />
        <Path d="M0 515 H390" stroke="#FFFFFF" strokeWidth="14" />
        <Path d="M120 100 V610" stroke="#FFFFFF" strokeWidth="14" />
        <Path d="M235 100 V610" stroke="#FFFFFF" strokeWidth="18" />
        <Text x="60" y="395" fontFamily={fonts.regular} fontSize="11" fill="#8A6A1A">
          ش. الجمهورية
        </Text>
        <Text x="300" y="245" fontFamily={fonts.regular} fontSize="10" fill="#7A8580">
          ش. النصر
        </Text>
        <Text x="290" y="200" fontFamily={fonts.regular} fontSize="11" fill="#4C7A3F">
          جنينة الحي
        </Text>
      </Svg>
    </View>
  );
});

const styles = StyleSheet.create({
  bg: { backgroundColor: '#ECEEE7' },
});
