import { BiddingZone, PriceData, Location } from '@/app/types';

// Call our api
export async function fetchPrice(zone: BiddingZone): Promise<PriceData> {
  
  const currTime = Date.now() - 1 * 1000 * 60 * 60 * 24 * 1;
  const start = Math.floor(new Date(currTime).setHours(0, 0, 0) / 1000);
  const end = Math.floor(new Date(currTime).setHours(23, 59, 59) / 1000) + 1;

  const URL = `${process.env.NEXT_PUBLIC_API_URL}/price-data?zone=${zone.value}&start=${start}&end=${end}`;
    
  return fetch(URL).then(async (response) => {
    if (!response.ok) {
      Promise.reject(Error('Bad response (' + response.status + ') - ' + response.statusText));
    }

    const json_in: PriceData = await response.json();

    const json: PriceData = json_in.map(obj => {
      return {...obj, time: new Date(obj.time * 1000).getHours()}
    })

    return json;
  });
}

export async function getZoneFromLocation(location: Location): Promise<BiddingZone> {
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-zone-by-location?lat=${location.lat}&lon=${location.lon}`).then(response => {
    return response.text();
  }).then(text => {
    return {value: text.replaceAll('"', '').split('-').reverse()[0], label: "Unknown Name"}; 
  })
}
