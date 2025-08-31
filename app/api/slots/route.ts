import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const locationId = searchParams.get('locationId');
  const date = searchParams.get('date'); // YYYY-MM-DD

  if (!locationId || !date) return NextResponse.json({ data: [] });

  const start = new Date(date + 'T00:00:00Z').toISOString();
  const end   = new Date(date + 'T23:59:59Z').toISOString();

  const { data, error } = await supabaseAdmin
    .from('slots')
    .select('id,start_at,end_at,status')
    .eq('location_id', locationId)
    .gte('start_at', start)
    .lte('end_at', end)
    .eq('status', 'available')
    .order('start_at');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
