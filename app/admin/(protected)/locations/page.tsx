// app/admin/locations/page.tsx
'use client';

import * as React from 'react';
import {
  Plus, RefreshCcw, Trash2, ArrowRight, ArrowLeft,
  CalendarClock, Sparkles, Pencil
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// postcode autocomplete
import PostcodeAutocomplete from '@/components/admin/PostcodeAutocomplete';
import LocationCombobox from '@/components/admin/LocationCombobox';

type Location = {
  id: string;
  name: string;
  address?: string | null;
  postcode?: string | null;
  lat?: number | null;
  lng?: number | null;
  created_at?: string;
};

type NewDay = {
  key: string;
  locationId: string;        // NEW
  serviceDate: string;
  windowStart: string;
  windowEnd: string;
  slotLengthMinutes: number;
  notes: string;
  autoGenerate: boolean;
};

export default function LocationsPage() {
  const { toast } = useToast();
  const [items, setItems] = React.useState<Location[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false); // create wizard dialog

  // Wizard state (Create)
  const [step, setStep] = React.useState<1 | 2>(1);
  const [savingLocation, setSavingLocation] = React.useState(false);
  const [savingDays, setSavingDays] = React.useState(false);
  const [createdLocation, setCreatedLocation] = React.useState<Location | null>(null);

  // Step 1 form (Create)
  const [form, setForm] = React.useState({
    name: '',
    address: '',
    postcode: '',
    lat: '',
    lng: '',
  });

  // Step 2 rows (Create)
  const [rows, setRows] = React.useState<NewDay[]>([]);

  // Edit dialog state
  const [openEdit, setOpenEdit] = React.useState(false);
  const [savingEdit, setSavingEdit] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [formEdit, setFormEdit] = React.useState({
    name: '',
    address: '',
    postcode: '',
    lat: '',
    lng: '',
  });

  const resetAll = React.useCallback(() => {
    setStep(1);
    setCreatedLocation(null);
    setForm({ name: '', address: '', postcode: '', lat: '', lng: '' });
    setRows([]);
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/locations', { cache: 'no-store' });
      const json = await res.json();
      setItems(json.locations ?? []);
    } catch (e: any) {
      toast({ title: 'Failed to load locations', description: e?.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => { load(); }, []);

  // ----- Create: resolve postcode on blur -----
  const resolvePostcodeOnBlur = async () => {
    const pc = form.postcode.trim();
    if (!pc) return;
    try {
      const r = await fetch(`/api/uk-postcodes?q=${encodeURIComponent(pc)}`, { cache: 'no-store' });
      const j = await r.json();
      const exact = (j.results ?? []).find((x: any) => String(x.postcode).toUpperCase() === pc.toUpperCase());
      if (exact) {
        setForm((f) => ({ ...f, postcode: exact.postcode, lat: String(exact.lat), lng: String(exact.lng) }));
      }
    } catch { /* noop */ }
  };

  // ----- Edit: resolve postcode on blur -----
  const resolvePostcodeOnBlurEdit = async () => {
    const pc = formEdit.postcode.trim();
    if (!pc) return;
    try {
      const r = await fetch(`/api/uk-postcodes?q=${encodeURIComponent(pc)}`, { cache: 'no-store' });
      const j = await r.json();
      const exact = (j.results ?? []).find((x: any) => String(x.postcode).toUpperCase() === pc.toUpperCase());
      if (exact) {
        setFormEdit((f) => ({ ...f, postcode: exact.postcode, lat: String(exact.lat), lng: String(exact.lng) }));
      }
    } catch { /* noop */ }
  };

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (!v) resetAll();
  };

  // ----- Step 1: Save location then go next -----
  const saveLocationAndNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast({ title: 'Name is required', variant: 'destructive' });
      return;
    }
    setSavingLocation(true);
    try {
      const body = {
        ...form,
        lat: form.lat ? Number(form.lat) : null,
        lng: form.lng ? Number(form.lng) : null,
      };
      const res = await fetch('/api/admin/locations', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Unable to create location');

      setCreatedLocation(j.location);

      // seed step 2 with a default day (tomorrow 09–17, 60m)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const dd = String(tomorrow.getDate()).padStart(2, '0');

      setRows([{
        key: cryptoRandomKey(),
        locationId: j.location.id, // NEW
        serviceDate: `${yyyy}-${mm}-${dd}`,
        windowStart: '09:00',
        windowEnd: '17:00',
        slotLengthMinutes: 60,
        notes: '',
        autoGenerate: true,
      }]);

      setStep(2);
      load(); // refresh list in background
      toast({ title: 'Location created', description: 'Add service days next.' });
    } catch (e: any) {
      toast({ title: 'Create failed', description: e?.message ?? 'Try again', variant: 'destructive' });
    } finally {
      setSavingLocation(false);
    }
  };

  // ----- Step 2 helpers (Create) -----
  const addRow = () => {
    setRows((prev) => {
      const last = prev[prev.length - 1];
      // default to the created location, or carry over the last row’s location
      const baseLoc = (last?.locationId || createdLocation?.id || '');

      // bump date by +1 day if last row has a date
      let nextDate = '';
      if (last?.serviceDate) {
        const d = new Date(last.serviceDate + 'T00:00:00Z');
        d.setUTCDate(d.getUTCDate() + 1);
        const yyyy = d.getUTCFullYear();
        const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(d.getUTCDate()).padStart(2, '0');
        nextDate = `${yyyy}-${mm}-${dd}`;
      }

      return [
        ...prev,
        {
          key: cryptoRandomKey(),
          locationId: baseLoc,              // ✅ carries over
          serviceDate: nextDate,            // ✅ bumps a day if possible
          windowStart: last?.windowStart || '09:00',
          windowEnd: last?.windowEnd || '17:00',
          slotLengthMinutes: last?.slotLengthMinutes ?? 60,
          notes: '',
          autoGenerate: last?.autoGenerate ?? true,
        },
      ];
    });
  };

  const removeRow = (key: string) => setRows((r) => r.filter((x) => x.key !== key));
  const updateRow = (key: string, patch: Partial<NewDay>) =>
    setRows((r) => r.map((x) => (x.key === key ? { ...x, ...patch } : x)));

  // ----- Step 2: Save all days (Create) -----
  const saveDaysAndClose = async () => {
    if (!createdLocation) { setStep(1); return; }
    if (rows.length === 0) { setOpen(false); return; }

    for (const row of rows) {
      if (!row.serviceDate || !row.windowStart || !row.windowEnd || !row.slotLengthMinutes) {
        toast({ title: 'Fill out all fields for each service day', variant: 'destructive' });
        return;
      }
    }

    setSavingDays(true);
    try {
      for (const row of rows) {
        const locId = row.locationId || createdLocation.id;
        const res = await fetch('/api/admin/service-days', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            locationId: locId,                  // UPDATED
            serviceDate: row.serviceDate,
            windowStart: row.windowStart,
            windowEnd: row.windowEnd,
            slotLengthMinutes: row.slotLengthMinutes,
            notes: row.notes || '',
          }),
        });
        const j = await res.json();
        if (!res.ok) throw new Error(j.error || 'Failed to create service day');

        if (row.autoGenerate && j?.serviceDay?.id) {
          await fetch('/api/admin/generate-slots', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ serviceDayId: j.serviceDay.id }),
          }).catch(() => { });
        }
      }

      toast({ title: 'Service days created', description: 'Manage them anytime on the Service Days tab.' });
      setOpen(false);
      resetAll();
      load();
    } catch (e: any) {
      toast({ title: 'Failed to create service days', description: e?.message ?? 'Try again', variant: 'destructive' });
    } finally {
      setSavingDays(false);
    }
  };

  // ----- Delete -----
  const remove = async (id: string) => {
    try {
      const res = await fetch('/api/admin/locations', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Delete failed');
      }
      toast({ title: 'Location deleted' });
      await load();
    } catch (e: any) {
      toast({ title: 'Unable to delete', description: e?.message ?? 'Resolve active bookings first.', variant: 'destructive' });
    }
  };

  // ----- Edit flow -----
  const openEditFor = (loc: Location) => {
    setEditId(loc.id);
    setFormEdit({
      name: loc.name ?? '',
      address: loc.address ?? '',
      postcode: loc.postcode ?? '',
      lat: loc.lat != null ? String(loc.lat) : '',
      lng: loc.lng != null ? String(loc.lng) : '',
    });
    setOpenEdit(true);
  };

  const editSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    setSavingEdit(true);
    try {
      const body = {
        id: editId,
        name: formEdit.name,
        address: formEdit.address,
        postcode: formEdit.postcode,
        lat: formEdit.lat === '' ? null : Number(formEdit.lat),
        lng: formEdit.lng === '' ? null : Number(formEdit.lng),
      };
      const res = await fetch('/api/admin/locations', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || 'Update failed');

      toast({ title: 'Location updated' });
      setOpenEdit(false);
      setEditId(null);
      await load();
    } catch (e: any) {
      toast({ title: 'Update failed', description: e?.message ?? 'Try again', variant: 'destructive' });
    } finally {
      setSavingEdit(false);
    }
  };

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((l) =>
      [l.name, l.address, l.postcode]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [items, search]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Locations</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Input
              placeholder="Search by name, address, postcode…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[240px] sm:w-[320px]"
            />
          </div>

          <Button variant="outline" onClick={load} title="Refresh">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          {/* Create Wizard Dialog */}
          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New location
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[720px]">
              <DialogHeader>
                <DialogTitle>
                  {step === 1 ? 'Add a new location' : `Add service days for “${createdLocation?.name ?? ''}”`}
                </DialogTitle>
                <WizardSteps step={step} />
              </DialogHeader>

              {/* STEP 1: Create Location */}
              {step === 1 && (
                <form onSubmit={saveLocationAndNext} className="grid gap-4 pt-2">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      required
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="e.g., London Clinic"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={form.address}
                      onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                      placeholder="123 Street, City"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Postcode</Label>
                    <PostcodeAutocomplete
                      value={form.postcode}
                      onChange={(text) => {
                        setForm((f) => ({ ...f, postcode: text, lat: '', lng: '' }));
                      }}
                      onSelect={(s) => {
                        setForm((f) => ({ ...f, postcode: s.postcode, lat: String(s.lat), lng: String(s.lng) }));
                      }}
                      placeholder="Start typing (e.g., SW1A 1AA)…"
                    />
                    <p className="text-xs text-muted-foreground">
                      Pick a suggestion to auto-fill coordinates. If typed manually, we’ll try to resolve on blur.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="lat">Latitude</Label>
                      <Input
                        id="lat"
                        inputMode="decimal"
                        value={form.lat}
                        onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
                        onBlur={resolvePostcodeOnBlur}
                        placeholder="auto-filled"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="lng">Longitude</Label>
                      <Input
                        id="lng"
                        inputMode="decimal"
                        value={form.lng}
                        onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))}
                        onBlur={resolvePostcodeOnBlur}
                        placeholder="auto-filled"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={savingLocation}>
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  <Separator />
                  <div className="text-xs text-muted-foreground">
                    You can add service days now or later in the <b>Service Days</b> tab.
                  </div>
                </form>
              )}

              {/* STEP 2: Add Service Days */}
              {step === 2 && createdLocation && (
                <div className="grid gap-4 pt-2">
                  <div className="rounded border bg-muted/40 px-3 py-2 text-sm">
                    Adding availability for <b>{createdLocation.name}</b>
                    {createdLocation.postcode ? <> — <span className="text-muted-foreground">{createdLocation.postcode}</span></> : null}
                  </div>

                  <div className="space-y-3">
                    {rows.map((row, idx) => (
                      <div key={row.key} className="rounded-md border p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarClock className="h-4 w-4" />
                            Day {idx + 1}
                          </div>
                          <Button size="icon" variant="ghost" onClick={() => removeRow(row.key)} title="Remove">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="grid gap-2">
                            <Label>Location</Label>
                            <LocationCombobox
                              value={row.locationId}
                              onChange={(id) => updateRow(row.key, { locationId: id ?? '' })}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Date</Label>
                            <Input
                              type="date"
                              value={row.serviceDate}
                              onChange={(e) => updateRow(row.key, { serviceDate: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="grid gap-2">
                            <Label>Start time</Label>
                            <Input
                              type="time"
                              value={row.windowStart}
                              onChange={(e) => updateRow(row.key, { windowStart: e.target.value })}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>End time</Label>
                            <Input
                              type="time"
                              value={row.windowEnd}
                              onChange={(e) => updateRow(row.key, { windowEnd: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label>Notes (optional)</Label>
                          <Input
                            placeholder="Any additional info"
                            value={row.notes}
                            onChange={(e) => updateRow(row.key, { notes: e.target.value })}
                          />
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant={row.autoGenerate ? 'default' : 'outline'}
                            onClick={() => updateRow(row.key, { autoGenerate: !row.autoGenerate })}
                          >
                            <Sparkles className="mr-2 h-4 w-4" />
                            {row.autoGenerate ? 'Will auto-generate slots' : 'Auto-generate OFF'}
                          </Button>
                          <div className="text-xs text-muted-foreground">
                            If ON, we’ll create slots {row.slotLengthMinutes}m apart.
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="flex items-center justify-between">
                      <Button variant="outline" onClick={addRow}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add another day
                      </Button>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => setStep(1)}>
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back
                        </Button>
                        <Button onClick={saveDaysAndClose} disabled={savingDays}>
                          Save & finish
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={openEdit} onOpenChange={(v) => { setOpenEdit(v); if (!v) setEditId(null); }}>
            <DialogContent className="sm:max-w-[640px]">
              <DialogHeader>
                <DialogTitle>Edit location</DialogTitle>
              </DialogHeader>

              <form onSubmit={editSubmit} className="grid gap-4 pt-2">
                <div className="grid gap-2">
                  <Label htmlFor="ename">Name</Label>
                  <Input
                    id="ename"
                    required
                    value={formEdit.name}
                    onChange={(e) => setFormEdit((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="eaddr">Address</Label>
                  <Input
                    id="eaddr"
                    value={formEdit.address}
                    onChange={(e) => setFormEdit((f) => ({ ...f, address: e.target.value }))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Postcode</Label>
                  <PostcodeAutocomplete
                    value={formEdit.postcode}
                    onChange={(text) => setFormEdit((f) => ({ ...f, postcode: text, lat: '', lng: '' }))}
                    onSelect={(s) => setFormEdit((f) => ({ ...f, postcode: s.postcode, lat: String(s.lat), lng: String(s.lng) }))}
                    placeholder="Start typing (e.g., SW1A 1AA)…"
                  />
                  <p className="text-xs text-muted-foreground">
                    Pick a suggestion to auto-fill coordinates. If typed manually, we’ll try to resolve on blur.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="elat">Latitude</Label>
                    <Input
                      id="elat"
                      inputMode="decimal"
                      value={formEdit.lat}
                      onChange={(e) => setFormEdit((f) => ({ ...f, lat: e.target.value }))}
                      onBlur={resolvePostcodeOnBlurEdit}
                      placeholder="auto-filled"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="elng">Longitude</Label>
                    <Input
                      id="elng"
                      inputMode="decimal"
                      value={formEdit.lng}
                      onChange={(e) => setFormEdit((f) => ({ ...f, lng: e.target.value }))}
                      onBlur={resolvePostcodeOnBlurEdit}
                      placeholder="auto-filled"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setOpenEdit(false)}>Cancel</Button>
                  <Button type="submit" disabled={savingEdit}>{savingEdit ? 'Saving…' : 'Save changes'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">All locations</CardTitle>
          <Badge variant="secondary">{filtered.length}</Badge>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No locations found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[26%]">Name</TableHead>
                    <TableHead className="w-[34%]">Address</TableHead>
                    <TableHead className="w-[18%]">Postcode</TableHead>
                    <TableHead className="w-[16%] text-right">Coordinates</TableHead>
                    <TableHead className="w-[6%]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((l) => (
                    <TableRow key={l.id} className="align-top">
                      <TableCell className="font-medium">{l.name}</TableCell>
                      <TableCell className="text-muted-foreground">{l.address || '—'}</TableCell>
                      <TableCell>{l.postcode || '—'}</TableCell>
                      <TableCell className="text-right">
                        {l.lat != null && l.lng != null ? (
                          <code className="rounded bg-muted px-2 py-1 text-xs">
                            {l.lat.toFixed(5)}, {l.lng.toFixed(5)}
                          </code>
                        ) : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            title="Edit"
                            onClick={() => openEditFor(l)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="ghost" title="Delete">
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete this location?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This removes the location, its service days, and their slots.
                                  Deletion will be blocked if there are active bookings.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => remove(l.id)} className="bg-red-600 hover:bg-red-700">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/** Tiny local key generator for rows */
function cryptoRandomKey() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    // @ts-ignore
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

function WizardSteps({ step }: { step: 1 | 2 }) {
  return (
    <div className="mt-2 flex items-center gap-2 text-xs">
      <div className={`rounded-full px-2 py-0.5 ${step === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
        1. Location
      </div>
      <span className="text-muted-foreground">→</span>
      <div className={`rounded-full px-2 py-0.5 ${step === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
        2. Service days
      </div>
    </div>
  );
}
