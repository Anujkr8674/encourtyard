'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Briefcase,
  Users,
  Search,
  Calendar,
  Sparkles
} from 'lucide-react';

interface HeroSlide {
  id: number;
  image: string;
  badge?: string;
  tagline1: string;
  tagline2: string;
  description: string;
}

// Line-by-line human typewriter hook
function useLineTypewriter(lines: string[], speed: number = 32) {
  const [typedLines, setTypedLines] = useState<string[]>(() => lines.map(() => ''));
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setTypedLines(lines.map(() => ''));
    setCurrentLineIndex(0);
    setIsTyping(true);

    let lineIdx = 0;
    let charIdx = 0;
    const current = lines.map(() => '');

    const timer = setInterval(() => {
      if (lineIdx < lines.length) {
        const targetLine = lines[lineIdx];
        if (charIdx <= targetLine.length) {
          current[lineIdx] = targetLine.slice(0, charIdx);
          setTypedLines([...current]);
          setCurrentLineIndex(lineIdx);
          charIdx++;
        } else {
          lineIdx++;
          charIdx = 0;
        }
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [lines, speed]);

  return { typedLines, currentLineIndex, isTyping };
}

export const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeSearchTab, setActiveSearchTab] = useState<'workspace' | 'meeting' | 'day-pass'>('workspace');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTeamSize, setSelectedTeamSize] = useState('all');
  
  const [categories, setCategories] = useState<{id: string, name: string, slug: string}[]>([]);
  const [capacities, setCapacities] = useState<string[]>([]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catRes, spaceRes] = await Promise.all([
          fetch('/api/categories', { cache: 'no-store' }),
          fetch('/api/workspaces', { cache: 'no-store' })
        ]);
        
        if (catRes.ok) {
          const catData = await catRes.json();
          if (catData.success) {
            setCategories(catData.categories);
          }
        }
        
        if (spaceRes.ok) {
          const spaceData = await spaceRes.json();
          if (spaceData.success && spaceData.workspaces) {
            const uniqueCapacities = Array.from(new Set(
              spaceData.workspaces
                .map((w: any) => w.capacity)
                .filter((c: any) => Boolean(c))
            )) as string[];
            setCapacities(uniqueCapacities.sort());
          }
        }
      } catch (error) {
        console.error("Failed to fetch filter data", error);
      }
    };
    
    fetchFilters();
  }, []);
  const router = useRouter();

  const slides: HeroSlide[] = [
    {
      id: 1,
      image: '/images/hero1.png',
      badge: 'A MODERN COWORKING EXPERIENCE',
      tagline1: 'More Than A Workspace,',
      tagline2: 'A Brighter Tomorrow',
      description: 'Flexible spaces. Meaningful connections. Real opportunities. Welcome to EnCourtyard.'
    },
    {
      id: 2,
      image: '/images/hero2.png',
      badge: 'PREMIUM WORKSPACES, DESIGNED FOR SUCCESS',
      tagline1: 'Handcrafted Executive Suites,',
      tagline2: 'Built for Scale',
      description: 'Acoustic glass soundproofing, private gigabit subnets, and sunlit courtyard terraces across India.'
    },
    {
      id: 3,
      image: '/images/hero3.png',
      badge: 'SMART 4K AI COLLABORATION',
      tagline1: 'Inspiring Spaces, Vibrant Community,',
      tagline2: 'Endless Growth',
      description: 'From deep-focus dedicated workstations to enterprise team wings and AI-equipped meeting suites.'
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Continuous Auto-slide timer every 6.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6500);

    return () => clearInterval(timer);
  }, [nextSlide]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeSearchTab === 'meeting') {
      router.push(`/meeting-rooms?location=hyderabad`);
    } else if (activeSearchTab === 'day-pass') {
      router.push(`/book-space?plan=day-pass${selectedType !== 'all' ? `&category=${selectedType}` : ''}${selectedTeamSize !== 'all' ? `&capacity=${selectedTeamSize}` : ''}`);
    } else {
      router.push(`/book-space?category=${selectedType !== 'all' ? selectedType : ''}&capacity=${selectedTeamSize !== 'all' ? selectedTeamSize : ''}`);
    }
  };

  const activeSlide = slides[currentSlide];

  // Title lines for line-by-line typewriter animation
  const titleLines = React.useMemo(
    () => [activeSlide.tagline1, activeSlide.tagline2],
    [activeSlide.tagline1, activeSlide.tagline2]
  );
  const { typedLines, currentLineIndex, isTyping } = useLineTypewriter(titleLines, 32);

  return (
    <>
      <section className="relative w-full h-[75vh] min-h-[75vh] sm:h-screen sm:min-h-[100vh] bg-white pt-20 sm:pt-32 lg:pt-36 pb-6 sm:pb-8 flex flex-col justify-center overflow-hidden">

        {/* Full-Bleed Background Image Slider */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {slides.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-0' : 'opacity-0 z-[-1]'
                  }`}
              >
                <img
                  src={slide.image}
                  alt={slide.tagline1}
                  className={`w-full h-full object-cover object-center filter brightness-100 contrast-105 transition-transform duration-[7000ms] ease-out ${isActive ? 'scale-105' : 'scale-100'
                    }`}
                />
              </div>
            );
          })}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0E170E]/40 via-[#0E170E]/20 to-[#0E170E]/50 z-10" />
        </div>

        {/* Main Hero Foreground Content: Centered Layout matching other hero sections */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto text-center flex flex-col items-center justify-center">

          {/* Eyebrow Tagline Badge */}
          {activeSlide.badge && (
            <div className="mb-3 sm:mb-4">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/40 hover:bg-white/55 backdrop-blur-md border border-white/60 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#141F14] font-bold shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                {activeSlide.badge}
              </span>
            </div>
          )}

          {/* Headline Pills (Tag Line 1 & Tag Line 2) with Typewriter Animation */}
          <div className="flex flex-col items-center gap-2.5 sm:gap-3.5 mb-4 sm:mb-6 min-h-[90px] sm:min-h-[140px] justify-center">
            {/* Tag Line 1 */}
            <div className="inline-block px-5 sm:px-8 py-2 sm:py-3.5 rounded-2xl sm:rounded-3xl bg-white/45 hover:bg-white/60 backdrop-blur-md border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-colors">
              <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#141F14] leading-[1.15] text-center">
                {typedLines[0] || '\u00A0'}
                {isTyping && currentLineIndex === 0 && (
                  <span className="inline-block w-1 sm:w-1.5 h-5 sm:h-8 bg-[#2E7D32] ml-1.5 align-middle animate-pulse" />
                )}
              </h1>
            </div>

            {/* Tag Line 2 */}
            {(typedLines[1] || currentLineIndex >= 1) && (
              <div className="inline-block px-5 sm:px-8 py-2 sm:py-3.5 rounded-2xl sm:rounded-3xl bg-white/45 hover:bg-white/60 backdrop-blur-md border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-colors">
                <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1B3B22] italic font-normal leading-[1.15] text-center">
                  {typedLines[1] || '\u00A0'}
                  {isTyping && currentLineIndex === 1 && (
                    <span className="inline-block w-1 sm:w-1.5 h-5 sm:h-8 bg-[#2E7D32] ml-1.5 align-middle animate-pulse" />
                  )}
                </h2>
              </div>
            )}
          </div>

          {/* Description Pill */}
          <div className="flex justify-center max-w-2xl px-2">
            <div className="inline-block px-5 sm:px-8 py-2.5 sm:py-3 rounded-2xl bg-white/45 hover:bg-white/60 backdrop-blur-md border border-white/60 text-xs sm:text-sm md:text-base text-[#181F18] font-sans font-medium shadow-[0_8px_25px_rgba(0,0,0,0.1)] leading-relaxed text-center">
              {activeSlide.description}
            </div>
          </div>

        </div>

        {/* Slider Navigation Buttons Floating at Bottom Left to avoid search note overlap */}
        <div className="absolute bottom-6 sm:bottom-10 left-4 sm:left-8 z-20 flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white/60 p-1.5 rounded-full shadow-lg">
          <button
            onClick={prevSlide}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#181F18] flex items-center justify-center shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono font-semibold text-[#181F18] px-2 select-none">
            0{currentSlide + 1} / 0{slides.length}
          </span>
          <button
            onClick={nextSlide}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#181F18] flex items-center justify-center shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Scroll Indicator on Hero */}
        {/* <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2 text-[11px] font-sans font-semibold text-white/80 drop-shadow-md select-none pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-ping" />
        <span>Scroll to Explore</span>
      </div> */}

      </section>

      {/* Section 2: Overlapping Multi-Tab Quick Search Widget (Slight subtle touch on Hero Section) */}
      <div className="relative z-30 -mt-5 sm:-mt-7 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative bg-white p-5 sm:p-7 rounded-3xl sm:rounded-[32px] shadow-[0_20px_50px_-10px_rgba(24,31,24,0.12),0_0_1px_1px_rgba(24,31,24,0.04)] border border-[#DDD7CA]">

          {/* Whimsical Handwritten Note on Top Right */}
          <div className="absolute -top-10 right-6 hidden md:flex items-center gap-2 select-none pointer-events-none text-[#2E7D32]">
            <span className="font-handwriting text-2xl font-bold rotate-[4deg]">
              Find your ideal space
            </span>
            <span className="text-2xl rotate-45">↳</span>
          </div>

          {/* Top Search Tabs */}
          <div className="flex items-center gap-4 sm:gap-6 border-b border-[#EAE5DB] pb-3 mb-4 text-xs sm:text-sm font-semibold overflow-x-auto no-scrollbar">

            <button
              type="button"
              onClick={() => setActiveSearchTab('workspace')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${activeSearchTab === 'workspace'
                ? 'bg-[#2E7D32] text-white shadow-xs font-semibold'
                : 'text-[#5C665C] hover:text-[#181F18]'
                }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Find a Workspace</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSearchTab('meeting')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${activeSearchTab === 'meeting'
                ? 'bg-[#2E7D32] text-white shadow-xs font-semibold'
                : 'text-[#5C665C] hover:text-[#181F18]'
                }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Find a Meeting Room</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSearchTab('day-pass')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${activeSearchTab === 'day-pass'
                ? 'bg-[#2E7D32] text-white shadow-xs font-semibold'
                : 'text-[#5C665C] hover:text-[#181F18]'
                }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Day Pass</span>
            </button>

          </div>

          {/* Search Inputs Row */}
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">

            {/* Location Static Display */}
            <div className="px-3.5 py-2.5 bg-[#FAF9F5] rounded-xl border border-[#DDD7CA] hover:border-[#263626]/40 transition-colors flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#2E7D32] shrink-0" />
              <div className="w-full text-left">
                <label className="block text-[9px] font-bold uppercase text-[#738273] tracking-wider">
                  Location
                </label>
                <div className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#181F18] pt-0.5">
                  Hyderabad
                </div>
              </div>
            </div>

            {/* Workspace Type Select */}
            <div className="px-3.5 py-2.5 bg-[#FAF9F5] rounded-xl border border-[#DDD7CA] hover:border-[#263626]/40 transition-colors flex items-center gap-2.5">
              <Briefcase className="w-4 h-4 text-[#2E7D32] shrink-0" />
              <div className="w-full text-left">
                <label className="block text-[9px] font-bold uppercase text-[#738273] tracking-wider">
                  Workspace Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#181F18] focus:outline-none cursor-pointer"
                >
                  <option value="all">All Types</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Team Size Select */}
            <div className="px-3.5 py-2.5 bg-[#FAF9F5] rounded-xl border border-[#DDD7CA] hover:border-[#263626]/40 transition-colors flex items-center gap-2.5">
              <Users className="w-4 h-4 text-[#2E7D32] shrink-0" />
              <div className="w-full text-left">
                <label className="block text-[9px] font-bold uppercase text-[#738273] tracking-wider">
                  Capacity / Team Size
                </label>
                <select
                  value={selectedTeamSize}
                  onChange={(e) => setSelectedTeamSize(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#181F18] focus:outline-none cursor-pointer"
                >
                  <option value="all">Any Size</option>
                  {capacities.map((cap, idx) => (
                    <option key={idx} value={cap}>{cap}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Submit Button */}
            <button
              type="submit"
              className="w-full h-full min-h-[50px] bg-[#2E7D32] hover:bg-[#1E5C23] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-[0_4px_16px_rgba(46,125,50,0.25)] hover:shadow-[0_8px_24px_rgba(46,125,50,0.32)] hover:-translate-y-0.5 active:translate-y-0"
            >
              <Search className="w-4 h-4 text-[#86EFAC]" />
              <span>{activeSearchTab === 'day-pass' ? 'Search Day Pass' : 'Search'}</span>
            </button>

          </form>
        </div>
      </div>
    </>
  );
};


