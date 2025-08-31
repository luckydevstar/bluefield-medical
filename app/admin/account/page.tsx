'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Account() {
  const [currentPassword,setCurrent] = useState('');
  const [newPassword,setNew] = useState('');
  const [confirm,setConfirm] = useState('');

  const change = async () => {
    if (newPassword !== confirm) return toast.info('Passwords do not match');
    const r = await fetch('/api/admin/change-password', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ currentPassword, newPassword })
    });
    r.ok ? toast.success('Password updated') : toast.error('Failed');
  };

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">Account</h1>
      <Input type="password" placeholder="Current password" value={currentPassword} onChange={e=>setCurrent(e.target.value)} />
      <Input type="password" placeholder="New password" value={newPassword} onChange={e=>setNew(e.target.value)} />
      <Input type="password" placeholder="Confirm new password" value={confirm} onChange={e=>setConfirm(e.target.value)} />
      <Button onClick={change}>Change password</Button>
    </div>
  );
}
