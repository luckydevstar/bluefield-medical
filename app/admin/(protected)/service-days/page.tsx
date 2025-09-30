'use client';

import * as React from 'react';
import { CalendarClock, Plus, RefreshCcw, Sparkles, Trash2, Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

// NEW: typeahead location picker
import LocationCombobox from '@/components/admin/LocationCombobox';

type ServiceDay = {
  id: string;
  location_id: string;
  service_date: string; // YYYY-MM-DD
  window_start: string; // HH:mm
  window_end: string;   // HH:mm
  slot_length_minutes: number;
  notes?: string | null;
  locations?: { name: string } | null;
};

export default function ServiceDaysPage() {
  const { toast } = useToast();

  const [serviceDays, setServiceDays] = React.useState<ServiceDay[]>([]);
  const [loading, setLoading] = React.useState(true);

  // list filters
  const [search, setSearch] = React.useState('');

  // create dialog
  const [openCreate, setOpenCreate] = React.useState(false);
  const [savingCreate, setSavingCreate] = React.useState(false);
  const [createForm, setCreateForm] = React.useState({
    locationId: '',
    serviceDate: '',
    windowStart: '09:00',
    windowEnd: '17:00',
    slotLengthMinutes: 60,
    notes: '',
    autoGenerate: true,
  });

  // edit dialog
  const [openEdit, setOpenEdit] = React.useState(false);
  const [savingEdit, setSavingEdit] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [editForm, setEditForm] = React.useState({
    locationId: '',
    serviceDate: '',
    windowStart: '09:00',
    windowEnd: '17:00',
    slotLengthMinutes: 60,
    notes: '',
    regenerateSlots: false,
  });

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/service-days', { cache: 'no-store' });
      const j = await r.json();
      setServiceDays(j.serviceDays ?? []);
    } catch (e: any) {
      toast({ title: 'Failed to load', description: e?.message, variant: 'destructive' });
    } finally { setLoading(false); }
  };
  React.useEffect(() => { load(); }, []);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return serviceDays.filter(sd => {
      const hay = `${sd.locations?.name ?? ''} ${sd.service_date} ${sd.window_start} ${sd.window_end} ${sd.notes ?? ''}`.toLowerCase();
      return !q || hay.includes(q);
    });
  }, [serviceDays, search]);

  // CREATE
  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.locationId || !createForm.serviceDate) {
      toast({ title: 'Location & date required', variant: 'destructive' });
      return;
    }
    setSavingCreate(true);
    try {
      const res = await fetch('/api/admin/service-days', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          locationId: createForm.locationId,
          serviceDate: createForm.serviceDate,
          windowStart: createForm.windowStart,
          windowEnd: createForm.windowEnd,
          slotLengthMinutes: createForm.slotLengthMinutes,
          notes: createForm.notes,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Create failed');

      if (createForm.autoGenerate && j?.serviceDay?.id) {
        await fetch('/api/admin/generate-slots', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ serviceDayId: j.serviceDay.id }),
        }).catch(() => { });
      }
      toast({ title: 'Service day created' });
      setOpenCreate(false);
      setCreateForm({
        locationId: '',
        serviceDate: '',
        windowStart: '09:00',
        windowEnd: '17:00',
        slotLengthMinutes: 60,
        notes: '',
        autoGenerate: true,
      });
      await load();
    } catch (e: any) {
      toast({ title: 'Create failed', description: e?.message ?? 'Try again', variant: 'destructive' });
    } finally { setSavingCreate(false); }
  };

  // EDIT
  const openEditFor = (sd: ServiceDay) => {
    setEditId(sd.id);
    setEditForm({
      locationId: sd.location_id,
      serviceDate: sd.service_date,
      windowStart: sd.window_start,
      windowEnd: sd.window_end,
      slotLengthMinutes: sd.slot_length_minutes,
      notes: sd.notes ?? '',
      regenerateSlots: false,
    });
    setOpenEdit(true);
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    setSavingEdit(true);
    try {
      const res = await fetch('/api/admin/service-days', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          id: editId,
          locationId: editForm.locationId,
          serviceDate: editForm.serviceDate,
          windowStart: editForm.windowStart,
          windowEnd: editForm.windowEnd,
          slotLengthMinutes: editForm.slotLengthMinutes,
          notes: editForm.notes,
          regenerateSlots: editForm.regenerateSlots,
        }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || 'Update failed');

      toast({ title: 'Service day updated' });
      setOpenEdit(false);
      setEditId(null);
      await load();
    } catch (e: any) {
      toast({ title: 'Update failed', description: e?.message ?? 'Try again', variant: 'destructive' });
    } finally { setSavingEdit(false); }
  };

  // DELETE
  const removeServiceDay = async (id: string) => {
    try {
      const res = await fetch('/api/admin/service-days', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || 'Delete failed');
      toast({ title: 'Service day deleted' });
      await load();
    } catch (e: any) {
      toast({ title: 'Unable to delete', description: e?.message ?? 'Resolve active bookings first.', variant: 'destructive' });
    }
  };

  // GENERATE
  const generateSlots = async (serviceDayId: string) => {
    try {
      const res = await fetch('/api/admin/generate-slots', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ serviceDayId }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || 'Generation failed');
      toast({ title: 'Slots generated' });
    } catch (e: any) {
      toast({ title: 'Failed to generate slots', description: e?.message ?? 'Try again', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Service Days</h2>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search date, location, notes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[240px] sm:w-[320px]"
          />
          <Button variant="outline" onClick={load}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New service day
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a service day</DialogTitle>
              </DialogHeader>
              <form onSubmit={submitCreate} className="grid gap-4 pt-2">
                <div className="grid gap-2">
                  <Label>Location</Label>
                  <LocationCombobox
                    value={createForm.locationId}
                    onChange={(id) => setCreateForm((f) => ({ ...f, locationId: id ?? '' }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={createForm.serviceDate}
                    onChange={(e) => setCreateForm((f) => ({ ...f, serviceDate: e.target.value }))}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>Start time</Label>
                    <Input
                      type="time"
                      value={createForm.windowStart}
                      onChange={(e) => setCreateForm((f) => ({ ...f, windowStart: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>End time</Label>
                    <Input
                      type="time"
                      value={createForm.windowEnd}
                      onChange={(e) => setCreateForm((f) => ({ ...f, windowEnd: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Slot length (minutes)</Label>
                  <Input
                    type="number"
                    min={5}
                    max={480}
                    value={createForm.slotLengthMinutes}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, slotLengthMinutes: Number(e.target.value) || 0 }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Notes (optional)</Label>
                  <Textarea
                    placeholder="Any additional info"
                    value={createForm.notes}
                    onChange={(e) => setCreateForm((f) => ({ ...f, notes: e.target.value }))}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant={createForm.autoGenerate ? 'default' : 'outline'}
                    onClick={() => setCreateForm((f) => ({ ...f, autoGenerate: !f.autoGenerate }))}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {createForm.autoGenerate ? 'Auto-generate slots' : 'Auto-generate OFF'}
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    Creates slots in {createForm.slotLengthMinutes}m increments.
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setOpenCreate(false)}>Cancel</Button>
                  <Button type="submit" disabled={savingCreate}>{savingCreate ? 'Saving…' : 'Save'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Upcoming service days</CardTitle>
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
              No service days found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[28%]">Location</TableHead>
                    <TableHead className="w-[18%]">Date</TableHead>
                    <TableHead className="w-[24%]">Window</TableHead>
                    <TableHead className="w-[14%]">Slot length</TableHead>
                    <TableHead className="w-[16%]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((sd) => (
                    <TableRow key={sd.id} className="align-top">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <CalendarClock className="h-4 w-4 text-muted-foreground" />
                          {sd.locations?.name || '—'}
                        </div>
                        {sd.notes && (
                          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {sd.notes}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{sd.service_date}</TableCell>
                      <TableCell>{sd.window_start} → {sd.window_end}</TableCell>
                      <TableCell>{sd.slot_length_minutes} min</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => openEditFor(sd)} title="Edit">
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="secondary">
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Generate time slots?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will create slots from <strong>{sd.window_start}</strong> to{' '}
                                  <strong>{sd.window_end}</strong> in{' '}
                                  <strong>{sd.slot_length_minutes} min</strong> increments.
                                  Existing identical slots will be ignored.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => generateSlots(sd.id)}>Generate</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="ghost" title="Delete">
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete this service day?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This removes the service day and all its slots.
                                  Deletion will be blocked if there are active bookings.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => removeServiceDay(sd.id)}>
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

      {/* EDIT dialog */}
      <Dialog open={openEdit} onOpenChange={(v) => { setOpenEdit(v); if (!v) setEditId(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit service day</DialogTitle></DialogHeader>
          <form onSubmit={submitEdit} className="grid gap-4 pt-2">
            <div className="grid gap-2">
              <Label>Location</Label>
              <LocationCombobox
                value={editForm.locationId}
                onChange={(id) => setEditForm((f) => ({ ...f, locationId: id ?? '' }))}
              />
            </div>
            <div className="grid gap-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={editForm.serviceDate}
                onChange={(e) => setEditForm((f) => ({ ...f, serviceDate: e.target.value }))}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Start time</Label>
                <Input
                  type="time"
                  value={editForm.windowStart}
                  onChange={(e) => setEditForm((f) => ({ ...f, windowStart: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label>End time</Label>
                <Input
                  type="time"
                  value={editForm.windowEnd}
                  onChange={(e) => setEditForm((f) => ({ ...f, windowEnd: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Slot length (minutes)</Label>
              <Input
                type="number"
                min={5}
                max={480}
                value={editForm.slotLengthMinutes}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, slotLengthMinutes: Number(e.target.value) || 0 }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Notes (optional)</Label>
              <Textarea
                value={editForm.notes}
                onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </div>

            <div className="rounded border p-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editForm.regenerateSlots}
                  onChange={(e) => setEditForm((f) => ({ ...f, regenerateSlots: e.target.checked }))}
                />
                Regenerate open/held slots for this day after saving
              </label>
              <p className="mt-1 text-xs text-muted-foreground">
                We’ll remove <b>OPEN</b>/<b>BLOCKED</b> slots and recreate from the new window/length.
                If any <b>CONFIRMED</b> bookings exist, regeneration will be blocked.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpenEdit(false)}>Cancel</Button>
              <Button type="submit" disabled={savingEdit}>{savingEdit ? 'Saving…' : 'Save changes'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
