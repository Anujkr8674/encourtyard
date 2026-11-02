'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useFeedbackModal } from '@/context/FeedbackModalContext';

export const ForgotPasswordForm: React.FC = () => {
  const router = useRouter();
  const { showSuccess, showError } = useFeedbackModal();

  // Steps: 'email' (Step 1) -> 'otp' (Step 2) -> 'new_password' (Step 3) -> 'success' (Step 4)
  const [step, setStep] = useState<'email' | 'otp' | 'new_password' | 'success'>('email');

  const [email, setEmail] = useState('');
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resend Countdown Timer (60 seconds)
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown handler
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && countdown > 0) {
      setCanResend(false);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Focus first OTP input when entering OTP step
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    }
  }, [step]);

  // Handle OTP box input changes
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newValues = [...otpValues];
    newValues[index] = value.slice(-1);
    setOtpValues(newValues);
    setError(null);

    // Auto-advance to next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, 6).split('');
    const newValues = [...otpValues];
    digits.forEach((digit, i) => {
      if (i < 6) newValues[i] = digit;
    });
    setOtpValues(newValues);

    const nextIndex = Math.min(digits.length, 5);
    otpInputRefs.current[nextIndex]?.focus();
  };

  // STEP 1: Submit Email to receive OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Please provide your registered email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/user/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to send verification code.');
      }

      showSuccess({
        variant: 'minimal',
        title: 'Code Sent',
        message: `A 6-digit verification code has been dispatched to ${cleanEmail}.`,
        primaryBtnText: 'Continue',
        autoCloseMs: 2000,
      });

      setStep('otp');
      setCountdown(60);
      setCanResend(false);
      setOtpValues(['', '', '', '', '', '']);
    } catch (err: any) {
      const msg = err?.message || 'Failed to dispatch verification code. Please check your email.';
      setError(msg);
      showError({
        variant: 'warning',
        title: 'Email Lookup Failed',
        message: msg,
        primaryBtnText: 'Try Again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Resend OTP
  const handleResendOtp = async () => {
    if (!canResend || isLoading) return;
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/user/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to resend verification code.');
      }

      showSuccess({
        variant: 'minimal',
        title: 'New Code Sent',
        message: 'A fresh 6-digit OTP code has been delivered to your inbox.',
        primaryBtnText: 'Okay',
        autoCloseMs: 2000,
      });

      setCountdown(60);
      setCanResend(false);
      setOtpValues(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err?.message || 'Failed to resend code.');
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const otpCode = otpValues.join('');
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits of your verification code.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/user/forgot-password/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otpCode,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid or expired verification code.');
      }

      showSuccess({
        variant: 'minimal',
        title: 'Code Verified',
        message: 'Verification code confirmed. Now choose your new password.',
        primaryBtnText: 'Proceed',
        autoCloseMs: 1500,
      });

      setStep('new_password');
    } catch (err: any) {
      const msg = err?.message || 'Failed to verify OTP code.';
      setError(msg);
      showError({
        variant: 'warning',
        title: 'Verification Failed',
        message: msg,
        primaryBtnText: 'Try Again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please ensure both fields are identical.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/user/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otpValues.join(''),
          newPassword,
          confirmPassword,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to reset password.');
      }

      setStep('success');
      showSuccess({
        variant: 'account',
        title: 'Password Updated!',
        message: 'Your account password has been successfully reset. You may now sign in with your new password.',
        primaryBtnText: 'Sign In',
        onPrimaryClick: () => router.push('/login'),
      });
    } catch (err: any) {
      const msg = err?.message || 'Failed to update password.';
      setError(msg);
      showError({
        variant: 'warning',
        title: 'Reset Failed',
        message: msg,
        primaryBtnText: 'Try Again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto font-sans">
      <div className="bg-white/95 backdrop-blur-xl border border-[#E5E1D8] shadow-2xl rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        {/* Decorative Ambience */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#4ADE80]/15 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#263626]/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Global Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 animate-fadeIn">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 1: ENTER REGISTERED EMAIL                               */}
        {/* ============================================================ */}
        {step === 'email' && (
          <div>
            <div className="text-center mb-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E3EBE3] text-[#263626] font-mono text-xs font-semibold uppercase tracking-wider mb-3">
                <KeyRound className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>Password Recovery</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18] tracking-tight">
                Forgot Password?
              </h1>
              <p className="text-xs sm:text-sm text-[#5C665C] mt-2 leading-relaxed">
                Enter your registered email address and we'll send you a 6-digit OTP code to verify and reset your password.
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#263626] mb-1.5">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#6A806A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#E5E1D8] focus:border-[#2E7D32] focus:bg-white rounded-xl text-sm text-[#181F18] outline-none transition-all"
                  />
                </div>
              </div>

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
                      Checking Email & Sending OTP...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>Send Verification Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>

              <div className="pt-4 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C665C] hover:text-[#2E7D32] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Member Sign In</span>
                </Link>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 2: ENTER 6-DIGIT OTP                                    */}
        {/* ============================================================ */}
        {step === 'otp' && (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E3EBE3] text-[#263626] font-mono text-xs font-semibold uppercase tracking-wider mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>Step 2 of 3 • Verification</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18] tracking-tight">
                Enter Verification Code
              </h1>
              <p className="text-xs sm:text-sm text-[#5C665C] mt-2">
                We sent a 6-digit code to{' '}
                <strong className="text-[#181F18] font-mono">{email}</strong>
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              {/* 6 Digit Input Boxes */}
              <div>
                <label className="block text-center text-xs font-bold uppercase tracking-wider text-[#263626] mb-3">
                  6-Digit OTP Code
                </label>
                <div className="flex items-center justify-center gap-2 sm:gap-2.5" onPaste={handleOtpPaste}>
                  {otpValues.map((val, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={val}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-11 h-13 sm:w-12 sm:h-14 text-center font-mono text-xl sm:text-2xl font-bold rounded-xl bg-[#FAF9F5] border-2 border-[#E5E1D8] focus:border-[#2E7D32] focus:bg-white text-[#181F18] outline-none transition-all shadow-xs"
                    />
                  ))}
                </div>
              </div>

              {/* Resend Timer / Button */}
              <div className="flex items-center justify-between text-xs pt-1 px-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setError(null);
                  }}
                  className="text-[#5C665C] hover:text-[#2E7D32] transition-colors cursor-pointer"
                >
                  Change email
                </button>

                <div>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isLoading}
                      className="font-bold text-[#2E7D32] hover:underline cursor-pointer"
                    >
                      Resend Code
                    </button>
                  ) : (
                    <span className="text-[#7A8A7A] font-mono">
                      Resend in <strong className="text-[#181F18]">{countdown}s</strong>
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full font-bold shadow-xl py-3.5"
                  disabled={isLoading || otpValues.join('').length !== 6}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Verifying Code...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>Verify Code & Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 3: SET NEW PASSWORD & CONFIRM                           */}
        {/* ============================================================ */}
        {step === 'new_password' && (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E3EBE3] text-[#263626] font-mono text-xs font-semibold uppercase tracking-wider mb-3">
                <Lock className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>Step 3 of 3 • Security</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18] tracking-tight">
                Set New Password
              </h1>
              <p className="text-xs sm:text-sm text-[#5C665C] mt-2">
                Create a fresh, secure password for your EnCourtyard account.
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#263626] mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#6A806A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    autoFocus
                    className="w-full pl-10 pr-11 py-3 bg-[#FAF9F5] border border-[#E5E1D8] focus:border-[#2E7D32] focus:bg-white rounded-xl text-sm text-[#181F18] outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A8A7A] hover:text-[#181F18] transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#263626] mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#6A806A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    className="w-full pl-10 pr-11 py-3 bg-[#FAF9F5] border border-[#E5E1D8] focus:border-[#2E7D32] focus:bg-white rounded-xl text-sm text-[#181F18] outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A8A7A] hover:text-[#181F18] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-[11px] text-red-600 mt-1.5 flex items-center gap-1 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Passwords do not match yet</span>
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full font-bold shadow-xl py-3.5"
                  disabled={isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Updating Password...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>Update Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 4: SUCCESS CONFIRMATION                                 */}
        {/* ============================================================ */}
        {step === 'success' && (
          <div className="text-center py-4 space-y-5 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#2E7D32] mx-auto flex items-center justify-center ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18]">
                Password Reset Complete!
              </h2>
              <p className="text-xs sm:text-sm text-[#5C665C] max-w-sm mx-auto leading-relaxed">
                Your account password has been successfully updated. You can now sign in with your new password.
              </p>
            </div>

            <div className="pt-4">
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={() => router.push('/login')}
                className="w-full font-bold shadow-xl py-3.5"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>Sign In Now</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
