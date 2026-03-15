'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();

  // Kirmaganlar uchun — loginga qaytaramiz
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.replace('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-10 text-center max-w-lg w-full">
        <h1 className="text-3xl font-bold text-white mb-4">
          IT-Park Admin Paneliga Xush Kelibsiz!
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          Siz muvaffaqiyatli tizimga kirdingiz.
        </p>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
        >
          Chiqish (Logout)
        </button>
      </div>
    </div>
  );
}
