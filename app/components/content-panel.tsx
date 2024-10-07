import { HomeState } from '@/app/home';
import getPriceLabel from '@/components/labels';
import CurrentPrice from '@/components/current-price';
import { Chart } from '@/components/chart';
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
  );
}
