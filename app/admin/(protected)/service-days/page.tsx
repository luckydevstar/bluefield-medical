'use client';
import { useEffect, useState } from 'react';

export default function ServiceDaysPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [serviceDays, setServiceDays] = useState<any[]>([]);
  const [form, setForm] = useState({
    locationId: '', serviceDate: '', windowStart: '09:00', windowEnd: '17:00', slotLengthMinutes: 60, notes: ''
  });

  const load = async () => {
    const [L, SD] = await Promise.all([
      fetch('/api/admin/locations', { cache: 'no-store' }).then(r=>r.json()),
      fetch('/api/admin/service-days', { cache: 'no-store' }).then(r=>r.json())
    ]);
    setLocations(L.locations ?? []);
    setServiceDays(SD.serviceDays ?? []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/service-days', { method: 'POST', body: JSON.stringify(form) });
    setForm({...form, serviceDate: ''});
    await load();
  };

  const generateSlots = async (serviceDayId: string) => {
    await fetch('/api/admin/generate-slots', { method: 'POST', body: JSON.stringify({ serviceDayId }) });
    alert('Slots generated');
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <form onSubmit={submit} className="bg-white p-4 rounded-md shadow space-y-3">
        <h3 className="font-semibold">Create Service Day</h3>
        <select className="input" value={form.locationId} onChange={e=>setForm({...form, locationId: e.target.value})}>
          <option value="">Select Location</option>
          {locations.map((l:any)=> <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <input className="input" type="date" value={form.serviceDate} onChange={e=>setForm({...form, serviceDate: e.target.value})}/>
        <div className="grid grid-cols-2 gap-3">
          <input className="input" type="time" value={form.windowStart} onChange={e=>setForm({...form, windowStart: e.target.value})}/>
          <input className="input" type="time" value={form.windowEnd} onChange={e=>setForm({...form, windowEnd: e.target.value})}/>
        </div>
        <input className="input" type="number" min={5} max={480} value={form.slotLengthMinutes}
               onChange={e=>setForm({...form, slotLengthMinutes: Number(e.target.value)})}/>
        <textarea className="input" placeholder="Notes" value={form.notes} onChange={e=>setForm({...form, notes: e.target.value})}/>
        <button className="btn-primary">Save</button>
      </form>

      <div className="bg-white p-4 rounded-md shadow">
        <h3 className="font-semibold mb-3">Upcoming Service Days</h3>
        <ul className="divide-y">
          {serviceDays.map((sd:any)=>(
            <li key={sd.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{sd.locations?.name}</div>
                <div className="text-sm text-gray-600">{sd.service_date} — {sd.window_start} → {sd.window_end} ({sd.slot_length_minutes}m)</div>
              </div>
              <button onClick={()=>generateSlots(sd.id)} className="btn-primary">Generate Slots</button>
            </li>
          ))}
        </ul>
      </div>
      <style jsx global>{`
        .input { @apply w-full rounded border px-3 py-2 text-sm; }
        .btn-primary { @apply inline-flex items-center rounded bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700; }
      `}</style>
    </div>
  );
}
