import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { UserSignupForm } from '@/components/user/UserSignupForm';

export const metadata: Metadata = {
  title: 'Create Account | EnCourtyard Workspaces',
  description: 'Join the EnCourtyard botanical coworking community. Register and verify with email OTP.',
};

export default function SignupPage() {
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
      <div className="w-full max-w-xl relative z-10">
        <Suspense fallback={<div className="text-center py-10 text-sm text-[#5C665C]">Loading Registration...</div>}>
          <UserSignupForm />
        </Suspense>
      </div>
    </div>
  );
}
