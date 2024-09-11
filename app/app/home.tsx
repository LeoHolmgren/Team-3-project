'use client';

import { useQuery } from '@tanstack/react-query';
import { RegionSelect } from '@/components/region-select';
import { Chart } from '@/components/chart';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: async () => {
      const response = await fetch('https://api.github.com/repos/TanStack/query');

      return await response.json();
    },
  });

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <div className="m-auto flex max-w-xs flex-col items-center justify-center gap-6">
      <div className="flex justify-center">
        <RegionSelect />
      </div>
      {isPending ? (
        <Skeleton className="h-[120px] w-[250px]" />
      ) : (
        <h1 className="h-[120px] text-center text-9xl font-bold">{data.subscribers_count}</h1>
      )}
      <Chart />
    </div>
  );
}
