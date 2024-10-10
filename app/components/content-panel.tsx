import { HomeState } from '@/app/home-state';
import getPriceLabel from '@/components/labels';
import CurrentPrice from '@/components/current-price';
import noZoneSrc from '@/app/public/no-zone.png';
import errorSrc from '@/app/public/error.png';
import Banner from './banner';
import { Chart } from '@/components/chart';
import { Chart2 } from './chart2';

export default function ContentPanel({ state }: { state: HomeState }) {
  if (state.error) {
    return <Banner image={errorSrc} label={`Error ${state.error.message}`} />;
  } else if (state.zone) {
    return (
      <>
        <Chart2
          className=""
          property="Price"
          unit="SEK / kWh"
          data={state.fetchData}
          levels={state.priceLevels}
          timestamp={state.timeOfFetch}
        />
      </>
    );
  } else {
    return <Banner image={noZoneSrc} label="Zone not specified" />;
  }
}
