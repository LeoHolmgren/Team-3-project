import { ReactElement } from 'react';
import { ChartLabel } from '@/components/chart-label';
import { useChartState } from '@/components/chart-state';
import { ChartState } from '@/components/chart-state';

export function Chart({ state }: { state: ChartState }) {
  const xarr = state.data ? state.data.map(({ time }) => time) : [];
  const xMin = Math.min(...xarr);
  const xMax = Math.max(...xarr) + 1000 * 60 * 60;
  const yarr = state.data ? state.data.map(({ price }) => price) : [];
  const yMin = Math.min(...yarr);
  const yMax = Math.max(...yarr);

  const x = state.timestamp ? (state.timestamp.getTime() - 0 * 1000 * 60 * 60 - xMin) / (xMax - xMin) : xMin;

  const props = {
    data: state.data,
    xMin: xMin,
    xMax: xMax,
  };

  const [refs] = useChartState(props);

  refs.props.current = props;

  if (!state.data || !state.data.length) {
    return <div className="flex aspect-[1.4] h-[22em] items-center justify-center text-[0.9em]">No Data</div>;
  }

  const divs: Array<ReactElement> = state.data.map(({ price, time }) => {
    const percentage: number = Math.max((price - yMin) / (yMax - yMin), 0);
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

  const reference: ReactElement = (
    <div
      ref={refs.chartLine}
      style={{
        borderLeft: '1px dotted hsl(var(--text))',
        left: x * 100 + '%',
      }}
      className="t-0 absolute h-full"
    ></div>
  );

  const label: ReactElement = (
    <div ref={refs.label} className="inline-block pb-[1em]">
      <ChartLabel
        initialState={{
          value: 0.1,
          unit: state.unit,
          time: state.timestamp ?? new Date(),
        }}
        setStateRef={refs.setLabelState}
      />
    </div>
  );

  // =============================================================================================

  return (
    <div className="flex aspect-[1.4] h-[22em] max-w-[100%] flex-col text-[0.9em]">
      
      <div ref={refs.labelContainer} className="text-[0.9em]">
        {label}
      </div>
      <div ref={refs.chartContainer} onMouseMove={refs.onChartMouseMove} className="relative flex grow">
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
