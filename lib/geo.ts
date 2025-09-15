// lib/geo.ts
export async function geocodePostcodeUK(postcode: string) {
    const p = postcode.trim();
    const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(p)}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.result) return null;
    const { latitude, longitude } = data.result;
    return { lat: latitude, lng: longitude };
  }
  
  export function haversineKm(a: {lat:number,lng:number}, b: {lat:number,lng:number}) {
    const toRad = (x:number)=>x*Math.PI/180;
    const R = 6371;
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lng - a.lng);
    const s1 = Math.sin(dLat/2)**2 +
               Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*Math.sin(dLon/2)**2;
    return 2*R*Math.asin(Math.sqrt(s1));
  }
  