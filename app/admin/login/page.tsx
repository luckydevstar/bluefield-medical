'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const router = useRouter();

  const login = async () => {
    const res = await fetch('/api/admin/login', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ email, password })
    });
    if (res.ok) { toast.success('Welcome'); router.push('/admin'); }
    else toast.error('Invalid credentials');
  };

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Admin Login</h1>
        <Input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <Button onClick={login} className="w-full">Sign in</Button>
      </div>
    </main>
  );
}
