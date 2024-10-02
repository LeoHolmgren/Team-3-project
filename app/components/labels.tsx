import { Skeleton } from '@/components/ui/skeleton';
import { PriceLevels } from '@/app/types';

const PRICE_LABEL = {
  HIGH: (
    <h2
      style={{ opacity: '0.85', fontSize: '5em', lineHeight: 1.1, fontWeight: 800 }}
      className={'inline-block bg-gradient-to-r from-[#cd7a51] to-[#cd5181] bg-clip-text text-transparent'}
    >
      HIGH
    </h2>
  ),
  NORM: (
    <h2
      style={{ opacity: '0.85', fontSize: '5em', lineHeight: 1.1, fontWeight: 800 }}
      className={'inline-block bg-gradient-to-r from-[#5157cd] to-[#51cdc7] bg-clip-text text-transparent'}
    >
      NORM
    </h2>
  ),
  LOW: (
    <h2
      style={{ opacity: '0.85', fontSize: '5em', lineHeight: 1.1, fontWeight: 800 }}
      className={'inline-block bg-gradient-to-r from-[#51cd87] to-[#83cd51] bg-clip-text text-transparent'}
    >
      LOW
    </h2>
  ),
};

function getPriceLabel(priceLevels: PriceLevels | null, price: number | null) {
  if (price === null || !priceLevels) {
    return <Skeleton className="h-[5.5em] w-[15em]" />;
  }
  return price > priceLevels.high ? PRICE_LABEL.HIGH : price < priceLevels.low ? PRICE_LABEL.LOW : PRICE_LABEL.NORM;
}

export default getPriceLabel;
