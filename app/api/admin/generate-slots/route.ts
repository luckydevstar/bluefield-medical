// app/api/admin/generate-slots/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  const { serviceDayId } = await req.json();
  if (!serviceDayId) return NextResponse.json({ error: 'serviceDayId required' }, { status: 400 });

  const { data: sd, error: sdErr } = await supabaseAdmin
    .from('service_days').select('*').eq('id', serviceDayId).single();
  if (sdErr || !sd) return NextResponse.json({ error: 'Service day not found' }, { status: 404 });

  // Build slot times in local UK time → convert to UTC
  const tz = 'Europe/London'; // adjust if needed
  const startLocal = new Date(`${sd.service_date}T${sd.window_start}Z`);
  const endLocal = new Date(`${sd.service_date}T${sd.window_end}Z`);
  // NOTE: The above assumes your service_day times are already UTC-ish. If not,
  // convert via Temporal or a timezone lib. Keep simple for MVP.

  const slots = [];
  for (let t = +startLocal; t < +endLocal; t += sd.slot_length_minutes * 60_000) {
    const s = new Date(t);
    const e = new Date(t + sd.slot_length_minutes * 60_000);
    slots.push({ service_day_id: sd.id, start_utc: s.toISOString(), end_utc: e.toISOString() });
  }

  // insert with conflict ignore
  const { data, error } = await supabaseAdmin
    .from('slots')
    .insert(slots)
    .select('id, start_utc, end_utc');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ created: data?.length ?? 0 });
}
