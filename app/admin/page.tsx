'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (isLoggedIn) {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return null; // Faqat yo'naltiradi, hech narsa ko'rsatmaydi
}
