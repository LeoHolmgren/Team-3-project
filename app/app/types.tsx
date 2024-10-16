export type PriceData = Array<{ price: number; time: number }>;

export type Levels = {
  high: number;
  low: number;
};

export type BiddingZone = {
  value: string;
  label: string;
};

export type Location = {
  lat: number;
  lon: number;
};
