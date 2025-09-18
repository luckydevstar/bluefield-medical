// app/api/admin/bookings/[id]/reschedule/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin } from '@/lib/requireAdmin';
import { makeIcs } from '@/lib/ics';

// normalize possibly-array nested relations into a simple shape
function normalizeSlotDetail(s: any) {
  const sd = Array.isArray(s?.service_days) ? s.service_days[0] : s?.service_days;
  const loc = Array.isArray(sd?.locations) ? sd.locations[0] : sd?.locations;
  return {
    start_utc: s?.start_utc as string | undefined,
    end_utc: s?.end_utc as string | undefined,
    service_date: sd?.service_date as string | undefined,
    location: {
      name: loc?.name as string | undefined,
      address: loc?.address as string | undefined,
      postcode: loc?.postcode as string | undefined,
    },
  };
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const g = await requireAdmin();
  if (!g.ok) return NextResponse.json({ error: 'forbidden' }, { status: g.status });

  const { newSlotId } = await req.json();
  if (!newSlotId) return NextResponse.json({ error: 'newSlotId required' }, { status: 400 });

  const origin = new URL(req.url).origin;

  // 1) load booking
  const { data: b, error: be } = await supabaseAdmin
    .from('bookings')
    .select('id,status,slot_id,org_name,contact_name,email')
    .eq('id', params.id)
    .single();

  if (be || !b) return NextResponse.json({ error: 'not found' }, { status: 404 });
  if (!['PENDING', 'CONFIRMED'].includes(b.status)) {
    return NextResponse.json({ error: 'not reschedulable' }, { status: 409 });
  }

  // 2) claim new slot if it's OPEN
  const targetStatus = b.status === 'CONFIRMED' ? 'BOOKED' : 'BLOCKED';
  const { data: claimed, error: clErr } = await supabaseAdmin
    .from('slots')
    .update({ status: targetStatus })
    .eq('id', newSlotId)
    .eq('status', 'OPEN')
    .select('id') // keep it minimal; we'll fetch details later
    .single();

  if (clErr || !claimed) {
    return NextResponse.json({ error: 'new slot not available' }, { status: 409 });
  }

  // 3) move booking to new slot
  const { error: upB } = await supabaseAdmin
    .from('bookings')
    .update({ slot_id: newSlotId, updated_at: new Date().toISOString() })
    .eq('id', b.id);

  if (upB) {
    // revert claim if update fails
    await supabaseAdmin.from('slots').update({ status: 'OPEN' }).eq('id', newSlotId);
    return NextResponse.json({ error: upB.message }, { status: 500 });
  }

  // 4) free old slot
  await supabaseAdmin.from('slots').update({ status: 'OPEN' }).eq('id', b.slot_id);

  // 5) fetch details for email/ICS (nested may be arrays)
  const { data: rawSlot } = await supabaseAdmin
    .from('slots')
    .select('start_utc,end_utc, service_days ( service_date, locations ( name,address,postcode ) )')
    .eq('id', newSlotId)
    .single();

  // 6) email: "rescheduled" with new ICS (best-effort; don't fail API if email fails)
  try {
    if (rawSlot) {
      const slot = normalizeSlotDetail(rawSlot);
      const locationLine = [slot.location.name, slot.location.address, slot.location.postcode]
        .filter(Boolean)
        .join(', ');

      if (slot.start_utc && slot.end_utc) {
        const ics = makeIcs({
          title: 'Bluefield Appointment (Rescheduled)',
          description: `Updated booking for ${b.org_name}.`,
          startUtc: new Date(slot.start_utc),
          endUtc: new Date(slot.end_utc),
          location: locationLine,
          uid: `booking-${b.id}@bluefield`,
          sequence: 1, // bump if rescheduling same UID again
          organizerEmail: process.env.BOOKINGS_FROM_EMAIL,
        });

        await fetch(`${origin}/api/email`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            to: b.email,
            subject: 'Your Bluefield booking was rescheduled',
            html: `<p>Hi ${b.contact_name}, your booking has been rescheduled.</p>
                   <p><b>Date:</b> ${slot.service_date ?? ''}<br/>
                      <b>Time:</b> ${new Date(slot.start_utc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}–${new Date(slot.end_utc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<br/>
                      <b>Location:</b> ${locationLine}</p>`,
            icsContent: ics,
          }),
        });
      }
    }
  } catch (e) {
    console.error('reschedule email failed:', e);
  }

  return NextResponse.json({ ok: true });
}
