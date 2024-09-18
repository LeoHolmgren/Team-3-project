'use client';

import * as React from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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

export function RegionSelect({
  selectedZone,
  setSelectedZone,
}: {
  selectedZone: Status;
  setSelectedZone: (status: Status) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-center">
            {selectedZone ? <>{selectedZone.label}</> : <>Select Zone</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="center">
          <RegionList setOpen={setOpen} setSelectedZone={setSelectedZone} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full justify-center">
          {selectedZone ? <>{selectedZone.label}</> : <>Select Zone</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <RegionList setOpen={setOpen} setSelectedZone={setSelectedZone} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function RegionList({
  setOpen,
  setSelectedZone,
}: {
  setOpen: (open: boolean) => void;
  setSelectedZone: (status: Status) => void;
}) {

  return (
    <Command>
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
    </Command>
  );
}
