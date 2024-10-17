import { ReactElement } from 'react';
import { useRef } from 'react';

export interface ChartLabelProps {
  value: number;
  time: Date;
}

const containerCn = "aspect-[1.8] h-full text-[hsl(var(--text))]";

export function Chart({ data, Label }: { data: Array<number> | null, Label: (props: ChartLabelProps) => ReactElement }) {

  const refs = {
    line: useRef(null),
    label: useRef(null),
    container: useRef(null),
  }

  if (!data) return <div className={containerCn + " flex items-center justify-center"}>
    <h3>No Data</h3>
  </div>

  const timestamp = new Date();
  const yMax = Math.max(...data);
  const yMin = Math.min(...data);
  const yMinPadded = yMin - (yMax - yMin) * 0.15;

  const current_value: number | undefined | null = data[timestamp.getHours()];

  const divs: Array<ReactElement> = data.map((value, idx) => {
    const percentage: number = (value - yMinPadded) / (yMax - yMinPadded);
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

  // =============================================================================================

  return (
    <div className={containerCn + " flex flex-col text-[0.9em]"}>
      <div ref={refs.label} className="text-[0.9em]">
        {Label({value: current_value, time: timestamp})}
      </div>
      <div ref={refs.container} className="relative flex grow">
        <div className="flex grow pt-[1.5em]">{divs}</div>
      </div>
      <div className="flex flex-col">
        <div style={{ borderTop: '1px solid hsl(var(--text))' }} className="flex h-[0.25em] justify-between opacity-55">
          <div style={{ borderLeft: '1px solid hsl(var(--text))' }}></div>
          <div style={{ borderLeft: '1px solid hsl(var(--text))' }}></div>
          <div style={{ borderLeft: '1px solid hsl(var(--text))' }}></div>
          <div style={{ borderLeft: '1px solid hsl(var(--text))' }}></div>
          <div style={{ borderLeft: '1px solid hsl(var(--text))' }}></div>
        </div>
        <div style={{fontSize: "calc(max(0.7em, 11px))"}} className="flex justify-between text-[hsl(var(--text))]">
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
