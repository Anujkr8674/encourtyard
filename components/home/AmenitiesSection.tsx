'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Wifi,
  Coffee,
  Monitor,
  Zap,
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CIRCULAR_AMENITIES_DATA } from '@/lib/data';

export const AmenitiesSection: React.FC = () => {
  const [selectedId, setSelectedId] = useState('rental-computer');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activeId = hoveredId || selectedId;

  const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
    Wifi,
    Coffee,
    Monitor,
    Zap,
    ShieldCheck,
    Sparkles
  };

  const currentItem =
    CIRCULAR_AMENITIES_DATA.find((item) => item.id === activeId || item.slug === activeId) ||
    CIRCULAR_AMENITIES_DATA[0];

  const ActiveIconComp = iconComponents[currentItem.iconName] || Sparkles;

  return (
    <section id="amenities" className="py-16 sm:py-20 lg:py-24 bg-white border-b border-[#E5E1D8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Elevated Architectural Alabaster Canvas */}
        <div className="relative rounded-[28px] sm:rounded-[36px] lg:rounded-[40px] bg-[#FAF9F5] border border-[#DDD7CA] shadow-[0_20px_50px_-15px_rgba(24,31,24,0.08),0_0_1px_1px_rgba(24,31,24,0.03)] overflow-hidden p-6 sm:p-8 lg:p-10 xl:p-12">

          {/* Top Header Row with Cursive Accent */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 lg:mb-12 gap-6 relative z-10">
            <div className="max-w-2xl text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] text-[11px] font-mono uppercase tracking-widest text-[#1B5E20] font-bold mb-3">
                WORLD-CLASS AMENITIES
              </span>
              <h2 className="font-serif text-3xl sm:text-3xl lg:text-[40px] font-bold text-[#181F18] tracking-tight leading-tight">
                Best Co Working Space In Hyderabad
              </h2>
              <p className="text-sm sm:text-base text-[#5C665C] mt-2.5 font-sans leading-relaxed">
                Thoughtfully designed for creators, teams, and growing enterprises in Hyderabad. Enjoy uninterrupted high-speed connectivity, premium computer rentals, 100% power backup, and rejuvenating spaces built around your workday.
              </p>
            </div>

            <div className="hidden lg:block select-none">
              <p className="font-handwriting text-2xl xl:text-3xl text-[#263626] rotate-[-3deg] drop-shadow-xs">
                "More than amenities — It's a better way to work."
              </p>
            </div>
          </div>

          {/* 2-Column Content: Amenities List (Left) + Interactive Image Showcase (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center relative z-10">

            {/* Left: 6 Requested Amenities in 3x2 Grid */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
              {CIRCULAR_AMENITIES_DATA.map((item) => {
                const IconComp = iconComponents[item.iconName] || Sparkles;
                const isActive = item.id === activeId || item.slug === activeId;

                return (
                  <Link
                    key={item.id}
                    href={`/amenities/${item.slug || item.id}`}
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => setSelectedId(item.id)}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 transform flex flex-col items-center text-center cursor-pointer select-none group relative ${
                      isActive
                        ? 'bg-[#263626] text-white border-2 border-[#3D523D] shadow-2xl ring-4 ring-[#263626]/10 -translate-y-2 scale-[1.03]'
                        : 'bg-white hover:bg-white border-[#DDD7CA] hover:border-[#263626] shadow-[0_4px_16px_-4px_rgba(24,31,24,0.06)] hover:shadow-xl hover:-translate-y-1.5'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 sm:w-13 sm:h-13 rounded-2xl border flex items-center justify-center mb-3 transition-all duration-300 ${
                        isActive
                          ? 'bg-[#4ADE80] border-[#4ADE80] text-[#121B12] shadow-md ring-4 ring-[#4ADE80]/20 scale-105'
                          : 'bg-[#F4F6F4] border-[#D5E0D5] text-[#263626] shadow-2xs group-hover:bg-[#263626] group-hover:text-white group-hover:border-[#263626]'
                      }`}
                    >
                      <IconComp className="w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300" />
                    </div>

                    <h4
                      className={`font-serif font-bold text-xs sm:text-sm transition-colors duration-300 leading-tight mb-1 ${
                        isActive ? 'text-white' : 'text-[#181F18] group-hover:text-[#263626]'
                      }`}
                    >
                      {item.title}
                    </h4>

                    <p
                      className={`text-[11px] font-sans leading-snug transition-colors duration-300 line-clamp-2 ${
                        isActive ? 'text-[#D5E2D5] font-medium' : 'text-[#5C665C]'
                      }`}
                    >
                      {item.subtitle}
                    </p>

                    {/* <div className="mt-2.5 pt-1.5 border-t border-current/10 w-full flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider opacity-80 group-hover:opacity-100 transition-opacity">
                      <span>View Details</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </div> */}
                  </Link>
                );
              })}
            </div>

            {/* Right: Dynamic Interactive Showcase with Smooth Fade Transition */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#DDD7CA] bg-[#182218] aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3]">
                
                {/* Stacked Images for Smooth Zero-Latency Cross-Fade */}
                {CIRCULAR_AMENITIES_DATA.map((item) => {
                  const isCurrent = item.id === activeId || item.slug === activeId;
                  return (
                    <div
                      key={item.id}
                      className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                        isCurrent
                          ? 'opacity-100 scale-100 z-10'
                          : 'opacity-0 scale-105 z-0 pointer-events-none'
                      }`}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                    </div>
                  );
                })}

                {/* Floating Active Info Overlay with Link to Separate Page */}
                <div className="absolute bottom-4 left-4 right-4 z-20 bg-white/95 backdrop-blur-md px-4.5 py-3.5 rounded-2xl border border-[#DDD7CA] shadow-xl flex items-center justify-between transition-all duration-500 transform">
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    <div className="w-10 h-10 rounded-xl bg-[#263626] text-[#4ADE80] flex items-center justify-center shrink-0 shadow-sm">
                      <ActiveIconComp className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-serif font-bold text-sm text-[#181F18] leading-tight truncate">
                        {currentItem.title}
                      </h4>
                      <p className="text-[11px] text-[#5C665C] font-sans mt-0.5 truncate max-w-[180px] sm:max-w-[220px]">
                        {currentItem.description || currentItem.subtitle}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/amenities/${currentItem.slug || currentItem.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#256829] text-white text-xs font-bold transition-colors shrink-0 shadow-sm cursor-pointer"
                  >
                    <span>Full Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
