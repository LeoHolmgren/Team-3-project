'use client';

import { useQuery } from '@tanstack/react-query';
import { RegionSelect } from '@/components/region-select';
import { Chart } from '@/components/chart';

export default function Home() {
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ['repoData'],
    queryFn: async () => {
      const response = await fetch('https://api.github.com/repos/TanStack/query');

      return await response.json();
    },
  });

  if (isPending) return 'Loading...';

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <div className="grid justify-center gap-6">
      <div className="grid justify-center">
        <RegionSelect />
      </div>
      <h1 className="text-center text-9xl font-bold">{data.subscribers_count}</h1>
      <Chart />
    </div>
  );
}
