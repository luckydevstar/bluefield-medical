export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin } from '@/lib/requireAdmin';

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const g = await requireAdmin();
  if (!g.ok) return NextResponse.json({ error: 'forbidden' }, { status: g.status });

  const id = params.id;
  const origin = new URL(_req.url).origin;

  // fetch booking
  const { data: b, error: be } = await supabaseAdmin
    .from('bookings')
    .select('id,status,email,contact_name,slot_id')
    .eq('id', id)
    .single();

  if (be || !b) return NextResponse.json({ error: 'not found' }, { status: 404 });
  if (!['PENDING', 'CONFIRMED'].includes(b.status)) {
    return NextResponse.json({ error: 'not cancellable' }, { status: 409 });
  }

  // cancel + free slot
  const now = new Date().toISOString();
  const { error: up1 } = await supabaseAdmin
    .from('bookings').update({ status: 'CANCELLED', updated_at: now }).eq('id', id);
  if (up1) return NextResponse.json({ error: up1.message }, { status: 500 });

  await supabaseAdmin.from('slots').update({ status: 'OPEN' }).eq('id', b.slot_id);

  // email (simple notice)
  await fetch(`${origin}/api/email`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      to: b.email,
      subject: 'Your Bluefield booking was cancelled',
      html: `<p>Hi ${b.contact_name},</p><p>Your booking has been cancelled.</p>`,
    }),
  });

  return NextResponse.json({ ok: true });
}
