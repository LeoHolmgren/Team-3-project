'use client';

import { BiddingZone } from '@/app/types';
import { SelectZone } from '@/components/select-zone';
import Header from '@/app/header';
import Footer from '@/app/footer';
import { AppProvider } from '@/app/appContext';
import { useHomeContext } from '@/app/home-context';
import CurrentPrice from '@/components/current-price';
import { Chart } from '@/components/chart';
import noZoneSrc from '@/app/public/no-zone.png';
import errorSrc from '@/app/public/error.png';
import Banner from '@/components/banner';
import { PriceLabel } from '@/components/labels';

export default function Home({ loadZone }: { loadZone: BiddingZone | null }) {
  const [state, controller, reset] = useHomeContext(loadZone);

  const content = state.error ? (
    <Banner image={errorSrc} label={`Error ${state.error.message}`} />
  ) : state.zone ? (
    <>
      <CurrentPrice
        property="Price"
        label={<PriceLabel price={state.price} priceLevels={state.priceLevels} />}
        value={state.price}
      />
      <Chart data={state.fetchData} timestamp={state.timeOfFetch} priceLevels={state.priceLevels} />
    </>
  ) : (
    <Banner image={noZoneSrc} label="Zone not specified" />
  );

  return (
    <AppProvider resetAppState={reset}>
      <Header />
      <div className="flex flex-col items-center justify-center gap-6 pt-24">
        {content}
        <SelectZone
          error={state.error !== null}
          loaded={state.fetchData !== null}
          zone={state.zone}
          timestamp={state.timeOfFetch}
          onSelectZone={controller.loadBiddingZone}
        />
        <Footer timestamp={state.timeOfFetch} />
      </div>
    </AppProvider>
  );
}
