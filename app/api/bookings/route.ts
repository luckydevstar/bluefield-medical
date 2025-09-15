// app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import crypto from 'node:crypto';
import { addMinutes } from 'date-fns';
import { makeIcs } from '@/lib/ics';
import { sendBookingEmail } from '@/lib/mail';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { slotId, orgName, contactName, email, phone, attendees } = body ?? {};
  if (!slotId || !orgName || !contactName || !email || !attendees) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // fetch slot
  const { data: slot, error: slotErr } = await supabaseAdmin
    .from('slots').select('*').eq('id', slotId).single();
  if (slotErr || !slot) return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
  if (slot.status !== 'OPEN') return NextResponse.json({ error: 'Slot unavailable' }, { status: 409 });

  // check active booking/hold
  const { data: existing } = await supabaseAdmin
    .from('bookings')
    .select('id,status,hold_expires_at')
    .eq('slot_id', slotId);

  const now = new Date();
  const hasActive = (existing ?? []).some(b =>
    b.status === 'CONFIRMED' ||
    (b.status === 'PENDING' && b.hold_expires_at && new Date(b.hold_expires_at) > now)
  );
  if (hasActive) return NextResponse.json({ error: 'Slot already reserved' }, { status: 409 });

  const token = crypto.randomBytes(24).toString('hex');
  const holdUntil = addMinutes(now, 10);

  // insert booking (unique on slot_id guarantees no double-book)
  const { data: booking, error: insErr } = await supabaseAdmin
    .from('bookings')
    .insert({
      slot_id: slotId,
      org_name: orgName,
      contact_name: contactName,
      email,
      phone,
      attendees,
      status: 'PENDING',
      confirmation_token: token,
      hold_expires_at: holdUntil,
    })
    .select('*')
    .single();

  if (insErr) return NextResponse.json({ error: insErr.message }, { status: 409 });

  // send email (stub)
  const confirmUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings/confirm?token=${token}`;
  const ics = makeIcs({
    title: 'Bluefield Appointment',
    description: `Booking for ${orgName}. Confirm here: ${confirmUrl}`,
    startUtc: new Date(slot.start_utc),
    endUtc: new Date(slot.end_utc),
  });

  await sendBookingEmail({
    to: email,
    subject: 'Confirm your Bluefield booking',
    html: `<p>Thanks ${contactName}! Please <a href="${confirmUrl}">confirm your booking</a> within 10 minutes.</p>`,
    icsContent: ics,
  });

  return NextResponse.json({ bookingId: booking.id, holdExpiresAt: holdUntil.toISOString() });
}
