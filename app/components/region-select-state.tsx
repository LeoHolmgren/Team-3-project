import { useState, useRef, RefObject } from 'react';
import { getBiddingZoneFromLocation } from '@/app/api';
import { Location } from '@/app/types';
import { ZONES } from '@/app/constants';
import { HomeController } from '@/app/home-state';

export enum LocationState {
  DISABLED = 'disabled',
  ENABLED = 'enabled',
  LOADING = 'loading',
  ERROR = 'error',
  LOADED = 'loaded',
}

export enum DataState {
  LOADED = 'loaded',
  LOADING = 'loading',
  ERROR = 'error',
  WAITING = 'waiting',
}

// State for the region select interface
export type RegionSelectState = {
  dataState: DataState;
  locationState: LocationState;
  location: Location | null;
  locationError: Error | null;
};

// Interface for controlling the Region Controller Visuals
export interface RegionSelectController {
  state: RegionSelectState;
  setLocationEnable: () => void;
  setLocationDisable: () => void;
  setLocation: (location: Location) => void;
  setLocationError: (err: Error) => void;
  setDataLoading: () => void;
  setDataLoaded: () => void;
}

export function useRegionSelect(
  homeController: RefObject<HomeController>
): [RegionSelectState, RegionSelectController] {
  const [state, setState] = useState<RegionSelectState>({
    dataState: DataState.WAITING,
    locationState: LocationState.DISABLED,
    location: null,
    locationError: null,
  });

  // Define controller methods that alter controller state for this region select
  const controller = useRef<RegionSelectController>({
    state: state,
    setLocationEnable: () => {
      controller.current.state = {
        ...controller.current.state,
        locationState: LocationState.ENABLED,
        location: null,
      };
      setState(controller.current.state);
    },
    setLocationDisable: () => {
      controller.current.state = {
        ...controller.current.state,
        locationState: LocationState.DISABLED,
        location: null,
      };
      setState(controller.current.state);
    },
    setLocation: async (location: Location) => {
      controller.current.state = {
        ...controller.current.state,
        locationState: LocationState.LOADING,
      };
      setState(controller.current.state);

      let zone;

      try {
        zone = await getBiddingZoneFromLocation(location);
      } catch (e) {
        if (e instanceof Error) {
          controller.current.setLocationError(e);
          return;
        }
        controller.current.setLocationError(Error('Failed to get zone from location'));
        return;
      }

      // Zone is loaded, update state
      controller.current.state = {
        ...controller.current.state,
        locationState: LocationState.LOADED,
      };
      setState(controller.current.state);

      // Tell home component to load new BiddingZone
      const foundZone = ZONES.find((priority) => priority.value === zone);

      if (foundZone) {
        homeController.current?.loadBiddingZone(foundZone);
      } else {
        controller.current.setLocationError(Error('Zone ' + zone + ' is not in ZONES constant'));
        return;
      }
    },
    setLocationError: (err) => {
      console.log(err);
      controller.current.state = {
        ...controller.current.state,
        locationState: LocationState.ERROR,
      };
      setState(controller.current.state);
    },
    setDataLoading: () => {
      controller.current.state = {
        ...controller.current.state,
        dataState: DataState.LOADING,
      };
      setState(controller.current.state);
    },
    setDataLoaded: () => {
      controller.current.state = {
        ...controller.current.state,
        dataState: DataState.LOADED,
      };
      setState(controller.current.state);
    },
  });

  return [state, controller.current];
}
