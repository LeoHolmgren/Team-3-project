import { Button } from '@/components/ui/button';
import { BiddingZone, Location } from '@/app/types';
import { useState, MutableRefObject } from 'react';
import { useRef } from 'react';
import { FaLocationDot } from 'react-icons/fa6';
import { ZONES } from '@/app/constants';

export interface LocationController {
  setDisabled: () => void;
}

export enum LocationState {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  UNAVAILABLE = 'unavailable',
  SUCCESS = 'success',
  ERROR = 'error',
}

export function LocationSelectZone({
  controllerRef,
  onSelectZone,
}: {
  controllerRef: MutableRefObject<LocationController | null>;
  onSelectZone: (zone: BiddingZone) => void;
}) {
  const [state, setState] = useState<LocationState>(LocationState.DISABLED);

  const controller = useRef<LocationController>({
    setDisabled: () => {
      setState(LocationState.DISABLED);
    },
  });

  // Hand over controller to calling component
  controllerRef.current = controller.current;

  // TODO: ask our api for zone given location
  const getZone: (location: Location) => Promise<BiddingZone> = (location: Location) => {
    location;
    return new Promise<BiddingZone>((resolve) => {
      return resolve(ZONES[0]);
    });
  };

  const locationEnable = () => {
    setState(LocationState.ENABLED);

    // Try to get the location from browser
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // Browser gave us access to pos, now try to resolve zone
        async (pos) => {
          await getZone({ lat: pos.coords.latitude, lon: pos.coords.longitude })
            .then((zone: BiddingZone) => {
              onSelectZone(zone);
              setState(LocationState.SUCCESS);
            })
            .catch((err) => {
              console.log('[ERROR] location button getZone', err);
              setState(LocationState.ERROR);
            });
        },
        // Client/Brower likely rejected position request
        (err) => {
          console.log('[ERROR] location button getPos', err);
          setState(LocationState.UNAVAILABLE);
        }
      );
    } else {
      // Error, Browser likeloy doesn't support position request
      console.log('[ERROR] location button navigator.geolocation');
      setState(LocationState.UNAVAILABLE);
    }
  };

  return (
    <div className="aspect-square h-[3.5em]">
      <Button
        variant="outline"
        onClick={locationEnable}
        className={
          'h-full w-full justify-center p-[0.5em] text-[1.1em] leading-[1] text-[hsl(var(--text))]' +
          (state == LocationState.ENABLED ? ' !hover:text-[hsl(var(--highlight))] !text-[hsl(var(--highlight))]' : '') +
          (state == LocationState.SUCCESS
            ? ' !hover:text-[hsl(var(--highlight))] !border-[hsl(var(--highlight))] !text-[hsl(var(--highlight))]'
            : '') +
          (state == LocationState.UNAVAILABLE ? ' !text-[hsl(var(--error))]' : '') +
          (state == LocationState.ERROR
            ? ' !hover:text-[hsl(var(--highlight))] !border-[hsl(var(--error))] !text-[hsl(var(--highlight))]'
            : '')
        }
      >
        <FaLocationDot />
      </Button>
    </div>
  );
}
