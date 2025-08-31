"use client"

import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-12">
      <aside className="col-span-12 md:col-span-3 lg:col-span-2 border-r p-4 space-y-2">
        <h2 className="font-semibold">Admin</h2>
        <nav className="flex flex-col gap-2">
          <Link href="/admin">Schedule</Link>
          <Link href="/admin/bookings">Bookings</Link>
          <Link href="/admin/account">Account</Link>
        </nav>
        <form
          action="/api/admin/login"
          method="POST"
          onSubmit={async (e) => { e.preventDefault(); await fetch('/api/admin/login', { method: 'DELETE' }); location.href = '/admin/login'; }}
        >
          <button className="text-sm text-red-600">Sign out</button>
        </form>
      </aside>
      <main className="col-span-12 md:col-span-9 lg:col-span-10 p-6">{children}</main>
    </div>
  );
}
