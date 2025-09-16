import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin } from '@/lib/requireAdmin';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const g = await requireAdmin();
  if (!g.ok) return NextResponse.json({ error: 'forbidden' }, { status: g.status });

  const { searchParams } = new URL(req.url);
  const serviceDayId = searchParams.get('serviceDayId');
  if (!serviceDayId) return NextResponse.json({ error: 'serviceDayId required' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('slots')
    .select('id, start_utc, end_utc')
    .eq('service_day_id', serviceDayId)
    .eq('status', 'OPEN')
    .order('start_utc', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ slots: data });
}
