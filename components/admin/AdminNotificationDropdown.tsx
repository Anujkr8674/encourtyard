'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  ChevronRight,
  ExternalLink,
  Wifi,
  Sparkles,
  Mail
} from 'lucide-react';

export const AdminNotificationDropdown: React.FC = () => {
  const router = useRouter();
  const {
    latest10,
    unreadCount,
    markAsRead,
    markAllAsRead,
    isWebSocketConnected,
    loading,
    notifications,
  } = useAdminNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (item: any) => {
    markAsRead(item.id);
    setIsOpen(false);
    if (item.targetUrl) {
      router.push(item.targetUrl);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'NEW_BOOKING':
        return {
          icon: Calendar,
          bgColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        };
      case 'BOOKING_CANCELLED':
        return {
          icon: XCircle,
          bgColor: 'bg-red-100 text-red-700 border-red-200',
        };
      case 'LOW_ALERT':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-amber-100 text-amber-700 border-amber-200',
        };
      case 'PAYMENT_RECEIVED':
        return {
          icon: IndianRupee,
          bgColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        };
      case 'NEW_MEMBER':
        return {
          icon: UserPlus,
          bgColor: 'bg-blue-100 text-blue-700 border-blue-200',
        };
      case 'NEW_INQUIRY':
        return {
          icon: Mail,
          bgColor: 'bg-teal-100 text-teal-800 border-teal-200',
        };
      default:
        return {
          icon: Bell,
          bgColor: 'bg-gray-100 text-gray-700 border-gray-200',
        };
    }
  };

  return (
    <div className="relative font-sans" ref={dropdownRef}>
      {/* Top Bar Notification Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-full border transition-all cursor-pointer shadow-xs select-none ${
          isOpen
            ? 'bg-[#E3EBE3] border-[#2E7D32] text-[#2E7D32]'
            : 'bg-white hover:bg-[#FAF9F5] border-[#E0DCD3] text-[#181F18] hover:border-[#2E7D32]'
        }`}
        aria-label="View notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5 transition-transform hover:scale-105" />

        {/* Live Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center px-1 rounded-full bg-red-600 text-white font-mono text-[10px] font-bold shadow-md ring-2 ring-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}

        {/* Pulsing indicator if there are unread notifications */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-400 opacity-75 animate-ping pointer-events-none" />
        )}
      </button>

      {/* Floating Dropdown Panel (Vertically scrollable latest 10 notifications) */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-white border border-[#E0DCD3] shadow-2xl z-50 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-3.5 bg-[#FAF9F5] border-b border-[#E0DCD3] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#181F18]">
                Notifications
              </span>
              {unreadCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-mono font-bold border border-red-200">
                  {unreadCount} unread
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#2E7D32] text-[10px] font-mono font-bold border border-emerald-200">
                  All caught up
                </span>
              )}
            </div>

            {/* Read All Button */}
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 text-[#2E7D32] border border-[#E0DCD3] hover:border-emerald-300 text-[11px] font-semibold transition-all cursor-pointer shadow-2xs"
                title="Mark all notifications as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Read all</span>
              </button>
            )}
          </div>

          {/* Realtime WebSocket Status Bar */}
          <div className="px-3.5 py-1.5 bg-[#141C14] text-white flex items-center justify-between text-[10px] font-mono">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isWebSocketConnected ? 'bg-[#4ADE80] animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="text-[#C5D5C5]">
                {isWebSocketConnected ? 'WebSockets Live: Fast Updates' : 'Syncing updates...'}
              </span>
            </div>
            <span className="text-[9px] text-[#A3B8A3] uppercase">Top 10 Latest</span>
          </div>

          {/* Vertically Scrollable List of Latest 10 Notifications */}
          <div className="max-h-96 overflow-y-auto divide-y divide-[#E0DCD3]/60 bg-white">
            {latest10.length === 0 ? (
              <div className="p-8 text-center text-[#5C665C] space-y-2">
                <Bell className="w-8 h-8 text-[#A3B8A3] mx-auto opacity-50" />
                <p className="text-xs font-semibold">No notifications right now</p>
                <p className="text-[11px] text-[#8A968A]">
                  New bookings, cancellations, and low alerts will appear here in real time.
                </p>
              </div>
            ) : (
              latest10.map((item) => {
                const { icon: ItemIcon, bgColor } = getNotificationIcon(item.type);

                return (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer group hover:bg-[#FAF9F5] ${
                      !item.isRead ? 'bg-emerald-50/40 border-l-3 border-[#2E7D32]' : 'bg-white'
                    }`}
                  >
                    {/* Icon Badge */}
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs ${bgColor}`}
                    >
                      <ItemIcon className="w-4 h-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-xs truncate block ${
                            !item.isRead ? 'font-bold text-[#181F18]' : 'font-medium text-[#404D40]'
                          }`}
                        >
                          {item.title}
                        </span>
                        <span className="text-[10px] text-[#7A8A7A] font-mono shrink-0">
                          {item.timeAgo}
                        </span>
                      </div>

                      <p
                        className={`text-[11px] leading-relaxed line-clamp-2 ${
                          !item.isRead ? 'text-[#263626]' : 'text-[#6A786A]'
                        }`}
                      >
                        {item.message}
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-[#2E7D32] font-semibold flex items-center gap-0.5 group-hover:underline">
                          <span>View Details</span>
                          <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                        </span>

                        {/* Individual Read Button (if unread) */}
                        {!item.isRead && (
                          <button
                            type="button"
                            onClick={(e) => markAsRead(item.id, e)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white hover:bg-emerald-100 text-[#2E7D32] border border-emerald-200 text-[10px] font-semibold transition-colors cursor-pointer shadow-2xs"
                            title="Mark as read"
                          >
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                            <span>Mark read</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Dropdown Footer: See All Notifications Button */}
          <div className="p-3 bg-[#FAF9F5] border-t border-[#E0DCD3] flex items-center justify-between">
            <span className="text-[11px] text-[#5C665C] font-mono">
              Total {notifications.length} alerts
            </span>
            <Link
              href="/admin/notifications"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              <span>See all notifications</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
