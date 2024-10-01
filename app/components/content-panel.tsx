import { HomeState } from '@/app/home';
import getPriceLabel from '@/components/labels';
import CurrentPrice from '@/components/current-price';
import { Chart } from '@/components/chart';
import Image from 'next/image';

export default function ContentPanel({ state }: { state: HomeState }) {
  return state.zone ? ( // TODO: check more vars. only show if we should
    <>
      <CurrentPrice property="Price" label={getPriceLabel(state.priceLevels, state.price)} value={state.price} />
      <Chart data={state.fetchData} timestamp={state.timeOfFetch} priceLevels={state.priceLevels} />
    </>
  ) : (
    <div className="relative h-[23.5em] w-[100%] max-w-[406px]">
      <Image
        src="https://i.pinimg.com/originals/9a/f9/0f/9af90f155c5d30af21494b2afb3e9431.png"
        className="h-full w-full opacity-35"
        width={624}
        height={468}
        alt="Zone not specified"
      ></Image>
      <h2 className="translate-y[-50%] absolute left-[50%] top-[50%] translate-x-[-50%] text-[1.5em] font-[600] text-[#a3a3a3]">
        No Zone Selected
      </h2>
    </div>
  );
}
