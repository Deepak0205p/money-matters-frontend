'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeRoot() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/home/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-emerald-200 border-t-emerald-700 animate-spin" />
    </div>
  );
}
