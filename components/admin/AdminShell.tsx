// components/AdminShell.tsx
export default function AdminShell({ children }: { children: React.ReactNode }) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="sticky top-0 z-10 bg-white border-b">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-6">
            <h1 className="text-xl font-semibold">Bluefield Admin</h1>
            <nav className="flex gap-4 text-sm">
              <a href="/admin" className="hover:underline">Dashboard</a>
              <a href="/admin/locations" className="hover:underline">Locations</a>
              <a href="/admin/service-days" className="hover:underline">Service Days</a>
              <a href="/admin/bookings" className="hover:underline">Bookings</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </div>
    );
  }
  