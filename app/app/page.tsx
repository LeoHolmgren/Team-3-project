import type { Metadata } from 'next';
import HomeComponent from '@/app/home';
import { cookies } from 'next/headers';
import { BiddingZone } from '@/app/types';
import { STORE_HISTORY_COOKIE } from '@/app/constants';

function getZoneCookie(): BiddingZone | null {
  const cookie = cookies().get(STORE_HISTORY_COOKIE);
  if (cookie) {
    return JSON.parse(cookie.value) as BiddingZone;
  }
  return null;
}

export const metadata: Metadata = {
  title: 'OnOff',
  description: 'Detect electricity price live.',
};

// Apparantly this a react way of passing process.env to client??
export const REACT_APP_API_URL = process.env.API_URL;

export default function Home() {
  return <HomeComponent loadZone={getZoneCookie()} />;
}
