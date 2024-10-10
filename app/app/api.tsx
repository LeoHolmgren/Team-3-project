import { BiddingZone, PriceData, Location } from '@/app/types';

// Call external api to get price for zone
export async function fetchPrice(zone: BiddingZone): Promise<{ arrived: Date; data: PriceData }> {
  const currTime = Date.now() - 0 * 1000 * 60 * 60 * 24 * 1;
  const start = new Date(currTime).setHours(0, 0, 0);
  const end = new Date(currTime).setHours(23, 59, 59);

  const URL =
    'http://127.0.0.1:8000/price-data?zone=' +
    zone.value +
    '&start=' +
    Math.floor(start / 1000) +
    '&end=' +
    (Math.floor(end / 1000) + 1);

  return fetch(URL).then(async (response) => {
    if (!response.ok) {
      Promise.reject(Error('Bad response (' + response.status + ') - ' + response.statusText));
    }

    const timeOfData = new Date();
    const json_in: PriceData = await response.json();

    const json: PriceData = json_in.map((obj) => {
      return { ...obj, time: new Date(obj.time * 1000).getHours() };
    });

    return {
      arrived: timeOfData,
      data: json,
    };
  });
}

export async function getBiddingZoneFromLocation(location: Location) {
  const response = await fetch(
    'http://127.0.0.1:8000/get-zone-by-location?lat=' + location.lat + '&lon=' + location.lon
  );
  const text = await response.text();
  return text.replaceAll('"', '').split('-').reverse()[0]; // Remove the [SE-]SE3
}
