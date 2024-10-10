import { BiddingZone } from './types';

const BIDDING_ZONE_KEY = 'BiddingZone';

export function getStoredBiddingZone(): BiddingZone | null {
  try {
    const item = localStorage.getItem(BIDDING_ZONE_KEY);
    if (item) {
      return JSON.parse(item) as BiddingZone;
    }
  } catch (e) {
    console.log(e);
  }

  return null;
}

export function setStoredBiddingZone(zone: BiddingZone) {
  try {
    localStorage.setItem(BIDDING_ZONE_KEY, JSON.stringify(zone));
  } catch (e) {
    console.log(e);
  }
}
