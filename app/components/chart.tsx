'use client';

import { XAxis, YAxis, Line, LineChart, ReferenceLine } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

import { Card, CardContent } from '@/components/ui/card';

const chartConfig = {
  price: {
    label: 'Price',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function Chart({
  data,
  timestamp,
  price_levels,
}: {
  data: Array<{ SEK_per_kWh: number }> | null;
  timestamp: Date | null;
  price_levels: { high: number; low: number } | null;
}) {
  const data_formatted = data?.map((obj, i) => {
    return { ...obj, idx: i };
  });

  const chart = (
    <ChartContainer config={chartConfig} className="min-h-[200px] p-0">
      <LineChart
        data={data_formatted ? [...data_formatted, { SEK_per_kWh: data_formatted[23]['SEK_per_kWh'], idx: 24 }] : []}
      >
        <XAxis
          height={15}
          type="number"
          dataKey="idx"
          domain={[0, 24]}
          interval="preserveStartEnd"
          scale="linear"
          ticks={[0, 6, 12, 18, 24]}
          tickFormatter={(num) => (num == 24 ? '23:59' : num + ':00')}
        ></XAxis>
        <YAxis
          scale="linear"
          hide={true}
          domain={[
            (dataMin: number) => Math.floor(dataMin * 100) / 100,
            (dataMax: number) => Math.floor(dataMax * 100 + 1) / 100,
          ]}
        ></YAxis>

        <ReferenceLine
          x={timestamp ? timestamp.getHours() + timestamp.getMinutes() / 60 : 0}
          stroke="#a3a3a3"
          strokeDasharray="1 3"
          strokeWidth={1}
        />
        <ReferenceLine
          y={price_levels?.low ?? 0}
          stroke="#51cd87"
          strokeDasharray="1 3"
          opacity={0.8}
          strokeWidth={1}
        />
        <ReferenceLine
          y={price_levels?.high ?? 0}
          stroke="#cd5181"
          strokeDasharray="1 4"
          opacity={0.8}
          strokeWidth={1}
        />

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
