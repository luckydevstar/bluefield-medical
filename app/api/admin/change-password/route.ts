import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getAdmin } from '@/lib/auth';

export async function POST(req: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();

  const { data } = await supabaseAdmin
    .from('admin_users')
    .select('id,password_hash')
    .eq('email', admin.email)
    .maybeSingle();

  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const ok = await bcrypt.compare(currentPassword, data.password_hash);
  if (!ok) return NextResponse.json({ error: 'Invalid current password' }, { status: 400 });

  const hash = await bcrypt.hash(newPassword, 10);
  const { error } = await supabaseAdmin.from('admin_users').update({ password_hash: hash }).eq('id', data.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
