'use client';

import * as React from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type Status = {
  value: string;
  label: string;
};

const statuses: Status[] = [
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

export function RegionSelect() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [selectedRegion, setSelectedRegion] = React.useState<Status | null>(null);

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-center">
            {selectedRegion ? <>{selectedRegion.label}</> : <>Select Zone</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="center">
          <RegionList setOpen={setOpen} setSelectedRegion={setSelectedRegion} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full justify-center">
          {selectedRegion ? <>{selectedRegion.label}</> : <>Select Zone</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <RegionList setOpen={setOpen} setSelectedRegion={setSelectedRegion} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function RegionList({
  setOpen,
  setSelectedRegion,
}: {
  setOpen: (open: boolean) => void;
  setSelectedRegion: (status: Status | null) => void;
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
                setSelectedRegion(statuses.find((priority) => priority.value === value) || null);
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
