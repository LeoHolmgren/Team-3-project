'use client';

import { BiddingZone } from '@/app/types';
import { SelectZone, SelectZoneState, SelectZoneStatus } from '@/components/select-zone';
import Header from '@/app/header';
import Footer from '@/app/footer';
import { AppProvider } from '@/app/appContext';
import { ReactElement, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPrice } from '@/app/api';
import Banner from '@/components/banner';
import noZoneSrc from '@/app/public/no-zone.png';
import errorSrc from '@/app/public/error.png';
import CurrentPrice from '@/components/current-price';
import { PriceLabel } from '@/components/labels';
import { MOCK_PRICE_LEVELS, STORE_HISTORY_COOKIE } from './constants';
import { Chart } from '@/components/chart';
import useCookie from '@/hooks/use-cookie';

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
  const [price, setPrice] = useState<number | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [selectZoneState, setSelectZoneState] = useState<SelectZoneState>(
    loadZone ? { status: SelectZoneStatus.LOADING, zone: loadZone } : { status: SelectZoneStatus.DEFAULT }
  );

  const {
    status: fetchStatus,
    data,
    dataUpdatedAt,
    error: fetchError,
    refetch,
  } = useQuery({
    queryKey: ['GetPrice'],
    queryFn: () => {
      if (zone) return getPrice(zone);
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
  }, [zone]);

  // Query change
  useEffect(() => {
    if (fetchStatus == 'error') {
      setError(fetchError);
    } else if (fetchStatus == 'success' && zone) {
      setSelectZoneState({
        status: SelectZoneStatus.SUCCESS,
        zone: zone,
        time: new Date(dataUpdatedAt),
      });
      setUpdatedAt(new Date(dataUpdatedAt));
      setStatus(HomeStatus.SUCCESS);
    }
  }, [data, fetchError, dataUpdatedAt]);

  useEffect(() => {
    if (data && updatedAt) {
      const price = data.data[new Date(updatedAt).getHours()].price;
      if (price) setPrice(price);
    }
  }, [data, updatedAt]);

  let content: ReactElement = <></>;

  if (status == HomeStatus.NOZONE) {
    content = <Banner image={noZoneSrc} label="Zone not specified" />;
  } else if (status == HomeStatus.ERROR) {
    content = <Banner image={errorSrc} label={`Error ${error ? error.message : 'Error'}`} />;
  }

  return (
    <AppProvider resetAppState={resetState}>
      <Header />
      <div className="flex flex-col items-center justify-center gap-6 pt-24">
        {status == HomeStatus.SUCCESS || status == HomeStatus.LOADING ? (
          <>
            <CurrentPrice
              property="Price"
              label={<PriceLabel price={price} priceLevels={MOCK_PRICE_LEVELS} />}
              value={price}
            />
            <Chart data={data ? data.data : null} timestamp={updatedAt} priceLevels={MOCK_PRICE_LEVELS} />
          </>
        ) : (
          content
        )}
        <SelectZone state={selectZoneState} onError={onError} onSelectZone={onSelectZone} />
        <Footer timestamp={updatedAt} />
      </div>
    </AppProvider>
  );
}
