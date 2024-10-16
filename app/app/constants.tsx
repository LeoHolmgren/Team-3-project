<<<<<<< HEAD
import { PriceLevels, BiddingZone } from '@/app/types';

export const STORE_HISTORY_COOKIE = 'BiddingZone';

export const MOCK_PRICE_LEVELS: PriceLevels = {
  high: 0.2,
  low: 0.1,
};

export const ZONES: BiddingZone[] = [
  {
    value: 'SE1',
    label: 'North Sweden',
  },
  {
    value: 'SE2',
    label: 'North Central Sweden',
  },
  {
    value: 'SE3',
    label: 'South Central Sweden',
  },
  {
    value: 'SE4',
    label: 'South Sweden',
  },
];

export const BIDIGIT: Intl.NumberFormat = new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 });
=======
export const STORE_HISTORY_COOKIE = 'BiddingZone';
>>>>>>> main
