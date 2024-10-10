'use client';

import { MutableRefObject, useState, RefObject } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FaLocationDot } from 'react-icons/fa6';
import { HomeState, HomeController } from '@/app/home-state';
import { useRegionSelect, RegionSelectController, DataState, LocationState } from '@/components/region-select-state';
import { ZONES } from '@/app/constants';

const bidigit: Intl.NumberFormat = new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 });

export function RegionSelect({
  homeState,
  homeController,
  controllerRef,
}: {
  homeState: HomeState;
  homeController: RefObject<HomeController>;
  controllerRef: MutableRefObject<RegionSelectController | null>;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [state, controller] = useRegionSelect(homeController);

  // Pass controller reference
  controllerRef.current = controller;

  let dropdown;

  const dropdown_btn = (
    <div className="h-[3.5em] w-full">
      <div
        className={
          'flex h-full w-full cursor-pointer items-center justify-between whitespace-nowrap rounded-md border border-input bg-background p-[0.5em] text-[1em] text-sm font-medium leading-[1] text-[#a3a3a3] shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50' +
          (state.dataState === DataState.LOADED ? ' !border-[#5164cd]' : '')
        }
      >
        <div className="font-[600] text-[#555]">{homeState.zone ? homeState.zone.value : 'ZONE'}</div>
        {homeState.zone ? homeState.zone.label : 'Select Zone'}
        <div className="font-[600] text-[#555]">
          {homeState.timeOfFetch
            ? bidigit.format(homeState.timeOfFetch.getHours()) +
              ':' +
              bidigit.format(homeState.timeOfFetch.getMinutes())
            : '--:--'}
        </div>
      </div>
    </div>
  );

  async function locationEnable() {
    controller.setLocationEnable();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          controller.setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        },
        (err) => {
          console.log('get location error', err);
          if (err instanceof Error) {
            controller.setLocationError(err);
            return;
          }
          controller.setLocationError(Error('Could not get location'));
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
                controller.setLocationDisable();
                homeController.current?.loadBiddingZone(ZONES.find((priority) => priority.label === value) || ZONES[0]);
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

  const blueIcon: boolean =
    state.locationState == LocationState.ENABLED ||
    state.locationState == LocationState.LOADING ||
    state.locationState == LocationState.LOADED;

  const redIcon: boolean = state.locationState == LocationState.ERROR;

  const blueBorder = state.locationState == LocationState.LOADED;

  return (
    <div className="flex w-[100%] max-w-[406px] gap-[5px] text-[14px]">
      <div className="aspect-square h-[3.5em]">
        <Button
          variant="outline"
          onClick={locationEnable}
          className={
            'h-full w-full justify-center p-[0.5em] text-[1.1em] leading-[1] text-[#555]' +
            (blueIcon ? ' !hover:text-[#5164cd] !text-[#5164cd]' : '') +
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
