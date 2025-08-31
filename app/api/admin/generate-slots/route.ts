import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getAdmin } from '@/lib/auth';

export async function POST(req: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { location_day_id } = await req.json();
  const { data: day, error } = await supabaseAdmin
    .from('location_days')
    .select('*')
    .eq('id', location_day_id)
    .maybeSingle();
  if (error || !day) return NextResponse.json({ error: 'Day not found' }, { status: 404 });

  const slots = [];
  let t = new Date(day.start_at).getTime();
  const end = new Date(day.end_at).getTime();
  const step = day.slot_minutes * 60 * 1000;

  while (t + step <= end) {
    slots.push({
      location_day_id,
      location_id: day.location_id,
      start_at: new Date(t).toISOString(),
      end_at: new Date(t + step).toISOString(),
      status: 'available' as const,
    });
    t += step;
  }

  const { error: insErr } = await supabaseAdmin.from('slots').insert(slots);
  if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 });

  return NextResponse.json({ ok: true, created: slots.length });
}
