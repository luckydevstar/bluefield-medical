'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RefreshCcw } from 'lucide-react';

type Row = {
  id: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED';
  attendees: number;
  created_at: string;
  updated_at: string;
  slots: { id: string; start_utc: string; end_utc: string; service_days: { id: string; service_date: string; locations: { id: string; name: string } } };
  org_name: string;
  contact_name: string;
  email: string;
  phone?: string | null;
};

export default function AdminBookingsPage() {
  const { toast } = useToast();
  const [rows, setRows] = React.useState<Row[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [status, setStatus] = React.useState<'all' | Row['status']>('all');
  const [q, setQ] = React.useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/bookings', { cache: 'no-store' });
      const j = await res.json();
      setRows(j.bookings ?? []);
    } catch (e: any) {
      toast({ title: 'Failed to load', description: e?.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { load(); }, []);

  const filtered = rows.filter((r) => {
    const okStatus = status === 'all' || r.status === status;
    const hay = `${r.org_name} ${r.contact_name} ${r.email} ${r.slots.service_days.locations.name}`.toLowerCase();
    const okQ = !q.trim() || hay.includes(q.trim().toLowerCase());
    return okStatus && okQ;
  });

  const confirm = async (id: string) => {
    const res = await fetch(`/api/admin/bookings/${id}/confirm`, { method: 'POST' });
    const j = await res.json().catch(()=>({}));
    if (!res.ok) return toast({ title: 'Confirm failed', description: j.error || 'Try again', variant: 'destructive' });
    toast({ title: 'Booking confirmed' });
    load();
  };

  const cancel = async (id: string) => {
    const res = await fetch(`/api/admin/bookings/${id}/cancel`, { method: 'POST' });
    const j = await res.json().catch(()=>({}));
    if (!res.ok) return toast({ title: 'Cancel failed', description: j.error || 'Try again', variant: 'destructive' });
    toast({ title: 'Booking cancelled' });
    load();
  };

  // Reschedule modal state
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<Row | null>(null);
  const [openSlots, setOpenSlots] = React.useState<{ id: string; start_utc: string; end_utc: string }[]>([]);
  const [newSlotId, setNewSlotId] = React.useState('');
  const [loadingSlots, setLoadingSlots] = React.useState(false);

  const openReschedule = async (r: Row) => {
    setActive(r);
    setOpen(true);
    setNewSlotId('');
    setOpenSlots([]);
    setLoadingSlots(true);
    try {
      const sdId = r.slots.service_days.id;
      const res = await fetch(`/api/admin/slots/open?serviceDayId=${sdId}`);
      const j = await res.json();
      setOpenSlots(j.slots ?? []);
    } finally {
      setLoadingSlots(false);
    }
  };

  const submitReschedule = async () => {
    if (!active || !newSlotId) return;
    const res = await fetch(`/api/admin/bookings/${active.id}/reschedule`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ newSlotId }),
    });
    const j = await res.json().catch(()=>({}));
    if (!res.ok) return toast({ title: 'Reschedule failed', description: j.error || 'Try again', variant: 'destructive' });
    toast({ title: 'Booking rescheduled' });
    setOpen(false);
    load();
  };

  const fmt = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Bookings</h2>
        <div className="flex items-center gap-2">
          <Input placeholder="Search org/contact/email/location" value={q} onChange={(e)=>setQ(e.target.value)} className="w-[240px] sm:w-[320px]" />
          <Select value={status} onValueChange={(v:any)=>setStatus(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="EXPIRED">Expired</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={load}><RefreshCcw className="mr-2 h-4 w-4" />Refresh</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All bookings <Badge variant="secondary">{filtered.length}</Badge></CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">No bookings found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>When</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Organisation</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <div className="text-sm">{r.slots.service_days.service_date}</div>
                        <div className="text-xs text-muted-foreground">{fmt(r.slots.start_utc)}–{fmt(r.slots.end_utc)}</div>
                      </TableCell>
                      <TableCell>{r.slots.service_days.locations.name}</TableCell>
                      <TableCell>
                        <div className="font-medium">{r.org_name}</div>
                        <div className="text-xs text-muted-foreground">{r.attendees} attendees</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{r.contact_name}</div>
                        <div className="text-xs text-muted-foreground">{r.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          r.status === 'CONFIRMED' ? 'default' :
                          r.status === 'PENDING' ? 'secondary' :
                          'outline'
                        }>{r.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {r.status === 'PENDING' && (
                          <Button size="sm" onClick={()=>confirm(r.id)}>Confirm</Button>
                        )}
                        {(r.status === 'PENDING' || r.status === 'CONFIRMED') && (
                          <Button size="sm" variant="secondary" onClick={()=>cancel(r.id)}>Cancel</Button>
                        )}
                        <Dialog open={open && active?.id===r.id} onOpenChange={(v)=>{ if(!v){ setOpen(false); setActive(null);} }}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={()=>openReschedule(r)}>Reschedule</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader><DialogTitle>Reschedule booking</DialogTitle></DialogHeader>
                            {loadingSlots ? (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" /> Loading open slots…
                              </div>
                            ) : openSlots.length === 0 ? (
                              <div className="text-sm text-muted-foreground">No open slots on this service day.</div>
                            ) : (
                              <div className="grid gap-2">
                                <Select value={newSlotId} onValueChange={setNewSlotId}>
                                  <SelectTrigger><SelectValue placeholder="Pick a new time" /></SelectTrigger>
                                  <SelectContent>
                                    {openSlots.map(s => (
                                      <SelectItem key={s.id} value={s.id}>
                                        {fmt(s.start_utc)}–{fmt(s.end_utc)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={()=>{ setOpen(false); setActive(null); }}>Cancel</Button>
                                  <Button disabled={!newSlotId} onClick={submitReschedule}>Save</Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
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
