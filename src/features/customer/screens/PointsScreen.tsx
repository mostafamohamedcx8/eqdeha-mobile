import { PointsView } from '@/components/PointsView';
import { POINTS_PREVIEW, pointsResponse } from '@/mocks/customer';
import { usePoints } from '@/store/points';
import { ar } from '@/utils/format';

/** 10-Points. The ١٢٠ / ١٠٤٠ toggle in the header is the design's preview switch (dev only). */
export default function PointsScreen() {
  const { balance, redeemed, redeem, preview } = usePoints();
  const s = pointsResponse.data;
  return (
    <PointsView
      summary={s}
      balance={balance}
      redeemed={redeemed}
      onRedeem={redeem}
      previewValues={POINTS_PREVIEW}
      onPreview={preview}
      rewardSubtitle="بتتخصم من تمن أوردرك الجاي"
      doneText={`✓ اتضافلك خصم ${ar(s.rewardEgp)} ج، وهيتخصم أوتوماتيك من أوردرك الجاي`}
      backTo="/home"
    />
  );
}
