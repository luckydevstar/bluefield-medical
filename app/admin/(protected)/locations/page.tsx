'use client';

import * as React from 'react';
import { Plus, RefreshCcw, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// ⬇️ NEW: postcode autocomplete
import PostcodeAutocomplete from '@/components/admin/PostcodeAutocomplete';

type Location = {
  id: string;
  name: string;
  address?: string | null;
  postcode?: string | null;
  lat?: number | null;
  lng?: number | null;
  created_at?: string;
};

export default function LocationsPage() {
  const { toast } = useToast();
  const [items, setItems] = React.useState<Location[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const [form, setForm] = React.useState({
    name: '',
    address: '',
    postcode: '',
    lat: '',
    lng: '',
  });

  const resetForm = () =>
    setForm({ name: '', address: '', postcode: '', lat: '', lng: '' });

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

  React.useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
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
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Unable to create location');
      }
      toast({ title: 'Location created' });
      resetForm();
      setOpen(false);
      await load();
    } catch (e: any) {
      toast({ title: 'Create failed', description: e?.message ?? 'Try again', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

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

  // If user types a postcode and doesn’t pick from the list, try to resolve on blur
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
    } catch {
      /* noop */
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

          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New location
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a new location</DialogTitle>
              </DialogHeader>

              <form onSubmit={submit} className="grid gap-4 pt-2">
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

                {/* ⬇️ REPLACED: Postcode input -> Autocomplete with auto-fill lat/lng */}
                <div className="grid gap-2">
                  <Label>Postcode</Label>
                  <PostcodeAutocomplete
                    value={form.postcode}
                    onChange={(text) => {
                      setForm((f) => ({ ...f, postcode: text, lat: '', lng: '' })); // clear coords until a suggestion is picked
                    }}
                    onSelect={(s) => {
                      setForm((f) => ({ ...f, postcode: s.postcode, lat: String(s.lat), lng: String(s.lng) }));
                    }}
                    placeholder="Start typing (e.g., SW1A 1AA)…"
                  />
                  <p className="text-xs text-muted-foreground">Pick a suggestion to auto-fill coordinates. If you type manually, we’ll try to resolve on blur.</p>
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

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving…' : 'Save'}
                  </Button>
                </div>
              </form>

              <Separator />
              <div className="text-xs text-muted-foreground">
                Tip: You can leave coordinates empty now and update later.
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

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
                    <TableHead className="w-[28%]">Name</TableHead>
                    <TableHead className="w-[34%]">Address</TableHead>
                    <TableHead className="w-[18%]">Postcode</TableHead>
                    <TableHead className="w-[14%] text-right">Coordinates</TableHead>
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
