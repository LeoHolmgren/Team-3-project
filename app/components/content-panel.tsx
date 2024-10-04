import { HomeState } from '@/app/home';
import getPriceLabel from '@/components/labels';
import CurrentPrice from '@/components/current-price';
import { Chart } from '@/components/chart';
<<<<<<< HEAD
import Image from 'next/image';
import noZoneSrc from '@/app/res/noZone.png';

export default function ContentPanel({ state }: { state: HomeState }) {
  return state.zone ? ( // TODO: check more vars. only show if we should
    <>
      <CurrentPrice property="Price" label={getPriceLabel(state.priceLevels, state.price)} value={state.price} />
      <Chart zone={state.zone?.value ?? ''} />
    </>
  ) : (
    // No zone selected view
    <div className="relative h-[23.5em] w-[100%] max-w-[406px]">
      <Image
        src={noZoneSrc}
        className="h-full w-full opacity-35"
        width={624}
        height={468}
        alt="Zone not specified"
      ></Image>
      <h2 className="translate-y[-50%] absolute left-[50%] top-[50%] translate-x-[-50%] text-[1.5em] font-[600] text-[#a3a3a3]">
        No Zone Selected
      </h2>
    </div>
=======
import noZoneSrc from '@/app/public/no-zone.png';
import errorSrc from '@/app/public/error.png';
import Banner from './banner';

export default function ContentPanel({ state }: { state: HomeState }) {
  return state.error ? (
    <Banner image={errorSrc} label={`Error ${state.error.message}`} />
  ) : state.zone ? ( // TODO: check more vars. only show if we should
    <>
      <CurrentPrice property="Price" label={getPriceLabel(state.priceLevels, state.price)} value={state.price} />
      <Chart data={state.fetchData} timestamp={state.timeOfFetch} priceLevels={state.priceLevels} />
    </>
  ) : (
    // No zone selected view
    <Banner image={noZoneSrc} label="Zone not specified" />
>>>>>>> d20fd90975157caaf4bd2d1e11d3019d115ecf49
  );
}
