'use client';

import { useQuery } from '@tanstack/react-query';
import { RegionSelect } from '@/components/region-select';
import CurrentPrice from '@/components/current-price';
import { resolve } from 'path';

export default function Home() {
  // TODO: connect to external API

  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: async () => {

      const currTime = new Date();
      const year = currTime.getFullYear();
      const month = currTime.getMonth() + 1;
      const day = currTime.getDate();
      const hour = currTime.getHours(); 

      const zone = "SE3"
      const URL = "https://www.elprisetjustnu.se/api/v1/prices/" + year + "/0" + month + "-" + day + "_" + zone + ".json";

      const response = await fetch(URL);

      const data = await response.json();

      return data[hour]["SEK_per_kWh"] as number;

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
