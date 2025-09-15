// app/api/admin/service-days/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locationId = searchParams.get('locationId');
  let q = supabaseAdmin.from('service_days').select('*, locations(*)').order('service_date', { ascending: true });
  if (locationId) q = q.eq('location_id', locationId);
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ serviceDays: data });
}

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const { locationId, serviceDate, windowStart, windowEnd, slotLengthMinutes, notes } = payload ?? {};
  if (!locationId || !serviceDate || !windowStart || !windowEnd || !slotLengthMinutes) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const { data, error } = await supabaseAdmin
    .from('service_days')
    .insert({
      location_id: locationId,
      service_date: serviceDate,
      window_start: windowStart,
      window_end: windowEnd,
      slot_length_minutes: slotLengthMinutes,
      notes,
    })
    .select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ serviceDay: data });
}
