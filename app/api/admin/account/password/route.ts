import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getSession } from "@/lib/session";
import { verifyPassword, hashPassword } from "@/lib/password";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.adminId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  // load current user
  const { data: user, error } = await supabaseAdmin
    .from("admin_users")
    .select("id, password_hash")
    .eq("id", session.adminId)
    .single();

  if (error || !user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // verify current password
  const ok = await verifyPassword(currentPassword, user.password_hash);
  if (!ok) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
  }

  // update hash
  const nextHash = await hashPassword(newPassword);
  const { error: updErr } = await supabaseAdmin
    .from("admin_users")
    .update({ password_hash: nextHash })
    .eq("id", user.id);

  if (updErr) {
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
