import { ReactElement } from 'react';
import { Skeleton } from './ui/skeleton';

// Container with a property, label & value
export default function CurrentPrice({
  value,
  time,
  label,
}: {
  value: number | null;
  time: string;
  label: ReactElement;
}) {
  return (
    <div suppressHydrationWarning className={'flex flex-col items-center gap-0 text-[hsl(var(--text))]'}>
      <h4 className="text-[1.8em] font-[600] leading-[1]">{time}</h4>
      {label}
      {value !== null ? (
        <h3 className="inline-block text-center text-[1.8em] font-[400] leading-[1] tracking-[-.4px]">
          {new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(value ?? 0)}
          &nbsp;
          <span className="text-[0.8em] font-[100]">SEK / kWh</span>
        </h3>
      ) : (
        <Skeleton className="h-[2.2em] w-[10em]" />
      )}
    </div>
  );
}
