import { Levels } from '@/app/types';
import { BIDIGIT } from '@/app/constants';

const PRICE_FORMAT = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 });

export default function PriceLabel({
  price,
  priceLevels,
  time,
}: {
  price: number | null;
  priceLevels: Levels;
  time: Date
}) {

  let gradientCn = "";
  let labelWord = "";

  if (price !== null) {
    if (price > priceLevels.high) {
      gradientCn = "from-[#cd7a51] to-[#cd5181]";
      labelWord = "HIGH";
    } else if (price < priceLevels.low) {
      gradientCn = "from-[#51cd87] to-[#83cd51]";
      labelWord = "LOW";
    } else {
      gradientCn = "from-[#5157cd] to-[#51cdc7]";
      labelWord = "NORMAL";
    }
  } else {
    gradientCn = "from-[#8f8f8f] to-[#a8a8a8]";
    labelWord = "UNKNOWN";
  }

  return (
    <div className="flex flex-col items-center gap-0">
      <h1 className="inline-block text-[1.7em] font-[100] leading-[1.1] text-[#737373]">{BIDIGIT.format(time.getHours()) + ":" + BIDIGIT.format(time.getMinutes())}</h1>
      <h2
      style={{ opacity: '0.85', fontSize: '5em', lineHeight: 1.1, fontWeight: 800 }}
      className={'inline-block bg-gradient-to-r bg-clip-text text-transparent ' + gradientCn}
      >
        {labelWord}
      </h2>
      <h3 className="inline-block text-center text-[2em] font-[600] leading-[1.1] tracking-[-.4px] text-[#a3a3a3]">
        {price !== null ? PRICE_FORMAT.format(price) : "???"}
        &nbsp;
        <span className="text-[0.5em] font-[100]">SEK / kWh</span>
      </h3>
    </div>
  );
}
