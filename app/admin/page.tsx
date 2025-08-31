'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type Location = { id:string; name:string; postcode:string };
type Day = { id:string; location_id:string; start_at:string; end_at:string; slot_minutes:number };

export default function AdminSchedule() {
  const [locations,setLocations] = useState<Location[]>([]);
  const [days,setDays] = useState<Day[]>([]);
  const [form,setForm] = useState<any>({ location_id:'', date:'', start:'09:00', end:'17:00', slot_minutes:60 });

  const load = async () => {
    const loc = await fetch('/api/admin/locations').then(r=>r.json());
    setLocations(loc.data ?? []);
    const now = new Date();
    const to = new Date(); to.setMonth(to.getMonth()+2);
    const d = await fetch(`/api/admin/location-days?from=${now.toISOString()}&to=${to.toISOString()}`).then(r=>r.json());
    setDays(d.data ?? []);
  };
  useEffect(()=>{ load(); },[]);

  const createDay = async () => {
    if (!form.location_id || !form.date) return toast.info('Pick location and date');
    const start_at = new Date(`${form.date}T${form.start}:00`);
    const end_at = new Date(`${form.date}T${form.end}:00`);
    const res = await fetch('/api/admin/location-days', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ location_id:form.location_id, start_at, end_at, slot_minutes:Number(form.slot_minutes) })
    });
    if (res.ok) { toast.success('Day added'); load(); } else toast.error('Failed');
  };

  const generateSlots = async (id:string) => {
    const res = await fetch('/api/admin/generate-slots', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ location_day_id:id }) });
    if (res.ok) { const j=await res.json(); toast.success(`Slots created: ${j.created}`); }
    else toast.error('Failed');
  };

  const cleanup = async () => {
    const r = await fetch('/api/admin/cleanup', { method:'POST' });
    r.ok ? toast.success('Old slots removed') : toast.error('Cleanup failed');
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Schedule</h1>

      <div className="grid md:grid-cols-5 gap-3 items-end">
        <select className="border rounded p-2" value={form.location_id} onChange={e=>setForm({...form,location_id:e.target.value})}>
          <option value="">Select location</option>
          {locations.map(l=> <option key={l.id} value={l.id}>{l.name} ({l.postcode})</option>)}
        </select>
        <Input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} />
        <Input type="time" value={form.start} onChange={e=>setForm({...form,start:e.target.value})} />
        <Input type="time" value={form.end} onChange={e=>setForm({...form,end:e.target.value})} />
        <Input type="number" min={5} value={form.slot_minutes} onChange={e=>setForm({...form,slot_minutes:e.target.value})} />
        <Button onClick={createDay} className="md:col-span-5">Add day & slot length</Button>
      </div>

      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Upcoming location days</h2>
          <Button variant="secondary" onClick={cleanup}>Delete past slots</Button>
        </div>
        <ul className="mt-4 divide-y">
          {days.map(d=>{
            const dt = new Date(d.start_at);
            const fmt = dt.toLocaleString([], { dateStyle:'medium', timeStyle:'short' });
            const end = new Date(d.end_at).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
            return (
              <li key={d.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{fmt} – {end}</div>
                  <div className="text-sm text-muted-foreground">slot: {d.slot_minutes} min</div>
                </div>
                <Button onClick={()=>generateSlots(d.id)}>Generate slots</Button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
