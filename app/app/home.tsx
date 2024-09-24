'use client';

import { useQuery } from '@tanstack/react-query';
import { RegionSelect, BiddingZone, ZONES, RegionSelectController } from '@/components/region-select';
import CurrentPrice from '@/components/current-price';
import { useEffect, useState, useRef, MutableRefObject } from 'react';

const PRICE_LABEL = {
  HIGH: <h2 style={{ opacity: "0.85", fontSize: "5em", lineHeight: 1.1, fontWeight: 800 }} className={"inline-block bg-gradient-to-r from-[#cd7a51] to-[#cd5181] bg-clip-text text-transparent"}>HIGH</h2>,
  NORM: <h2 style={{ opacity: "0.85", fontSize: "5em", lineHeight: 1.1, fontWeight: 800 }} className={"inline-block bg-gradient-to-r from-[#5157cd] to-[#51cdc7] bg-clip-text text-transparent"}>NORM</h2>,
  LOW: <h2 style={{ opacity: "0.85", fontSize: "5em", lineHeight: 1.1, fontWeight: 800 }} className={"inline-block bg-gradient-to-r from-[#51cd87] to-[#83cd51] bg-clip-text text-transparent"}>LOW</h2>
}

type HomeState = {
  zone: BiddingZone | null,
  is_fetching_price: boolean,
  price: number | null,
  error: Error | null,
}

export interface HomeController {
  state: HomeState;
  loadBiddingZone: (zone: BiddingZone) => void
};

export default function Home() {
  
  const [homeState, setHomeState] = useState<HomeState>({zone: null, is_fetching_price: false, price: null, error: null});

  const regionSelectControllerRef = useRef<RegionSelectController>(null);

  // Call external api to get price for zone
  const price_api_call = async (zone: BiddingZone) => {

    function delay(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    await delay(500);

    const currTime = new Date();
    const year = currTime.getFullYear();
    const month = currTime.getMonth() + 1;
    const day = currTime.getDate();

    const URL =
      'https://www.elprisetjustnu.se/api/v1/prices/' +
      year +
      '/0' +
      month +
      '-' +
      day +
      '_' +
      zone.value +
      '.json';

    return fetch(URL);
    
  }

  const home_controller: HomeController = {
    state: homeState,
    loadBiddingZone: async zone => {

      let transform_state = { ...homeState, zone: zone, price: null, is_fetching_price: true, error: null };

      // Price starts loading, update state
      regionSelectControllerRef.current?.setRegionLoaded(false);
      setHomeState(transform_state);
      
      const response = await price_api_call(zone);

      // Error in request occurred, set error state
      if (!response.ok) {
        setHomeState({ ...transform_state, error: new Error("Could not load current price for bidding zone " + zone.value) });
        return;
      }

      // Price is loaded, update state
      setHomeState({ ...transform_state, is_fetching_price: false, price: (await response.json())[(new Date()).getHours()]['SEK_per_kWh'] });
      regionSelectControllerRef.current?.setRegionLoaded(true);

    }
  }

  if (homeState.error) return 'An error has occurred: ' + homeState.error.message;

  return (
    <div className="flex flex-col items-center justify-center gap-6 mt-[70px]">
      
      <CurrentPrice property='Price' label={PRICE_LABEL.LOW} value={homeState.price} isPending={homeState.is_fetching_price} />
      <br />
      <RegionSelect selectedZone={homeState.zone} loadZone={home_controller.loadBiddingZone} controllerRef={regionSelectControllerRef} />
      {/* <Chart /> */}

    </div>
  );
}
