import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import bcrypt from "bcrypt";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const { data: user } = await supabaseAdmin.from("admin_users").select("*").eq("username", username).single();
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 408 });

  const res = NextResponse.json({ ok: true });
  const session = await getSession();
  session.adminId = user.id;
  session.username = user.username;
  await session.save();
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  const session = await getSession();
  session.destroy();
  await session.save();
  return res;
}
