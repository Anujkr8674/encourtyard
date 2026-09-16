'use client';

import React, { useState } from 'react';
import { ArrowRight, Play, Phone, MapPin, Users, Layers, Compass } from 'lucide-react';
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
              READY TO GET STARTED?
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Let's Build Your <br />
              Next Chapter Together
            </h2>

            <p className="text-sm sm:text-base text-[#E3EBE3]/90 font-sans leading-relaxed">
              Schedule a visit, explore our spaces, or talk to our team. Experience how EnCourtyard accelerates your business momentum.
            </p>

            {/* CTAs: Primary Actions + WhatsApp & Call */}
            <div className="pt-2 space-y-3.5">
              {/* Row 1: Schedule Visit & Watch Video */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  href="/about#visit-form"
                  variant="white"
                  size="lg"
                  className="font-bold shadow-2xl text-[#181F18] bg-white hover:bg-neutral-100"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Schedule a Visit
                </Button>

                <Button
                  href="/workspaces"
                  variant="outline"
                  size="lg"
                  className="border-white/50 bg-black/30 backdrop-blur-md text-white hover:bg-white hover:text-[#181F18] font-semibold"
                  icon={<Play className="w-3.5 h-3.5 fill-current" />}
                  iconPosition="left"
                >
                  Watch Video
                </Button>
              </div>

              {/* Row 2: WhatsApp & Call Quick Connect */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="https://wa.me/919825540210?text=Hi%20EnCourtyard%20Team%2C%20I%20would%20like%20to%20inquire%20about%20workspace%20availability."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1D4A24]/90 hover:bg-[#25D366] text-white border border-[#2E7D32] hover:border-[#25D366] backdrop-blur-md font-sans text-xs sm:text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-[0_4px_16px_rgba(37,211,102,0.35)] group"
                >
                  <svg className="w-4 h-4 fill-current text-[#4ADE80] group-hover:text-white transition-colors shrink-0" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>WhatsApp</span>
                </a>

                <a
                  href="tel:+919825540210"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#263026]/90 hover:bg-[#344034] text-white border border-white/20 hover:border-white/40 backdrop-blur-md font-sans text-xs sm:text-sm font-semibold transition-all duration-300 shadow-md group"
                >
                  <Phone className="w-4 h-4 text-[#4ADE80] group-hover:scale-110 transition-transform shrink-0" />
                  <span>Call +91 98255 40210</span>
                </a>
              </div>
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
