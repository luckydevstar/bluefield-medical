'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea'; // if you decide to add notes later
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import {
  CalendarDays, Clock, Loader2, MapPin, Search, CheckCircle2, AlertCircle,
} from 'lucide-react';
import LocationsMap from '@/components/common/LocationsMap';

type Location = { id: string; name: string; postcode?: string | null };
type ServiceDay = {
  id: string;
  location_id: string;
  service_date: string;
  window_start: string;
  window_end: string;
  slot_length_minutes: number;
};
type Slot = { id: string; start_utc: string; end_utc: string };

export function BookingVehicleView() {
  type AvailableLoc = {
    locationId: string;
    name: string;
    postcode: string | null;
    lat: number | null;     // <-- add
    lng: number | null;     // <-- add
    service_date: string;
    minStartUtc: string;
    maxEndUtc: string;
  };

  const [available, setAvailable] = React.useState<AvailableLoc[]>([]);
  const [loadingAvailable, setLoadingAvailable] = React.useState(false);

  function formatUKTime(iso: string) {
    return new Date(iso).toLocaleTimeString('en-GB', {
      timeZone: 'Europe/London',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  // robust UK date formatter (anchor at noon UTC to avoid DST/day roll)
  function formatUKDate(d: string) {
    const atNoonUTC = new Date(`${d}T12:00:00Z`);
    return atNoonUTC.toLocaleDateString('en-GB', {
      timeZone: 'Europe/London',
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  async function loadAvailable() {
    setLoadingAvailable(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const res = await fetch(`/api/available-locations?from=${today}`, { cache: 'no-store' });
      const json = await res.json();
      setAvailable(json.results ?? []);
    } catch (e: any) {
      // optional toast if you like
    } finally {
      setLoadingAvailable(false);
    }
  }
  React.useEffect(() => { loadAvailable(); }, []);

  const sp = useSearchParams();

  const [postcode, setPostcode] = React.useState('');
  const [locations, setLocations] = React.useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = React.useState<string>('');

  const [serviceDays, setServiceDays] = React.useState<ServiceDay[]>([]);
  const [selectedServiceDay, setSelectedServiceDay] = React.useState<string>('');

  const [slots, setSlots] = React.useState<Slot[]>([]);

  const [loadingSearch, setLoadingSearch] = React.useState(false);
  const [loadingDays, setLoadingDays] = React.useState(false);
  const [loadingSlots, setLoadingSlots] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const [form, setForm] = React.useState({
    orgName: '',
    contactName: '',
    email: '',
    phone: '',
    attendees: 1,
    slotId: '',
  });

  // show status from /api/bookings/confirm redirect
  const status = sp.get('status');

  React.useEffect(() => {
    if (!status) return;
    if (status === 'success') {
      toast('Booking confirmed, Thanks — your appointment is set.');
    } else if (status === 'expired') {
      toast('Confirmation expired. Please pick a slot and reserve again.');
    } else if (status === 'invalid') {
      toast('Invalid link. The confirmation link was invalid. Try reserving again.');
    }
  }, [status, toast]);

  const mapMarkers = React.useMemo(
    () =>
      available
        .filter((l) => typeof l.lat === 'number' && typeof l.lng === 'number')
        .map((l) => ({
          locationId: l.locationId,
          name: l.name,
          postcode: l.postcode,
          lat: l.lat as number,
          lng: l.lng as number,
        })),
    [available]
  );

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatRange = (s: string, e: string) => `${formatTime(s)} – ${formatTime(e)}`;

  const resetAfterSearch = () => {
    setSelectedLocation('');
    setServiceDays([]);
    setSelectedServiceDay('');
    setSlots([]);
    setForm((f) => ({ ...f, slotId: '' }));
  };

  const search = async () => {
    if (!postcode.trim()) {
      toast('Postcode required');
      return;
    }
    setLoadingSearch(true);
    try {
      const res = await fetch(
        `/api/locations?postcode=${encodeURIComponent(postcode.trim())}&radiusKm=50`,
        { cache: 'no-store' }
      );
      const json = await res.json();
      setLocations(json.locations ?? []);
      resetAfterSearch();
      if (!json.locations || json.locations.length === 0) {
        toast('No locations found. Try a different postcode or radius.');
      }
    } catch (e: any) {
      toast('Search failed. Please try again.');
    } finally {
      setLoadingSearch(false);
    }
  };

  const loadDays = async (locationId: string) => {
    setSelectedLocation(locationId);
    setLoadingDays(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const res = await fetch(
        `/api/service-days?locationId=${locationId}&from=${today}`,
        { cache: 'no-store' }
      );
      const json = await res.json();
      setServiceDays(json.serviceDays ?? []);
      setSelectedServiceDay('');
      setSlots([]);
      setForm((f) => ({ ...f, slotId: '' }));
    } catch (e: any) {
      toast('Failed to load dates. Try again.');
    } finally {
      setLoadingDays(false);
    }
  };

  const loadSlots = async (serviceDayId: string) => {
    setSelectedServiceDay(serviceDayId);
    setLoadingSlots(true);
    try {
      const res = await fetch(`/api/slots?serviceDayId=${serviceDayId}`, { cache: 'no-store' });
      const json = await res.json();
      setSlots(json.slots ?? []);
      setForm((f) => ({ ...f, slotId: '' }));
      if (!json.slots || json.slots.length === 0) {
        toast('No available slots. Please choose another date.');
      }
    } catch (e: any) {
      toast('Failed to load slots. Try again.');
    } finally {
      setLoadingSlots(false);
    }
  };

  const validate = () => {
    if (!form.slotId) {
      toast('Pick a time slot');
      return false;
    }
    if (!form.orgName.trim() || !form.contactName.trim() || !form.email.trim()) {
      toast('Missing details. Organisation, contact name, and email are required.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      toast('Invalid email. Enter a valid email address.');
      return false;
    }
    if (form.attendees < 1 || form.attendees > 500) {
      toast('Attendees out of range. Enter between 1 and 500.');
      return false;
    }
    return true;
  };

  const reserve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = { ...form, attendees: Number(form.attendees) };
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed to reserve');

      toast('Reservation created. Check your email to confirm within 10 minutes.');
      // Optional: reset the personal details but keep search context
      setForm((f) => ({ ...f, orgName: '', contactName: '', email: '', phone: '', attendees: 1, slotId: '' }));
    } catch (err: any) {
      toast('Reservation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-6 space-y-6 mt-10">
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5" />
        <h1 className="text-2xl font-semibold">Book a Bluefield Appointment</h1>
      </div>

      {/* Status banner (also echoed via toasts) */}
      {status && (
        <Alert className={status === 'success' ? 'border-green-600/50' : 'border-amber-500/50'}>
          <AlertDescription className="flex items-center gap-2">
            {status === 'success' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
            {status !== 'success' && <AlertCircle className="h-4 w-4 text-amber-600" />}
            {status === 'success' ? 'Booking confirmed!' :
              status === 'expired' ? 'Confirmation expired. Please book again.' :
                'Invalid confirmation link.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Available locations (minimal) + Map */}
      <div className="">
        <Card>
          <CardHeader>
            <CardTitle>Available locations (upcoming)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className='flex gap-4'>
              <LocationsMap
                className="h-[420px] w-full rounded-md border"
                markers={mapMarkers}
              />
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Step 1: Find a location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            Find a location near you
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <div className="grid gap-2">
              <Label htmlFor="postcode">Your postcode</Label>
              <Input
                id="postcode"
                placeholder="e.g., SW1A 1AA"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                disabled={loadingSearch}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={search} disabled={loadingSearch}>
                {loadingSearch && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Search
              </Button>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Choose location</Label>
              <Select
                value={selectedLocation}
                onValueChange={(v) => loadDays(v)}
                disabled={locations.length === 0 || loadingDays || loadingSearch}
              >
                <SelectTrigger>
                  <SelectValue placeholder={locations.length ? 'Select a location' : 'Search to load locations'} />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((l) => (
                    <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Choose date</Label>
              <Select
                value={selectedServiceDay}
                onValueChange={(v) => loadSlots(v)}
                disabled={!selectedLocation || loadingSlots || loadingDays}
              >
                <SelectTrigger>
                  <SelectValue placeholder={serviceDays.length ? 'Select a date' : 'Pick a location first'} />
                </SelectTrigger>
                <SelectContent>
                  {serviceDays.map((sd) => (
                    <SelectItem key={sd.id} value={sd.id}>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <span>{sd.service_date}</span>
                        <span className="text-muted-foreground">({sd.window_start}–{sd.window_end})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Slots */}
          <div className="grid gap-2">
            <Label>Available time slots</Label>
            {loadingSlots ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading slots…
              </div>
            ) : slots.length === 0 ? (
              <p className="text-sm text-muted-foreground">No slots to show.</p>
            ) : (
              <RadioGroup
                value={form.slotId}
                onValueChange={(v) => setForm((f) => ({ ...f, slotId: v }))}
                className="grid grid-cols-2 md:grid-cols-3 gap-2"
              >
                {slots.map((s) => (
                  <label
                    key={s.id}
                    className="flex cursor-pointer items-center gap-2 rounded-md border p-2 hover:bg-accent"
                  >
                    <RadioGroupItem value={s.id} />
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatRange(s.start_utc, s.end_utc)}</span>
                  </label>
                ))}
              </RadioGroup>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Your details */}
      <Card>
        <CardHeader>
          <CardTitle>Your details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={reserve} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="orgName">Organisation</Label>
              <Input
                id="orgName"
                value={form.orgName}
                onChange={(e) => setForm((f) => ({ ...f, orgName: e.target.value }))}
                placeholder="Your organisation"
              />
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="contactName">Contact name</Label>
                <Input
                  id="contactName"
                  value={form.contactName}
                  onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))}
                  placeholder="Full name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+44 ..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="attendees">Attendees</Label>
                <Input
                  id="attendees"
                  type="number"
                  min={1}
                  max={500}
                  value={form.attendees}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, attendees: Number(e.target.value) || 1 }))
                  }
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button type="submit" disabled={!form.slotId || submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reserve slot
              </Button>
              {!form.slotId && (
                <span className="text-xs text-muted-foreground">Pick a time slot first.</span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        After you reserve, you’ll receive a confirmation link by email. The slot is held for 10 minutes.
      </p>
    </div>
  );
}
