'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  CalendarCheck2,
  CreditCard,
  User,
  ShieldLock,
  LogOut,
  ExternalLink,
  PlusCircle,
  Building2,
  Sparkles,
  Clock,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface UserSidebarProps {
  onCloseMobile?: () => void;
  pendingCount?: number;
}

export const UserSidebar: React.FC<UserSidebarProps> = ({ onCloseMobile, pendingCount = 0 }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    {
      name: 'My Bookings',
      href: '/user/bookings',
      icon: CalendarCheck2,
      badge: pendingCount > 0 ? `${pendingCount} Active` : undefined,
      description: 'Reservations & live tracking',
    },
    {
      name: 'Profile',
      href: '/user/profile',
      icon: User,
      description: 'Personal & company details',
    },
    {
      name: 'Change Password',
      href: '/user/security',
      icon: ShieldLock,
      description: 'Account security & credentials',
    },
  ];

  const userName = user?.name || 'Valued Member';
  const userEmail = user?.email || '';
  const userCompany = user?.company || 'Independent Member';
  const avatarUrl = user?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userEmail || userName)}`;

  return (
    <aside className="w-72 bg-[#F6F4ED] text-[#181F18] flex flex-col h-full border-r border-[#E5E1D8] select-none shadow-md">
      {/* Brand & Portal Identity with Official Logo */}
      <div className="p-5 border-b border-[#E5E1D8] bg-[#F2EFE6]">
        <Link
          href="/"
          className="flex items-center gap-3 group transition-transform duration-200 hover:scale-[1.02]"
          onClick={onCloseMobile}
        >
          <div className="w-10 h-10 rounded-xl bg-white p-1 border border-[#E5E1D8] shadow-xs flex items-center justify-center shrink-0">
            <img
              src="/images/logo.png"
              alt="EnCourtyard Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-lg font-bold tracking-tight text-[#181F18] leading-none">
                EnCourtyard
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#2E7D32]/10 border border-[#2E7D32]/30 text-[9px] font-mono font-bold text-[#2E7D32] uppercase tracking-wider">
                User App
              </span>
            </div>
            <p className="text-[11px] text-[#5C665C] font-sans mt-0.5">
              Member Sanctuary Portal
            </p>
          </div>
        </Link>
      </div>

      {/* Quick Action: Reserve New Workspace */}
      <div className="px-4 pt-4 pb-1">
        <Link
          href="/book-space"
          onClick={onCloseMobile}
          className="w-full py-2.5 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-between group active:scale-[0.98]"
        >
          <span className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-[#A5D6A7]" />
            <span>Book New Workspace</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-white/70 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 pt-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B7B6B] font-bold">
            Member Navigation
          </span>
        </div>

        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === '/user/bookings' && (pathname === '/user' || pathname === '/user/dashboard'));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                isActive
                  ? 'bg-[#2E7D32] text-white shadow-xs font-bold'
                  : 'text-[#2C382C] hover:bg-[#EAE5DB] hover:text-[#181F18]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[#EAE5DB] text-[#2E7D32] group-hover:bg-[#DFD9CD] group-hover:text-[#181F18]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate text-left">
                  <span className="block truncate font-bold text-xs">{item.name}</span>
                  <span
                    className={`block text-[10px] truncate ${
                      isActive ? 'text-white/80' : 'text-[#6B786B] group-hover:text-[#435243]'
                    }`}
                  >
                    {item.description}
                  </span>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`ml-2 px-2 py-0.5 text-[10px] font-mono font-bold rounded-full shrink-0 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[#E0DACF] text-[#2E7D32] border border-[#2E7D32]/20'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Return to Public Website */}
      <div className="px-4 py-2 border-t border-[#E5E1D8]">
        <Link
          href="/"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[#5C665C] hover:text-[#181F18] hover:bg-[#EAE5DB] transition-colors"
          onClick={onCloseMobile}
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>Public Sanctuary Site</span>
          </span>
          <span className="text-[10px] font-mono text-[#788878]">Visit</span>
        </Link>
      </div>

      {/* User Profile Card & Sign Out */}
      <div className="p-3.5 border-t border-[#E5E1D8] bg-[#EFECE3]">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/user/profile"
            onClick={onCloseMobile}
            className="flex items-center gap-2.5 min-w-0 group hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-[#2E7D32] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="truncate text-left">
              <span className="block text-xs font-bold text-[#181F18] truncate group-hover:text-[#2E7D32] transition-colors">
                {userName}
              </span>
              <span className="block text-[10px] text-[#5C665C] truncate font-sans">
                {userCompany}
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={logout}
            className="p-2 rounded-xl text-[#5C665C] hover:text-rose-700 hover:bg-rose-100/60 transition-colors shrink-0 cursor-pointer"
            title="Sign out of account"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
