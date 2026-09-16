'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const WhyEnCourtyard: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-22 primary-section-bg border-b border-[#E5E1D8] relative overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Outer Section Banner Card */}
        <div className="relative rounded-[28px] sm:rounded-[36px] lg:rounded-[40px] bg-[#FBF9F4] border border-[#E8E2D6] shadow-[0_10px_35px_-12px_rgba(38,54,38,0.06)] overflow-hidden p-6 sm:p-8 lg:p-10 xl:p-12">

          {/* Organic 3D Layered Architectural Backdrop Accents */}
          <div
            className="hidden lg:block absolute top-0 left-[41%] w-[380px] h-[380px] rounded-tl-[100px] rounded-tr-[180px] rounded-bl-[120px] bg-gradient-to-br from-[#ECE7DB]/80 to-[#DFD8C8]/50 pointer-events-none z-0"
            aria-hidden="true"
          />
          <div
            className="hidden lg:block absolute -bottom-10 left-[38%] w-[160px] h-[160px] rounded-full bg-[#E5DFD1]/60 pointer-events-none z-0"
            aria-hidden="true"
          />

          {/* Main Grid Layout: Left Content & Right Image + Floating Card */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-10 items-center">

            {/* LEFT SIDE — CONTENT PANEL */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-between h-full space-y-6 lg:space-y-7">

              {/* Eyebrow & Main Heading (Bold with matching global typography color) */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#738273] font-bold block">
                  WHY ENCOURTYARD?
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-bold text-[#181F18] leading-[1.14] tracking-tight">
                  A Workspace <br className="hidden sm:inline" />
                  That Works for You
                </h2>
              </div>

              {/* Supporting Paragraph */}
              <p className="text-sm sm:text-[15px] text-[#5C665C] leading-relaxed font-sans max-w-lg">
                We're more than just a place to work — we're a community. At EnCourtyard, we bring together people, ideas and opportunities to help you grow.
              </p>

              {/* Dark Olive Rounded CTA Button */}
              <div className="pt-1">
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-3 bg-[#263724] hover:bg-[#344A32] text-white px-7 py-3.5 rounded-full font-sans text-sm font-medium transition-all duration-300 shadow-[0_4px_16px_rgba(38,55,36,0.22)] hover:shadow-[0_8px_24px_rgba(38,55,36,0.3)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Discover Our Story</span>
                  <ArrowRight className="w-4 h-4 text-white/90 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>

              {/* LEFT BOTTOM — 4 STATISTICS IN INDIVIDUAL GLASS CARDS WITH ZERO OVERFLOW */}
              <div className="pt-6 sm:pt-8 border-t border-[#E5E0D5]/80">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">

                  {/* Stat 1: 500+ Businesses */}
                  <div className="group/stat flex flex-col justify-between p-3 sm:p-3.5 rounded-2xl bg-white/85 hover:bg-white backdrop-blur-md border border-white/90 hover:border-[#263724]/30 shadow-[0_4px_14px_-2px_rgba(24,31,24,0.06)] hover:shadow-[0_12px_24px_-4px_rgba(24,31,24,0.15)] transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-7 h-7 rounded-lg bg-[#F4F1E8] border border-[#E4DFD2] flex items-center justify-center shrink-0 text-[#263724] group-hover/stat:bg-[#263724] group-hover/stat:border-[#263724] group-hover/stat:text-white transition-all duration-300 shadow-xs">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <circle cx="12" cy="7" r="3.5" />
                          <circle cx="6.5" cy="17" r="3.5" />
                          <circle cx="17.5" cy="17" r="3.5" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <span className="font-serif text-lg sm:text-xl lg:text-[22px] font-bold text-[#181F18] group-hover/stat:text-[#263724] tracking-tight transition-colors duration-300 block leading-tight">
                        50+
                      </span>
                      <span className="text-[11px] sm:text-xs text-[#5C665C] group-hover/stat:text-[#384A36] font-sans font-medium transition-colors duration-300 block mt-0.5">
                        Businesses
                      </span>
                    </div>
                  </div>

                  {/* Stat 2: 10,000+ Professionals */}
                  <div className="group/stat flex flex-col justify-between p-3 sm:p-3.5 rounded-2xl bg-white/85 hover:bg-white backdrop-blur-md border border-white/90 hover:border-[#263724]/30 shadow-[0_4px_14px_-2px_rgba(24,31,24,0.06)] hover:shadow-[0_12px_24px_-4px_rgba(24,31,24,0.15)] transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-7 h-7 rounded-lg bg-[#F4F1E8] border border-[#E4DFD2] flex items-center justify-center shrink-0 text-[#263724] group-hover/stat:bg-[#263724] group-hover/stat:border-[#263724] group-hover/stat:text-white transition-all duration-300 shadow-xs">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <circle cx="12" cy="12" r="8" />
                          <circle cx="12" cy="12" r="3.5" />
                          <path d="M12 4v4M12 16v4M4 12h4M16 12h4" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <span className="font-serif text-lg sm:text-xl lg:text-[22px] font-bold text-[#181F18] group-hover/stat:text-[#263724] tracking-tight transition-colors duration-300 block leading-tight">
                        100+
                      </span>
                      <span className="text-[11px] sm:text-xs text-[#5C665C] group-hover/stat:text-[#384A36] font-sans font-medium transition-colors duration-300 block mt-0.5">
                        Professionals
                      </span>
                    </div>
                  </div>

                  {/* Stat 3: 8 Cities */}
                  <div className="group/stat flex flex-col justify-between p-3 sm:p-3.5 rounded-2xl bg-white/85 hover:bg-white backdrop-blur-md border border-white/90 hover:border-[#263724]/30 shadow-[0_4px_14px_-2px_rgba(24,31,24,0.06)] hover:shadow-[0_12px_24px_-4px_rgba(24,31,24,0.15)] transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-7 h-7 rounded-lg bg-[#F4F1E8] border border-[#E4DFD2] flex items-center justify-center shrink-0 text-[#263724] group-hover/stat:bg-[#263724] group-hover/stat:border-[#263724] group-hover/stat:text-white transition-all duration-300 shadow-xs">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <circle cx="12" cy="12" r="8" />
                          <circle cx="12" cy="12" r="3" fill="currentColor" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <span className="font-serif text-lg sm:text-xl lg:text-[22px] font-bold text-[#181F18] group-hover/stat:text-[#263724] tracking-tight transition-colors duration-300 block leading-tight">
                        8
                      </span>
                      <span className="text-[11px] sm:text-xs text-[#5C665C] group-hover/stat:text-[#384A36] font-sans font-medium transition-colors duration-300 block mt-0.5">
                        Cities
                      </span>
                    </div>
                  </div>

                  {/* Stat 4: 5+ Years Of Excellence */}
                  <div className="group/stat flex flex-col justify-between p-3 sm:p-3.5 rounded-2xl bg-white/85 hover:bg-white backdrop-blur-md border border-white/90 hover:border-[#263724]/30 shadow-[0_4px_14px_-2px_rgba(24,31,24,0.06)] hover:shadow-[0_12px_24px_-4px_rgba(24,31,24,0.15)] transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-7 h-7 rounded-lg bg-[#F4F1E8] border border-[#E4DFD2] flex items-center justify-center shrink-0 text-[#263724] group-hover/stat:bg-[#263724] group-hover/stat:border-[#263724] group-hover/stat:text-white transition-all duration-300 shadow-xs">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <circle cx="12" cy="12" r="8" />
                          <path d="M12 7l1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5L7 10.5l3.5-.5z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <span className="font-serif text-lg sm:text-xl lg:text-[22px] font-bold text-[#181F18] group-hover/stat:text-[#263724] tracking-tight transition-colors duration-300 block leading-tight whitespace-nowrap">
                        2+ Years
                      </span>
                      <span className="text-[11px] sm:text-xs text-[#5C665C] group-hover/stat:text-[#384A36] font-sans font-medium transition-colors duration-300 block mt-0.5 whitespace-nowrap">
                        Of Excellence
                      </span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* RIGHT SIDE — COWORKING INTERIOR IMAGE WITH BOTTOM-ALIGNED GLASS POPUP CARDS */}
            <div className="lg:col-span-6 xl:col-span-6 relative">

              {/* Panoramic Interior Image Container */}
              <div className="relative rounded-2xl sm:rounded-3xl lg:rounded-[28px] overflow-hidden shadow-[0_16px_36px_-6px_rgba(24,31,24,0.15)] border border-[#DED8CB] h-[360px] sm:h-[430px] lg:h-[470px] xl:h-[490px] w-full">
                <img
                  src="/images/why.png"
                  alt="EnCourtyard Coworking Interior Lounge"
                  className="w-full h-full object-cover object-[center_35%] transform hover:scale-[1.02] transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>

              {/* BOTTOM-ALIGNED RIGHT-SIDE FLOATING FEATURE CONTAINER: 3 ITEMS WITH GLASS BG & POPUP HOVER */}
              <div className="lg:absolute lg:bottom-4 lg:right-3 xl:bottom-5 xl:right-4 mt-5 lg:mt-0 w-full lg:w-[245px] xl:w-[260px] z-20 space-y-2.5 sm:space-y-3">

                {/* Feature 1: Flexible Plans */}
                <div className="group/item flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl bg-white/85 hover:bg-white backdrop-blur-md border border-white/80 hover:border-[#263724]/30 shadow-[0_8px_20px_-4px_rgba(24,31,24,0.08)] hover:shadow-[0_16px_32px_-4px_rgba(24,31,24,0.18)] transform hover:-translate-y-1 hover:scale-[1.03] transition-all duration-300 cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-[#F4F1E8] border border-[#E4DFD2] flex items-center justify-center shrink-0 text-[#263724] group-hover/item:bg-[#263724] group-hover/item:border-[#263724] group-hover/item:text-white transition-all duration-300 shadow-sm">
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                      <line x1="8" y1="2" x2="8" y2="18" />
                      <line x1="16" y1="6" x2="16" y2="22" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-[13px] sm:text-sm text-[#181F18] group-hover/item:text-[#263724] transition-colors duration-300">
                      Flexible Plans
                    </h4>
                    <p className="text-[11px] text-[#6A786A] group-hover/item:text-[#384A36] font-sans mt-0.5 leading-snug transition-colors duration-300">
                      Scale as you grow
                    </p>
                  </div>
                </div>

                {/* Feature 2: Modern Amenities */}
                <div className="group/item flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl bg-white/85 hover:bg-white backdrop-blur-md border border-white/80 hover:border-[#263724]/30 shadow-[0_8px_20px_-4px_rgba(24,31,24,0.08)] hover:shadow-[0_16px_32px_-4px_rgba(24,31,24,0.18)] transform hover:-translate-y-1 hover:scale-[1.03] transition-all duration-300 cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-[#F4F1E8] border border-[#E4DFD2] flex items-center justify-center shrink-0 text-[#263724] group-hover/item:bg-[#263724] group-hover/item:border-[#263724] group-hover/item:text-white transition-all duration-300 shadow-sm">
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-[13px] sm:text-sm text-[#181F18] group-hover/item:text-[#263724] transition-colors duration-300">
                      Modern Amenities
                    </h4>
                    <p className="text-[11px] text-[#6A786A] group-hover/item:text-[#384A36] font-sans mt-0.5 leading-snug transition-colors duration-300">
                      Everything you need
                    </p>
                  </div>
                </div>

                {/* Feature 3: Vibrant Community */}
                <div className="group/item flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl bg-white/85 hover:bg-white backdrop-blur-md border border-white/80 hover:border-[#263724]/30 shadow-[0_8px_20px_-4px_rgba(24,31,24,0.08)] hover:shadow-[0_16px_32px_-4px_rgba(24,31,24,0.18)] transform hover:-translate-y-1 hover:scale-[1.03] transition-all duration-300 cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-[#F4F1E8] border border-[#E4DFD2] flex items-center justify-center shrink-0 text-[#263724] group-hover/item:bg-[#263724] group-hover/item:border-[#263724] group-hover/item:text-white transition-all duration-300 shadow-sm">
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <circle cx="12" cy="9" r="2.5" />
                      <path d="M7 16c0-2 2.5-3 5-3s5 1 5 3" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-[13px] sm:text-sm text-[#181F18] group-hover/item:text-[#263724] transition-colors duration-300">
                      Vibrant Community
                    </h4>
                    <p className="text-[11px] text-[#6A786A] group-hover/item:text-[#384A36] font-sans mt-0.5 leading-snug transition-colors duration-300">
                      Network, collaborate, grow
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
