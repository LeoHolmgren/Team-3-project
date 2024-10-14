'use client';

import { BiddingZone, Location } from '@/app/types';
import { HomeState } from '@/app/home-context';
import { GetLocationButton, LocationStatus, LocationState } from '@/components/get-location';
import { SelectZonesDropdown } from '@/components/select-zone-dropdown';
import { BIDIGIT } from '@/app/constants';
import { useState, useRef } from 'react';
import { getZoneFromLocation } from '@/app/api';

export function SelectZone({
  homeState,
  onSelectZone,
}: {
  homeState: HomeState;
  onSelectZone: (zone: BiddingZone) => void;
}) {
  const [locationStatus, setLocationStatus] = useState<LocationStatus>(LocationStatus.DEFAULT);

  // Set state of location button
  const setLocationStateRef = useRef<((state: LocationState) => void) | null>(null);

  function setZoneFromLocation(location: Location) {
    getZoneFromLocation(location)
      .then((zone: BiddingZone) => {
        onSelectZone(zone);
        setLocationStatus(LocationStatus.SUCCESS);
      })
      .catch((err: Error) => {
        console.log('[ERROR]: getZoneFromLocation', err);
        setLocationStatus(LocationStatus.ERROR);
      })
      .catch(() => {
        console.log('[ERROR]: getZoneFromLocation');
        setLocationStatus(LocationStatus.ERROR);
      });
  }

  // Select zone to load and deselect location
  function setZoneFromDropdown(zone: BiddingZone) {
    setLocationStatus(LocationStatus.DEFAULT);
    if (setLocationStateRef.current) setLocationStateRef.current(LocationState.DISABLED);
    onSelectZone(zone);
  }

  const dropdown_btn = (
    <div className="h-[3.5em] w-full">
      <div
        className={
          'flex h-full w-full cursor-pointer items-center justify-between whitespace-nowrap rounded-md border border-input bg-background p-[0.5em] text-[1em] text-sm font-medium leading-[1] text-[hsl(var(--text))] shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50' +
          (homeState.fetchData ? ' !border-[hsl(var(--highlight))]' : '')
        }
      >
        <div className="font-[600] text-[hsl(var(--text))] opacity-85 dark:opacity-45">
          {homeState.zone ? homeState.zone.value : 'ZONE'}
        </div>
        {homeState.zone ? homeState.zone.label : 'Select Zone'}
        <div className="font-[600] text-[hsl(var(--text))] opacity-85 dark:opacity-45">
          {homeState.timeOfFetch
            ? BIDIGIT.format(homeState.timeOfFetch.getHours()) +
              ':' +
              BIDIGIT.format(homeState.timeOfFetch.getMinutes())
            : '--:--'}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex w-[100%] max-w-[406px] gap-[5px] text-[14px]">
      <GetLocationButton status={locationStatus} onLocation={setZoneFromLocation} setState={setLocationStateRef} />
      <SelectZonesDropdown onSelectZone={setZoneFromDropdown}>{dropdown_btn}</SelectZonesDropdown>
    </div>
  );
}
