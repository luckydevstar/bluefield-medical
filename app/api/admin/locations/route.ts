// app/api/admin/locations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin } from '@/lib/requireAdmin';

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

export async function DELETE(req: NextRequest) {
  const g = await requireAdmin();
  if (!g.ok) return NextResponse.json({ error: 'forbidden' }, { status: g.status });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  // 1) Collect all slot ids under this location (via service days)
  const { data: sdays, error: sdErr } = await supabaseAdmin
    .from('service_days')
    .select('id')
    .eq('location_id', id);

  if (sdErr) return NextResponse.json({ error: sdErr.message }, { status: 500 });

  const sdIds = (sdays ?? []).map(sd => sd.id);
  let slotIds: string[] = [];
  if (sdIds.length > 0) {
    const { data: slots, error: slErr } = await supabaseAdmin
      .from('slots')
      .select('id')
      .in('service_day_id', sdIds);
    if (slErr) return NextResponse.json({ error: slErr.message }, { status: 500 });
    slotIds = (slots ?? []).map(s => s.id);
  }

  if (slotIds.length > 0) {
    // 2) Block if any active bookings
    const { data: activeBookings, error: actErr } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .in('slot_id', slotIds)
      .in('status', ['PENDING', 'CONFIRMED']);

    if (actErr) return NextResponse.json({ error: actErr.message }, { status: 500 });

    if ((activeBookings ?? []).length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete: there are active bookings for this location.' },
        { status: 409 }
      );
    }

    // 3) Remove CANCELLED/EXPIRED bookings first
    const { error: delOld } = await supabaseAdmin
      .from('bookings')
      .delete()
      .in('slot_id', slotIds)
      .in('status', ['CANCELLED', 'EXPIRED']);

    if (delOld) return NextResponse.json({ error: delOld.message }, { status: 500 });
  }

  // 4) Delete the location (service_days and slots cascade)
  const { error: delLoc } = await supabaseAdmin
    .from('locations')
    .delete()
    .eq('id', id);

  if (delLoc) return NextResponse.json({ error: delLoc.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
