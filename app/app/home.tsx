'use client';

import { useQuery } from '@tanstack/react-query';
import { RegionSelect, Status, statuses } from '@/components/region-select';
import CurrentPrice from '@/components/current-price';
import { useEffect, useState } from 'react';
import { Chart } from '@/components/chart';
import Footer from '@/components/footer';

const PRICE_LABEL = {
  HIGH: (
    <h2
      style={{ opacity: '0.85', fontSize: '5em', lineHeight: 1.1, fontWeight: 800 }}
      className={'inline-block bg-gradient-to-r from-[#cd7a51] to-[#cd5181] bg-clip-text text-transparent'}
    >
      HIGH
    </h2>
  ),
  NORM: (
    <h2
      style={{ opacity: '0.85', fontSize: '5em', lineHeight: 1.1, fontWeight: 800 }}
      className={'inline-block bg-gradient-to-r from-[#5157cd] to-[#51cdc7] bg-clip-text text-transparent'}
    >
      NORM
    </h2>
  ),
  LOW: (
    <h2
      style={{ opacity: '0.85', fontSize: '5em', lineHeight: 1.1, fontWeight: 800 }}
      className={'inline-block bg-gradient-to-r from-[#51cd87] to-[#83cd51] bg-clip-text text-transparent'}
    >
      LOW
    </h2>
  ),
};

export default function Home() {
  const [selectedZone, setSelectedZone] = useState<Status>(statuses[0]);

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ['currentPrice', selectedZone],
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

  useEffect(() => {
    refetch();
  }, [selectedZone]);

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-6">
        <CurrentPrice isPending={isPending} value={data ?? 0} property="Price" label={PRICE_LABEL.NORM} />
        <RegionSelect selectedZone={selectedZone} setSelectedZone={setSelectedZone} />
        <Chart zone={selectedZone.value} />
        <Footer selectedZone={selectedZone} />
      </div>
    </div>
  );
}
