'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import {
  Menu,
  X,
  ShieldCheck,
  Bell,
  RefreshCw,
  LogOut,
  Settings,
  Shield,
  ExternalLink,
  ChevronDown,
  User,
  Sparkles
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { admin, isAdmin, loading, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const adminName = admin?.name || 'Super Administrator';
  const adminId = admin?.adminId || 'Admin';
  const adminEmail = admin?.email || 'admin@encourtyard.com';
  const avatarSeed = adminEmail || adminName;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown and drawer on route change
  useEffect(() => {
    setProfileDropdownOpen(false);
    setMobileSidebarOpen(false);
  }, [pathname]);

  // If on login page, render child without layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // If loading session
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E150F] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-[#4ADE80] animate-spin" />
          <span className="text-xs font-mono tracking-widest uppercase text-[#4ADE80]">
            Verifying Admin Security Clearance...
          </span>
        </div>
      </div>
    );
  }

  // If NOT authenticated as admin, show Admin Login Portal
  if (!isAdmin || !admin) {
    return (
      <div className="min-h-screen bg-[#0E150F] flex items-center justify-center p-4 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#4ADE80 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="w-full max-w-md relative z-10">
          <AdminLoginForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block h-screen sticky top-0 shrink-0 z-30">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 h-full">
            <AdminSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar - Clean Light High-Visibility Aesthetic */}
        <header className="h-20 bg-white text-[#181F18] border-b border-[#E5E1D8] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          {/* Left Side: Welcome Admin Message */}
          <div className="flex items-center gap-3.5">
            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-[#FAF9F5] hover:bg-[#E3EBE3] border border-[#E5E1D8] text-[#181F18] cursor-pointer transition-all shadow-sm"
              aria-label="Open Admin Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#181F18] tracking-tight">
                Welcome Administrator
              </h2>
            </div>
          </div>

          {/* Right Side: Admin 'A' Avatar Icon with Online Green Dot & Profile Dropdown */}
          <div className="flex items-center gap-3" ref={dropdownRef}>
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#2E7D32] to-[#1E5C23] text-white flex items-center justify-center font-bold text-base shadow-sm ring-2 ring-[#4ADE80]/50 hover:ring-[#2E7D32] hover:scale-105 transition-all cursor-pointer select-none group"
                aria-expanded={profileDropdownOpen}
                aria-label="Admin Profile Menu"
              >
                <span>A</span>
                <span className="w-3 h-3 rounded-full bg-[#22C55E] ring-2 ring-white absolute -bottom-0.5 -right-0.5 animate-pulse shadow-sm" />
              </button>

              {/* Profile Floating Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white text-[#181F18] border border-[#E5E1D8] shadow-2xl p-2 z-50 animate-fadeIn font-sans">
                  {/* User Info Header */}
                  <div className="px-3.5 py-3 border-b border-[#E5E1D8] mb-1.5 bg-[#FAF9F5] rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#181F18] truncate block">{adminName}</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        SUPER ADMIN
                      </span>
                    </div>
                    <span className="text-[11px] text-[#5C665C] truncate block mt-0.5 font-mono">{adminEmail}</span>
                  </div>

                  {/* Navigation Items */}
                  <div className="space-y-0.5 text-xs">
                    <Link
                      href="/admin/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[#263626] hover:bg-[#FAF9F5] transition-colors font-medium"
                    >
                      <Settings className="w-4 h-4 text-[#2E7D32]" />
                      <span>System Settings</span>
                    </Link>

                    <Link
                      href="/admin/logs"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[#263626] hover:bg-[#FAF9F5] transition-colors font-medium"
                    >
                      <Shield className="w-4 h-4 text-[#2E7D32]" />
                      <span>Security Audit Logs</span>
                    </Link>

                    <Link
                      href="/"
                      target="_blank"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[#263626] hover:bg-[#FAF9F5] transition-colors font-medium"
                    >
                      <ExternalLink className="w-4 h-4 text-[#6A806A]" />
                      <span>View Public Website</span>
                    </Link>
                  </div>

                  {/* Logout Button */}
                  <div className="pt-1.5 mt-1.5 border-t border-[#E5E1D8]">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-xs font-semibold cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Admin Logout / Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Sub-Page Content */}
        <main className="flex-1 p-4 sm:p-8 bg-[#FAF9F5] text-[#181F18] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
