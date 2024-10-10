export type PriceData = Array<{ price: number; time: number }>;

export type PriceLevels = {
  high: number;
  low: number;
};

export type BiddingZone = {
  value: string;
  label: string;
};

export const BIDDING_ZONE_KEY = 'BiddingZone';
