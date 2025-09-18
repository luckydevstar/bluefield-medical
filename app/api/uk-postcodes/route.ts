// app/api/uk-postcodes/route.ts
export const runtime = 'edge';

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] }, { headers: { 'cache-control': 'no-store' } });
  }

  // Postcodes.io partial search, includes lat/lng already
  const url = `https://api.postcodes.io/postcodes?q=${encodeURIComponent(q)}&limit=8`;
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) return NextResponse.json({ results: [] }, { status: 200 });

  const data = await r.json();
  const results =
    (data?.result || []).map((x: any) => ({
      postcode: x.postcode as string,
      lat: x.latitude as number,
      lng: x.longitude as number,
      district: x.admin_district as string | null,
      region: x.region as string | null,
      country: x.country as string | null,
    })) ?? [];

  return NextResponse.json({ results }, { headers: { 'cache-control': 'no-store' } });
}
