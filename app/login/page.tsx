import type { Metadata } from 'next';
import { UserLoginForm } from '@/components/user/UserLoginForm';

export const metadata: Metadata = {
  title: 'Member Sign In | EnCourtyard Workspaces',
  description: 'Sign in to access your EnCourtyard workspace bookings, passes, and account.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[#FAF9F5] flex items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#263626 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="w-full max-w-md relative z-10">
        <UserLoginForm />
      </div>
    </div>
  );
}
