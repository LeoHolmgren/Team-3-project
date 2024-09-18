'use client';

import { useQuery } from '@tanstack/react-query';
import { RegionSelect, Status, statuses } from '@/components/region-select';
import CurrentPrice from '@/components/current-price';
import { resolve } from 'path';
import { useState } from 'react';

export default function Home() {
  const [selectedZone, setSelectedZone] = useState<Status>(statuses[0]);

  console.log(selectedZone);

  const { isPending, error, data } = useQuery({
    queryKey: ['currentPrice'],
    queryFn: async () => {
      const currTime = new Date();
      const year = currTime.getFullYear();
      const month = currTime.getMonth() + 1;
      const day = currTime.getDate();
      const hour = currTime.getHours();

      const URL =
        'https://www.elprisetjustnu.se/api/v1/prices/' +
        year +
        '/0' +
        month +
        '-' +
        day +
        '_' +
        selectedZone.value +
        '.json';

      const response = await fetch(URL);

      const data = await response.json();

      return data[hour]['SEK_per_kWh'] as number;
    },
  });

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-6">
        <CurrentPrice isPending={isPending} value={data ?? 0} />

        <RegionSelect selectedZone={selectedZone} setSelectedZone={setSelectedZone} />

        {/* <Chart /> */}
      </div>
    </div>
  );
}
