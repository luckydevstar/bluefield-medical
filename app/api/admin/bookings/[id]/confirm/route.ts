// app/api/admin/bookings/[id]/confirm/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin } from '@/lib/requireAdmin';
import { makeIcs } from '@/lib/ics';

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

  const id = params.id;
  const origin = new URL(req.url).origin;

  // 1) Fetch the booking (flat)
  const { data: booking, error: be } = await supabaseAdmin
    .from('bookings')
    .select('id,status,contact_name,org_name,email,slot_id')
    .eq('id', id)
    .single();

  if (be || !booking) return NextResponse.json({ error: 'not found' }, { status: 404 });
  if (booking.status !== 'PENDING') return NextResponse.json({ error: 'not pending' }, { status: 409 });

  // 2) Confirm booking + mark slot booked
  const nowIso = new Date().toISOString();

  const { error: up1 } = await supabaseAdmin
    .from('bookings')
    .update({ status: 'CONFIRMED', updated_at: nowIso })
    .eq('id', id);
  if (up1) return NextResponse.json({ error: up1.message }, { status: 500 });

  const { error: up2 } = await supabaseAdmin
    .from('slots')
    .update({ status: 'BOOKED' })
    .eq('id', booking.slot_id);
  if (up2) return NextResponse.json({ error: up2.message }, { status: 500 });

  // 3) Fetch slot detail + normalize
  const { data: rawSlot } = await supabaseAdmin
    .from('slots')
    .select('start_utc,end_utc, service_days ( service_date, locations ( name,address,postcode ) )')
    .eq('id', booking.slot_id)
    .single();

  try {
    if (rawSlot) {
      const slot = normalizeSlotDetail(rawSlot);
      const locationLine = [slot.location.name, slot.location.address, slot.location.postcode]
        .filter(Boolean)
        .join(', ');

      if (slot.start_utc && slot.end_utc) {
        const ics = makeIcs({
          title: 'Bluefield Appointment',
          description: `Booking for ${booking.org_name}.`,
          startUtc: new Date(slot.start_utc),
          endUtc: new Date(slot.end_utc),
          location: locationLine,
          uid: `booking-${booking.id}@bluefield`,
          sequence: 0,
          organizerEmail: process.env.BOOKINGS_FROM_EMAIL,
        });

        await fetch(`${origin}/api/email`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            to: booking.email,
            subject: 'Your Bluefield booking is confirmed',
            html: `<p>Hi ${booking.contact_name}, your booking is confirmed.</p>
                   <p><b>Date:</b> ${slot.service_date ?? ''}<br/>
                      <b>Time:</b> ${new Date(slot.start_utc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}–${new Date(slot.end_utc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<br/>
                      <b>Location:</b> ${locationLine}</p>`,
            icsContent: ics,
          }),
        });
      }
    }
  } catch (e) {
    console.error('email send failed:', e);
    // don't fail the API if email fails
  }

  return NextResponse.json({ ok: true });
}
