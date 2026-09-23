'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useFeedbackModal } from '@/context/FeedbackModalContext';
import { Mail, Lock, ArrowRight, Shield, AlertCircle, RefreshCw, KeyRound, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const UserLoginForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || searchParams.get('callbackUrl') || '/dashboard';
  const { login, user } = useAuth();
  const { showSuccess, showError } = useFeedbackModal();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push(redirectUrl);
    }
  }, [user, router, redirectUrl]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      const msg = 'Please provide both your email and password.';
      setError(msg);
      showError({
        variant: 'warning',
        title: 'Missing Details',
        message: msg,
        primaryBtnText: 'Okay',
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await login(email.trim().toLowerCase(), password);

      if (!res.success) {
        if (res.requiresVerification) {
          const verifyMsg = 'Your email is not verified yet. Please sign up or verify using the OTP modal.';
          setError(verifyMsg);
          showError({
            variant: 'warning',
            title: 'Verification Needed',
            message: verifyMsg,
            primaryBtnText: 'Verify Email',
            secondaryBtnText: 'Close',
            onPrimaryClick: () => router.push('/signup'),
          });
        } else {
          const failMsg = res.error || 'Failed to sign in. Please verify your email and password.';
          setError(failMsg);
          showError({
            variant: 'session',
            title: 'Sign In Failed',
            message: failMsg,
            primaryBtnText: 'Try Again',
          });
        }
      } else {
        showSuccess({
          variant: 'account',
          title: 'Welcome Back!',
          message: redirectUrl.startsWith('/book')
            ? 'Signed in successfully. Proceeding to your workspace booking...'
            : 'You have signed in successfully. Opening your member dashboard...',
          primaryBtnText: redirectUrl.startsWith('/book') ? 'Continue Booking' : 'Go to Dashboard',
          onPrimaryClick: () => router.push(redirectUrl),
          autoCloseMs: 1500,
        });
        setTimeout(() => {
          router.push(redirectUrl);
        }, 1200);
      }
    } catch {
      const exMsg = 'An unexpected error occurred. Please try again.';
      setError(exMsg);
      showError({
        variant: 'cta',
        title: 'Oops!',
        message: exMsg,
        primaryBtnText: 'Try Again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/90 backdrop-blur-xl border border-[#E5E1D8] shadow-2xl rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#4ADE80]/15 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#263626]/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E3EBE3] text-[#263626] font-mono text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>Member Workspace Portal</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#181F18] tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-[#5C665C] mt-2 font-sans">
            Sign in to manage your private suites, meeting room passes, and botanic perks.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 animate-fadeIn">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4.5 font-sans">
          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#263626] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#6A806A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#E5E1D8] focus:border-[#263626] focus:bg-white rounded-xl text-sm text-[#181F18] outline-none transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#263626]">
                Password
              </label>
              <Link
                href="/about#visit-form"
                className="text-xs text-[#6A806A] hover:text-[#263626] transition-colors"
              >
                Need Help?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#6A806A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#E5E1D8] focus:border-[#263626] focus:bg-white rounded-xl text-sm text-[#181F18] outline-none transition-all"
              />
            </div>
          </div>

          {/* Persistent Session Checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2.5 text-xs text-[#5C665C] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[#E5E1D8] text-[#263626] focus:ring-[#263626]"
              />
              <span>Keep me signed in on this browser (30 days)</span>
            </label>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-bold shadow-xl py-3.5"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </div>
        </form>

        {/* Links to Signup & Admin Login */}
        <div className="mt-8 pt-6 border-t border-[#E5E1D8] space-y-3 text-center text-sm font-sans">
          <div className="text-[#5C665C]">
            <span>Don't have an account yet? </span>
            <Link
              href={`/signup${redirectUrl !== '/dashboard' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
              className="font-bold text-[#263626] hover:text-[#2E7D32] underline underline-offset-4 transition-colors"
            >
              Create Account
            </Link>
          </div>

          <div className="pt-2">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FAF9F5] hover:bg-[#E3EBE3] border border-[#E5E1D8] text-xs font-semibold text-[#263626] transition-all group"
            >
              <Shield className="w-3.5 h-3.5 text-[#2E7D32] group-hover:scale-110 transition-transform" />
              <span>Switch to Administrator Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
