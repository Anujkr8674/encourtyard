'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Plus,
  Search,
  Filter,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RotateCcw,
  Building2,
  Mail,
  Phone,
  Edit3,
  Eye,
  Check,
  X,
  FileText,
  User,
  Sparkles,
  Layers,
  Copy
} from 'lucide-react';
import { FeedbackModal } from '@/components/ui/FeedbackModal';

interface BookingRecord {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  workspaceId?: string;
  workspaceTitle: string;
  categoryName?: string;
  locationName?: string;
  fullName: string;
  companyName?: string | null;
  email: string;
  phone: string;
  plan: 'monthly' | 'daily' | 'hourly';
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  guests: number;
  totalAmount?: string | number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';
  adminNotes?: string | null;
  statusUpdatedAt?: string | null;
  notesUpdatedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;

  // Selected Booking for Edit Modal
  const [editingBooking, setEditingBooking] = useState<BookingRecord | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<BookingRecord['status']>('PENDING');
  const [completionType, setCompletionType] = useState<'instant' | 'maintenance'>('maintenance');
  const [adminNotesInput, setAdminNotesInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);

  // Selected Booking for Details Drawer
  const [viewingBooking, setViewingBooking] = useState<BookingRecord | null>(null);

  // Feedback Modal State
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

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch Bookings from Live API
  const fetchBookings = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await fetch('/api/admin/bookings', { cache: 'no-store' });
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
    }
  };

  useEffect(() => {
    fetchBookings();
    
    // Auto-refresh using polling every 5 seconds
    const intervalId = setInterval(() => {
      fetchBookings(true);
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Filter Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Status filter
      if (statusFilter !== 'ALL' && b.status !== statusFilter) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = b.id.toLowerCase().includes(q);
        const matchesName = b.fullName.toLowerCase().includes(q);
        const matchesEmail = b.email.toLowerCase().includes(q);
        const matchesCompany = b.companyName?.toLowerCase().includes(q);
        const matchesSpace = b.workspaceTitle.toLowerCase().includes(q);
        const matchesPhone = b.phone.toLowerCase().includes(q);
        if (!matchesId && !matchesName && !matchesEmail && !matchesCompany && !matchesSpace && !matchesPhone) {
          return false;
        }
      }
      return true;
    });
  }, [bookings, statusFilter, searchQuery]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Pagination Calculations
  const totalPages = Math.ceil(filteredBookings.length / rowsPerPage);
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredBookings.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredBookings, currentPage]);

  // Status Counts
  const counts = useMemo(() => {
    return {
      all: bookings.length,
      pending: bookings.filter((b) => b.status === 'PENDING').length,
      confirmed: bookings.filter((b) => b.status === 'CONFIRMED').length,
      completed: bookings.filter((b) => b.status === 'COMPLETED').length,
      cancelled: bookings.filter((b) => b.status === 'CANCELLED').length,
    };
  }, [bookings]);

  // Open Edit Status Modal
  const handleOpenEdit = (bk: BookingRecord) => {
    setEditingBooking(bk);
    setSelectedStatus(bk.status);
    setCompletionType('maintenance');
    setAdminNotesInput(bk.adminNotes || '');
  };

  // Submit Status Update
  const handleSaveStatus = async () => {
    if (!editingBooking) return;
    try {
      setIsUpdating(true);
      setUpdateProgress(0);

      const progressInterval = setInterval(() => {
        setUpdateProgress(prev => {
          if (prev >= 90) return prev;
          return prev + 15;
        });
      }, 150);

      const res = await fetch(`/api/admin/bookings/${editingBooking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: selectedStatus,
          completionType: selectedStatus === 'COMPLETED' ? completionType : undefined,
          adminNotes: adminNotesInput.trim() || null,
        }),
      });

      clearInterval(progressInterval);
      setUpdateProgress(100);
      
      // Wait for progress animation to complete visually
      await new Promise(r => setTimeout(r, 400));

      const data = await res.json();
      if (res.ok && data.success) {
        // Update local state
        setBookings((prev) =>
          prev.map((b) => (b.id === editingBooking.id ? data.booking : b))
        );
        setEditingBooking(null);
        setFeedback({
          isOpen: true,
          type: 'success',
          title: 'Booking Status Updated',
          message: `Booking ${editingBooking.id} is now ${selectedStatus}. Notification emails dispatched.`,
        });
      } else {
        setFeedback({
          isOpen: true,
          type: 'error',
          title: 'Update Failed',
          message: data.error || 'Failed to update booking status.',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating status';
      setFeedback({
        isOpen: true,
        type: 'error',
        title: 'Network Error',
        message: msg,
      });
    } finally {
      setIsUpdating(false);
      setTimeout(() => setUpdateProgress(0), 300);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-16 text-[#181F18]">
      
      {/* 1. Top Header & Stats Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E3EBE3] text-[#2E7D32] text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <span>Reservation Control Center</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18]">
            Workspace & Desk Bookings
          </h1>
          <p className="text-xs sm:text-sm text-[#5C665C]">
            Live schedule management, customer status updates with timestamped notes, and automated dual-email dispatch.
          </p>
        </div>

        <button
          onClick={() => fetchBookings()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-neutral-50 text-[#181F18] border border-[#E5E1D8] text-xs font-bold shadow-xs transition-all cursor-pointer self-start sm:self-center"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#2E7D32]" />
          <span>Refresh Bookings</span>
        </button>
      </div>

      {/* 2. Stats Pill Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'ALL'
              ? 'bg-[#263626] text-white border-[#263626] shadow-sm'
              : 'bg-white hover:bg-[#FAF9F5] border-[#E5E1D8] text-[#181F18]'
          }`}
        >
          <span className="text-[10px] uppercase font-mono block font-semibold opacity-80">Total Reservations</span>
          <span className="text-xl font-bold font-serif">{counts.all}</span>
        </button>

        <button
          onClick={() => setStatusFilter('PENDING')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'PENDING'
              ? 'bg-[#E65100] text-white border-[#E65100] shadow-sm'
              : 'bg-white hover:bg-[#FAF9F5] border-[#E5E1D8] text-[#181F18]'
          }`}
        >
          <span className="text-[10px] uppercase font-mono block font-semibold text-amber-600">Pending Review</span>
          <span className="text-xl font-bold font-serif">{counts.pending}</span>
        </button>

        <button
          onClick={() => setStatusFilter('CONFIRMED')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'CONFIRMED'
              ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-sm'
              : 'bg-white hover:bg-[#FAF9F5] border-[#E5E1D8] text-[#181F18]'
          }`}
        >
          <span className="text-[10px] uppercase font-mono block font-semibold text-emerald-700">Confirmed Active</span>
          <span className="text-xl font-bold font-serif">{counts.confirmed}</span>
        </button>

        <button
          onClick={() => setStatusFilter('COMPLETED')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'COMPLETED'
              ? 'bg-[#1565C0] text-white border-[#1565C0] shadow-sm'
              : 'bg-white hover:bg-[#FAF9F5] border-[#E5E1D8] text-[#181F18]'
          }`}
        >
          <span className="text-[10px] uppercase font-mono block font-semibold text-blue-700">Completed</span>
          <span className="text-xl font-bold font-serif">{counts.completed}</span>
        </button>

        <button
          onClick={() => setStatusFilter('CANCELLED')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'CANCELLED'
              ? 'bg-[#C62828] text-white border-[#C62828] shadow-sm'
              : 'bg-white hover:bg-[#FAF9F5] border-[#E5E1D8] text-[#181F18]'
          }`}
        >
          <span className="text-[10px] uppercase font-mono block font-semibold text-red-600">Cancelled</span>
          <span className="text-xl font-bold font-serif">{counts.cancelled}</span>
        </button>
      </div>

      {/* 3. Search & Quick Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E5E1D8] shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#738273] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Host, Company, Email, Ref ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] text-xs text-[#181F18] placeholder-[#8A968A] focus:outline-none focus:border-[#2E7D32]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {(['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab
                  ? 'bg-[#2E7D32] text-white font-bold'
                  : 'text-[#5C665C] hover:bg-[#FAF9F5] hover:text-[#181F18]'
              }`}
            >
              {tab.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Live Bookings Table */}
      <div className="bg-white border border-[#E5E1D8] rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-[#2E7D32] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-serif text-sm text-[#5C665C]">Loading Live Reservations...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FAF9F5] text-[#5C665C] flex items-center justify-center mx-auto border border-[#E5E1D8]">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#181F18]">No Reservations Found</h3>
            <p className="text-xs text-[#5C665C]">
              {searchQuery ? 'Try adjusting your search filters.' : 'No bookings matching this status category.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-[#E5E1D8] text-[#5C665C] font-mono uppercase text-[11px]">
                  <th className="py-3.5 px-4 font-bold">Booking Ref</th>
                  <th className="py-3.5 px-4 font-bold">Workspace & Category</th>
                  <th className="py-3.5 px-4 font-bold">Host & Organization</th>
                  <th className="py-3.5 px-4 font-bold">Schedule (From → To)</th>
                  <th className="py-3.5 px-4 text-center font-bold">Seats</th>
                  <th className="py-3.5 px-4 font-bold">Amount</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold">Admin Notes & Timestamp</th>
                  <th className="py-3.5 px-4 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1D8]/60">
                {paginatedBookings.map((bk) => (
                  <tr key={bk.id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                    {/* Ref ID */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-mono font-bold text-[#181F18]">
                        <span>{bk.id}</span>
                        <button
                          onClick={() => handleCopy(bk.id)}
                          className="text-[#738273] hover:text-[#2E7D32] transition-colors cursor-pointer"
                          title="Copy Booking ID"
                        >
                          {copiedId === bk.id ? <Check className="w-3.5 h-3.5 text-[#2E7D32]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <span className="text-[10px] text-[#738273] block mt-0.5">
                        {new Date(bk.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Workspace */}
                    <td className="py-3.5 px-4">
                      <strong className="text-[#181F18] font-bold block max-w-[200px] truncate" title={bk.workspaceTitle}>
                        {bk.workspaceTitle}
                      </strong>
                      <span className="text-[10px] text-[#2E7D32] font-mono font-semibold uppercase">
                        {bk.categoryName || 'Sanctuary'}
                      </span>
                    </td>

                    {/* Host & Organization */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#181F18]">{bk.fullName}</div>
                      {bk.companyName && (
                        <span className="text-[10px] text-[#5C665C] block font-medium">
                          {bk.companyName}
                        </span>
                      )}
                      <span className="text-[10px] text-[#738273] block">
                        {bk.email} • {bk.phone}
                      </span>
                    </td>

                    {/* Schedule */}
                    <td className="py-3.5 px-4 min-w-[150px] whitespace-nowrap">
                      <span className="text-[#181F18] font-medium block text-xs">
                        {bk.startDate} ({bk.startTime})
                      </span>
                      <span className="text-[#5C665C] text-[11px] block mt-0.5">
                        → {bk.endDate} ({bk.endTime})
                      </span>
                      <span className="text-[10px] text-[#E65100] font-mono capitalize font-bold">
                        {bk.plan} plan
                      </span>
                    </td>

                    {/* Seats */}
                    <td className="py-3.5 px-4 text-center font-bold text-[#181F18]">
                      {bk.guests} Pax
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-bold text-[#2E7D32]">
                      {bk.totalAmount || 'Flexible'}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider ${
                          bk.status === 'CONFIRMED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : bk.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : bk.status === 'COMPLETED'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {bk.status === 'CONFIRMED' && <CheckCircle2 className="w-3 h-3" />}
                        {bk.status === 'PENDING' && <Clock className="w-3 h-3" />}
                        {bk.status === 'COMPLETED' && <Check className="w-3 h-3" />}
                        {bk.status === 'CANCELLED' && <XCircle className="w-3 h-3" />}
                        <span>{bk.status}</span>
                      </span>
                    </td>

                    {/* Admin Notes & Timestamp */}
                    <td className="py-3.5 px-4 min-w-[220px]">
                      {bk.adminNotes ? (
                        <div>
                          <p className="text-[#263626] font-medium line-clamp-2 text-[11px] leading-tight" title={bk.adminNotes}>
                            {bk.adminNotes}
                          </p>
                          {bk.statusUpdatedAt && (
                            <span className="text-[9px] text-[#738273] font-mono block mt-0.5">
                              Updated: {new Date(bk.statusUpdatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[#9EA89E] italic text-[11px]">No notes added</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEdit(bk)}
                        className="px-2.5 py-1 rounded-lg bg-[#2E7D32] hover:bg-[#1E5C23] text-white font-semibold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Change Status</span>
                      </button>

                      <button
                        onClick={() => setViewingBooking(bk)}
                        className="px-2 py-1 rounded-lg bg-[#FAF9F5] hover:bg-[#EAE5DC] border border-[#E5E1D8] text-[#181F18] font-semibold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E1D8] bg-[#FAF9F5]">
                <div className="text-xs text-[#5C665C] font-medium">
                  Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredBookings.length)} of {filteredBookings.length} entries
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border border-[#E5E1D8] bg-white text-[#181F18] text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#EAE5DC] transition-colors cursor-pointer"
                  >
                    Prev
                  </button>
                  <span className="text-xs font-bold text-[#181F18] px-2">{currentPage} / {totalPages}</span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-[#E5E1D8] bg-white text-[#181F18] text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#EAE5DC] transition-colors cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. MODAL: CHANGE STATUS & ADD TIMESTAMPED NOTES                           */}
      {/* ========================================================================= */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none">
          <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto overflow-x-hidden bg-white rounded-3xl border border-[#E0DCD3] shadow-2xl p-6 sm:p-8 text-left animate-scaleUp font-sans custom-scrollbar">
            
            {/* Absolute Close Button */}
            <button
              onClick={() => setEditingBooking(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 text-[#5C665C] transition-colors cursor-pointer z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pb-4 border-b border-[#E5E1D8] pr-6">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#2E7D32] font-bold block">
                  MANAGE RESERVATION STATUS
                </span>
                <h3 className="font-serif text-xl font-bold text-[#181F18] pr-4">
                  Update Status for <span className="font-sans font-medium text-lg tracking-wide break-all">{editingBooking.id}</span>
                </h3>
                <p className="text-xs text-[#5C665C] mt-0.5">
                  Host: <strong>{editingBooking.fullName}</strong> • Space: {editingBooking.workspaceTitle}
                </p>
              </div>
            </div>

            <div className="space-y-4 py-5 text-xs">
              
              {/* Status Radio Tiles */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#181F18] block">
                  Select New Status <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSelectedStatus(st)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        selectedStatus === st
                          ? st === 'CONFIRMED'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold ring-2 ring-emerald-400/20'
                            : st === 'PENDING'
                            ? 'bg-amber-50 border-amber-500 text-amber-800 font-bold ring-2 ring-amber-400/20'
                            : st === 'COMPLETED'
                            ? 'bg-blue-50 border-blue-500 text-blue-800 font-bold ring-2 ring-blue-400/20'
                            : 'bg-red-50 border-red-500 text-red-800 font-bold ring-2 ring-red-400/20'
                          : 'bg-[#FAF9F5] border-[#E5E1D8] text-[#5C665C] hover:bg-white'
                      }`}
                    >
                      <span className="font-mono text-xs">{st}</span>
                      {selectedStatus === st && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
                
                {/* Sub-options for COMPLETED status */}
                {selectedStatus === 'COMPLETED' && (
                  <div className="mt-3 p-3 rounded-xl bg-blue-50 border border-blue-200 animate-fadeIn">
                    <label className="font-bold text-blue-900 block mb-2 text-[11px]">
                      Completion Mode <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-start gap-2 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="completionType" 
                          value="maintenance"
                          checked={completionType === 'maintenance'}
                          onChange={() => setCompletionType('maintenance')}
                          className="mt-0.5 accent-blue-600"
                        />
                        <div>
                          <span className="block font-bold text-blue-900 text-xs">Requires Maintenance (1Hr Buffer)</span>
                          <span className="block text-[10px] text-blue-700 leading-tight mt-0.5">Blocks the workspace for 1 hour after the booking ends before it becomes available again.</span>
                        </div>
                      </label>
                      <label className="flex items-start gap-2 cursor-pointer pt-2 border-t border-blue-100/50 group">
                        <input 
                          type="radio" 
                          name="completionType" 
                          value="instant"
                          checked={completionType === 'instant'}
                          onChange={() => setCompletionType('instant')}
                          className="mt-0.5 accent-blue-600"
                        />
                        <div>
                          <span className="block font-bold text-blue-900 text-xs">Instant Available</span>
                          <span className="block text-[10px] text-blue-700 leading-tight mt-0.5">Workspace is immediately open for new bookings on the public site.</span>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Notes */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#181F18] block">
                  Concierge / Admin Notes <span className="text-[11px] font-normal text-[#5C665C]">(Included in customer email & saved with timestamp)</span>
                </label>
                <textarea
                  rows={3}
                  value={adminNotesInput}
                  onChange={(e) => setAdminNotesInput(e.target.value)}
                  placeholder="e.g., Biometric access credentials dispatched, Level 2 conference room reserved, onboarding call at 10 AM..."
                  className="w-full p-3 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] text-xs text-[#181F18] placeholder-[#9EA89E] focus:outline-none focus:border-[#2E7D32] focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Automatic Email Notification notice */}
              <div className="p-3 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] text-[#1B5E20] text-[11px] flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                <span>
                  Updating this status will automatically dispatch an updated status email to the client's email ({editingBooking.email}{editingBooking.userEmail && editingBooking.userEmail !== editingBooking.email ? ` & ${editingBooking.userEmail}` : ''}).
                </span>
              </div>

            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#E5E1D8]">
              <button
                type="button"
                onClick={() => setEditingBooking(null)}
                className="px-4 py-2.5 rounded-xl bg-[#FAF9F5] hover:bg-[#EAE5DC] text-[#181F18] border border-[#E5E1D8] font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveStatus}
                disabled={isUpdating}
                className="px-6 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white font-bold text-xs shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-70 flex items-center gap-1.5"
              >
                <span>Save Status & Dispatch Emails</span>
              </button>
            </div>

            {/* Progress Overlay Modal */}
            {isUpdating && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-3xl p-6 text-center shadow-inner">
                <div className="w-full max-w-[260px] bg-white p-6 rounded-2xl border border-[#E5E1D8] shadow-2xl flex flex-col items-center animate-scaleUp">
                  <div className="w-12 h-12 rounded-full bg-[#E8F5E9] flex items-center justify-center mb-3">
                    <Mail className="w-6 h-6 text-[#2E7D32]" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#181F18] mb-1">Sending Emails...</h3>
                  <p className="text-[11px] text-[#5C665C] mb-5">Updating status & notifying client</p>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-[#EAE5DB] rounded-full h-1.5 mb-2 overflow-hidden shadow-inner">
                    <div 
                      className="bg-[#2E7D32] h-full transition-all duration-150 ease-out relative" 
                      style={{ width: `${updateProgress}%` }} 
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#2E7D32]">{updateProgress}%</span>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. DRAWER / MODAL: VIEW FULL BOOKING DETAILS                              */}
      {/* ========================================================================= */}
      {viewingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none">
          <div className="relative z-10 w-full max-w-xl bg-white rounded-3xl border border-[#E0DCD3] shadow-2xl p-6 sm:p-8 text-left animate-scaleUp font-sans max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between pb-4 border-b border-[#E5E1D8]">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#2E7D32] font-bold block">
                  RESERVATION DOSSIER
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#181F18]">
                  Booking {viewingBooking.id}
                </h3>
              </div>

              <button
                onClick={() => setViewingBooking(null)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-[#5C665C] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 py-5 text-xs">
              
              {/* Workspace Snapshot */}
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E1D8] space-y-1.5">
                <span className="text-[10px] uppercase font-mono text-[#5C665C] block">Workspace Property</span>
                <h4 className="font-serif text-base font-bold text-[#181F18]">{viewingBooking.workspaceTitle}</h4>
                <div className="flex items-center gap-2 text-[#5C665C]">
                  <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>{viewingBooking.locationName || 'Maruthi Plaza, Khairtabad'}</span>
                </div>
              </div>

              {/* Host & Contact Info */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white border border-[#E5E1D8]">
                <div>
                  <span className="text-[#5C665C] block text-[11px]">Primary Contact:</span>
                  <strong className="text-[#181F18] font-bold">{viewingBooking.fullName}</strong>
                </div>
                <div>
                  <span className="text-[#5C665C] block text-[11px]">Organization:</span>
                  <strong className="text-[#181F18] font-bold">{viewingBooking.companyName || 'Individual'}</strong>
                </div>
                <div>
                  <span className="text-[#5C665C] block text-[11px]">Email Address:</span>
                  <strong className="text-[#181F18] font-mono">{viewingBooking.email}</strong>
                </div>
                <div>
                  <span className="text-[#5C665C] block text-[11px]">Phone Number:</span>
                  <strong className="text-[#181F18] font-mono">{viewingBooking.phone}</strong>
                </div>
              </div>

              {/* Schedule Info */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E1D8]">
                <div>
                  <span className="text-[#5C665C] block text-[11px]">From Schedule:</span>
                  <strong className="text-[#181F18]">{viewingBooking.startDate} at {viewingBooking.startTime}</strong>
                </div>
                <div>
                  <span className="text-[#5C665C] block text-[11px]">To Schedule:</span>
                  <strong className="text-[#181F18]">{viewingBooking.endDate} at {viewingBooking.endTime}</strong>
                </div>
                <div>
                  <span className="text-[#5C665C] block text-[11px]">Rental Plan:</span>
                  <strong className="text-[#181F18] capitalize">{viewingBooking.plan} Plan</strong>
                </div>
                <div>
                  <span className="text-[#5C665C] block text-[11px]">Seat Count:</span>
                  <strong className="text-[#181F18]">{viewingBooking.guests} Dedicated Seats</strong>
                </div>
              </div>

              {/* Notes History */}
              {viewingBooking.adminNotes && (
                <div className="p-4 rounded-2xl bg-[#FFF8E1] border border-[#FFE082] space-y-1">
                  <span className="text-[10px] uppercase font-mono text-[#E65100] font-bold block">
                    Admin Notes (Visible to Customer)
                  </span>
                  <p className="text-[#5D4037]">{viewingBooking.adminNotes}</p>
                  {viewingBooking.statusUpdatedAt && (
                    <span className="text-[10px] text-[#738273] font-mono block pt-1">
                      Last Updated: {new Date(viewingBooking.statusUpdatedAt).toLocaleString()}
                    </span>
                  )}
                </div>
              )}

            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#E5E1D8]">
              <button
                type="button"
                onClick={() => setViewingBooking(null)}
                className="px-5 py-2 rounded-xl bg-[#FAF9F5] hover:bg-[#EAE5DC] text-[#181F18] border border-[#E5E1D8] font-bold text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const bk = viewingBooking;
                  setViewingBooking(null);
                  handleOpenEdit(bk);
                }}
                className="px-5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                Update Status
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 7. Feedback Modal */}
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
