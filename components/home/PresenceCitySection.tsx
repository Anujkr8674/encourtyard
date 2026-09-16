'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, Zap, Clock } from 'lucide-react';
import { INDIAN_CITIES } from '@/lib/data';

export const PresenceCitySection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll);
    checkScroll();
    return () => el.removeEventListener('scroll', checkScroll);
  }, []);

  const slideLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const slideRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  // Badges map matching reference mockup
  const getBadgeIcon = (id: string) => {
    if (id === 'bangalore') {
      return <Zap className="w-3 h-3 text-[#A3D9A5] fill-current" />;
    }
    if (id === 'gurgaon' || id === 'noida') {
      return <Clock className="w-3 h-3 text-white/90" />;
    }
    return <ArrowRight className="w-3 h-3 text-white group-hover:translate-x-0.5 transition-transform" />;
  };

  return (
    <section id="our-presence" className="py-12 sm:py-16 lg:py-20 primary-section-bg border-b border-[#E5E1D8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Bordered Card Container */}
        <div className="bg-[#FAF9F5] rounded-3xl border border-[#E2DDD3] p-5 sm:p-8 lg:p-10 shadow-warm relative overflow-hidden">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-6 border-b border-[#E5E1D8]">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#738273] font-bold block mb-1.5">
                OUR PRESENCE
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-[38px] font-bold text-[#181F18] tracking-tight leading-tight">
                Choose from 79 centres across 8 cities in India
              </h2>
              <p className="text-xs sm:text-base text-[#5C665C] mt-2 font-sans">
                Premium workspaces in prime business districts, designed for modern teams.
              </p>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <Link
                href="/workspaces"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#181F18] hover:text-[#263626] group transition-colors mr-1"
              >
                <span>View All Locations</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              {/* Left & Right Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={slideLeft}
                  disabled={!canScrollLeft}
                  className={`w-9 h-9 rounded-full border border-[#D5CEC2] flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                    canScrollLeft
                      ? 'bg-white text-[#181F18] hover:bg-[#263626] hover:text-white hover:border-[#263626]'
                      : 'bg-[#EAE5DC] text-[#A3B0A3] opacity-40 cursor-not-allowed'
                  }`}
                  aria-label="Previous cities"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={slideRight}
                  disabled={!canScrollRight}
                  className={`w-9 h-9 rounded-full border border-[#D5CEC2] flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                    canScrollRight
                      ? 'bg-white text-[#181F18] hover:bg-[#263626] hover:text-white hover:border-[#263626]'
                      : 'bg-[#EAE5DC] text-[#A3B0A3] opacity-40 cursor-not-allowed'
                  }`}
                  aria-label="Next cities"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 8-City Cards Row Matching Reference Mockup */}
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-4.5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 no-scrollbar -mx-2 px-2 sm:mx-0 sm:px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {INDIAN_CITIES.map((city) => (
              <Link
                key={city.id}
                href={`/workspaces?location=${city.id}`}
                className="group relative w-[185px] sm:w-[200px] lg:w-[215px] aspect-[3/4] rounded-2xl overflow-hidden shrink-0 snap-start shadow-warm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-[#DCD4C6] hover:border-[#263626]"
              >
                {/* City Photo */}
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* Gradient Overlay for Strong Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:from-black/90 transition-colors" />

                {/* City Name & Centre Count on Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-3.5 text-white">
                  <h3 className="font-serif text-base sm:text-lg font-bold leading-tight drop-shadow-sm mb-1">
                    {city.name}
                  </h3>
                  
                  <div className="flex items-center justify-between text-xs text-white/80">
                    <span className="font-mono text-[11px] text-white/90 font-medium">
                      {city.centresCount} Centres
                    </span>

                    <div className="w-5 h-5 rounded-full bg-white/20 group-hover:bg-[#263626] flex items-center justify-center transition-all duration-200">
                      {getBadgeIcon(city.id)}
                    </div>
                  </div>
                </div>

              </Link>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
