import type { Metadata } from 'next';
import HomeComponent from '@/app/home';
import { cookies } from 'next/headers';
import { BiddingZone } from '@/app/types';
import { BIDDING_ZONE_KEY } from '@/app/constants';

function getZoneCookie(): BiddingZone | null {
  const cookie = cookies().get(BIDDING_ZONE_KEY);
  if (cookie) {
    return JSON.parse(cookie.value) as BiddingZone;
  }
  return null;
}

export const metadata: Metadata = {
  title: 'OnOff',
  description: 'Detect electricity price live.',
};

export default function Home() {
  return <HomeComponent initialZone={getZoneCookie()} />;
}
