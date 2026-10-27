'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Briefcase,
  Users,
  Search,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { DayPassDatePickerPopover } from '@/components/ui/DayPassDatePickerPopover';

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
      image: '/images/hero1.jpg',
      badge: 'A MODERN COWORKING EXPERIENCE',
      tagline1: 'More Than A Workspace,',
      tagline2: 'A Brighter Tomorrow',
      description: 'Flexible spaces. Meaningful connections. Real opportunities. Welcome to EnCourtyard.'
    },
    {
      id: 2,
      image: '/images/hero2.jpg',
      badge: 'PREMIUM WORKSPACES, DESIGNED FOR SUCCESS',
      tagline1: 'Where Productivity Meets Possibility,',
      tagline2: 'Room to Thrive',
      description: 'Acoustic glass soundproofing, private gigabit subnets, and sunlit courtyard terraces across India.'
    },
    {
      id: 3,
      image: '/images/hero3.jpg',
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

  return (
    <>
      <section className="relative w-full h-[75vh] min-h-[580px] sm:h-screen sm:min-h-[100vh] bg-white pt-24 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 flex flex-col justify-center overflow-hidden">

        {/* Full-Bleed Background Image Slider */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {slides.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? 'opacity-100 z-0' : 'opacity-0 z-[-1]'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.tagline1}
                  className={`w-full h-full object-cover object-center filter brightness-100 contrast-105 transition-transform duration-[7000ms] ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                />
              </div>
            );
          })}
          {/* Semi-transparent dark layer for optimal text contrast and readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/75 z-10" />
        </div>

        {/* Main Hero Foreground Content: Only Heading & 3 Buttons */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto text-center flex flex-col items-center justify-center">

          {/* Clean Heading Only */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.18] max-w-4xl drop-shadow-lg">
            <span>{activeSlide.tagline1}</span>{' '}
            <span className="text-[#86EFAC] font-normal italic block sm:inline">{activeSlide.tagline2}</span>
          </h1>

          {/* 3 Action Buttons: In a single row on all screen sizes including mobile */}
          <div className="flex flex-row items-center justify-center gap-1.5 sm:gap-3 md:gap-4 mt-6 sm:mt-8 w-full max-w-xl mx-auto px-1 flex-nowrap">
            {/* Button 1: Day Pass with Calendar Popover */}
            <DayPassDatePickerPopover align="left">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full text-[11px] sm:text-xs md:text-sm font-semibold bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md shadow-md transition-all hover:scale-105 active:scale-95 whitespace-nowrap shrink-0 group cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#86EFAC] group-hover:rotate-12 transition-transform shrink-0" />
                <span>Day Pass</span>
              </button>
            </DayPassDatePickerPopover>

            {/* Button 2: Conference Hall */}
            <Link
              href="/conference-hall"
              className="inline-flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full text-[11px] sm:text-xs md:text-sm font-semibold bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md shadow-md transition-all hover:scale-105 active:scale-95 whitespace-nowrap shrink-0 group"
            >
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FDE047] group-hover:scale-110 transition-transform shrink-0" />
              <span>Conference Hall</span>
            </Link>

            {/* Button 3: Book Space */}
            <Link
              href="/book-space?category=Meeting%20Rooms"
              className="inline-flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-5 md:px-7 py-2 sm:py-2.5 md:py-3 rounded-full text-[11px] sm:text-xs md:text-sm font-bold bg-[#2E7D32] hover:bg-[#1E5C23] text-white shadow-lg border border-[#4ADE80]/40 transition-all hover:scale-105 active:scale-95 whitespace-nowrap shrink-0 group"
            >
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#86EFAC] group-hover:translate-x-1 transition-transform shrink-0" />
              <span>Meeting Rooms</span>
            </Link>
          </div>

        </div>

      </section>

      {/* Section 2: Overlapping Multi-Tab Quick Search Widget (Slight subtle touch on Hero Section) */}
      <div className="relative z-30 -mt-5 sm:-mt-7 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative bg-white p-4 sm:p-7 rounded-3xl sm:rounded-[32px] shadow-[0_20px_50px_-10px_rgba(24,31,24,0.12),0_0_1px_1px_rgba(24,31,24,0.04)] border border-[#DDD7CA]">

          {/* Whimsical Handwritten Note on Top Right */}
          <div className="absolute -top-10 right-6 hidden md:flex items-center gap-2 select-none pointer-events-none text-[#2E7D32]">
            <span className="font-handwriting text-2xl font-bold rotate-[4deg]">
              Find your ideal space
            </span>
            <span className="text-2xl rotate-45">↳</span>
          </div>

          {/* Top Search Tabs - Single Row on all screens, No horizontal scroll */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-4 md:gap-6 border-b border-[#EAE5DB] pb-3 mb-4 text-xs sm:text-sm font-semibold w-full">

            <button
              type="button"
              onClick={() => setActiveSearchTab('workspace')}
              className={`px-1.5 sm:px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-2 text-center ${
                activeSearchTab === 'workspace'
                  ? 'bg-[#2E7D32] text-white shadow-xs font-semibold'
                  : 'text-[#5C665C] hover:text-[#181F18]'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap text-[11px] sm:text-xs md:text-sm">
                <span className="hidden sm:inline">Find a </span>Workspace
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSearchTab('meeting')}
              className={`px-1.5 sm:px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-2 text-center ${
                activeSearchTab === 'meeting'
                  ? 'bg-[#2E7D32] text-white shadow-xs font-semibold'
                  : 'text-[#5C665C] hover:text-[#181F18]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap text-[11px] sm:text-xs md:text-sm">
                <span className="hidden sm:inline">Find a </span>Meeting Room
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSearchTab('day-pass')}
              className={`px-1.5 sm:px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-2 text-center ${
                activeSearchTab === 'day-pass'
                  ? 'bg-[#2E7D32] text-white shadow-xs font-semibold'
                  : 'text-[#5C665C] hover:text-[#181F18]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap text-[11px] sm:text-xs md:text-sm">
                Day Pass
              </span>
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


