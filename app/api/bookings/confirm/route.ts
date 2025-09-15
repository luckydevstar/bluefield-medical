// app/api/bookings/confirm/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: NextRequest) {
  const token = new URL(req.url).searchParams.get('token');
  if (!token) return NextResponse.redirect('/booking?status=invalid');

  const { data: booking, error } = await supabaseAdmin
    .from('bookings').select('*').eq('confirmation_token', token).single();
  if (error || !booking) return NextResponse.redirect('/booking?status=invalid');

  const now = new Date();
  if (booking.status !== 'PENDING' || (booking.hold_expires_at && new Date(booking.hold_expires_at) < now)) {
    return NextResponse.redirect('/booking?status=expired');
  }

  // mark booking CONFIRMED + set slot BOOKED
  const { error: upErr } = await supabaseAdmin.from('bookings')
    .update({ status: 'CONFIRMED', hold_expires_at: null })
    .eq('id', booking.id);
  if (upErr) return NextResponse.redirect('/booking?status=error');

  const { error: slotErr } = await supabaseAdmin
    .from('slots').update({ status: 'BOOKED' }).eq('id', booking.slot_id);
  if (slotErr) return NextResponse.redirect('/booking?status=error');

  return NextResponse.redirect('/booking?status=success');
}
