'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, MapPin, Phone, Clock, ChevronRight, Sparkles, ShieldCheck } from 'lucide-react';

// Brand Social SVG Icons with fill-current so color adapts to hover
const LinkedInIcon = () => (
  <svg className="w-4 h-4 fill-current transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const TwitterXIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4 fill-none stroke-current stroke-2 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YouTubeIcon = () => (
  <svg className="w-4 h-4 fill-current transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  // Do not render main website footer on Admin portal pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="relative bg-white text-[#0F172A] border-t border-[#EAE5DB] shadow-[0_-8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
      
      {/* Top Hairline Botanical Accent */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#2E7D32] to-transparent opacity-90" />

      {/* Subtle Natural Warmth Ambient Glows */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#2E7D32]/[0.025] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#FAF9F5] rounded-full blur-2xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12 sm:pt-16 sm:pb-14 z-10">
        
        {/* Main 4-Column Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Col 1: Brand, Tagline & Social Links (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link
              href="/"
              className="inline-flex items-center transition-all duration-300 transform hover:scale-[1.03]"
              aria-label="EnCourtyard Home"
            >
              <img
                src="/images/logo.png"
                alt="EnCourtyard"
                className="h-16 sm:h-16 w-auto object-contain"
              />
            </Link>

            <p className="text-sm text-[#475569] font-sans leading-relaxed max-w-sm">
              Handcrafted coworking sanctuaries and executive workspaces designed to foster deep focus, organic networking, and scalable business momentum.
            </p>

            {/* Quality Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF9F5] border border-[#EAE5DB] text-xs font-semibold text-[#166534] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Premium Botanical Coworking • Hyderabad</span>
            </div>

            {/* Social Media Links with Original Brand Hover Colors */}
            <div className="pt-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] block mb-3 font-bold">
                Connect With Us
              </span>
              <div className="flex items-center gap-3">
                
                {/* LinkedIn - Original Blue on Hover (#0A66C2) */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  onMouseEnter={() => setHoveredSocial('linkedin')}
                  onMouseLeave={() => setHoveredSocial(null)}
                  style={{
                    backgroundColor: hoveredSocial === 'linkedin' ? '#0A66C2' : undefined,
                    borderColor: hoveredSocial === 'linkedin' ? '#0A66C2' : undefined,
                    color: hoveredSocial === 'linkedin' ? '#ffffff' : undefined,
                    boxShadow: hoveredSocial === 'linkedin' ? '0 6px 20px rgba(10, 102, 194, 0.4)' : undefined,
                    transform: hoveredSocial === 'linkedin' ? 'translateY(-3px) scale(1.06)' : undefined,
                  }}
                  className="group social-hover-linkedin w-10 h-10 rounded-xl bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:text-white hover:shadow-[0_6px_20px_rgba(10,102,194,0.4)] hover:-translate-y-1 hover:scale-105 flex items-center justify-center cursor-pointer shadow-xs transition-all duration-300"
                >
                  <LinkedInIcon />
                </a>

                {/* Twitter / X - Original Black on Hover (#000000) */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter / X"
                  onMouseEnter={() => setHoveredSocial('twitter')}
                  onMouseLeave={() => setHoveredSocial(null)}
                  style={{
                    backgroundColor: hoveredSocial === 'twitter' ? '#000000' : undefined,
                    borderColor: hoveredSocial === 'twitter' ? '#000000' : undefined,
                    color: hoveredSocial === 'twitter' ? '#ffffff' : undefined,
                    boxShadow: hoveredSocial === 'twitter' ? '0 6px 20px rgba(0, 0, 0, 0.35)' : undefined,
                    transform: hoveredSocial === 'twitter' ? 'translateY(-3px) scale(1.06)' : undefined,
                  }}
                  className="group social-hover-twitter w-10 h-10 rounded-xl bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] hover:bg-black hover:border-black hover:text-white hover:shadow-[0_6px_20px_rgba(0,0,0,0.35)] hover:-translate-y-1 hover:scale-105 flex items-center justify-center cursor-pointer shadow-xs transition-all duration-300"
                >
                  <TwitterXIcon />
                </a>

                {/* Instagram - Original Gradient on Hover */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  onMouseEnter={() => setHoveredSocial('instagram')}
                  onMouseLeave={() => setHoveredSocial(null)}
                  style={{
                    background: hoveredSocial === 'instagram' ? 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' : undefined,
                    borderColor: hoveredSocial === 'instagram' ? 'transparent' : undefined,
                    color: hoveredSocial === 'instagram' ? '#ffffff' : undefined,
                    boxShadow: hoveredSocial === 'instagram' ? '0 6px 20px rgba(220, 39, 67, 0.4)' : undefined,
                    transform: hoveredSocial === 'instagram' ? 'translateY(-3px) scale(1.06)' : undefined,
                  }}
                  className="group social-hover-instagram w-10 h-10 rounded-xl bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] hover:border-transparent hover:text-white hover:shadow-[0_6px_20px_rgba(220,39,67,0.4)] hover:-translate-y-1 hover:scale-105 flex items-center justify-center cursor-pointer shadow-xs transition-all duration-300"
                >
                  <InstagramIcon />
                </a>

                {/* YouTube - Original Red on Hover (#FF0000) */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  onMouseEnter={() => setHoveredSocial('youtube')}
                  onMouseLeave={() => setHoveredSocial(null)}
                  style={{
                    backgroundColor: hoveredSocial === 'youtube' ? '#FF0000' : undefined,
                    borderColor: hoveredSocial === 'youtube' ? '#FF0000' : undefined,
                    color: hoveredSocial === 'youtube' ? '#ffffff' : undefined,
                    boxShadow: hoveredSocial === 'youtube' ? '0 6px 20px rgba(255, 0, 0, 0.4)' : undefined,
                    transform: hoveredSocial === 'youtube' ? 'translateY(-3px) scale(1.06)' : undefined,
                  }}
                  className="group social-hover-youtube w-10 h-10 rounded-xl bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] hover:bg-[#FF0000] hover:border-[#FF0000] hover:text-white hover:shadow-[0_6px_20px_rgba(255,0,0,0.4)] hover:-translate-y-1 hover:scale-105 flex items-center justify-center cursor-pointer shadow-xs transition-all duration-300"
                >
                  <YouTubeIcon />
                </a>

              </div>
            </div>
          </div>

          {/* Col 2: Quick Links (2.5 cols) */}
          <div className="lg:col-span-2 sm:col-span-1 space-y-3.5">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#166534] bg-[#2E7D32]/10 px-2 py-0.5 rounded inline-block mb-1.5">
                Explore
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight">
                Quick Links
              </h3>
              <div className="w-10 h-[2.5px] bg-[#2E7D32] mt-2 mb-3 rounded-full" />
            </div>
            
            <ul className="space-y-1">
              {[
                { label: 'Home', href: '/' },
                { label: 'Book Space', href: '/book-space' },
                { label: 'Day Pass', href: '/book-space?plan=day-pass' },
                { label: 'Conference Hall', href: '/conference-hall' },
                { label: 'Schedule Visit', href: '/contact' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="group flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-[#F0FDF4] text-[#334155] hover:text-[#15803d] font-semibold text-[13px] sm:text-sm transition-all duration-200 border border-transparent hover:border-[#BBF7D0]"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.label}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#15803d] group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Explore & Support (2.5 cols) */}
          <div className="lg:col-span-2 sm:col-span-1 space-y-3.5">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#166534] bg-[#2E7D32]/10 px-2 py-0.5 rounded inline-block mb-1.5">
                Support
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight">
                Explore & Support
              </h3>
              <div className="w-10 h-[2.5px] bg-[#2E7D32] mt-2 mb-3 rounded-full" />
            </div>
            
            <ul className="space-y-1">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Hyderabad', href: '/hyderabad' },
                { label: 'Gallery', href: '/gallery' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms & Conditions', href: '/terms' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="group flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-[#F0FDF4] text-[#334155] hover:text-[#15803d] font-semibold text-[13px] sm:text-sm transition-all duration-200 border border-transparent hover:border-[#BBF7D0]"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.label}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#15803d] group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Get in Touch / Contact (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-3.5">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#166534] bg-[#2E7D32]/10 px-2 py-0.5 rounded inline-block mb-1.5">
                Concierge
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight">
                Get in Touch
              </h3>
              <div className="w-10 h-[2.5px] bg-[#2E7D32] mt-2 mb-3 rounded-full" />
            </div>

            <div className="space-y-2.5">
              
              {/* Phone & WhatsApp Card */}
              <a
                href="tel:+919908209993"
                className="group flex items-center gap-3.5 p-3 rounded-2xl bg-[#FAF9F5] hover:bg-white border border-[#EAE5DB] hover:border-[#2E7D32]/50 hover:shadow-md transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-[#2E7D32] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-200">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-[#166534] font-bold font-mono">Direct Phone / WhatsApp</span>
                    <span className="text-[9px] font-bold bg-[#2E7D32]/10 text-[#166534] px-2 py-0.5 rounded-full">Available</span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-[#0F172A] group-hover:text-[#15803d] transition-colors mt-0.5">
                    +91 99082 09993
                  </div>
                </div>
              </a>

              {/* Email Concierge Card */}
              <a
                href="mailto:info@encourtyard.com"
                className="group flex items-center gap-3.5 p-3 rounded-2xl bg-[#FAF9F5] hover:bg-white border border-[#EAE5DB] hover:border-[#2E7D32]/50 hover:shadow-md transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-[#2E7D32] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-200">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#166534] font-bold font-mono block">Email Concierge</span>
                  <div className="text-sm sm:text-base font-bold text-[#0F172A] group-hover:text-[#15803d] transition-colors mt-0.5">
                    info@encourtyard.com
                  </div>
                </div>
              </a>

              {/* Registered Office Card */}
              <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-[#FAF9F5] border border-[#EAE5DB]">
                <div className="w-10 h-10 rounded-xl bg-[#2E7D32]/10 border border-[#2E7D32]/25 text-[#2E7D32] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#166534] font-bold font-mono block">Registered Office</span>
                  <p className="text-xs text-[#334155] font-medium leading-relaxed mt-0.5">
                    H.No. 6-2-981, Flat No. 101, Maruthi Plaza, Shadan College Road, Above Axis Bank, Khairtabad, Hyderabad - 500004, Telangana
                  </p>
                </div>
              </div>

              {/* Operating Hours & GSTIN Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {/* Hours */}
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <Clock className="w-4 h-4 text-[#2E7D32] shrink-0" />
                  <div className="text-[11px] text-[#334155] min-w-0">
                    <span className="text-[#64748B] block text-[9px] uppercase font-mono font-bold">Hours</span>
                    <span className="font-bold text-[#0F172A]">Mon-Sat: 9AM - 7PM</span>
                  </div>
                </div>

                {/* GSTIN */}
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <ShieldCheck className="w-4 h-4 text-[#2E7D32] shrink-0" />
                  <div className="text-[11px] text-[#334155] min-w-0">
                    <span className="text-[#64748B] block text-[9px] uppercase font-mono font-bold">GSTIN Verified</span>
                    <span className="font-mono font-bold text-[#0F172A] truncate block">36AANFE3308E1Z</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Copyright & Status Bar */}
        <div className="mt-12 pt-6 border-t border-[#EAE5DB] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span className="font-medium text-[#475569]">
              © {new Date().getFullYear()} EnCourtyard Workspaces (www.encourtyard.com). All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <span className="inline-flex items-center gap-1.5 text-xs text-[#166534] bg-[#2E7D32]/10 border border-[#2E7D32]/25 px-3 py-1 rounded-full font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" />
              Sanctuary Concierge Online
            </span>
            <span className="text-[#DDD7CA] hidden sm:inline">•</span>
            <span className="font-serif italic font-bold text-[#0F172A] tracking-wide">
              Work. Connect. Grow.
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
