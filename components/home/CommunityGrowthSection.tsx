'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Users, Award, Building2, Sparkles } from 'lucide-react';

export const CommunityGrowthSection: React.FC = () => {
  return (
    <section className="relative py-16 sm:py-22 lg:py-26 bg-white text-[#181F18] border-b border-[#E5E1D8] overflow-hidden">
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Architectural Executive Luxury Card */}
        <div className="relative rounded-[28px] sm:rounded-[36px] lg:rounded-[42px] bg-gradient-to-br from-[#182618] via-[#121E13] to-[#0A120B] border border-[#2D452F] shadow-[0_24px_60px_-15px_rgba(20,32,20,0.35),0_0_1px_1px_rgba(74,222,128,0.1)] overflow-hidden p-6 sm:p-10 lg:p-14 xl:p-16 text-white">

          {/* Botanical Ambient Glows */}
          <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-[#2E7D32]/20 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[340px] h-[340px] bg-[#C29B38]/15 rounded-full blur-[80px] pointer-events-none" />

          {/* Subtle Dotted Ambience */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#4ADE80 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
            
            {/* LEFT SIDE — NARRATIVE & PRIMARY CTA */}
            <div className="lg:col-span-6 xl:col-span-6 space-y-6 text-left">
              
              {/* Green & Gold Eyebrow Badge */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-mono tracking-widest text-[#4ADE80] font-bold uppercase shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[#4ADE80]" />
                  <span>A THRIVING ECOSYSTEM</span>
                </span>
              </div>

              {/* Large Radiant Serif Heading */}
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-bold tracking-tight text-white leading-[1.14]">
                A Community <br className="hidden sm:inline" />
                That Inspires Growth
              </h2>

              {/* Description Paragraph */}
              <p className="text-sm sm:text-base lg:text-[17px] text-[#C4D1C4] font-sans leading-relaxed max-w-lg">
                Network with visionary founders, creative freelancers, and high-growth teams. Experience purposeful events, organic mentorship, and shared ambition.
              </p>

              {/* Obvious Primary Call-to-Action Button */}
              <div className="pt-2">
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-3 bg-white hover:bg-[#F2EEE7] text-[#141F14] px-7 sm:px-8 py-3.5 rounded-full font-sans text-sm font-bold shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                >
                  <span>Join Our Community</span>
                  <ArrowRight className="w-4 h-4 text-[#141F14] group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>

            </div>

            {/* RIGHT SIDE — 4 STATISTICS IN ELEVATED FROSTED GLASS CARDS */}
            <div className="lg:col-span-6 xl:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              
              {/* Card 1: 100+ Events Annually */}
              <div className="bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 hover:border-[#4ADE80]/50 p-5 sm:p-6 rounded-[22px] backdrop-blur-md shadow-xl hover:shadow-2xl transform hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mb-3 text-emerald-400 shadow-sm group-hover:scale-110 transition-transform">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="font-serif text-3xl sm:text-4xl font-bold text-white block tracking-tight">
                  100+
                </span>
                <span className="text-xs sm:text-[13px] text-[#D1E0D1] font-sans font-medium block mt-1">
                  Events Annually
                </span>
              </div>

              {/* Card 2: 5000+ Community Members */}
              <div className="bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 hover:border-[#4ADE80]/50 p-5 sm:p-6 rounded-[22px] backdrop-blur-md shadow-xl hover:shadow-2xl transform hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer">
                <div className="w-11 h-11 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center mb-3 text-sky-400 shadow-sm group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <span className="font-serif text-3xl sm:text-4xl font-bold text-white block tracking-tight">
                  5,000+
                </span>
                <span className="text-xs sm:text-[13px] text-[#D1E0D1] font-sans font-medium block mt-1">
                  Community Members
                </span>
              </div>

              {/* Card 3: 50+ Industry Experts */}
              <div className="bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 hover:border-[#4ADE80]/50 p-5 sm:p-6 rounded-[22px] backdrop-blur-md shadow-xl hover:shadow-2xl transform hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer">
                <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center mb-3 text-amber-400 shadow-sm group-hover:scale-110 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <span className="font-serif text-3xl sm:text-4xl font-bold text-white block tracking-tight">
                  50+
                </span>
                <span className="text-xs sm:text-[13px] text-[#D1E0D1] font-sans font-medium block mt-1">
                  Industry Experts
                </span>
              </div>

              {/* Card 4: 8 Vibrant Cities */}
              <div className="bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 hover:border-[#4ADE80]/50 p-5 sm:p-6 rounded-[22px] backdrop-blur-md shadow-xl hover:shadow-2xl transform hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer">
                <div className="w-11 h-11 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center mb-3 text-teal-400 shadow-sm group-hover:scale-110 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="font-serif text-3xl sm:text-4xl font-bold text-white block tracking-tight">
                  8
                </span>
                <span className="text-xs sm:text-[13px] text-[#D1E0D1] font-sans font-medium block mt-1">
                  Vibrant Cities
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
