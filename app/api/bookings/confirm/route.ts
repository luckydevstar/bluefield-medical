// app/api/bookings/confirm/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { makeIcs } from '@/lib/ics';

/** Normalize Supabase nested shapes (arrays) into a simple object */
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

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const origin = url.origin;
  const token = url.searchParams.get('token') || '';

  if (!token) return NextResponse.redirect(`${origin}/booking?status=invalid`);

  // 1) Find the booking (flat)
  const { data: booking, error } = await supabaseAdmin
    .from('bookings')
    .select('id,status,contact_name,org_name,email,hold_expires_at,slot_id')
    .eq('confirmation_token', token)
    .single();

  if (error || !booking) return NextResponse.redirect(`${origin}/booking?status=invalid`);

  // 2) If expired or not pending → expire + free slot
  const now = new Date();
  const expired = booking.hold_expires_at && new Date(booking.hold_expires_at) < now;
  if (booking.status !== 'PENDING' || expired) {
    await supabaseAdmin
      .from('bookings')
      .update({ status: 'EXPIRED', updated_at: now.toISOString() })
      .eq('id', booking.id)
      .eq('status', 'PENDING');

    await supabaseAdmin
      .from('slots')
      .update({ status: 'OPEN' })
      .eq('id', booking.slot_id)
      .in('status', ['BLOCKED']);

    return NextResponse.redirect(`${origin}/booking?status=expired`);
  }

  // 3) Confirm booking and mark slot as BOOKED
  const { error: up1 } = await supabaseAdmin
    .from('bookings')
    .update({ status: 'CONFIRMED', hold_expires_at: null, updated_at: now.toISOString() })
    .eq('id', booking.id)
    .eq('status', 'PENDING');
  if (up1) return NextResponse.redirect(`${origin}/booking?status=error`);

  const { error: up2 } = await supabaseAdmin
    .from('slots')
    .update({ status: 'BOOKED' })
    .eq('id', booking.slot_id);
  if (up2) {
    // best-effort revert
    await supabaseAdmin.from('bookings').update({ status: 'PENDING' }).eq('id', booking.id);
    return NextResponse.redirect(`${origin}/booking?status=error`);
  }

  // 4) Fetch slot detail (can be nested arrays) and normalize
  const { data: rawSlot } = await supabaseAdmin
    .from('slots')
    .select('start_utc,end_utc, service_days ( service_date, locations ( name,address,postcode ) )')
    .eq('id', booking.slot_id)
    .single();

  if (rawSlot) {
    const slot = normalizeSlotDetail(rawSlot);
    const locationLine = [slot.location.name, slot.location.address, slot.location.postcode]
      .filter(Boolean)
      .join(', ');

    // 5) Email with ICS
    if (slot.start_utc && slot.end_utc) {
      const ics = makeIcs({
        title: 'Bluefield Appointment',
        description: `Booking for ${booking.org_name}.`,
        startUtc: new Date(slot.start_utc),
        endUtc: new Date(slot.end_utc),
        location: locationLine,
        uid: `booking-${booking.id}@bluefield`,
        sequence: 0,
        organizerEmail: process.env.MAIL_FROM,
      });

      await fetch(`${origin}/api/email`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          to: booking.email,
          subject: 'Your Bluefield booking is confirmed',
          html: `<p>Hi ${booking.contact_name},</p>
                 <p>Your booking is confirmed.</p>
                 <p><b>Date:</b> ${slot.service_date ?? ''}<br/>
                    <b>Time:</b> ${new Date(slot.start_utc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}–${new Date(slot.end_utc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<br/>
                    <b>Location:</b> ${locationLine}</p>`,
          icsContent: ics,
        }),
      });
    }
  }

  return NextResponse.redirect(`${origin}/booking?status=success`);
}
