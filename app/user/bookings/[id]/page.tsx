'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  Copy,
  Check,
  Ban,
  MessageCircle,
  CreditCard,
  Building2,
  ExternalLink,
  ShieldCheck,
  QrCode,
  Download,
  AlertTriangle,
  MessageSquare,
  User,
} from 'lucide-react';
import { BookingStatusTracker } from '@/components/user/BookingStatusTracker';
import { InvoiceModal } from '@/components/user/InvoiceModal';
import { notifyBookingChange } from '@/lib/realtimeBookings';
import { parseBookingNotes } from '@/lib/bookingNotes';

interface BookingDetail {
  id: string;
  workspaceId?: string | null;
  workspaceTitle: string;
  categoryName?: string;
  locationName?: string;
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
  spaceType?: string;
  plan?: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  guests: number;
  totalAmount: number | null;
  status: string;
  paymentStatus: string;
  adminNotes?: string;
  statusUpdatedAt?: string;
  createdAt: string;
  workspaceImage?: string | null;
}

const DEFAULT_WORKSPACE_IMG =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80';

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.id as string;

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const fetchBooking = async () => {
    if (!bookingId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/user/bookings/${bookingId}`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to load booking details.');
      }
      setBooking(data.booking);
    } catch (err: any) {
      setError(err.message || 'Error loading booking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const handleCopyId = () => {
    if (!booking) return;
    navigator.clipboard.writeText(booking.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCancelBooking = async () => {
    if (!booking) return;
    if (!confirm('Are you sure you want to cancel this pending reservation?')) return;

    try {
      setCancelling(true);
      const res = await fetch(`/api/user/bookings/${booking.id}/cancel`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        notifyBookingChange();
        alert('Your reservation has been cancelled.');
        fetchBooking();
      } else {
        alert(data.error || 'Could not cancel booking.');
      }
    } catch {
      alert('Network error while cancelling reservation.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-[#181F18]"
        style={{ fontFamily: "Tahoma, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
      >
        <div className="w-8 h-8 border-3 border-[#2E7D32] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono uppercase tracking-wider text-[#5C665C]">
          Loading Booking Details...
        </span>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div
        className="max-w-2xl mx-auto py-12 px-4 text-center space-y-4"
        style={{ fontFamily: "Tahoma, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
      >
        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-[#181F18]">Booking Not Found</h2>
        <p className="text-xs text-[#5C665C]">{error || 'This reservation does not exist or has been removed.'}</p>
        <div className="pt-2">
          <Link
            href="/user/bookings"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2E7D32] text-white text-xs font-bold hover:bg-[#1B5E20] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Bookings</span>
          </Link>
        </div>
      </div>
    );
  }

  // Parse notes using bookingNotes utility
  const parsedNotes = parseBookingNotes(booking.adminNotes);
  const utrNumber = parsedNotes.utr;
  const proofUrl = parsedNotes.proofUrl;
  const customerNotes = parsedNotes.userNotes;
  const cleanAdminNote = parsedNotes.adminNotes;

  const norm = (booking.status || '').toUpperCase();
  const isCancelled = norm === 'CANCELLED' || norm === 'CANCELED' || norm === 'REJECTED' || norm.includes('CANCEL');
  const isCompleted = norm === 'COMPLETED';
  const isConfirmed = norm === 'CONFIRMED';
  const isPending = norm === 'PENDING';
  const isPaid = (booking.paymentStatus || '').toUpperCase() === 'PAID';

  const bookingImage = booking.workspaceImage || DEFAULT_WORKSPACE_IMG;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className="max-w-6xl mx-auto space-y-5 pb-12 text-[#181F18] animate-fadeIn text-left"
      style={{ fontFamily: "Tahoma, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      {/* Top Breadcrumb & Back Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          href="/user/bookings"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#2E7D32] hover:text-[#1B5E20] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to My Bookings</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyId}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF9F5] text-[#181F18] border border-[#E5E1D8] text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            {copiedId ? <Check className="w-3.5 h-3.5 text-[#2E7D32]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedId ? 'Copied ID' : 'Copy ID'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowInvoiceModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Tax Invoice</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF9F5] text-[#181F18] border border-[#E5E1D8] text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>Print Pass</span>
          </button>
        </div>
      </div>

      {/* If Booking is Cancelled: Show Prominent Danger Banner at Top */}
      {isCancelled && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 text-rose-950 space-y-2 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 text-rose-800 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>Reservation Cancelled by Concierge / Management</span>
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-rose-600 text-white font-mono text-[11px] font-bold">
              STATUS: CANCELLED
            </span>
          </div>
          <p className="text-xs text-rose-900 leading-relaxed font-medium">
            This reservation was officially marked as cancelled on {formatDate(booking.statusUpdatedAt || booking.createdAt)}. Space access and biometric keycard privileges have been deactivated.
          </p>
          {cleanAdminNote && (
            <div className="mt-2.5 p-3 rounded-xl bg-white border border-rose-300 text-xs text-rose-950 space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-rose-600" />
                <span>Admin Cancellation Reason / Concierge Note:</span>
              </span>
              <p className="text-xs font-semibold text-rose-950 pl-5">
                &ldquo;{cleanAdminNote}&rdquo;
              </p>
            </div>
          )}
        </div>
      )}

      {/* Flipkart Order Details Top Section: Two-Column Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Card 1: Reservation & Member Address (8 Cols) */}
        <div className="md:col-span-8 bg-white rounded-2xl border border-[#E5E1D8] p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E1D8]">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#5C665C]">
              Reservation & Member Details
            </span>
            <span className="text-xs font-mono font-bold text-[#2E7D32]">
              Ref #{booking.id.slice(0, 8).toUpperCase()}
            </span>
          </div>

          <div className="space-y-1 text-xs">
            <h3 className="font-bold text-sm text-[#181F18]">{booking.fullName}</h3>
            {booking.companyName && (
              <p className="text-[#2E7D32] font-semibold">{booking.companyName}</p>
            )}
            <p className="text-[#5C665C]">
              Phone: <strong className="text-[#181F18] font-mono">{booking.phone}</strong>
            </p>
            <p className="text-[#5C665C]">
              Email: <strong className="text-[#181F18]">{booking.email}</strong>
            </p>
            <p className="text-[#5C665C] pt-1">
              Sanctuary Facility:{' '}
              <span className="text-[#181F18] font-medium">
                {booking.locationName || 'EnCourtyard Sanctuary, Maruthi Plaza, Khairtabad, Hyderabad'}
              </span>
            </p>
          </div>
        </div>

        {/* Card 2: More Actions & Quick Concierge (4 Cols) */}
        <div className="md:col-span-4 bg-white rounded-2xl border border-[#E5E1D8] p-5 shadow-2xs flex flex-col justify-between space-y-3">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#5C665C] block mb-2">
              More Actions
            </span>
            <button
              type="button"
              onClick={() => setShowInvoiceModal(true)}
              className="w-full text-left py-2 px-3 rounded-xl bg-[#FAF9F5] hover:bg-[#F2EEE7] text-xs font-bold text-[#2E7D32] flex items-center justify-between transition-colors border border-[#E5E1D8] cursor-pointer mb-2"
            >
              <span className="flex items-center gap-2">
                <Download className="w-3.5 h-3.5" />
                <span>Download Invoice</span>
              </span>
              <span>&rarr;</span>
            </button>
          </div>

          <div>
            <a
              href={`https://wa.me/919908209993?text=Hello%20EnCourtyard%20Concierge%2C%20inquiry%20regarding%20booking%20ID%20${booking.id.slice(0, 8)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-xl bg-[#FAF9F5] hover:bg-[#F2EEE7] text-xs font-semibold text-[#181F18] flex items-center justify-between border border-[#E5E1D8] transition-colors"
            >
              <span className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Contact Concierge Desk</span>
              </span>
              <span className="text-[10px] text-[#2E7D32] font-mono font-bold">Online</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Flipkart-Style Workspace Item & Tracking Card */}
      <div className="bg-white rounded-2xl border border-[#E5E1D8] shadow-2xs p-5 sm:p-7 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#E5E1D8]">
          {/* Left: Thumbnail & Workspace Info */}
          <div className="flex items-start gap-4 flex-1">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#FAF9F5] border border-[#E5E1D8] overflow-hidden shrink-0 relative">
              <img
                src={bookingImage}
                alt={booking.workspaceTitle}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <h2 className="font-bold text-base sm:text-lg text-[#181F18]">
                {booking.workspaceTitle}
              </h2>
              <p className="text-xs text-[#5C665C]">
                Category: <strong className="text-[#181F18]">{booking.categoryName || 'Executive Suite'}</strong>
              </p>
              <p className="text-xs text-[#5C665C]">
                Plan: <strong className="text-[#181F18] capitalize">{booking.plan || 'Standard'}</strong> • Guests:{' '}
                <strong className="text-[#181F18]">{booking.guests || 1} Person(s)</strong>
              </p>
              <p className="text-xs text-[#5C665C]">
                Time Slot: <strong className="text-emerald-800 font-bold">{booking.startTime || '09:00 AM'} – {booking.endTime || '06:00 PM'}</strong>
              </p>
              <p className="text-xs font-mono text-[#5C665C] pt-1">
                Booking ID: <span className="font-bold text-[#181F18]">#{booking.id}</span>
              </p>
            </div>
          </div>

          {/* Right: Price & Accurate Status Display */}
          <div className="md:w-56 shrink-0 md:text-right space-y-1 bg-[#FAF9F5] md:bg-transparent p-4 md:p-0 rounded-xl border md:border-0 border-[#E5E1D8]">
            <span className="font-serif text-2xl font-bold text-[#181F18] font-mono block">
              ₹{(booking.totalAmount || 0).toLocaleString('en-IN')}
            </span>

            {/* Status Bullet with Accurate Danger/Success Pill */}
            <div className="flex items-center md:justify-end gap-1.5 text-xs font-bold">
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  isConfirmed
                    ? 'bg-[#2E7D32]'
                    : isCompleted
                    ? 'bg-slate-700'
                    : isPending
                    ? 'bg-amber-500'
                    : 'bg-rose-600'
                }`}
              />
              <span
                className={
                  isConfirmed
                    ? 'text-emerald-800'
                    : isCompleted
                    ? 'text-slate-800'
                    : isPending
                    ? 'text-amber-800'
                    : 'text-rose-700 font-bold'
                }
              >
                {isConfirmed
                  ? 'Confirmed & Active'
                  : isCompleted
                  ? 'Session Completed'
                  : isPending
                  ? 'Under Review'
                  : 'Cancelled'}
              </span>
            </div>

            <span className="text-[11px] text-[#5C665C] block">
              Reserved on {formatDate(booking.createdAt)}
            </span>
          </div>
        </div>

        {/* Live Tracking Progression Stepper / Cancellation Notice */}
        <div className="pt-2">
          <BookingStatusTracker
            status={booking.status}
            paymentStatus={booking.paymentStatus}
            createdAt={booking.createdAt}
            statusUpdatedAt={booking.statusUpdatedAt}
            startDate={booking.startDate}
            utrNumber={utrNumber}
            adminNotes={booking.adminNotes}
          />
        </div>
      </div>

      {/* Grid: Schedule Details & Financial Settlement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Schedule & Timing Card */}
        <div className="bg-white rounded-2xl border border-[#E5E1D8] shadow-2xs p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E5E1D8]">
            <Clock className="w-4 h-4 text-[#2E7D32]" />
            <h3 className="font-bold text-xs uppercase font-mono tracking-wider text-[#5C665C]">
              Schedule & Time Slot
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[#FAF9F5]">
              <span className="text-[#5C665C]">Event Date:</span>
              <strong className="text-[#181F18]">{booking.startDate}</strong>
            </div>

            {booking.endDate && booking.endDate !== booking.startDate && (
              <div className="flex justify-between py-1 border-b border-[#FAF9F5]">
                <span className="text-[#5C665C]">End Date:</span>
                <strong className="text-[#181F18]">{booking.endDate}</strong>
              </div>
            )}

            <div className="flex justify-between py-1 border-b border-[#FAF9F5]">
              <span className="text-[#5C665C]">Allocated Time Slot:</span>
              <strong className="text-emerald-800 font-bold">
                {booking.startTime || '09:00 AM'} – {booking.endTime || '06:00 PM'}
              </strong>
            </div>

            <div className="flex justify-between py-1 border-b border-[#FAF9F5]">
              <span className="text-[#5C665C]">Registered Guests:</span>
              <strong className="text-[#181F18]">{booking.guests || 1} Member(s)</strong>
            </div>

            {customerNotes && (
              <div className="pt-2 text-xs">
                <span className="text-blue-900 block font-semibold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-700" />
                  <span>Your Note / Special Request (From Booking):</span>
                </span>
                <p className="p-2.5 rounded-xl border mt-1 leading-relaxed bg-blue-50/80 text-blue-950 border-blue-200">
                  {customerNotes}
                </p>
              </div>
            )}

            {cleanAdminNote && (
              <div className="pt-2 text-xs">
                <span className="text-[#1E5C23] block font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>{isCancelled ? 'Admin Cancellation Reason:' : 'Admin & Concierge Note:'}</span>
                </span>
                <p
                  className={`p-2.5 rounded-xl border mt-1 leading-relaxed ${
                    isCancelled
                      ? 'bg-rose-50 text-rose-950 border-rose-200'
                      : 'bg-emerald-50/80 text-emerald-950 border-emerald-200'
                  }`}
                >
                  {cleanAdminNote}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Flipkart-Style Price & Payment Breakdown Card */}
        <div className="bg-white rounded-2xl border border-[#E5E1D8] shadow-2xs p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E5E1D8]">
            <CreditCard className="w-4 h-4 text-[#2E7D32]" />
            <h3 className="font-bold text-xs uppercase font-mono tracking-wider text-[#5C665C]">
              Payment & Price Details
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[#FAF9F5]">
              <span className="text-[#5C665C]">Workspace Rental:</span>
              <span className="font-mono text-[#181F18]">
                ₹{Math.round(((booking.totalAmount || 0) / 1.18) * 100) / 100}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-[#FAF9F5]">
              <span className="text-[#5C665C]">Applicable GST (18%):</span>
              <span className="font-mono text-[#181F18]">
                ₹{Math.round(((booking.totalAmount || 0) - ((booking.totalAmount || 0) / 1.18)) * 100) / 100}
              </span>
            </div>

            <div className="flex justify-between py-2 border-t border-[#E5E1D8] font-bold text-sm text-[#181F18]">
              <span>Total Settled:</span>
              <span className="font-mono text-[#2E7D32]">
                ₹{(booking.totalAmount || 0).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="pt-1 flex justify-between items-center text-xs">
              <span className="text-[#5C665C]">Payment Status:</span>
              <span
                className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                  isPaid
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {isPaid ? 'PAID & VERIFIED' : 'PENDING REVIEW'}
              </span>
            </div>

            {utrNumber && (
              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-[#5C665C]">12-Digit UTR Ref:</span>
                <span className="font-mono font-bold text-[#181F18] bg-[#FAF9F5] px-2 py-0.5 rounded border border-[#E5E1D8]">
                  {utrNumber}
                </span>
              </div>
            )}

            {proofUrl && (
              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-[#5C665C]">Uploaded Receipt:</span>
                <a
                  href={proofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2E7D32] font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>View Proof Image</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancellation Option (If Booking is Pending) */}
      {isPending && (
        <div className="bg-white rounded-2xl border border-rose-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm text-rose-800">Need to Cancel this Reservation?</h4>
            <p className="text-xs text-[#5C665C]">
              You can cancel this reservation while it is still under verification review.
            </p>
          </div>
          <button
            type="button"
            disabled={cancelling}
            onClick={handleCancelBooking}
            className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <Ban className="w-3.5 h-3.5" />
            <span>{cancelling ? 'Cancelling...' : 'Cancel Reservation'}</span>
          </button>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <InvoiceModal
          booking={{
            id: booking.id,
            workspaceTitle: booking.workspaceTitle,
            workspaceType: booking.categoryName || 'Workspace',
            bookingType: booking.plan || 'Standard',
            startDate: booking.startDate,
            endDate: booking.endDate,
            totalPrice: booking.totalAmount || 0,
            status: booking.status,
            userName: booking.fullName,
            userEmail: booking.email,
            userPhone: booking.phone,
            companyName: booking.companyName,
            adminNotes: booking.adminNotes,
            createdAt: booking.createdAt,
          }}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}
    </div>
  );
}
