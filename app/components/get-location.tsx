import { Button } from '@/components/ui/button';
import { Location } from '@/app/types';
import { MutableRefObject, useState } from 'react';
import { FaLocationDot } from 'react-icons/fa6';

export enum LocationState {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  ERROR = 'error',
}

export enum LocationStatus {
  DEFAULT = 'default',
  SUCCESS = 'success',
  ERROR = 'error',
}

export function GetLocationButton({
  status,
  onLocation,
  setState,
}: {
  status: LocationStatus;
  onLocation: (location: Location) => void;
  setState: MutableRefObject<((state: LocationState) => void) | null>;
}) {
  const [state, isetState] = useState<LocationState>(LocationState.DISABLED);

  // Pass set state to caller
  setState.current = isetState;

  function locationEnable() {
    isetState(LocationState.ENABLED);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => onLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => {
          console.log('[ERROR] location button getPos', err);
          isetState(LocationState.ERROR);
        }
      );
    } else {
      console.log('[ERROR] location button navigator.geolocation');
      isetState(LocationState.ERROR);
    }
  }

  return (
    <div className="aspect-square h-[3.5em]">
      <Button
        variant="outline"
        onClick={locationEnable}
        className={
          'h-full w-full justify-center p-[0.5em] text-[1.1em] leading-[1] text-[hsl(var(--text))]' +
          (state == LocationState.ENABLED ? ' !hover:text-[hsl(var(--highlight))] !text-[hsl(var(--highlight))]' : '') +
          (state == LocationState.ERROR ? ' !text-[hsl(var(--error))]' : '') +
          (status == LocationStatus.SUCCESS ? ' !border-[hsl(var(--highlight))]' : '') +
          (status == LocationStatus.ERROR ? ' !border-[hsl(var(--error))]' : '')
        }
      >
        <FaLocationDot />
      </Button>
    </div>
  );
}
