import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getAdmin } from '@/lib/auth';

export async function POST() {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const nowIso = new Date().toISOString();
  // cascade deletes bookings via FK when slots are removed
  const { error } = await supabaseAdmin.from('slots').delete().lt('end_at', nowIso);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
