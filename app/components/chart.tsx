import { ReactElement, TouchEvent, useCallback, useEffect, useRef, useState } from 'react';

export interface ChartLabelProps {
  value: number;
  time: Date;
}

const containerCn = 'aspect-[1.8] h-full text-[hsl(var(--text))] max-w-[100%]';

export function Chart({
  data,
  Label,
}: {
  data: Array<number> | null;
  Label: (props: ChartLabelProps) => ReactElement;
}) {
  const refs = {
    label: useRef<HTMLDivElement>(null),
    container: useRef<HTMLDivElement>(null),
  };

  const [hour, setHour] = useState(new Date().getHours());

  const getBars = useCallback(
    (inData: Array<number> | null, noAnimate?: boolean) => {
      const padd = 0.15;

      let yMax, yMin, yMinPadded: number;

      if (inData) {
        yMax = Math.max(...inData);
        yMin = Math.min(...inData);
        yMinPadded = yMin - (yMax - yMin) * padd;
      } else {
        yMax = 0;
        yMin = 0;
        yMinPadded = 0;
      }

      const bars: Array<ReactElement> = [];

      for (let idx = 0; idx < 24; idx++) {
        const isNumber = inData ? typeof inData[idx] === 'number' : false;
        const value = inData ? (inData[idx] ?? yMin) : yMin;
        const percentage: number = yMax - yMinPadded ? (value - yMinPadded) / (yMax - yMinPadded) : 0;
        //console.log(`ìdx-${idx} - isNumber-${isNumber} - value-${value} - percentage-${percentage} - hour${hour}`);
        bars[idx] = (
          <div
            style={{ transition: noAnimate ? '' : 'all var(--duration)' }}
            className={'flex grow items-end' + (idx == hour ? ' brightness-[1.30]' : '')}
            onMouseEnter={() => setHour(idx)}
            key={idx}
          >
            <div
              style={{
                transition: noAnimate ? '' : 'all var(--duration)',
                backgroundColor: 'hsla(var(--chart))',
                height: percentage * 100 + '%',
                filter: isNumber ? '' : 'saturate(0%)',
              }}
              className="grow basis-[1px]"
            ></div>
          </div>
        );
      }
      return bars;
    },
    [hour]
  );

  const updateLabelState = useCallback(() => {
    if (refs.label.current && refs.container.current) {
      const l = refs.label.current;
      const hlw = refs.label.current.offsetWidth / 2;
      const cw = refs.container.current.offsetWidth;
      const cx = cw * ((hour + 0.5) / 24);
      const tx = Math.min(Math.max(cx, hlw), cw - hlw);
      l.style.transform = `translate(-50%) translate(${tx}px)`;
    }
  }, [hour, refs.container, refs.label]);

  const [bars, setBars] = useState<Array<ReactElement>>(getBars(null, true));

  // On Data change
  useEffect(() => {
    setBars(getBars(data));
  }, [data, getBars]);

  // Time changes we must update label position
  useEffect(() => {
    updateLabelState();
  }, [data, Label, hour, refs.container, refs.label, updateLabelState]);

  // =============================================================================================

  const timestamp = new Date();

  const touchSetHour = (e: TouchEvent) => {
    if (refs.container.current) {
      const rect = refs.container.current.getBoundingClientRect();
      const p = (e.touches[0].pageX - rect.left) / (rect.right - rect.left);
      const h = Math.floor(Math.min(Math.max(p, 0), 0.99) * 24);
      if (h != hour) setHour(h);
    }
  };

  const touchResetHour = () => setHour(new Date().getHours());

  return (
    <div className={containerCn + ' flex flex-col text-[0.9em]'}>
      <div>
        <div ref={refs.label} style={{ transition: 'all var(--ui-duration)' }} className="inline-block">
          {data ? Label({ value: data[hour], time: new Date(timestamp.setHours(hour, 0)) }) : null}
        </div>
      </div>
      <div
        ref={refs.container}
        className="relative flex grow touch-pan-y"
        onTouchMove={touchSetHour}
        onTouchStart={touchSetHour}
        onTouchEnd={touchResetHour}
        onMouseUp={touchResetHour}
      >
        {data ? (
          <div
            className="flex grow cursor-pointer items-stretch pt-[2.5em]"
            onMouseLeave={() => setHour(new Date().getHours())}
          >
            {bars}
          </div>
        ) : (
          <div className="flex grow items-center justify-center">
            <h3 className="text-[2em]">No Data</h3>
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <div style={{ borderTop: '1px solid hsl(var(--text))' }} className="flex h-[0.25em] justify-between opacity-55">
          <div style={{ borderLeft: '1px solid hsl(var(--text))' }}></div>
          <div style={{ borderLeft: '1px solid hsl(var(--text))' }}></div>
          <div style={{ borderLeft: '1px solid hsl(var(--text))' }}></div>
          <div style={{ borderLeft: '1px solid hsl(var(--text))' }}></div>
          <div style={{ borderLeft: '1px solid hsl(var(--text))' }}></div>
        </div>
        <div style={{ fontSize: 'calc(max(0.7em, 11px))' }} className="flex justify-between text-[hsl(var(--text))]">
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
