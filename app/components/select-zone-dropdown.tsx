import { ReactElement, useState } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ZONES } from '@/app/constants';
import { BiddingZone } from '@/app/types';

export function SelectZonesDropdown({
  children,
  onSelectZone,
}: {
  children: ReactElement;
  onSelectZone: (zone: BiddingZone) => void;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

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
                onSelectZone(ZONES.find((priority) => priority.label === value) || ZONES[0]);
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

  if (!isDesktop) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">{region_list}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="p-0" align="center">
        {region_list}
      </PopoverContent>
    </Popover>
  );
}
