export type LatLng = { lat: number; lng: number };

export type MapCanvasHandle = {
  /** Move the map so this point is under the center pin. */
  animateTo: (p: LatLng) => void;
};
