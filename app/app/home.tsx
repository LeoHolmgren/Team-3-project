'use client';

import ContentPanel from '@/components/content-panel';
import { RegionSelect } from '@/components/region-select';
import Footer from './footer';
import { useHomeState } from '@/app/home-state';
import { BiddingZone } from '@/app/types';

export default function Home({ initialZone }: { initialZone: BiddingZone | null }) {
  const [state, controller, regionControllerRef] = useHomeState(initialZone);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <ContentPanel state={state}></ContentPanel>
      <RegionSelect state={state} homeController={controller.current} controllerRef={regionControllerRef} />
      <Footer timestamp={state.timeOfFetch} />
    </div>
  );
}
