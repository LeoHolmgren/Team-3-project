import { BiddingZone, PriceData } from '@/app/types';

const bidigit = new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 });

// Call external api to get price for zone
export default async function fetchPrice(zone: BiddingZone): Promise<{ arrived: Date; data: PriceData }> {
  
  const response = await fetch('http://127.0.0.1:8000/price-data/SE1');
  console.log(response);
  //console.log(await response.text());

  

  const currTime = new Date(Date.now() - 0 * 1000 * 60 * 60 * 24 * 1);
  const year = currTime.getFullYear();
  const month = currTime.getMonth() + 1;
  const day = currTime.getDate();

  const URL =
    'https://www.elprisetjustnu.se/api/v1/prices/' +
    year +
    '/' +
    bidigit.format(month) +
    '-' +
    bidigit.format(day) +
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
