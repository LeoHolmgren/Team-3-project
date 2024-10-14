'use client';

import { MutableRefObject, useState, useRef } from 'react';
import { BiddingZone } from '@/app/types';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HomeState, HomeController } from '@/app/home';
import { LocationController, LocationSelectZone } from '@/components/select-zone-location';

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
                controller.current.setBiddingZone(ZONES.find((priority) => priority.label === value) || ZONES[0]);
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
      <LocationSelectZone
        controllerRef={locationSelectControllerRef}
        onSelectZone={controller.current.setBiddingZoneKeepLocation}
      />
      {dropdown}
    </div>
  );
}
