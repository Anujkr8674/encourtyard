'use client';

import React, { useState } from 'react';
import {
  X,
  Building2,
  Calendar,
  Clock,
  Users,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Printer,
  ExternalLink,
  ShieldCheck,
  Copy,
  Check,
  Ban,
  Mail,
  Phone,
  FileText,
  CreditCard,
  MessageCircle,
  User,
} from 'lucide-react';
import { BookingStatusTracker } from './BookingStatusTracker';
import { parseBookingNotes } from '@/lib/bookingNotes';

export interface BookingRecord {
  id: string;
  workspaceId?: string | null;
  workspaceTitle?: string | null;
  categoryName?: string | null;
  locationName?: string | null;
  fullName?: string | null;
  companyName?: string | null;
  email?: string | null;
  phone?: string | null;
  spaceType?: string | null;
  plan?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  guests?: number;
  totalAmount?: number | null;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | string;
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED' | string;
  adminNotes?: string | null;
  statusUpdatedAt?: string | null;
  createdAt: string;
}

interface BookingDetailModalProps {
  booking: BookingRecord | null;
  onClose: () => void;
  onCancelled?: (id: string) => void;
  onBookingCancelled?: () => void;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  booking,
  onClose,
  onCancelled,
  onBookingCancelled,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!booking) return null;

  // Extract UTR, proof URL, user notes, and admin notes using parseBookingNotes
  const parsed = parseBookingNotes(booking.adminNotes);
  const utrNumber = parsed.utr;
  const proofUrl = parsed.proofUrl;
  const customerNotes = parsed.userNotes;
  const adminNotes = parsed.adminNotes;

  const handleCopyId = () => {
    navigator.clipboard.writeText(booking.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this pending reservation?')) return;
    try {
      setCancelling(true);
      setErrorMsg('');
      const res = await fetch(`/api/user/bookings/${booking.id}/cancel`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        if (onCancelled) onCancelled(booking.id);
        if (onBookingCancelled) onBookingCancelled();
        onClose();
      } else {
        setErrorMsg(data.error || 'Failed to cancel booking');
      }
    } catch {
      setErrorMsg('Network error while cancelling');
    } finally {
      setCancelling(false);
    }
  };

  const isConfirmed = booking.status === 'CONFIRMED';
  const isPending = booking.status === 'PENDING';
  const isCancelled = booking.status === 'CANCELLED' || booking.status === 'REJECTED';
  const isPaid = booking.paymentStatus === 'PAID';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#E5E1D8] shadow-2xl p-5 sm:p-8 font-sans max-h-[92vh] overflow-y-auto text-left text-[#181F18]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#5C665C] hover:text-[#181F18] hover:bg-[#FAF9F5] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-[#E5E1D8] pb-5 mb-5 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-mono font-bold text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full border border-[#C8E6C9]">
              RESERVATION DETAILS
            </span>
            <span className="text-xs font-mono text-[#5C665C]">Ref: #{booking.id.slice(0, 8)}</span>
            <span
              className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full uppercase ${
                isConfirmed
                  ? 'bg-emerald-100 text-emerald-800'
                  : isPending
                  ? 'bg-amber-100 text-amber-800'
                  : isCancelled
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {booking.status}
            </span>
          </div>

          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#181F18]">
            {booking.workspaceTitle || 'EnCourtyard Premium Workspace'}
          </h3>

          <p className="text-xs text-[#5C665C] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>{booking.locationName || 'Maruthi Plaza, Khairtabad, Hyderabad'}</span>
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
            {errorMsg}
          </div>
        )}

        {/* Live Status Clearance Thread */}
        <div className="mb-6 bg-[#FAF9F5] p-4 rounded-2xl border border-[#E5E1D8]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#5C665C]">
              Status Progression Thread
            </span>
            <span className="text-[10px] text-[#5C665C]">
              Updated live by Concierge
            </span>
          </div>
          <BookingStatusTracker
            status={booking.status}
            paymentStatus={booking.paymentStatus}
            createdAt={booking.createdAt}
            statusUpdatedAt={booking.statusUpdatedAt}
            utrNumber={utrNumber}
            adminNotes={booking.adminNotes}
          />
        </div>

        {/* Section 1: Time Slot & Schedule */}
        <div className="mb-6 space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#5C665C] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>Time Slot & Schedule</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E5E1D8]">
              <span className="text-[10px] text-[#5C665C] uppercase font-mono block">Date</span>
              <strong className="text-[#181F18] block mt-0.5">
                {booking.startDate}
                {booking.endDate && booking.endDate !== booking.startDate
                  ? ` to ${booking.endDate}`
                  : ''}
              </strong>
            </div>

            <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E5E1D8]">
              <span className="text-[10px] text-[#5C665C] uppercase font-mono block">Time Slot</span>
              <strong className="text-[#181F18] block mt-0.5 text-emerald-800 font-bold">
                {booking.startTime || '09:00 AM'} – {booking.endTime || '06:00 PM'}
              </strong>
            </div>

            <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E5E1D8]">
              <span className="text-[10px] text-[#5C665C] uppercase font-mono block">Plan / Type</span>
              <strong className="text-[#181F18] capitalize block mt-0.5">
                {booking.plan || booking.spaceType || 'Standard'}
              </strong>
            </div>

            <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E5E1D8]">
              <span className="text-[10px] text-[#5C665C] uppercase font-mono block">Attendees / Seats</span>
              <strong className="text-[#181F18] block mt-0.5">
                {booking.guests || 1} {booking.guests === 1 ? 'Guest' : 'Guests'}
              </strong>
            </div>
          </div>
        </div>

        {/* Section 2: Financial Settlement & Payment Status */}
        <div className="mb-6 space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#5C665C] flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>Payment & Financial Settlement</span>
          </h4>

          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E1D8] space-y-2.5 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-[#E5E1D8]">
              <span className="text-[#5C665C]">Payment Status:</span>
              <span
                className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                  isPaid
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {isPaid ? 'PAID & VERIFIED' : 'PENDING VERIFICATION'}
              </span>
            </div>

            <div className="flex justify-between items-center text-[#5C665C]">
              <span>Total Price / Amount:</span>
              <strong className="text-[#181F18] font-mono text-base font-bold">
                ₹{booking.totalAmount ? Number(booking.totalAmount).toLocaleString('en-IN') : '0'}
              </strong>
            </div>

            {utrNumber && (
              <div className="flex justify-between items-center text-[#5C665C]">
                <span>Transaction UTR Reference:</span>
                <strong className="font-mono text-[#2E7D32] bg-white px-2 py-0.5 rounded border border-[#E5E1D8]">
                  {utrNumber}
                </strong>
              </div>
            )}

            {proofUrl && (
              <div className="flex justify-between items-center text-[#5C665C] pt-1 border-t border-[#E5E1D8]">
                <span>Attached Payment Receipt:</span>
                <a
                  href={proofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2E7D32] font-bold inline-flex items-center gap-1 hover:underline text-xs"
                >
                  <span>View Uploaded Proof</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Member Contact Details */}
        <div className="mb-6 space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#5C665C] flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>Member & Contact Information</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E5E1D8]">
              <span className="text-[10px] text-[#5C665C] uppercase font-mono block">Reserved By</span>
              <strong className="text-[#181F18] block mt-0.5">{booking.fullName || 'Member'}</strong>
              {booking.companyName && (
                <span className="text-[#5C665C] text-[11px] block">{booking.companyName}</span>
              )}
            </div>

            <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E5E1D8] space-y-1">
              <span className="text-[10px] text-[#5C665C] uppercase font-mono block">Contact Points</span>
              {booking.email && (
                <div className="flex items-center gap-1.5 text-[#181F18]">
                  <Mail className="w-3 h-3 text-[#5C665C]" />
                  <span className="truncate">{booking.email}</span>
                </div>
              )}
              {booking.phone && (
                <div className="flex items-center gap-1.5 text-[#181F18]">
                  <Phone className="w-3 h-3 text-[#5C665C]" />
                  <span>{booking.phone}</span>
                </div>
              )}
            </div>
          </div>

          {customerNotes && (
            <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-xs space-y-1">
              <span className="text-[10px] text-blue-800 font-bold uppercase font-mono flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-700" />
                <span>User Note (Special Requests)</span>
              </span>
              <p className="text-blue-950 font-medium">{customerNotes}</p>
            </div>
          )}

          {adminNotes && (
            <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs space-y-1">
              <span className="text-[10px] text-[#1E5C23] font-bold uppercase font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>Admin & Concierge Note</span>
              </span>
              <p className="text-emerald-950 font-medium">{adminNotes}</p>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E5E1D8]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyId}
              className="px-3.5 py-2 rounded-xl bg-[#FAF9F5] hover:bg-[#F2EEE7] text-[#181F18] border border-[#E5E1D8] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {copiedId ? <Check className="w-3.5 h-3.5 text-[#2E7D32]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId ? 'Copied ID' : 'Copy ID'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#FAF9F5] hover:bg-[#F2EEE7] text-[#181F18] border border-[#E5E1D8] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Print Pass</span>
            </button>

            <a
              href={`https://wa.me/919908209993?text=Hello%20EnCourtyard%20Concierge%2C%20inquiry%20regarding%20booking%20ID%20${booking.id.slice(0, 8)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-[#FAF9F5] hover:bg-[#F2EEE7] text-[#25D366] border border-[#E5E1D8] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Concierge</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            {booking.status === 'PENDING' && (
              <button
                type="button"
                disabled={cancelling}
                onClick={handleCancel}
                className="px-4 py-2 rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>{cancelling ? 'Cancelling...' : 'Cancel Reservation'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold cursor-pointer transition-all shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
