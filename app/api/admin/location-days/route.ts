import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getAdmin } from '@/lib/auth';

export async function POST(req: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = await req.json(); // { location_id, start_at, end_at, slot_minutes }
  const { error } = await supabaseAdmin.from('location_days').insert(payload);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from'); // ISO
  const to   = searchParams.get('to');
  const { data, error } = await supabaseAdmin
    .from('location_days')
    .select('*, locations(name,postcode)')
    .gte('start_at', from ?? new Date().toISOString())
    .lte('end_at', to ?? new Date(Date.now() + 1000*60*60*24*60).toISOString())
    .order('start_at');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
