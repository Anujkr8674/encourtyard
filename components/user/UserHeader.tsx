'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Menu,
  Bell,
  User,
  ShieldLock,
  LogOut,
  CalendarCheck2,
  ChevronDown,
  Sparkles,
  MessageCircle,
  ExternalLink,
  PlusCircle,
} from 'lucide-react';

interface UserHeaderProps {
  onToggleMobileSidebar: () => void;
  pendingCount?: number;
}

export const UserHeader: React.FC<UserHeaderProps> = ({
  onToggleMobileSidebar,
  pendingCount = 0,
}) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userName = user?.name || 'Valued Member';
  const userEmail = user?.email || '';
  const avatarUrl = user?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userEmail || userName)}`;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    if (pathname.includes('/profile')) return 'Profile';
    if (pathname.includes('/security')) return 'Change Password';
    return 'My Bookings';
  };

  return (
    <header className="h-20 bg-white border-b border-[#E5E1D8] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Left: Mobile Menu Toggle & Page Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2.5 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] text-[#181F18] hover:bg-[#F2EEE7] transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-lg sm:text-xl font-bold text-[#181F18] leading-tight">
              {getPageTitle()}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-mono font-bold border border-[#C8E6C9]">
              <Sparkles className="w-3 h-3" />
              <span>Verified Portal</span>
            </span>
          </div>
          <p className="text-[11px] text-[#5C665C] hidden sm:block">
            EnCourtyard Executive Sanctuary Management
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Concierge Assistance Button */}
        <a
          href="https://wa.me/919908209993?text=Hello%20EnCourtyard%20Concierge%2C%20I%20need%20assistance%20with%20my%20member%20portal%20reservation."
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF9F5] hover:bg-[#F0ECE1] text-[#181F18] border border-[#E5E1D8] text-xs font-semibold transition-all shadow-2xs hover:scale-105"
          title="Direct WhatsApp Concierge"
        >
          <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
          <span>Concierge Help</span>
        </a>

        {/* Quick Reserve Button */}
        <Link
          href="/book-space"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-95"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Book Space</span>
        </Link>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FAF9F5] hover:bg-[#F2EEE7] border border-[#E5E1D8] transition-all cursor-pointer select-none group"
            aria-expanded={profileOpen}
          >
            <span className="text-xs font-bold text-[#181F18] max-w-[120px] truncate">
              {(() => {
                const first = (userName || '').trim().split(/\s+/)[0] || 'Member';
                return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
              })()}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#5C665C] transition-transform duration-200 ${
                profileOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2.5 w-60 rounded-2xl bg-white text-[#181F18] border border-[#E5E1D8] shadow-xl p-2 z-50 animate-fadeIn font-sans">
              <div className="px-3 py-2.5 border-b border-[#EAE5DB] mb-1">
                <span className="text-xs font-bold text-[#181F18] truncate block">
                  {userName}
                </span>
                <span className="text-[11px] text-[#5C665C] truncate block">
                  {userEmail}
                </span>
              </div>

              <div className="space-y-0.5 text-xs">
                <Link
                  href="/user/bookings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#181F18] hover:bg-[#FAF9F5] transition-colors font-medium"
                >
                  <CalendarCheck2 className="w-4 h-4 text-[#2E7D32]" />
                  <span>My Bookings</span>
                  {pendingCount > 0 && (
                    <span className="ml-auto px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold font-mono">
                      {pendingCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/user/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#181F18] hover:bg-[#FAF9F5] transition-colors font-medium"
                >
                  <User className="w-4 h-4 text-[#2E7D32]" />
                  <span>Profile</span>
                </Link>

                <Link
                  href="/user/security"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#181F18] hover:bg-[#FAF9F5] transition-colors font-medium"
                >
                  <ShieldLock className="w-4 h-4 text-[#2E7D32]" />
                  <span>Change Password</span>
                </Link>

                <div className="pt-1 border-t border-[#EAE5DB] mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors font-semibold cursor-pointer text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
