'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Users, Award, Building2 } from 'lucide-react';

export const CommunityGrowthSection: React.FC = () => {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-[#181F18] text-white border-b border-[#263626]">
      
      {/* Background Dotted Ambience Matching FinalCTA */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#4ADE80 1px, transparent 1px)',
          backgroundSize: '36px 36px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
          
          {/* LEFT SIDE — NARRATIVE & PRIMARY CTA */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-6 text-left">
            
            {/* Small Uppercase Green Eyebrow */}
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.22em] text-[#4ADE80] font-bold block">
              A COMMUNITY
            </span>

            {/* Large Elegant Serif Heading */}
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[46px] xl:text-[52px] font-bold tracking-tight text-white leading-[1.12]">
              That Inspires Growth
            </h2>

            {/* Description Paragraph */}
            <p className="text-sm sm:text-base lg:text-[17px] text-[#D1D5DB] font-sans leading-relaxed max-w-lg">
              Network with like-minded professionals, attend exclusive events, and be part of a thriving business community.
            </p>

            {/* Obvious Primary Call-to-Action Button */}
            <div className="pt-2">
              <Link
                href="/about"
                className="group inline-flex items-center gap-3 bg-white hover:bg-[#F4F1E8] text-[#181F18] px-7 py-3.5 rounded-full font-sans text-sm font-semibold shadow-[0_4px_20px_rgba(0,0,0,0.35)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.25)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              >
                <span>Join Our Community</span>
                <ArrowRight className="w-4 h-4 text-[#181F18] group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

          </div>

          {/* RIGHT SIDE — 4 STATISTICS CARDS IN A CLEAN 2x2 GRID */}
          <div className="lg:col-span-6 xl:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            
            {/* Card 1: 100+ Events Annually */}
            <div className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/15 hover:border-white/30 p-5 sm:p-6 rounded-[18px] shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)] transform hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center mb-3 text-[#4ADE80] group-hover:bg-[#4ADE80] group-hover:text-[#181F18] transition-colors duration-300 shadow-xs">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="font-serif text-3xl sm:text-4xl font-bold text-white block tracking-tight">
                100+
              </span>
              <span className="text-xs sm:text-[13px] text-[#D1D5DB] font-sans font-medium block mt-1">
                Events Annually
              </span>
            </div>

            {/* Card 2: 5000+ Community Members */}
            <div className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/15 hover:border-white/30 p-5 sm:p-6 rounded-[18px] shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)] transform hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center mb-3 text-[#60A5FA] group-hover:bg-[#60A5FA] group-hover:text-[#181F18] transition-colors duration-300 shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <span className="font-serif text-3xl sm:text-4xl font-bold text-white block tracking-tight">
                5000+
              </span>
              <span className="text-xs sm:text-[13px] text-[#D1D5DB] font-sans font-medium block mt-1">
                Community Members
              </span>
            </div>

            {/* Card 3: 50+ Industry Experts */}
            <div className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/15 hover:border-white/30 p-5 sm:p-6 rounded-[18px] shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)] transform hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center mb-3 text-[#FBBF24] group-hover:bg-[#FBBF24] group-hover:text-[#181F18] transition-colors duration-300 shadow-xs">
                <Award className="w-5 h-5" />
              </div>
              <span className="font-serif text-3xl sm:text-4xl font-bold text-white block tracking-tight">
                50+
              </span>
              <span className="text-xs sm:text-[13px] text-[#D1D5DB] font-sans font-medium block mt-1">
                Industry Experts
              </span>
            </div>

            {/* Card 4: 8 Vibrant Cities */}
            <div className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/15 hover:border-white/30 p-5 sm:p-6 rounded-[18px] shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)] transform hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center mb-3 text-[#34D399] group-hover:bg-[#34D399] group-hover:text-[#181F18] transition-colors duration-300 shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="font-serif text-3xl sm:text-4xl font-bold text-white block tracking-tight">
                8
              </span>
              <span className="text-xs sm:text-[13px] text-[#D1D5DB] font-sans font-medium block mt-1">
                Vibrant Cities
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
