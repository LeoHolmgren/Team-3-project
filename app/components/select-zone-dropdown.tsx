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
      <CommandInput placeholder="Filter Zones..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {ZONES.map((zone) => (
            <CommandItem
              key={zone.value + ' ' + zone.label}
              value={zone.value + ' ' + zone.label}
              onSelect={() => {
                onSelectZone(zone);
                setOpen(false);
              }}
            >
              <div className="font-[400] text-[hsl(var(--text))]">
                <span className="font-[600] opacity-65 dark:opacity-45">{zone.value}</span>
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
      <PopoverContent className="min-h-[120px] w-[352px] p-0" align="center">
        {region_list}
      </PopoverContent>
    </Popover>
  );
}
