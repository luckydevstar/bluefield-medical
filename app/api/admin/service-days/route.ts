// app/api/admin/service-days/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin } from '@/lib/requireAdmin';

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

export async function DELETE(req: NextRequest) {
  const g = await requireAdmin();
  if (!g.ok) return NextResponse.json({ error: 'forbidden' }, { status: g.status });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  // 1) Find all slot ids under this service day
  const { data: slots, error: slotErr } = await supabaseAdmin
    .from('slots')
    .select('id')
    .eq('service_day_id', id);

  if (slotErr) return NextResponse.json({ error: slotErr.message }, { status: 500 });

  const slotIds = (slots ?? []).map(s => s.id);
  if (slotIds.length > 0) {
    // 2) Any ACTIVE bookings? If yes -> block.
    const { data: activeBookings, error: actErr } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .in('slot_id', slotIds)
      .in('status', ['PENDING', 'CONFIRMED']);

    if (actErr) return NextResponse.json({ error: actErr.message }, { status: 500 });

    if ((activeBookings ?? []).length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete: there are active bookings on this service day.' },
        { status: 409 }
      );
    }

    // 3) Clean up CANCELLED/EXPIRED so FK RESTRICT won't block slot deletes
    const { error: delOld } = await supabaseAdmin
      .from('bookings')
      .delete()
      .in('slot_id', slotIds)
      .in('status', ['CANCELLED', 'EXPIRED']);

    if (delOld) return NextResponse.json({ error: delOld.message }, { status: 500 });
  }

  // 4) Delete the service day (slots will cascade delete)
  const { error: delSd } = await supabaseAdmin
    .from('service_days')
    .delete()
    .eq('id', id);

  if (delSd) return NextResponse.json({ error: delSd.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
