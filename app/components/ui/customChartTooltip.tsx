import { forwardRef } from 'react';
import * as RechartsPrimitive from 'recharts';

const CustomChartTooltipContent = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<'div'> & {
      hideLabel?: boolean;
      hideIndicator?: boolean;
      indicator?: 'line' | 'dot' | 'dashed';
      nameKey?: string;
      labelKey?: string;
    }
>(({ active, payload }, ref) => {
  const time_format: Intl.NumberFormat = new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 });
  const price_format: Intl.NumberFormat = new Intl.NumberFormat('en-US', {
    maximumSignificantDigits: 3,
  });
  const item = payload ? payload[0] : null;

  if (!active || !item) {
    return null;
  }

  return (
    <div ref={ref} className={'bg-background text-[#a3a3a3]'}>
      <h3 className="text-[1.2em] font-[800]">
        {item.payload.time == 24 ? '23:59' : time_format.format(item.payload.time) + ':00'}
      </h3>
      <p className="text-[1em] font-[600]">
        {price_format.format(item.payload.price)} <span className="text-[0.8em] font-[100]">SEK / kWh</span>
      </p>
    </div>
  );
});
CustomChartTooltipContent.displayName = 'ChartTooltip';

export default CustomChartTooltipContent;
