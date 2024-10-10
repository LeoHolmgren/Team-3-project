import { BiddingZone } from '@/app/types';
import { PriceData, Levels } from '@/app/types';
import { RegionSelectController } from '@/components/region-select-state';
import { useState, useRef } from 'react';
import { fetchPrice } from '@/app/api';
import { setCookie } from '@/app/client-cookie';
import { useLayoutEffect } from 'react';
import { BIDDING_ZONE_KEY } from '@/app/constants';
import { MutableRefObject } from 'react';

export type HomeState = {
  zone: BiddingZone | null;
  isFetchingPrice: boolean;
  timeOfFetch: Date | null;
  fetchData: PriceData | null;
  price: number | null;
  priceLevels: Levels | null;
  error: Error | null;
};

export interface HomeController {
  state: HomeState;
  setErrorState: (error: Error) => void;
  loadBiddingZone: (zone: BiddingZone) => void;
}

const MOCK_PRICE_LEVELS: Levels = {
  high: 0.2,
  low: 0.1,
};

export function useHomeState(
  initialZone: BiddingZone | null
): [HomeState, MutableRefObject<HomeController>, MutableRefObject<RegionSelectController | null>] {
  const [state, setState] = useState<HomeState>({
    zone: initialZone,
    isFetchingPrice: false,
    timeOfFetch: null,
    fetchData: null,
    price: null,
    priceLevels: null,
    error: null,
  });

  const regionSelectControllerRef = useRef<RegionSelectController | null>(null);
  const triggered = useRef<boolean>(false);

  const homeController = useRef<HomeController>({
    state: state,
    setErrorState: (error: Error) => {
      homeController.current.state = {
        ...homeController.current.state,
        error: error,
      };
      setState(homeController.current.state);
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
      setState(homeController.current.state);
      if (triggered) setCookie<BiddingZone>(BIDDING_ZONE_KEY, zone, null);

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
        fetchData: response.data.length ? response.data : null,
        price: response.data[response.arrived.getHours()]?.price ?? null,
        priceLevels: MOCK_PRICE_LEVELS,
      };
      setState(homeController.current.state);
      regionSelectControllerRef.current?.setDataLoaded();
    },
  });

  // Do once at start
  useLayoutEffect(() => {
    if (!triggered.current) {
      if (initialZone) homeController.current.loadBiddingZone(initialZone);
      triggered.current = true;
    }
  });

  return [state, homeController, regionSelectControllerRef];
}
