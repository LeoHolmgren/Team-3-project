import { HomeState } from '@/app/home-state';
import noZoneSrc from '@/app/public/no-zone.png';
import errorSrc from '@/app/public/error.png';
import Banner from './banner';
import { Chart } from '@/components/chart';

export default function ContentPanel({ state }: { state: HomeState }) {
  if (state.error) {
    return <Banner image={errorSrc} label={`Error ${state.error.message}`} />;
  } else if (state.zone) {
    return (
      <div className="text-[0.9em]">
        <Chart
          state={{
            property: 'Price',
            unit: 'SEK / kWh',
            data: state.fetchData,
            levels: state.priceLevels,
            timestamp: state.timeOfFetch,
          }}
        />
      </div>
    );
  } else {
    return <Banner image={noZoneSrc} label="Zone not specified" />;
  }
}
