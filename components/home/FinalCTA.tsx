'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Phone, MapPin, Users, Layers, Compass, Sparkles, Calendar, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const FEATURE_PILLS = [
  {
    id: 'flexible',
    label: 'Flexible Spaces',
    icon: Layers,
    quote: 'Good Ideas Start Here. Designed for Agile Teams.',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'community',
    label: 'Inspiring Community',
    icon: Users,
    quote: 'Connect, Collaborate, and Scale with Top Innovators.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'locations',
    label: 'Strategic Locations',
    icon: MapPin,
    quote: 'Prime Business Addresses with Seamless City Connectivity.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'possibilities',
    label: 'Endless Possibilities',
    icon: Compass,
    quote: 'Fueling Ambition with 24/7 Botanical Sanctuaries.',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
  },
];

export const FinalCTA: React.FC = () => {
  const [selectedId, setSelectedId] = useState('flexible');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activeId = hoveredId || selectedId;
  const currentItem = FEATURE_PILLS.find((p) => p.id === activeId) || FEATURE_PILLS[0];

  return (
    <section
      className="py-20 lg:py-28 text-white relative overflow-hidden bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/why.png')",
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      
      {/* Dark Translucent Overlay for Optimal Contrast & Luxury Aesthetic */}
      <div className="absolute inset-0 bg-[#0E150F]/85 backdrop-blur-[2px] pointer-events-none" />

      {/* Subtle Dotted Matrix Ambience */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#4ADE80 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Narrative Column */}
          <div className="lg:col-span-5 space-y-5 text-left">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#4ADE80] font-bold block">
             READY TO EXPERIENCE ENCOURTYARD?
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Don't Just Find a Desk. <br />Find Your Workspace.
            </h2>

            <p className="text-sm sm:text-base text-[#E3EBE3]/90 font-sans leading-relaxed">
               Whether you need a desk for a day, a cabin for your team, a meeting room for an hour, a conference hall for an event, or a workspace you can access 24/7, Encourtyard has a space for you.
            </p>

            {/* CTAs: 4 Distinct Action Buttons Requested by User */}
            <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
              {/* Button 1: Book a Tour */}
              <Link
                href="/about#visit-form"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white hover:bg-neutral-100 text-[#181F18] font-bold text-xs sm:text-sm shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95 group"
              >
                <Sparkles className="w-4 h-4 text-[#2E7D32] group-hover:scale-110 transition-transform" />
                <span>Book a Tour</span>
              </Link>

              {/* Button 2: Book a Day Pass */}
              <Link
                href="/book-space?plan=day-pass"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white font-bold text-xs sm:text-sm shadow-xl hover:shadow-[0_8px_25px_rgba(46,125,50,0.4)] border border-[#4ADE80]/30 transition-all duration-200 active:scale-95 group"
              >
                <Calendar className="w-4 h-4 text-[#86EFAC] group-hover:scale-110 transition-transform" />
                <span>Book a Day Pass</span>
              </Link>

              {/* Button 3: Book Conference Hall */}
              <Link
                href="/conference-hall"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-black/40 hover:bg-black/60 text-white font-semibold text-xs sm:text-sm border border-white/25 hover:border-[#F59E0B] backdrop-blur-md transition-all duration-200 active:scale-95 group"
              >
                <Building2 className="w-4 h-4 text-[#FBBF24] group-hover:scale-110 transition-transform" />
                <span>Book Conference Hall</span>
              </Link>

              {/* Button 4: Contact Us */}
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/25 hover:border-white/50 backdrop-blur-md transition-all duration-200 active:scale-95 group"
              >
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                <span>Contact Us</span>
              </Link>
            </div>
          </div>

          {/* Center 3D Desk Showcase Image with Smooth Zero-Latency Cross-Fade */}
          <div className="lg:col-span-4 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 aspect-[4/3] bg-[#263626]">
              {FEATURE_PILLS.map((pill) => {
                const isCurrent = pill.id === activeId;
                return (
                  <div
                    key={pill.id}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      isCurrent
                        ? 'opacity-100 scale-100 z-10'
                        : 'opacity-0 scale-105 z-0 pointer-events-none'
                    }`}
                  >
                    <img
                      src={pill.image}
                      alt={pill.label}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  </div>
                );
              })}

              {/* Dynamic Quote / Caption Overlay */}
              <div className="absolute bottom-4 left-4 right-4 z-20 bg-black/65 backdrop-blur-md p-3.5 rounded-xl border border-white/15 text-center shadow-lg transition-all duration-300">
                <span className="text-xs sm:text-[13px] font-serif font-bold text-white tracking-wide block leading-snug">
                  "{currentItem.quote}"
                </span>
              </div>
            </div>
          </div>

          {/* Right 4 Stacked Interactive Feature Pills */}
          <div className="lg:col-span-3 space-y-3">
            {FEATURE_PILLS.map((pill) => {
              const Icon = pill.icon;
              const isActive = pill.id === activeId;
              return (
                <button
                  key={pill.id}
                  type="button"
                  onMouseEnter={() => setHoveredId(pill.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => setSelectedId(pill.id)}
                  className={`w-full text-left px-4 py-3.5 rounded-2xl flex items-center justify-between border transition-all duration-300 backdrop-blur-md cursor-pointer select-none group ${
                    isActive
                      ? 'bg-white/20 border-[#4ADE80] shadow-[0_0_20px_rgba(74,222,128,0.2)] translate-x-1.5'
                      : 'bg-white/10 hover:bg-white/15 border-white/20 hover:border-white/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4.5 h-4.5 transition-all duration-300 shrink-0 ${
                        isActive
                          ? 'text-[#4ADE80] scale-110 drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]'
                          : 'text-[#4ADE80] group-hover:scale-105'
                      }`}
                    />
                    <span
                      className={`text-xs sm:text-sm transition-colors duration-300 ${
                        isActive ? 'font-bold text-white' : 'font-medium text-[#E3EBE3]'
                      }`}
                    >
                      {pill.label}
                    </span>
                  </div>

                  {/* Active Indicator Dot */}
                  <div
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'bg-[#4ADE80] shadow-[0_0_8px_#4ADE80] scale-100 opacity-100'
                        : 'opacity-0 scale-50'
                    }`}
                  />
                </button>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
