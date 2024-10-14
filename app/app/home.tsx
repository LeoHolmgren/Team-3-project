'use client';

import { PriceData, PriceLevels, BiddingZone } from '@/app/types';
import ContentPanel from '@/components/content-panel';
import { RegionSelect, RegionSelectController } from '@/components/select-zone';
import { useState, useRef } from 'react';
import Header from './header';
import Footer from './footer';
import fetchPrice from '@/app/api';
import { AppProvider } from './appContext';
import useCookie from '@/hooks/use-cookie';
import { STORE_HISTORY_COOKIE } from '@/app/constants';

export type HomeState = {
  zone: BiddingZone | null;
  isFetchingPrice: boolean;
  timeOfFetch: Date | null;
  fetchData: PriceData | null;
  price: number | null;
  priceLevels: PriceLevels | null;
  error: Error | null;
};

export interface HomeController {
  state: HomeState;
  setErrorState: (error: Error) => void;
  loadBiddingZone: (zone: BiddingZone) => void;
}

const MOCK_PRICE_LEVELS: PriceLevels = {
  high: 0.2,
  low: 0.1,
};

export default function Home({ loadZone }: { loadZone: BiddingZone | null }) {
  const loaded = useRef<boolean>(false);
  const regionSelectControllerRef = useRef<RegionSelectController>(null);
  const [, setZoneCookie, deleteZoneCookie] = useCookie<BiddingZone | null>(STORE_HISTORY_COOKIE, null);

  const [homeState, setHomeState] = useState<HomeState>({
    zone: loadZone,
    isFetchingPrice: false,
    timeOfFetch: null,
    fetchData: null,
    price: null,
    priceLevels: null,
    error: null,
  });

  // Reset app state when the logo is clicked
  const resetAppState = () => {
    // TODO: if location is used and we to reset it is still highlighted
    // as being used
    regionSelectControllerRef.current?.setRegionLoaded(false);
    setHomeState({
      zone: null,
      isFetchingPrice: false,
      timeOfFetch: null,
      fetchData: null,
      price: null,
      priceLevels: null,
      error: null,
    });
    deleteZoneCookie(); // Clear stored zone from cookies
  };

  // The controller is how other components interract with this component
  const homeController = useRef<HomeController>({
    state: homeState,
    setErrorState: (error: Error) => {
      homeController.current.state = {
        ...homeController.current.state,
        error: error,
      };
      setHomeState(homeController.current.state);
    },
    loadBiddingZone: async (zone: BiddingZone) => {
      // Set zone in both localStorage and state
      homeController.current.state = {
        ...homeController.current.state,
        zone: zone,
        price: null,
        priceLevels: null,
        isFetchingPrice: true,
        error: null,
      };

      // Price starts loading, update state
      regionSelectControllerRef.current?.setRegionLoaded(false);
      setHomeState(homeController.current.state);
      setZoneCookie(zone, { expires: 30 }); // Cookie expires in 30 days

      let response;

      try {
        response = await fetchPrice(zone);
        // throw error here to test error banner
      } catch (e) {
        if (e instanceof Error) {
          homeController.current.setErrorState(e);
          return;
        }
        homeController.current.setErrorState(
          new Error('Could not load current price for bidding zone ' + homeController.current.state.zone?.value)
        );
        return;
      }

      // Price is loaded, update state
      homeController.current.state = {
        ...homeController.current.state,
        isFetchingPrice: false,
        timeOfFetch: response.arrived,
        fetchData: response.data,
        price: response.data[response.arrived.getHours()].price,
        priceLevels: MOCK_PRICE_LEVELS,
      };
      setHomeState(homeController.current.state);
      regionSelectControllerRef.current?.setRegionLoaded(true);
    },
  });

  // On first load, if there is a loadZone, load it
  if (!loaded.current) {
    if (loadZone) homeController.current.loadBiddingZone(loadZone);
    loaded.current = true;
  }

  return (
    <AppProvider resetAppState={resetAppState}>
      <Header />
      <div className="flex flex-col items-center justify-center gap-6 pt-24">
        <ContentPanel state={homeState}></ContentPanel>
        <RegionSelect
          state={homeState}
          homeController={homeController.current}
          controllerRef={regionSelectControllerRef}
        />
        <Footer timestamp={homeState.timeOfFetch} />
      </div>
    </AppProvider>
  );
}
