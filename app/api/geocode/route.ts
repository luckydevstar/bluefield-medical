import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();

  if (!q) return NextResponse.json({ features: [] });

  // Hit postcodes.io (free UK geocoder)
  const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(q)}`);
  if (!res.ok) return NextResponse.json({ features: [] });

  const data = await res.json();
  if (data.status !== 200 || !data.result) return NextResponse.json({ features: [] });

  const { longitude: lng, latitude: lat } = data.result;
  // Mimic Mapbox-like shape so the client code stays simple
  return NextResponse.json({ features: [{ center: [lng, lat] }] });
}
