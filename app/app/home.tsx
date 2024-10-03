'use client';

import { PriceData, PriceLevels, BiddingZone } from '@/app/types';

import ContentPanel from '@/components/content-panel';
import { RegionSelect, RegionSelectController } from '@/components/region-select';
import { useState, useRef } from 'react';
import Footer from './footer';
import { fetchPrice } from '@/app/api';

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

export default function Home() {
  const [homeState, setHomeState] = useState<HomeState>({
    zone: null,
    isFetchingPrice: false,
    timeOfFetch: null,
    fetchData: null,
    price: null,
    priceLevels: null,
    error: null,
  });

  const regionSelectControllerRef = useRef<RegionSelectController>(null);

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
    loadBiddingZone: async (zone) => {
      
      // Price starts loading, update state
      homeController.current.state = {
        ...homeController.current.state,
        zone: zone,
        price: null,
        priceLevels: null,
        isFetchingPrice: true,
        error: null,
      };
      setHomeState(homeController.current.state);

      let response;

      try {
        response = await fetchPrice(zone);
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
    },
  });

  if (homeState.error) return 'An error has occurred: ' + homeState.error.message;

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <ContentPanel state={homeState}></ContentPanel>
      <RegionSelect
        state={homeState}
        homeController={homeController.current}
        controllerRef={regionSelectControllerRef}
      />
      <Footer timestamp={homeState.timeOfFetch} />
    </div>
  );
}
