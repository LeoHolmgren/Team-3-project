'use client';

import { useQuery } from '@tanstack/react-query';
import { RegionSelect } from '@/components/region-select';
import CurrentPrice from '@/components/current-price';

export default function Home() {
  // TODO: connect to external API

  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: async () => {
      const response = await fetch('https://api.github.com/repos/TanStack/query');

      const data = await response.json();

      return data.stargazers_count as number;
    },
  });

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <div className="m-auto flex max-w-xs flex-col items-center justify-center gap-6">
      <CurrentPrice isPending={isPending} value={data ?? 0} />
      <div className="flex justify-center">
        <RegionSelect />
      </div>
      {/* <Chart /> */}
    </div>
  );
}
