// app/admin/locations/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function LocationsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', address: '', postcode: '', lat: '', lng: '' });

  const load = async () => {
    const res = await fetch('/api/admin/locations', { cache: 'no-store' });
    const json = await res.json();
    setItems(json.locations ?? []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      ...form,
      lat: form.lat ? Number(form.lat) : null,
      lng: form.lng ? Number(form.lng) : null,
    };
    await fetch('/api/admin/locations', { method: 'POST', body: JSON.stringify(body) });
    setForm({ name: '', address: '', postcode: '', lat: '', lng: '' });
    await load();
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <form onSubmit={submit} className="bg-white p-4 rounded-md shadow space-y-3">
        <h3 className="font-semibold">Create Location</h3>
        <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
        <input className="input" placeholder="Address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/>
        <input className="input" placeholder="Postcode" value={form.postcode} onChange={e=>setForm({...form,postcode:e.target.value})}/>
        <div className="grid grid-cols-2 gap-3">
          <input className="input" placeholder="Lat" value={form.lat} onChange={e=>setForm({...form,lat:e.target.value})}/>
          <input className="input" placeholder="Lng" value={form.lng} onChange={e=>setForm({...form,lng:e.target.value})}/>
        </div>
        <button className="btn-primary">Save</button>
      </form>

      <div className="bg-white p-4 rounded-md shadow">
        <h3 className="font-semibold mb-3">Locations</h3>
        <ul className="divide-y">
          {items.map((l) => (
            <li key={l.id} className="py-3">
              <div className="font-medium">{l.name}</div>
              <div className="text-sm text-gray-600">{l.address} {l.postcode}</div>
              {l.lat && l.lng && <div className="text-xs text-gray-500">({l.lat}, {l.lng})</div>}
            </li>
          ))}
        </ul>
      </div>

      {/* Tailwind helpers */}
      <style jsx global>{`
        .input { @apply w-full rounded border px-3 py-2 text-sm; }
        .btn-primary { @apply inline-flex items-center rounded bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700; }
      `}</style>
    </div>
  );
}
