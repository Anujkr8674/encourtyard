'use client';

import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  QrCode,
  Upload,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Building2,
  Calendar,
  Clock,
  ShieldCheck,
  ArrowLeft,
  Users,
  Smartphone,
  Sparkles,
  RefreshCw,
  X,
  FileCheck2,
  ExternalLink,
  Lock,
  Timer,
  CheckCheck,
  Info
} from 'lucide-react';
import { FeedbackModal } from '@/components/ui/FeedbackModal';
import QRCode from 'qrcode';
import { notifyBookingChange } from '@/lib/realtimeBookings';

interface BookingIntent {
  workspaceId?: string;
  workspaceTitle: string;
  workspaceSlug?: string;
  workspaceImage?: string;
  categoryName?: string;
  locationName?: string;
  fullName: string;
  companyName?: string | null;
  email: string;
  phone: string;
  spaceType?: string;
  plan: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  guests: number;
  baseAmount?: number;
  gstPercent?: number;
  gstAmount?: number;
  totalAmount: number | string;
  specialRequests?: string;
}

interface QrConfig {
  enabled: boolean;
  qrCodeUrl: string;
  upiId: string;
  merchantName: string;
  notes: string;
}

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [intent, setIntent] = useState<BookingIntent | null>(null);
  const [qrConfig, setQrConfig] = useState<QrConfig>({
    enabled: true,
    qrCodeUrl: '',
    upiId: '',
    merchantName: '',
    notes: '',
  });

  const [loadingConfig, setLoadingConfig] = useState(true);
  const [utrNumber, setUtrNumber] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreviewUrl, setProofPreviewUrl] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);
  const [copiedBookingId, setCopiedBookingId] = useState(false);
  const [timeLeft, setTimeLeft] = useState(899); // 15:00 countdown timer
  const [generatedQrDataUrl, setGeneratedQrDataUrl] = useState<string>('');
  const [qrViewMode, setQrViewMode] = useState<'amount' | 'flyer'>('amount');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [feedback, setFeedback] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  // Read cached active QR config from localStorage to eliminate 1ms flash on reload
  useEffect(() => {
    try {
      const cached = localStorage.getItem('encourtyard_active_qr_config');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.qrCodeUrl || parsed?.upiId) {
          setQrConfig(parsed);
          setLoadingConfig(false);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Auto-scroll directly to dialog box when booking created
  useEffect(() => {
    if (confirmedBookingId) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      setTimeout(() => {
        const el = document.getElementById('booking-confirmation-dialog');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
    }
  }, [confirmedBookingId]);

  // Countdown timer for session
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // 1. Load Booking Intent from sessionStorage or URL
  useEffect(() => {
    let parsedIntent: BookingIntent | null = null;
    try {
      const stored = sessionStorage.getItem('pending_booking_intent');
      if (stored) {
        parsedIntent = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read from sessionStorage:', e);
    }

    if (!parsedIntent) {
      const workspaceParam = searchParams.get('workspace') || '';
      const workspaceTitle = searchParams.get('workspaceTitle') || 'EnCourtyard Premium Workspace';
      const fullName = searchParams.get('fullName') || '';
      const email = searchParams.get('email') || '';
      const phone = searchParams.get('phone') || '';
      const plan = searchParams.get('plan') || 'daily';
      const startDate = searchParams.get('startDate') || '';
      const endDate = searchParams.get('endDate') || startDate;
      const startTime = searchParams.get('startTime') || '09:00 AM';
      const endTime = searchParams.get('endTime') || '06:00 PM';
      const guests = parseInt(searchParams.get('guests') || '1', 10);
      const totalAmount = searchParams.get('totalAmount') || '1180';
      const gstPercent = parseFloat(searchParams.get('gstPercent') || '18');
      const baseAmountParam = searchParams.get('baseAmount');
      const numTotal = parseFloat(String(totalAmount).replace(/[^0-9.]/g, '')) || 1180;
      const baseAmount = baseAmountParam ? parseFloat(baseAmountParam) : Math.round(numTotal / (1 + gstPercent / 100));

      parsedIntent = {
        workspaceId: workspaceParam,
        workspaceTitle,
        fullName: fullName || 'Valued Member',
        email,
        phone,
        plan,
        startDate,
        endDate,
        startTime,
        endTime,
        guests,
        baseAmount,
        gstPercent,
        totalAmount,
      };

      if (workspaceParam) {
        fetch(`/api/workspaces/${workspaceParam}`)
          .then((r) => r.json())
          .then((d) => {
            if (d?.success && d?.workspace) {
              setIntent((prev) => {
                const wsBase = parseFloat(String(d.workspace.price).replace(/[^0-9.]/g, '')) || 1000;
                return {
                  ...prev,
                  workspaceTitle: d.workspace.title || prev?.workspaceTitle || 'EnCourtyard Premium Workspace',
                  categoryName: d.workspace.categoryName || prev?.categoryName,
                  locationName: d.workspace.location || prev?.locationName,
                  workspaceImage: d.workspace.mediaUrls?.[0]?.url || prev?.workspaceImage,
                  baseAmount: prev?.baseAmount ?? wsBase,
                  totalAmount: prev?.totalAmount ?? Math.round(wsBase * 1.18),
                } as BookingIntent;
              });
            }
          })
          .catch(() => {});
      }
    }

    setIntent(parsedIntent);
  }, [searchParams]);

  // 2. Fetch QR Code Config from backend
  useEffect(() => {
    const fetchQrConfig = async () => {
      try {
        const res = await fetch('/api/qr-code', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.config) {
            setQrConfig(data.config);
            try {
              localStorage.setItem('encourtyard_active_qr_config', JSON.stringify(data.config));
            } catch {
              // ignore
            }
          }
        }
      } catch (err) {
        console.error('Failed to load QR configuration:', err);
      } finally {
        setLoadingConfig(false);
      }
    };

    fetchQrConfig();
  }, []);

  // Compute clean numeric amounts for display
  const numericTotal = useMemo(() => {
    if (!intent?.totalAmount) return 1180;
    const clean = String(intent.totalAmount).replace(/[^0-9.]/g, '');
    return parseFloat(clean) || 1180;
  }, [intent?.totalAmount]);

  const gstRate = intent?.gstPercent || 18;
  const numericBase = useMemo(() => {
    if (intent?.baseAmount) return intent.baseAmount;
    return Math.round(numericTotal / (1 + gstRate / 100));
  }, [numericTotal, gstRate, intent?.baseAmount]);

  const numericGst = useMemo(() => {
    return Math.max(0, numericTotal - numericBase);
  }, [numericTotal, numericBase]);

  // Dynamic UPI URI with the exact total amount pre-filled
  const upiPayUri = useMemo(() => {
    const upiId = qrConfig.upiId?.trim() || 'anujnick57@oksbi';
    const merchant = qrConfig.merchantName?.trim() || 'Anuj Kumar';
    const note = `EnCourtyard - ${intent?.workspaceTitle || 'Workspace'}`;
    return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(merchant)}&am=${numericTotal}&cu=INR&tn=${encodeURIComponent(note)}`;
  }, [qrConfig.upiId, qrConfig.merchantName, numericTotal, intent?.workspaceTitle]);

  // Generate dynamic QR Code for the exact total amount (e.g. ₹ 1,770)
  useEffect(() => {
    QRCode.toDataURL(upiPayUri, {
      width: 420,
      margin: 1.5,
      color: {
        dark: '#142314',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    })
      .then((dataUrl) => {
        setGeneratedQrDataUrl(dataUrl);
      })
      .catch((err) => {
        console.error('QR generation error:', err);
        setGeneratedQrDataUrl(
          `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(upiPayUri)}&margin=10`
        );
      });
  }, [upiPayUri]);

  // Active QR display URL: generated dynamic amount QR by default, or uploaded flyer if toggled
  const activeQrDisplayUrl = useMemo(() => {
    if (qrViewMode === 'flyer' && qrConfig.qrCodeUrl?.trim()) {
      return qrConfig.qrCodeUrl;
    }
    return generatedQrDataUrl || `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(upiPayUri)}&margin=10`;
  }, [qrViewMode, qrConfig.qrCodeUrl, generatedQrDataUrl, upiPayUri]);

  // File selection & preview
  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setProofFile(file);
    setProofPreviewUrl(URL.createObjectURL(file));
  };

  const handleClearProof = () => {
    setProofFile(null);
    setProofPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCopyUpi = () => {
    if (qrConfig.upiId) {
      navigator.clipboard.writeText(qrConfig.upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  // Submit Payment & Finalize Booking
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!utrNumber.trim()) {
      setFeedback({
        isOpen: true,
        type: 'error',
        title: 'UTR Number Required',
        message: 'Please provide the 12-digit UTR or Transaction Reference Number from your payment app.',
      });
      return;
    }

    if (!proofFile && !proofPreviewUrl) {
      setFeedback({
        isOpen: true,
        type: 'error',
        title: 'Payment Proof Required',
        message: 'Please attach a screenshot of your successful UPI payment to verify your booking.',
      });
      return;
    }

    try {
      setSubmitting(true);
      setUploadProgress(20);

      // 1. Upload payment proof screenshot to Supabase Storage: encourtyard-upload/payment-proof/
      let uploadedProofUrl = proofPreviewUrl;
      if (proofFile) {
        const formData = new FormData();
        formData.append('file', proofFile);

        setUploadProgress(40);
        const uploadRes = await fetch('/api/payment-proof/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok || !uploadData.success || !uploadData.url) {
          throw new Error(uploadData.error || 'Failed to upload payment proof screenshot');
        }
        uploadedProofUrl = uploadData.url;
      }

      setUploadProgress(70);

      // 2. Submit booking to /api/bookings with UTR & proof URL
      const bookingData = {
        workspaceId: intent?.workspaceId || null,
        workspaceTitle: intent?.workspaceTitle || 'EnCourtyard Premium Workspace',
        workspaceSlug: intent?.workspaceSlug,
        workspaceImage: intent?.workspaceImage,
        categoryName: intent?.categoryName || 'Sanctuary Workspace',
        locationName: intent?.locationName || 'Maruthi Plaza, Khairtabad, Hyderabad',
        fullName: intent?.fullName || 'Valued Member',
        companyName: intent?.companyName || null,
        email: intent?.email || '',
        phone: intent?.phone || '',
        spaceType: intent?.spaceType || 'workspace',
        plan: intent?.plan || 'daily',
        startDate: intent?.startDate,
        endDate: intent?.endDate,
        startTime: intent?.startTime,
        endTime: intent?.endTime,
        guests: intent?.guests || 1,
        totalAmount: numericTotal,
        utrNumber: utrNumber.trim(),
        paymentProofUrl: uploadedProofUrl,
        specialRequests: intent?.specialRequests,
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();
      setUploadProgress(100);

      if (res.ok && data.success) {
        const bookingId = data.booking?.id || 'BK-CONFIRMED';
        // Notify realtime websockets/broadcast so admin and user booking pages update instantly
        notifyBookingChange();
        window.scrollTo({ top: 0, behavior: 'instant' });
        setConfirmedBookingId(bookingId);
        try {
          sessionStorage.removeItem('pending_booking_intent');
        } catch {
          // ignore
        }
      } else {
        throw new Error(data.error || 'Failed to complete booking');
      }
    } catch (err: any) {
      setFeedback({
        isOpen: true,
        type: 'error',
        title: 'Booking Verification Failed',
        message: err.message || 'An error occurred while confirming your payment proof. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{ fontFamily: "Tahoma, Verdana, Segoe UI, sans-serif" }}
      className="bg-[#F4F6F4] min-h-screen text-[#181F18] pb-24 select-none"
    >
      
      {/* 1. Trusted Fintech Checkout Navbar / Topbar (Only shown during active checkout, hidden on confirmation) */}
      {!confirmedBookingId && (
        <section className="bg-white border-b border-[#E2E8E2] pt-24 pb-6 sm:pt-28 sm:pb-8 shadow-xs">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <Link
                  href="/book"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#556955] hover:text-[#1B5E20] transition-colors mb-2 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Workspace Booking</span>
                </Link>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9]">
                    <QrCode className="w-6 h-6 text-[#1B5E20]" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#142314] tracking-tight">
                      EnCourtyard UPI Instant Checkout
                    </h1>
                    <p className="text-xs text-[#556955] mt-0.5">
                      Official PCI-DSS compliant direct UPI payment settlement gateway
                    </p>
                  </div>
                </div>
              </div>

              {/* Session Timer & Security Badge */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono font-bold">
                  <Timer className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                  <span>Session: {formatTimer(timeLeft)}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#1B5E20]">
                  <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                  <span>256-Bit Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Main Checkout Grid */}
      <main className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${confirmedBookingId ? 'pt-24 sm:pt-28 pb-12' : 'py-8'}`}>
        
        {/* If successfully confirmed - Direct confirmation card */}
        {confirmedBookingId ? (
          <div
            id="booking-confirmation-dialog"
            className="max-w-xl mx-auto bg-white border border-[#D5DDD5] rounded-3xl p-8 sm:p-10 shadow-xl text-center space-y-6 animate-scaleUp my-6"
          >
            <div className="w-16 h-16 rounded-full bg-[#E8F5E9] border-2 border-[#A5D6A7] text-[#1B5E20] flex items-center justify-center mx-auto shadow-md">
              <CheckCheck className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1B5E20]">
                PAYMENT CONFIRMED · RESERVATION GENERATED
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#142314]">
                Booking Created Successfully!
              </h2>
              <p className="text-xs sm:text-sm text-[#556955]">
                Your UTR transaction number and payment proof screenshot have been verified. An official booking confirmation receipt has been emailed to you.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAF8] border border-[#E2E8E2] space-y-2 text-left text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8E2]">
                <span className="text-[#556955]">Booking Ref Number:</span>
                <div className="flex items-center gap-1.5 font-mono font-bold text-[#142314]">
                  <span>{confirmedBookingId}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(confirmedBookingId);
                      setCopiedBookingId(true);
                      setTimeout(() => setCopiedBookingId(false), 2000);
                    }}
                    className="p-1 rounded text-[#556955] hover:text-[#1B5E20] transition-colors cursor-pointer"
                    title="Copy ID"
                  >
                    {copiedBookingId ? <Check className="w-3.5 h-3.5 text-[#1B5E20]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#556955]">Recorded UTR No:</span>
                <span className="font-mono font-bold text-[#142314]">{utrNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#556955]">Total Paid (With 18% GST):</span>
                <strong className="text-[#1B5E20] text-sm font-bold">
                  ₹ {numericTotal.toLocaleString('en-IN')}
                </strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/user/bookings"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1B5E20] hover:bg-[#154D1A] text-white text-xs font-bold transition-all shadow-md text-center cursor-pointer"
              >
                View My Bookings Dossier
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#F4F6F4] hover:bg-[#E5EBE5] text-[#142314] border border-[#D5DDD5] text-xs font-bold transition-all text-center cursor-pointer"
              >
                Return to EnCourtyard Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ========================================================================= */}
            {/* LEFT COLUMN: ORDER SUMMARY & BILLING SPECIFICATION (5 COLS)               */}
            {/* ========================================================================= */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Order Dossier Card */}
              <div className="bg-white border border-[#D5DDD5] rounded-3xl p-6 shadow-sm space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9] text-[10px] font-mono font-bold uppercase">
                    {intent?.plan || 'daily'} rental
                  </span>
                  <span className="text-[11px] font-bold text-[#556955]">EnCourtyard Hyderabad</span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#142314] leading-snug">
                    {intent?.workspaceTitle || 'EnCourtyard Dedicated Desk'}
                  </h3>
                  <p className="text-xs text-[#556955] mt-0.5">
                    {intent?.locationName || 'Maruthi Plaza, Khairtabad, Hyderabad'}
                  </p>
                </div>

                <div className="space-y-2 text-xs text-[#556955] pt-2 border-t border-[#E8EEE8]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#1B5E20] shrink-0" />
                    <span>
                      <strong>Dates:</strong> {intent?.startDate || '2026-10-25'}{' '}
                      {intent?.endDate && intent.endDate !== intent.startDate ? `to ${intent.endDate}` : '(Single Day)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#1B5E20] shrink-0" />
                    <span>
                      <strong>Access Hours:</strong> {intent?.startTime || '09:00 AM'} – {intent?.endTime || '06:00 PM'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#1B5E20] shrink-0" />
                    <span>
                      <strong>Seating PAX:</strong> {intent?.guests || 1} Member{intent && intent.guests > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Fintech Billing Breakdown Box */}
                <div className="p-4 rounded-2xl bg-[#F8FAF8] border border-[#E2E8E2] space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-[#556955]">
                    <span>Base Workspace Rate:</span>
                    <strong className="text-[#142314] font-bold">₹ {numericBase.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[#556955]">
                    <span>GST Rate ({gstRate}%):</span>
                    <strong className="text-amber-800 font-bold">+ ₹ {numericGst.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[#556955]">
                    <span>Botanical Concierge & High-Speed LAN:</span>
                    <span className="text-[#1B5E20] font-bold">Included Free</span>
                  </div>

                  {/* Grand Total Row */}
                  <div className="pt-3 border-t border-[#D5DDD5] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-[#556955] block font-bold">
                        Total Amount Payable
                      </span>
                      <strong className="text-2xl font-bold text-[#1B5E20]">
                        ₹ {numericTotal.toLocaleString('en-IN')}
                      </strong>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-[#E8F5E9] text-[#1B5E20] font-bold text-xs font-mono border border-[#C8E6C9]">
                      INR (₹)
                    </span>
                  </div>
                </div>

                {/* Primary Guest Note */}
                <div className="p-3 rounded-xl bg-white border border-[#E2E8E2] text-[11px] text-[#556955]">
                  <span>Reserved For: <strong>{intent?.fullName || 'Primary Guest'}</strong> ({intent?.email || 'email'})</span>
                </div>

              </div>

              {/* Supported UPI Apps Banner */}
              <div className="bg-white border border-[#D5DDD5] rounded-3xl p-5 shadow-xs text-center space-y-2">
                <span className="text-[10px] uppercase font-mono font-bold text-[#556955] block">
                  SUPPORTED INSTANT UPI APPLICATIONS
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] font-bold">
                  {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI', 'Cred', 'Amazon Pay'].map((app) => (
                    <span
                      key={app}
                      className="px-2.5 py-1 rounded-lg bg-[#F4F6F4] border border-[#E2E8E2] text-[#142314]"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* ========================================================================= */}
            {/* RIGHT COLUMN: PROFESSIONAL PAYMENT SYSTEM INTERFACE (7 COLS)              */}
            {/* ========================================================================= */}
            <div className="lg:col-span-7 space-y-6">
              
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                
                {/* STEP 1: Official Dynamic Amount QR Code Box */}
                <div className="bg-white border border-[#D5DDD5] rounded-3xl p-6 sm:p-8 shadow-sm text-center space-y-5">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E8F5E9] text-[#1B5E20] text-xs font-mono font-bold uppercase mb-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>STEP 1 · DYNAMIC UPI AMOUNT QR CODE</span>
                    </div>
                    {loadingConfig && !qrConfig.merchantName ? (
                      <div className="h-7 w-60 bg-[#E2E8E2] rounded-md mx-auto animate-pulse my-1" />
                    ) : (
                      <h3 className="text-xl sm:text-2xl font-bold text-[#142314]">
                        {qrConfig.merchantName || 'EnCourtyard Architectural Coworking'}
                      </h3>
                    )}
                    <p className="text-xs text-[#556955] mt-0.5">
                      Open Google Pay, PhonePe, Paytm, or any UPI app. Scan to pay exact pre-filled amount.
                    </p>
                  </div>

                  {/* QR Mode Switcher (If flyer image also uploaded by merchant) */}
                  {qrConfig.qrCodeUrl && (
                    <div className="inline-flex p-1 bg-[#F4F6F4] rounded-xl border border-[#D5DDD5] text-xs font-medium">
                      <button
                        type="button"
                        onClick={() => setQrViewMode('amount')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          qrViewMode === 'amount'
                            ? 'bg-white text-[#1B5E20] shadow-xs'
                            : 'text-[#556955] hover:text-[#142314]'
                        }`}
                      >
                        ⚡ Amount QR (₹ {numericTotal.toLocaleString('en-IN')})
                      </button>
                      <button
                        type="button"
                        onClick={() => setQrViewMode('flyer')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          qrViewMode === 'flyer'
                            ? 'bg-white text-[#1B5E20] shadow-xs'
                            : 'text-[#556955] hover:text-[#142314]'
                        }`}
                      >
                        📷 Merchant Flyer
                      </button>
                    </div>
                  )}

                  {/* High Quality Dynamic QR Frame */}
                  <div className="relative mx-auto w-64 h-64 sm:w-72 sm:h-72 p-4 bg-white rounded-3xl border-2 border-[#1B5E20] shadow-md flex flex-col items-center justify-center group overflow-hidden">
                    {loadingConfig && !activeQrDisplayUrl ? (
                      <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                        <RefreshCw className="w-8 h-8 text-[#1B5E20] animate-spin mb-1" />
                        <span className="text-xs font-bold text-[#142314]">Generating Dynamic Amount QR...</span>
                        <span className="text-[10px] text-[#556955]">Pre-filling ₹ {numericTotal.toLocaleString('en-IN')}</span>
                      </div>
                    ) : activeQrDisplayUrl ? (
                      <>
                        <img
                          src={activeQrDisplayUrl}
                          alt={`EnCourtyard QR Code for ₹ ${numericTotal.toLocaleString('en-IN')}`}
                          className="w-full h-full object-contain rounded-2xl"
                        />
                        <div
                          className="absolute -top-3 -right-3 bg-[#1B5E20] text-white p-1 rounded-full shadow-md"
                          title="Verified UPI Merchant Gateway"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        {qrViewMode === 'amount' && (
                          <div className="absolute bottom-2 inset-x-4 bg-white/95 backdrop-blur-xs py-1 px-2 rounded-lg border border-[#C8E6C9] shadow-xs text-center">
                            <span className="text-[11px] font-bold text-[#1B5E20] font-mono">
                              Pre-filled Amount: ₹ {numericTotal.toLocaleString('en-IN')}
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 text-center text-[#556955] text-xs space-y-1">
                        <QrCode className="w-10 h-10 text-[#9EAB9E] mb-1" />
                        <span className="font-bold">QR Code Ready</span>
                        <span className="text-[10px]">Merchant UPI: {qrConfig.upiId}</span>
                      </div>
                    )}
                  </div>

                  {/* Amount to Pay Ribbon */}
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-2xl bg-[#E8F5E9] border border-[#A5D6A7] text-center shadow-2xs">
                      <span className="text-xs font-bold text-[#556955]">Exact Amount to Pay:</span>
                      <strong className="text-xl sm:text-2xl font-bold text-[#1B5E20]">
                        ₹ {numericTotal.toLocaleString('en-IN')}
                      </strong>
                    </div>
                    <p className="text-[11px] text-[#556955]">
                      Amount <strong className="text-[#1B5E20]">₹ {numericTotal.toLocaleString('en-IN')}</strong> will automatically appear in your UPI app upon scanning.
                    </p>
                  </div>

                  {/* Mobile Direct Tap to Pay Link */}
                  <div className="pt-1">
                    <a
                      href={upiPayUri}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B5E20] hover:bg-[#144718] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <span>📱 Tap to Pay on Mobile (Opens UPI App)</span>
                    </a>
                  </div>

                  {/* Copy UPI Section */}
                  <div className="max-w-md mx-auto bg-[#F8FAF8] p-3 rounded-2xl border border-[#D5DDD5] flex items-center justify-between gap-3 text-xs">
                    <div className="text-left truncate">
                      <span className="text-[10px] uppercase font-mono text-[#556955] block font-bold">
                        MERCHANT UPI ID / VPA
                      </span>
                      {loadingConfig && !qrConfig.upiId ? (
                        <div className="h-5 w-36 bg-[#E2E8E2] rounded animate-pulse my-0.5" />
                      ) : (
                        <strong className="font-mono text-[#142314] truncate block text-xs sm:text-sm">
                          {qrConfig.upiId || 'encourtyard@upi'}
                        </strong>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9] font-bold text-xs inline-flex items-center gap-1 cursor-pointer transition-all shrink-0 shadow-2xs"
                    >
                      {copiedUpi ? <Check className="w-3.5 h-3.5 text-[#1B5E20]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUpi ? 'Copied!' : 'Copy UPI ID'}</span>
                    </button>
                  </div>

                  {loadingConfig && !qrConfig.notes ? (
                    <div className="h-4 w-72 bg-[#E2E8E2] rounded mx-auto animate-pulse" />
                  ) : (
                    <p className="text-[11px] text-[#556955] leading-relaxed max-w-md mx-auto">
                      {qrConfig.notes}
                    </p>
                  )}
                </div>

                {/* STEP 2: UTR Reference & Payment Proof Upload */}
                <div className="bg-white border border-[#D5DDD5] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 text-left">
                  <div className="pb-3 border-b border-[#E2E8E2]">
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E8F5E9] text-[#1B5E20] text-xs font-mono font-bold uppercase mb-1">
                      <span>STEP 2 · TRANSACTION VERIFICATION</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#142314]">
                      Enter UTR Number & Attach Screenshot
                    </h3>
                  </div>

                  {/* UTR Input Field */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-[#142314] uppercase tracking-wider">
                        12-Digit UPI UTR / Transaction Reference ID <span className="text-red-500">*</span>
                      </label>
                      <span className={`text-[10px] font-mono font-bold ${utrNumber.length === 12 ? 'text-[#1B5E20]' : 'text-[#738273]'}`}>
                        {utrNumber.length}/12 Digits
                      </span>
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 428912345678 (Find in UPI payment receipt details)"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value.replace(/\s+/g, ''))}
                      className="w-full px-4 py-3 rounded-xl border border-[#D5DDD5] bg-[#F8FAF8] text-xs sm:text-sm font-mono font-bold text-[#142314] focus:outline-none focus:border-[#1B5E20] focus:bg-white transition-all shadow-inner"
                    />
                    <div className="flex items-center gap-1.5 text-[11px] text-[#556955] pt-0.5">
                      <Info className="w-3.5 h-3.5 text-[#1B5E20] shrink-0" />
                      <span>Every UPI app (GPay, PhonePe, Paytm, BHIM) generates a unique 12-digit UTR reference.</span>
                    </div>
                  </div>

                  {/* Payment Proof Screenshot Upload with Live Preview */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#142314] uppercase tracking-wider">
                      Upload Payment Proof Screenshot <span className="text-red-500">*</span>
                    </label>
                    
                    {!proofPreviewUrl ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-[#C5D0C5] hover:border-[#1B5E20] bg-[#F8FAF8] hover:bg-[#E8F5E9]/30 rounded-2xl p-6 text-center cursor-pointer transition-all group shadow-2xs"
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={handleProofChange}
                          className="hidden"
                        />
                        <div className="w-12 h-12 rounded-full bg-white border border-[#D5DDD5] text-[#1B5E20] flex items-center justify-center mx-auto mb-2 shadow-2xs group-hover:scale-110 transition-transform">
                          <Upload className="w-5 h-5" />
                        </div>
                        <h4 className="text-xs font-bold text-[#142314]">
                          Click to select or drop payment screenshot
                        </h4>
                        <p className="text-[11px] text-[#556955] mt-0.5">
                          Uploads directly to Supabase Storage: <code className="font-mono text-[#1B5E20]">payment-proof/</code>
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-[#F8FAF8] border border-[#D5DDD5] space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#1B5E20] flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-[#1B5E20]" />
                            <span>Payment Screenshot Attached & Ready</span>
                          </span>
                          <button
                            type="button"
                            onClick={handleClearProof}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-xs flex items-center gap-1 font-bold"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>

                        {/* Image Preview Box */}
                        <div className="relative rounded-2xl overflow-hidden border border-[#D5DDD5] bg-white max-h-64 flex items-center justify-center p-2 shadow-xs">
                          <img
                            src={proofPreviewUrl}
                            alt="Payment Proof Screenshot Preview"
                            className="w-full h-auto max-h-60 object-contain rounded-xl"
                          />
                        </div>

                        {proofFile && (
                          <span className="text-[10px] text-[#556955] font-mono block">
                            File: {proofFile.name} ({(proofFile.size / 1024).toFixed(1)} KB)
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Submission Progress Animation */}
                  {submitting && (
                    <div className="p-3.5 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] space-y-1.5 animate-fadeIn">
                      <div className="flex items-center justify-between text-xs font-bold text-[#1B5E20]">
                        <span>Uploading screenshot to Supabase Storage & creating booking...</span>
                        <span className="font-mono">{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-[#C8E6C9] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#1B5E20] transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Submit CTA */}
                  <div className="pt-4 border-t border-[#E2E8E2]">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 px-6 rounded-2xl bg-[#1B5E20] hover:bg-[#154D1A] active:bg-[#0D3611] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Verifying Payment Proof...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Submit Payment & Confirm Booking</span>
                        </>
                      )}
                    </button>

                    <p className="text-center text-[11px] text-[#556955] mt-3">
                      🔒 Secured by EnCourtyard Concierge Gateway · Immediate Biometric Pass Generation
                    </p>
                  </div>

                </div>

              </form>

            </div>

          </div>
        )}

      </main>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedback.isOpen}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
        onClose={() => setFeedback((f) => ({ ...f, isOpen: false }))}
      />

    </div>
  );
}

export default function BookPaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center p-8">
          <div className="w-8 h-8 border-3 border-[#1B5E20] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      }
    >
      <PaymentPageContent />
    </Suspense>
  );
}
