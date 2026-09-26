'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Briefcase,
  Users,
  Search,
  Calendar,
  Sparkles,
  Building2,
  CheckCircle2,
  CalendarCheck,
  Target,
  Hexagon,
  Layers,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeroSlide {
  id: number;
  image: string;
  tagline: string;
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  scriptAccent: string;
  description: string;
}

// Line-by-line human typewriter hook
function useLineTypewriter(lines: string[], speed: number = 32) {
  const [typedLines, setTypedLines] = useState<string[]>(['', '', '']);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setTypedLines(['', '', '']);
    setCurrentLineIndex(0);
    setIsTyping(true);

    let lineIdx = 0;
    let charIdx = 0;
    const current = ['', '', ''];

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
  const [activeSearchTab, setActiveSearchTab] = useState<'workspace' | 'meeting' | 'team'>('workspace');
  const [selectedLocation, setSelectedLocation] = useState('bangalore');
  const [selectedType, setSelectedType] = useState('private-office');
  const [selectedTeamSize, setSelectedTeamSize] = useState('1-4');
  const router = useRouter();

  const slides: HeroSlide[] = [
    {
      id: 1,
      image: '/images/hero1.png',
      tagline: 'A MODERN COWORKING EXPERIENCE',
      titleLine1: 'More Than',
      titleLine2: 'A Workspace,',
      titleLine3: 'A Brighter Tomorrow',
      scriptAccent: 'Work. Connect. Grow.',
      description: 'Flexible spaces. Meaningful connections. Real opportunities. Welcome to EnCourtyard.'
    },
    {
      id: 2,
      image: '/images/hero2.png',
      tagline: '79 CENTRES IN 8 PRIME CITIES',
      titleLine1: 'Handcrafted',
      titleLine2: 'Executive Suites,',
      titleLine3: 'Built for Scale',
      scriptAccent: 'Confidential & Serene.',
      description: 'Acoustic glass soundproofing, private gigabit subnets, and sunlit courtyard terraces across India.'
    },
    {
      id: 3,
      image: '/images/hero3.png',
      tagline: 'SMART 4K AI COLLABORATION',
      titleLine1: 'Inspiring Spaces,',
      titleLine2: 'Vibrant Community,',
      titleLine3: 'Endless Growth',
      scriptAccent: 'Crafted for Momentum.',
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
      router.push(`/meeting-rooms?location=${selectedLocation}`);
    } else {
      router.push(`/workspaces?location=${selectedLocation}&type=${selectedType}&size=${selectedTeamSize}`);
    }
  };

  const activeSlide = slides[currentSlide];

  // Title lines for line-by-line typewriter animation
  const titleLines = React.useMemo(
    () => [activeSlide.titleLine1, activeSlide.titleLine2, activeSlide.titleLine3],
    [activeSlide.titleLine1, activeSlide.titleLine2, activeSlide.titleLine3]
  );
  const { typedLines, currentLineIndex, isTyping } = useLineTypewriter(titleLines, 32);

  return (
    <>
      <section className="relative w-full h-screen min-h-[100vh] bg-[#FAF8F5] pt-28 sm:pt-32 lg:pt-36 pb-8 flex flex-col justify-center overflow-hidden">

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
                  alt={slide.titleLine1}
                  className={`w-full h-full object-cover object-center sm:object-right transition-transform duration-[7000ms] ease-out ${isActive ? 'scale-105' : 'scale-100'
                    }`}
                />
              </div>
            );
          })}
        </div>

        {/* Main Hero Foreground Content with 50px+ top clearance in window view */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto mt-6 sm:mt-10 lg:mt-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

            {/* Left Column: Every line has its own individual glass badge matching right side */}
            <div className="lg:col-span-7 space-y-3.5 text-left py-2 max-w-xl">

              {/* Tagline Eyebrow in Frosted Glass Pill */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/40 hover:bg-white/55 backdrop-blur-md border border-white/60 text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#141F14] font-bold shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                  {activeSlide.tagline}
                </span>
              </div>

              {/* Headline with Each Line in Its Own Frosted Glass Pill */}
              <div className="relative">
                <div className="flex flex-col items-start gap-2 min-h-[125px] sm:min-h-[155px]">
                  {typedLines.map((line, idx) => {
                    if (!line && idx > currentLineIndex) return null;
                    return (
                      <div
                        key={idx}
                        className="inline-flex items-center px-4 sm:px-5 py-1 sm:py-1.5 rounded-2xl bg-white/40 hover:bg-white/55 backdrop-blur-md border border-white/60 text-[#141F14] font-serif text-2xl sm:text-3xl lg:text-[38px] font-bold tracking-tight shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all leading-tight"
                      >
                        <span>{line || '\u00A0'}</span>
                        {isTyping && idx === currentLineIndex && (
                          <span className="inline-block w-[3px] h-[0.75em] bg-[#2D3E2D] ml-1.5 animate-pulse align-middle" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Floating Cursive Note on Top Right */}
                <div className="hidden sm:block absolute -top-3 right-0 lg:right-2 select-none pointer-events-none">
                  <div className="flex flex-col items-center rotate-[-6deg] text-[#2D3E2D] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                    <span className="font-handwriting text-2xl lg:text-3xl font-bold leading-none">
                      Work
                    </span>
                    <span className="font-handwriting text-2xl lg:text-3xl font-bold leading-none">
                      Connect
                    </span>
                    <span className="font-handwriting text-2xl lg:text-3xl font-bold leading-none">
                      Grow
                    </span>
                    <span className="text-xl -mt-1 font-sans opacity-80">↳</span>
                  </div>
                </div>
              </div>

              {/* Description Subtext in Frosted Glass Pill */}
              <div>
                <div className="inline-block px-4 sm:px-5 py-2.5 rounded-2xl bg-white/40 hover:bg-white/55 backdrop-blur-md border border-white/60 text-xs sm:text-sm text-[#181F18] font-sans font-medium shadow-[0_8px_25px_rgba(0,0,0,0.1)] leading-relaxed max-w-lg">
                  {activeSlide.description}
                </div>
              </div>

              {/* Dual Action Buttons */}
              {/* <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                href="/workspaces"
                variant="primary"
                size="md"
                className="bg-[#2D3E2D] hover:bg-[#3D523D] text-white font-semibold rounded-full px-6 py-3 shadow-md text-xs sm:text-sm"
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Explore Workspaces
              </Button>

              <Link
                href="/about#visit-form"
                className="inline-flex items-center justify-center gap-2 bg-white/85 hover:bg-white text-[#181F18] border border-white/60 backdrop-blur-md font-semibold text-xs sm:text-sm rounded-full px-6 py-3 shadow-xs transition-all"
              >
                <CalendarCheck className="w-4 h-4 text-[#2D3E2D]" />
                <span>Schedule a Visit</span>
              </Link>
            </div> */}

              {/* 4-Item Stats Row */}
              {/* <div className="pt-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 shadow-xs max-w-xl">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#181F18] font-bold">
                    <Hexagon className="w-3.5 h-3.5 text-[#2D3E2D]" />
                    <span className="font-serif text-lg font-bold">500+</span>
                  </div>
                  <span className="text-[11px] text-[#556355] font-sans block font-medium">Happy Members</span>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#181F18] font-bold">
                    <MapPin className="w-3.5 h-3.5 text-[#2D3E2D]" />
                    <span className="font-serif text-lg font-bold">79</span>
                  </div>
                  <span className="text-[11px] text-[#556355] font-sans block font-medium">Centres in 8 Cities</span>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#181F18] font-bold">
                    <Building2 className="w-3.5 h-3.5 text-[#2D3E2D]" />
                    <span className="font-serif text-lg font-bold">10+</span>
                  </div>
                  <span className="text-[11px] text-[#556355] font-sans block font-medium">Workspace Options</span>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#181F18] font-bold">
                    <Target className="w-3.5 h-3.5 text-[#2E7D32]" />
                    <span className="font-serif text-lg font-bold">98%</span>
                  </div>
                  <span className="text-[11px] text-[#556355] font-sans block font-medium">Satisfaction Rate</span>
                </div>
              </div>
            </div> */}

              {/* Scroll Indicator */}
              {/* <div className="pt-0.5 flex items-center gap-2 text-xs text-[#2D3E2D] font-sans">
              <div className="w-4 h-7 rounded-full border border-[#2D3E2D]/40 flex items-start justify-center p-1 bg-white/70 backdrop-blur-xs">
                <div className="w-1 h-1.5 rounded-full bg-[#2D3E2D] animate-bounce" />
              </div>
              <span className="font-semibold text-[#181F18] drop-shadow-xs">Scroll to Explore</span>
            </div> */}

            </div>

            {/* Right Column: Floating 3D Frosted Glass Badges & Slider Controls */}
            <div className="lg:col-span-5 relative flex flex-col justify-between items-end min-h-[260px] lg:min-h-[380px] py-4">

              {/* 3 Floating 3D Frosted Glass Badges (Stacked on Right side of the space) */}
              <div className="flex flex-col gap-3.5 items-end w-full sm:w-auto">

                {/* Badge 1: Flexible Plans */}
                <div className="px-4 py-2.5 rounded-2xl bg-white/35 hover:bg-white/50 backdrop-blur-md border border-white/60 text-[#181F18] text-xs sm:text-sm font-semibold shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center gap-2.5 transition-all hover:scale-105 cursor-pointer animate-float">
                  <div className="w-6 h-6 rounded-lg bg-[#2D3E2D]/10 flex items-center justify-center">
                    <Layers className="w-3.5 h-3.5 text-[#2D3E2D]" />
                  </div>
                  <span>Flexible Plans</span>
                </div>

                {/* Badge 2: Premium Locations */}
                <div className="px-4 py-2.5 rounded-2xl bg-white/35 hover:bg-white/50 backdrop-blur-md border border-white/60 text-[#181F18] text-xs sm:text-sm font-semibold shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center justify-between gap-3 transition-all hover:scale-105 cursor-pointer animate-float-alt mr-2 sm:mr-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#2D3E2D]/10 flex items-center justify-center">
                      <MapPin className="w-3.5 h-3.5 text-[#2D3E2D]" />
                    </div>
                    <span>Premium Locations</span>
                  </div>
                  <span className="text-xs opacity-60">‹</span>
                </div>

                {/* Badge 3: Thriving Community with Gold Plus */}
                <div className="px-4 py-2.5 rounded-2xl bg-white/40 hover:bg-white/55 backdrop-blur-md border border-white/60 text-[#181F18] text-xs sm:text-sm font-semibold shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center justify-between gap-3 transition-all hover:scale-105 cursor-pointer animate-float">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#2D3E2D]/10 flex items-center justify-center">
                      <Users className="w-3.5 h-3.5 text-[#2D3E2D]" />
                    </div>
                    <span>Thriving Community</span>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-[#C29B38] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    +
                  </div>
                </div>

              </div>

              {/* Slider Navigation Buttons & Slide Counter */}
              <div className="mt-8 flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white/60 p-1.5 rounded-full shadow-lg">
                <button
                  onClick={prevSlide}
                  className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#181F18] flex items-center justify-center shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono font-semibold text-[#181F18] px-2">
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

            </div>

          </div>
        </div>

        {/* Bottom Scroll Indicator on Hero */}
        {/* <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2 text-[11px] font-sans font-semibold text-white/80 drop-shadow-md select-none pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-ping" />
        <span>Scroll to Explore</span>
      </div> */}

      </section>

      {/* Section 2: Overlapping Multi-Tab Quick Search Widget (Slight subtle touch on Hero Section) */}
      <div className="relative z-30 -mt-5 sm:-mt-7 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative bg-white p-5 sm:p-7 rounded-3xl shadow-[0_16px_50px_rgba(0,0,0,0.08)] border border-[#E5E1D8]">

          {/* Whimsical Handwritten Note on Top Right */}
          <div className="absolute -top-10 right-6 hidden md:flex items-center gap-2 select-none pointer-events-none text-[#2D3E2D]">
            <span className="font-handwriting text-2xl font-bold rotate-[4deg]">
              Find your ideal space
            </span>
            <span className="text-2xl rotate-45">↳</span>
          </div>

          {/* Top Search Tabs */}
          <div className="flex items-center gap-4 sm:gap-6 border-b border-[#E5E1D8] pb-3 mb-4 text-xs sm:text-sm font-semibold overflow-x-auto no-scrollbar">

            <button
              onClick={() => setActiveSearchTab('workspace')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${activeSearchTab === 'workspace'
                ? 'bg-[#2D3E2D] text-white shadow-xs'
                : 'text-[#5C665C] hover:text-[#181F18]'
                }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Find a Workspace</span>
            </button>

            <button
              onClick={() => setActiveSearchTab('meeting')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${activeSearchTab === 'meeting'
                ? 'bg-[#2D3E2D] text-white shadow-xs'
                : 'text-[#5C665C] hover:text-[#181F18]'
                }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Find a Meeting Room</span>
            </button>

            <button
              onClick={() => setActiveSearchTab('team')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${activeSearchTab === 'team'
                ? 'bg-[#2D3E2D] text-white shadow-xs'
                : 'text-[#5C665C] hover:text-[#181F18]'
                }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Plan a Team Visit</span>
            </button>

          </div>

          {/* Search Inputs Row */}
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">

            {/* Location Select */}
            <div className="px-3.5 py-2.5 bg-[#FAF9F5] rounded-xl border border-[#E5E1D8] flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#2D3E2D] shrink-0" />
              <div className="w-full text-left">
                <label className="block text-[9px] font-bold uppercase text-[#738273] tracking-wider">
                  Select Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#181F18] focus:outline-none cursor-pointer"
                >
                  {/* <option value="bangalore">Bangalore (12 Centres)</option>
                  <option value="delhi">Delhi (10 Centres)</option>
                  <option value="gurgaon">Gurgaon (14 Centres)</option>
                  <option value="chennai">Chennai (9 Centres)</option> */}
                  <option value="hyderabad">Hyderabad </option>
                  {/* <option value="mumbai">Mumbai (15 Centres)</option>
                  <option value="noida">Noida (7 Centres)</option>
                  <option value="pune">Pune (3 Centres)</option> */}
                </select>
              </div>
            </div>

            {/* Workspace Type Select */}
            <div className="px-3.5 py-2.5 bg-[#FAF9F5] rounded-xl border border-[#E5E1D8] flex items-center gap-2.5">
              <Briefcase className="w-4 h-4 text-[#2D3E2D] shrink-0" />
              <div className="w-full text-left">
                <label className="block text-[9px] font-bold uppercase text-[#738273] tracking-wider">
                  Workspace Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#181F18] focus:outline-none cursor-pointer"
                >
                  <option value="private-office">Private Office</option>
                  <option value="dedicated-desk">Dedicated Desk</option>
                  <option value="hot-desk">Hot Desk</option>
                  <option value="meeting-room">Meeting Room</option>
                  <option value="team-suite">Team Suite</option>
                </select>
              </div>
            </div>

            {/* Team Size Select */}
            <div className="px-3.5 py-2.5 bg-[#FAF9F5] rounded-xl border border-[#E5E1D8] flex items-center gap-2.5">
              <Users className="w-4 h-4 text-[#2D3E2D] shrink-0" />
              <div className="w-full text-left">
                <label className="block text-[9px] font-bold uppercase text-[#738273] tracking-wider">
                  Team Size
                </label>
                <select
                  value={selectedTeamSize}
                  onChange={(e) => setSelectedTeamSize(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#181F18] focus:outline-none cursor-pointer"
                >
                  <option value="1">1 Person</option>
                  <option value="1-4">2 – 4 Persons</option>
                  <option value="5-15">5 – 15 Persons</option>
                  <option value="16-30">16 – 30 Persons</option>
                  <option value="30+">30+ Enterprise</option>
                </select>
              </div>
            </div>

            {/* Search Submit Button */}
            <button
              type="submit"
              className="w-full h-full min-h-[50px] bg-[#2D3E2D] hover:bg-[#3D523D] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-warm active:scale-[0.99]"
            >
              <Search className="w-4 h-4 text-[#A3D9A5]" />
              <span>Search</span>
            </button>

          </form>
        </div>
      </div>
    </>
  );
};


