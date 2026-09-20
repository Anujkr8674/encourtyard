'use client';

import React from 'react';
import {
  ShieldCheck,
  Star,
  Lock,
  Zap,
  Coffee,
  VolumeX,
  Building2,
  Users,
  Leaf,
  Headphones,
  Sparkles
} from 'lucide-react';

interface TickerFeature {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  highlight?: string;
  color?: string;
}

const TICKER_FEATURES: TickerFeature[] = [
  {
    id: '1',
    icon: ShieldCheck,
    label: 'Verified Spaces',
    highlight: '100% Certified',
    color: 'text-[#4ADE80]'
  },
  {
    id: '2',
    icon: Star,
    label: '4.9+ Member Rating',
    highlight: 'Top Rated',
    color: 'text-amber-400'
  },
  {
    id: '3',
    icon: Lock,
    label: '24/7 Keyless Biometric Access',
    highlight: 'Secure',
    color: 'text-[#4ADE80]'
  },
  {
    id: '4',
    icon: Zap,
    label: '1Gbps Dedicated Fiber VLAN',
    highlight: 'Ultra-Fast',
    color: 'text-amber-400'
  },
  {
    id: '5',
    icon: Coffee,
    label: 'Unlimited Artisanal Espresso & Tea Bar',
    highlight: 'Complimentary',
    color: 'text-amber-300'
  },
  {
    id: '6',
    icon: VolumeX,
    label: 'STC 65 Acoustic Soundproof Booths',
    highlight: 'Noise-Free',
    color: 'text-[#4ADE80]'
  },
  {
    id: '7',
    icon: Building2,
    label: '79+ Centres in 8 Prime Cities',
    highlight: 'Pan-India',
    color: 'text-[#4ADE80]'
  },
  {
    id: '8',
    icon: Users,
    label: '20K+ Active Coworking Members',
    highlight: 'Thriving Network',
    color: 'text-amber-400'
  },
  {
    id: '9',
    icon: Leaf,
    label: 'Biophilic Botanical Sanctuary',
    highlight: 'Handcrafted',
    color: 'text-[#4ADE80]'
  },
  {
    id: '10',
    icon: Headphones,
    label: 'Dedicated Executive Concierge Support',
    highlight: 'Daily Service',
    color: 'text-amber-300'
  },
  {
    id: '11',
    icon: Sparkles,
    label: 'Instant Move-In & Flexible Passes',
    highlight: 'On-Demand',
    color: 'text-[#4ADE80]'
  },
];

export const FeaturesTickerMarquee: React.FC = () => {
  // Duplicate for seamless infinite loop
  const repeatedFeatures = [...TICKER_FEATURES, ...TICKER_FEATURES, ...TICKER_FEATURES];

  return (
    <div className="relative w-full bg-[#0D140E] border-y border-[#263626] text-white py-3.5 overflow-hidden select-none group z-10 shadow-inner">
      {/* Left/Right Edge Gradient Fade Masks */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#0D140E] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#0D140E] to-transparent z-10 pointer-events-none" />

      {/* Marquee Track with CSS Animation */}
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] will-change-transform">
        {repeatedFeatures.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={`${item.id}-${idx}`}
              className="inline-flex items-center gap-2.5 mx-5 sm:mx-7 text-xs sm:text-sm font-medium whitespace-nowrap tracking-wide hover:text-[#4ADE80] transition-colors"
            >
              {/* Icon with Glowing Badge */}
              <div className="w-6 h-6 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(74,222,128,0.15)]">
                <Icon className={`w-3.5 h-3.5 ${item.color || 'text-[#4ADE80]'}`} />
              </div>

              {/* Label */}
              <span className="text-[#E3EBE3] font-sans font-medium">
                {item.label}
              </span>

              {/* Dot Separator */}
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 ml-3 shrink-0" />
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        @keyframes marqueeScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333333%);
          }
        }
        .animate-marquee {
          display: flex;
          animation: marqueeScroll 38s linear infinite;
        }
      `}</style>
    </div>
  );
};
