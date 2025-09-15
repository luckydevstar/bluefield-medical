// app/api/admin/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select('*, slots(*)')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bookings: data });
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();
  if (!id || !status) return NextResponse.json({ error: 'id/status required' }, { status: 400 });

  const { data: b, error: e1 } = await supabaseAdmin.from('bookings').select('*').eq('id', id).single();
  if (e1 || !b) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // on cancel, reopen slot if in future
  const updates: any = { status };
  const { error: e2 } = await supabaseAdmin.from('bookings').update(updates).eq('id', id);
  if (e2) return NextResponse.json({ error: e2.message }, { status: 500 });

  if (status === 'CANCELLED') {
    await supabaseAdmin.from('slots').update({ status: 'OPEN' }).eq('id', b.slot_id);
  }
  return NextResponse.json({ ok: true });
}
