// app/api/uk-postcodes/route.ts
export const runtime = 'edge';

import { NextResponse } from 'next/server';

type Suggestion = {
  postcode: string;
  lat: number;
  lng: number;
  district?: string | null;
  region?: string | null;
  country?: string | null;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] }, { headers: { 'cache-control': 'no-store' } });
  }

  const limit = 8;

  // Hit both endpoints in parallel
  const [pcRes, placeRes] = await Promise.allSettled([
    fetch(`https://api.postcodes.io/postcodes?q=${encodeURIComponent(q)}&limit=${limit}`, {
      cache: 'no-store',
    }),
    fetch(`https://api.postcodes.io/places?q=${encodeURIComponent(q)}&limit=${limit}`, {
      cache: 'no-store',
    }),
  ]);

  // 1) Map postcode matches directly
  let postcodeMatches: Suggestion[] = [];
  if (pcRes.status === 'fulfilled' && pcRes.value.ok) {
    const data = await pcRes.value.json();
    postcodeMatches =
      (data?.result || []).map((x: any) => ({
        postcode: x.postcode as string,
        lat: x.latitude as number,
        lng: x.longitude as number,
        district: (x.admin_district as string) ?? null,
        region: (x.region as string) ?? null,
        country: (x.country as string) ?? null,
      })) ?? [];
  }

  // 2) Map place (town/city) matches -> nearest real postcode via bulk reverse geocode
  let placeMatches: Suggestion[] = [];
  if (placeRes.status === 'fulfilled' && placeRes.value.ok) {
    const placeJson = await placeRes.value.json();
    const places: any[] = placeJson?.result ?? [];

    if (places.length) {
      // Bulk reverse geocode to nearest postcode for each place centroid
      const bulk = await fetch('https://api.postcodes.io/postcodes?limit=1', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          geolocations: places.map((p: any) => ({
            longitude: p.longitude,
            latitude: p.latitude,
            limit: 1,
          })),
        }),
      });

      if (bulk.ok) {
        const bulkJson = await bulk.json();
        placeMatches = places.reduce((acc: Suggestion[], p: any, idx: number) => {
          const nearest = bulkJson?.result?.[idx]?.result?.[0];
          if (!nearest?.postcode) return acc; // skip if we couldn't find a postcode

          acc.push({
            postcode: nearest.postcode as string,
            lat: nearest.latitude as number,
            lng: nearest.longitude as number,
            // Show the human-friendly place on the second line, while keeping region/country
            district: (p.place_name as string) ?? (nearest.admin_district as string) ?? null,
            region: (p.region as string) ?? (nearest.region as string) ?? null,
            country: (p.country as string) ?? (nearest.country as string) ?? null,
          });
          return acc;
        }, []);
      }
    }
  }

  // Merge + de-dup by postcode, then cap to `limit`
  const byPostcode = new Map<string, Suggestion>();
  for (const s of [...postcodeMatches, ...placeMatches]) {
    if (!byPostcode.has(s.postcode)) byPostcode.set(s.postcode, s);
  }
  const results = Array.from(byPostcode.values()).slice(0, limit);

  return NextResponse.json({ results }, { headers: { 'cache-control': 'no-store' } });
}
