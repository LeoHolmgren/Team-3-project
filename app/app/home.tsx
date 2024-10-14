'use client';

import { BiddingZone } from '@/app/types';
import { SelectZone } from '@/components/select-zone';
import Header from '@/app/header';
import Footer from '@/app/footer';
import { AppProvider } from '@/app/appContext';
import { useHomeContext } from '@/app/home-context';
import getPriceLabel from '@/components/labels';
import CurrentPrice from '@/components/current-price';
import { Chart } from '@/components/chart';

import noZoneSrc from '@/app/public/no-zone.png';
import errorSrc from '@/app/public/error.png';
import Banner from '@/components/banner';

export default function Home({ loadZone }: { loadZone: BiddingZone | null }) {
  const [state, controller, refs, reset] = useHomeContext(loadZone);

  let content;

  if (state.error) {
    content = <Banner image={errorSrc} label={`Error ${state.error.message}`} />;
  } else if (state.zone) {
    content = (
      <>
        <CurrentPrice property="Price" label={getPriceLabel(state.priceLevels, state.price)} value={state.price} />
        <Chart data={state.fetchData} timestamp={state.timeOfFetch} priceLevels={state.priceLevels} />
      </>
    );
  } else {
    content = <Banner image={noZoneSrc} label="Zone not specified" />;
  }

  return (
    <AppProvider resetAppState={reset}>
      <Header />
      <div className="flex flex-col items-center justify-center gap-6 pt-24">
        {content}
        <SelectZone
          homeState={state}
          onSelectZone={controller.loadBiddingZone}
          controllerRef={refs.selectZoneControllerRef}
        />
        <Footer timestamp={state.timeOfFetch} />
      </div>
    </AppProvider>
  );
}
