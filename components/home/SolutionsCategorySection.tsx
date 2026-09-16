'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Building2, CheckCircle2 } from 'lucide-react';

interface SolutionItem {
  id: string;
  category: 'dedicated' | 'flexible' | 'beyond';
  categoryName: string;
  title: string;
  subtitle: string;
  image: string;
  badge?: string;
  capacity: string;
  startingPrice: string;
  link: string;
}

export const SolutionsCategorySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'dedicated' | 'flexible' | 'beyond'>('all');
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Scroll reveal trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const allSolutions: SolutionItem[] = [
    {
      id: 'private-office',
      category: 'dedicated',
      categoryName: 'Dedicated Office',
      title: 'Private Office',
      subtitle: 'Fully-equipped, soundproof, ready-to-move-in private EnCourtyard suites with acoustic STC 48 glass.',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      badge: 'Most In-Demand',
      capacity: '2 – 10 Persons',
      startingPrice: 'From $1,850/mo',
      link: '/workspaces'
    },
    {
      id: 'customised-office',
      category: 'dedicated',
      categoryName: 'Dedicated Office',
      title: 'Customised Team Wing',
      subtitle: 'Offices designed around your team, with flexible layouts, private internal meeting pod, and custom branding.',
      image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
      badge: 'Tailored Floorplan',
      capacity: '12 – 25 Persons',
      startingPrice: 'From $5,200/mo',
      link: '/workspaces'
    },
    {
      id: 'managed-office',
      category: 'dedicated',
      categoryName: 'Dedicated Office',
      title: 'Managed Enterprise Floor',
      subtitle: 'Turnkey full floorplates sourced, designed, built, and operated with dedicated security for your business.',
      image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
      badge: 'Full Private Floor',
      capacity: '30 – 80 Persons',
      startingPrice: 'Custom Enterprise',
      link: '/book'
    },
    {
      id: 'dedicated-desk',
      category: 'flexible',
      categoryName: 'Flexible Access',
      title: 'Atelier Dedicated Desk',
      subtitle: 'Your designated motorized standing desk, lockable storage credenza, and registered business address.',
      image: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80',
      badge: 'Fixed Workstation',
      capacity: '1 Person',
      startingPrice: '$420/mo',
      link: '/workspaces'
    },
    {
      id: 'hot-desk-flex',
      category: 'flexible',
      categoryName: 'Flexible Access',
      title: 'Courtyard Flex Hot Desk',
      subtitle: 'Unrestricted access to our sunlit botanical courtyard commons, quiet study library, and open terrace.',
      image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80',
      badge: 'Open Access',
      capacity: '1 Person (Flex)',
      startingPrice: '$260/mo',
      link: '/pricing'
    },
    {
      id: 'executive-boardroom',
      category: 'beyond',
      categoryName: 'Beyond Workspace',
      title: 'The Oak Boardroom',
      subtitle: '16-seat solid oak table with dual Sony 4K displays, Neat Bar Pro AI cameras, and butler coffee service.',
      image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80',
      badge: 'Boardroom Suite',
      capacity: '14 – 16 Persons',
      startingPrice: '$95/hr',
      link: '/meeting-rooms'
    },
    {
      id: 'glass-pavilion',
      category: 'beyond',
      categoryName: 'Beyond Workspace',
      title: 'The Glass Pavilion Hall',
      subtitle: '18-foot vaulted glass amphitheater with laser 4K projection, multi-zone sound, and pre-function foyer.',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
      badge: 'Keynotes & Demos',
      capacity: '40 – 70 Persons',
      startingPrice: '$220/hr',
      link: '/meeting-rooms'
    },
    {
      id: 'creative-studio-lab',
      category: 'dedicated',
      categoryName: 'Dedicated Office',
      title: 'Atelier Design Studio',
      subtitle: 'Specialized creative suites with color-calibrated 5000K lighting, heavy duty drafting tables, and media storage.',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
      badge: 'Creative Lab',
      capacity: '6 – 12 Persons',
      startingPrice: 'From $3,100/mo',
      link: '/workspaces'
    },
    {
      id: 'day-pass-dropin',
      category: 'flexible',
      categoryName: 'Flexible Access',
      title: 'Day Pass & Flex 5',
      subtitle: 'Immediate single-day access to enterprise fiber, phone booths, and complimentary barista coffee bar.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      badge: 'Instant Drop-In',
      capacity: 'Solo Visitor',
      startingPrice: '$35/day',
      link: '/pricing'
    }
  ];

  const filteredItems = activeTab === 'all' 
    ? allSolutions 
    : allSolutions.filter(item => item.category === activeTab);

  // Check scroll state
  const checkScrollState = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 20);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScrollState);
    checkScrollState();
    return () => el.removeEventListener('scroll', checkScrollState);
  }, [filteredItems]);

  // Scroll Actions
  const slideLeft = () => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.clientWidth / 3;
      sliderRef.current.scrollBy({ left: -cardWidth - 24, behavior: 'smooth' });
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.clientWidth / 3;
      sliderRef.current.scrollBy({ left: cardWidth + 24, behavior: 'smooth' });
    }
  };

  // Auto-slide from left to right every 4.2 seconds when not hovered
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        if (scrollLeft >= scrollWidth - clientWidth - 20) {
          sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          const cardWidth = clientWidth / 3;
          sliderRef.current.scrollBy({ left: cardWidth + 24, behavior: 'smooth' });
        }
      }
    }, 4200);

    return () => clearInterval(interval);
  }, [isPaused, filteredItems]);

  return (
    <section 
      ref={sectionRef}
      className="pt-24 sm:pt-28 lg:pt-32 pb-24 lg:pb-32 relative overflow-hidden bg-gradient-to-b from-[#F2EFE8] via-[#FAF7F0] to-[#EFECE4] border-y-2 border-[#DDD5C7] shadow-inner"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Architectural Dot Pattern Background */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#C8BFB0 1.2px, transparent 1.2px)',
          backgroundSize: '28px 28px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Row with Scroll Reveal Animation */}
        <div 
          className={`flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 transition-all duration-700 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E3EBE3] border border-[#CFDCCF] text-xs font-semibold text-[#263626] mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Full Portfolio Architecture</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181F18] tracking-tight">
              Explore our host of solutions
            </h2>
            <p className="text-sm sm:text-base text-[#5C665C] mt-2 font-sans max-w-2xl">
              Tailored workspaces engineered for individual builders, expanding scale-ups, and global enterprise teams.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/workspaces"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#181F18] hover:text-[#263626] group shrink-0 transition-colors mr-2"
            >
              <span>VIEW ALL</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            {/* Slider Next / Prev Controls */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={slideLeft}
                disabled={!canScrollLeft}
                className={`w-11 h-11 rounded-full border border-[#D5CEC2] flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                  canScrollLeft
                    ? 'bg-white text-[#181F18] hover:bg-[#263626] hover:text-white hover:border-[#263626] hover:scale-105'
                    : 'bg-[#EAE5DC] text-[#A3B0A3] opacity-40 cursor-not-allowed'
                }`}
                aria-label="Previous cards"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={slideRight}
                className="w-11 h-11 rounded-full border border-[#D5CEC2] bg-white text-[#181F18] hover:bg-[#263626] hover:text-white hover:border-[#263626] flex items-center justify-center transition-all shadow-sm hover:scale-105 cursor-pointer"
                aria-label="Next cards"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs: ALL | Dedicated Offices | Flexible Access | Beyond Workspace */}
        <div 
          className={`flex items-center gap-6 sm:gap-10 border-b border-[#D5CEC2] pb-3 mb-10 overflow-x-auto text-sm sm:text-base transition-all duration-700 delay-100 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 font-semibold transition-all relative whitespace-nowrap cursor-pointer ${
              activeTab === 'all'
                ? 'text-[#181F18] font-bold'
                : 'text-[#7A857A] hover:text-[#181F18]'
            }`}
          >
            <span>All Solutions ({allSolutions.length})</span>
            {activeTab === 'all' && (
              <span className="absolute bottom-[-13px] left-0 right-0 h-[3px] bg-[#263626] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('dedicated')}
            className={`pb-3 font-semibold transition-all relative whitespace-nowrap cursor-pointer ${
              activeTab === 'dedicated'
                ? 'text-[#181F18] font-bold'
                : 'text-[#7A857A] hover:text-[#181F18]'
            }`}
          >
            <span>Dedicated Offices</span>
            {activeTab === 'dedicated' && (
              <span className="absolute bottom-[-13px] left-0 right-0 h-[3px] bg-[#263626] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('flexible')}
            className={`pb-3 font-semibold transition-all relative whitespace-nowrap cursor-pointer ${
              activeTab === 'flexible'
                ? 'text-[#181F18] font-bold'
                : 'text-[#7A857A] hover:text-[#181F18]'
            }`}
          >
            <span>Flexible Access</span>
            {activeTab === 'flexible' && (
              <span className="absolute bottom-[-13px] left-0 right-0 h-[3px] bg-[#263626] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('beyond')}
            className={`pb-3 font-semibold transition-all relative whitespace-nowrap cursor-pointer ${
              activeTab === 'beyond'
                ? 'text-[#181F18] font-bold'
                : 'text-[#7A857A] hover:text-[#181F18]'
            }`}
          >
            <span>Beyond Workspace</span>
            {activeTab === 'beyond' && (
              <span className="absolute bottom-[-13px] left-0 right-0 h-[3px] bg-[#263626] rounded-full" />
            )}
          </button>
        </div>

        {/* 3-CARDS PER ROW AUTO-SLIDING CAROUSEL WITH SCROLL-IN TRANSITION */}
        <div
          ref={sliderRef}
          className={`flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 transition-all duration-700 delay-200 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-98'
          }`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              className="w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc((100%-48px)/3)] shrink-0 snap-start"
            >
              <Link
                href={item.link}
                className="group bg-white rounded-3xl border border-[#DCD4C6] p-7 flex flex-col justify-between h-full shadow-warm hover:shadow-2xl hover:border-[#263626] transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden"
              >
                {/* Header Content */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#738273] font-semibold block mb-1">
                        {item.categoryName}
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-[#181F18] group-hover:text-[#263626] transition-colors leading-tight">
                        {item.title}
                      </h3>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#E3EBE3] text-[#263626] font-bold shrink-0 border border-[#CFDCCF]">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-[#5C665C] leading-relaxed mb-6 line-clamp-3">
                    {item.subtitle}
                  </p>
                </div>

                {/* Center Image Container with 3D Float Hover Animation */}
                <div className="relative my-4 aspect-[16/10] rounded-2xl overflow-hidden bg-[#EAE5DB] border border-[#DCD4C6] shadow-inner">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Overlay capacity badge */}
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-md text-xs font-mono text-white font-medium border border-white/20">
                    {item.capacity}
                  </div>
                </div>

                {/* Bottom Meta & Circular Action Arrow Button */}
                <div className="pt-4 border-t border-[#EAE4D8] flex items-center justify-between mt-2">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#738273] block font-semibold">Pricing</span>
                    <span className="font-serif font-bold text-base text-[#181F18]">{item.startingPrice}</span>
                  </div>

                  {/* Circular Action Button with Hover Expansion */}
                  <div className="w-11 h-11 rounded-full border border-[#D5CEC2] bg-[#FAF9F5] text-[#181F18] flex items-center justify-center group-hover:bg-[#263626] group-hover:text-white group-hover:border-[#263626] transition-all duration-300 shrink-0 shadow-sm group-hover:scale-110">
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </div>
                </div>

              </Link>
            </div>
          ))}
        </div>

        {/* Auto-Slide Status Caption */}
        <div className="mt-4 flex items-center justify-between text-xs text-[#738273] pt-2">
          <span>Showing 3 workspaces per view · Auto-scrolling smoothly</span>
          <span className="font-mono">{isPaused ? '(Paused on hover)' : '(Auto-sliding left to right)'}</span>
        </div>

      </div>
    </section>
  );
};
