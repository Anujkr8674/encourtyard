'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useFeedbackModal } from '@/context/FeedbackModalContext';
import { 
  Building2, 
  Users, 
  IndianRupee, 
  TrendingUp, 
  Monitor, 
  ShieldCheck, 
  Check, 
  X, 
  Plus, 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowUpRight,
  Layers,
  Image as ImageIcon,
  QrCode,
  Settings,
  RefreshCw,
  Filter,
  Eye,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  SlidersHorizontal,
  // BellRing,
  MessageSquare,
  Bell,
  ShieldAlert,
  Zap
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { admin } = useAuth();
  const { showSuccess, showError } = useFeedbackModal();
  const adminName = admin?.name || 'Super Administrator';

  // Live Data States
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);

  // Low Alert Quick Adjust Modal State
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [adjustWorkspace, setAdjustWorkspace] = useState<any | null>(null);
  const [adjustTotalUnits, setAdjustTotalUnits] = useState<number>(1);
  const [adjustAlertThreshold, setAdjustAlertThreshold] = useState<number>(5);
  const [adjustSaving, setAdjustSaving] = useState(false);
  const [alertCategoryFilter, setAlertCategoryFilter] = useState<'all' | 'inventory' | 'pending'>('all');

  // Active Tab State for Data Feed
  const [activeTab, setActiveTab] = useState<'bookings' | 'members' | 'workspaces' | 'companies'>('bookings');

  // Date Range Filter State
  const defaultDates = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const today = `${y}-${m}-${d}`;

    // First day of current month
    const firstDay = `${y}-${m}-01`;
    return { today, firstDay };
  }, []);

  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState(defaultDates.today);
  const [appliedStartDate, setAppliedStartDate] = useState('');
  const [appliedEndDate, setAppliedEndDate] = useState('');
  const [preset, setPreset] = useState<'today' | '7days' | 'month' | '30days' | 'all'>('all');

  // Quick Preset Helper
  const applyPreset = (targetPreset: 'today' | '7days' | 'month' | '30days' | 'all') => {
    setPreset(targetPreset);
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const todayStr = `${y}-${m}-${d}`;

    if (targetPreset === 'today') {
      setStartDate(todayStr);
      setEndDate(todayStr);
      setAppliedStartDate(todayStr);
      setAppliedEndDate(todayStr);
    } else if (targetPreset === '7days') {
      const past7 = new Date();
      past7.setDate(now.getDate() - 7);
      const past7Str = past7.toISOString().split('T')[0];
      setStartDate(past7Str);
      setEndDate(todayStr);
      setAppliedStartDate(past7Str);
      setAppliedEndDate(todayStr);
    } else if (targetPreset === 'month') {
      const firstOfMonth = `${y}-${m}-01`;
      const lastDayDate = new Date(y, Number(m), 0);
      const lastDayStr = `${y}-${m}-${String(lastDayDate.getDate()).padStart(2, '0')}`;
      setStartDate(firstOfMonth);
      setEndDate(lastDayStr);
      setAppliedStartDate(firstOfMonth);
      setAppliedEndDate(lastDayStr);
    } else if (targetPreset === '30days') {
      const past30 = new Date();
      past30.setDate(now.getDate() - 30);
      const past30Str = past30.toISOString().split('T')[0];
      setStartDate(past30Str);
      setEndDate(todayStr);
      setAppliedStartDate(past30Str);
      setAppliedEndDate(todayStr);
    } else if (targetPreset === 'all') {
      setStartDate('');
      setEndDate('');
      setAppliedStartDate('');
      setAppliedEndDate('');
    }
  };

  // Fetch all dashboard metrics
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, wsRes, catRes, memRes] = await Promise.all([
        fetch('/api/admin/bookings').then((r) => r.json()).catch(() => ({ bookings: [] })),
        fetch('/api/workspaces').then((r) => r.json()).catch(() => ({ workspaces: [] })),
        fetch('/api/categories').then((r) => r.json()).catch(() => ({ categories: [] })),
        fetch('/api/admin/members').then((r) => r.json()).catch(() => ({ members: [] })),
      ]);

      if (bookingsRes?.bookings) setBookings(bookingsRes.bookings);
      if (Array.isArray(wsRes?.data)) {
        setWorkspaces(wsRes.data);
      } else if (Array.isArray(wsRes?.workspaces)) {
        setWorkspaces(wsRes.workspaces);
      }
      if (catRes?.categories) setCategories(catRes.categories);
      if (memRes?.members) setMembers(memRes.members);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Filter Bookings by Applied Date Range
  const filteredBookings = useMemo(() => {
    if (!appliedStartDate && !appliedEndDate) return bookings;

    return bookings.filter((b) => {
      // Check bookingDate or createdAt or startDate
      const targetDate = b.bookingDate 
        ? new Date(b.bookingDate).toISOString().split('T')[0]
        : b.startDate || (b.createdAt ? new Date(b.createdAt).toISOString().split('T')[0] : '');

      if (!targetDate) return true;
      if (appliedStartDate && targetDate < appliedStartDate) return false;
      if (appliedEndDate && targetDate > appliedEndDate) return false;
      return true;
    });
  }, [bookings, appliedStartDate, appliedEndDate]);

  // Financial & KPI Calculations based on filtered bookings
  const metrics = useMemo(() => {
    const totalRevenue = filteredBookings.reduce((sum, b) => {
      const amt = Number(b.totalAmount) || 0;
      return sum + amt;
    }, 0);

    const dayPassCount = workspaces.filter(
      (w) => w.showInDayPass || (w.categoryName && w.categoryName.toLowerCase().includes('day pass'))
    ).length;

    const meetingRoomsCount = workspaces.filter(
      (w) => w.categoryName && w.categoryName.toLowerCase().includes('meeting')
    ).length;

    const conferenceHallsCount = workspaces.filter(
      (w) => w.categoryName && (w.categoryName.toLowerCase().includes('conference') || w.categoryName.toLowerCase().includes('confr'))
    ).length;

    const standardOfficesCount = workspaces.filter(
      (w) => !w.showInDayPass && !w.categoryName?.toLowerCase().includes('meeting') && !w.categoryName?.toLowerCase().includes('confr')
    ).length;

    return {
      totalBookings: filteredBookings.length,
      totalRevenue,
      totalWorkspaces: workspaces.length,
      totalMembers: members.length,
      totalCategories: categories.length,
      dayPassCount,
      meetingRoomsCount,
      conferenceHallsCount,
      standardOfficesCount,
    };
  }, [filteredBookings, workspaces, members, categories]);

  // Low Stock Workspaces Calculation (available units <= alert threshold, or 0 units remaining)
  const lowStockWorkspaces = useMemo(() => {
    return workspaces.map((ws) => {
      const units = Number(ws.totalUnits) || 1;
      const threshold = ws.alertThreshold !== undefined ? Number(ws.alertThreshold) : 5;
      const bookedCount = bookings.filter((b) =>
        b.workspaceId === ws.id && (b.status === 'CONFIRMED' || b.status === 'PENDING')
      ).length;
      const availableUnits = Math.max(0, units - bookedCount);
      const isSoldOut = availableUnits === 0;
      const isLow = availableUnits <= threshold;
      return {
        ...ws,
        units,
        threshold,
        bookedCount,
        availableUnits,
        isSoldOut,
        isLow,
      };
    }).filter((ws) => ws.isLow || ws.isSoldOut);
  }, [workspaces, bookings]);

  // Pending Bookings requiring Admin Attention
  const pendingBookings = useMemo(() => {
    return bookings.filter((b) => b.status === 'PENDING');
  }, [bookings]);

  // Handler for Quick Inventory & Alert Limit Adjust Modal
  const openQuickAdjustModal = (ws: any) => {
    setAdjustWorkspace(ws);
    setAdjustTotalUnits(ws.units !== undefined ? ws.units : (ws.totalUnits || 1));
    setAdjustAlertThreshold(ws.threshold !== undefined ? ws.threshold : (ws.alertThreshold !== undefined ? ws.alertThreshold : 5));
    setAdjustModalOpen(true);
  };

  const handleSaveQuickAdjust = async () => {
    if (!adjustWorkspace) return;
    setAdjustSaving(true);
    try {
      const res = await fetch(`/api/workspaces/${adjustWorkspace.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalUnits: Math.max(1, Number(adjustTotalUnits) || 1),
          alertThreshold: Math.max(0, Number(adjustAlertThreshold) || 0),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update workspace inventory');
      }
      setWorkspaces((prev) =>
        prev.map((w) => {
          if (w.id === adjustWorkspace.id) {
            return {
              ...w,
              totalUnits: Math.max(1, Number(adjustTotalUnits) || 1),
              alertThreshold: Math.max(0, Number(adjustAlertThreshold) || 0),
            };
          }
          return w;
        })
      );
      showSuccess({
        variant: 'minimal',
        title: 'Inventory Updated',
        message: `"${adjustWorkspace.title}" updated to ${adjustTotalUnits} total units (Alert threshold: ≤ ${adjustAlertThreshold}).`,
        autoCloseMs: 2500,
      });
      setAdjustModalOpen(false);
    } catch (err: any) {
      showError({
        variant: 'warning',
        title: 'Update Failed',
        message: err.message || 'Could not update inventory settings.',
      });
    } finally {
      setAdjustSaving(false);
    }
  };

  // Client Companies List for Tab
  const companiesList = [
    { id: 'COMP-01', name: 'Vanguard BioTech Inc.', contact: 'Elena Rostova', plan: 'Executive Private Suite (Suite 304)', seats: 6, monthlyRevenue: '₹1,85,000', status: 'Approved & Active', city: 'Hyderabad', link: '/admin/companies' },
    { id: 'COMP-02', name: 'Studio Lindqvist & Co', contact: 'Marcus Lindqvist', plan: 'Atelier Dedicated Desks', seats: 4, monthlyRevenue: '₹95,000', status: 'Approved & Active', city: 'Bangalore', link: '/admin/companies' },
    { id: 'COMP-03', name: 'Kinetix AI Systems', contact: 'Devin Thorne', plan: 'Enterprise Custom Wing (Wing B)', seats: 18, monthlyRevenue: '₹4,20,000', status: 'Approved & Active', city: 'Mumbai BKC', link: '/admin/companies' },
    { id: 'COMP-04', name: 'Apex Robotics Labs', contact: 'Chloe Mercer', plan: 'Executive Private Suite', seats: 8, monthlyRevenue: '₹2,10,000', status: 'Pending Review', city: 'Delhi NCR', link: '/admin/companies' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans pb-16">
      {/* 1. Top Banner Master Operations Console Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-[#141C14] via-[#1A261A] to-[#203020] text-white p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#4ADE80]/15 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#4ADE80] text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Operations Console</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Welcome back, {adminName}
          </h1>
          <p className="text-xs sm:text-sm text-[#C5D5C5] max-w-xl">
            Real-time occupancy analytics, member approvals, revenue flow, and complete centre operations.
          </p>
        </div>

        {/* Action Buttons with direct redirection */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/workspaces"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#388E3C] text-white font-bold text-xs shadow-lg transition-all cursor-pointer hover:shadow-xl active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Workspace</span>
          </Link>
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all cursor-pointer hover:border-white/40"
          >
            <Calendar className="w-4 h-4 text-[#4ADE80]" />
            <span>Review Bookings ({metrics.totalBookings})</span>
          </Link>
          <Link
            href="/admin/members"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all cursor-pointer hover:border-white/40"
          >
            <Users className="w-4 h-4 text-[#4ADE80]" />
            <span>Members ({metrics.totalMembers})</span>
          </Link>
        </div>
      </div>

      {/* 2. Interactive Date Range Filter Toolbar (Exact match to reference Image 1 & Image 2) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E0DCD3] shadow-xs space-y-3.5">
        
        {/* ===================== DESKTOP VIEW (Exact match to Image 1 bottom diagram) ===================== */}
        <div className="hidden lg:block space-y-3.5">
          {/* Header */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E3EBE3] text-[#2E7D32] flex items-center justify-center shrink-0">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#181F18]">
                Dashboard Overview Date Filter
              </h2>
              <p className="text-[11px] text-[#5C665C]">
                Select a from-to date range to analyze bookings, occupancy, and revenue for that specific timeframe.
              </p>
            </div>
          </div>

          {/* Row 1: All Presets in one row with active highlight */}
          <div className="flex items-center gap-2 pt-1 border-t border-[#E0DCD3]/50">
            <span className="text-[11px] font-bold text-[#5C665C] mr-1">Presets:</span>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => applyPreset('today')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  preset === 'today'
                    ? 'bg-[#2E7D32] text-white shadow-xs'
                    : 'bg-[#FAF9F5] hover:bg-[#E3EBE3] border border-[#E0DCD3] text-[#181F18]'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => applyPreset('7days')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  preset === '7days'
                    ? 'bg-[#2E7D32] text-white shadow-xs'
                    : 'bg-[#FAF9F5] hover:bg-[#E3EBE3] border border-[#E0DCD3] text-[#181F18]'
                }`}
              >
                Last 7 Days
              </button>
              <button
                type="button"
                onClick={() => applyPreset('month')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  preset === 'month'
                    ? 'bg-[#2E7D32] text-white shadow-xs'
                    : 'bg-[#FAF9F5] hover:bg-[#E3EBE3] border border-[#E0DCD3] text-[#181F18]'
                }`}
              >
                This Month
              </button>
              <button
                type="button"
                onClick={() => applyPreset('30days')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  preset === '30days'
                    ? 'bg-[#2E7D32] text-white shadow-xs'
                    : 'bg-[#FAF9F5] hover:bg-[#E3EBE3] border border-[#E0DCD3] text-[#181F18]'
                }`}
              >
                Last 30 Days
              </button>
              <button
                type="button"
                onClick={() => applyPreset('all')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  preset === 'all'
                    ? 'bg-white text-[#181F18] border-2 border-[#181F18] shadow-xs'
                    : 'bg-[#FAF9F5] hover:bg-[#E3EBE3] border border-[#E0DCD3] text-[#181F18]'
                }`}
              >
                All Time
              </button>
            </div>
          </div>

          {/* Row 2: In ONE single horizontal line (FROM, TO, Apply Button, Reset, Status badge) */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#E0DCD3]/50 flex-wrap xl:flex-nowrap">
            <div className="flex items-center gap-3">
              {/* FROM */}
              <div className="flex items-center gap-2 bg-[#FAF9F5] border border-[#E0DCD3] px-3 py-1.5 rounded-xl focus-within:border-[#2E7D32] transition-colors">
                <span className="text-[11px] font-bold text-[#5C665C] uppercase tracking-wider">FROM:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-xs text-[#181F18] font-mono font-bold outline-none cursor-pointer"
                />
              </div>

              {/* TO */}
              <div className="flex items-center gap-2 bg-[#FAF9F5] border border-[#E0DCD3] px-3 py-1.5 rounded-xl focus-within:border-[#2E7D32] transition-colors">
                <span className="text-[11px] font-bold text-[#5C665C] uppercase tracking-wider">TO:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent text-xs text-[#181F18] font-mono font-bold outline-none cursor-pointer"
                />
              </div>

              {/* Apply Filter Range Button */}
              <button
                type="button"
                onClick={() => {
                  setAppliedStartDate(startDate);
                  setAppliedEndDate(endDate);
                }}
                className="px-4 py-2 bg-[#2E7D32] hover:bg-[#1E5C23] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Apply Filter Range</span>
              </button>
            </div>

            {/* Reset + Showing status in the same row */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setStartDate(defaultDates.firstDay);
                  setEndDate(defaultDates.today);
                  setAppliedStartDate(defaultDates.firstDay);
                  setAppliedEndDate(defaultDates.today);
                  setPreset('month');
                }}
                className="text-xs font-bold text-[#2E7D32] hover:underline cursor-pointer shrink-0"
              >
                Reset to Current Month
              </button>

              <div className="text-xs text-[#5C665C] font-mono shrink-0">
                {appliedStartDate && appliedEndDate ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-[#2E7D32] font-semibold text-[11px] border border-emerald-200">
                    ● {appliedStartDate} to {appliedEndDate}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[#2E7D32] font-semibold text-[11px] border border-emerald-200">
                    ● Showing all-time records
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===================== MOBILE VIEW (Exact match to Image 2 right diagram) ===================== */}
        <div className="lg:hidden space-y-3.5">
          {/* Header */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E3EBE3] text-[#2E7D32] flex items-center justify-center shrink-0">
              <Filter className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#181F18]">
                Dashboard Overview Date Filter
              </h2>
              <p className="text-[10px] text-[#5C665C]">
                Select a from-to date range to analyze bookings, occupancy, and revenue for that specific timeframe.
              </p>
            </div>
          </div>

          {/* Presets Row 1: Presets: Today, Last 7 Days, This Month */}
          <div className="space-y-1.5 pt-1 border-t border-[#E0DCD3]/50">
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-[#5C665C] mr-0.5">Presets:</span>
              <button
                type="button"
                onClick={() => applyPreset('today')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  preset === 'today'
                    ? 'bg-[#2E7D32] text-white'
                    : 'bg-[#FAF9F5] hover:bg-[#E3EBE3] border border-[#E0DCD3] text-[#181F18]'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => applyPreset('7days')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  preset === '7days'
                    ? 'bg-[#2E7D32] text-white'
                    : 'bg-[#FAF9F5] hover:bg-[#E3EBE3] border border-[#E0DCD3] text-[#181F18]'
                }`}
              >
                Last 7 Days
              </button>
              <button
                type="button"
                onClick={() => applyPreset('month')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  preset === 'month'
                    ? 'bg-[#2E7D32] text-white'
                    : 'bg-[#FAF9F5] hover:bg-[#E3EBE3] border border-[#E0DCD3] text-[#181F18]'
                }`}
              >
                This Month
              </button>
            </div>

            {/* Presets Row 2: Last 30 Days, All Time (centered) */}
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => applyPreset('30days')}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  preset === '30days'
                    ? 'bg-[#2E7D32] text-white'
                    : 'bg-[#FAF9F5] hover:bg-[#E3EBE3] border border-[#E0DCD3] text-[#181F18]'
                }`}
              >
                Last 30 Days
              </button>
              <button
                type="button"
                onClick={() => applyPreset('all')}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  preset === 'all'
                    ? 'bg-white text-[#181F18] border-2 border-[#181F18]'
                    : 'bg-[#FAF9F5] hover:bg-[#E3EBE3] border border-[#E0DCD3] text-[#181F18]'
                }`}
              >
                All Time
              </button>
            </div>
          </div>

          {/* Inputs Row: 2 equal columns */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#E0DCD3]/50">
            <div className="flex items-center justify-between gap-1.5 bg-[#FAF9F5] border border-[#E0DCD3] px-2.5 py-2 rounded-xl focus-within:border-[#2E7D32]">
              <span className="text-[10px] font-bold text-[#5C665C] uppercase">FROM:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-[11px] text-[#181F18] font-mono font-bold outline-none cursor-pointer w-full"
              />
            </div>
            <div className="flex items-center justify-between gap-1.5 bg-[#FAF9F5] border border-[#E0DCD3] px-2.5 py-2 rounded-xl focus-within:border-[#2E7D32]">
              <span className="text-[10px] font-bold text-[#5C665C] uppercase">TO:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-[11px] text-[#181F18] font-mono font-bold outline-none cursor-pointer w-full"
              />
            </div>
          </div>

          {/* Centered Apply Filter Range Button */}
          <div className="flex justify-center pt-1">
            <button
              type="button"
              onClick={() => {
                setAppliedStartDate(startDate);
                setAppliedEndDate(endDate);
              }}
              className="w-full max-w-xs py-2 bg-[#2E7D32] hover:bg-[#1E5C23] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Apply Filter Range</span>
            </button>
          </div>

          {/* Bottom Bar: Reset (left) and Status (right) */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E0DCD3]/50 text-xs">
            <button
              type="button"
              onClick={() => {
                setStartDate(defaultDates.firstDay);
                setEndDate(defaultDates.today);
                setAppliedStartDate(defaultDates.firstDay);
                setAppliedEndDate(defaultDates.today);
                setPreset('month');
              }}
              className="text-[11px] font-bold text-[#2E7D32] hover:underline cursor-pointer"
            >
              Reset to Current Month
            </button>

            <div className="text-[11px] text-[#5C665C] font-mono">
              {appliedStartDate && appliedEndDate ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[#2E7D32] font-semibold text-[10px] border border-emerald-200">
                  ● Filtered
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[#2E7D32] font-semibold text-[10px] border border-emerald-200">
                  ● Showing all-time records
                </span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* 3. Core Platform KPIs - EXACTLY 3 CARDS as requested in reference Image 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            label: 'Total Bookings',
            val: `${metrics.totalBookings}`,
            change: `${filteredBookings.filter(b => b.status === 'CONFIRMED').length} Confirmed`,
            icon: Calendar,
            href: '/admin/bookings',
            color: 'text-emerald-700 bg-emerald-50',
          },
          {
            label: 'Period Revenue',
            val: `₹${metrics.totalRevenue.toLocaleString('en-IN')}`,
            change: 'From date range',
            icon: IndianRupee,
            href: '/admin/bookings',
            color: 'text-[#2E7D32] bg-emerald-50',
          },
          {
            label: 'Active Members',
            val: `${metrics.totalMembers}`,
            change: 'Community accounts',
            icon: Users,
            href: '/admin/members',
            color: 'text-blue-700 bg-blue-50',
          },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Link
              key={idx}
              href={kpi.href}
              className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E0DCD3] shadow-xs hover:shadow-md hover:border-[#2E7D32]/50 transition-all group block cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5C665C]">{kpi.label}</span>
                <div className={`w-9 h-9 rounded-xl ${kpi.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
              </div>
              <div className="font-serif text-3xl font-bold text-[#181F18] mb-1.5">{kpi.val}</div>
              <div className="flex items-center justify-between text-xs font-semibold text-[#2E7D32]">
                <span>{kpi.change}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#5C665C] group-hover:text-[#2E7D32] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* 3b. Real-Time Low Inventory & Operational Alerts Section */}
      <div className="bg-gradient-to-br from-white via-[#FFFDF8] to-white border border-amber-200/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
              <AlertTriangle className="w-5 h-5 text-amber-700 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#181F18]">
                  Low Inventory &amp; Operational Alerts
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-mono font-bold border border-amber-300">
                  {lowStockWorkspaces.length + pendingBookings.length} Active Alerts
                </span>
              </div>
              <p className="text-xs text-[#5C665C] mt-0.5">
                Workspaces reaching low stock threshold (≤ alert limit), sold out units, and pending bookings requiring admin action.
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#FAF9F5] p-1 rounded-xl border border-[#E0DCD3] self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setAlertCategoryFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                alertCategoryFilter === 'all'
                  ? 'bg-white text-[#181F18] shadow-2xs font-bold'
                  : 'text-[#5C665C] hover:text-[#181F18]'
              }`}
            >
              All ({lowStockWorkspaces.length + pendingBookings.length})
            </button>
            <button
              type="button"
              onClick={() => setAlertCategoryFilter('inventory')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                alertCategoryFilter === 'inventory'
                  ? 'bg-amber-100 text-amber-900 shadow-2xs font-bold'
                  : 'text-[#5C665C] hover:text-[#181F18]'
              }`}
            >
              Low Capacity ({lowStockWorkspaces.length})
            </button>
            <button
              type="button"
              onClick={() => setAlertCategoryFilter('pending')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                alertCategoryFilter === 'pending'
                  ? 'bg-blue-100 text-blue-900 shadow-2xs font-bold'
                  : 'text-[#5C665C] hover:text-[#181F18]'
              }`}
            >
              Pending Bookings ({pendingBookings.length})
            </button>
          </div>
        </div>

        {/* Alerts Content */}
        {lowStockWorkspaces.length === 0 && pendingBookings.length === 0 ? (
          <div className="py-8 text-center text-[#5C665C] bg-[#FAF9F5] rounded-2xl border border-dashed border-[#E0DCD3]">
            <CheckCircle2 className="w-8 h-8 text-[#2E7D32] mx-auto mb-2 opacity-80" />
            <p className="font-serif text-sm font-bold text-[#181F18]">All Operations Nominal</p>
            <p className="text-xs text-[#5C665C] mt-0.5">No low inventory thresholds breached or pending booking backlogs.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Low Capacity Workspaces */}
            {(alertCategoryFilter === 'all' || alertCategoryFilter === 'inventory') &&
              lowStockWorkspaces.slice(0, 6).map((ws) => (
                <div
                  key={`low-${ws.id}`}
                  className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-[#FAF9F5] border border-[#E0DCD3] text-[10px] font-mono font-bold text-[#5C665C]">
                        {ws.categoryName || 'Workspace'}
                      </span>
                      {ws.isSoldOut ? (
                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-mono font-bold border border-red-200">
                          ⛔ Sold Out (0 Left)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-mono font-bold border border-amber-300 animate-pulse">
                          ⚠️ Low Stock (≤ {ws.threshold})
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-sm font-bold text-[#181F18] group-hover:text-[#2E7D32] transition-colors truncate">
                      {ws.title}
                    </h3>

                    {/* Capacity & Progress Bar */}
                    <div className="mt-2.5 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[#5C665C]">Available Units:</span>
                        <span className={`font-bold ${ws.isSoldOut ? 'text-red-600' : 'text-amber-700'}`}>
                          {ws.availableUnits} of {ws.units} units
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            ws.isSoldOut ? 'bg-red-500 w-0' : ws.availableUnits <= 1 ? 'bg-red-500 w-1/4' : 'bg-amber-500 w-1/2'
                          }`}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[#738273] font-mono">
                        <span>Threshold Limit: ≤ {ws.threshold}</span>
                        <span>Active Holds: {ws.bookedCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 mt-3 border-t border-[#E0DCD3]/60 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => openQuickAdjustModal(ws)}
                      className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                    >
                      <SlidersHorizontal className="w-3 h-3" />
                      <span>Adjust Units</span>
                    </button>
                    <Link
                      href={`/admin/workspaces?q=${encodeURIComponent(ws.title)}`}
                      className="text-[11px] font-bold text-[#2E7D32] hover:underline flex items-center gap-1"
                    >
                      <span>Manage</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}

            {/* 2. Pending Bookings Attention */}
            {(alertCategoryFilter === 'all' || alertCategoryFilter === 'pending') &&
              pendingBookings.slice(0, 4).map((b) => (
                <div
                  key={`pending-${b.id}`}
                  className="bg-white p-4 rounded-2xl border border-blue-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[10px] font-mono font-bold text-blue-800">
                        Pending Booking
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-mono font-bold border border-amber-200">
                        ⏳ Needs Review
                      </span>
                    </div>

                    <h3 className="font-serif text-sm font-bold text-[#181F18] truncate">
                      {b.fullName || 'Registered Member'}
                    </h3>
                    <p className="text-[11px] text-[#5C665C] truncate">{b.email}</p>

                    <div className="mt-2 text-[11px] font-mono bg-[#FAF9F5] p-2 rounded-xl border border-[#E0DCD3]/60 space-y-0.5">
                      <div className="flex justify-between">
                        <span className="text-[#738273]">Space:</span>
                        <span className="font-bold text-[#181F18] truncate max-w-[140px]">{b.workspaceTitle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#738273]">Amount:</span>
                        <span className="font-bold text-[#2E7D32]">₹{Number(b.totalAmount || 0).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#E0DCD3]/60 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-[#738273]">#{b.id.slice(0, 8)}</span>
                    <Link
                      href="/admin/bookings"
                      className="px-3 py-1.5 rounded-xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white text-[11px] font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                      <span>Review &amp; Confirm</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* 4. Complete Website Operations & Management Hub (Clickable cards redirecting to each page) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#181F18] tracking-tight">
              Website Management &amp; Modules Overview
            </h2>
            <p className="text-xs sm:text-sm text-[#5C665C]">
              Direct access to all operational modules of EnCourtyard with live statistics. Click any card to manage.
            </p>
          </div>
          <button
            type="button"
            onClick={loadDashboardData}
            className="p-2 rounded-xl bg-white border border-[#E0DCD3] hover:bg-[#FAF9F5] text-[#181F18] transition-colors cursor-pointer"
            title="Refresh all metrics"
          >
            <RefreshCw className={`w-4 h-4 text-[#2E7D32] ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              title: 'Bookings & Passes',
              desc: 'Review live customer reservations, approval statuses, and payment receipts.',
              badge: `${filteredBookings.length} In Range`,
              badgeColor: 'bg-[#2E7D32] text-white',
              href: '/admin/bookings',
              icon: Calendar,
              stat: `${bookings.length} Total All-Time`,
            },
            {
              title: 'Day Pass Inventory',
              desc: 'Manage flexible daily drop-in desks charged on a per-person daily rate.',
              badge: `${metrics.dayPassCount} Day Passes`,
              badgeColor: 'bg-amber-50 text-amber-900 border-amber-200',
              href: '/admin/day-passes',
              icon: Sparkles,
              stat: 'Daily Rates (₹/day)',
            },
            {
              title: 'Meeting Rooms',
              desc: 'Manage presentation pods, boardrooms, and creative pods with hourly rates.',
              badge: `${metrics.meetingRoomsCount} Rooms`,
              badgeColor: 'bg-blue-50 text-blue-900 border-blue-200',
              href: '/admin/meeting-rooms',
              icon: Monitor,
              stat: 'Hourly Rates (₹/hr)',
            },
            {
              title: 'Conference Halls',
              desc: 'Manage grand convention auditoriums and event venues with hourly booking.',
              badge: `${metrics.conferenceHallsCount} Halls`,
              badgeColor: 'bg-purple-50 text-purple-900 border-purple-200',
              href: '/admin/conference-halls',
              icon: Layers,
              stat: 'Hourly Rates (₹/hr)',
            },
             {
              title: 'Workspaces & Offices',
              desc: 'Add executive offices, multi-unit team suites, property specs & media.',
              badge: `${metrics.standardOfficesCount} Offices`,
              badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
              href: '/admin/workspaces',
              icon: Building2,
              stat: `${metrics.standardOfficesCount} Spaces`,
            },
             {
              title: 'Workspace Categories',
              desc: 'Configure category taxonomy, headings, descriptions, and feature lists.',
              badge: `${metrics.totalCategories} Categories`,
              badgeColor: 'bg-stone-100 text-stone-800 border-stone-300',
              href: '/admin/categories',
              icon: Layers,
              stat: 'Taxonomy Master',
            },
             {
              title: 'UPI QR Payment Gateway',
              desc: 'Configure instant UPI QR code generator, UPI ID VPA, and bank transfers.',
              badge: 'UPI Active',
              badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
              href: '/admin/qr-code',
              icon: QrCode,
              stat: 'encourtyard@upi',
            },
           
            {
              title: 'Member Directory',
              desc: 'View verified members, security keycard passes, and contact records.',
              badge: `${metrics.totalMembers} Members`,
              badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
              href: '/admin/members',
              icon: Users,
              stat: '15-Row Pagination',
            },
           
            // {
            //   title: 'Popular Picks (Top 10)',
            //   desc: 'Curate the Top 10 featured workspaces showcased on the public homepage.',
            //   badge: 'Top 10 Picks',
            //   badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
            //   href: '/admin/popular-picks',
            //   icon: Sparkles,
            //   stat: 'Curated Showcase',
            // },
            {
              title: 'Media Gallery',
              desc: 'Browse and manage all uploaded high-resolution photography and tour videos.',
              badge: 'Supabase CDN',
              badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
              href: '/admin/gallery',
              icon: ImageIcon,
              stat: 'Cloud Storage',
            },
           
            // {
            //   title: 'Client Companies',
            //   desc: 'Manage enterprise team leases, dedicated client wings, and billing run-rates.',
            //   badge: '28 Contracts',
            //   badgeColor: 'bg-emerald-50 text-emerald-900 border-emerald-200',
            //   href: '/admin/companies',
            //   icon: Building2,
            //   stat: 'Enterprise Leases',
            // },

            
            {
              title: 'Contact Inquiries',
              desc: 'Manage customer inquiries, contact form submissions, user messages, and follow-up requests.',
              badge: 'Inquiries Active',
              badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
              href: '/admin/inquiries',
              icon: MessageSquare,
              stat: 'Customer Inquiries',
            },
            {
              title: 'Notifications',
              desc: 'Manage system alerts, booking updates, email notifications, and important activity reminders.',
              badge: 'Notifications Active',
              badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
              href: '/admin/notifications',
              icon: Bell,
              stat: 'Notification Centre',
            },


            {
              title: 'System Settings',
              desc: 'Configure centre locations, business hours, notifications, and security keys.',
              badge: 'System Ready',
              badgeColor: 'bg-stone-100 text-stone-800 border-stone-300',
              href: '/admin/settings',
              icon: Settings,
              stat: 'Centre Operations',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className="p-5 rounded-3xl bg-white border border-[#E0DCD3] shadow-xs hover:shadow-md hover:border-[#2E7D32] transition-all group flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#FAF9F5] border border-[#E0DCD3] group-hover:bg-[#E3EBE3] group-hover:text-[#2E7D32] text-[#181F18] flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-bold text-[#181F18] group-hover:text-[#2E7D32] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#5C665C] mt-1 leading-relaxed line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-[#E0DCD3]/60 flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-[#738273]">{item.stat}</span>
                  <div className="inline-flex items-center gap-1 font-bold text-[#2E7D32] group-hover:underline">
                    <span>Manage</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 5. Live Data Feeds & Recent Activity Tabs (Filtered by Date Range) */}
      <div className="bg-white border border-[#E0DCD3] rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E0DCD3]">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-[#181F18] text-white shadow-sm'
                  : 'text-[#5C665C] hover:bg-[#FAF9F5]'
              }`}
            >
              Recent Bookings ({filteredBookings.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('members')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'members'
                  ? 'bg-[#181F18] text-white shadow-sm'
                  : 'text-[#5C665C] hover:bg-[#FAF9F5]'
              }`}
            >
              Active Members ({members.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('workspaces')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'workspaces'
                  ? 'bg-[#181F18] text-white shadow-sm'
                  : 'text-[#5C665C] hover:bg-[#FAF9F5]'
              }`}
            >
              Workspaces &amp; Suites ({workspaces.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('companies')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'companies'
                  ? 'bg-[#181F18] text-white shadow-sm'
                  : 'text-[#5C665C] hover:bg-[#FAF9F5]'
              }`}
            >
              Client Companies (28)
            </button>
          </div>

          <Link
            href={
              activeTab === 'bookings'
                ? '/admin/bookings'
                : activeTab === 'members'
                ? '/admin/members'
                : activeTab === 'workspaces'
                ? '/admin/workspaces'
                : '/admin/companies'
            }
            className="text-xs font-bold text-[#2E7D32] hover:text-[#181F18] flex items-center gap-1.5 transition-colors"
          >
            <span>View Full Section</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Tab 1: Bookings Feed */}
        {activeTab === 'bookings' && (
          <div className="overflow-x-auto">
            {filteredBookings.length === 0 ? (
              <div className="py-12 text-center text-[#5C665C]">
                <Calendar className="w-8 h-8 text-[#2E7D32] mx-auto mb-2 opacity-50" />
                <p className="font-serif text-sm font-bold text-[#181F18]">No Bookings Found in Selected Date Range</p>
                <p className="text-xs text-[#5C665C] mt-1">Try expanding the date range filter or click &quot;All Time&quot;.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E0DCD3] text-[#5C665C] font-mono uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Booking ID</th>
                    <th className="py-3 px-4">Client Customer</th>
                    <th className="py-3 px-4">Workspace / Pass</th>
                    <th className="py-3 px-4">Reserved Date / Time</th>
                    <th className="py-3 px-4 text-center">Amount</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right pr-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0DCD3]/60">
                  {filteredBookings.slice(0, 8).map((b) => (
                    <tr key={b.id} className="hover:bg-[#FAF9F5] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#181F18]">
                        #{b.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#181F18] block">{b.fullName || 'Registered User'}</span>
                        <span className="text-[11px] text-[#5C665C] font-mono">{b.email}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-[#181F18] block">{b.workspaceTitle || 'EnCourtyard Space'}</span>
                        <span className="text-[10px] text-[#738273] font-mono">{b.categoryName || 'General'}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#5C665C]">
                        {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : b.startDate || 'Immediate'}
                        {b.startTime && <span className="block text-[10px] text-[#2E7D32]">{b.startTime} - {b.endTime}</span>}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-[#2E7D32] font-mono">
                        ₹{Number(b.totalAmount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                          b.status === 'CONFIRMED'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : b.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-900 border border-amber-200'
                            : 'bg-stone-100 text-stone-700'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right pr-4">
                        <Link
                          href="/admin/bookings"
                          className="px-3 py-1 rounded-lg bg-[#FAF9F5] hover:bg-[#E3EBE3] border border-[#E0DCD3] text-[#181F18] font-semibold text-[11px] transition-colors"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 2: Members Feed */}
        {activeTab === 'members' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E0DCD3] text-[#5C665C] font-mono uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Affiliated Company</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Email Status</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4 text-right pr-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0DCD3]/60">
                {members.slice(0, 8).map((m) => {
                  const regDate = m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  }) : '—';
                  return (
                    <tr key={m.id} className="hover:bg-[#FAF9F5] transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#181F18] block">{m.name}</span>
                        <span className="text-[10px] text-[#6A806A] font-mono">#{m.id.slice(0, 8)}...</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[#181F18] block font-sans">{m.email}</span>
                        <span className="text-[10px] text-[#5C665C] font-mono">{m.phone || 'No phone'}</span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#181F18]">
                        {m.company || <span className="text-[#8A968A] italic">—</span>}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                          m.role === 'ADMIN'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : 'bg-blue-50 text-blue-800 border-blue-200'
                        }`}>
                          {m.role || 'USER'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          m.isEmailVerified ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {m.isEmailVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#5C665C]">
                        {regDate}
                      </td>
                      <td className="py-3.5 px-4 text-right pr-4">
                        <Link
                          href="/admin/members"
                          className="px-3 py-1 rounded-lg bg-[#FAF9F5] hover:bg-[#E3EBE3] border border-[#E0DCD3] text-[#181F18] font-semibold text-[11px] transition-colors"
                        >
                          Profile
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Workspaces Inventory Feed */}
        {activeTab === 'workspaces' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E0DCD3] text-[#5C665C] font-mono uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Workspace Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Pricing</th>
                  <th className="py-3 px-4">Capacity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right pr-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0DCD3]/60">
                {workspaces.slice(0, 8).map((ws) => (
                  <tr key={ws.id} className="hover:bg-[#FAF9F5] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#181F18]">
                      {ws.title}
                      <span className="block text-[10px] text-[#6A806A] font-mono">/{ws.slug}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                        {ws.categoryName}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2E7D32]">
                      {ws.price || 'Quote on request'}
                    </td>
                    <td className="py-3.5 px-4 text-[#5C665C] font-mono">
                      {ws.capacity || 'Flexible'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                        ● Active
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right pr-4">
                      <Link
                        href={
                          ws.showInDayPass
                            ? '/admin/day-passes'
                            : ws.categoryName?.toLowerCase().includes('meeting')
                            ? '/admin/meeting-rooms'
                            : ws.categoryName?.toLowerCase().includes('confr')
                            ? '/admin/conference-halls'
                            : '/admin/workspaces'
                        }
                        className="px-3 py-1 rounded-lg bg-[#FAF9F5] hover:bg-[#E3EBE3] border border-[#E0DCD3] text-[#181F18] font-semibold text-[11px] transition-colors"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Client Companies Feed */}
        {activeTab === 'companies' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E0DCD3] text-[#5C665C] font-mono uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">City Location</th>
                  <th className="py-3 px-4">Lead Contact</th>
                  <th className="py-3 px-4">Membership Plan</th>
                  <th className="py-3 px-4 text-center">Seats</th>
                  <th className="py-3 px-4">Monthly Revenue</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right pr-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0DCD3]/60">
                {companiesList.map((comp) => (
                  <tr key={comp.id} className="hover:bg-[#FAF9F5] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#181F18]">
                      {comp.name}
                      <span className="block text-[10px] text-[#6A806A] font-mono">{comp.id}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#181F18]">{comp.city}</td>
                    <td className="py-3.5 px-4 text-[#5C665C]">{comp.contact}</td>
                    <td className="py-3.5 px-4 text-[#181F18]">{comp.plan}</td>
                    <td className="py-3.5 px-4 text-center font-bold">{comp.seats}</td>
                    <td className="py-3.5 px-4 font-bold text-[#2E7D32]">{comp.monthlyRevenue}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {comp.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right pr-4">
                      <Link
                        href={comp.link}
                        className="px-3 py-1 rounded-lg bg-[#FAF9F5] hover:bg-[#E3EBE3] border border-[#E0DCD3] text-[#181F18] font-semibold text-[11px] transition-colors"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Adjust Modal for Inventory & Alert Threshold */}
      {adjustModalOpen && adjustWorkspace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setAdjustModalOpen(false)}
          />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E0DCD3] z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E0DCD3]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#181F18]">Adjust Inventory &amp; Alert Limit</h3>
                  <p className="text-[11px] text-[#5C665C] truncate max-w-[240px]">{adjustWorkspace.title}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAdjustModalOpen(false)}
                className="p-1.5 rounded-xl text-[#5C665C] hover:text-[#181F18] hover:bg-[#FAF9F5] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#181F18] mb-1">
                  Total Capacity Units (Desks / Suites)
                </label>
                <p className="text-[11px] text-[#5C665C] mb-2">Total physical units available for concurrent booking.</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustTotalUnits((prev) => Math.max(1, prev - 1))}
                    className="w-10 h-10 rounded-xl bg-[#FAF9F5] hover:bg-[#E3EBE3] border border-[#E0DCD3] text-base font-bold text-[#181F18] flex items-center justify-center cursor-pointer transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={adjustTotalUnits}
                    onChange={(e) => setAdjustTotalUnits(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="flex-1 px-3 py-2 bg-[#FAF9F5] border border-[#E0DCD3] focus:border-[#2E7D32] rounded-xl text-center text-sm font-mono font-bold text-[#181F18] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setAdjustTotalUnits((prev) => prev + 1)}
                    className="w-10 h-10 rounded-xl bg-[#FAF9F5] hover:bg-[#E3EBE3] border border-[#E0DCD3] text-base font-bold text-[#181F18] flex items-center justify-center cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#181F18] mb-1">
                  Low Stock Alert Threshold
                </label>
                <p className="text-[11px] text-[#5C665C] mb-2">Trigger low-capacity warning when remaining units fall below or equal to this limit.</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustAlertThreshold((prev) => Math.max(0, prev - 1))}
                    className="w-10 h-10 rounded-xl bg-[#FAF9F5] hover:bg-[#E3EBE3] border border-[#E0DCD3] text-base font-bold text-[#181F18] flex items-center justify-center cursor-pointer transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={adjustAlertThreshold}
                    onChange={(e) => setAdjustAlertThreshold(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="flex-1 px-3 py-2 bg-[#FAF9F5] border border-[#E0DCD3] focus:border-[#2E7D32] rounded-xl text-center text-sm font-mono font-bold text-[#181F18] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setAdjustAlertThreshold((prev) => prev + 1)}
                    className="w-10 h-10 rounded-xl bg-[#FAF9F5] hover:bg-[#E3EBE3] border border-[#E0DCD3] text-base font-bold text-[#181F18] flex items-center justify-center cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E0DCD3] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setAdjustModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5C665C] hover:bg-[#FAF9F5] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={adjustSaving}
                onClick={handleSaveQuickAdjust}
                className="px-5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {adjustSaving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Save Inventory Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
