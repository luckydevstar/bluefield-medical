'use client';
import { useEffect, useState } from 'react';

export default function BookingsPage() {
  const [items, setItems] = useState<any[]>([]);
  const load = async () => {
    const res = await fetch('/api/admin/bookings', { cache: 'no-store' });
    const json = await res.json();
    setItems(json.bookings ?? []);
  };
  useEffect(()=>{ load(); }, []);

  const cancel = async (id: string) => {
    await fetch('/api/admin/bookings', { method: 'PATCH', body: JSON.stringify({ id, status: 'CANCELLED' }) });
    await load();
  };

  return (
    <div className="bg-white p-4 rounded-md shadow">
      <h3 className="font-semibold mb-3">Bookings</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left">
            <th className="p-2">Date/Time</th>
            <th className="p-2">Org / Contact</th>
            <th className="p-2">Email</th>
            <th className="p-2">Attendees</th>
            <th className="p-2">Status</th>
            <th className="p-2"></th>
          </tr></thead>
          <tbody>
          {items.map((b)=>(
            <tr key={b.id} className="border-t">
              <td className="p-2">{new Date(b.slots.start_utc).toLocaleString()} – {new Date(b.slots.end_utc).toLocaleTimeString()}</td>
              <td className="p-2">{b.org_name}<div className="text-xs text-gray-500">{b.contact_name}</div></td>
              <td className="p-2">{b.email}</td>
              <td className="p-2">{b.attendees}</td>
              <td className="p-2">{b.status}</td>
              <td className="p-2">
                {b.status !== 'CANCELLED' && <button className="btn-primary" onClick={()=>cancel(b.id)}>Cancel</button>}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      <style jsx global>{`
        .btn-primary { @apply inline-flex items-center rounded bg-blue-600 text-white px-3 py-1 text-xs hover:bg-blue-700; }
      `}</style>
    </div>
  );
}
