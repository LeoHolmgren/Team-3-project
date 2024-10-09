import { HomeState } from '@/app/home';
import getPriceLabel from '@/components/labels';
import CurrentPrice from '@/components/current-price';
import { Chart } from '@/components/chart';
import noZoneSrc from '@/app/public/no-zone.png';
import errorSrc from '@/app/public/error.png';
import Banner from './banner';

export default function ContentPanel({ state }: { state: HomeState }) {
  if (state.error) {
    return <Banner image={errorSrc} label={`Error ${state.error.message}`} />;
  } else if (state.zone) {
    return (
      <>
        <CurrentPrice property="Price" label={getPriceLabel(state.priceLevels, state.price)} value={state.price} />
        <Chart data={state.fetchData} timestamp={state.timeOfFetch} priceLevels={state.priceLevels} />
      </>
    );
  } else {
    return <Banner image={noZoneSrc} label="Zone not specified" />;
  }
}
