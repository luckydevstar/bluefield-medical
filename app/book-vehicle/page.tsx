'use client';

import { useEffect, useMemo, useState } from 'react';

type Location = { id:string; name:string; postcode?:string };
type ServiceDay = { id:string; location_id:string; service_date:string; window_start:string; window_end:string; slot_length_minutes:number };
type Slot = { id:string; start_utc:string; end_utc:string };

export default function BookingPage() {
  const [postcode, setPostcode] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [serviceDays, setServiceDays] = useState<ServiceDay[]>([]);
  const [selectedServiceDay, setSelectedServiceDay] = useState<string>('');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [form, setForm] = useState({ orgName:'', contactName:'', email:'', phone:'', attendees:1, slotId:'' });
  const [status, setStatus] = useState<string | null>(null);

  useEffect(()=>{
    const url = new URL(window.location.href);
    const s = url.searchParams.get('status');
    if (s) setStatus(s);
  },[]);

  const search = async () => {
    const res = await fetch(`/api/locations?postcode=${encodeURIComponent(postcode)}&radiusKm=50`, { cache: 'no-store' });
    const json = await res.json();
    setLocations(json.locations ?? []);
    setSelectedLocation('');
    setServiceDays([]); setSelectedServiceDay(''); setSlots([]);
  };

  const loadDays = async (locationId: string) => {
    setSelectedLocation(locationId);
    const today = new Date().toISOString().slice(0,10);
    const res = await fetch(`/api/service-days?locationId=${locationId}&from=${today}`, { cache: 'no-store' });
    const json = await res.json();
    setServiceDays(json.serviceDays ?? []);
    setSelectedServiceDay('');
    setSlots([]);
  };

  const loadSlots = async (serviceDayId: string) => {
    setSelectedServiceDay(serviceDayId);
    const res = await fetch(`/api/slots?serviceDayId=${serviceDayId}`, { cache: 'no-store' });
    const json = await res.json();
    setSlots(json.slots ?? []);
  };

  const reserve = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, attendees: Number(form.attendees) };
    const res = await fetch('/api/bookings', { method: 'POST', body: JSON.stringify(payload) });
    const json = await res.json();
    if (res.ok) {
      alert('Check your email to confirm within 10 minutes.');
    } else {
      alert(json.error ?? 'Failed to reserve');
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Book a Bluefield Appointment</h1>

      {status === 'success' && <div className="rounded bg-green-50 border border-green-200 p-3 text-green-800">✅ Booking confirmed!</div>}
      {status === 'expired' && <div className="rounded bg-yellow-50 border border-yellow-200 p-3 text-yellow-800">⏰ Confirmation window expired. Please book again.</div>}
      {status === 'invalid' && <div className="rounded bg-red-50 border border-red-200 p-3 text-red-800">❌ Invalid confirmation link.</div>}

      <div className="bg-white rounded shadow p-4 space-y-3">
        <label className="block text-sm font-medium">Your Postcode</label>
        <div className="flex gap-2">
          <input className="input flex-1" value={postcode} onChange={e=>setPostcode(e.target.value)} placeholder="e.g., SW1A 1AA"/>
          <button className="btn-primary" onClick={search}>Search</button>
        </div>
        {locations.length > 0 && (
          <>
            <label className="block text-sm font-medium mt-4">Choose Location</label>
            <select className="input" value={selectedLocation} onChange={e=>loadDays(e.target.value)}>
              <option value="">Select...</option>
              {locations.map(l=> <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </>
        )}

        {serviceDays.length > 0 && (
          <>
            <label className="block text-sm font-medium mt-4">Choose Date</label>
            <select className="input" value={selectedServiceDay} onChange={e=>loadSlots(e.target.value)}>
              <option value="">Select...</option>
              {serviceDays.map(sd=> (
                <option key={sd.id} value={sd.id}>
                  {sd.service_date} ({sd.window_start}–{sd.window_end})
                </option>
              ))}
            </select>
          </>
        )}

        {slots.length > 0 && (
          <>
            <label className="block text-sm font-medium mt-4">Available Time Slots</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {slots.map(s=>(
                <button key={s.id}
                        onClick={()=>setForm({...form, slotId: s.id})}
                        className={`rounded border px-3 py-2 text-sm text-left hover:bg-blue-50 ${form.slotId===s.id?'border-blue-600 bg-blue-50':'border-gray-300'}`}>
                  {new Date(s.start_utc).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                  {' – '}
                  {new Date(s.end_utc).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <form onSubmit={reserve} className="bg-white rounded shadow p-4 grid gap-3">
        <h2 className="text-lg font-semibold">Your Details</h2>
        <input className="input" placeholder="Organisation" value={form.orgName} onChange={e=>setForm({...form, orgName:e.target.value})}/>
        <div className="grid md:grid-cols-2 gap-3">
          <input className="input" placeholder="Contact name" value={form.contactName} onChange={e=>setForm({...form, contactName:e.target.value})}/>
          <input className="input" placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <input className="input" placeholder="Phone (optional)" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/>
          <input className="input" type="number" min={1} max={500} placeholder="Attendees" value={form.attendees}
                 onChange={e=>setForm({...form, attendees:Number(e.target.value)})}/>
        </div>
        <button className="btn-primary justify-self-start" disabled={!form.slotId}>Reserve Slot</button>
        {!form.slotId && <p className="text-xs text-gray-500">Pick a time slot first.</p>}
      </form>

      <style jsx global>{`
        .input { @apply w-full rounded border px-3 py-2 text-sm; }
        .btn-primary { @apply inline-flex items-center rounded bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 disabled:opacity-50; }
      `}</style>
    </div>
  );
}
