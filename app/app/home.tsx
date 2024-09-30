'use client';

import { RegionSelect, BiddingZone, RegionSelectController } from '@/components/region-select';
import CurrentPrice from '@/components/current-price';
import { useState, useRef } from 'react';
import { Chart } from '@/components/chart';
import Footer from './footer';
import Image from 'next/image';
import fetchPrice from '@/app/api';
import getPriceLabel from '@/components/labels';

export type PriceData = Array<{ price: number; time: number }>;

export type PriceLevels = {
  high: number;
  low: number;
};

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
      regionSelectControllerRef.current?.setRegionLoaded(true);
    },
  });

  if (homeState.error) return 'An error has occurred: ' + homeState.error.message;

  const noZoneSelectedPanel = (
    <div className="relative h-[23.5em] w-[100%] max-w-[406px]">
      <Image
        src="https://i.pinimg.com/originals/9a/f9/0f/9af90f155c5d30af21494b2afb3e9431.png"
        className="h-full w-full opacity-35"
        width={624}
        height={468}
        alt="Zone not specified"
      ></Image>
      <h2 className="translate-y[-50%] absolute left-[50%] top-[50%] translate-x-[-50%] text-[1.5em] font-[600] text-[#a3a3a3]">
        No Zone Selected
      </h2>
    </div>
  );

  const pricePanel = (
    <>
      <CurrentPrice
        property="Price"
        label={getPriceLabel(homeState.priceLevels, homeState.price)}
        value={homeState.price}
      />
      <Chart data={homeState.fetchData} timestamp={homeState.timeOfFetch} priceLevels={homeState.priceLevels} />
    </>
  );

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {homeState.zone ? pricePanel : noZoneSelectedPanel}
      <RegionSelect
        selectedZone={homeState.zone}
        timeOfFetch={homeState.timeOfFetch}
        loadZone={homeController.current.loadBiddingZone}
        controllerRef={regionSelectControllerRef}
      />
      <Footer timestamp={homeState.timeOfFetch} />
    </div>
  );
}
