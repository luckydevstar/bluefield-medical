'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

const MIN_LEN = 10; // adjust to your policy

export default function ChangePasswordPage() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const passwordsMatch = confirmPassword.length === 0 || newPassword === confirmPassword;

  // simple strength estimate
  const strength = React.useMemo(() => {
    let s = 0;
    if (newPassword.length >= MIN_LEN) s += 25;
    if (/[A-Z]/.test(newPassword)) s += 20;
    if (/[a-z]/.test(newPassword)) s += 20;
    if (/\d/.test(newPassword)) s += 20;
    if (/[^A-Za-z0-9]/.test(newPassword)) s += 15;
    return Math.min(s, 100);
  }, [newPassword]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!newPassword || !currentPassword) return;

    if (newPassword !== confirmPassword) {
      toast.info('Passwords do not match');
      return;
    }
    if (newPassword.length < MIN_LEN) {
      toast.info(`Password must be at least ${MIN_LEN} characters`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/account/password', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const j = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        throw new Error(j.error || 'Failed to change password');
      }

      if (res.ok) {
        toast.info('Password updated. Please sign in again if prompted.');
        router.push("/admin/login");
      }
      
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      // If your API destroys session, kick back to login:
      // router.replace('/admin/(auth)/login');
    } catch (err: any) {
      toast('Change failed. Try again');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg h-screen flex items-center">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Change password
          </CardTitle>
          <CardDescription>
            Use a strong passphrase. Minimum length: {MIN_LEN} characters.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={submit} className="space-y-5">
            {/* Current */}
            <div className="grid gap-2">
              <Label htmlFor="current">Current password</Label>
              <div className="relative">
                <Input
                  id="current"
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showCurrent ? 'Hide password' : 'Show password'}
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* New */}
            <div className="grid gap-2">
              <Label htmlFor="new">New password</Label>
              <div className="relative">
                <Input
                  id="new"
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  minLength={MIN_LEN}
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showNew ? 'Hide password' : 'Show password'}
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="space-y-1">
                <Progress value={strength} />
                <p className="text-xs text-muted-foreground">
                  Include upper & lower case letters, numbers, and symbols for stronger security.
                </p>
              </div>
            </div>

            {/* Confirm */}
            <div className="grid gap-2">
              <Label htmlFor="confirm">Confirm new password</Label>
              <div className="relative">
                <Input
                  id="confirm"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {!passwordsMatch && (
                <p className="text-xs text-red-600">Passwords do not match.</p>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={submitting || !passwordsMatch}>
                {submitting ? 'Updating…' : 'Update password'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
