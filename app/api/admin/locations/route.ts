// app/api/admin/locations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  const { data, error } = await supabaseAdmin.from('locations').select('*').order('name');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ locations: data });
}

export async function POST(req: NextRequest) {
  const { name, address, postcode, lat, lng } = await req.json();
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 });
  const { data, error } = await supabaseAdmin.from('locations').insert({ name, address, postcode, lat, lng }).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ location: data });
}
