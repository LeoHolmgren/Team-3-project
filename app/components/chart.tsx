import { ReactElement } from 'react';
import { useRef } from 'react';

export interface ChartLabelProps {
  value: number;
  time: Date;
}

export function Chart({ data, Label }: { data: Array<number>, Label: (props: ChartLabelProps) => ReactElement }) {

  const timestamp = new Date();

  const yMin = Math.min(...data);
  const yMax = Math.max(...data);

  const x = timestamp.getHours() / 24;

  const current_value: number | undefined | null = data[timestamp.getHours()];

  console.log(data, current_value, timestamp.getHours());

  const refs = {
    line: useRef(null),
    label: useRef(null),
    container: useRef(null),
  }

  const divs: Array<ReactElement> = data.map((value, idx) => {
    const percentage: number = (value - yMin) / (yMax - yMin);
    return (
      <div className="flex grow flex-col" key={idx}>
        <div style={{ flexGrow: 1 - percentage }} className="basis-[1px]"></div>
        <div
          style={{ backgroundColor: 'hsla(var(--chart-1), 0.5)', flexGrow: percentage }}
          className="grow basis-[1px]"
        ></div>
      </div>
    );
  });

  const reference: ReactElement = (
    <div
      ref={refs.line}
      style={{
        borderLeft: '1px dotted hsl(var(--text))',
        left: x * 100 + '%',
      }}
      className="t-0 absolute h-full"
    ></div>
  );

  // =============================================================================================

  return (
    <div className="flex aspect-[1.4] h-[22em] max-w-[100%] flex-col text-[0.9em]">
      <div ref={refs.label} className="text-[0.9em]">
        {Label({value: current_value, time: timestamp})}
      </div>
      <div ref={refs.container} className="relative flex grow">
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
