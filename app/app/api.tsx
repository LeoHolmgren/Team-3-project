import { BiddingZone, PriceData, Location } from '@/app/types';

const bidigit = new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 });

// Call external api to get price for zone
export async function fetchPrice(zone: BiddingZone): Promise<{ arrived: Date; data: PriceData }> {
  const currTime = new Date(Date.now() - 0 * 1000 * 60 * 60 * 24 * 1);
  const year = currTime.getFullYear();
  const month = currTime.getMonth() + 1;
  const day = currTime.getDate();

  const URL =
    'http://127.0.0.1:8000/price-data/date/' +
    year +
    '-' +
    bidigit.format(month) +
    '-' +
    bidigit.format(day) +
    '?price_data_zone=' +
    zone.value;

  return fetch(URL).then(async (response) => {
    if (!response.ok) {
      Promise.reject(Error('Bad response (' + response.status + ') - ' + response.statusText));
    }

    const timeOfData = new Date();
    const json: PriceData = await response.json();

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
