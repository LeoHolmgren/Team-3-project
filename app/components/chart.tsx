'use client';

import { CartesianGrid, XAxis, LabelList, Line, LineChart } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';



const chartData = [
  { day: 'Monday', price: 0.188 },
  { day: 'Tuesday', price: 0.198 },
  { day: 'Wednesday', price: 0.251 },
  { day: 'Thursday', price: 0.291 },
  { day: 'Friday', price: 0.189 },
  { day: 'Saturday', price: 0.245 },
  { day: 'Sunday', price: 0.205 },
];

const chartConfig = {
  price: {
    label: 'Price',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function Chart({ zone }: { zone: string }) {

   // data from the api
  const [chartData, setChartData] = useState<{ day: string, price: number }[]>([]);
  // tracks if the data is currently being fetched
  const [loading, setLoading] = useState(true);
  // captures errors that happen while fetching
  const [error, setError] = useState<string | null>(null);
  // Fetch data from the API
  useEffect(() => {
      const response = await fetch(`/api/price-data/zone/${zone}`);
      console.log(response);
     const fetchData = async () => {
     setLoading(true);
    setError(null);

    try {
      // Fetch data from the FastAPI backend
      // const response = await fetch(`/api/price-data/zone/${zone}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Error fetching data');
      }

      // Formatting data to match the chart
      const formattedData = data.map((item: any) => ({
        day: new Date(item.time_start).toLocaleDateString('en-US', { weekday: 'long' }),  // Format day
        price: item.price_sek,
      }));

      setChartData(formattedData);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchData();

}, [zone]);

  // Handling of loading.. and error
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;


  return (
    <Card>
      <CardHeader>
        <CardTitle>Price chart - {zone}</CardTitle>
        <CardDescription>16.09.2024 - 23.09.2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px]">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 20,
              right: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Line
              dataKey="price"
              type="natural"
              stroke="var(--color-price)"
              strokeWidth={2}
              dot={{
                fill: 'var(--color-price)',
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
