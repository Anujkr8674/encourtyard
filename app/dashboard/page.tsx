'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/user/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center text-[#181F18]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-[#2E7D32] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono tracking-widest uppercase text-[#5C665C]">
          Redirecting to Member Portal...
        </span>
      </div>
    </div>
  );
}
