'use client';

import { MutableRefObject, useState, useRef } from 'react';
import { BiddingZone } from '@/app/types';
import { HomeState, HomeController } from '@/app/home';
import { LocationController, LocationSelectZone } from '@/components/select-zone-location';
import { SelectZonesDropdown } from '@/components/select-zone-dropdown';
import { BIDIGIT } from '@/app/constants';

// State for the region select interface
type RegionSelectState = {
  zoneLoaded: boolean;
};

// Interface for controlling the Region Controller Visuals
export interface RegionSelectController {
  state: RegionSelectState;
  setRegionLoaded: (isLoaded: boolean) => void;
  setBiddingZone: (zone: BiddingZone) => void;
  setBiddingZoneKeepLocation: (zone: BiddingZone) => void;
}

export function RegionSelect({
  state,
  homeController,
  controllerRef,
}: {
  state: HomeState;
  homeController: HomeController;
  controllerRef: MutableRefObject<RegionSelectController | null>;
}) {
  const [controllerState, setControllerState] = useState<RegionSelectState>({
    zoneLoaded: false,
  });

  const locationSelectControllerRef = useRef<LocationController>(null);

  // Define controller methods that alter controller state for this region select
  const controller = useRef<RegionSelectController>({
    state: controllerState,
    setRegionLoaded: (isLoaded: boolean) => {
      controller.current.state = { ...controller.current.state, zoneLoaded: isLoaded };
      setControllerState(controller.current.state);
    },
    setBiddingZone: (zone: BiddingZone) => {
      locationSelectControllerRef.current?.setDisabled();
      homeController.loadBiddingZone(zone);
    },
    setBiddingZoneKeepLocation: (zone: BiddingZone) => {
      homeController.loadBiddingZone(zone);
    },
  });

  // Pass controller reference
  controllerRef.current = controller.current;

  const dropdown_btn = (
    <div className="h-[3.5em] w-full">
      <div
        className={
          'text[#5A5A5A] flex h-full w-full cursor-pointer items-center justify-between whitespace-nowrap rounded-md border border-input bg-background p-[0.5em] text-[1em] text-sm font-medium leading-[1] shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 dark:text-[#a3a3a3]' +
          (controllerState.zoneLoaded ? ' !border-[hsl(var(--highlight))]' : '')
        }
      >
        <div className="font-[600] text-[#555]">{state.zone ? state.zone.value : 'ZONE'}</div>
        {state.zone ? state.zone.label : 'Select Zone'}
        <div className="font-[600] text-[#555]">
          {state.timeOfFetch
            ? BIDIGIT.format(state.timeOfFetch.getHours()) + ':' + BIDIGIT.format(state.timeOfFetch.getMinutes())
            : '--:--'}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex w-[100%] max-w-[406px] gap-[5px] text-[14px]">
      <LocationSelectZone
        controllerRef={locationSelectControllerRef}
        onSelectZone={controller.current.setBiddingZoneKeepLocation}
      />
      <SelectZonesDropdown onSelectZone={controller.current.setBiddingZone}>{dropdown_btn}</SelectZonesDropdown>
    </div>
  );
}
