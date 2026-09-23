'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, MapPin, Phone, Clock, Sparkles } from 'lucide-react';

const LinkedInIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const TwitterXIcon = () => (
  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YouTubeIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const Footer: React.FC = () => {
  const pathname = usePathname();

  // Do not render main website footer on Admin portal pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="relative bg-gradient-to-b from-[#1A2D1F] via-[#132217] to-[#0D1710] text-white overflow-hidden">
      
      {/* 1. SHIMMERING METALLIC GOLD ARCHITECTURAL RIBBON (Matching Reference Design) */}
      <div className="relative w-full overflow-hidden select-none z-20">
        {/* Top Hairline Gold Glow */}
        <div className="h-[2px] w-full bg-gradient-to-r from-[#AA771C] via-[#FBF5B7] via-[#DAA520] to-[#AA771C]" />
        
        {/* Main Bold Golden Ribbon Bar */}
        <div className="h-3.5 sm:h-4 w-full bg-gradient-to-r from-[#8C5D14] via-[#DAA520] via-[#FBF5B7] via-[#DAA520] to-[#8C5D14] relative flex justify-center shadow-lg">
          {/* Centered Downward Trapezoid / Notched Architectural Crest */}
          <div
            className="absolute top-0 h-5 sm:h-6 w-44 sm:w-60 bg-gradient-to-b from-[#FBF5B7] via-[#DAA520] to-[#8C5D14] shadow-[0_6px_20px_rgba(0,0,0,0.6)] border-b border-[#FBF5B7]/80"
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 85% 100%, 15% 100%)',
            }}
          />
        </div>

        {/* Secondary Shadow Line */}
        <div className="h-[1.5px] w-full bg-[#2C1C07]" />
      </div>

      {/* 2. VIBRANT BOTANICAL AMBIENT GLOWS & TEXTURE */}
      <div className="absolute -top-20 left-1/4 w-[500px] h-[500px] bg-[#4ADE80]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 left-10 w-[400px] h-[400px] bg-[#2E5E35]/30 rounded-full blur-[100px] pointer-events-none" />

      {/* Subtle Dotted Matrix Texture */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#4ADE80 1.2px, transparent 1.2px)',
          backgroundSize: '36px 36px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 z-10">
        
        {/* 4-Column Clean Open Grid (No Card Enclosures) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Col 1: Brand Logo & Mission (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-5">
            <Link
              href="/"
              className="inline-flex items-center transition-all duration-300 transform hover:scale-105"
              aria-label="EnCourtyard Home"
            >
              <div className="bg-black/40 hover:bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/20 hover:border-[#4ADE80]/70 shadow-[0_6px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_10px_35px_rgba(74,222,128,0.4)] transition-all duration-300">
                <img
                  src="/images/logo.png"
                  alt="EnCourtyard"
                  className="h-14 sm:h-16 w-auto object-contain filter brightness-110 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
                />
              </div>
            </Link>

            <p className="text-xs sm:text-[13px] text-[#DCE6DC] font-sans leading-relaxed max-w-sm">
              Handcrafted coworking sanctuaries and executive workspaces designed to foster deep focus, organic networking, and scalable business momentum.
            </p>

            {/* Social Links */}
            <div className="pt-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#A3B8A3] block mb-3 font-semibold">
                Connect With Us
              </span>
              <div className="flex items-center gap-3">
                {[
                  { name: 'LinkedIn', icon: LinkedInIcon, href: 'https://linkedin.com' },
                  { name: 'Twitter / X', icon: TwitterXIcon, href: 'https://twitter.com' },
                  { name: 'Instagram', icon: InstagramIcon, href: 'https://instagram.com' },
                  { name: 'YouTube', icon: YouTubeIcon, href: 'https://youtube.com' },
                ].map((social, idx) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.name}
                      className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#4ADE80] text-white hover:text-[#0C1A0E] border border-white/20 hover:border-[#4ADE80] flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-[0_0_20px_rgba(74,222,128,0.5)] hover:-translate-y-1"
                    >
                      <Icon />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links (2.5 cols on lg) */}
          <div className="lg:col-span-2 sm:col-span-1 space-y-4">
            <div>
              <h4 className="font-serif text-lg font-bold text-white tracking-wide">
                Quick Links
              </h4>
              <div className="w-8 h-[2.5px] bg-gradient-to-r from-[#FBF5B7] via-[#DAA520] to-transparent mt-2 mb-4 rounded-full" />
            </div>
            
            <ul className="space-y-2.5 text-xs sm:text-[13px]">
              {[
                { label: 'Home', href: '/' },
                { label: 'Book Space', href: '/book-space' },
                { label: 'Workspaces', href: '/workspaces' },
                { label: 'Pricing Plans', href: '/pricing' },
                { label: 'Meeting Rooms', href: '/meeting-rooms' },
                { label: 'About Us', href: '/about' },
                { label: 'Schedule Visit', href: '/about#visit-form' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-[#D2E0D2] hover:text-white transition-all duration-200"
                  >
                    <span className="text-[#DAA520] font-mono text-sm font-bold group-hover:translate-x-1 transition-transform duration-200">
                      ›
                    </span>
                    <span className="group-hover:translate-x-1 group-hover:text-[#4ADE80] transition-all duration-200">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Explore / Resources (2.5 cols on lg) */}
          <div className="lg:col-span-3 sm:col-span-1 space-y-4">
            <div>
              <h4 className="font-serif text-lg font-bold text-white tracking-wide">
                Explore & Support
              </h4>
              <div className="w-8 h-[2.5px] bg-gradient-to-r from-[#FBF5B7] via-[#DAA520] to-transparent mt-2 mb-4 rounded-full" />
            </div>
            
            <ul className="space-y-2.5 text-xs sm:text-[13px]">
              {[
                { label: 'Community Events', href: '/about' },
                { label: 'Member FAQs', href: '/about#faq' },
                { label: 'Virtual Tours', href: '/workspaces' },
                { label: 'Enterprise Solutions', href: '/workspaces' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms & Conditions', href: '/terms' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-[#D2E0D2] hover:text-white transition-all duration-200"
                  >
                    <span className="text-[#DAA520] font-mono text-sm font-bold group-hover:translate-x-1 transition-transform duration-200">
                      ›
                    </span>
                    <span className="group-hover:translate-x-1 group-hover:text-[#4ADE80] transition-all duration-200">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Get in Touch / Contact (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-4">
            <div>
              <h4 className="font-serif text-lg font-bold text-white tracking-wide">
                Get in Touch
              </h4>
              <div className="w-8 h-[2.5px] bg-gradient-to-r from-[#FBF5B7] via-[#DAA520] to-transparent mt-2 mb-4 rounded-full" />
            </div>

            <div className="space-y-3.5 text-xs sm:text-[13px] text-[#D2E0D2]">
              {/* Phone */}
              <a
                href="tel:+919908209993"
                className="group flex items-start gap-3 transition-colors duration-200"
              >
                <div className="w-8 h-8 rounded-xl bg-[#4ADE80]/15 border border-[#4ADE80]/30 flex items-center justify-center text-[#4ADE80] group-hover:bg-[#4ADE80] group-hover:text-[#0C1A0E] transition-colors shrink-0 shadow-xs mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#A3B8A3] block font-mono">Direct Phone / WhatsApp</span>
                  <span className="text-white font-semibold group-hover:text-[#4ADE80] transition-colors">+91 99082 09993</span>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:info@encourtyard.com"
                className="group flex items-start gap-3 transition-colors duration-200"
              >
                <div className="w-8 h-8 rounded-xl bg-[#4ADE80]/15 border border-[#4ADE80]/30 flex items-center justify-center text-[#4ADE80] group-hover:bg-[#4ADE80] group-hover:text-[#0C1A0E] transition-colors shrink-0 shadow-xs mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#A3B8A3] block font-mono">Email Concierge</span>
                  <span className="text-white font-medium group-hover:text-[#4ADE80] transition-colors">info@encourtyard.com</span>
                </div>
              </a>

              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#4ADE80]/15 border border-[#4ADE80]/30 flex items-center justify-center text-[#4ADE80] shrink-0 mt-0.5 shadow-xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#A3B8A3] block font-mono">Registered Office</span>
                  <span className="text-[#E0EBE0] leading-snug">
                    H.No. 6-2-981, Flat No. 101, Maruthi Plaza, Shadan College Road, Above Axis Bank, Khairtabad, Hyderabad - 500004, Telangana
                  </span>
                </div>
              </div>

              {/* GSTIN & Website */}
              <div className="pt-2 border-t border-white/10 space-y-1 font-mono text-[11px] text-[#A3B8A3]">
                <div className="flex items-center justify-between gap-2">
                  <span>GSTIN:</span>
                  <span className="font-bold text-white tracking-wider">36AANFE3308E1Z</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span>Official Website:</span>
                  <span className="text-[#4ADE80]">www.encourtyard.com</span>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-center gap-3 pt-1">
                <div className="w-8 h-8 rounded-xl bg-[#4ADE80]/15 border border-[#4ADE80]/30 flex items-center justify-center text-[#4ADE80] shrink-0 shadow-xs">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#A3B8A3] block font-mono">Operating Hours</span>
                  <span className="text-[#E0EBE0]">Mon - Sat: 9:00 AM - 7:00 PM</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Status Bar */}
        <div className="mt-14 pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A3B8A3]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span>© {new Date().getFullYear()} EnCourtyard Workspaces (www.encourtyard.com). All rights reserved.</span>
            <span className="text-[11px] font-mono text-[#A3B8A3]/80">GSTIN: 36AANFE3308E1Z</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-[#4ADE80] bg-[#4ADE80]/10 border border-[#4ADE80]/30 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
              Sanctuary Concierge Online
            </span>
            <span className="text-white/20 hidden sm:inline">•</span>
            <span className="font-serif italic font-semibold text-white tracking-wide">
              Work. Connect. Grow.
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
