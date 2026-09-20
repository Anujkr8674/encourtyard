'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Building, 
  ArrowRight, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  ArrowLeft,
  KeyRound
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const UserSignupForm: React.FC = () => {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Step Wizard State (1: Info -> 2: OTP -> 3: Password)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // OTP State
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentStep === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [currentStep, resendTimer]);

  // --- STEP 1: SUBMIT BASIC INFO & TRIGGER REAL EMAIL OTP ---
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!name.trim() || !email.trim()) {
      setError('Please provide your Full Name and Email Address.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/user/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || undefined,
          company: company.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to dispatch verification code.');
      } else {
        setSuccessMessage(`A 6-digit verification code has been dispatched to ${email}`);
        setCurrentStep(2);
        setResendTimer(60);
        setCanResend(false);
        setOtpDigits(['', '', '', '', '', '']);
      }
    } catch {
      setError('Network connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- STEP 2: VERIFY 6-DIGIT OTP ---
  const handleOtpDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      setOtpDigits(pasted.split(''));
      otpInputRefs.current[5]?.focus();
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    const fullOtp = otpDigits.join('');

    if (fullOtp.length !== 6) {
      setError('Please enter all 6 digits of your verification code.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/user/verify-step-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: fullOtp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid or expired code.');
      } else {
        setSuccessMessage('Email verified! Now set your secure account password.');
        setCurrentStep(3);
      }
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setCanResend(false);
    setResendTimer(60);
    setError(null);

    try {
      const res = await fetch('/api/auth/user/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMessage('A fresh 6-digit code has been dispatched to your email!');
      } else {
        setError(data.error || 'Failed to resend code.');
      }
    } catch {
      setError('Failed to resend code.');
    }
  };

  // --- STEP 3: CREATE PASSWORD & COMPLETE REGISTRATION ---
  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password) {
      setError('Please enter a secure password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/user/complete-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || undefined,
          company: company.trim() || undefined,
          otp: otpDigits.join(''),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to finalize account.');
      } else {
        await refreshUser();
        router.push('/dashboard');
      }
    } catch {
      setError('An error occurred while creating your account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-white/95 backdrop-blur-2xl border border-[#E5E1D8] shadow-2xl rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        {/* Subtle Decorative Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#4ADE80]/15 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#263626]/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* STEP PROGRESS WIZARD INDICATOR */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {[
              { num: 1, label: 'Details' },
              { num: 2, label: 'Email OTP' },
              { num: 3, label: 'Set Password' },
            ].map((step, idx) => (
              <React.Fragment key={step.num}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                      currentStep === step.num
                        ? 'bg-[#2E7D32] text-white ring-4 ring-[#4ADE80]/30 shadow-md'
                        : currentStep > step.num
                        ? 'bg-[#E3EBE3] text-[#2E7D32] border border-[#2E7D32]/40'
                        : 'bg-[#FAF9F5] text-[#8C998C] border border-[#E5E1D8]'
                    }`}
                  >
                    {currentStep > step.num ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                  </div>
                  <span
                    className={`text-xs hidden sm:inline font-semibold ${
                      currentStep >= step.num ? 'text-[#181F18]' : 'text-[#8C998C]'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {idx < 2 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 sm:mx-3 transition-all ${
                      currentStep > idx + 1 ? 'bg-[#2E7D32]' : 'bg-[#E5E1D8]'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* HEADER TITLE */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E3EBE3] text-[#263626] font-mono text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>EnCourtyard Membership</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18] tracking-tight">
            {currentStep === 1 && 'Create Your Member Account'}
            {currentStep === 2 && 'Verify Email Verification Code'}
            {currentStep === 3 && 'Configure Your Account Password'}
          </h1>
          <p className="text-xs sm:text-sm text-[#5C665C] mt-1.5 font-sans">
            {currentStep === 1 && 'Enter your contact details to receive a 6-digit verification code.'}
            {currentStep === 2 && `Enter the 6-digit code dispatched to ${email}`}
            {currentStep === 3 && 'Choose a secure password to finalize your workspace access.'}
          </p>
        </div>

        {/* FEEDBACK ALERTS */}
        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && !error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1 FORM: PERSONAL & CONTACT INFORMATION */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4 font-sans animate-fadeIn">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#263626] mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#6A806A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Henderson"
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#E5E1D8] focus:border-[#263626] focus:bg-white rounded-xl text-sm text-[#181F18] outline-none transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#263626] mb-1.5">
                Email Address <span className="text-red-500">*</span>
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
              <p className="text-[11px] text-[#6A806A] mt-1">
                A 6-digit OTP code will be sent to this email via Google SMTP.
              </p>
            </div>

            {/* Phone & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#263626] mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#6A806A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#E5E1D8] focus:border-[#263626] focus:bg-white rounded-xl text-sm text-[#181F18] outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#263626] mb-1.5">
                  Company / Team
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-[#6A806A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Acme Studio"
                    className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#E5E1D8] focus:border-[#263626] focus:bg-white rounded-xl text-sm text-[#181F18] outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3">
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
                    Sending Verification Code...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* STEP 2 FORM: 6-DIGIT EMAIL OTP VERIFICATION */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-6 font-sans animate-fadeIn">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#E3EBE3] rounded-2xl flex items-center justify-center mx-auto mb-3 text-[#2E7D32]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <p className="text-xs text-[#5C665C]">
                Verification code dispatched to <strong className="text-[#181F18]">{email}</strong>
              </p>
            </div>

            {/* 6 Digit Input Boxes */}
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { otpInputRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  onPaste={idx === 0 ? handleOtpPaste : undefined}
                  className="w-11 h-13 sm:w-12 sm:h-14 text-center font-mono text-xl sm:text-2xl font-bold bg-[#FAF9F5] border-2 border-[#E5E1D8] focus:border-[#263626] focus:bg-white rounded-xl text-[#181F18] outline-none transition-all shadow-sm"
                />
              ))}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-bold shadow-xl py-3"
              disabled={isLoading || otpDigits.some((d) => !d)}
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

            <div className="flex items-center justify-between text-xs text-[#5C665C] pt-1">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-1 hover:text-[#181F18] underline underline-offset-2 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Edit Email</span>
              </button>

              <div>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="font-bold text-[#2E7D32] hover:text-[#1A261A] underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    Resend Code
                  </button>
                ) : (
                  <span className="text-[#8C998C]">
                    Resend in <strong className="font-mono text-[#181F18]">{resendTimer}s</strong>
                  </span>
                )}
              </div>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* STEP 3 FORM: SET PASSWORD & FINALIZE ACCOUNT */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <form onSubmit={handleStep3Submit} className="space-y-4.5 font-sans animate-fadeIn">
            <div className="p-3.5 rounded-2xl bg-[#F1F5F1] border border-[#D3DFD3] flex items-center gap-3 text-xs text-[#263626]">
              <CheckCircle2 className="w-5 h-5 text-[#2E7D32] shrink-0" />
              <div>
                <span className="font-bold block">Email Verified: {email}</span>
                <span className="text-[#5C665C]">Now set a secure password for your workspace account.</span>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#263626] mb-1.5">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6A806A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#E5E1D8] focus:border-[#263626] focus:bg-white rounded-xl text-sm text-[#181F18] outline-none transition-all"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#263626] mb-1.5">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6A806A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#E5E1D8] focus:border-[#263626] focus:bg-white rounded-xl text-sm text-[#181F18] outline-none transition-all"
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
                    Creating Account & Setting Session...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <KeyRound className="w-4 h-4" />
                    <span>Complete Registration & Access Dashboard</span>
                  </span>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* SIGN IN FOOTER */}
        <div className="mt-8 pt-6 border-t border-[#E5E1D8] text-center text-sm text-[#5C665C] font-sans">
          <span>Already have an EnCourtyard account? </span>
          <Link
            href="/login"
            className="font-bold text-[#263626] hover:text-[#2E7D32] underline underline-offset-4 transition-colors"
          >
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
