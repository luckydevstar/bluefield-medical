export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import crypto from 'node:crypto';
import { addMinutes } from 'date-fns';

export async function POST(req: NextRequest) {
  try {
    const { slotId, orgName, contactName, email, phone, attendees } = await req.json();

    if (!slotId || !orgName || !contactName || !email || !attendees) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // (A) Atomically block the slot if it's OPEN
    const { data: blocked, error: blockErr } = await supabaseAdmin
      .from('slots')
      .update({ status: 'BLOCKED' })
      .eq('id', slotId)
      .eq('status', 'OPEN')
      .select('id,start_utc,end_utc')
      .single();

    if (blockErr || !blocked) {
      return NextResponse.json({ error: 'Slot unavailable' }, { status: 409 });
    }

    // (B) Insert booking as PENDING with 10-minute hold window
    const token = crypto.randomBytes(24).toString('hex');
    const holdUntil = addMinutes(new Date(), 10);

    const { data: booking, error: insErr } = await supabaseAdmin
      .from('bookings')
      .insert({
        slot_id: slotId,
        org_name: orgName,
        contact_name: contactName,
        email,
        phone,
        attendees: Number(attendees),
        status: 'PENDING',
        confirmation_token: token,
        hold_expires_at: holdUntil.toISOString(),
      })
      .select('id')
      .single();

    if (insErr) {
      // Revert slot if booking insert fails
      await supabaseAdmin.from('slots').update({ status: 'OPEN' }).eq('id', slotId);
      return NextResponse.json({ error: insErr.message }, { status: 409 });
    }

    // (C) Send "Confirm your booking" email (no ICS here)
    const origin = new URL(req.url).origin;
    const confirmUrl = `${origin}/api/bookings/confirm?token=${encodeURIComponent(token)}`;

    await fetch(`${origin}/api/email`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        to: email,
        subject: 'Confirm your Bluefield booking',
        html: `<p>Hi ${contactName},</p>
               <p>Please <a href="${confirmUrl}">confirm your booking</a> within <b>10 minutes</b>.</p>`,
      }),
    });

    return NextResponse.json({
      bookingId: booking.id,
      holdExpiresAt: holdUntil.toISOString(),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to create booking' }, { status: 500 });
  }
}
