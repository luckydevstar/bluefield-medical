'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const LeafletMap = dynamic(() => import('./components/LeafletMap'), { ssr: false });

type Location = { id: string; name: string; postcode: string; lat: number; lng: number };
type Slot = { id: string; start_at: string; end_at: string };

export default function BookVehicleHeroView() {
  // [lng, lat]
  const [center, setCenter] = useState<[number, number]>([-0.12, 51.5]); // London default
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLoc, setSelectedLoc] = useState<Location | null>(null);

  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotId, setSlotId] = useState<string>('');

  // form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [attendees, setAttendees] = useState(1);
  const [postcode, setPostcode] = useState('');

  // load predefined locations
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/admin/locations');
      const j = await res.json();
      setLocations((j.data ?? []).filter((l: Location) => l.lat && l.lng));
    })();
  }, []);

  // load available slots for selected location + date
  useEffect(() => {
    if (!selectedLoc) { setSlots([]); return; }
    (async () => {
      const r = await fetch(`/api/slots?locationId=${selectedLoc.id}&date=${date}`);
      const j = await r.json();
      setSlots(j.data ?? []);
    })();
  }, [selectedLoc, date]);

  // postcode search (uses your /api/geocode proxy)
  const searchPostcode = async () => {
    if (!postcode) return;
    const r = await fetch(`/api/geocode?q=${encodeURIComponent(postcode)}`);
    const j = await r.json();
    const feature = j?.features?.[0];
    if (!feature) return toast.info('Postcode not found');
    const [lng, lat] = feature.center;
    setCenter([lng, lat]);
  };

  const book = async () => {
    if (!selectedLoc) return toast.info('Pick a location from the map');
    if (!slotId) return toast.info('Select a time slot');
    if (!name || !email) return toast.info('Fill your name and email');

    const r = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slot_id: slotId, name, email, phone, attendees }),
    });

    if (r.ok) {
      toast.success('Booked! Confirmation sent to your email.');
      setSlotId(''); setSlots([]); setName(''); setEmail(''); setPhone(''); setAttendees(1);
    } else {
      const j = await r.json();
      toast.error(j.error ?? 'Failed to book (slot may be taken)');
      if (selectedLoc) {
        const rr = await fetch(`/api/slots?locationId=${selectedLoc.id}&date=${date}`);
        const jj = await rr.json(); setSlots(jj.data ?? []);
      }
    }
  };

  // simple 14-day horizontal day chips
  const days = useMemo(() => {
    const out: string[] = [];
    const base = new Date(); base.setHours(0, 0, 0, 0);
    for (let i = 0; i < 14; i++) out.push(new Date(base.getTime() + i * 86400000).toISOString().slice(0, 10));
    return out;
  }, []);

  return (
    <main className="min-h-screen">
      <section className="max-w-7xl mx-auto p-6 grid lg:grid-cols-2 gap-8">
        {/* Left: Map */}
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold text-darkblue">Book a Vehicle</h1>

          <div className="flex gap-2">
            <Input placeholder="Enter your postcode" value={postcode} onChange={e => setPostcode(e.target.value)} />
            <Button onClick={searchPostcode}>Search</Button>
          </div>

          <div className="h-[420px] rounded-xl overflow-hidden border">
            {/* <LeafletMap
              center={center}
              locations={locations}
              onSelect={(l) => setSelectedLoc(l)}
            /> */}
          </div>

          <p className="text-sm text-muted-foreground">
            Tap a marker to select a location.
          </p>
          {selectedLoc && (
            <div className="text-sm">
              Selected location: <b>{selectedLoc.name}</b> ({selectedLoc.postcode})
            </div>
          )}
        </div>

        {/* Right: date → time → details */}
        <div className="space-y-6">
          {/* Date chips */}
          <div className="space-y-2">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {days.map(d => {
                const dt = new Date(d);
                const selected = d === date;
                return (
                  <button
                    key={d}
                    onClick={() => setDate(d)}
                    className={`min-w-[96px] px-3 py-3 rounded-xl border ${selected ? 'bg-darkblue text-white' : 'bg-white text-darkblue'}`}
                  >
                    <div className="text-xs opacity-80">{dt.toLocaleDateString([], { weekday: 'short' })}</div>
                    <div className="text-lg font-semibold">{dt.getDate()}</div>
                    <div className="text-xs opacity-80">{dt.toLocaleDateString([], { month: 'short' })}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time chips */}
          <div className="space-y-2">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {slots.length === 0 && (
                <div className="text-sm text-muted-foreground p-2">No available times for this day.</div>
              )}
              {slots.map(s => {
                const t = new Date(s.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const selected = slotId === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSlotId(s.id)}
                    className={`px-4 py-2 rounded-lg border ${selected ? 'bg-darkblue text-white' : 'bg-white text-darkblue'}`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details form */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="Your name *" value={name} onChange={e => setName(e.target.value)} />
              <Input placeholder="Email *" value={email} onChange={e => setEmail(e.target.value)} />
              <Input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
              <Input
                type="number"
                min={1}
                placeholder="Attendees"
                value={attendees}
                onChange={e => setAttendees(Number(e.target.value || 1))}
              />
            </div>
            <Button onClick={book} className="w-full bg-darkblue">Confirm booking</Button>
            <p className="text-xs text-muted-foreground">
              After booking, you’ll receive a confirmation email. Each time slot can be booked once.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
