import { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

import type { LatLng, MapCanvasHandle } from './types';

type Props = {
  initial: LatLng;
  /** Called when the map stops moving, with the point under the center pin. */
  onCenterChange: (center: LatLng) => void;
};

const DELTA = 0.006; // ~ a few streets

/** Real map (react-native-maps; included in Expo Go). The pin is drawn by the screen on top of it. */
export const MapCanvas = forwardRef<MapCanvasHandle, Props>(function MapCanvas({ initial, onCenterChange }, ref) {
  const map = useRef<MapView>(null);

  useImperativeHandle(ref, () => ({
    animateTo: ({ lat, lng }) =>
      map.current?.animateToRegion({ latitude: lat, longitude: lng, latitudeDelta: DELTA, longitudeDelta: DELTA }, 500),
  }));

  return (
    <MapView
      ref={map}
      style={StyleSheet.absoluteFill}
      initialRegion={{ latitude: initial.lat, longitude: initial.lng, latitudeDelta: DELTA, longitudeDelta: DELTA }}
      onRegionChangeComplete={(r) => onCenterChange({ lat: r.latitude, lng: r.longitude })}
      showsUserLocation
      showsMyLocationButton={false}
      toolbarEnabled={false}
      rotateEnabled={false}
      pitchEnabled={false}
    />
  );
});
