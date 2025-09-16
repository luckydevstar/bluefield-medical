'use client';

import * as React from 'react';
import { CalendarClock, Plus, RefreshCcw, Sparkles, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

type Location = {
  id: string;
  name: string;
};

type ServiceDay = {
  id: string;
  location_id: string;
  service_date: string;         // YYYY-MM-DD
  window_start: string;         // HH:mm
  window_end: string;           // HH:mm
  slot_length_minutes: number;
  notes?: string | null;
  locations?: { name: string }; // joined from API
};

export default function ServiceDaysPage() {
  const { toast } = useToast();

  const [locations, setLocations] = React.useState<Location[]>([]);
  const [serviceDays, setServiceDays] = React.useState<ServiceDay[]>([]);
  const [loading, setLoading] = React.useState(true);

  // filters
  const [filterLoc, setFilterLoc] = React.useState<string>('all');
  const [search, setSearch] = React.useState('');

  // dialog state
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  // form
  const [form, setForm] = React.useState({
    locationId: '',
    serviceDate: '',
    windowStart: '09:00',
    windowEnd: '17:00',
    slotLengthMinutes: 60,
    notes: '',
  });

  const resetForm = () =>
    setForm({
      locationId: '',
      serviceDate: '',
      windowStart: '09:00',
      windowEnd: '17:00',
      slotLengthMinutes: 60,
      notes: '',
    });

  const load = async () => {
    setLoading(true);
    try {
      const [L, SD] = await Promise.all([
        fetch('/api/admin/locations', { cache: 'no-store' }).then((r) => r.json()),
        fetch('/api/admin/service-days', { cache: 'no-store' }).then((r) => r.json()),
      ]);
      setLocations(L.locations ?? []);
      setServiceDays(SD.serviceDays ?? []);
    } catch (e: any) {
      toast({ title: 'Failed to load', description: e?.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.locationId || !form.serviceDate) {
      toast({ title: 'Missing fields', description: 'Location and Date are required.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/service-days', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Unable to create service day');
      }
      toast({ title: 'Service day created' });
      resetForm();
      setOpen(false);
      await load();
    } catch (e: any) {
      toast({ title: 'Create failed', description: e?.message ?? 'Try again', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const generateSlots = async (serviceDayId: string) => {
    try {
      const res = await fetch('/api/admin/generate-slots', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ serviceDayId }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Generation failed');
      }
      toast({ title: 'Slots generated' });
    } catch (e: any) {
      console.log(e);
      toast({ title: 'Failed to generate slots', description: e?.message ?? 'Try again', variant: 'destructive' });
    }
  };

  const removeServiceDay = async (id: string) => {
    try {
      const res = await fetch('/api/admin/service-days', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Delete failed');
      }
      toast({ title: 'Service day deleted' });
      await load();
    } catch (e: any) {
      toast({
        title: 'Unable to delete',
        description: e?.message ?? 'Resolve active bookings first.',
        variant: 'destructive',
      });
    }
  };


  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return serviceDays.filter((sd) => {
      const matchesLoc = filterLoc === 'all' || sd.location_id === filterLoc;
      const hay = `${sd.locations?.name ?? ''} ${sd.service_date} ${sd.window_start} ${sd.window_end} ${sd.notes ?? ''}`.toLowerCase();
      const matchesText = !q || hay.includes(q);
      return matchesLoc && matchesText;
    });
  }, [serviceDays, filterLoc, search]);

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

          <Select value={filterLoc} onValueChange={setFilterLoc}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All locations</SelectItem>
              {locations.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={load} title="Refresh">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
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

              <form onSubmit={submit} className="grid gap-4 pt-2">
                <div className="grid gap-2">
                  <Label>Location</Label>
                  <Select
                    value={form.locationId}
                    onValueChange={(v) => setForm((f) => ({ ...f, locationId: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((l) => (
                        <SelectItem key={l.id} value={l.id}>
                          {l.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="serviceDate">Date</Label>
                  <Input
                    id="serviceDate"
                    type="date"
                    value={form.serviceDate}
                    onChange={(e) => setForm((f) => ({ ...f, serviceDate: e.target.value }))}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="windowStart">Start time</Label>
                    <Input
                      id="windowStart"
                      type="time"
                      value={form.windowStart}
                      onChange={(e) => setForm((f) => ({ ...f, windowStart: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="windowEnd">End time</Label>
                    <Input
                      id="windowEnd"
                      type="time"
                      value={form.windowEnd}
                      onChange={(e) => setForm((f) => ({ ...f, windowEnd: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="slotLength">Slot length (minutes)</Label>
                  <Input
                    id="slotLength"
                    type="number"
                    min={5}
                    max={480}
                    value={form.slotLengthMinutes}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, slotLengthMinutes: Number(e.target.value) || 0 }))
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional info"
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving…' : 'Save'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Slots are generated separately; click “Generate” after saving.
                </p>
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
                      <TableCell>
                        {sd.window_start} → {sd.window_end}
                      </TableCell>
                      <TableCell>{sd.slot_length_minutes} min</TableCell>
                      <TableCell className="text-right">
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
                                <strong>{sd.slot_length_minutes} min</strong> increments. Existing
                                identical slots will be ignored.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => generateSlots(sd.id)}
                              >
                                Generate
                              </AlertDialogAction>
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
                              <AlertDialogAction onClick={() => removeServiceDay(sd.id)} className="bg-red-600 hover:bg-red-700">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
