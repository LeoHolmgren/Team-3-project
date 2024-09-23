'use client';

import * as React from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { FaLocationDot } from "react-icons/fa6";

export type Status = {
  value: string;
  label: string;
};

export const statuses: Status[] = [
  {
    value: 'SE1',
    label: 'SE1: Luleå / Norra Sverige',
  },
  {
    value: 'SE2',
    label: 'SE2: Sundsvall / Norra Mellansverige',
  },
  {
    value: 'SE3',
    label: 'SE3: Stockholm / Södra Mellansverige',
  },
  {
    value: 'SE4',
    label: 'SE4: Malmö / Södra Sverige ',
  },
];

export function RegionSelect({ selectedZone, setSelectedZone }: { selectedZone: Status, setSelectedZone: (status: Status) => void }) {
  
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  let dropdown;

  const dropdown_btn = <div className="h-[3.5em] w-full">
    <Button variant="outline" className="w-full h-full justify-center p-[0] text-[1em] leading-[1]">
      {selectedZone ? <>{selectedZone.label}</> : <>Select Zone</>}
    </Button>
  </div>;

  const location = <div className="h-[3.5em] aspect-square">
    <Button variant="outline" className="justify-center w-full h-full p-[0] text-[1.1em] leading-[1]">
      <FaLocationDot />
    </Button>
  </div>;

  const region_list = <Command>
    <CommandInput placeholder="Filter zone..." />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup>
        {statuses.map((status) => (
          <CommandItem
            key={status.value}
            value={status.value}
            onSelect={(value) => {
              setSelectedZone(statuses.find((priority) => priority.value === value) || statuses[0]);
              setOpen(false);
            }}
          >
            {status.label}
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
