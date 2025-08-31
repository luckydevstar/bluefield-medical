import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/api/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, from: process.env.BOOKINGS_FROM_EMAIL, subject, message: html })
  });
  return res.ok;
}

export async function GET() {
  // admin list (secured by service role only)
  const { data, error } = await supabaseAdmin.from('v_admin_bookings').select('*').order('booked_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const { slot_id, name, email, phone, attendees } = await req.json();

  // atomic-ish: first claim the slot if still available
  const { data: claimed, error: claimErr } = await supabaseAdmin
    .from('slots')
    .update({ status: 'booked' })
    .eq('id', slot_id)
    .eq('status', 'available')     // guard
    .select('id,start_at,end_at,location_id')
    .maybeSingle();

  if (claimErr) return NextResponse.json({ error: claimErr.message }, { status: 500 });
  if (!claimed) return NextResponse.json({ error: 'Slot no longer available' }, { status: 409 });

  const { data: booking, error } = await supabaseAdmin
    .from('bookings')
    .insert({ slot_id, name, email, phone, attendees, status: 'confirmed' })
    .select('id')
    .maybeSingle();

  if (error || !booking) {
    // if booking failed, revert slot
    await supabaseAdmin.from('slots').update({ status: 'available' }).eq('id', slot_id);
    return NextResponse.json({ error: error?.message ?? 'Failed' }, { status: 500 });
  }

  // email user + admin
  const subject = `Booking confirmed`;
  const html = `<p>Thanks ${name}, your booking is confirmed.</p>
    <p>Attendees: ${attendees}</p>
    <p>We’ll see you at your scheduled time.</p>`;

  await sendEmail(email, subject, html);
  await sendEmail(process.env.BOOKINGS_ADMIN_EMAIL!, `New booking from ${name}`, html);

  return NextResponse.json({ ok: true, booking_id: booking.id });
}

export async function PATCH(req: Request) {
  // admin actions: cancel or reschedule
  const body = await req.json(); // { booking_id, action: 'cancel'|'reschedule' }
  const { booking_id, action } = body;

  let status: any = null;
  if (action === 'cancel') status = 'cancelled';
  if (action === 'reschedule') status = 'reschedule_requested';
  if (!status) return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  // find booking & slot
  const { data: b, error: e1 } = await supabaseAdmin
    .from('bookings').select('id,email,name,slot_id').eq('id', booking_id).maybeSingle();
  if (e1 || !b) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { error: e2 } = await supabaseAdmin.from('bookings').update({ status }).eq('id', booking_id);
  if (e2) return NextResponse.json({ error: e2.message }, { status: 500 });

  if (action === 'cancel') {
    await supabaseAdmin.from('slots').update({ status: 'available' }).eq('id', b.slot_id);
  }

  const html =
    action === 'cancel'
      ? `<p>Your booking has been cancelled. You can book a new time at ${process.env.SITE_URL}/book-vehicle</p>`
      : `<p>Please reschedule your appointment here: ${process.env.SITE_URL}/book-vehicle</p>`;
  await fetch(`${process.env.SITE_URL}/api/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: b.email,
      from: process.env.BOOKINGS_FROM_EMAIL,
      subject: action === 'cancel' ? 'Booking cancelled' : 'Reschedule your booking',
      message: html
    })
  });

  return NextResponse.json({ ok: true });
}
