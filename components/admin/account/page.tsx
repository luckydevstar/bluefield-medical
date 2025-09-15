'use client';
import { useState } from "react";

export default function AccountPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<string|null>(null);
  const [err, setErr] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null); setErr(null);
    if (newPassword !== confirm) {
      setErr("Passwords do not match");
      return;
    }
    setLoading(true);
    const res = await fetch("/admin/account/password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const j = await res.json();
    setLoading(false);
    if (!res.ok) { setErr(j.error || "Failed to change password"); return; }
    setMsg("Password updated successfully");
    setCurrentPassword(""); setNewPassword(""); setConfirm("");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Account</h2>
      <form onSubmit={submit} className="bg-white p-4 rounded shadow max-w-md space-y-3">
        <h3 className="font-medium">Change Password</h3>
        <input className="input" type="password" placeholder="Current password"
               value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)} />
        <input className="input" type="password" placeholder="New password (min 8 chars)"
               value={newPassword} onChange={e=>setNewPassword(e.target.value)} />
        <input className="input" type="password" placeholder="Confirm new password"
               value={confirm} onChange={e=>setConfirm(e.target.value)} />
        {err && <p className="text-sm text-red-600">{err}</p>}
        {msg && <p className="text-sm text-green-700">{msg}</p>}
        <button className="btn-primary" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
        <style jsx global>{`
          .input { @apply w-full rounded border px-3 py-2 text-sm; }
          .btn-primary { @apply inline-flex items-center rounded bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 disabled:opacity-50; }
        `}</style>
      </form>
    </div>
  );
}
