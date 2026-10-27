'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarCheck2,
  Search,
  PlusCircle,
  Clock,
  Building2,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Sparkles,
  Ban,
  AlertTriangle,
  SlidersHorizontal,
  Filter,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useRealtimeBookings } from '@/lib/realtimeBookings';

interface BookingRecord {
  id: string;
  workspaceId?: string | null;
  workspaceTitle: string;
  categoryName?: string | null;
  locationName?: string | null;
  fullName: string;
  companyName?: string | null;
  email: string;
  phone: string;
  spaceType?: string | null;
  plan?: string | null;
  startDate: string;
  endDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  guests: number;
  totalAmount: number | null;
  status: string;
  paymentStatus: string;
  adminNotes?: string | null;
  statusUpdatedAt?: string | null;
  createdAt: string;
}

const DEFAULT_WORKSPACE_IMG =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80';

export default function UserBookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const statusCounts = React.useMemo(() => {
    return {
      ALL: bookings.length,
      CONFIRMED: bookings.filter((b) => (b.status || '').toUpperCase() === 'CONFIRMED').length,
      PENDING: bookings.filter((b) => (b.status || '').toUpperCase() === 'PENDING').length,
      COMPLETED: bookings.filter((b) => (b.status || '').toUpperCase() === 'COMPLETED').length,
      CANCELLED: bookings.filter((b) => {
        const norm = (b.status || '').toUpperCase();
        return norm === 'CANCELLED' || norm === 'CANCELED' || norm === 'REJECTED' || norm.includes('CANCEL');
      }).length,
    };
  }, [bookings]);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  const fetchBookings = async (silent: boolean = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await fetch('/api/bookings', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.bookings)) {
          setBookings(data.bookings);
        }
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      if (!silent) setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Realtime WebSockets: Update bookings data instantly without page refresh
  useRealtimeBookings(() => {
    fetchBookings(true);
  });

  // Reset page when search query or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

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

  // Helper to extract clean admin note/reason
  const getCleanNote = (notes?: string | null) => {
    if (!notes) return null;
    const match = notes.match(/Notes:\s*([^|]+)/i);
    if (match) return match[1].trim();
    if (!notes.includes('UTR:') && !notes.includes('Proof:')) return notes.trim();
    const parts = notes.split('|').map((p) => p.trim());
    const nonTech = parts.filter(
      (p) => !p.toLowerCase().startsWith('utr:') && !p.toLowerCase().startsWith('proof:')
    );
    return nonTech.length > 0 ? nonTech.join(' • ') : null;
  };

  // Filter bookings with robust status checking
  const filteredBookings = bookings.filter((b) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (b.workspaceTitle && b.workspaceTitle.toLowerCase().includes(q)) ||
      (b.id && b.id.toLowerCase().includes(q)) ||
      (b.startDate && b.startDate.includes(q)) ||
      (b.fullName && b.fullName.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    const norm = (b.status || '').toUpperCase();
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'CONFIRMED') return norm === 'CONFIRMED';
    if (statusFilter === 'PENDING') return norm === 'PENDING';
    if (statusFilter === 'COMPLETED') return norm === 'COMPLETED';
    if (statusFilter === 'CANCELLED') {
      return norm === 'CANCELLED' || norm === 'CANCELED' || norm === 'REJECTED' || norm.includes('CANCEL');
    }

    return true;
  });

  return (
    <div
      className="space-y-5 max-w-6xl mx-auto text-[#181F18] animate-fadeIn text-left"
      style={{ fontFamily: "Tahoma, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-[#E5E1D8] p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-mono font-bold uppercase tracking-wider mb-1.5">
            <CalendarCheck2 className="w-3.5 h-3.5" />
            <span>Member Workspace Bookings</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18]">
            My Bookings
          </h1>
          <p className="text-xs text-[#5C665C] mt-0.5">
            Review your past & upcoming reservations, live status, and booking passes.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleRefresh}
            className={`p-2 rounded-xl bg-[#FAF9F5] hover:bg-[#F2EEE7] text-[#181F18] border border-[#E5E1D8] transition-all cursor-pointer ${
              refreshing ? 'animate-spin' : ''
            }`}
            title="Refresh bookings"
          >
            <RefreshCw className="w-4 h-4 text-[#2E7D32]" />
          </button>
          <Link
            href="/book-space"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Book Workspace</span>
          </Link>
        </div>
      </div>

      {/* Search & Filter Bar (Mobile: Search Input Left + Filters Button Right; Desktop: Side-by-side) */}
      <div className="bg-white rounded-2xl border border-[#E5E1D8] p-3 shadow-2xs">
        {/* Mobile View: Single Row with Search Input on Left, Filter Button on Right */}
        <div className="flex md:hidden items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-[#5C665C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by space name, category, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] text-xs text-[#181F18] placeholder-[#717E71] focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:bg-white"
            />
          </div>

          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#182618] text-white text-xs font-bold shadow-xs active:scale-95 shrink-0 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {statusFilter !== 'ALL' && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>
        </div>

        {/* Mobile Active Filter Bar (when not ALL) */}
        {statusFilter !== 'ALL' && (
          <div className="flex md:hidden items-center justify-between pt-2 mt-2 border-t border-[#E5E1D8] text-xs">
            <span className="text-[#5C665C] text-[11px]">
              Filtered by:{' '}
              <strong className="text-[#2E7D32] uppercase font-mono font-bold">
                {statusFilter}
              </strong>
            </span>
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className="text-[#2E7D32] font-bold text-[11px] hover:underline cursor-pointer"
            >
              Reset to All
            </button>
          </div>
        )}

        {/* Desktop View: Side-by-Side Search Input & Horizontal Filter Tabs */}
        <div className="hidden md:flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#5C665C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search all your bookings by workspace name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] text-xs text-[#181F18] placeholder-[#717E71] focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {[
              { id: 'ALL', label: 'All Bookings' },
              { id: 'CONFIRMED', label: 'Confirmed' },
              { id: 'PENDING', label: 'Under Review' },
              { id: 'COMPLETED', label: 'Completed' },
              { id: 'CANCELLED', label: 'Cancelled' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-[#182618] text-white shadow-xs'
                    : 'bg-[#FAF9F5] text-[#5C665C] border border-[#E5E1D8] hover:bg-[#F2EEE7] hover:text-[#181F18]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Slide-in Right Sidebar Drawer: Exactly like reference image */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden select-none">
          {/* Backdrop overlay with blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
            onClick={() => setMobileFilterOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 z-50">
            <div className="w-screen max-w-sm sm:max-w-md bg-[#FAF9F5] border-l border-[#E5E1D8] shadow-2xl flex flex-col h-full animate-slideLeft">
              {/* Drawer Header (Matching Image 2 Reference) */}
              <div className="p-5 border-b border-[#E5E1D8] bg-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <SlidersHorizontal className="w-5 h-5 text-[#2E7D32]" />
                  <h2 className="font-serif text-xl font-bold text-[#181F18]">Filters</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 rounded-full hover:bg-neutral-100 text-[#5C665C] hover:text-[#181F18] transition-colors cursor-pointer"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="p-5 space-y-4 overflow-y-auto flex-1">
                {/* Status Category Section */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#738273] font-bold block">
                    BOOKING STATUS
                  </span>

                  <div className="space-y-2">
                    {[
                      {
                        id: 'ALL',
                        label: 'All Bookings',
                        desc: 'All reservations in dossier',
                        count: statusCounts.ALL,
                      },
                      {
                        id: 'CONFIRMED',
                        label: 'Confirmed Pass Active',
                        desc: 'Workspace pass ready & active',
                        count: statusCounts.CONFIRMED,
                      },
                      {
                        id: 'PENDING',
                        label: 'Under Verification',
                        desc: 'Awaiting review or payment',
                        count: statusCounts.PENDING,
                      },
                      {
                        id: 'COMPLETED',
                        label: 'Session Completed',
                        desc: 'Finished workspace pass',
                        count: statusCounts.COMPLETED,
                      },
                      {
                        id: 'CANCELLED',
                        label: 'Cancelled Reservations',
                        desc: 'Terminated or rejected passes',
                        count: statusCounts.CANCELLED,
                      },
                    ].map((tab) => {
                      const isSelected = statusFilter === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setStatusFilter(tab.id)}
                          className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-white border-[#2E7D32] shadow-sm ring-1 ring-[#2E7D32]'
                              : 'bg-white border-[#E5E1D8] hover:border-[#D5CFBF] hover:bg-[#FDFCF9]'
                          }`}
                        >
                          <div className="flex items-start gap-3 min-w-0 flex-1">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                isSelected
                                  ? 'border-[#2E7D32] bg-[#2E7D32] text-white'
                                  : 'border-[#A3AEA3] bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <span
                                className={`block text-xs font-bold leading-tight ${
                                  isSelected ? 'text-[#181F18]' : 'text-[#2C382C]'
                                }`}
                              >
                                {tab.label}
                              </span>
                              <span className="block text-[11px] text-[#717E71] mt-0.5 truncate">
                                {tab.desc}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`ml-2 text-[11px] font-mono px-2.5 py-0.5 rounded-full border shrink-0 ${
                              isSelected
                                ? 'bg-[#E8F5E9] text-[#1B5E20] border-[#A5D6A7] font-bold'
                                : 'bg-[#FAF9F5] text-[#5C665C] border-[#E5E1D8]'
                            }`}
                          >
                            {tab.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Filter Summary Card */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#E5E1D8] text-xs space-y-1">
                  <span className="text-[10px] uppercase font-mono text-[#2E7D32] font-bold block">
                    ACTIVE SELECTION
                  </span>
                  <p className="text-[#5C665C] text-[11px]">
                    Showing <strong className="text-[#181F18] font-mono">{filteredBookings.length}</strong> matching bookings for{' '}
                    <strong className="text-[#2E7D32] capitalize">
                      {statusFilter === 'ALL' ? 'all statuses' : statusFilter.toLowerCase()}
                    </strong>.
                  </p>
                </div>
              </div>

              {/* Drawer Footer (Pinned at bottom, matching Image 2 reference) */}
              <div className="p-4 border-t border-[#E5E1D8] bg-white space-y-2">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#121E12] hover:bg-[#1C2E1C] active:scale-[0.98] text-white font-bold text-xs shadow-md transition-all text-center cursor-pointer"
                >
                  Show {filteredBookings.length} {filteredBookings.length === 1 ? 'Booking' : 'Bookings'}
                </button>

                {statusFilter !== 'ALL' && (
                  <button
                    type="button"
                    onClick={() => setStatusFilter('ALL')}
                    className="w-full text-center text-xs font-semibold text-[#5C665C] hover:text-[#2E7D32] hover:underline cursor-pointer py-1"
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bookings List (Flipkart Order Card Row Structure) */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-[#E5E1D8] py-16 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-[#2E7D32] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono uppercase tracking-wider text-[#5C665C]">
            Loading Your Bookings...
          </span>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E1D8] py-12 px-4 text-center space-y-3">
          <Building2 className="w-10 h-10 mx-auto text-[#5C665C]/40" />
          <h3 className="text-base font-bold text-[#181F18]">No bookings found</h3>
          <p className="text-xs text-[#5C665C]">
            {searchQuery || statusFilter !== 'ALL'
              ? 'No reservations matched your filter criteria.'
              : 'You have not reserved any workspace yet.'}
          </p>
          <div className="pt-2">
            <Link
              href="/book-space"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2E7D32] text-white text-xs font-bold hover:bg-[#1B5E20] transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Explore & Book Workspace</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {(() => {
            const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE) || 1;
            const paginatedBookings = filteredBookings.slice(
              (currentPage - 1) * ITEMS_PER_PAGE,
              currentPage * ITEMS_PER_PAGE
            );

            return (
              <>
                {paginatedBookings.map((booking) => {
                  const norm = (booking.status || '').toUpperCase();
                  const isCancelled =
                    norm === 'CANCELLED' ||
                    norm === 'CANCELED' ||
                    norm === 'REJECTED' ||
                    norm.includes('CANCEL');
                  const isCompleted = norm === 'COMPLETED';
                  const isConfirmed = norm === 'CONFIRMED';
                  const isPending = norm === 'PENDING';

                  const formattedDate = formatDate(
                    booking.statusUpdatedAt || booking.startDate || booking.createdAt
                  );
                  const adminNoteSnippet = getCleanNote(booking.adminNotes);

                  return (
                    <Link
                      key={booking.id}
                      href={`/user/bookings/${booking.id}`}
                      className={`block bg-white rounded-2xl border transition-all p-4 sm:p-5 text-left group ${
                        isCancelled
                          ? 'border-rose-200 hover:border-rose-400 bg-rose-50/20'
                          : 'border-[#E5E1D8] hover:border-[#2E7D32]/60 hover:shadow-md'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Left Column: Space Photo & Title & Subtitle Info */}
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] overflow-hidden shrink-0 relative">
                            <img
                              src={DEFAULT_WORKSPACE_IMG}
                              alt={booking.workspaceTitle}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>

                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-sm sm:text-base text-[#181F18] group-hover:text-[#2E7D32] transition-colors truncate">
                                {booking.workspaceTitle}
                              </h3>
                              {isCancelled && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-rose-100 text-rose-800 border border-rose-300 shrink-0">
                                  <Ban className="w-3 h-3 text-rose-600" />
                                  <span>CANCELLED</span>
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-[#5C665C]">
                              Plan: <span className="text-[#181F18] font-medium capitalize">{booking.plan || 'Standard'}</span> • Attendees: <span className="text-[#181F18] font-medium">{booking.guests || 1} Person(s)</span>
                            </p>

                            <p className="text-xs text-[#5C665C]">
                              Time Slot: <span className="text-emerald-800 font-bold">{booking.startTime || '09:00 AM'} – {booking.endTime || '06:00 PM'}</span>
                            </p>

                            <p className="text-[11px] text-[#717E71] font-mono">
                              Date: {booking.startDate} {booking.endDate && booking.endDate !== booking.startDate ? `to ${booking.endDate}` : ''} • Ref: #{booking.id.slice(0, 8).toUpperCase()}
                            </p>

                            {/* Display Admin Note / Reason Snippet if present */}
                            {adminNoteSnippet && (
                              <div
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium mt-1.5 border max-w-full ${
                                  isCancelled
                                    ? 'bg-rose-100/80 text-rose-900 border-rose-300'
                                    : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                                }`}
                              >
                                <span className="font-bold shrink-0">
                                  {isCancelled ? 'Cancellation Reason:' : 'Concierge Note:'}
                                </span>
                                <span className="truncate">&ldquo;{adminNoteSnippet}&rdquo;</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Middle Column: Price */}
                        <div className="md:w-32 text-left md:text-center shrink-0">
                          <span className="text-base sm:text-lg font-bold text-[#181F18] font-mono block">
                            ₹{(booking.totalAmount || 0).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-[#5C665C]">
                            {booking.paymentStatus === 'PAID' ? 'Total Paid' : 'Payable'}
                          </span>
                        </div>

                        {/* Right Column: Status Bullet & Action Link */}
                        <div className="md:w-64 text-left md:text-right shrink-0 space-y-1">
                          <div className="flex items-center md:justify-end gap-1.5">
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
                            <strong className={`text-xs sm:text-sm ${isCancelled ? 'text-rose-700' : 'text-[#181F18]'}`}>
                              {isConfirmed
                                ? `Confirmed on ${formattedDate}`
                                : isCompleted
                                ? `Completed on ${formattedDate}`
                                : isPending
                                ? 'Under Review'
                                : `Cancelled on ${formattedDate}`}
                            </strong>
                          </div>

                          <p className={`text-xs ${isCancelled ? 'text-rose-600' : 'text-[#5C665C]'}`}>
                            {isConfirmed
                              ? 'Your workspace pass is active & ready'
                              : isCompleted
                              ? 'Session completed successfully'
                              : isPending
                              ? 'Payment verification in progress'
                              : 'This reservation was cancelled.'}
                          </p>

                          <div className="pt-1">
                            <span className={`text-xs font-bold group-hover:underline inline-flex items-center gap-1 ${isCancelled ? 'text-rose-700' : 'text-[#2E7D32]'}`}>
                              <span>★ View Booking Details</span>
                              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}

                {/* Pagination Bar (After 15 rows of data) */}
                {totalPages > 1 && (
                  <div className="bg-white rounded-2xl border border-[#E5E1D8] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs mt-3">
                    <span className="text-xs text-[#5C665C] font-mono">
                      Showing <strong className="text-[#181F18]">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong>–
                      <strong className="text-[#181F18]">{Math.min(currentPage * ITEMS_PER_PAGE, filteredBookings.length)}</strong> of{' '}
                      <strong className="text-[#181F18]">{filteredBookings.length}</strong> Bookings
                    </span>

                    <div className="flex items-center gap-1.5 self-center sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 rounded-xl border border-[#E5E1D8] text-xs font-semibold text-[#181F18] hover:bg-[#FAF9F5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        Previous
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                            currentPage === page
                              ? 'bg-[#2E7D32] text-white shadow-xs'
                              : 'bg-[#FAF9F5] text-[#5C665C] border border-[#E5E1D8] hover:bg-[#F2EEE7] hover:text-[#181F18]'
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 rounded-xl border border-[#E5E1D8] text-xs font-semibold text-[#181F18] hover:bg-[#FAF9F5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
