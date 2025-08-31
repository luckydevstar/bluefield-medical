import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { setAdminSession, clearAdminSession } from '@/lib/auth';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .select('id,email,password_hash')
    .eq('email', email)
    .maybeSingle();

  if (error || !data) return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
  const ok = await bcrypt.compare(password, data.password_hash);
  if (!ok) return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });

  await setAdminSession(email);
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await clearAdminSession();
  return NextResponse.json({ ok: true });
}
