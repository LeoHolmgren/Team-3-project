import { Levels, PriceData } from '@/app/types';
import { MouseEvent, useRef, MutableRefObject } from 'react';

export type ChartState = {
  property: string;
  unit: string;
  data: PriceData | null;
  levels: Levels | null;
  timestamp: Date | null;
};

export type ChartLabelState = {
  value: number | null;
  unit: string;
  time: Date;
};

export type ChartProps = {
  data: PriceData | null;
  xMin: number;
  xMax: number;
};

export type ChartRefs = {
  props: MutableRefObject<ChartProps>;
  labelContainer: MutableRefObject<HTMLDivElement | null>;
  label: MutableRefObject<HTMLDivElement | null>;
  chartLine: MutableRefObject<HTMLDivElement | null>;
  chartContainer: MutableRefObject<HTMLDivElement | null>;
  setLabelState: MutableRefObject<((state: ChartLabelState) => void) | null>;
  onChartMouseMove: (e: MouseEvent) => void;
};

export function useChartState(props: ChartProps): [ChartRefs] {
  const propsRef = useRef<ChartProps>(props);

  const labelContainerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const chartLineRef = useRef<HTMLDivElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const setLabelState = useRef<(state: ChartLabelState) => void>(null);

  // =============================================================================================

  function updateLabelMargin(progress: number) {
    if (!labelContainerRef.current) return;
    if (!labelRef.current) return;

    const cw: number = labelContainerRef.current.offsetWidth;
    const lw: number = labelRef.current.offsetWidth;
    const maxX = cw - lw / 2;
    const minX = lw / 2;

    const m = Math.min(Math.max(progress * cw, minX), maxX);
    labelRef.current.style.transform = 'translate(-50%) translate(' + m + 'px)';
  }

  function updateReferenceLine(progress: number) {
    if (!chartLineRef.current) return;
    chartLineRef.current.style.left = progress * 100 + '%';
  }

  function setProgress(progress: number) {
    updateLabelMargin(progress);
    updateReferenceLine(progress);

    if (!setLabelState.current) return;
    if (!propsRef.current.data || !propsRef.current.data.length) return;

    const p = Math.min(Math.max(0, progress), 0.99999);
    const i = Math.floor(propsRef.current.data.length * p);
    const item = propsRef.current.data[i];
    const time = p * (propsRef.current.xMax - propsRef.current.xMin) + propsRef.current.xMin;
    setLabelState.current({
      value: item.price,
      unit: 'SEK / kWh',
      time: new Date(time),
    });
  }

  function updateReferencePos(e: MouseEvent): void {
    if (!chartContainerRef.current) return;
    if (!chartLineRef.current) return;
    if (!(e.nativeEvent.target instanceof HTMLElement)) return;

    const b = e.nativeEvent.clientX;
    const a = chartContainerRef.current.getBoundingClientRect().x;

    const progress = Math.min(Math.max((b - a) / chartContainerRef.current.offsetWidth, 0), 1);
    setProgress(progress);
  }

  // =============================================================================================

  return [
    {
      props: propsRef,
      labelContainer: labelContainerRef,
      label: labelRef,
      chartLine: chartLineRef,
      chartContainer: chartContainerRef,
      setLabelState: setLabelState,
      onChartMouseMove: updateReferencePos,
    },
  ];
}
