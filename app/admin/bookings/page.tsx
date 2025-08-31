'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Row = {
  booking_id:string; name:string; email:string; phone:string; attendees:number;
  booking_status:'pending'|'confirmed'|'cancelled'|'reschedule_requested';
  slot_start:string; slot_end:string; location_name:string; postcode:string
};

export default function AdminBookings() {
  const [rows,setRows] = useState<Row[]>([]);
  const load = async () => {
    const res = await fetch('/api/bookings'); const j = await res.json(); setRows(j.data ?? []);
  };
  useEffect(()=>{ load(); },[]);

  const act = async (id:string, action:'cancel'|'reschedule') => {
    const r = await fetch('/api/bookings', {
      method:'PATCH', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ booking_id: id, action })
    });
    r.ok ? (toast.success('Done'), load()) : toast.error('Failed');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Bookings</h1>
      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">When</th><th className="p-2">Location</th><th className="p-2">Name</th>
              <th className="p-2">Email</th><th className="p-2">Attendees</th><th className="p-2">Status</th><th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r=>{
              const when = `${new Date(r.slot_start).toLocaleString([], { dateStyle:'medium', timeStyle:'short' })}`;
              return (
                <tr key={r.booking_id} className="border-b">
                  <td className="p-2">{when}</td>
                  <td className="p-2">{r.location_name} ({r.postcode})</td>
                  <td className="p-2">{r.name}</td>
                  <td className="p-2">{r.email}</td>
                  <td className="p-2">{r.attendees}</td>
                  <td className="p-2">{r.booking_status}</td>
                  <td className="p-2 flex gap-2">
                    <Button size="sm" variant="secondary" onClick={()=>act(r.booking_id,'reschedule')}>Resched.</Button>
                    <Button size="sm" variant="destructive" onClick={()=>act(r.booking_id,'cancel')}>Cancel</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
