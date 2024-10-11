'use client';

import { PriceData, PriceLevels, BiddingZone } from '@/app/types';
import ContentPanel from '@/components/content-panel';
import { RegionSelect, RegionSelectController } from '@/components/region-select';
import { useState, useRef, useLayoutEffect } from 'react';
import Header from './header';
import Footer from './footer';
import fetchPrice from '@/app/api';
import { getStoredBiddingZone, setStoredBiddingZone } from '@/app/local-storage';
import { Skeleton } from '@/components/ui/skeleton';

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

 //Function to clear the zone and reset the app's state to zero
 const resetAppState = () => {
  setZone(null); // Clear the selected zone in localStorage
  setHomeState({
    isFetchingPrice: false,
    timeOfFetch: null,
    fetchData: null,
    price: null,
    priceLevels: null,
    error: null,
  });
};


const MOCK_PRICE_LEVELS: PriceLevels = {
  high: 0.2,
  low: 0.1,
};

export default function Home() {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const regionSelectControllerRef = useRef<RegionSelectController>(null);

  // Set homeState without the 'zone' field as zone is managed separately
  const [homeState, setHomeState] = useState<HomeState>({
    zone: null,
    isFetchingPrice: false,
    timeOfFetch: null,
    fetchData: null,
    price: null,
    priceLevels: null,
    error: null,
  });

   // Reset app state when the logo is clicked
  const resetAppState = () => {
    setHomeState({
      zone: null,
      isFetchingPrice: false,
      timeOfFetch: null,
      fetchData: null,
      price: null,
      priceLevels: null,
      error: null,
    });
    localStorage.removeItem('BiddingZone'); // Clear stored zone from localStorage
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
      setStoredBiddingZone(zone);

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

  useLayoutEffect(() => {
    if (!isLoaded) {
      const biddingZone: BiddingZone | null = getStoredBiddingZone();
      if (biddingZone) homeController.current.loadBiddingZone(biddingZone);
      setIsLoaded(true);
    }
  });

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center">
        <Skeleton className="h-[29.625em] w-[25.375em]" />
        <Footer timestamp={homeState.timeOfFetch} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <Header onClickLogo={resetAppState} />
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
