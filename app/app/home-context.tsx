import { BiddingZone, PriceData, PriceLevels } from '@/app/types';
import { STORE_HISTORY_COOKIE, MOCK_PRICE_LEVELS } from '@/app/constants';

import useCookie from '@/hooks/use-cookie';
import { MutableRefObject, useRef, useState } from 'react';
import { SelectZoneController } from '@/components/select-zone-context';
import fetchPrice from '@/app/api';

// ========================================================================

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

// ========================================================================

export function useHomeContext(
  loadZone: BiddingZone | null
): [HomeState, HomeController, { selectZoneControllerRef: MutableRefObject<SelectZoneController | null> }, () => void] {
  const loaded = useRef<boolean>(false);

  const selectZoneControllerRef = useRef<SelectZoneController>(null);
  const [, setZoneCookie, deleteZoneCookie] = useCookie<BiddingZone | null>(STORE_HISTORY_COOKIE, null);

  const [state, setState] = useState<HomeState>({
    zone: loadZone,
    isFetchingPrice: false,
    timeOfFetch: null,
    fetchData: null,
    price: null,
    priceLevels: null,
    error: null,
  });

  // Reset app state when the logo is clicked
  const resetState = () => {
    // TODO: if location is used and we to reset it is still highlighted
    // as being used
    selectZoneControllerRef.current?.setRegionLoaded(false);
    setState({
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
  const controller = useRef<HomeController>({
    state: state,
    setErrorState: (error: Error) => {
      controller.current.state = {
        ...controller.current.state,
        error: error,
      };
      setState(controller.current.state);
    },
    loadBiddingZone: async (zone: BiddingZone) => {
      // Set zone in both localStorage and state
      controller.current.state = {
        ...controller.current.state,
        zone: zone,
        price: null,
        priceLevels: null,
        isFetchingPrice: true,
        error: null,
      };

      // Price starts loading, update state
      selectZoneControllerRef.current?.setRegionLoaded(false);
      setState(controller.current.state);
      setZoneCookie(zone, { expires: 30 }); // Cookie expires in 30 days

      let response;

      try {
        response = await fetchPrice(zone);
        // throw error here to test error banner
      } catch (e) {
        if (e instanceof Error) {
          controller.current.setErrorState(e);
          return;
        }
        controller.current.setErrorState(
          new Error('Could not load current price for bidding zone ' + controller.current.state.zone?.value)
        );
        return;
      }

      // Price is loaded, update state
      controller.current.state = {
        ...controller.current.state,
        isFetchingPrice: false,
        timeOfFetch: response.arrived,
        fetchData: response.data,
        price: response.data[response.arrived.getHours()].price,
        priceLevels: MOCK_PRICE_LEVELS,
      };
      setState(controller.current.state);
      selectZoneControllerRef.current?.setRegionLoaded(true);
    },
  });

  // On first load, if there is a loadZone, load it
  if (!loaded.current) {
    if (loadZone) controller.current.loadBiddingZone(loadZone);
    loaded.current = true;
  }

  return [state, controller.current, { selectZoneControllerRef: selectZoneControllerRef }, resetState];
}
