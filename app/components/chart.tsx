import { ReactElement, ReactNode, useEffect, useRef, useState } from 'react';

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
  setHour;

  useEffect(() => {
    if (refs.label.current && refs.container.current) {
      const l = refs.label.current;
      const hlw = refs.label.current.offsetWidth / 2;
      const cw = refs.container.current.offsetWidth;
      const cx = cw * ((hour + 0.5) / 24);
      const tx = Math.min(Math.max(cx, hlw), cw - hlw);
      l.style.transform = `translate(-50%) translate(${tx}px)`;
    }
  });

  let chartContent: ReactNode;
  let label: ReactNode;

  if (data) {
    const timestamp = new Date();
    const yMax = Math.max(...data);
    const yMin = Math.min(...data);
    const yMinPadded = yMin - (yMax - yMin) * 0.15;

    const bars: Array<ReactElement> = data.map((value, idx) => {
      const percentage: number = (value - yMinPadded) / (yMax - yMinPadded);
      return (
        <div
          style={{ transition: 'filter .1s' }}
          className={'grow flex items-end' + (idx == hour ? ' brightness-[1.30]' : '')}
          onMouseEnter={() => setHour(idx)}
          key={idx}
        >
          <div
            style={{ transition: 'height .2s', backgroundColor: 'hsla(var(--chart))', height: (percentage * 100) + "%" }}
            className="grow basis-[1px]"
          ></div>
        </div>
      );
    });

    label = Label({ value: data[hour], time: new Date(timestamp.setHours(hour, 0)) });
    chartContent = (
      <div className="flex grow items-stretch cursor-pointer pt-[2.5em]" onMouseLeave={() => setHour(new Date().getHours())}>
        {bars}
      </div>
    );
  } else {
    chartContent = (
      <div className="flex grow items-center justify-center">
        <h3>No Data</h3>
      </div>
    );
  }

  // =============================================================================================

  return (
    <div className={containerCn + ' flex flex-col text-[0.9em]'}>
      <div>
        <div ref={refs.label} style={{ transition: 'all 0.2s' }} className="inline-block">
          {label}
        </div>
      </div>
      <div
        ref={refs.container}
        className="relative flex grow touch-pan-y"
        onTouchMove={(e) => {
          if (refs.container.current) {
            const rect = refs.container.current.getBoundingClientRect();
            const p = (e.touches[0].pageX - rect.left) / (rect.right - rect.left);
            const h = Math.floor(p * 24);
            if (h != hour) setHour(h);
          }
        }}
      >
        {chartContent}
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
