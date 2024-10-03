'use client';

import { MutableRefObject, useState, useRef } from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { FaLocationDot } from 'react-icons/fa6';
import { BiddingZone, Location } from '@/app/types';
import { getBiddingZoneFromLocation } from '@/app/api';
import { HomeState, HomeController } from '@/app/home';

enum LocationState {
  DISABLED="disabled",
  ENABLED="enabled",
  LOADING="loading",
  ERROR="error",
  LOADED="loaded"
}

// State for the region select interface
type RegionSelectState = {
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
  setDataLoaded: () => void;
}

export const ZONES: BiddingZone[] = [
  {
    value: 'SE1',
    label: 'North Sweden',
  },
  {
    value: 'SE2',
    label: 'North Central Sweden',
  },
  {
    value: 'SE3',
    label: 'South Central Sweden',
  },
  {
    value: 'SE4',
    label: 'South Sweden',
  },
];

const bidigit: Intl.NumberFormat = new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 });

export function RegionSelect({
  state,
  homeController,
  controllerRef,
}: {
  state: HomeState;
  homeController: HomeController;
  controllerRef: MutableRefObject<RegionSelectController | null>;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [controllerState, setControllerState] = useState<RegionSelectState>({
    locationState: LocationState.DISABLED,
    location: null,
    locationError: null,
  });

  // Define controller methods that alter controller state for this region select
  const controller = useRef<RegionSelectController>({
    state: controllerState,
    setLocationEnable: () => {
      controller.current.state = {
        ...controller.current.state,
        locationState: LocationState.ENABLED,
        location: null,
      };
      setControllerState(controller.current.state);
    },
    setLocationDisable: () => {
      controller.current.state = {
        ...controller.current.state,
        locationState: LocationState.DISABLED,
        location: null,
      };
      setControllerState(controller.current.state);
    },
    setLocation: async (location: Location) => {
      controller.current.state = {
        ...controller.current.state,
        locationState: LocationState.LOADING,
      };
      setControllerState(controller.current.state);

      let zone;

      try {
        zone = await getBiddingZoneFromLocation(location);
        console.log(zone);
      } catch (e) {
        if (e instanceof Error) {
          controller.current.setLocationError(e);
          return;
        }
        controller.current.setLocationError(Error("Failed to get zone from location"));
        return;
      }

      // Zone is loaded, update state
      controller.current.state = {
        ...controller.current.state,
        locationState: LocationState.LOADED,
      };
      setControllerState(controller.current.state);

      // Tell home component to load new BiddingZone
      const foundZone = ZONES.find((priority) => priority.value === zone)

      if (foundZone) {
        homeController.loadBiddingZone(foundZone);
      } else {
        controller.current.setLocationError(Error("Zone " + zone + " is not in ZONES constant"));
        return;
      }

    },
    setLocationError: (err) => {
      console.log(err);
      controller.current.state = {
        ...controller.current.state,
        locationState: LocationState.ERROR,
      };
      setControllerState(controller.current.state);
    },
    setDataLoaded: () => {
      controller.current.state = {
        ...controller.current.state,
      };
      setControllerState(controller.current.state);
    },
  });

  // Pass controller reference
  controllerRef.current = controller.current;

  let dropdown;

  const dropdown_btn = (
    <div className="h-[3.5em] w-full">
      <div
        className={
          'flex h-full w-full cursor-pointer items-center justify-between whitespace-nowrap rounded-md border border-input bg-background p-[0.5em] text-[1em] text-sm font-medium leading-[1] text-[#a3a3a3] shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50' +
          (state.price === null ? '' : ' !border-[#5164cd]')
        }
      >
        <div className="font-[600] text-[#555]">{state.zone ? state.zone.value : 'ZONE'}</div>
        {state.zone ? state.zone.label : 'Select Zone'}
        <div className="font-[600] text-[#555]">
          {state.timeOfFetch
            ? bidigit.format(state.timeOfFetch.getHours()) + ':' + bidigit.format(state.timeOfFetch.getMinutes())
            : '--:--'}
        </div>
      </div>
    </div>
  );

  async function locationEnable() {

    controller.current.setLocationEnable();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async pos => {
          controller.current.setLocation({lat: pos.coords.latitude, lon: pos.coords.longitude});
        },
        (err) => {
          console.log('get location error', err);
          if (err instanceof Error) {
            controller.current.setLocationError(err);
            return;
          }
          controller.current.setLocationError(Error("Could not get location"));
        }
      );
    }
  }

  const region_list = (
    <Command>
      <CommandInput placeholder="Filter zone..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {ZONES.map((zone) => (
            <CommandItem
              key={zone.value}
              value={zone.label}
              onSelect={(value) => {
                controller.current.setLocationDisable();
                homeController.loadBiddingZone(
                  ZONES.find((priority) => priority.label === value) || ZONES[0]
                );
                setOpen(false);
              }}
            >
              <div>
                <span className="font-[600] text-[#555]">{zone.value}</span>
                &nbsp;
                {zone.label}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );

  if (isDesktop) {
    dropdown = (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{dropdown_btn}</PopoverTrigger>
        <PopoverContent className="p-0" align="center">
          {region_list}
        </PopoverContent>
      </Popover>
    );
  } else {
    dropdown = (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{dropdown_btn}</DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">{region_list}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  const blueIcon: boolean = (
    controllerState.locationState == LocationState.ENABLED ||
    controllerState.locationState == LocationState.LOADING ||
    controllerState.locationState == LocationState.LOADED 
  ); 

  const redIcon: boolean = controllerState.locationState == LocationState.ERROR;

  const blueBorder = controllerState.locationState == LocationState.LOADED;

  return (
    <div className="flex w-[100%] max-w-[406px] gap-[5px] text-[14px]">
      <div className="aspect-square h-[3.5em]">
        <Button
          variant="outline"
          onClick={locationEnable}
          className={
            'h-full w-full justify-center p-[0.5em] text-[1.1em] leading-[1] text-[#555]' +
            (blueIcon  ? ' !hover:text-[#5164cd] !text-[#5164cd]' : '') +
            (redIcon ? ' !hover:text-[#FF0000] !text-[#FF0000]' : '') +
            (blueBorder ? ' !border-[#5164cd]' : '')
          }
        >
          <FaLocationDot />
        </Button>
      </div>
      {dropdown}
    </div>
  );
}
