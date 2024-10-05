'use client';

import { MutableRefObject, useState, useRef } from 'react';

import { BiddingZone } from '@/app/types';

import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { FaLocationDot } from 'react-icons/fa6';

import { HomeState, HomeController } from '@/app/home';

// State for the region select interface
type RegionSelectState = {
  locationLoading: boolean;
  locationLoaded: boolean;
  zoneLoaded: boolean;
};

// Interface for controlling the Region Controller Visuals
export interface RegionSelectController {
  state: RegionSelectState;
  setLocationLoading: (is_loading: boolean) => void;
  setLocationLoaded: (isLoaded: boolean) => void;
  setRegionLoaded: (isLoaded: boolean) => void;
  setBiddingZoneNoLocation: (zone: BiddingZone) => void;
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
    locationLoading: false,
    locationLoaded: false,
    zoneLoaded: false,
  });

  // Define controller methods that alter controller state for this region select
  const controller = useRef<RegionSelectController>({
    state: controllerState,
    setLocationLoading: (is_loading: boolean) => {
      controller.current.state = {
        ...controller.current.state,
        locationLoading: is_loading,
        locationLoaded: false,
        zoneLoaded: false,
      };
      setControllerState(controller.current.state);
    },
    setLocationLoaded: (isLoaded: boolean) => {
      controller.current.state = { ...controller.current.state, locationLoaded: isLoaded };
      setControllerState(controller.current.state);
    },
    setRegionLoaded: (isLoaded: boolean) => {
      controller.current.state = { ...controller.current.state, zoneLoaded: isLoaded };
      setControllerState(controller.current.state);
    },
    setBiddingZoneNoLocation: (zone: BiddingZone) => {
      controller.current.state = { ...controller.current.state, locationLoading: false, locationLoaded: false };
      setControllerState(controller.current.state);
      homeController.loadBiddingZone(zone);
    },
  });

  // Pass controller reference
  controllerRef.current = controller.current;

  let dropdown;

  const dropdown_btn = (
    <div className="h-[3.5em] w-full">
      <div
        className={
          'text[#5A5A5A] flex h-full w-full cursor-pointer items-center justify-between whitespace-nowrap rounded-md border border-input bg-background p-[0.5em] text-[1em] text-sm font-medium leading-[1] shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 dark:text-[#a3a3a3]' +
          (controllerState.zoneLoaded ? ' !border-[#5164cd]' : '')
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
    controller.current.setLocationLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          pos;
          const zone: BiddingZone = ZONES[0]; // TODO: Call our api to get zone from pos.lat, pos.lon
          controller.current.setLocationLoaded(true);
          homeController.loadBiddingZone(zone);
        },
        (err) => {
          console.log('get location error', err);
          controller.current.setLocationLoading(false);
        }
      );
    } else {
      controller.current.setLocationLoading(false);
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
                controller.current.setBiddingZoneNoLocation(
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

  return (
    <div className="flex w-[100%] max-w-[406px] gap-[5px] text-[14px]">
      <div className="aspect-square h-[3.5em]">
        <Button
          variant="outline"
          onClick={locationEnable}
          className={
            'h-full w-full justify-center p-[0.5em] text-[1.1em] leading-[1] text-[#555]' +
            (controllerState.locationLoading ? ' !hover:text-[#5164cd] !text-[#5164cd]' : '') +
            (controllerState.locationLoaded ? ' !border-[#5164cd]' : '')
          }
        >
          <FaLocationDot />
        </Button>
      </div>
      {dropdown}
    </div>
  );
}
