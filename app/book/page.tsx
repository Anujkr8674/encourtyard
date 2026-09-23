'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  Calendar,
  Clock,
  ShieldCheck,
  Copy,
  Check,
  MapPin,
  Layers,
  Wifi,
  Volume2,
  Lock,
  ArrowLeft,
  AlertCircle,
  LogIn,
  UserPlus,
  X
} from 'lucide-react';
import { MaterialDatePicker } from '@/components/ui/MaterialDatePicker';
import { MaterialTimePicker } from '@/components/ui/MaterialTimePicker';
import { FeedbackModal } from '@/components/ui/FeedbackModal';

interface WorkspaceData {
  id: string;
  title: string;
  slug: string;
  categoryId?: string;
  categoryName?: string;
  shortDescription?: string;
  longDescription?: string;
  price?: string | null;
  capacity?: string | null;
  location?: string | null;
  badge?: string | null;
  mediaUrls?: { url: string; type: string; name: string }[];
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
}

function BookPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const workspaceParam = searchParams.get('workspace') || '';
  const planParam = (searchParams.get('plan') as 'monthly' | 'daily' | 'hourly') || 'monthly';
  const startDateParam = searchParams.get('startDate') || searchParams.get('date') || '';
  const endDateParam = searchParams.get('endDate') || '';
  const startTimeParam = searchParams.get('startTime') || '09:00 AM';
  const endTimeParam = searchParams.get('endTime') || '06:00 PM';
  const guestsParam = parseInt(searchParams.get('guests') || '1', 10);

  // Today's Date String (YYYY-MM-DD)
  const todayDate = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  // Form State
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rentalPlan, setRentalPlan] = useState<'monthly' | 'daily' | 'hourly'>(planParam);
  const [startDate, setStartDate] = useState(startDateParam || todayDate);
  const [endDate, setEndDate] = useState(endDateParam || startDateParam || todayDate);
  const [startTime, setStartTime] = useState(startTimeParam);
  const [endTime, setEndTime] = useState(endTimeParam);
  const [guestCount, setGuestCount] = useState(isNaN(guestsParam) ? 1 : guestsParam);
  const [specialRequests, setSpecialRequests] = useState('');

  // Workspace & Auth State
  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modals & Feedback State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [feedback, setFeedback] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
    subMessage?: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // 1. Fetch User Auth State
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/user/me', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setIsAuthenticated(true);
            setCurrentUser(data.user);
            setFullName((prev) => prev || data.user.name || '');
            setEmail((prev) => prev || data.user.email || '');
            setPhone((prev) => prev || data.user.phone || '');
            setCompanyName((prev) => prev || data.user.company || '');
          } else {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.warn('Auth check error:', err);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // 2. Fetch Workspace Details
  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        setLoading(true);
        if (workspaceParam) {
          const res = await fetch(`/api/workspaces/${workspaceParam}`, { cache: 'no-store' });
          if (res.ok) {
            const data = await res.json();
            if (data && data.success && data.workspace) {
              setWorkspace(data.workspace);
            }
          }
        }

        // Fallback to fetching all workspaces if specific one not loaded
        if (!workspace) {
          const allRes = await fetch('/api/workspaces', { cache: 'no-store' });
          if (allRes.ok) {
            const allData = await allRes.json();
            if (allData.success && Array.isArray(allData.workspaces) && allData.workspaces.length > 0) {
              const matched = allData.workspaces.find(
                (w: WorkspaceData) => w.id === workspaceParam || w.slug === workspaceParam
              );
              setWorkspace(matched || allData.workspaces[0]);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching workspace for booking:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspace();
  }, [workspaceParam]);

  // Adjust end date based on rental plan
  useEffect(() => {
    if (!endDateParam) {
      const start = new Date(startDate || todayDate);
      const days = rentalPlan === 'monthly' ? 30 : rentalPlan === 'daily' ? 1 : 0;
      start.setDate(start.getDate() + days);
      const y = start.getFullYear();
      const m = String(start.getMonth() + 1).padStart(2, '0');
      const d = String(start.getDate()).padStart(2, '0');
      setEndDate(`${y}-${m}-${d}`);
    }
  }, [rentalPlan, startDate, endDateParam, todayDate]);

  // Handle Form Submission
  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    // Require user login before booking
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setFeedback({
        isOpen: true,
        type: 'error',
        title: 'Missing Required Details',
        message: 'Please fill in your full name, email address, and phone number before proceeding.',
      });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        workspaceId: workspace?.id,
        workspaceTitle: workspace?.title || 'EnCourtyard Premium Workspace',
        workspaceSlug: workspace?.slug,
        workspaceImage: workspace?.mediaUrls?.[0]?.url,
        categoryName: workspace?.categoryName || 'Sanctuary Workspace',
        locationName: workspace?.location || 'Maruthi Plaza, Khairtabad, Hyderabad',
        fullName: fullName.trim(),
        companyName: companyName ? companyName.trim() : null,
        email: email.trim(),
        phone: phone.trim(),
        plan: rentalPlan,
        startDate,
        endDate,
        startTime,
        endTime,
        guests: guestCount,
        totalAmount: workspace?.price || 'Custom Quote',
        specialRequests: specialRequests.trim() || undefined,
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setConfirmedBookingId(data.booking?.id || 'BK-SUCCESS');
        setFeedback({
          isOpen: true,
          type: 'success',
          title: 'Reservation Confirmed!',
          message: `Your booking request (${data.booking?.id}) for "${workspace?.title || 'Workspace'}" has been placed successfully.`,
          subMessage: 'A confirmation receipt has been emailed to you and the sanctuary concierge team.',
        });
      } else {
        setFeedback({
          isOpen: true,
          type: 'error',
          title: 'Booking Submission Error',
          message: data.error || 'Failed to submit reservation. Please check your details and try again.',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      setFeedback({
        isOpen: true,
        type: 'error',
        title: 'Connection Error',
        message: msg,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (confirmedBookingId) {
      navigator.clipboard.writeText(confirmedBookingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const currentWorkspaceImage =
    workspace?.mediaUrls?.[0]?.url ||
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="bg-[#FAF9F5] min-h-screen text-[#181F18] font-sans pb-24">
      
      {/* 1. Header Banner */}
      <section className="bg-[#181F18] text-white pt-28 pb-14 sm:pt-32 sm:pb-16 border-b border-[#263626] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#3A4D3A_1px,transparent_1px)] [background-size:28px_28px] opacity-25 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#4ADE80]">
                <Building2 className="w-3.5 h-3.5" />
                <span>Workspace Reservation Portal</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Complete Your Workspace Reservation
              </h1>
              <p className="text-xs sm:text-sm text-[#C5D5C5] leading-relaxed max-w-2xl">
                Review your sanctuary schedule, configure attendee allocation, and finalize your onboarding credentials.
              </p>
            </div>

            <Link
              href={workspace?.id ? `/book-space/${workspace.id}` : '/book-space'}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold self-start sm:self-center transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[#4ADE80]" />
              <span>Back to Workspace Details</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Main 2-Column Split Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: STICKY WORKSPACE PROPERTY PREVIEW & PRICE SUMMARY            */}
          {/* ========================================================================= */}
          <div
            style={{
              position: 'sticky',
              top: '96px',
              alignSelf: 'flex-start',
              zIndex: 10,
            }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Property Image & Details Card */}
            <div className="bg-white border border-[#E5E1D8] rounded-3xl overflow-hidden shadow-sm space-y-5 p-5 sm:p-6 text-[#181F18]">
              
              {/* Workspace Hero Image */}
              <div className="relative h-56 sm:h-64 w-full rounded-2xl overflow-hidden bg-[#FAF9F5] border border-[#E5E1D8]">
                <img
                  src={currentWorkspaceImage}
                  alt={workspace?.title || 'Selected Workspace'}
                  className="w-full h-full object-cover"
                />
                {workspace?.badge && (
                  <span className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-[#E65100] text-white text-[11px] font-mono font-bold shadow-md">
                    {workspace.badge}
                  </span>
                )}
                {workspace?.categoryName && (
                  <span className="absolute bottom-3.5 left-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md text-[#181F18] text-[11px] font-bold shadow-sm">
                    <Layers className="w-3.5 h-3.5 text-[#2E7D32]" />
                    <span>{workspace.categoryName}</span>
                  </span>
                )}
              </div>

              {/* Title & Location */}
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#181F18] leading-tight">
                  {workspace?.title || 'EnCourtyard Workspace Sanctuary'}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-[#5C665C] mt-2">
                  <MapPin className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                  <span>{workspace?.location || 'Maruthi Plaza, Khairtabad, Hyderabad - 500004'}</span>
                </div>
              </div>

              {/* Key Specs Highlights */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#E5E1D8] text-xs">
                <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] space-y-0.5">
                  <span className="text-[10px] uppercase font-mono text-[#5C665C] block">Capacity</span>
                  <strong className="text-[#181F18]">{workspace?.capacity || `${guestCount} Pax Allocated`}</strong>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] space-y-0.5">
                  <span className="text-[10px] uppercase font-mono text-[#5C665C] block">Connectivity</span>
                  <strong className="text-[#181F18]">1 Gbps Dedicated Fiber</strong>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] space-y-0.5">
                  <span className="text-[10px] uppercase font-mono text-[#5C665C] block">Acoustics</span>
                  <strong className="text-[#181F18]">STC 65 Soundproof</strong>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] space-y-0.5">
                  <span className="text-[10px] uppercase font-mono text-[#5C665C] block">Access</span>
                  <strong className="text-[#181F18]">24/7 Biometric Keyless</strong>
                </div>
              </div>

              {/* Price Breakdown Preview */}
              <div className="bg-[#FAF9F5] border border-[#E5E1D8] rounded-2xl p-4 space-y-2.5 text-xs text-[#5C665C]">
                <div className="flex justify-between">
                  <span>Base Workspace Rate:</span>
                  <span className="font-semibold text-[#181F18]">{workspace?.price || 'Custom Quote'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Selected Rental Plan:</span>
                  <span className="font-semibold text-[#181F18] capitalize">{rentalPlan}</span>
                </div>
                <div className="flex justify-between">
                  <span>Attendees / Seats:</span>
                  <span className="font-semibold text-[#181F18]">{guestCount} Member{guestCount > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span>Botanical Concierge Service:</span>
                  <span className="text-[#2E7D32] font-semibold">Included Free</span>
                </div>
                <div className="pt-2.5 border-t border-[#E5E1D8] flex justify-between font-bold text-sm text-[#181F18]">
                  <span>Total Estimated:</span>
                  <span className="text-base text-[#2E7D32] font-serif">{workspace?.price || 'Flexible Plan'}</span>
                </div>
              </div>

              {/* Trust & Guarantee Badges */}
              <div className="flex items-center justify-between text-[11px] text-[#5C665C] pt-1">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                  <span>GST & MCA Verified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#E65100]" />
                  <span>Instant Confirmation</span>
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: SCROLLABLE RESERVATION APPLICATION FORM                     */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#E5E1D8] rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 text-left">
              
              <div className="border-b border-[#E5E1D8] pb-5">
                <h3 className="font-serif text-2xl font-bold text-[#181F18]">
                  Reservation & Contact Details
                </h3>
                <p className="text-xs sm:text-sm text-[#5C665C] mt-1">
                  Please provide your contact info and schedule to generate your booking pass.
                </p>
              </div>

              <form onSubmit={handleConfirmBooking} className="space-y-6">
                
                {/* 1. Contact Info Section */}
                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-wider font-mono font-bold text-[#2E7D32]">
                    1. Guest & Organization Details
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#181F18]">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g., Elena Rostova"
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] text-xs sm:text-sm text-[#181F18] placeholder-[#9EA89E] focus:outline-none focus:border-[#2E7D32] focus:bg-white transition-all"
                      />
                    </div>

                    {/* Company Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#181F18]">
                        Company Name <span className="text-xs text-[#5C665C] font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g., Vanguard BioTech Inc."
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] text-xs sm:text-sm text-[#181F18] placeholder-[#9EA89E] focus:outline-none focus:border-[#2E7D32] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#181F18]">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g., elena@vanguard.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] text-xs sm:text-sm text-[#181F18] placeholder-[#9EA89E] focus:outline-none focus:border-[#2E7D32] focus:bg-white transition-all"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#181F18]">
                        Genuine Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g., +91 99082 09993"
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] text-xs sm:text-sm text-[#181F18] placeholder-[#9EA89E] focus:outline-none focus:border-[#2E7D32] focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Workspace & Schedule Configuration */}
                <div className="space-y-4 pt-4 border-t border-[#E5E1D8]">
                  <h4 className="text-xs uppercase tracking-wider font-mono font-bold text-[#2E7D32]">
                    2. Workspace Schedule & Duration
                  </h4>

                  {/* Rental Plan Toggle */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#181F18]">
                      Rental Plan Frequency
                    </label>
                    <div className="grid grid-cols-3 gap-2 bg-[#FAF9F5] p-1.5 rounded-2xl border border-[#E5E1D8]">
                      {(['monthly', 'daily', 'hourly'] as const).map((plan) => (
                        <button
                          key={plan}
                          type="button"
                          onClick={() => setRentalPlan(plan)}
                          className={`py-2 text-xs font-semibold capitalize rounded-xl transition-all cursor-pointer ${
                            rentalPlan === plan
                              ? 'bg-white text-[#181F18] shadow-sm font-bold border border-[#E5E1D8]'
                              : 'text-[#5C665C] hover:text-[#181F18]'
                          }`}
                        >
                          {plan}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Multi-Row Date & Time Pickers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* From Date & Time */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-bold text-[#181F18]">
                        From Date & Time
                      </label>
                      <div className="grid grid-cols-[1.15fr_0.85fr] gap-2">
                        <MaterialDatePicker
                          value={startDate}
                          minDate={todayDate}
                          onChange={(newDate) => {
                            setStartDate(newDate);
                            if (newDate > endDate) setEndDate(newDate);
                          }}
                          align="left"
                        />
                        <MaterialTimePicker
                          value={startTime}
                          onChange={(newTime) => setStartTime(newTime)}
                          align="right"
                        />
                      </div>
                    </div>

                    {/* To Date & Time */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-bold text-[#181F18]">
                        To Date & Time
                      </label>
                      <div className="grid grid-cols-[1.15fr_0.85fr] gap-2">
                        <MaterialDatePicker
                          value={endDate}
                          minDate={startDate || todayDate}
                          onChange={(newDate) => setEndDate(newDate)}
                          align="left"
                        />
                        <MaterialTimePicker
                          value={endTime}
                          onChange={(newTime) => setEndTime(newTime)}
                          align="right"
                        />
                      </div>
                    </div>

                  </div>

                  {/* Number of Seats / Pax (Editable Input & Buttons) */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-[#181F18]">
                      Number of Seats / PAX
                    </label>
                    <div className="flex items-center justify-between bg-[#FAF9F5] border border-[#E5E1D8] rounded-xl px-4 py-2.5 text-xs text-[#181F18]">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={1}
                          max={500}
                          value={guestCount}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setGuestCount(isNaN(val) ? 1 : Math.max(1, val));
                          }}
                          className="w-14 text-center font-bold text-xs bg-white px-2 py-1 rounded-md border border-[#E5E1D8] text-[#181F18] focus:outline-none focus:border-[#2E7D32]"
                        />
                        <span className="font-semibold text-xs text-[#5C665C]">
                          Member{guestCount > 1 ? 's' : ''} Allocation
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setGuestCount((g) => Math.max(1, g - 1))}
                          className="w-8 h-8 rounded-lg bg-white border border-[#E5E1D8] text-[#181F18] font-bold flex items-center justify-center hover:bg-[#F0ECE1] active:scale-95 cursor-pointer"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => setGuestCount((g) => g + 1)}
                          className="w-8 h-8 rounded-lg bg-white border border-[#E5E1D8] text-[#181F18] font-bold flex items-center justify-center hover:bg-[#F0ECE1] active:scale-95 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#181F18]">
                      Special Requirements / Onboarding Notes <span className="text-xs text-[#5C665C] font-normal">(Optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="e.g., Specific floor preference, server rack space, high-spec AV setup, visitor badges..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] text-xs sm:text-sm text-[#181F18] placeholder-[#9EA89E] focus:outline-none focus:border-[#2E7D32] focus:bg-white transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Submit Confirmation CTA */}
                <div className="pt-4 border-t border-[#E5E1D8] space-y-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 px-6 rounded-2xl bg-[#2E7D32] hover:bg-[#1E5C23] active:bg-[#16471A] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing Sanctuary Reservation...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm Booking</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-[#5C665C]">
                    🔒 By confirming, you agree to EnCourtyard's sanctuary membership guidelines and privacy terms.
                  </p>
                </div>

              </form>
            </div>
          </div>

        </div>

      </main>

      {/* 3. Auth Prompt Modal (If unauthenticated user attempts to confirm booking) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn select-none">
          {/* Frosted Glass Blurred Backdrop */}
          <div
            className="fixed inset-0 bg-[#181F18]/65 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setShowAuthModal(false)}
          />

          {/* Center Modal Card */}
          <div className="relative z-10 w-full max-w-md bg-white rounded-3xl border border-[#E0DCD3] shadow-2xl p-6 sm:p-8 text-center animate-scaleUp font-sans">
            
            {/* Top Right Close X Button */}
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4.5 right-4.5 p-2 rounded-full text-gray-400 hover:text-[#181F18] hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Decorative Icon Glow Badge */}
            <div className="relative w-20 h-20 mx-auto mb-5 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-[#E8F5E9] border-2 border-[#C8E6C9] text-[#2E7D32] flex items-center justify-center shadow-[0_0_25px_rgba(46,125,50,0.25)] animate-scaleUp">
                <Lock className="w-8 h-8 stroke-[2.2]" />
              </div>
            </div>

            {/* Title */}
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18] tracking-tight mb-2">
              Sign In Required
            </h3>

            {/* Selected Workspace Context Pill */}
            {workspace && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF9F5] border border-[#E5E1D8] text-xs text-[#2E7D32] mb-3 max-w-full">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span className="font-bold truncate max-w-[200px]">{workspace.title}</span>
                <span className="text-[#8A968A]">•</span>
                <span className="capitalize font-semibold text-[#181F18]">{rentalPlan} Plan</span>
              </div>
            )}

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#5C665C] leading-relaxed mb-6">
              You must be signed in to reserve this workspace so we can verify your account, assign your biometric pass, and issue your booking confirmation.
            </p>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              {/* Sign In CTA */}
              <Link
                href={`/login?redirect=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/book')}`}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Continue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Create Account CTA */}
              <Link
                href={`/signup?redirect=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/book')}`}
                className="w-full py-3 px-6 rounded-2xl bg-[#FAF9F5] hover:bg-[#EAE5DC] text-[#181F18] border border-[#E0DCD3] hover:border-[#181F18]/40 font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-[#2E7D32]" />
                <span>Create Member Account</span>
              </Link>

              {/* Cancel / Dismiss */}
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="w-full pt-2 text-xs text-[#5C665C] hover:text-[#181F18] font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. Feedback & Celebration Modals */}
      <FeedbackModal
        isOpen={feedback.isOpen}
        type={feedback.type}
        variant={feedback.type === 'success' ? 'cta' : 'minimal'}
        title={feedback.title}
        message={feedback.message}
        subMessage={feedback.subMessage}
        primaryBtnText={feedback.type === 'success' ? 'Go to Dashboard' : 'Try Again'}
        secondaryBtnText={feedback.type === 'success' ? 'Browse More Workspaces' : 'Close'}
        onPrimaryClick={() => {
          setFeedback((f) => ({ ...f, isOpen: false }));
          if (feedback.type === 'success') {
            router.push('/dashboard');
          }
        }}
        onSecondaryClick={() => {
          setFeedback((f) => ({ ...f, isOpen: false }));
          if (feedback.type === 'success') {
            router.push('/book-space');
          }
        }}
        onClose={() => setFeedback((f) => ({ ...f, isOpen: false }))}
      />

    </div>
  );
}

export default function BookSeatsPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#FAF9F5] min-h-screen flex items-center justify-center pt-24 text-[#181F18]">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-3 border-[#2E7D32] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-serif text-sm text-[#5C665C]">Loading Reservation Sanctuary...</p>
          </div>
        </div>
      }
    >
      <BookPageContent />
    </Suspense>
  );
}
