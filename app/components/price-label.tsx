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
      labelWord = "NORM";
    }
  } else {
    gradientCn = "from-[#8f8f8f] to-[#a8a8a8]";
    labelWord = "UNKNOWN";
  }

  return (
    <div className="flex flex-col items-center gap-0 text-[0.8em]">
      <h1 className="inline-block text-[1.7em] font-[400] leading-[1] text-[hsl(var(--text))]">{BIDIGIT.format(time.getHours()) + ":" + BIDIGIT.format(time.getMinutes())}</h1>
      <h2
      className={'inline-block bg-gradient-to-r text-[3.8em] font-[800] bg-clip-text leading-[1] text-transparent ' + gradientCn}
      >
        {labelWord}
      </h2>
      <h3 className="inline-block text-center text-[1.8em] font-[400] leading-[1] tracking-[-.4px] text-[hsl(var(--text))]">
        {price !== null ? PRICE_FORMAT.format(price) : "???"}
        &nbsp;
        <span className="text-[0.75em] dark:font-[100] font-[400]">SEK / kWh</span>
      </h3>
    </div>
  );
}
