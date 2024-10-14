import { BiddingZone } from '@/app/types';
import { LocationController } from '@/components/select-zone-location';
import { MutableRefObject } from 'react';
import { useState, useRef } from 'react';

// State for the region select interface
type SelectZoneState = {
  zoneLoaded: boolean;
};

// Interface for controlling the Region Controller Visuals
export interface SelectZoneController {
  state: SelectZoneState;
  setRegionLoaded: (isLoaded: boolean) => void;
  setBiddingZone: (zone: BiddingZone) => void;
  setBiddingZoneKeepLocation: (zone: BiddingZone) => void;
}

export function useSelectZoneContext(
  onSelectZone: (zone: BiddingZone) => void
): [SelectZoneState, SelectZoneController, { location: MutableRefObject<LocationController | null> }] {
  const locationSelectControllerRef = useRef<LocationController>(null);

  const [state, setState] = useState<SelectZoneState>({
    zoneLoaded: false,
  });

  // Define controller methods that alter controller state for this region select
  const controller = useRef<SelectZoneController>({
    state: state,
    setRegionLoaded: (isLoaded: boolean) => {
      controller.current.state = { ...controller.current.state, zoneLoaded: isLoaded };
      setState(controller.current.state);
    },
    setBiddingZone: (zone: BiddingZone) => {
      locationSelectControllerRef.current?.setDisabled();
      onSelectZone(zone);
    },
    setBiddingZoneKeepLocation: (zone: BiddingZone) => {
      onSelectZone(zone);
    },
  });

  return [state, controller.current, { location: locationSelectControllerRef }];
}
