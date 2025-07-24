'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export function useAdminMode() {
  const searchParams = useSearchParams();
  
  const isAdmin = useMemo(() => {
    return searchParams.get('role') === 'admin';
  }, [searchParams]);

  return { isAdmin };
}