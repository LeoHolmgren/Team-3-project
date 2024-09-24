'use client';

import { MutableRefObject, useState, useRef } from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { FaLocationDot } from "react-icons/fa6";

// Bidding zone type
export type BiddingZone = {
  value: string;
  label: string;
};

// State for the region select interface
type RegionSelectState = {
  location_loading: boolean,
  location_loaded: boolean,
  zone_loaded: boolean,
}

// Interface for controlling the Region Controller Visuals
export interface RegionSelectController {
  state: RegionSelectState;
  setLocationLoading: (is_loading: boolean) => void;
  setLocationLoaded: (is_loaded: boolean) => void;
  setRegionLoaded: (is_loaded: boolean) => void;
  setBiddingZoneNoLocation: (zone: BiddingZone) => void; 
};

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

export function RegionSelect({ selectedZone, loadZone, controllerRef }: { selectedZone: BiddingZone | null, loadZone: (zone: BiddingZone) => void, controllerRef: MutableRefObject<RegionSelectController | null>}) {
  
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [controllerState, setControllerState] = useState<RegionSelectState>({location_loading: false, location_loaded: false, zone_loaded: false })
  
  // Define controller methods that alter controller state for this region select
  const controller = useRef<RegionSelectController>({
    state: controllerState,
    setLocationLoading: (is_loading: boolean) => {
      controller.current.state = { ...controller.current.state, location_loading: is_loading, location_loaded: false, zone_loaded: false };
      setControllerState(controller.current.state);
    },
    setLocationLoaded: (is_loaded: boolean) => {
      controller.current.state = { ...controller.current.state, location_loaded: is_loaded };
      setControllerState(controller.current.state);
    },
    setRegionLoaded: (is_loaded: boolean) => {
      controller.current.state = { ...controller.current.state, zone_loaded: is_loaded };
      setControllerState(controller.current.state);
    },
    setBiddingZoneNoLocation: (zone: BiddingZone) => {
      controller.current.state = { ...controller.current.state, location_loading: false, location_loaded: false };
      setControllerState(controller.current.state);
      loadZone(zone);
    }
  });

  // Pass controller reference
  controllerRef.current = controller.current;

  let dropdown;

  const dropdown_btn = <div className="h-[3.5em] w-full">
    <div className={
      "w-full h-full p-[0.5em] text-[1em] leading-[1] cursor-pointer flex justify-between items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground text-[#a3a3a3]" 
      + (controllerState.zone_loaded ? " !border-[#5164cd]" : "")
    }>
      <div className="text-[#555] font-[600]">
        {selectedZone ? selectedZone.value : "ZONE"}
      </div>
      {selectedZone ? selectedZone.label : "Select Zone"}
      <div className="text-[#555] font-[600]">
        20:00
      </div>
    </div>
  </div>;

  async function location_enable() {

    controller.current.setLocationLoading(true);

    function delay(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async pos => {
          console.log("pos", pos.coords.latitude, pos.coords.longitude);
          await delay(500);
          const zone: BiddingZone = ZONES[0];   // TODO: Call our api to get zone from pos.lat, pos.lon
          controller.current.setLocationLoaded(true);
          loadZone(zone);
        },
        err => {
          console.log("get location error", err);
          controller.current.setLocationLoading(false);
        } 
      );
    } else {
      controller.current.setLocationLoading(false);
    }

  } 

  const location = <div className="h-[3.5em] aspect-square">
    <Button 
      variant="outline" 
      onClick={location_enable}
      className={
        "justify-center w-full h-full p-[0.5em] text-[1.1em] leading-[1] text-[#555]" 
        + (controllerState.location_loading ? " !text-[#5164cd] !hover:text-[#5164cd]" : "")
        + (controllerState.location_loaded ? " !border-[#5164cd]" : "")
      } 
    >
      <FaLocationDot />
    </Button>
  </div>;

  const region_list = <Command>
    <CommandInput placeholder="Filter zone..." />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup>
        {ZONES.map((zone) => (
          <CommandItem
            key={zone.value}
            value={zone.label}
            onSelect={(value) => {
              controller.current.setBiddingZoneNoLocation(ZONES.find((priority) => priority.label === value) || ZONES[0]);
              setOpen(false);
            }}
          >
            <div>
              <span className="text-[#555] font-[600]">
                {zone.value}
              </span>
              &nbsp;
              {zone.label}
            </div>
          </CommandItem>
        ))}
      </CommandGroup>
    </CommandList>
  </Command>;

  if (isDesktop) {
    dropdown = (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {dropdown_btn}
        </PopoverTrigger>
        <PopoverContent className="p-0" align="center">
          {region_list}
        </PopoverContent>
      </Popover>
    );
  } else {
    dropdown = <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {dropdown_btn}
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          {region_list}
        </div>
      </DrawerContent>
    </Drawer>
  }

  return (
    <div className='flex gap-[5px] w-[100%] max-w-[26em] text-[14px]'>
      {location}
      {dropdown}
    </div>
  );
}
