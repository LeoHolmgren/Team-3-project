import { ReactElement } from 'react';
import { Skeleton } from './ui/skeleton';

// Container with a property, label & value
export default function CurrentPrice({
  isPending,
  value,
  property,
  label,
  ...objs
}: {
  isPending: boolean;
  value: number | null;
  property: string;
  label: ReactElement;
}) {
  return (
    <div className="flex flex-col items-center gap-0" {...objs}>
      {isPending ? (
        <Skeleton className="h-[9.57em] w-[18em]" />
      ) : (
        <>
          <h1 className="inline-block text-[1.7em] font-[100] leading-[1.1] text-[#737373]">{property}</h1>
          {label}
          <h3 className="inline-block text-center text-[2em] font-[600] leading-[1.1] tracking-[-.4px] text-[#a3a3a3]">
            {new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(value ?? 0)}
            &nbsp;
            <span className="text-[0.5em] font-[100]">SEK / kWh</span>
          </h3>
        </>
      )}
    </div>
  );
}
