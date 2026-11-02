'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdminNotifications } from '@/context/AdminNotificationsContext';
import {
  Bell,
  Check,
  CheckCheck,
  Calendar,
  AlertTriangle,
  XCircle,
  UserPlus,
  IndianRupee,
  Search,
  Filter,
  RefreshCw,
  Trash2,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  Mail
} from 'lucide-react';

export default function AdminNotificationsPage() {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearReadNotifications,
    refresh,
    isWebSocketConnected,
    loading,
  } = useAdminNotifications();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNREAD' | 'NEW_BOOKING' | 'LOW_ALERT' | 'BOOKING_CANCELLED' | 'NEW_MEMBER' | 'NEW_INQUIRY'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  // Always refresh latest notifications on mount
  React.useEffect(() => {
    refresh();
  }, [refresh]);

  // Reset to first page when changing filters or searching
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Filtered Notifications based on tab and search
  const filteredList = useMemo(() => {
    return notifications.filter((item) => {
      // Tab filter
      if (activeFilter === 'UNREAD' && item.isRead) return false;
      if (
        activeFilter !== 'ALL' &&
        activeFilter !== 'UNREAD' &&
        item.type !== activeFilter
      ) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchMessage = item.message.toLowerCase().includes(q);
        return matchTitle || matchMessage;
      }

      return true;
    });
  }, [notifications, activeFilter, searchQuery]);

  // Pagination calculations (show only 20 rows per page)
  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredList.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredList, currentPage]);

  // Statistics
  const counts = useMemo(() => {
    return {
      all: notifications.length,
      unread: notifications.filter((n) => !n.isRead).length,
      bookings: notifications.filter((n) => n.type === 'NEW_BOOKING').length,
      lowStock: notifications.filter((n) => n.type === 'LOW_ALERT').length,
      cancellations: notifications.filter((n) => n.type === 'BOOKING_CANCELLED').length,
      members: notifications.filter((n) => n.type === 'NEW_MEMBER').length,
    };
  }, [notifications]);

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'NEW_BOOKING':
        return {
          icon: Calendar,
          label: 'Booking',
          pillClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'BOOKING_CANCELLED':
        return {
          icon: XCircle,
          label: 'Cancellation',
          pillClass: 'bg-red-50 text-red-800 border-red-200',
        };
      case 'LOW_ALERT':
        return {
          icon: AlertTriangle,
          label: 'Low Inventory',
          pillClass: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      case 'PAYMENT_RECEIVED':
        return {
          icon: IndianRupee,
          label: 'Payment',
          pillClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'NEW_MEMBER':
        return {
          icon: UserPlus,
          label: 'New Member',
          pillClass: 'bg-blue-50 text-blue-800 border-blue-200',
        };
      case 'NEW_INQUIRY':
        return {
          icon: Mail,
          label: 'Inquiry',
          pillClass: 'bg-teal-50 text-teal-800 border-teal-200',
        };
      default:
        return {
          icon: Bell,
          label: 'Alert',
          pillClass: 'bg-gray-50 text-gray-800 border-gray-200',
        };
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* 1. Page Header with WebSockets Live Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E0DCD3] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${
                isWebSocketConnected
                  ? 'bg-emerald-50 text-[#2E7D32] border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isWebSocketConnected ? 'bg-[#2E7D32] animate-pulse' : 'bg-amber-500'
                }`}
              />
              {isWebSocketConnected ? 'WebSockets Live: Fast Updates' : 'Syncing...'}
            </span>
            <span className="text-xs text-[#5C665C] font-mono">
              Auto-updating in real-time
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18] tracking-tight">
            Notifications Center
          </h1>
          <p className="text-xs sm:text-sm text-[#5C665C]">
            Manage alerts for new bookings, cancellations, low inventory thresholds, and new member accounts.
          </p>
        </div>

        {/* Global Quick Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF9F5] hover:bg-[#E3EBE3] border border-[#E0DCD3] text-xs font-semibold text-[#181F18] transition-colors cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#2E7D32] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All as Read ({unreadCount})</span>
            </button>
          )}

          <button
            type="button"
            onClick={clearReadNotifications}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-[#E0DCD3] hover:border-red-200 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
            title="Clear already read notifications from list"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Read</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <button
          type="button"
          onClick={() => setActiveFilter('ALL')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer shadow-2xs ${
            activeFilter === 'ALL'
              ? 'bg-[#181F18] text-white border-[#181F18] shadow-md scale-102'
              : 'bg-white hover:bg-[#FAF9F5] text-[#181F18] border-[#E0DCD3]'
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider block opacity-75">
            Total Alerts
          </span>
          <span className="text-2xl font-bold font-serif block mt-1">{counts.all}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('UNREAD')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer shadow-2xs ${
            activeFilter === 'UNREAD'
              ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-md scale-102'
              : 'bg-white hover:bg-emerald-50/50 text-[#181F18] border-[#E0DCD3]'
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider block opacity-75">
            Unread
          </span>
          <span className="text-2xl font-bold font-serif block mt-1 text-red-600 group-hover:text-red-700">
            {counts.unread}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('NEW_BOOKING')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer shadow-2xs ${
            activeFilter === 'NEW_BOOKING'
              ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-md scale-102'
              : 'bg-white hover:bg-[#FAF9F5] text-[#181F18] border-[#E0DCD3]'
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider block opacity-75">
            Bookings
          </span>
          <span className="text-2xl font-bold font-serif block mt-1">{counts.bookings}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('LOW_ALERT')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer shadow-2xs ${
            activeFilter === 'LOW_ALERT'
              ? 'bg-amber-600 text-white border-amber-600 shadow-md scale-102'
              : 'bg-white hover:bg-amber-50/50 text-[#181F18] border-[#E0DCD3]'
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider block opacity-75">
            Low Stock
          </span>
          <span className="text-2xl font-bold font-serif block mt-1 text-amber-700">
            {counts.lowStock}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('BOOKING_CANCELLED')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer shadow-2xs ${
            activeFilter === 'BOOKING_CANCELLED'
              ? 'bg-red-700 text-white border-red-700 shadow-md scale-102'
              : 'bg-white hover:bg-red-50/50 text-[#181F18] border-[#E0DCD3]'
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider block opacity-75">
            Cancellations
          </span>
          <span className="text-2xl font-bold font-serif block mt-1 text-red-600">
            {counts.cancellations}
          </span>
        </button>
      </div>

      {/* 3. Search and Category Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E0DCD3] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#7A8A7A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notifications by title, space, customer..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF9F5] border border-[#E0DCD3] rounded-xl text-xs text-[#181F18] outline-none focus:border-[#2E7D32] transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7A8A7A] hover:text-[#181F18]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-[#5C665C] mr-1">Filter:</span>
          {(
            [
              { id: 'ALL', label: `All (${counts.all})` },
              { id: 'UNREAD', label: `Unread (${counts.unread})` },
              { id: 'NEW_BOOKING', label: `Bookings (${counts.bookings})` },
              { id: 'LOW_ALERT', label: `Low Alert (${counts.lowStock})` },
              { id: 'BOOKING_CANCELLED', label: `Cancelled (${counts.cancellations})` },
              { id: 'NEW_MEMBER', label: `Members (${counts.members})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-[#2E7D32] text-white shadow-2xs'
                  : 'bg-[#FAF9F5] hover:bg-[#E3EBE3] border border-[#E0DCD3] text-[#181F18]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Complete Notifications List */}
      <div className="bg-white rounded-3xl border border-[#E0DCD3] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-14 text-center text-[#5C665C] space-y-3">
            <RefreshCw className="w-8 h-8 text-[#2E7D32] mx-auto animate-spin" />
            <p className="text-xs font-mono font-semibold text-[#2E7D32]">
              Loading live alerts & notifications...
            </p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="p-12 text-center text-[#5C665C] space-y-3">
            <Bell className="w-12 h-12 text-[#A3B8A3] mx-auto opacity-40" />
            <h3 className="font-serif text-lg font-bold text-[#181F18]">
              No notifications found
            </h3>
            <p className="text-xs text-[#7A8A7A] max-w-md mx-auto">
              There are no notifications matching the current filter or search criteria.
            </p>
          </div>
        ) : (
          <div>
            <div className="divide-y divide-[#E0DCD3]/60">
              {paginatedList.map((item) => {
                const { icon: BadgeIcon, label, pillClass } = getNotificationBadge(item.type);

                return (
                  <div
                    key={item.id}
                    className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                      !item.isRead
                        ? 'bg-emerald-50/35 border-l-4 border-[#2E7D32]'
                        : 'bg-white hover:bg-[#FAF9F5]'
                    }`}
                  >
                    {/* Left: Category Icon + Content */}
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border shadow-2xs ${pillClass}`}
                      >
                        <BadgeIcon className="w-5 h-5" />
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-md font-mono font-bold border ${pillClass}`}
                          >
                            {label}
                          </span>

                          <span
                            className={`text-sm ${
                              !item.isRead ? 'font-bold text-[#181F18]' : 'font-semibold text-[#304032]'
                            }`}
                          >
                            {item.title}
                          </span>

                          {!item.isRead && (
                            <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" />
                          )}
                        </div>

                        <p
                          className={`text-xs leading-relaxed ${
                            !item.isRead ? 'text-[#263626]' : 'text-[#6A786A]'
                          }`}
                        >
                          {item.message}
                        </p>

                        <div className="flex items-center gap-3 pt-0.5 text-[11px] text-[#7A8A7A] font-mono">
                          <span>{item.timeAgo}</span>
                          <span>•</span>
                          <span>
                            {new Date(item.time).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}{' '}
                            on{' '}
                            {new Date(item.time).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Action Buttons (Direct Redirection & Mark Read) */}
                    <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                      {/* Mark Read Button (removes highlight) */}
                      {!item.isRead ? (
                        <button
                          type="button"
                          onClick={(e) => markAsRead(item.id, e)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-[#2E7D32] border border-emerald-300 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                          title="Mark as read (remove highlight)"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Mark read</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#7A8A7A] font-mono px-2 py-1">
                          Read
                        </span>
                      )}

                      {/* Direct Page Redirection Button */}
                      <Link
                        href={item.targetUrl}
                        onClick={() => markAsRead(item.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                      >
                        <span>
                          {item.type === 'LOW_ALERT'
                            ? 'View Workspace'
                            : item.type === 'NEW_MEMBER'
                            ? 'View Member'
                            : 'View Booking'}
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls Bar (Shows only 20 rows per page with page numbers & arrows) */}
            <div className="p-4 bg-[#FAF9F5] border-t border-[#E0DCD3] flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-[#5C665C] font-mono">
                Showing <strong className="text-[#181F18]">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong> to{' '}
                <strong className="text-[#181F18]">{Math.min(currentPage * ITEMS_PER_PAGE, filteredList.length)}</strong> of{' '}
                <strong className="text-[#181F18]">{filteredList.length}</strong> notifications (20 per page)
              </span>

              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-white hover:bg-[#FAF9F5] text-[#181F18] border-[#E0DCD3] shadow-2xs"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => {
                          setCurrentPage(pageNum);
                          window.scrollTo({ top: 300, behavior: 'smooth' });
                        }}
                        className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                          currentPage === pageNum
                            ? 'bg-[#2E7D32] text-white shadow-2xs'
                            : 'bg-white hover:bg-[#FAF9F5] text-[#181F18] border border-[#E0DCD3]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-white hover:bg-[#FAF9F5] text-[#181F18] border-[#E0DCD3] shadow-2xs"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
