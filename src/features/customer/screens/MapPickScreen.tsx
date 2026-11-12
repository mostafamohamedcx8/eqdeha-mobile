import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { BackIcon, LocateIcon, MapPinSolid, PinIcon } from '@/components/icons';
import { MapCanvas } from '@/components/map/MapCanvas';
import type { LatLng, MapCanvasHandle } from '@/components/map/types';
import {
  AppText,
  Button,
  ScreenContainer,
  SearchInput,
  Segmented,
  TextField,
  shadow,
  useDesignInsets,
} from '@/components/ui';
import { pinPlaceResponse } from '@/mocks/customer';
import type { MapPlace } from '@/mocks/types';
import { type MapMode, useOrderDraft } from '@/store/orderDraft';
import { colors, fontSize, radii, spacing } from '@/theme';
import { showErrorPopup } from '@/utils/alert';
import { findPlace, getMyLocation, placeAt } from '@/utils/location';
import { goBack } from '@/utils/nav';

/** 09-MapPick: drag the map under the center pin. `?mode=end` (delivery, default) or `start` (pickup). */
export default function MapPickScreen() {
  const params = useLocalSearchParams<{ mode?: MapMode }>();
  const inset = useDesignInsets();
  const draft = useOrderDraft();
  const map = useRef<MapCanvasHandle>(null);

  const [mode, setMode] = useState<MapMode>(params.mode === 'start' ? 'start' : 'end');
  const [center, setCenter] = useState<LatLng>({ lat: draft.delivery.lat, lng: draft.delivery.lng });
  const [place, setPlace] = useState<MapPlace>(pinPlaceResponse.data);
  const [query, setQuery] = useState('');
  const [building, setBuilding] = useState(draft.delivery.building ?? '');
  const [floor, setFloor] = useState(draft.delivery.floor ?? '');
  const [apartment, setApartment] = useState(draft.delivery.apartment ?? '');
  const [landmark, setLandmark] = useState(draft.delivery.landmark ?? '');
  const [placeName, setPlaceName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const end = mode === 'end';

  // Street name for the point under the pin.
  useEffect(() => {
    let active = true;
    placeAt(center).then((p) => active && setPlace(p));
    return () => {
      active = false;
    };
  }, [center]);

  const locateMe = async () => {
    const me = await getMyLocation();
    if (me) map.current?.animateTo(me);
  };

  const search = async () => {
    const found = await findPlace(query);
    if (found) map.current?.animateTo(found);
    else if (query.trim()) showErrorPopup('ملقيناش المكان ده، جرّب اسم شارع تاني أو حرّك الخريطة.', 'مفيش نتايج');
  };

  const confirm = () => {
    setSubmitted(true);
    if (end) {
      if (!building.trim()) return;
      const details = [`عمارة ${building.trim()}`, floor.trim() && `الدور ${floor.trim()}`, apartment.trim() && `شقة ${apartment.trim()}`]
        .filter(Boolean)
        .join('، ');
      draft.setDelivery({
        ...draft.delivery,
        street: place.title,
        details,
        building: building.trim(),
        floor: floor.trim(),
        apartment: apartment.trim(),
        landmark: landmark.trim(),
        lat: center.lat,
        lng: center.lng,
      });
    } else {
      draft.setPickupPlace(placeName.trim() || place.subtitle);
      draft.setPickupFrom('map');
    }
    goBack('/any-order');
  };

  return (
    <ScreenContainer scroll={false}>
      <View style={styles.mapArea}>
        <MapCanvas ref={map} initial={center} onCenterChange={setCenter} />

        {/* center pin: its tip sits on the map center */}
        <View pointerEvents="none" style={styles.pinLayer}>
          <View style={styles.pinLabel}>
            <AppText size={fontSize.sm} weight="bold" color={colors.textOnPrimary}>
              {end ? 'التوصيل هنا' : 'الشراء من هنا'}
            </AppText>
          </View>
          <View style={styles.pinIcon}>
            <MapPinSolid width={44} height={56} fill={end ? colors.accent : colors.primary} dot={end ? colors.primary : colors.surface} dotR={4.5} />
          </View>
        </View>
        <View pointerEvents="none" style={styles.pinShadowLayer}>
          <View style={styles.pinShadow} />
        </View>

        <View style={[styles.top, { top: inset.top(50) }]}>
          <View style={styles.searchRow}>
            <Pressable onPress={() => goBack('/any-order')} accessibilityRole="button" accessibilityLabel="رجوع" style={[styles.back, shadow.card]}>
              <BackIcon color={colors.text} />
            </Pressable>
            <View style={styles.flex}>
              <SearchInput value={query} onChangeText={setQuery} onSubmit={search} placeholder="دوّر على شارع أو مكان" height={48} elevated />
            </View>
          </View>
          <Segmented
            tone="onWhite"
            style={shadow.card}
            value={mode}
            onChange={setMode}
            options={[
              { value: 'start', label: 'نقطة البداية' },
              { value: 'end', label: 'نقطة التوصيل' },
            ]}
          />
        </View>

        <Pressable onPress={locateMe} accessibilityRole="button" accessibilityLabel="استخدم مكاني الحالي" style={[styles.locate, shadow.card]}>
          <LocateIcon size={24} color={colors.primary} />
        </Pressable>
      </View>

      <View style={[styles.sheet, shadow.sheet, { paddingBottom: inset.bottom(28) }]}>
        <View style={styles.handle} />
        <View style={styles.placeRow}>
          <View style={styles.placeIcon}>
            <PinIcon size={22} color={colors.accentIcon} />
          </View>
          <View style={styles.flex}>
            <AppText size={fontSize.lg} weight="bold">
              {end ? 'هنوصّلك هنا' : 'المندوب هيشتري من هنا'}
            </AppText>
            <AppText size={fontSize.body2} color={colors.textMuted} numberOfLines={1}>
              {place.subtitle}
            </AppText>
          </View>
        </View>

        {end ? (
          <>
            <View style={styles.grid3}>
              <View style={styles.flex}>
                <TextField
                  size="xs"
                  textAlign="center"
                  placeholder="العمارة"
                  accessibilityLabel="رقم العمارة"
                  value={building}
                  onChangeText={setBuilding}
                  error={submitted && !building.trim() ? 'مطلوب' : null}
                />
              </View>
              <View style={styles.flex}>
                <TextField size="xs" textAlign="center" placeholder="الدور" accessibilityLabel="الدور" value={floor} onChangeText={setFloor} />
              </View>
              <View style={styles.flex}>
                <TextField size="xs" textAlign="center" placeholder="الشقة" accessibilityLabel="الشقة" value={apartment} onChangeText={setApartment} />
              </View>
            </View>
            <TextField
              size="xs"
              placeholder="علامة مميزة (اختياري) – مثلاً: جنب الصيدلية"
              accessibilityLabel="علامة مميزة"
              value={landmark}
              onChangeText={setLandmark}
              maxLength={100}
            />
          </>
        ) : (
          <TextField
            size="xs"
            placeholder="اسم المكان (اختياري) – مثلاً: كشك عم محمد"
            accessibilityLabel="اسم المكان"
            value={placeName}
            onChangeText={setPlaceName}
            maxLength={100}
          />
        )}

        <Button title={end ? 'تأكيد مكان التوصيل' : 'تأكيد مكان الشراء'} weight="extrabold" onPress={confirm} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  mapArea: { flex: 1, overflow: 'hidden' },
  pinLayer: { position: 'absolute', top: 0, start: 0, end: 0, bottom: '50%', alignItems: 'center', justifyContent: 'flex-end' },
  pinLabel: { paddingHorizontal: spacing.ml, paddingVertical: spacing.xs, borderRadius: 8, backgroundColor: colors.text },
  pinIcon: { marginTop: spacing.xs },
  pinShadowLayer: { position: 'absolute', start: 0, end: 0, bottom: 0, top: '50%', alignItems: 'center', paddingTop: 2 },
  pinShadow: { width: 14, height: 5, borderRadius: 7, backgroundColor: colors.pinShadow },
  top: { position: 'absolute', start: spacing.xxl, end: spacing.xxl, gap: spacing.ml },
  searchRow: { flexDirection: 'row', gap: spacing.ml },
  back: { width: 48, height: 48, borderRadius: radii.input, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  // design: left 16px = end side in RTL
  locate: {
    position: 'absolute',
    end: spacing.xxl,
    bottom: 40,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheet: {
    marginTop: -26,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingTop: spacing.ml,
    paddingHorizontal: spacing.s20,
    gap: spacing.lg,
  },
  handle: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: colors.border },
  placeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  placeIcon: { width: 44, height: 44, borderRadius: radii.input, backgroundColor: colors.accentLight, alignItems: 'center', justifyContent: 'center' },
  grid3: { flexDirection: 'row', gap: spacing.md },
});
