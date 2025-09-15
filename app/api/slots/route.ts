// app/api/slots/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const serviceDayId = searchParams.get('serviceDayId');
  if (!serviceDayId) return NextResponse.json({ error: 'serviceDayId required' }, { status: 400 });

  // fetch slots and active holds/bookings in one go
  const { data: slots, error } = await supabaseAdmin
    .from('slots')
    .select('*')
    .eq('service_day_id', serviceDayId)
    .order('start_utc', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: bookings } = await supabaseAdmin
    .from('bookings')
    .select('id, slot_id, status, hold_expires_at');

  const now = new Date();
  const activeBySlot = new Set(
    (bookings ?? [])
      .filter(b => (b.status === 'CONFIRMED') || (b.status === 'PENDING' && b.hold_expires_at && new Date(b.hold_expires_at) > now))
      .map(b => b.slot_id)
  );

  const available = (slots ?? []).filter(s => s.status === 'OPEN' && !activeBySlot.has(s.id));

  return NextResponse.json({ slots: available });
}
