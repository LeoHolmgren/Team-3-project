'use client';

import { RegionSelect, BiddingZone, RegionSelectController } from '@/components/region-select';
import CurrentPrice from '@/components/current-price';
import { useState, useRef, ReactElement } from 'react';
import { Chart } from '@/components/chart';
import Footer from './footer';
import { Skeleton } from '@/components/ui/skeleton';

const PRICE_LABEL = {
  HIGH: (
    <h2
      style={{ opacity: '0.85', fontSize: '5em', lineHeight: 1.1, fontWeight: 800 }}
      className={'inline-block bg-gradient-to-r from-[#cd7a51] to-[#cd5181] bg-clip-text text-transparent'}
    >
      HIGH
    </h2>
  ),
  NORM: (
    <h2
      style={{ opacity: '0.85', fontSize: '5em', lineHeight: 1.1, fontWeight: 800 }}
      className={'inline-block bg-gradient-to-r from-[#5157cd] to-[#51cdc7] bg-clip-text text-transparent'}
    >
      NORM
    </h2>
  ),
  LOW: (
    <h2
      style={{ opacity: '0.85', fontSize: '5em', lineHeight: 1.1, fontWeight: 800 }}
      className={'inline-block bg-gradient-to-r from-[#51cd87] to-[#83cd51] bg-clip-text text-transparent'}
    >
      LOW
    </h2>
  ),
};

type HomeState = {
  zone: BiddingZone | null;
  is_fetching_price: boolean;
  time_of_fetch: Date | null;
  fetch_data: Array<{ SEK_per_kWh: number }> | null;
  price: number | null;
  error: Error | null;
};

export interface HomeController {
  state: HomeState;
  loadBiddingZone: (zone: BiddingZone) => void;
}

export default function Home() {
  const [homeState, setHomeState] = useState<HomeState>({
    zone: null,
    is_fetching_price: false,
    time_of_fetch: null,
    fetch_data: null,
    price: null,
    error: null,
  });

  const regionSelectControllerRef = useRef<RegionSelectController>(null);

  // Call external api to get price for zone
  const price_api_call = async (zone: BiddingZone) => {
    function delay(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    await delay(500);

    const currTime = new Date();
    const year = currTime.getFullYear();
    const month = currTime.getMonth() + 1;
    const day = currTime.getDate();

    const URL =
      'https://www.elprisetjustnu.se/api/v1/prices/' + year + '/0' + month + '-' + day + '_' + zone.value + '.json';

    return fetch(URL);
  };

  const home_controller = useRef<HomeController>({
    state: homeState,
    loadBiddingZone: async (zone) => {
      home_controller.current.state = {
        ...home_controller.current.state,
        zone: zone,
        price: null,
        is_fetching_price: true,
        error: null,
      };

      // Price starts loading, update state
      regionSelectControllerRef.current?.setRegionLoaded(false);
      setHomeState(home_controller.current.state);

      let response;

      // Error in request occurred, set error state
      function set_error_state() {
        home_controller.current.state = {
          ...home_controller.current.state,
          error: new Error('Could not load current price for bidding zone ' + zone.value),
        };
        setHomeState(home_controller.current.state);
      }

      try {
        response = await price_api_call(zone);
      } catch (exception) {
        set_error_state();
        return;
      }

      if (!response.ok) {
        set_error_state();
      }

      const data = await response.json();
      const time_of_data = new Date();

      // Price is loaded, update state
      home_controller.current.state = {
        ...home_controller.current.state,
        is_fetching_price: false,
        time_of_fetch: time_of_data,
        fetch_data: data,
        price: data[time_of_data.getHours()]['SEK_per_kWh'],
      };
      setHomeState(home_controller.current.state);
      regionSelectControllerRef.current?.setRegionLoaded(true);
    },
  });

  if (homeState.error) return 'An error has occurred: ' + homeState.error.message;

  const mock_price_level: { high: number; low: number } = {
    high: 0.17,
    low: 0.05,
  };

  let used_label: ReactElement;
  if (homeState.price) {
    if (homeState.price >= mock_price_level.high) {
      used_label = PRICE_LABEL.HIGH;
    } else if (homeState.price <= mock_price_level.low) {
      used_label = PRICE_LABEL.LOW;
    } else {
      used_label = PRICE_LABEL.NORM;
    }
  } else {
    used_label = <Skeleton className="h-[5.5em] w-[15em]" />;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {homeState.zone ? (
        <>
          <CurrentPrice property="Price" label={used_label} value={homeState.price} />
          <Chart data={homeState.fetch_data} timestamp={homeState.time_of_fetch} price_levels={mock_price_level} />
        </>
      ) : (
        <div className="relative h-[23.5em] w-[100%] max-w-[406px]">
          <img
            src="https://i.pinimg.com/originals/9a/f9/0f/9af90f155c5d30af21494b2afb3e9431.png"
            className="h-full w-full opacity-35"
          ></img>
          <h2 className="translate-y[-50%] absolute left-[50%] top-[50%] translate-x-[-50%] text-[1.5em] font-[600] text-[#a3a3a3]">
            No Zone Selected
          </h2>
        </div>
      )}
      <RegionSelect
        selectedZone={homeState.zone}
        loadZone={home_controller.current.loadBiddingZone}
        controllerRef={regionSelectControllerRef}
      />
      <Footer timestamp={homeState.time_of_fetch} />
    </div>
  );
}
