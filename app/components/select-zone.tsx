'use client';

import { BiddingZone, Location } from '@/app/types';
import { LocationButton, LocationStatus } from '@/components/location-button';
import { SelectZonesDropdown } from '@/components/select-zone-dropdown';
import { BIDIGIT } from '@/app/constants';
import { useState } from 'react';
import { getZoneFromLocation } from '@/app/api';
import { LocationResult } from './location-button';

export enum SelectZoneStatus {
  ERROR = 'error',
  SUCCESS = 'success',
  LOADING = 'loading',
  DEFAULT = 'default',
}

type ErrorState = {
  status: SelectZoneStatus.ERROR;
  error: Error;
  zone?: BiddingZone;
  time?: Date;
};

type SuccessState = {
  status: SelectZoneStatus.SUCCESS;
  zone: BiddingZone;
  time: Date;
};

type LoadingState = {
  status: SelectZoneStatus.LOADING;
  zone: BiddingZone;
};

type DefaultState = {
  status: SelectZoneStatus.DEFAULT;
};

export type SelectZoneState = ErrorState | SuccessState | LoadingState | DefaultState;

export function SelectZone({
  state,
  onSelectZone,
  onError,
}: {
  state: SelectZoneState;
  onSelectZone: (zone: BiddingZone) => void;
  onError: (err: Error) => void;
}) {
  const [locationStatus, setLocationStatus] = useState<LocationStatus>(LocationStatus.DISABLED);
  const [locationResult, setLocationResult] = useState<LocationResult>(LocationResult.DEFAULT);

  // Load zone from API and select that zone
  function setZoneFromLocation(location: Location) {
    getZoneFromLocation(location)
      .then((zone: BiddingZone) => {
        setLocationResult(LocationResult.SUCCESS);
        onSelectZone(zone);
      })
      .catch((err: Error) => {
        setLocationResult(LocationResult.ERROR);
        if (onError) onError(err);
      })
      .catch(() => {
        setLocationResult(LocationResult.ERROR);
        if (onError) onError(Error('Failed to get zone from location'));
      });
  }

  // Select zone to load and deselect location
  function setZoneFromDropdown(zone: BiddingZone) {
    setLocationStatus(LocationStatus.DISABLED);
    setLocationResult(LocationResult.DEFAULT);
    onSelectZone(zone);
  }

  let containerStyle: string = '';
  let zoneText: string = '';
  let zoneName: string = '';
  let time: string = '';

  if (state.status == SelectZoneStatus.SUCCESS) {
    containerStyle = ' !border-[hsl(var(--highlight))]';
    zoneText = state.zone.value;
    zoneName = state.zone.label;
    time = BIDIGIT.format(state.time.getHours()) + ':' + BIDIGIT.format(state.time.getMinutes());
  } else if (state.status == SelectZoneStatus.ERROR) {
    containerStyle = ' !border-[hsl(var(--error))]';
    zoneText = state.zone ? state.zone.value : 'ERROR';
    zoneName = state.error.message;
    if (state.time) {
      time = BIDIGIT.format(state.time.getHours()) + ':' + BIDIGIT.format(state.time.getMinutes());
    }
  } else if (state.status == SelectZoneStatus.LOADING) {
    zoneText = state.zone.value;
    zoneName = state.zone.label;
  } else {
    zoneName = 'Select Zone';
  }

  const dropdown_btn = (
    <div className="h-[3.5em] w-full">
      <div
        className={
          'flex h-full w-full cursor-pointer items-center justify-between whitespace-nowrap rounded-md border border-input bg-background p-[0.5em] text-[1em] text-sm font-medium leading-[1] text-[hsl(var(--text))] shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50' +
          containerStyle
        }
      >
        <div className="basis-[3em] text-left font-[600] text-[hsl(var(--text))] opacity-85 dark:opacity-45">
          {zoneText}
        </div>
        {zoneName}
        <div className="basis-[3em] text-right font-[600] text-[hsl(var(--text))] opacity-85 dark:opacity-45">
          {time}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex w-[100%] max-w-[406px] gap-[5px] text-[14px]">
      <LocationButton
        status={locationStatus}
        result={locationResult}
        onLocation={setZoneFromLocation}
        setStatus={setLocationStatus}
        setResult={setLocationResult}
        onError={onError}
      />
      <SelectZonesDropdown onSelectZone={setZoneFromDropdown}>{dropdown_btn}</SelectZonesDropdown>
    </div>
  );
}
