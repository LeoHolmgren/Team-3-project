import { PriceData, Levels } from '@/app/types';

import { ReactElement } from 'react';
import CurrentPrice from '@/components/current-price';
import getLabel from '@/components/labels';

const MOCK_PRICE_LEVELS: Levels = {
  high: 0.2,
  low: 0.1,
};

export function Chart2({
  property,
  unit,
  data,
  levels,
  timestamp,
  className,
}: {
  property: string;
  unit: string;
  data: PriceData | null;
  levels: Levels | null;
  timestamp: Date | null;
  className: string;
}) {
  data;
  levels;
  timestamp;

  if (!data) {
    return <div className={'flex aspect-[1.5] h-[20em] items-center justify-center' + className}>No Data</div>;
  }

  const xarr: Array<number> = data.map(({ time }) => time);
  const yarr: Array<number> = data.map(({ price }) => price);
  const yMin: number = Math.min(...yarr);
  const yMax: number = Math.max(...yarr);
  const xMin: number = Math.min(...xarr);
  const xMax: number = Math.max(...xarr);

  const divs: Array<ReactElement> = data.map(({ price, time }) => {
    const percentage: number = Math.max((price - yMin) / yMax, 0);
    //rgba(46, 123, 178, 0.3)
    return (
      <div className="flex grow flex-col" key={time}>
        <div style={{ flexGrow: 1 - percentage }} className="basis-[1px]"></div>
        <div
          style={{ backgroundColor: 'hsla(var(--chart-1), 0.5)', flexGrow: percentage }}
          className="grow basis-[1px]"
        ></div>
      </div>
    );
  });

  const progress: number = timestamp ? (timestamp.getTime() - xMin) / (xMax - xMin) : xMin;

  const reference: ReactElement | null = timestamp ? (
    <div
      style={{
        borderLeft: '1px dotted hsl(var(--text))',
        left: progress * 100 + '%',
      }}
      className="t-0 absolute h-full"
    ></div>
  ) : null;

  const label: ReactElement = (
    <div className="inline-block border-2">
      <CurrentPrice
        value={0.1}
        time={timestamp ? timestamp.getHours() + ':' + timestamp.getMinutes() : '--:--'}
        label={getLabel(MOCK_PRICE_LEVELS, 0.1)}
      />
    </div>
  );

  return (
    <div className={'flex aspect-[1.4] h-[22em] max-w-[100%] flex-col text-[0.9em]' + className}>
      <div className="text-center text-[1.7em] text-[hsl(var(--text))]">
        <h2 className="pb-[1em] font-[300] leading-[0.5em]">{property}</h2>
      </div>
      <div className="py-[0.5em] text-[0.7em]">{label}</div>
      <div className="relative flex grow">
        <div className="flex grow pt-[1.5em]">{divs}</div>
        {reference}
      </div>
      <div className="flex flex-col">
        <div style={{ borderTop: '1px solid hsl(var(--text))' }} className="flex h-[0.25em] justify-between opacity-55">
          <div style={{ borderLeft: '1px solid hsl(var(--text))' }}></div>
          <div style={{ borderLeft: '1px solid hsl(var(--text))' }}></div>
          <div style={{ borderLeft: '1px solid hsl(var(--text))' }}></div>
          <div style={{ borderLeft: '1px solid hsl(var(--text))' }}></div>
          <div style={{ borderLeft: '1px solid hsl(var(--text))' }}></div>
        </div>
        <div className="flex justify-between text-[0.7em] text-[hsl(var(--text))]">
          <div className="w-0">
            <p>0:00</p>
          </div>
          <div className="w-0">
            <p style={{ transform: 'translate(-50%)', width: 'fit-content' }}>6:00</p>
          </div>
          <div className="w-0">
            <p style={{ transform: 'translate(-50%)', width: 'fit-content' }}>12:00</p>
          </div>
          <div className="w-0">
            <p style={{ transform: 'translate(-50%)', width: 'fit-content' }}>18:00</p>
          </div>
          <div className="w-0">
            <p style={{ transform: 'translate(-100%)', width: 'fit-content' }}>23:59</p>
          </div>
        </div>
      </div>
    </div>
  );
}
