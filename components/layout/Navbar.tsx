'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Building2,
  ShieldCheck,
  UserCheck,
  LayoutDashboard,
  ChevronRight,
  User,
  Users,
  LogOut,
  ChevronDown,
  Clock,
  Monitor,
  CalendarCheck2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useFeedbackModal } from '@/context/FeedbackModalContext';
import { DayPassCalendar } from '@/components/ui/DayPassCalendar';

// Clean SVG Brand Icons for Drawer Social Links
const LinkedInIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const TwitterXIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const Navbar: React.FC = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileQuickBookOpen, setMobileQuickBookOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [quickDropdownOpen, setQuickDropdownOpen] = useState(false);
  const [quickDayPassOpen, setQuickDayPassOpen] = useState(false);
  const [mobileDayPassCalendarOpen, setMobileDayPassCalendarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isDayPassPage = pathname === '/book-space' && searchParams.get('plan') === 'day-pass';
  const isDayPassActive = isDayPassPage;
  const isConferenceActive = pathname === '/conference-hall';
  const isContactActive = pathname === '/contact';
  const isQuickActive = isDayPassActive || isConferenceActive || isContactActive;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const quickDropdownRef = useRef<HTMLDivElement>(null);
  const quickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { user, admin, isAuthenticated, isAdmin, logout } = useAuth();
  const { showSuccess } = useFeedbackModal();

  const handleQuickMouseEnter = () => {
    if (quickTimeoutRef.current) {
      clearTimeout(quickTimeoutRef.current);
      quickTimeoutRef.current = null;
    }
    setQuickDropdownOpen(true);
  };

  const handleQuickMouseLeave = () => {
    if (quickDayPassOpen) return; // Keep open while picking date
    if (quickTimeoutRef.current) {
      clearTimeout(quickTimeoutRef.current);
    }
    quickTimeoutRef.current = setTimeout(() => {
      setQuickDropdownOpen(false);
      setQuickDayPassOpen(false);
    }, 300);
  };

  const handleSignOut = () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
    showSuccess({
      variant: 'minimal',
      title: 'Signed Out',
      message: 'You have been successfully signed out from your account session.',
      primaryBtnText: 'Okay',
      autoCloseMs: 2000,
    });
  };

  // Active display identity
  const displayName = admin?.name || user?.name || 'Member';
  const displayEmail = admin?.email || user?.email || '';
  const displayRole = admin ? 'ADMIN' : (user?.role || 'MEMBER');
  const avatarSeed = displayEmail || displayName;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (quickDropdownRef.current && !quickDropdownRef.current.contains(event.target as Node)) {
        setQuickDropdownOpen(false);
        setQuickDayPassOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (quickTimeoutRef.current) clearTimeout(quickTimeoutRef.current);
    };
  }, []);

  // Listen for scroll to toggle background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawer on path change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileQuickBookOpen(false);
    setProfileDropdownOpen(false);
    setQuickDropdownOpen(false);
    setQuickDayPassOpen(false);
    setMobileDayPassCalendarOpen(false);
  }, [pathname]);

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const isHome = pathname === '/';
  const isWhiteNav = true;

  const firstNavLinks = [
    { name: 'Home', href: '/' },
    { name: 'Book Space', href: '/book-space' },
  ];

  const secondNavLinks = [
    { name: 'Hyderabad', href: '/hyderabad' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'About', href: '/about' },
  ];

  const portalLinks = [
    { name: 'Member Portal', href: '/dashboard', icon: <UserCheck className="w-3.5 h-3.5 text-[#4ADE80]" /> },
    { name: 'Admin Insights', href: '/admin', icon: <LayoutDashboard className="w-3.5 h-3.5 text-[#4ADE80]" /> }
  ];

  // Do not render main website Navbar inside Admin or User Portal pages (except auth /user/login and /user/signup)
  if (
    pathname.startsWith('/admin') ||
    (pathname.startsWith('/user') && pathname !== '/user/login' && pathname !== '/user/signup')
  ) {
    return null;
  }

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-[#EAE5DB] shadow-[0_4px_25px_rgba(0,0,0,0.06)] transition-all duration-300"
      >
        {/* Top Utility Contact & Hours Bar - Always Visible on Laptop/Desktop (hidden on mobile) */}
        <div
          className="hidden md:block w-full border-b border-[#1E3A6E]/50 shadow-md bg-gradient-to-r from-[#0B1528] via-[#0E2246] to-[#0A162B] text-white select-none transition-all duration-300 ease-in-out"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 sm:h-10 flex items-center justify-between text-xs">
            {/* Left Side: Contact Number & Email Only (Labels removed as requested) */}
            <div className="flex items-center gap-4 sm:gap-6 min-w-0">
              {/* Phone Only */}
              <a
                href="tel:+919908209993"
                className="group/phone inline-flex items-center gap-2 hover:text-[#4ADE80] transition-colors shrink-0"
                title="Direct Phone / WhatsApp: +91 99082 09993"
              >
                <div className="w-5 h-5 rounded-full bg-[#10B981]/25 border border-[#10B981]/40 flex items-center justify-center text-[#34D399] group-hover/phone:bg-[#10B981] group-hover/phone:text-white transition-all shadow-xs">
                  <Phone className="w-3 h-3" />
                </div>
                <span className="font-mono text-xs font-bold text-white group-hover/phone:text-[#4ADE80] tracking-wide transition-colors">
                  +91 99082 09993
                </span>
              </a>

              <span className="text-white/25 hidden sm:inline">|</span>

              {/* Email Only */}
              <a
                href="mailto:info@encourtyard.com"
                className="group/mail inline-flex items-center gap-2 hover:text-[#60A5FA] transition-colors shrink-0"
                title="Email Concierge: info@encourtyard.com"
              >
                <div className="w-5 h-5 rounded-full bg-[#185ADB]/25 border border-[#185ADB]/40 flex items-center justify-center text-[#60A5FA] group-hover/mail:bg-[#185ADB] group-hover/mail:text-white transition-all shadow-xs">
                  <Mail className="w-3 h-3" />
                </div>
                <span className="font-mono text-xs font-semibold text-[#E2E8F0] group-hover/mail:text-white transition-colors">
                  info@encourtyard.com
                </span>
              </a>
            </div>

            {/* Right Side: Available Time + Authentic Brand Social Links */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              {/* Available Time */}
              <div className="hidden lg:flex items-center gap-1.5 text-white/85 font-mono text-[11px]">
                <Clock className="w-3.5 h-3.5 text-[#FBBF24]" />
                <span className="text-[#E2E8F0]">Mon – Sat: 9:00 AM – 7:00 PM</span>
              </div>

              <span className="text-white/25 hidden lg:inline">|</span>

              {/* Social Links with Authentic Styling */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Authentic WhatsApp Icon (Matching floating widget) */}
                <a
                  href="https://wa.me/919908209993?text=Hello%20EnCourtyard%20Team%2C%20I%20would%20like%20to%20inquire%20about%20booking%20a%20workspace."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-6 h-6 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center transition-all cursor-pointer shadow-xs hover:scale-110 active:scale-95"
                  title="Chat on WhatsApp (+91 99082 09993)"
                  aria-label="WhatsApp"
                >
                  <WhatsAppIcon />
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com/encourtyard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center transition-all cursor-pointer shadow-xs hover:scale-110 active:scale-95"
                  title="Instagram"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/company/encourtyard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-6 h-6 rounded-full bg-[#0A66C2] text-white flex items-center justify-center transition-all cursor-pointer shadow-xs hover:scale-110 active:scale-95"
                  title="LinkedIn"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon />
                </a>

                {/* X (Twitter) */}
                <a
                  href="https://x.com/encourtyard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-6 h-6 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 shadow-xs hover:scale-110 active:scale-95"
                  title="X (Twitter)"
                  aria-label="X (Twitter)"
                >
                  <TwitterXIcon />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 h-20 sm:h-22 lg:h-22">

          {/* Brand Logo: Clean on white background */}
          <Link
            href="/"
            className="group flex items-center focus:outline-none py-1 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shrink-0"
            aria-label="EnCourtyard Home"
          >
            <div className="transition-all duration-300 flex items-center justify-center rounded-2xl px-1 py-1 bg-transparent">
              <img
                src="/images/logo.png"
                alt="EnCourtyard"
                className="w-auto object-contain transition-all duration-300 group-hover:scale-105 h-14 sm:h-16 lg:h-16 filter-none drop-shadow-none"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1.5 transition-all duration-300">
            {firstNavLinks.map((link) => {
              const isActive =
                link.href === '/book-space'
                  ? pathname === '/book-space' && !isDayPassPage
                  : pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 relative flex items-center ${
                    isActive
                      ? 'bg-[#2E7D32] text-white shadow-md font-bold border border-[#4ADE80]/40'
                      : 'text-[#2D3E2D] hover:text-[#181F18] hover:bg-[#F0ECE1]'
                  }`}
                >
                  <span>{link.name}</span>
                </Link>
              );
            })}

            {/* Quick Booking Dropdown Menu (Directly after Book Space, matching other nav menu styling) */}
            <div
              className="relative"
              ref={quickDropdownRef}
              onMouseEnter={handleQuickMouseEnter}
              onMouseLeave={handleQuickMouseLeave}
            >
              <button
                type="button"
                onClick={() => setQuickDropdownOpen(!quickDropdownOpen)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 relative flex items-center gap-1.5 cursor-pointer select-none ${
                  quickDropdownOpen || isDayPassActive || isConferenceActive
                    ? 'bg-[#2E7D32] text-white shadow-md font-bold border border-[#4ADE80]/40'
                    : 'text-[#2D3E2D] hover:text-[#181F18] hover:bg-[#F0ECE1]'
                }`}
                aria-expanded={quickDropdownOpen}
                aria-haspopup="true"
              >
                <span>Quick Booking</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${
                    quickDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Quick Book Services Dropdown Card */}
              {quickDropdownOpen && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-full pt-2.5 w-[340px] sm:w-[390px] z-50"
                  onMouseEnter={handleQuickMouseEnter}
                  onMouseLeave={handleQuickMouseLeave}
                >
                  <div className="rounded-3xl bg-white text-[#181F18] border border-[#DDD7CA] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] p-4 sm:p-5 animate-fadeIn font-sans">
                    {quickDayPassOpen ? (
                      /* Day Pass Calendar View inside the dropdown */
                      <div className="animate-fadeIn">
                        <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#EAE5DB]">
                          <button
                            type="button"
                            onClick={() => setQuickDayPassOpen(false)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E7D32] hover:text-[#1E5C23] transition-colors cursor-pointer group"
                          >
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                            <span>Back to Services</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setQuickDropdownOpen(false);
                              setQuickDayPassOpen(false);
                            }}
                            className="w-6 h-6 rounded-full bg-[#FAF9F5] text-[#738273] hover:text-[#181F18] hover:bg-[#EAE5DB] flex items-center justify-center transition-colors text-xs cursor-pointer"
                            aria-label="Close menu"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <DayPassCalendar
                          onSelectDate={(ymd) => {
                            setQuickDropdownOpen(false);
                            setQuickDayPassOpen(false);
                            router.push(
                              `/book-space?plan=day-pass&date=${encodeURIComponent(ymd)}&startTime=${encodeURIComponent('09:00 AM')}&endTime=${encodeURIComponent('06:00 PM')}`
                            );
                          }}
                          onCancel={() => setQuickDayPassOpen(false)}
                          showTitle={true}
                        />
                      </div>
                    ) : (
                      <>
                        {/* Dropdown Header */}
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EAE5DB]">
                          <span className="text-xs sm:text-sm font-bold text-[#181F18] tracking-tight">
                            Quick book services :
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuickDropdownOpen(false)}
                            className="w-6 h-6 rounded-full bg-[#FAF9F5] text-[#738273] hover:text-[#181F18] hover:bg-[#EAE5DB] flex items-center justify-center transition-colors text-xs cursor-pointer"
                            aria-label="Close quick book menu"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Services Cards */}
                        <div className="space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
                          
                          {/* Item 1: Day Pass -> Navigate directly or pick date via calendar button */}
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() => {
                              setQuickDropdownOpen(false);
                              setQuickDayPassOpen(false);
                              router.push('/book-space?plan=day-pass');
                            }}
                            className="group/card flex items-center gap-3.5 p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-[#182319] to-[#0E150F] hover:from-[#1E2E20] hover:to-[#121B13] border border-[#2E7D32]/40 hover:border-[#4ADE80]/60 text-white transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                          >
                            {/* Left Thumbnail */}
                            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-[#1A261A] relative">
                              <img
                                src="https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=400&q=80"
                                alt="Day Pass"
                                className="w-full h-full object-cover group-hover/card:scale-108 transition-transform duration-500"
                              />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 pr-1 text-left">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-[#4ADE80] font-semibold block mb-0.5">
                                On Demand • 9 AM – 6 PM
                              </span>
                              <h4 className="font-serif font-bold text-sm sm:text-base text-white leading-tight mb-1">
                                Day Pass
                              </h4>
                              <p className="text-[11px] sm:text-xs text-[#D1E0D1] font-sans leading-tight line-clamp-2">
                                Full-day workspace access with drop-in flexibility
                              </p>
                            </div>

                            {/* Calendar Icon Button: Click to pick date */}
                            <button
                              type="button"
                              title="Pick a Date for Day Pass"
                              onClick={(e) => {
                                e.stopPropagation();
                                setQuickDayPassOpen(true);
                              }}
                              className="w-8 h-8 rounded-full bg-white text-[#181F18] group-hover/card:bg-[#2E7D32] group-hover/card:text-white flex items-center justify-center shrink-0 transition-all duration-300 shadow-sm cursor-pointer hover:scale-110 active:scale-95"
                            >
                              <Calendar className="w-4 h-4" />
                            </button>
                          </div>

                      {/* Item 2: Conference Hall -> /conference-hall */}
                      <Link
                        href="/conference-hall"
                        onClick={() => setQuickDropdownOpen(false)}
                        className="group/card flex items-center gap-3.5 p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-[#182319] to-[#0E150F] hover:from-[#1E2E20] hover:to-[#121B13] border border-[#2E7D32]/40 hover:border-[#4ADE80]/60 text-white transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                      >
                        {/* Left Thumbnail */}
                        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-[#1A261A] relative">
                          <img
                            src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&q=80"
                            alt="Conference Hall"
                            className="w-full h-full object-cover group-hover/card:scale-108 transition-transform duration-500"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pr-1 text-left">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#C29B38] font-semibold block mb-0.5">
                            Featured
                          </span>
                          <h4 className="font-serif font-bold text-sm sm:text-base text-white leading-tight mb-1">
                            Conference Hall
                          </h4>
                          <p className="text-[11px] sm:text-xs text-[#D1E0D1] font-sans leading-tight line-clamp-2">
                            Grand presentation suites & executive auditoriums.
                          </p>
                        </div>

                        {/* Arrow Button */}
                        <div className="w-8 h-8 rounded-full bg-white text-[#181F18] group-hover/card:bg-[#185ADB] group-hover/card:text-white flex items-center justify-center shrink-0 transition-all duration-300 shadow-sm">
                          <ArrowRight className="w-4 h-4 group-hover/card:translate-x-0.5 transition-transform" />
                        </div>
                      </Link>

                      {/* Item 3: Meeting Rooms -> /meeting-rooms */}
                      <Link
                        href="/meeting-rooms"
                        onClick={() => setQuickDropdownOpen(false)}
                        className="group/card flex items-center gap-3.5 p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-[#182319] to-[#0E150F] hover:from-[#1E2E20] hover:to-[#121B13] border border-[#2E7D32]/40 hover:border-[#4ADE80]/60 text-white transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                      >
                        {/* Left Thumbnail */}
                        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-[#1A261A] relative">
                          <img
                            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80"
                            alt="Meeting Rooms"
                            className="w-full h-full object-cover group-hover/card:scale-108 transition-transform duration-500"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pr-1 text-left">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#4ADE80] font-semibold block mb-0.5">
                            Audio-Visual Spaces
                          </span>
                          <h4 className="font-serif font-bold text-sm sm:text-base text-white leading-tight mb-1">
                            Meeting Rooms
                          </h4>
                          <p className="text-[11px] sm:text-xs text-[#D1E0D1] font-sans leading-tight line-clamp-2">
                            Executive presentation suites & team collaboration pods.
                          </p>
                        </div>

                        {/* Arrow Button */}
                        <div className="w-8 h-8 rounded-full bg-white text-[#181F18] group-hover/card:bg-[#2E7D32] group-hover/card:text-white flex items-center justify-center shrink-0 transition-all duration-300 shadow-sm">
                          <ArrowRight className="w-4 h-4 group-hover/card:translate-x-0.5 transition-transform" />
                        </div>
                      </Link>

                    </div>
                  </>
                )}
              </div>
            </div>
              )}
            </div>

            {secondNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 relative flex items-center ${
                    isActive
                      ? 'bg-[#2E7D32] text-white shadow-md font-bold border border-[#4ADE80]/40'
                      : 'text-[#2D3E2D] hover:text-[#181F18] hover:bg-[#F0ECE1]'
                  }`}
                >
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Action Controls: Dynamic Auth State + Quick Book Dropdown + Drawer Trigger */}
          <div className="flex items-center gap-3">
            {/* If NOT Authenticated: Show Sign In Button */}
            {!isAuthenticated ? (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-md hover:scale-105 bg-[#FAF9F5] hover:bg-[#F0ECE1] text-[#181F18] border border-[#DDD7CA] hover:border-[#185ADB]"
              >
                <User className="w-3.5 h-3.5 text-[#185ADB]" />
                <span>Sign In</span>
              </Link>
            ) : (
              /* If Authenticated: Show User Profile Avatar & Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-sm group select-none bg-white hover:bg-[#FAF9F5] border border-[#DDD7CA] hover:border-[#2E7D32] text-[#181F18]"
                  aria-expanded={profileDropdownOpen}
                >
                  <span className="text-xs sm:text-sm font-bold text-[#181F18]">
                    {(() => {
                      const first = (displayName || '').trim().split(/\s+/)[0] || 'Member';
                      return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
                    })()}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 text-[#5C665C] group-hover:text-[#181F18] ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Floating Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white text-[#181F18] border border-[#DDD7CA] shadow-[0_20px_50px_rgba(0,0,0,0.18)] p-2 z-50 animate-fadeIn font-sans">
                    {/* User Info Header */}
                    <div className="px-3 py-2.5 border-b border-[#EAE5DB] mb-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#181F18] truncate block">{displayName}</span>
                        <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ${admin ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-[#E8F5E9] text-[#1B5E20] border border-[#A5D6A7]'}`}>
                          {displayRole}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#5C665C] truncate block mt-0.5">{displayEmail}</span>
                    </div>

                    {/* Navigation Items */}
                    <div className="space-y-0.5 text-xs">
                      <Link
                        href="/user/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#2D3E2D] hover:text-[#181F18] hover:bg-[#FAF9F5] transition-colors font-medium"
                      >
                        <UserCheck className="w-4 h-4 text-[#2E7D32]" />
                        <span>Member Dashboard</span>
                      </Link>

                      <Link
                        href="/user/bookings"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#2D3E2D] hover:text-[#181F18] hover:bg-[#E8F5E9] transition-colors font-medium"
                      >
                        <CalendarCheck2 className="w-4 h-4 text-[#2E7D32]" />
                        <span>My Bookings</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-amber-800 hover:text-amber-950 hover:bg-amber-50 transition-colors font-semibold"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          <span>Admin Control Center</span>
                        </Link>
                      )}
                    </div>

                    {/* Logout Button */}
                    <div className="pt-1 mt-1 border-t border-[#EAE5DB]">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors text-xs font-semibold cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Sign Out / Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* "Book a Tour" Action Button (Redirects to Contact Us / Schedule Visit) */}
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center gap-2 bg-[#2E7D32] hover:bg-[#1E5C23] text-white font-semibold text-xs sm:text-sm rounded-full px-4 sm:px-5 py-2.5 shadow-lg border border-[#4ADE80]/40 transition-all hover:scale-105 cursor-pointer select-none group"
            >
              <Calendar className="w-3.5 h-3.5 text-[#86EFAC] group-hover:rotate-12 transition-transform" />
              <span>Book a Tour</span>
            </Link>

            {/* Mobile Responsive "Book a Tour" CTA Button */}
            <Link
              href="/contact"
              className="md:hidden inline-flex items-center gap-1.5 bg-[#2E7D32] hover:bg-[#1E5C23] text-white font-semibold text-xs sm:text-sm rounded-full px-3.5 py-2 shadow-sm border border-[#4ADE80]/30 transition-all active:scale-95 shrink-0"
            >
              <Calendar className="w-3.5 h-3.5 text-[#86EFAC]" />
              <span>Book a Tour</span>
            </Link>

            {/* Mobile Drawer Trigger (ONLY visible in mobile/tablet, hidden on desktop lg:hidden) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2.5 rounded-xl transition-all cursor-pointer shadow-sm hover:scale-105 text-[#181F18] bg-[#FAF9F5] hover:bg-[#EAE5DB] border border-[#DDD7CA]"
              aria-label="Open side drawer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Backdrop overlay for Right Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* RIGHT SIDE APP DRAWER (Matching Navbar White Aesthetic) */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-50 w-[320px] sm:w-[380px] bg-white text-[#181F18] shadow-2xl border-l border-[#EAE5DB] flex flex-col justify-between p-6 sm:p-8 overflow-y-auto transform transition-all duration-300 ease-in-out font-sans ${
          mobileMenuOpen ? 'translate-x-0 opacity-100 pointer-events-auto visible' : 'translate-x-full opacity-0 pointer-events-none invisible'
        }`}
      >
        {/* Drawer Header with Logo and Close X Button */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-[#EAE5DB]">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 group">
              <div className="p-1 transition-all duration-300 transform group-hover:scale-105">
                <img
                  src="/images/logo.png"
                  alt="EnCourtyard"
                  className="h-12 w-auto object-contain"
                />
              </div>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl bg-[#FAF9F5] text-[#738273] hover:text-[#181F18] hover:bg-[#EAE5DB] transition-colors cursor-pointer border border-[#DDD7CA]"
              aria-label="Close menu drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links with Active State & Right Chevrons */}
          <div className="py-6 space-y-1.5">
            {firstNavLinks.map((link) => {
              const isActive =
                link.href === '/book-space'
                  ? pathname === '/book-space' && !isDayPassPage
                  : pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all group ${
                    isActive
                      ? 'bg-[#2E7D32] text-white shadow-sm font-bold border border-[#2E7D32]'
                      : 'text-[#2D3E2D] hover:text-[#181F18] hover:bg-[#F3EFE6]'
                  }`}
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {link.name}
                  </span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-white' : 'text-[#738273] group-hover:text-[#181F18]'}`} />
                </Link>
              );
            })}

            {/* Quick Booking Dropdown Accordion in Mobile Drawer (Directly after Book Space) */}
            <div className="pt-0.5">
              <button
                type="button"
                onClick={() => setMobileQuickBookOpen(!mobileQuickBookOpen)}
                className={`w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all group cursor-pointer ${
                  isQuickActive
                    ? 'bg-[#2E7D32] text-white shadow-sm font-bold border border-[#2E7D32]'
                    : mobileQuickBookOpen
                    ? 'bg-[#FAF9F5] text-[#181F18] border border-[#DDD7CA]'
                    : 'text-[#2D3E2D] hover:text-[#181F18] hover:bg-[#F3EFE6] border border-transparent'
                }`}
                aria-expanded={mobileQuickBookOpen}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className={`w-4 h-4 ${isQuickActive ? 'text-white' : 'text-[#2E7D32]'}`} />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    Quick Booking
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isQuickActive ? 'text-white' : 'text-[#738273]'
                  } ${mobileQuickBookOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Sub-menu options dropdown */}
              {mobileQuickBookOpen && (
                <div className="mt-2 ml-2 pl-3 border-l-2 border-[#2E7D32]/30 space-y-1.5 animate-fadeIn">
                  {/* Item 1: Day Pass (1-Day Access) with Inline Calendar */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Link
                        href="/book-space?plan=day-pass"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex-1 px-3 py-2.5 rounded-lg text-xs flex items-center justify-between transition-all ${
                          isDayPassActive
                            ? 'text-white bg-[#2E7D32] hover:bg-[#1E5C23] border border-[#2E7D32] shadow-sm font-semibold'
                            : 'text-[#181F18] bg-[#FAF9F5] hover:bg-[#F0ECE1] border border-[#DDD7CA] font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className={`w-3.5 h-3.5 ${isDayPassActive ? 'text-white' : 'text-[#2E7D32]'}`} />
                          <span>Day Pass (1-Day Access)</span>
                        </div>
                        <ArrowRight className={`w-3.5 h-3.5 ${isDayPassActive ? 'text-white' : 'text-[#738273]'}`} />
                      </Link>
                      <button
                        type="button"
                        title="Pick Date for Day Pass"
                        onClick={() => setMobileDayPassCalendarOpen((prev) => !prev)}
                        className="p-2.5 rounded-lg bg-[#FAF9F5] hover:bg-[#F0ECE1] border border-[#DDD7CA] text-[#738273] hover:text-[#181F18] transition-colors cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Inline Calendar on Mobile */}
                    {mobileDayPassCalendarOpen && (
                      <div className="animate-fadeIn">
                        <DayPassCalendar
                          onSelectDate={(ymd) => {
                            setMobileMenuOpen(false);
                            setMobileDayPassCalendarOpen(false);
                            router.push(
                              `/book-space?plan=day-pass&date=${encodeURIComponent(ymd)}&startTime=${encodeURIComponent('09:00 AM')}&endTime=${encodeURIComponent('06:00 PM')}`
                            );
                          }}
                          onCancel={() => setMobileDayPassCalendarOpen(false)}
                          showTitle={true}
                        />
                      </div>
                    )}
                  </div>

                  {/* Item 2: Conference Hall */}
                  <Link
                    href="/conference-hall"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full px-3 py-2.5 rounded-lg text-xs flex items-center justify-between transition-all ${
                      isConferenceActive
                        ? 'text-white bg-[#2E7D32] hover:bg-[#1E5C23] border border-[#2E7D32] shadow-sm font-semibold'
                        : 'text-[#181F18] bg-[#FAF9F5] hover:bg-[#F0ECE1] border border-[#DDD7CA] font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Users className={`w-3.5 h-3.5 ${isConferenceActive ? 'text-white' : 'text-[#C29B38]'}`} />
                      <span>Conference Hall</span>
                    </div>
                    <ArrowRight className={`w-3.5 h-3.5 ${isConferenceActive ? 'text-white' : 'text-[#738273]'}`} />
                  </Link>

                  {/* Item 3: Meeting Rooms */}
                  <Link
                    href="/meeting-rooms"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full px-3 py-2.5 rounded-lg text-xs flex items-center justify-between transition-all ${
                      pathname === '/meeting-rooms'
                        ? 'text-white bg-[#2E7D32] hover:bg-[#1E5C23] border border-[#2E7D32] shadow-sm font-semibold'
                        : 'text-[#181F18] bg-[#FAF9F5] hover:bg-[#F0ECE1] border border-[#DDD7CA] font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Monitor className={`w-3.5 h-3.5 ${pathname === '/meeting-rooms' ? 'text-white' : 'text-[#2E7D32]'}`} />
                      <span>Meeting Rooms</span>
                    </div>
                    <ArrowRight className={`w-3.5 h-3.5 ${pathname === '/meeting-rooms' ? 'text-white' : 'text-[#738273]'}`} />
                  </Link>
                </div>
              )}
            </div>

            {secondNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all group ${
                    isActive
                      ? 'bg-[#2E7D32] text-white shadow-sm font-bold border border-[#2E7D32]'
                      : 'text-[#2D3E2D] hover:text-[#181F18] hover:bg-[#F3EFE6]'
                  }`}
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {link.name}
                  </span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-white' : 'text-[#738273] group-hover:text-[#181F18]'}`} />
                </Link>
              );
            })}

            {/* Account & Portal Section in Drawer */}
            <div className="pt-3 border-t border-[#EAE5DB] mt-3 space-y-2">
              {!isAuthenticated ? (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] hover:bg-[#F0ECE1] text-[#181F18] text-xs font-semibold flex items-center justify-between transition-all border border-[#DDD7CA]"
                  >
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#2E7D32]" />
                      Member Sign In
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#738273]" />
                  </Link>

                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white text-xs font-semibold flex items-center justify-between transition-all border border-[#2E7D32] shadow-sm"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-white" />
                      Create Account
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-white/80" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-2 bg-[#FAF9F5] p-3 rounded-2xl border border-[#DDD7CA]">
                  <div className="flex items-center gap-3 pb-2 border-b border-[#EAE5DB]">
                    <div className="w-8 h-8 rounded-full bg-[#2E7D32] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {(displayName || 'M').charAt(0).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-bold text-[#181F18] block truncate">{displayName}</span>
                      <span className="text-[10px] text-[#5C665C] block truncate">{displayEmail}</span>
                    </div>
                  </div>

                  <Link
                    href="/user/bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between text-[#2D3E2D] hover:bg-[#E8F5E9] transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <CalendarCheck2 className="w-4 h-4 text-[#2E7D32]" />
                      My Bookings
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#738273]" />
                  </Link>

                  <Link
                    href="/user/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between text-[#2D3E2D] hover:bg-[#F0ECE1] transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-[#185ADB]" />
                      My Dashboard
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#738273]" />
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between text-amber-800 hover:bg-amber-100/60 transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        Admin Command Center
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-700" />
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <LogOut className="w-4 h-4 text-red-500" />
                      Sign Out
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle/Bottom Contact & Social Info (Exact Layout with Clean White Aesthetic) */}
        <div className="pt-6 border-t border-[#EAE5DB] space-y-6">

          {/* CONTACT INFO SECTION */}
          <div className="space-y-3.5 text-left">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#5C665C] font-bold block">
              Contact Info
            </span>

            <div className="flex items-center gap-3 text-xs text-[#2D3E2D]">
              <div className="w-8 h-8 rounded-full bg-[#E11D48]/10 text-[#E11D48] flex items-center justify-center shrink-0 border border-[#E11D48]/20">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <a href="tel:+919908209993" className="hover:text-[#185ADB] font-semibold transition-colors">
                +91 99082 09993
              </a>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#2D3E2D]">
              <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/10 text-[#7C3AED] flex items-center justify-center shrink-0 border border-[#8B5CF6]/20">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <a href="mailto:info@encourtyard.com" className="hover:text-[#185ADB] font-semibold transition-colors truncate">
                info@encourtyard.com
              </a>
            </div>

            <div className="flex items-start gap-3 text-xs text-[#2D3E2D]">
              <div className="w-8 h-8 rounded-full bg-[#06B6D4]/10 text-[#0891B2] flex items-center justify-center shrink-0 mt-0.5 border border-[#06B6D4]/20">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span className="text-[#5C665C] leading-snug font-normal">
                H.No. 6-2-981, Flat No. 101, Maruthi Plaza, Shadan College Road, Above Axis Bank, Khairtabad, Hyderabad - 500004, Telangana
              </span>
            </div>
          </div>

          {/* FOLLOW US SECTION */}
          <div className="space-y-2.5 text-left">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#5C665C] font-bold block">
              Follow Us
            </span>
            <div className="flex items-center gap-2">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#FAF9F5] text-[#181F18] border border-[#DDD7CA] flex items-center justify-center hover:bg-[#185ADB] hover:text-white hover:border-[#185ADB] transition-colors" aria-label="LinkedIn">
                <LinkedInIcon />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#FAF9F5] text-[#181F18] border border-[#DDD7CA] flex items-center justify-center hover:bg-[#185ADB] hover:text-white hover:border-[#185ADB] transition-colors" aria-label="Twitter">
                <TwitterXIcon />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#FAF9F5] text-[#181F18] border border-[#DDD7CA] flex items-center justify-center hover:bg-[#185ADB] hover:text-white hover:border-[#185ADB] transition-colors" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#FAF9F5] text-[#181F18] border border-[#DDD7CA] flex items-center justify-center hover:bg-[#185ADB] hover:text-white hover:border-[#185ADB] transition-colors" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#FAF9F5] text-[#181F18] border border-[#DDD7CA] flex items-center justify-center hover:bg-[#185ADB] hover:text-white hover:border-[#185ADB] transition-colors" aria-label="YouTube">
                <YouTubeIcon />
              </a>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};
