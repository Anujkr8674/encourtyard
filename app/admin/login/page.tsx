import type { Metadata } from 'next';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';

export const metadata: Metadata = {
  title: 'Administrator Access | EnCourtyard Command Center',
  description: 'Authorized personnel portal for EnCourtyard coworking management.',
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[#0E150F] flex items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#4ADE80 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="w-full max-w-md relative z-10">
        <AdminLoginForm />
      </div>
    </div>
  );
}
