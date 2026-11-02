'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAdminNotifications } from '@/context/AdminNotificationsContext';
import {
  LayoutDashboard,
  Building2,
  Users,
  Calendar,
  MapPin,
  Monitor,
  IndianRupee,
  ShieldCheck,
  Settings,
  LogOut,
  ExternalLink,
  Sparkles,
  ChevronRight,
  Shield,
  Layers,
  Image,
  QrCode,
  Bell,
  MessageSquare
} from 'lucide-react';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

export const ADMIN_NAV_ITEMS: SidebarItem[] = [
  { name: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Bookings & Passes', href: '/admin/bookings', icon: Calendar, badge: '0 New', badgeColor: 'bg-[#2E7D32] text-white' },

  { name: 'Day Pass', href: '/admin/day-passes', icon: Sparkles, badge: 'Daily', badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300' },
  { name: 'Meeting Rooms', href: '/admin/meeting-rooms', icon: Monitor, badge: 'Hourly', badgeColor: 'bg-blue-100 text-blue-900 border border-blue-300' },
  { name: 'Conference Hall', href: '/admin/conference-halls', icon: Layers, badge: 'Hourly', badgeColor: 'bg-purple-100 text-purple-900 border border-purple-300' },
  { name: 'Workspaces', href: '/admin/workspaces', icon: Building2, badge: 'Offices', badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-300' },
  { name: 'Workspace Category', href: '/admin/categories', icon: Layers, badge: 'Live', badgeColor: 'bg-[#2E7D32] text-white' },
  { name: 'QR Code', href: '/admin/qr-code', icon: QrCode, badge: 'UPI', badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-300' },
  { name: 'Member Directory', href: '/admin/members', icon: Users, badge: '0' },
  { name: 'Gallery', href: '/admin/gallery', icon: Image as any, badge: 'New', badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-300' },
  // { name: 'Popular Picks', href: '/admin/popular-picks', icon: Sparkles, badge: 'Top 10', badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300' },
  { name: 'Contact Inquiries', href: '/admin/inquiries', icon: MessageSquare, badge: '0', badgeColor: 'bg-teal-100 text-teal-800 border border-teal-300' },
  { name: 'Notifications', href: '/admin/notifications', icon: Bell, badge: 'Live', badgeColor: 'bg-emerald-100 text-[#2E7D32] border border-emerald-300' },
  { name: 'System Settings', href: '/admin/settings', icon: Settings },
];

export const AdminSidebar: React.FC<{ onCloseMobile?: () => void }> = ({ onCloseMobile }) => {
  const pathname = usePathname();
  const { admin, logout } = useAuth();
  const { unreadCount } = useAdminNotifications();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [membersCount, setMembersCount] = useState<number>(0);
  const [inquiriesCount, setInquiriesCount] = useState<number>(0);

  useEffect(() => {
    // Fetch total bookings, actual members count, and inquiries count
    const fetchCounts = async () => {
      try {
        const [bookingsRes, membersRes, inquiriesRes] = await Promise.all([
          fetch('/api/admin/bookings').then((r) => r.json()).catch(() => ({})),
          fetch('/api/admin/members').then((r) => r.json()).catch(() => ({})),
          fetch('/api/admin/inquiries?limit=1').then((r) => r.json()).catch(() => ({})),
        ]);

        if (bookingsRes?.success && bookingsRes.bookings) {
          setTotalCount(bookingsRes.bookings.length);
        }
        if (membersRes?.success && typeof membersRes.total === 'number') {
          setMembersCount(membersRes.total);
        }
        if (inquiriesRes?.success && inquiriesRes.stats) {
          setInquiriesCount(inquiriesRes.stats.total || 0);
        }
      } catch (error) {
        console.error("Failed to fetch sidebar counts", error);
      }
    };
    fetchCounts();
    
    // Optional: Poll every 30 seconds
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const adminName = admin?.name || 'Super Administrator';
  const adminId = admin?.adminId || 'Admin';

  const dynamicNavItems = ADMIN_NAV_ITEMS.map(item => {
    if (item.name === 'Bookings & Passes') {
      return { 
        ...item, 
        badge: totalCount > 0 ? `${totalCount}` : '0',
        badgeColor: 'bg-[#2E7D32] text-white'
      };
    }
    if (item.name === 'Contact Inquiries') {
      return {
        ...item,
        badge: `${inquiriesCount}`,
        badgeColor: inquiriesCount > 0 ? 'bg-teal-100 text-teal-900 border border-teal-300 font-bold' : 'bg-[#EAE5DB] text-[#5C665C]',
      };
    }
    if (item.name === 'Member Directory') {
      return {
        ...item,
        badge: `${membersCount}`,
        badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold'
      };
    }
    if (item.name === 'Notifications') {
      return {
        ...item,
        badge: unreadCount > 0 ? `${unreadCount}` : 'Live',
        badgeColor: unreadCount > 0 ? 'bg-red-600 text-white font-bold' : 'bg-emerald-100 text-[#2E7D32] border border-emerald-300 font-semibold',
      };
    }
    return item;
  });

  return (
    <aside className="w-64 sm:w-72 bg-[#F6F4ED] text-[#181F18] border-r border-[#E0DCD3] flex flex-col justify-between h-full select-none shadow-xl relative overflow-hidden">
      {/* Subtle Ambient Botanical Accents */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-[#2E7D32]/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#4ADE80]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header & Brand */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Brand Logo Banner */}
        <div className="px-4 py-3 border-b border-[#E0DCD3] bg-white/60 backdrop-blur-sm">
          <Link
            href="/admin"
            onClick={onCloseMobile}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="bg-white p-1.5 rounded-xl border border-[#E0DCD3] group-hover:border-[#2E7D32] group-hover:shadow-[0_0_16px_rgba(46,125,50,0.25)] transition-all duration-300 shadow-sm transform group-hover:scale-105">
              <img
                src="/images/logo.png"
                alt="EnCourtyard"
                className="h-7 w-auto object-contain filter drop-shadow-sm"
              />
            </div>
            <div>
              <span className="font-serif text-base font-bold text-[#181F18] block leading-tight tracking-tight">
                EnCourtyard
              </span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#2E7D32] font-bold block">
                Command Center
              </span>
            </div>
          </Link>
        </div>

        {/* Admin Profile Mini Card */}
        <div className="mx-3 my-2 p-2 rounded-xl bg-white border border-[#E0DCD3] shadow-sm transition-all flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative shrink-0">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2E7D32] to-[#1E5C23] text-white flex items-center justify-center font-bold text-xs shadow-sm ring-1 ring-[#2E7D32]/30">
                A
              </div>
              <span className="w-2 h-2 rounded-full bg-[#22C55E] ring-1 ring-white absolute bottom-0 right-0 animate-pulse" />
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-[#181F18] block truncate">{adminName}</span>
              <span className="text-[9px] text-[#5C665C] block truncate font-mono">ID: {adminId}</span>
            </div>
          </div>
          <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-[#2E7D32] text-[9px] font-mono font-bold border border-emerald-200 shrink-0">
            ROOT
          </span>
        </div>

        {/* Navigation Menu with Attractive Hover and Active Effects */}
        <nav className="px-3.5 py-1 space-y-1 font-sans">
          {dynamicNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onCloseMobile}
                className={`w-full px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all duration-200 group cursor-pointer ${isActive
                    ? 'bg-gradient-to-r from-[#2E7D32] to-[#1E5C23] text-white shadow-[0_4px_14px_rgba(46,125,50,0.35)] border border-[#2E7D32] font-bold translate-x-1'
                    : 'text-[#304032] hover:text-[#111F13] bg-transparent hover:bg-[#E7EFE6] border border-transparent hover:border-emerald-200/80 hover:translate-x-1.5 hover:shadow-sm'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4.5 h-4.5 transition-all duration-200 shrink-0 ${isActive
                        ? 'text-white scale-110 drop-shadow-sm'
                        : 'text-[#2E7D32] group-hover:scale-115 group-hover:text-[#1E5C23]'
                      }`}
                  />
                  <span className="transition-colors duration-200">{item.name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono transition-transform duration-200 group-hover:scale-105 ${item.badgeColor || (isActive ? 'bg-white text-[#1E5C23] shadow-sm' : 'bg-emerald-100 text-[#1E5C23] border border-emerald-200')
                        }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-all duration-200 ${isActive
                        ? 'text-white opacity-100 translate-x-0.5'
                        : 'opacity-0 text-[#2E7D32] -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0'
                      }`}
                  />
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-2.5 border-t border-[#E0DCD3] space-y-1.5 bg-[#EEEBE2] shrink-0">
        <Link
          href="/"
          target="_blank"
          className="w-full px-3 py-2 rounded-xl text-xs font-medium text-[#304032] bg-white/70 hover:bg-white hover:text-[#111F13] border border-[#E0DCD3] hover:border-emerald-300 flex items-center justify-between transition-all duration-200 group shadow-sm"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-[#2E7D32] group-hover:scale-110 transition-transform" />
            <span>View Public Website</span>
          </span>
          <span className="text-[10px] text-[#2E7D32] font-mono bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">Live</span>
        </Link>

        <button
          type="button"
          onClick={() => logout()}
          className="w-full px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 hover:border-red-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
        >
          <LogOut className="w-3.5 h-3.5 text-red-600" />
          <span>Exit / Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
