import { MutableRefObject, useState } from 'react';
import { Skeleton } from './ui/skeleton';
import { ChartLabelState } from './chart-state';
import { Levels } from '@/app/types';
import getLabel from '@/components/labels';

const MOCK_PRICE_LEVELS: Levels = {
  high: 0.2,
  low: 0.1,
};

const BIDIGIT = new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 });

// Container with a property, label & value
export function ChartLabel({
  initialState,
  setStateRef,
}: {
  initialState: ChartLabelState;
  setStateRef: MutableRefObject<((setLabelStateRef: ChartLabelState) => void) | null>;
}) {
  const [state, setState] = useState<ChartLabelState>(initialState);

  setStateRef.current = setState;

  return (
    <div suppressHydrationWarning className={'flex flex-col items-center gap-0 text-[hsl(var(--text))]'}>
      <h4 className="text-[1.8em] font-[600] leading-[1]">
        {state.time.getHours() + ':' + BIDIGIT.format(state.time.getMinutes())}
      </h4>
      {getLabel(MOCK_PRICE_LEVELS, state.value)}
      {state.value !== null ? (
        <h3 className="inline-block text-center text-[1.8em] font-[400] leading-[1] tracking-[-.4px]">
          {new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(state.value ?? 0)}
          &nbsp;
          <span className="text-[0.8em] font-[100]">{state.unit}</span>
        </h3>
      ) : (
        <Skeleton className="h-[2.2em] w-[10em]" />
      )}
    </div>
  );
}
