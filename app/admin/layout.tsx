"use client"

import { Button } from '@/components/ui/button';
import Link from 'next/link';

const ADMIN_NAV_LIST = [
  {
    label: "Location Management",
    href: "/admin/locations",
  },
  {
    label: "Schedule Management",
    href: "/admin"
  },
  {
    label: "Booking Management",
    href: "/admin/bookings"
  },
  {
    label: "Change Password",
    href: "/admin/account"
  }
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-12">
      <aside className="col-span-12 md:col-span-3 lg:col-span-2 border-r p-4 space-y-2">
        <h2 className="font-semibold text-xl mt-2 mb-4 w-full text-center">BlueFields Admin</h2>
        <nav className="flex flex-col gap-2">
        {
          ADMIN_NAV_LIST.map((item, idx) => {
            return (
              <Link href={item.href} className="w-full" key={idx}>
                <Button key={idx} className="w-full">
                  {item.label}
                </Button>
              </Link>
            )
          })
        }
        </nav>
        <form
          action="/api/admin/login"
          method="POST"
          onSubmit={async (e) => { e.preventDefault(); await fetch('/api/admin/login', { method: 'DELETE' }); location.href = '/admin/login'; }}
        >
          <Button className="w-full">Sign out</Button>
        </form>
      </aside>
      <main className="col-span-12 md:col-span-9 lg:col-span-10 p-6">{children}</main>
    </div>
  );
}
