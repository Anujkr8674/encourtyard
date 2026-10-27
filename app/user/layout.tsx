'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserSidebar } from '@/components/user/UserSidebar';
import { UserHeader } from '@/components/user/UserHeader';
import { UserLoginForm } from '@/components/user/UserLoginForm';
import { Building2, Sparkles, ShieldCheck } from 'lucide-react';

export default function UserPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // If this is the login or signup page, render standalone without dashboard frame
  const isAuthPage = pathname === '/user/login' || pathname === '/user/signup';

  // Fetch pending reservations count for the badge
  useEffect(() => {
    if (!user || isAuthPage) return;

    const fetchPendingCount = async () => {
      try {
        const res = await fetch('/api/bookings', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.bookings)) {
            const pending = data.bookings.filter(
              (b: any) => b.status === 'PENDING' || b.status === 'CONFIRMED'
            ).length;
            setPendingCount(pending);
          }
        }
      } catch (err) {
        console.error('Error fetching bookings count:', err);
      }
    };

    fetchPendingCount();
  }, [user, isAuthPage, pathname]);

  if (isAuthPage) {
    return <>{children}</>;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center text-[#181F18] font-sans">
        <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-3xl border border-[#E5E1D8] shadow-warm">
          <div className="w-12 h-12 rounded-2xl bg-[#121E12] flex items-center justify-center text-white shadow-lg animate-pulse">
            <Building2 className="w-6 h-6 text-[#4ADE80]" />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-8 h-8 border-3 border-[#2E7D32] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono tracking-widest uppercase text-[#5C665C] mt-2">
              Verifying Member Portal Session...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated: Show dedicated sign-in card inside sanctuary styling
  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center px-4 py-16 relative overflow-hidden font-sans">
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#263626 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="w-full max-w-md relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold border border-[#C8E6C9]">
              <ShieldCheck className="w-4 h-4" />
              <span>EnCourtyard Member Portal</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#181F18]">
              Sign In to Your Workspace
            </h2>
            <p className="text-xs text-[#5C665C]">
              Access your real-time booking tracking, passes, invoices, and profile settings.
            </p>
          </div>

          <UserLoginForm />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#FAF9F5] flex flex-col lg:flex-row text-[#181F18] antialiased"
      style={{ fontFamily: "Tahoma, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      {/* Mobile Sidebar Overlay Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:hidden h-full`}
      >
        <UserSidebar
          onCloseMobile={() => setMobileSidebarOpen(false)}
          pendingCount={pendingCount}
        />
      </div>

      {/* Desktop Sticky Sidebar */}
      <div className="hidden lg:block w-72 shrink-0 h-screen sticky top-0 overflow-y-auto">
        <UserSidebar pendingCount={pendingCount} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <UserHeader
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
          pendingCount={pendingCount}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
