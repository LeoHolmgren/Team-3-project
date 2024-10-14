import { BiddingZone, PriceData } from '@/app/types';
import { ZONES, BIDIGIT } from './constants';
import { Location } from '@/app/types';

// Call external api to get price for zone
export async function getPrice(zone: BiddingZone): Promise<{ arrived: Date; data: PriceData }> {
  const currTime = new Date(Date.now() - 0 * 1000 * 60 * 60 * 24 * 1);
  const year = currTime.getFullYear();
  const month = currTime.getMonth() + 1;
  const day = currTime.getDate();

  const URL =
    'https://www.elprisetjustnu.se/api/v1/prices/' +
    year +
    '/' +
    BIDIGIT.format(month) +
    '-' +
    BIDIGIT.format(day) +
    '_' +
    zone.value +
    '.json';

  return fetch(URL).then(async (response) => {
    if (!response.ok) {
      Promise.reject(Error('Bad response (' + response.status + ') - ' + response.statusText));
    }

    const timeOfData = new Date();
    const json: Array<{ SEK_per_kWh: number }> = await response.json();

    return {
      arrived: timeOfData,
      // Reformat data to be of type { price: number, time: number }
      data: json.map((data: { SEK_per_kWh: number }, idx: number) => {
        return { price: data['SEK_per_kWh'], time: idx };
      }),
    };
  });
}

// TODO: ask our api for zone given location
export async function getZoneFromLocation(location: Location): Promise<BiddingZone> {
  location;
  return new Promise<BiddingZone>((resolve) => {
    return resolve(ZONES[0]);
  });
}
