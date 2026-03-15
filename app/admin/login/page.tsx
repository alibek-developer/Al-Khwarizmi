'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Eski /admin/login URL'ini /login ga yo'naltiradi
export default function AdminLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return null;
}
