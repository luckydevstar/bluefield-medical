// app/api/locations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { geocodePostcodeUK, haversineKm } from '@/lib/geo';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postcode = searchParams.get('postcode');
  const radiusKm = Number(searchParams.get('radiusKm') ?? '50');

  const { data: locations, error } = await supabaseAdmin
    .from('locations')
    .select('*');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (!postcode) return NextResponse.json({ locations });

  const center = await geocodePostcodeUK(postcode);
  if (!center) return NextResponse.json({ error: 'Invalid postcode' }, { status: 400 });

  const within = (locations ?? []).filter((l) => {
    if (l.lat == null || l.lng == null) return false;
    return haversineKm(center, { lat: l.lat, lng: l.lng }) <= radiusKm;
  });

  return NextResponse.json({ locations: within });
}
