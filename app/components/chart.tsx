'use client';

import { CartesianGrid, XAxis, Line, LineChart, ReferenceLine } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

import { Card, CardContent } from '@/components/ui/card';

const chartConfig = {
  price: {
    label: 'Price',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function Chart({ data, timestamp }: { data: Array<{ SEK_per_kWh: number }> | null; timestamp: Date | null }) {
  const chart = (
    <ChartContainer config={chartConfig} className="min-h-[200px] p-0">
      <LineChart
        accessibilityLayer
        data={data ? [...data, { SEK_per_kWh: data[23]['SEK_per_kWh'] }] : []}
        margin={{
          top: 20,
          left: 20,
          right: 20,
        }}
      >
        <XAxis></XAxis>
        <ReferenceLine x={timestamp ? timestamp.getHours() + 5 : 0} stroke="red" strokeWidth={1} />
        <CartesianGrid vertical={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
        <Line
          dataKey="SEK_per_kWh"
          type="stepAfter"
          stroke="var(--color-price)"
          strokeWidth={1}
          dot={false}
          activeDot={{
            r: 3,
          }}
        ></Line>
      </LineChart>
    </ChartContainer>
  );

  return (
    <Card className="border-0">
      <CardContent className="p-0">{chart}</CardContent>
    </Card>
  );
}
