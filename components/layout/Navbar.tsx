'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ArrowRight,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Building2,
  ShieldCheck,
  UserCheck,
  LayoutDashboard,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

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

const YouTubeIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
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

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Workspaces', href: '/workspaces' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Meeting Rooms', href: '/meeting-rooms' },
    { name: 'Book Seats', href: '/book' },
    { name: 'About & Contact', href: '/about' }
  ];

  const portalLinks = [
    { name: 'Member Portal', href: '/dashboard', icon: <UserCheck className="w-3.5 h-3.5" /> },
    { name: 'Admin Insights', href: '/admin', icon: <LayoutDashboard className="w-3.5 h-3.5" /> }
  ];

  const isTransparent = !scrolled && isHome;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled || !isHome
            ? 'bg-[#0E170E]/95 backdrop-blur-2xl border-b border-white/15 shadow-[0_16px_48px_rgba(0,0,0,0.45)]'
            : 'bg-transparent border-b border-transparent shadow-none'
          }`}
      >
        {/* Main Navigation Bar */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 sm:h-28 lg:h-28 flex items-center justify-between">
          
          {/* Brand Logo with Premium Frosted Capsule & Pop-up Hover Effect */}
          <Link
            href="/"
            className="group flex items-center focus:outline-none py-1 transition-all duration-300 transform hover:scale-108 hover:-translate-y-0.5 shrink-0"
            aria-label="EnCourtyard Home"
          >
            <div className="bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/25 hover:border-[#4ADE80]/70 rounded-2xl px-3.5 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(74,222,128,0.4)] transition-all duration-300 flex items-center justify-center">
              <img
                src="/images/logo.png"
                alt="EnCourtyard"
                className="h-16 sm:h-18 lg:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] filter brightness-110"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links (No background container in hero section, active green pill) */}
          <div className="hidden lg:flex items-center gap-1.5 transition-all duration-300">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 relative flex items-center ${isActive
                      ? 'bg-[#2E7D32] text-white shadow-md font-bold border border-[#4ADE80]/40'
                      : 'text-white/90 hover:text-white hover:bg-white/10 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]'
                    }`}
                >
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Action Controls: Schedule a Visit CTA + Mobile Drawer Trigger (Mobile Only) */}
          <div className="flex items-center gap-3">
            {/* Schedule a Visit CTA Button aligned to the right */}
            <Button
              href="/about#visit-form"
              variant="primary"
              size="sm"
              className="hidden sm:inline-flex bg-[#2E7D32] hover:bg-[#388E3C] text-white font-semibold rounded-full px-5 py-2 shadow-lg border border-[#4ADE80]/40 transition-all hover:scale-105"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Schedule a Visit
            </Button>

            {/* Mobile Drawer Trigger (ONLY visible in mobile/tablet, hidden on desktop lg:hidden) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2.5 rounded-xl text-white bg-black/25 hover:bg-black/40 backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-sm hover:scale-105"
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

      {/* RIGHT SIDE APP DRAWER (Matching User Reference Image Design) */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-50 w-[320px] sm:w-[380px] bg-[#141C14] text-white shadow-2xl border-l border-white/10 flex flex-col justify-between p-6 sm:p-8 overflow-y-auto transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Drawer Header with Logo and Close X Button */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 group">
              <div className="bg-black/30 group-hover:bg-black/50 p-2 rounded-2xl border border-white/20 group-hover:border-[#4ADE80]/60 transition-all duration-300 transform group-hover:scale-105">
                <img
                  src="/images/logo.png"
                  alt="EnCourtyard"
                  className="h-12 w-auto object-contain filter brightness-110 drop-shadow-md"
                />
              </div>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Close menu drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links with Active State & Right Chevrons */}
          <div className="py-6 space-y-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all group ${isActive
                      ? 'bg-[#263626] text-[#4ADE80] border border-[#3A4D3A] shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {link.name}
                  </span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-[#4ADE80]' : 'text-white/40 group-hover:text-white'}`} />
                </Link>
              );
            })}

            {/* Portal links in drawer */}
            <div className="pt-2 border-t border-white/10 mt-2 space-y-1.5">
              {portalLinks.map((portal) => {
                const isActive = pathname === portal.href;
                return (
                  <Link
                    key={portal.name}
                    href={portal.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${isActive
                        ? 'bg-[#263626] text-[#4ADE80] border border-[#3A4D3A]'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      {portal.icon}
                      {portal.name}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Middle/Bottom Contact & Social Info (Exact Layout as Reference Image) */}
        <div className="pt-6 border-t border-white/10 space-y-6">

          {/* CONTACT INFO SECTION */}
          <div className="space-y-3.5 text-left">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#A3BFA3] font-bold block">
              Contact Info
            </span>

            <div className="flex items-center gap-3 text-xs text-white/90">
              <div className="w-8 h-8 rounded-full bg-[#E11D48]/20 text-[#FB7185] flex items-center justify-center shrink-0 border border-[#FB7185]/30">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <a href="tel:5552348900" className="hover:text-[#4ADE80] font-medium transition-colors">
                +1 (555) 234-8900
              </a>
            </div>

            <div className="flex items-center gap-3 text-xs text-white/90">
              <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/20 text-[#A78BFA] flex items-center justify-center shrink-0 border border-[#A78BFA]/30">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <a href="mailto:concierge@encourtyard.com" className="hover:text-[#4ADE80] font-medium transition-colors truncate">
                concierge@encourtyard.com
              </a>
            </div>

            <div className="flex items-start gap-3 text-xs text-white/90">
              <div className="w-8 h-8 rounded-full bg-[#06B6D4]/20 text-[#22D3EE] flex items-center justify-center shrink-0 mt-0.5 border border-[#22D3EE]/30">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span className="text-white/80 leading-snug">
                450 Botanical Way, Suite 100, Innovation District
              </span>
            </div>
          </div>

          {/* FOLLOW US SECTION */}
          <div className="space-y-2.5 text-left">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#A3BFA3] font-bold block">
              Follow Us
            </span>
            <div className="flex items-center gap-2">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white text-[#141C14] flex items-center justify-center hover:bg-[#4ADE80] transition-colors" aria-label="LinkedIn">
                <LinkedInIcon />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white text-[#141C14] flex items-center justify-center hover:bg-[#4ADE80] transition-colors" aria-label="Twitter">
                <TwitterXIcon />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white text-[#141C14] flex items-center justify-center hover:bg-[#4ADE80] transition-colors" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white text-[#141C14] flex items-center justify-center hover:bg-[#4ADE80] transition-colors" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white text-[#141C14] flex items-center justify-center hover:bg-[#4ADE80] transition-colors" aria-label="YouTube">
                <YouTubeIcon />
              </a>
            </div>
          </div>

          {/* Full-width CTA button at bottom */}
          <div className="pt-2">
            <Button
              href="/about#visit-form"
              variant="primary"
              size="lg"
              className="w-full justify-center bg-[#2E7D32] hover:bg-[#388E3C] text-white font-semibold py-3.5 rounded-xl border border-[#4ADE80]/30 shadow-lg"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={() => setMobileMenuOpen(false)}
            >
              Schedule a Visit
            </Button>
          </div>

        </div>
      </aside>
    </>
  );
};
