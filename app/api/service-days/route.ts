// app/api/service-days/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locationId = searchParams.get('locationId');
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  let q = supabaseAdmin.from('service_days').select('*').order('service_date', { ascending: true });
  if (locationId) q = q.eq('location_id', locationId);
  if (from) q = q.gte('service_date', from);
  if (to) q = q.lte('service_date', to);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ serviceDays: data });
}
