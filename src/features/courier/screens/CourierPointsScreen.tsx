import { PointsView } from '@/components/PointsView';
import { COURIER_POINTS_PREVIEW, courierPointsResponse } from '@/mocks/courier';
import { useCourier } from '@/store/courier';
import { ar } from '@/utils/format';

/** 32-CPoints. The ٦٤٠ / ١٠٤٠ toggle in the header is the design's preview switch (dev only). */
export default function CourierPointsScreen() {
  const { points, pointsRedeemed, redeemPoints, previewPoints } = useCourier();
  const s = courierPointsResponse.data;
  return (
    <PointsView
      summary={s}
      balance={points}
      redeemed={pointsRedeemed}
      onRedeem={redeemPoints}
      previewValues={COURIER_POINTS_PREVIEW}
      onPreview={previewPoints}
      rewardSubtitle="بتتخصم من العمولة اللي عليك، أو بتتضاف لفلوسك في التصفية"
      doneText={`✓ اتخصم ${ar(s.rewardEgp)} ج من اللي عليك للتطبيق`}
      backTo="/courier-home"
    />
  );
}
