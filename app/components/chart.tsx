'use client';

import * as React from 'react';

import { PriceData, PriceLevels } from '@/app/types';

import { XAxis, YAxis, Line, LineChart, ReferenceLine } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Card, CardContent } from '@/components/ui/card';
import CustomChartTooltipContent from '@/components/ui/customChartTooltip';

const chartConfig = {
  price: {
    label: 'Price',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function Chart({
  data,
  timestamp,
  priceLevels,
}: {
  data: PriceData | null;
  timestamp: Date | null;
  priceLevels: PriceLevels | null;
}) {
  const chart = (
    <ChartContainer config={chartConfig} className="min-h-[200px] p-0">
      <LineChart
        // Format data so that the ending is extended one stair step (price is valid that whole hour) (array ++ array[last])
        data={data ? [...data, { price: data[data.length - 1].price, time: data[data.length - 1].time + 1 }] : []}
      >
        <XAxis
          height={15}
          type="number"
          dataKey="time"
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

        <ReferenceLine y={priceLevels?.low ?? 0} stroke="#51cd87" strokeDasharray="1 3" opacity={0.6} strokeWidth={1} />
        <ReferenceLine
          y={priceLevels?.high ?? 0}
          stroke="#cd5181"
          strokeDasharray="1 4"
          opacity={0.8}
          strokeWidth={1}
        />

        <ChartTooltip cursor={false} content={<CustomChartTooltipContent />} />

        <Line
          dataKey="price"
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
