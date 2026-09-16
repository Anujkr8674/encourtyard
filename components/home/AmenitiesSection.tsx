'use client';

import React, { useState } from 'react';
import {
  Wifi,
  Coffee,
  Monitor,
  Car,
  ShieldCheck,
  Sparkles,
  Users,
  Headphones
} from 'lucide-react';
import { CIRCULAR_AMENITIES_DATA } from '@/lib/data';

export const AmenitiesSection: React.FC = () => {
  const [selectedId, setSelectedId] = useState('coffee');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activeId = hoveredId || selectedId;

  const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
    Wifi,
    Coffee,
    Monitor,
    Car,
    ShieldCheck,
    Sparkles,
    Users,
    Headphones
  };

  const currentItem =
    CIRCULAR_AMENITIES_DATA.find((item) => item.id === activeId) ||
    CIRCULAR_AMENITIES_DATA[1];

  const ActiveIconComp = iconComponents[currentItem.iconName] || Sparkles;

  return (
    <section className="py-20 lg:py-22 secondary-section-bg border-b border-[#E5E1D8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Header Row with Cursive Accent */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl text-left">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#738273] font-bold block mb-1.5">
              WORLD-CLASS AMENITIES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#181F18] tracking-tight">
              Everything You Need, All in One Place
            </h2>
            <p className="text-sm sm:text-base text-[#5C665C] mt-2 font-sans">
              Designed to make your workday productive, comfortable and inspiring.
            </p>
          </div>

          <div className="hidden lg:block select-none">
            <p className="font-handwriting text-2xl text-[#263626] rotate-[-3deg]">
              "More than amenities — It's a better way to work."
            </p>
          </div>
        </div>

        {/* 2-Column Content: Circular Amenities List (Left) + Interactive Image Showcase (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left: 8 Circular Icon Items in 4x2 Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-5">
            {CIRCULAR_AMENITIES_DATA.map((item) => {
              const IconComp = iconComponents[item.iconName] || Sparkles;
              const isActive = item.id === activeId;

              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => setSelectedId(item.id)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 transform flex flex-col items-center text-center cursor-pointer select-none ${
                    isActive
                      ? 'bg-white border-[#263626] shadow-xl ring-2 ring-[#263626]/20 -translate-y-1.5 scale-[1.03]'
                      : 'bg-white/90 hover:bg-white border-[#E5E1D8] hover:border-[#263626]/50 shadow-warm hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]'
                  }`}
                >
                  <div
                    className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full border flex items-center justify-center mb-3 transition-all duration-300 ${
                      isActive
                        ? 'bg-[#263626] border-[#263626] text-white scale-110 shadow-md ring-4 ring-[#263626]/10'
                        : 'bg-[#FAF9F5] border-[#E5E1D8] text-[#263626] shadow-xs'
                    }`}
                  >
                    <IconComp
                      className={`w-6 h-6 transition-colors duration-300 ${
                        isActive ? 'text-white' : 'text-[#263724]'
                      }`}
                    />
                  </div>

                  <h4
                    className={`font-serif font-bold text-xs sm:text-sm transition-colors duration-300 leading-tight mb-1 ${
                      isActive ? 'text-[#263626]' : 'text-[#181F18]'
                    }`}
                  >
                    {item.title}
                  </h4>

                  <p
                    className={`text-[11px] font-sans leading-snug transition-colors duration-300 ${
                      isActive ? 'text-[#384A36] font-medium' : 'text-[#738273]'
                    }`}
                  >
                    {item.subtitle}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right: Dynamic Interactive Showcase with Smooth Fade Transition */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#DCD4C6] bg-[#182218] aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3]">
              
              {/* Stacked Images for Smooth Zero-Latency Cross-Fade */}
              {CIRCULAR_AMENITIES_DATA.map((item) => {
                const isCurrent = item.id === activeId;
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  </div>
                );
              })}

              {/* Floating Active Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4 z-20 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/50 shadow-lg flex items-center justify-between transition-all duration-500 transform">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#263626] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <ActiveIconComp className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#181F18] leading-tight">
                      {currentItem.title}
                    </h4>
                    <p className="text-[11px] text-[#5C665C] font-sans mt-0.5">
                      {currentItem.description || currentItem.subtitle}
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
