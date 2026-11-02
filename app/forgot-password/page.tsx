import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/user/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot Password | EnCourtyard Workspaces',
  description: 'Reset your EnCourtyard member account password securely with email OTP verification.',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-white flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#263626 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="w-full max-w-md relative z-10">
        <Suspense fallback={<div className="text-center py-10 text-sm text-[#5C665C]">Loading Recovery Form...</div>}>
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
