'use client';

import { BiddingZone, PriceData } from '@/app/types';
import { SelectZone, SelectZoneState, SelectZoneStatus } from '@/components/select-zone';
import Header from '@/app/header';
import Footer from '@/app/footer';
import { AppProvider } from '@/app/appContext';
import { ReactElement, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPrice } from '@/app/api';
import Banner from '@/components/banner';
import noZoneSrc from '@/app/public/no-zone.png';
import errorSrc from '@/app/public/error.png';
import { MOCK_PRICE_LEVELS, STORE_HISTORY_COOKIE } from './constants';
import { Chart, ChartLabelProps } from '@/components/chart';
import useCookie from '@/hooks/use-cookie';
import PriceLabel from '@/components/price-label';

export enum HomeStatus {
  ERROR = 'error',
  NOZONE = 'no-zone',
  LOADING = 'loading',
  SUCCESS = 'success',
}

export default function Home({ loadZone }: { loadZone: BiddingZone | null }) {
  const [, setCookie, deleteCookie] = useCookie<BiddingZone | null>(STORE_HISTORY_COOKIE, null);
  const [status, setStatus] = useState<HomeStatus>(loadZone ? HomeStatus.LOADING : HomeStatus.NOZONE);
  const [zone, setZone] = useState<BiddingZone | null>(loadZone);
  const [data, setData] = useState<PriceData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [selectZoneState, setSelectZoneState] = useState<SelectZoneState>(
    loadZone ? { status: SelectZoneStatus.LOADING, zone: loadZone } : { status: SelectZoneStatus.DEFAULT }
  );

  const {
    data: fetchData,
    dataUpdatedAt,
    error: fetchError,
    refetch,
  } = useQuery({
    queryKey: ['GetPrice'],
    queryFn: () => {
      if (zone) return fetchPrice(zone);
      else throw Error('No Zone Selected');
    },
    enabled: loadZone ? true : false,
  });

  function onError(err: Error) {
    setError(err);
  }

  function onSelectZone(zone: BiddingZone) {
    setZone(zone);
  }

  function resetState() {
    setZone(null);
    deleteCookie();
  }

  // Error set
  useEffect(() => {
    if (error) {
      setSelectZoneState({
        status: SelectZoneStatus.ERROR,
        error: error,
        time: new Date(),
      });
      setStatus(HomeStatus.ERROR);
    }
  }, [error]);

  // Zone Changed
  useEffect(() => {
    if (zone) {
      setSelectZoneState({
        status: SelectZoneStatus.LOADING,
        zone: zone,
      });
      setStatus(HomeStatus.LOADING);
      refetch();
      setCookie(zone);
    } else {
      setSelectZoneState({
        status: SelectZoneStatus.DEFAULT,
      });
      setStatus(HomeStatus.NOZONE);
    }
  }, [zone, refetch, setCookie]);

  // Query set error
  useEffect(() => {
    if (fetchError) setError(fetchError);
  }, [fetchError]);

  // Query set data
  useEffect(() => {
    if (fetchData && dataUpdatedAt && zone) {
      const time = new Date(dataUpdatedAt);
      setSelectZoneState({
        status: SelectZoneStatus.SUCCESS,
        zone: zone,
        time: time,
      });
      setData(fetchData);
      setUpdatedAt(time);
    }
  }, [fetchData, dataUpdatedAt, zone]);

  let content: ReactElement = <></>;

  if (status == HomeStatus.ERROR) {
    content = <Banner image={errorSrc} label={`Error ${error ? error.message : 'Error'}`} />;
  } else if (status == HomeStatus.SUCCESS || status == HomeStatus.LOADING) {
    content = (
      <div className="h-full max-w-[100%] aspect-[1.8] text-[0.8em]">
        <Chart
          data={data ? data.map(({ price }) => price) : null}
          Label={(props: ChartLabelProps) => (
            <PriceLabel priceLevels={MOCK_PRICE_LEVELS} price={props.value} time={props.time} />
          )}
        />
      </div>
    );
  } else {
    content = <Banner image={noZoneSrc} label="Zone not specified" />;
  }

  return (
    <AppProvider resetAppState={resetState}>
      <Header zone={zone?.value} />
      <div className="flex grow flex-col items-center justify-center p-4">
        <div className="grow-[1]"></div>
        <div className="h-[20em] max-w-[100%] py-[1.6em]">{content}</div>
        <div className="grow-[2]"></div>
        <SelectZone state={selectZoneState} onError={onError} onSelectZone={onSelectZone} />
      </div>
      <Footer timestamp={updatedAt} />
    </AppProvider>
  );
}
