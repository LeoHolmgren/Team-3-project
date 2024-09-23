'use client';

import { useQuery } from '@tanstack/react-query';
import { RegionSelect, BiddingZone, ZONES } from '@/components/region-select';
import CurrentPrice from '@/components/current-price';
import { useEffect, useState, useRef, MutableRefObject } from 'react';

const PRICE_LABEL = {
  HIGH: <h2 style={{ opacity: "0.85", fontSize: "5em", lineHeight: 1.1, fontWeight: 800 }} className={"inline-block bg-gradient-to-r from-[#cd7a51] to-[#cd5181] bg-clip-text text-transparent"}>HIGH</h2>,
  NORM: <h2 style={{ opacity: "0.85", fontSize: "5em", lineHeight: 1.1, fontWeight: 800 }} className={"inline-block bg-gradient-to-r from-[#5157cd] to-[#51cdc7] bg-clip-text text-transparent"}>NORM</h2>,
  LOW: <h2 style={{ opacity: "0.85", fontSize: "5em", lineHeight: 1.1, fontWeight: 800 }} className={"inline-block bg-gradient-to-r from-[#51cd87] to-[#83cd51] bg-clip-text text-transparent"}>LOW</h2>
}

export default function Home() {
  
  const [selectedZone, setZone] = useState<BiddingZone>(ZONES[0]);

  const { isFetching, error, data, refetch } = useQuery({
    queryKey: ['currentPrice'],
    queryFn: async () => {

      if (region_set_ref.current) {
        region_set_ref.current(false);
      }

      function delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      await delay(500);

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

      if (region_set_ref.current) {
        region_set_ref.current(true);
      }

      return data[hour]['SEK_per_kWh'] as number;
    },
  });

  const setSelectedZoneAndRefetch = (zone: BiddingZone) => {
    setZone(zone);
    refetch();
  }

  const location_set_ref: MutableRefObject<((set: boolean) => void) | null> = useRef(null);
  const region_set_ref: MutableRefObject<((set: boolean) => void) | null> = useRef(null);

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <div className="flex flex-col items-center justify-center gap-6 mt-[70px]">
      
      <CurrentPrice isPending={isFetching} value={data ?? 0} property='Price' label={PRICE_LABEL.LOW} />
      <br />
      <RegionSelect locationSetRef={location_set_ref} regionSetRef={region_set_ref} selectedZone={selectedZone} setSelectedZone={setSelectedZoneAndRefetch} />
      {/* <Chart /> */}

    </div>
  );
}
