'use client';

import { PropsWithChildren } from 'react';
import { useSearchParams } from 'next/navigation';

export default function MaintenanceGate({ children }: PropsWithChildren) {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');
  const isAdmin = role === 'admin';

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50">
        <div className="text-center p-6">
          <h1 className="text-2xl font-semibold">Under maintenance</h1>
          <p className="mt-2 text-gray-600">We’ll be back shortly.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
