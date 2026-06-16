'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage.getItem('isAdmin') === 'true') {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return null;
}


