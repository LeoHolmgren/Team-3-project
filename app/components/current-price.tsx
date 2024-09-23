import { ReactElement } from 'react';
import { Skeleton } from './ui/skeleton';

// Container with a property, label & value
export default function CurrentPrice({ isPending, value, property, label, ...objs }: { isPending: boolean; value: number, property: string, label: ReactElement }) {
  return <div className="flex flex-col items-center gap-0" {...objs} >
    {isPending ? (
      <Skeleton className="h-[10em] w-[18em]" />
    ) : (
      <>
        <h1 className="inline-block opacity-85 text-[1.7em] leading-[1.1] font-[100]">{property}</h1>
        {label}
        <h3 className="inline-block opacity-65 text-center text-[2em] leading-[1.1] font-[600] tracking-[-.4px]">
          {new Intl.NumberFormat('en-US', {maximumSignificantDigits: 3}).format(value)}
          &nbsp;
          <span className="text-[0.5em] font-[100]">SEK / kWh</span>
        </h3>
      </>
    )}
  </div>

}
