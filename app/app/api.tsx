import { BiddingZone, PriceData, Location } from '@/app/types';

// Call our api
export async function fetchPrice(zone: BiddingZone): Promise<PriceData> {
  /*return [
    { price: 0.1248, time: 0 },
    { price: 0.1047, time: 1 },
    { price: 0.0601, time: 2 },
    { price: 0.041, time: 3 },
    { price: 0.0369, time: 4 },
    { price: 0.093, time: 5 },
    { price: 0.192, time: 6 },
    { price: 0.5006, time: 7 },
    { price: 0.5268, time: 8 },
    { price: 0.3299, time: 9 },
    { price: 0.2208, time: 10 },
    { price: 0.1607, time: 11 },
    { price: 0.048, time: 12 },
    { price: 0.0335, time: 13 },
    { price: 0.0469, time: 14 },
    { price: 0.1594, time: 15 },
    { price: 0.1879, time: 16 },
    { price: 0.1841, time: 17 },
    { price: 0.1822, time: 18 },
    { price: 0.162, time: 19 },
    { price: 0.0697, time: 20 },
    { price: 0.0558, time: 21 },
    { price: 0.0342, time: 22 },
    { price: 0.0076, time: 23 },
  ];*/

  const currTime = Date.now() - 0 * 1000 * 60 * 60 * 24 * 1;
  const start = Math.floor(new Date(currTime).setHours(0, 0, 0) / 1000);
  const end = Math.floor(new Date(currTime).setHours(23, 59, 59) / 1000) + 2;

  const URL = `${process.env.NEXT_PUBLIC_API_URL}/price-data?zone=${zone.value}&start=${start}&end=${end}`;

  return fetch(URL).then(async (response) => {
    if (!response.ok) {
      Promise.reject(Error('Bad response (' + response.status + ') - ' + response.statusText));
    }

    const json_in: PriceData = await response.json();

    const json: PriceData = json_in.map((obj) => {
      return { ...obj, time: new Date(obj.time * 1000).getHours() };
    });

    return json;
  });
}

export async function getZoneFromLocation(location: Location): Promise<BiddingZone> {
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-zone-by-location?lat=${location.lat}&lon=${location.lon}`)
    .then((response) => {
      return response.text();
    })
    .then((text) => {
      return { value: text.replaceAll('"', '').split('-').reverse()[0], label: 'Unknown Name' };
    });
}
