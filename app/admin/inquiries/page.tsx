'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Search,
  Filter,
  RefreshCw,
  Calendar,
  Mail,
  Phone,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Eye,
  ExternalLink,
  User,
  Sparkles,
  ArrowUpDown,
  X,
  FileText,
  Save,
  Check
} from 'lucide-react';

interface ContactInquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  company: string | null;
  spaceInterest: string | null;
  tourDate: string | null;
  message: string | null;
  status: 'PENDING' | 'CONTACTED' | 'RESOLVED' | 'ARCHIVED';
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
}

interface StatsMeta {
  total: number;
  pending: number;
  contacted: number;
  resolved: number;
}

const SPACE_OPTIONS = [
  { value: 'ALL', label: 'All Space Interests' },
  { value: 'day-pass', label: 'Day Pass' },
  { value: 'conference-hall', label: 'Conference Hall' },
  { value: 'meeting-room', label: 'Meeting Rooms' },
  { value: 'private-office', label: 'Private Office' },
  { value: 'shared-office', label: 'Shared Office' },
  { value: 'podcast-office', label: 'Podcast Office' },
  { value: 'others', label: 'Others' },
];

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'CONTACTED' | 'RESOLVED' | 'ARCHIVED'>('ALL');
  const [spaceFilter, setSpaceFilter] = useState('ALL');
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
    hasPrev: false,
    hasNext: false,
  });
  const [stats, setStats] = useState<StatsMeta>({
    total: 0,
    pending: 0,
    contacted: 0,
    resolved: 0,
  });

  // Modal detail view
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [adminNotesDraft, setAdminNotesDraft] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSavedSuccess, setNotesSavedSuccess] = useState(false);

  // Fetch inquiries from API
  const fetchInquiries = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '15', // Exactly 15 rows per page as requested
        status: statusFilter,
        spaceInterest: spaceFilter,
      });

      if (search.trim()) {
        params.append('search', search.trim());
      }

      const res = await fetch(`/api/admin/inquiries?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setInquiries(data.inquiries || []);
        if (data.pagination) setPagination(data.pagination);
        if (data.stats) setStats(data.stats);
      } else {
        console.error('Failed to load inquiries:', data.error);
      }
    } catch (err) {
      console.error('Fetch inquiries error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, statusFilter, spaceFilter, search]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // Reset to page 1 on search or filter change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusTabChange = (newStatus: 'ALL' | 'PENDING' | 'CONTACTED' | 'RESOLVED' | 'ARCHIVED') => {
    setStatusFilter(newStatus);
    setPage(1);
  };

  const handleSpaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSpaceFilter(e.target.value);
    setPage(1);
  };

  // Quick status update
  const handleQuickStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus as any } : item))
        );
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
        // Refresh counts in background
        fetchInquiries(true);
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  // Save notes in modal
  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    setSavingNotes(true);
    setNotesSavedSuccess(false);

    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedInquiry.id, adminNotes: adminNotesDraft }),
      });
      const data = await res.json();
      if (data.success) {
        setNotesSavedSuccess(true);
        setSelectedInquiry((prev) => (prev ? { ...prev, adminNotes: adminNotesDraft } : null));
        setInquiries((prev) =>
          prev.map((item) => (item.id === selectedInquiry.id ? { ...item, adminNotes: adminNotesDraft } : item))
        );
        setTimeout(() => setNotesSavedSuccess(false), 2500);
      } else {
        alert(data.error || 'Failed to save notes');
      }
    } catch (err) {
      console.error('Save notes error:', err);
    } finally {
      setSavingNotes(false);
    }
  };

  // Delete an inquiry
  const handleDeleteInquiry = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete the inquiry from "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/inquiries?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(null);
        }
        fetchInquiries(true);
      } else {
        alert(data.error || 'Failed to delete inquiry');
      }
    } catch (err) {
      console.error('Delete inquiry error:', err);
    }
  };

  // Open modal and prepopulate notes
  const openModal = (inq: ContactInquiry) => {
    setSelectedInquiry(inq);
    setAdminNotesDraft(inq.adminNotes || '');
    setNotesSavedSuccess(false);
  };

  // Format date helper
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // Status badge config
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          label: 'Pending / New',
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          dot: 'bg-amber-500',
        };
      case 'CONTACTED':
        return {
          label: 'Contacted',
          bg: 'bg-blue-50 text-blue-800 border-blue-300',
          dot: 'bg-blue-500',
        };
      case 'RESOLVED':
        return {
          label: 'Resolved',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500',
        };
      case 'ARCHIVED':
        return {
          label: 'Archived',
          bg: 'bg-gray-100 text-gray-700 border-gray-300',
          dot: 'bg-gray-400',
        };
      default:
        return {
          label: status,
          bg: 'bg-gray-50 text-gray-800 border-gray-200',
          dot: 'bg-gray-400',
        };
    }
  };

  // Space badge color helper
  const getSpaceBadge = (space: string | null) => {
    const s = (space || '').toLowerCase();
    if (s.includes('day-pass')) {
      return { label: 'Day Pass', cls: 'bg-amber-50 text-amber-900 border-amber-200 font-semibold' };
    }
    if (s.includes('conference')) {
      return { label: 'Conference Hall', cls: 'bg-purple-50 text-purple-900 border-purple-200 font-semibold' };
    }
    if (s.includes('meeting')) {
      return { label: 'Meeting Rooms', cls: 'bg-blue-50 text-blue-900 border-blue-200 font-semibold' };
    }
    if (s.includes('private')) {
      return { label: 'Private Office', cls: 'bg-emerald-50 text-emerald-900 border-emerald-200 font-semibold' };
    }
    if (s.includes('shared')) {
      return { label: 'Shared Office', cls: 'bg-teal-50 text-teal-900 border-teal-200 font-semibold' };
    }
    if (s.includes('podcast')) {
      return { label: 'Podcast Office', cls: 'bg-rose-50 text-rose-900 border-rose-200 font-semibold' };
    }
    return {
      label: space ? space.replace(/-/g, ' ') : 'General Space',
      cls: 'bg-gray-50 text-gray-800 border-gray-200 font-medium',
    };
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* 1. Page Header with Title & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E0DCD3] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-[#2E7D32] border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" />
              Live Inquiries Database
            </span>
            <span className="text-xs text-[#5C665C] font-mono">
              15 Rows Per Page
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18] tracking-tight mt-1">
            Contact & Tour Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-[#5C665C]">
            View and manage guest submissions from the public Contact & Tour Booking form.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => fetchInquiries(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF9F5] hover:bg-[#EAE5DB] border border-[#DDD7CA] text-xs font-bold text-[#181F18] transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#2E7D32] ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <Link
            href="/contact"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Test Public Form</span>
          </Link>
        </div>
      </div>

      {/* 2. KPI Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Inquiries */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E0DCD3] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase font-bold text-[#5C665C] block">
              Total Inquiries
            </span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18] mt-0.5 block">
              {stats.total}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#2E7D32] border border-emerald-200 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        {/* Pending / New (Needs Action) */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200 shadow-xs flex items-center justify-between bg-gradient-to-br from-white to-amber-50/40">
          <div>
            <span className="text-[11px] font-mono uppercase font-bold text-amber-800 block">
              Pending / Action Needed
            </span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-900 mt-0.5 block">
              {stats.pending}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Contacted */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-blue-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase font-bold text-blue-800 block">
              Contacted / In Progress
            </span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-blue-900 mt-0.5 block">
              {stats.contacted}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-800 border border-blue-200 flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5" />
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E0DCD3] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase font-bold text-emerald-800 block">
              Resolved & Booked
            </span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-900 mt-0.5 block">
              {stats.resolved}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Search Bar, Space Filter, and Status Tabs */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E0DCD3] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#738273] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by name, email, phone, company, or message..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F5] border border-[#DDD7CA] rounded-xl text-xs sm:text-sm text-[#181F18] focus:bg-white focus:outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Space Interest Dropdown Filter */}
          {/* <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#5C665C]" />
            <select
              value={spaceFilter}
              onChange={handleSpaceChange}
              className="px-3.5 py-2.5 bg-[#FAF9F5] border border-[#DDD7CA] rounded-xl text-xs sm:text-sm font-semibold text-[#181F18] focus:bg-white focus:outline-none focus:border-[#2E7D32] transition-colors cursor-pointer"
            >
              {SPACE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div> */}
        </div>

        {/* Status Pills Tab Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-[#EAE5DB]">
          {[
            { key: 'ALL', label: 'All Inquiries', count: stats.total },
            { key: 'PENDING', label: 'Pending', count: stats.pending },
            { key: 'CONTACTED', label: 'Contacted', count: stats.contacted },
            { key: 'RESOLVED', label: 'Resolved', count: stats.resolved },
            { key: 'ARCHIVED', label: 'Archived', count: null },
          ].map((tab) => {
            const isActive = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleStatusTabChange(tab.key as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#2E7D32] text-white shadow-xs font-bold'
                    : 'bg-[#FAF9F5] text-[#5C665C] hover:text-[#181F18] hover:bg-[#EAE5DB] border border-[#DDD7CA]'
                }`}
              >
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white text-[#2E7D32] border border-[#DDD7CA]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Contact Inquiries Table (15 rows per page) */}
      <div className="bg-white rounded-3xl border border-[#E0DCD3] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#2E7D32] animate-spin mx-auto" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#5C665C] block">
              Loading Contact Inquiries...
            </span>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#FAF9F5] text-[#738273] flex items-center justify-center mx-auto border border-[#DDD7CA]">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#181F18]">
              No Inquiries Found
            </h3>
            <p className="text-xs text-[#5C665C] max-w-sm mx-auto">
              {search || statusFilter !== 'ALL' || spaceFilter !== 'ALL'
                ? 'Try adjusting your search keywords or filter settings.'
                : 'When prospective members submit the contact form, their inquiries will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FAF9F5] text-[#5C665C] uppercase font-mono text-[11px] tracking-wider border-b border-[#E0DCD3]">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6 font-bold">Guest / Contact</th>
                  <th className="py-3.5 px-4 font-bold">Space Interest</th>
                  <th className="py-3.5 px-4 font-bold">Tour Date</th>
                  <th className="py-3.5 px-4 font-bold">Inquiry Preview</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE5DB]">
                {inquiries.map((inq, idx) => {
                  const statusInfo = getStatusBadge(inq.status);
                  const spaceInfo = getSpaceBadge(inq.spaceInterest);

                  return (
                    <tr
                      key={inq.id}
                      className="hover:bg-[#FAF9F5]/70 transition-colors group cursor-pointer"
                      onClick={() => openModal(inq)}
                    >
                      {/* Guest / Contact Details */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] flex items-center justify-center font-bold text-xs shrink-0">
                            {inq.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-[#181F18] block truncate group-hover:text-[#2E7D32] transition-colors">
                              {inq.fullName}
                            </span>
                            <div className="flex items-center gap-2 text-[11px] text-[#5C665C] truncate mt-0.5">
                              <span>{inq.email}</span>
                              {inq.phone && (
                                <>
                                  <span>•</span>
                                  <span>{inq.phone}</span>
                                </>
                              )}
                            </div>
                            {inq.company && (
                              <span className="text-[10px] text-[#2E7D32] font-semibold truncate block">
                                {inq.company}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Space Interest Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] border ${spaceInfo.cls}`}
                        >
                          {spaceInfo.label}
                        </span>
                      </td>

                      {/* Preferred Tour Date & Submitted Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {inq.tourDate ? (
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#181F18]">
                            <Calendar className="w-3.5 h-3.5 text-[#2E7D32]" />
                            <span>{inq.tourDate}</span>
                          </div>
                        ) : (
                          <span className="text-[#8A968A] text-xs font-mono">No Tour Date</span>
                        )}
                        <span className="text-[10px] text-[#8A968A] block font-mono mt-0.5">
                          {formatDate(inq.createdAt)}
                        </span>
                      </td>

                      {/* Inquiry Message Preview */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-xs text-[#2D3E2D] line-clamp-2 leading-relaxed">
                          {inq.message || '—'}
                        </p>
                      </td>

                      {/* Interactive Status Selector */}
                      <td
                        className="py-3.5 px-4 whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={inq.status}
                          onChange={(e) => handleQuickStatusUpdate(inq.id, e.target.value)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none transition-all ${statusInfo.bg}`}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="RESOLVED">Resolved</option>
                          <option value="ARCHIVED">Archived</option>
                        </select>
                      </td>

                      {/* Quick Actions */}
                      <td
                        className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            title="View Full Inquiry Dossier"
                            onClick={() => openModal(inq)}
                            className="p-1.5 rounded-lg bg-[#FAF9F5] hover:bg-[#EAE5DB] text-[#2E7D32] border border-[#DDD7CA] transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {inq.phone && (
                            <a
                              href={`tel:${inq.phone}`}
                              title={`Call ${inq.fullName}`}
                              className="p-1.5 rounded-lg bg-[#FAF9F5] hover:bg-[#EAE5DB] text-blue-600 border border-[#DDD7CA] transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}

                          <a
                            href={`mailto:${inq.email}?subject=EnCourtyard%20Inquiry%20Follow-up`}
                            title={`Email ${inq.email}`}
                            className="p-1.5 rounded-lg bg-[#FAF9F5] hover:bg-[#EAE5DB] text-emerald-600 border border-[#DDD7CA] transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>

                          <button
                            type="button"
                            title="Delete Inquiry"
                            onClick={() => handleDeleteInquiry(inq.id, inq.fullName)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. Pagination Bar (Active after 15 rows) */}
        {!loading && pagination.total > 0 && (
          <div className="px-4 sm:px-6 py-4 bg-[#FAF9F5] border-t border-[#E0DCD3] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            {/* Rows Range Display */}
            <div className="text-[#5C665C]">
              Showing{' '}
              <span className="font-bold text-[#181F18]">
                {(pagination.page - 1) * pagination.limit + 1}
              </span>{' '}
              to{' '}
              <span className="font-bold text-[#181F18]">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{' '}
              of <span className="font-bold text-[#181F18]">{pagination.total}</span> inquiries
              <span className="ml-2 text-[10px] font-mono text-[#2E7D32] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                15 per page
              </span>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrev}
                className="px-3 py-1.5 rounded-xl border border-[#DDD7CA] bg-white hover:bg-[#FAF9F5] text-[#181F18] font-semibold transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {/* Page Number Chips */}
              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => {
                  const isActive = pageNum === pagination.page;
                  // Show current page, edges, and near current page
                  if (
                    pagination.totalPages > 7 &&
                    pageNum !== 1 &&
                    pageNum !== pagination.totalPages &&
                    Math.abs(pageNum - pagination.page) > 1
                  ) {
                    if (pageNum === 2 || pageNum === pagination.totalPages - 1) {
                      return (
                        <span key={pageNum} className="px-1 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#2E7D32] text-white shadow-xs'
                          : 'bg-white hover:bg-[#FAF9F5] text-[#181F18] border border-[#DDD7CA]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={!pagination.hasNext}
                className="px-3 py-1.5 rounded-xl border border-[#DDD7CA] bg-white hover:bg-[#FAF9F5] text-[#181F18] font-semibold transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 6. Inquiry Dossier / Detail Modal */}
      {selectedInquiry && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
          onClick={() => setSelectedInquiry(null)}
        >
          <div
            className="bg-white rounded-3xl border border-[#E0DCD3] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative text-[#181F18] font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#EAE5DB]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] flex items-center justify-center font-bold text-lg shrink-0">
                  {selectedInquiry.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#181F18]">
                    {selectedInquiry.fullName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#5C665C]">
                    <span>Inquiry ID:</span>
                    <span className="font-mono text-[11px] text-[#2E7D32] font-bold">
                      #{selectedInquiry.id.slice(0, 8)}
                    </span>
                    <span>•</span>
                    <span>{formatDate(selectedInquiry.createdAt)}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="w-8 h-8 rounded-full bg-[#FAF9F5] hover:bg-[#EAE5DB] text-[#5C665C] hover:text-[#181F18] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Contact Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href={`mailto:${selectedInquiry.email}`}
                className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#DDD7CA] hover:border-[#2E7D32] transition-colors flex items-center gap-2.5 group"
              >
                <div className="w-8 h-8 rounded-xl bg-white border border-[#DDD7CA] flex items-center justify-center text-[#2E7D32] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-[#5C665C] uppercase font-mono block">Email</span>
                  <span className="text-xs font-semibold text-[#181F18] truncate block group-hover:text-[#2E7D32]">
                    {selectedInquiry.email}
                  </span>
                </div>
              </a>

              {selectedInquiry.phone ? (
                <a
                  href={`tel:${selectedInquiry.phone}`}
                  className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#DDD7CA] hover:border-blue-500 transition-colors flex items-center gap-2.5 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#DDD7CA] flex items-center justify-center text-blue-600 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-[#5C665C] uppercase font-mono block">Phone</span>
                    <span className="text-xs font-semibold text-[#181F18] truncate block group-hover:text-blue-600">
                      {selectedInquiry.phone}
                    </span>
                  </div>
                </a>
              ) : (
                <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#DDD7CA] flex items-center gap-2.5 opacity-60">
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#DDD7CA] flex items-center justify-center text-gray-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5C665C] uppercase font-mono block">Phone</span>
                    <span className="text-xs font-semibold text-gray-400">Not provided</span>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#DDD7CA] flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#DDD7CA] flex items-center justify-center text-[#2E7D32] shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-[#5C665C] uppercase font-mono block">Company</span>
                  <span className="text-xs font-semibold text-[#181F18] truncate block">
                    {selectedInquiry.company || 'Individual / Freelance'}
                  </span>
                </div>
              </div>
            </div>

            {/* Interest & Tour Date Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-[#FAF9F5] border border-[#DDD7CA]">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#5C665C] block mb-1">
                  Requested Workspace Category
                </span>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs border ${
                    getSpaceBadge(selectedInquiry.spaceInterest).cls
                  }`}
                >
                  {getSpaceBadge(selectedInquiry.spaceInterest).label}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#5C665C] block mb-1">
                  Preferred Tour Date
                </span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#181F18]">
                  <Calendar className="w-4 h-4 text-[#2E7D32]" />
                  <span>{selectedInquiry.tourDate || 'Flexible / No date chosen'}</span>
                </div>
              </div>
            </div>

            {/* Full Message Box */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#5C665C] block mb-2">
                Guest Message & Requirements
              </span>
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#DDD7CA] text-xs sm:text-sm text-[#181F18] leading-relaxed whitespace-pre-wrap">
                {selectedInquiry.message || 'No additional message was provided.'}
              </div>
            </div>

            {/* Status Selector in Modal */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#DDD7CA]">
              <div>
                <span className="text-xs font-bold text-[#181F18] block">
                  Inquiry Handling Status
                </span>
                <span className="text-[11px] text-[#5C665C]">
                  Update as your concierge team communicates with the guest.
                </span>
              </div>

              <select
                value={selectedInquiry.status}
                onChange={(e) => handleQuickStatusUpdate(selectedInquiry.id, e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-[#DDD7CA] bg-[#FAF9F5] text-xs font-bold text-[#181F18] focus:outline-none focus:border-[#2E7D32] cursor-pointer"
              >
                <option value="PENDING">Pending (Action Needed)</option>
                <option value="CONTACTED">Contacted (In Discussion)</option>
                <option value="RESOLVED">Resolved (Booked / Complete)</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            {/* Admin Internal Notes Box */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5C665C]">
                  Internal Concierge Notes
                </span>
                {notesSavedSuccess && (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </span>
                )}
              </div>
              <textarea
                rows={3}
                value={adminNotesDraft}
                onChange={(e) => setAdminNotesDraft(e.target.value)}
                placeholder="Log notes about phone calls, quotes sent, walkthrough notes, or follow-up details..."
                className="w-full p-3.5 bg-[#FAF9F5] border border-[#DDD7CA] rounded-2xl text-xs sm:text-sm text-[#181F18] focus:bg-white focus:outline-none focus:border-[#2E7D32] transition-colors"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingNotes ? 'Saving...' : 'Save Notes'}</span>
                </button>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#EAE5DB]">
              <button
                type="button"
                onClick={() => handleDeleteInquiry(selectedInquiry.id, selectedInquiry.fullName)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-800 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Inquiry</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="px-5 py-2.5 rounded-xl bg-[#FAF9F5] hover:bg-[#EAE5DB] text-xs font-bold text-[#181F18] border border-[#DDD7CA] transition-colors cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
