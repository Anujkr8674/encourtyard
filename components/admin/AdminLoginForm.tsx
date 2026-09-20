'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useFeedbackModal } from '@/context/FeedbackModalContext';
import { Shield, Lock, User, ArrowRight, AlertCircle, RefreshCw, KeyRound, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const AdminLoginForm: React.FC = () => {
  const router = useRouter();
  const { adminLogin, admin } = useAuth();

  // Redirect if already logged in as Admin
  useEffect(() => {
    if (admin) {
      router.push('/admin');
    }
  }, [admin, router]);

  const { showSuccess, showError } = useFeedbackModal();
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!adminId.trim() || !password) {
      const msg = 'Please provide both your Admin ID and Password.';
      setError(msg);
      showError({
        variant: 'warning',
        title: 'Credentials Required',
        message: msg,
        primaryBtnText: 'Okay',
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await adminLogin(adminId.trim(), password);

      if (!res.success) {
        const errorMsg = res.error || 'Invalid administrator credentials.';
        setError(errorMsg);
        showError({
          variant: 'session',
          title: 'Authentication Failed',
          message: errorMsg,
          primaryBtnText: 'Try Again',
        });
      } else {
        showSuccess({
          variant: 'account',
          title: 'Welcome Back, Admin!',
          message: 'Admin authorization key verified. Access granted to EnCourtyard command center.',
          primaryBtnText: 'Enter Dashboard',
          onPrimaryClick: () => router.push('/admin'),
          autoCloseMs: 1600,
        });
        setTimeout(() => {
          router.push('/admin');
        }, 1200);
      }
    } catch {
      const fatalMsg = 'An error occurred during admin authentication.';
      setError(fatalMsg);
      showError({
        variant: 'cta',
        title: 'Oops!',
        message: fatalMsg,
        primaryBtnText: 'Try Again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemoCredentials = () => {
    setAdminId('Admin');
    setPassword('Ranchi#0000');
    setError(null);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#141C14]/95 text-white backdrop-blur-2xl border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.6)] rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        {/* Subtle Luxury Green Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#4ADE80]/20 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#2E7D32]/20 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#4ADE80]/15 border border-[#4ADE80]/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#4ADE80] shadow-[0_0_20px_rgba(74,222,128,0.25)]">
            <Shield className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#4ADE80] font-mono text-xs font-semibold uppercase tracking-wider mb-2">
            <span>EnCourtyard Command Center</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white tracking-tight">
            Admin Authentication
          </h1>
          <p className="text-xs sm:text-sm text-[#E3EBE3]/75 mt-2 font-sans">
            Secured management console for 79 coworking centres, revenue analytics, and member operations.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-start gap-3 animate-fadeIn">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          {/* Admin ID */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#E3EBE3] mb-1.5">
              Admin Identifier / Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#4ADE80] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="Admin"
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 focus:border-[#4ADE80] focus:bg-white/15 rounded-xl text-sm text-white placeholder-white/40 outline-none transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#E3EBE3] mb-1.5">
              Master Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#4ADE80] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 focus:border-[#4ADE80] focus:bg-white/15 rounded-xl text-sm text-white placeholder-white/40 outline-none transition-all"
              />
            </div>
          </div>

          {/* Development Quick Fill Hint */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleFillDemoCredentials}
              className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#E3EBE3]/80 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <KeyRound className="w-3.5 h-3.5 text-[#4ADE80]" />
                <span>Quick Fill from .env (Id: <strong>Admin</strong> | Ranchi#0000)</span>
              </div>
              <span className="text-[11px] text-[#4ADE80] group-hover:underline">Auto-Fill</span>
            </button>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl bg-[#4ADE80] hover:bg-[#34D399] text-[#0E170E] font-bold shadow-[0_0_30px_rgba(74,222,128,0.4)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 text-sm"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying Master Key...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>Enter Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-white/15 text-center text-xs text-[#E3EBE3]/70 font-sans">
          <span>Are you a standard member? </span>
          <Link
            href="/login"
            className="font-bold text-[#4ADE80] hover:underline underline-offset-4 transition-colors"
          >
            Switch to Member Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
