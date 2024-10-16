import { Button } from '@/components/ui/button';
import { Location } from '@/app/types';
import { FaLocationDot } from 'react-icons/fa6';

export enum LocationStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  ERROR = 'error',
}

export enum LocationResult {
  DEFAULT = 'default',
  SUCCESS = 'success',
  ERROR = 'error',
}

export function LocationButton({
  result,
  status,
  setStatus,
  setResult,
  onLocation,
  onError,
}: {
  result: LocationResult;
  status: LocationStatus;
  setStatus: (status: LocationStatus) => void;
  setResult: (result: LocationResult) => void;
  onLocation: (location: Location) => void;
  onError: (error: Error) => void;
}) {
  function locationEnable() {
    setStatus(LocationStatus.ENABLED);
    setResult(LocationResult.DEFAULT);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => onLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => {
          setStatus(LocationStatus.ERROR);
          onError(Error(err.message));
        }
      );
    } else {
      onError(Error('navigator.geolocation not available'));
    }
  }

  return (
    <div className="aspect-square h-[3.5em]">
      <Button
        variant="outline"
        onClick={locationEnable}
        className={
          'h-full w-full justify-center p-[0.5em] text-[1.1em] leading-[1] text-[hsl(var(--text))]' +
          (status == LocationStatus.ENABLED
            ? ' !hover:text-[hsl(var(--highlight))] !text-[hsl(var(--highlight))]'
            : '') +
          (status == LocationStatus.ERROR ? ' !text-[hsl(var(--error))]' : '') +
          (result == LocationResult.SUCCESS ? ' !border-[hsl(var(--highlight))]' : '') +
          (result == LocationResult.ERROR ? ' !border-[hsl(var(--error))]' : '')
        }
      >
        <FaLocationDot />
      </Button>
    </div>
  );
}
