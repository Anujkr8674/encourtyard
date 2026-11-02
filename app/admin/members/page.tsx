'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  Building2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit2,
  Trash2,
  X,
  Check,
  Calendar,
  Sparkles,
  SlidersHorizontal,
  Copy,
  Shield,
  ShieldCheck
} from 'lucide-react';
import { useFeedbackModal } from '@/context/FeedbackModalContext';

export interface DbUserMember {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  role: 'USER' | 'ADMIN' | string;
  isEmailVerified: boolean;
  avatarUrl?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export default function AdminMembersPage() {
  const { showSuccess, showError } = useFeedbackModal();
  const [members, setMembers] = useState<DbUserMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  
  // Mobile filter right slide-out drawer state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Pagination State - 15 rows per page
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // View Details Modal State
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<DbUserMember | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Add / Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    role: 'USER',
    isEmailVerified: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Load actual users from database
  const loadMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/members');
      const data = await res.json();
      if (data.success && Array.isArray(data.members)) {
        setMembers(data.members);
      } else {
        throw new Error(data.error || 'Failed to parse members');
      }
    } catch (err: any) {
      console.error('Failed to load members from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  // Filtered members strictly based on database fields
  const filtered = useMemo(() => {
    return members.filter((m) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        m.name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        (m.phone && m.phone.toLowerCase().includes(q)) ||
        (m.company && m.company.toLowerCase().includes(q)) ||
        m.id?.toLowerCase().includes(q) ||
        m.role?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'verified' && m.isEmailVerified) ||
        (statusFilter === 'unverified' && !m.isEmailVerified);

      const matchesRole =
        roleFilter === 'ALL' || m.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [members, search, statusFilter, roleFilter]);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, roleFilter]);

  // Pagination calculations (15 rows per page)
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedMembers = filtered.slice(startIndex, startIndex + pageSize);

  const isFilterActive = statusFilter !== 'all' || roleFilter !== 'ALL';

  // Open Create Modal
  const openCreateModal = () => {
    setIsEditing(false);
    setFormError('');
    setFormData({
      id: '',
      name: '',
      email: '',
      phone: '',
      company: '',
      role: 'USER',
      isEmailVerified: true,
    });
    setEditModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (m: DbUserMember) => {
    setIsEditing(true);
    setFormError('');
    setFormData({
      id: m.id,
      name: m.name,
      email: m.email,
      phone: m.phone || '',
      company: m.company || '',
      role: m.role || 'USER',
      isEmailVerified: Boolean(m.isEmailVerified),
    });
    setEditModalOpen(true);
  };

  // View Details
  const openViewModal = (m: DbUserMember) => {
    setSelectedMember(m);
    setCopiedId(false);
    setViewModalOpen(true);
  };

  // Copy ID
  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Handle Form Submit (Create or Update in DB)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError('Please enter both name and email address.');
      return;
    }

    setSubmitting(true);
    setFormError('');

    try {
      if (isEditing) {
        const res = await fetch(`/api/admin/members/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update user profile in database');

        setMembers((prev) =>
          prev.map((m) =>
            m.id === formData.id ? { ...m, ...data.updated } : m
          )
        );

        showSuccess({
          variant: 'minimal',
          title: 'Member Profile Updated',
          message: `User "${formData.name}" has been updated in database.`,
          autoCloseMs: 2200,
        });
      } else {
        const res = await fetch('/api/admin/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create user in database');

        if (data.member) {
          setMembers((prev) => [data.member, ...prev]);
        } else {
          loadMembers();
        }

        showSuccess({
          variant: 'minimal',
          title: 'User Profile Created',
          message: `New user "${formData.name}" has been registered in database.`,
          autoCloseMs: 2500,
        });
      }

      setEditModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'An error occurred while saving.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete Member from DB
  const handleDelete = async (m: DbUserMember) => {
    if (!confirm(`Are you sure you want to delete user "${m.name}" (${m.email}) from database?`)) return;

    try {
      const res = await fetch(`/api/admin/members/${m.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMembers((prev) => prev.filter((item) => item.id !== m.id));
        showSuccess({
          variant: 'minimal',
          title: 'User Deleted',
          message: `User "${m.name}" has been deleted from database.`,
          autoCloseMs: 2000,
        });
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete user');
      }
    } catch (err: any) {
      showError({
        variant: 'warning',
        title: 'Delete Failed',
        message: err.message || 'Could not delete user from database.',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-16">
      {/* 1. Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-[#E0DCD3] shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3EBE3] text-[#2E7D32] text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>COMMUNITY DIRECTORY</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18] tracking-tight">
            Member Directory ({members.length} Active Members)
          </h1>
          <p className="text-xs sm:text-sm text-[#5C665C] mt-1">
            View verified member profiles, registered database accounts, company associations, and contact records.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={openCreateModal}
            className="h-11 px-5 py-2 rounded-2xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white shadow-md flex items-center gap-2 text-xs font-bold transition-all shrink-0 cursor-pointer hover:shadow-lg active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member Profile</span>
          </button>
        </div>
      </div>

      {/* 2. Mobile Filter Toolbar (lg:hidden) - Row 1: Search + Filters btn, Row 2: Showing count + Refresh */}
      <div className="lg:hidden bg-white p-3.5 rounded-2xl border border-[#E0DCD3] shadow-xs space-y-2.5">
        {/* Row 1: Search input (left) + Filters button (right) */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-[#738273] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or company..."
              className="w-full pl-9 pr-3 py-2 bg-[#FAF9F5] border border-[#E0DCD3] focus:border-[#2E7D32] rounded-xl text-xs text-[#181F18] placeholder-[#738273] outline-none transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A968A] hover:text-[#181F18]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="px-3.5 py-2 bg-[#181F18] hover:bg-[#2E7D32] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer transition-all shadow-xs active:scale-95"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {isFilterActive && (
              <span className="w-2 h-2 rounded-full bg-[#4ADE80] ring-2 ring-[#181F18] animate-pulse" />
            )}
          </button>
        </div>

        {/* Row 2: Showing count (left) + Refresh button (right) */}
        <div className="flex items-center justify-between pt-1 border-t border-[#E0DCD3]/60">
          <span className="text-xs text-[#5C665C] font-mono font-medium">
            Showing {filtered.length === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + pageSize, filtered.length)} of {filtered.length} members
          </span>
          <button
            type="button"
            onClick={loadMembers}
            className="p-1.5 rounded-xl border border-[#E0DCD3] hover:border-[#2E7D32] text-[#181F18] hover:bg-[#FAF9F5] transition-colors cursor-pointer"
            title="Refresh member list"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#2E7D32] ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2b. Desktop Filter Toolbar (hidden lg:flex) */}
      <div className="hidden lg:flex bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E0DCD3] shadow-xs flex-nowrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          {/* Search Input */}
          <div className="relative w-72">
            <Search className="w-4 h-4 text-[#738273] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or company..."
              className="w-full pl-9 pr-4 py-2 bg-[#FAF9F5] border border-[#E0DCD3] focus:border-[#2E7D32] rounded-xl text-xs text-[#181F18] placeholder-[#738273] outline-none transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A968A] hover:text-[#181F18]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Verification Status Filter Pills */}
          <div className="flex items-center gap-1 bg-[#FAF9F5] p-1 rounded-xl border border-[#E0DCD3]">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white text-[#181F18] shadow-2xs font-bold'
                  : 'text-[#5C665C] hover:text-[#181F18]'
              }`}
            >
              All ({members.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('verified')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'verified'
                  ? 'bg-emerald-100 text-emerald-900 shadow-2xs font-bold'
                  : 'text-[#5C665C] hover:text-[#181F18]'
              }`}
            >
              Verified ({members.filter((m) => m.isEmailVerified).length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('unverified')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'unverified'
                  ? 'bg-amber-100 text-amber-900 shadow-2xs font-bold'
                  : 'text-[#5C665C] hover:text-[#181F18]'
              }`}
            >
              Unverified ({members.filter((m) => !m.isEmailVerified).length})
            </button>
          </div>

          {/* Role Filter Dropdown */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF9F5] border border-[#E0DCD3] focus:border-[#2E7D32] rounded-xl text-xs text-[#181F18] outline-none font-medium cursor-pointer"
          >
            <option value="ALL">All Roles</option>
            <option value="USER">Role: USER</option>
            <option value="ADMIN">Role: ADMIN</option>
          </select>
        </div>

        {/* Right Section: Showing Count + Refresh */}
        <div className="flex items-center gap-2.5 shrink-0 whitespace-nowrap ml-auto">
          <span className="text-xs text-[#5C665C] font-mono font-medium">
            Showing {filtered.length === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + pageSize, filtered.length)} of {filtered.length} members
          </span>
          <button
            type="button"
            onClick={loadMembers}
            className="p-2 rounded-xl bg-[#FAF9F5] hover:bg-[#E3EBE3] border border-[#E0DCD3] text-[#181F18] text-xs transition-colors cursor-pointer"
            title="Refresh member list"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#2E7D32] ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2c. Mobile Filter Slide-Out Drawer from Right (Image 4) */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Right-Side Drawer Panel */}
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-xs sm:max-w-sm bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#E0DCD3] bg-[#FAF9F5] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#181F18] text-white flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#181F18]">Filters &amp; Status</h3>
                  <p className="text-[11px] text-[#5C665C]">Refine registered members</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 rounded-xl text-[#5C665C] hover:text-[#181F18] hover:bg-white border border-transparent hover:border-[#E0DCD3] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
              {/* Verification Status */}
              <div>
                <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider mb-2">
                  Email Verification Status
                </label>
                <div className="space-y-1.5">
                  {[
                    { id: 'all', label: `All Members (${members.length})` },
                    { id: 'verified', label: `Verified Accounts (${members.filter((m) => m.isEmailVerified).length})` },
                    { id: 'unverified', label: `Unverified Accounts (${members.filter((m) => !m.isEmailVerified).length})` },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setStatusFilter(opt.id as any)}
                      className={`w-full p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        statusFilter === opt.id
                          ? 'bg-emerald-50 border-[#2E7D32] text-[#2E7D32]'
                          : 'bg-[#FAF9F5] border-[#E0DCD3] text-[#181F18] hover:bg-white'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {statusFilter === opt.id && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Role Filter */}
              <div>
                <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider mb-1.5">
                  Database Role
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#E0DCD3] focus:border-[#2E7D32] rounded-xl text-xs text-[#181F18] outline-none font-medium"
                >
                  <option value="ALL">All Roles</option>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              {/* Active Filter Summary */}
              {isFilterActive && (
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <span className="font-bold block">Active Filters:</span>
                  <ul className="text-[11px] space-y-0.5 list-disc list-inside text-emerald-800">
                    {statusFilter !== 'all' && <li>Status: {statusFilter}</li>}
                    {roleFilter !== 'ALL' && <li>Role: {roleFilter}</li>}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#E0DCD3] bg-[#FAF9F5] flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('all');
                  setRoleFilter('ALL');
                  setMobileFilterOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl border border-[#E0DCD3] hover:bg-white text-xs font-semibold text-[#5C665C] transition-colors cursor-pointer"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Apply Filters</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Members Table - Displaying strictly fields present in public.users DB */}
      <div className="bg-white border border-[#E0DCD3] rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E0DCD3] text-[#5C665C] font-mono uppercase text-[11px] tracking-wider">
                <th className="py-4 px-4">Member Name</th>
                <th className="py-4 px-4">Contact Info</th>
                <th className="py-4 px-4">Affiliated Company</th>
                <th className="py-4 px-4">Role</th>
                <th className="py-4 px-4">Email Status</th>
                <th className="py-4 px-4">Registered Date</th>
                <th className="py-4 px-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0DCD3]/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[#5C665C]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-6 h-6 text-[#2E7D32] animate-spin" />
                      <span className="text-xs font-mono">Loading real user records from database...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[#5C665C]">
                    <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#2E7D32] flex items-center justify-center mb-1">
                        <Users className="w-6 h-6" />
                      </div>
                      <span className="font-serif text-sm font-bold text-[#181F18]">No User Records Found</span>
                      <span className="text-xs text-[#5C665C]">
                        {search || isFilterActive
                          ? 'No registered users match your search/filter criteria.'
                          : 'No user records currently present in database.'}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedMembers.map((m) => {
                  const initial = (m.name || 'U').charAt(0).toUpperCase();
                  const regDate = m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  }) : '—';

                  return (
                    <tr key={m.id} className="hover:bg-[#FAF9F5]/70 transition-colors group">
                      {/* Member Name + DB ID */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-[#E3EBE3] border border-[#2E7D32]/20 flex items-center justify-center text-[#2E7D32] font-bold text-xs shrink-0 shadow-2xs">
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() => openViewModal(m)}
                              className="font-serif text-sm font-bold text-[#181F18] block hover:text-[#2E7D32] transition-colors text-left cursor-pointer truncate max-w-[180px]"
                            >
                              {m.name}
                            </button>
                            <span 
                              className="text-[10px] text-[#6A806A] font-mono block truncate max-w-[150px]"
                              title={m.id}
                            >
                              #{m.id.slice(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info (email + phone from DB) */}
                      <td className="py-3.5 px-4">
                        <span className="text-[#181F18] block font-medium font-sans">{m.email}</span>
                        <span className="text-[11px] text-[#5C665C] font-mono mt-0.5 block">
                          {m.phone ? m.phone : <span className="text-[#8A968A] italic">No phone</span>}
                        </span>
                      </td>

                      {/* Affiliated Company (from DB) */}
                      <td className="py-3.5 px-4 font-medium text-[#181F18]">
                        {m.company ? (
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-[#5C665C] shrink-0" />
                            <span>{m.company}</span>
                          </div>
                        ) : (
                          <span className="text-[#8A968A] italic">—</span>
                        )}
                      </td>

                      {/* Role (strictly from DB: USER / ADMIN) */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                          m.role === 'ADMIN'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : 'bg-blue-50 text-blue-800 border-blue-200'
                        }`}>
                          {m.role === 'ADMIN' && <Shield className="w-3 h-3" />}
                          <span>{m.role || 'USER'}</span>
                        </span>
                      </td>

                      {/* Email Verification Status (strictly from DB) */}
                      <td className="py-3.5 px-4">
                        {m.isEmailVerified ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                            <XCircle className="w-3 h-3 text-amber-600" />
                            <span>Unverified</span>
                          </span>
                        )}
                      </td>

                      {/* Registered Date (createdAt from DB) */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#5C665C]">
                        {regDate}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right pr-6">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openViewModal(m)}
                            className="p-1.5 rounded-lg bg-[#FAF9F5] hover:bg-[#E3EBE3] border border-[#E0DCD3] text-[#5C665C] hover:text-[#2E7D32] transition-colors cursor-pointer"
                            title="View member details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(m)}
                            className="px-3 py-1 rounded-lg bg-[#FAF9F5] hover:bg-[#E3EBE3] border border-[#E0DCD3] text-[#181F18] font-semibold text-[11px] transition-colors cursor-pointer"
                            title="Edit member"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(m)}
                            className="p-1.5 rounded-lg bg-[#FAF9F5] hover:bg-red-50 border border-[#E0DCD3] text-[#5C665C] hover:text-red-600 transition-colors cursor-pointer"
                            title="Delete user"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Pagination Controls (Active after 15 rows of data) */}
        {filtered.length > pageSize && (
          <div className="p-4 bg-[#FAF9F5] border-t border-[#E0DCD3] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-[#5C665C] font-mono">
              Page {currentPage} of {totalPages} ({filtered.length} total members &bull; 15 per page)
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                  currentPage === 1
                    ? 'border-[#E0DCD3] text-[#8A968A]/50 bg-white cursor-not-allowed'
                    : 'border-[#E0DCD3] text-[#181F18] bg-white hover:bg-[#E3EBE3] cursor-pointer'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-[#2E7D32] text-white shadow-xs'
                        : 'bg-white hover:bg-[#E3EBE3] border border-[#E0DCD3] text-[#181F18]'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                  currentPage === totalPages
                    ? 'border-[#E0DCD3] text-[#8A968A]/50 bg-white cursor-not-allowed'
                    : 'border-[#E0DCD3] text-[#181F18] bg-white hover:bg-[#E3EBE3] cursor-pointer'
                }`}
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. View Member Details Modal (Displays strictly DB fields) */}
      {viewModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#E0DCD3] shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#181F18] to-[#243324] text-white relative">
              <button
                type="button"
                onClick={() => setViewModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white text-2xl font-bold font-serif shrink-0">
                  {(selectedMember.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/20 text-white font-bold">
                      ROLE: {selectedMember.role}
                    </span>
                    {selectedMember.isEmailVerified ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/20 text-[#4ADE80] font-bold border border-[#4ADE80]/30 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Verified Account
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-300/30">
                        Unverified Account
                      </span>
                    )}
                  </div>
                  <h2 className="font-serif text-xl font-bold text-white">{selectedMember.name}</h2>
                  <p className="text-xs text-[#C5D5C5]">{selectedMember.company || 'Private User'}</p>
                </div>
              </div>
            </div>

            {/* Modal Body - Strictly fields present in public.users */}
            <div className="p-6 space-y-4 text-xs">
              {/* User ID with Copy button */}
              <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E0DCD3] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#738273] font-mono uppercase block">User ID (Database UUID)</span>
                  <span className="font-mono text-xs font-bold text-[#181F18] break-all">{selectedMember.id}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyId(selectedMember.id)}
                  className="px-2.5 py-1 rounded-lg border border-[#E0DCD3] bg-white hover:bg-[#E3EBE3] text-xs font-semibold flex items-center gap-1 shrink-0 ml-2 cursor-pointer"
                  title="Copy UUID"
                >
                  {copiedId ? <Check className="w-3 h-3 text-[#2E7D32]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E0DCD3]">
                  <span className="text-[10px] text-[#738273] font-mono uppercase block mb-1">Email Address</span>
                  <span className="font-semibold text-[#181F18] break-all">{selectedMember.email}</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E0DCD3]">
                  <span className="text-[10px] text-[#738273] font-mono uppercase block mb-1">Phone Number</span>
                  <span className="font-semibold text-[#181F18]">{selectedMember.phone || 'Not provided'}</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E0DCD3]">
                  <span className="text-[10px] text-[#738273] font-mono uppercase block mb-1">Affiliated Company</span>
                  <span className="font-semibold text-[#181F18]">{selectedMember.company || 'Not provided'}</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E0DCD3]">
                  <span className="text-[10px] text-[#738273] font-mono uppercase block mb-1">Database Role</span>
                  <span className="font-semibold text-[#181F18] font-mono">{selectedMember.role}</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E0DCD3]">
                  <span className="text-[10px] text-[#738273] font-mono uppercase block mb-1">Registered On</span>
                  <span className="font-semibold text-[#181F18] font-mono">
                    {selectedMember.createdAt ? new Date(selectedMember.createdAt).toLocaleString('en-IN') : '—'}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E0DCD3]">
                  <span className="text-[10px] text-[#738273] font-mono uppercase block mb-1">Last Updated</span>
                  <span className="font-semibold text-[#181F18] font-mono">
                    {selectedMember.updatedAt ? new Date(selectedMember.updatedAt).toLocaleString('en-IN') : '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#FAF9F5] border-t border-[#E0DCD3] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setViewModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#E0DCD3] hover:bg-white text-xs font-semibold text-[#5C665C] transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewModalOpen(false);
                  openEditModal(selectedMember);
                }}
                className="px-5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit User</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Add / Edit Member Profile Modal (Strictly DB fields) */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#E0DCD3] shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 border-b border-[#E0DCD3] bg-[#FAF9F5] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#2E7D32] text-white flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#181F18]">
                    {isEditing ? 'Edit User Record' : 'Register New User in Database'}
                  </h3>
                  <p className="text-[11px] text-[#5C665C]">
                    {isEditing ? 'Update user properties in public.users table' : 'Add a new record to public.users table'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="p-2 rounded-xl text-[#5C665C] hover:text-[#181F18] hover:bg-white border border-transparent hover:border-[#E0DCD3] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-medium">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-[#181F18]">Full Name (name) *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2 bg-[#FAF9F5] border border-[#E0DCD3] focus:border-[#2E7D32] rounded-xl text-xs text-[#181F18] outline-none"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-[#181F18]">Email Address (email) *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. rahul@example.com"
                    className="w-full px-3.5 py-2 bg-[#FAF9F5] border border-[#E0DCD3] focus:border-[#2E7D32] rounded-xl text-xs text-[#181F18] outline-none"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="font-bold text-[#181F18]">Phone Number (phone)</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 8674124575"
                    className="w-full px-3.5 py-2 bg-[#FAF9F5] border border-[#E0DCD3] focus:border-[#2E7D32] rounded-xl text-xs text-[#181F18] outline-none"
                  />
                </div>

                {/* Affiliated Company */}
                <div className="space-y-1">
                  <label className="font-bold text-[#181F18]">Company (company)</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. EnCourtyard"
                    className="w-full px-3.5 py-2 bg-[#FAF9F5] border border-[#E0DCD3] focus:border-[#2E7D32] rounded-xl text-xs text-[#181F18] outline-none"
                  />
                </div>

                {/* System Role */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-[#181F18]">System Role (role)</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#FAF9F5] border border-[#E0DCD3] focus:border-[#2E7D32] rounded-xl text-xs text-[#181F18] outline-none cursor-pointer"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>

              {/* Email Verification Status */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-xl bg-[#FAF9F5] border border-[#E0DCD3]">
                  <input
                    type="checkbox"
                    checked={formData.isEmailVerified}
                    onChange={(e) => setFormData({ ...formData, isEmailVerified: e.target.checked })}
                    className="rounded text-[#2E7D32] focus:ring-[#2E7D32] w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-[#181F18] block text-xs">isEmailVerified (Email Verified)</span>
                    <span className="text-[11px] text-[#5C665C]">Check if this user has completed OTP verification</span>
                  </div>
                </label>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-[#E0DCD3] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E0DCD3] hover:bg-[#FAF9F5] text-xs font-semibold text-[#5C665C] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isEditing ? 'Save Changes' : 'Create User'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
