'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building, 
  Leaf, 
  ShieldCheck, 
  HeartHandshake, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Sparkles, 
  ArrowRight,
  Sun,
  VolumeX,
  Compass,
  ExternalLink,
  Navigation
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Line-by-line typewriter animation hook
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

export default function AboutPage() {
  const values = [
    {
      icon: <Leaf className="w-6 h-6 text-[#2E7D32]" />,
      title: 'Biophilic Harmony',
      description: 'We believe nature is vital for intellectual endurance. Our spaces integrate natural sunlight, living botanical courtyards, and purified airflow.'
    },
    {
      icon: <VolumeX className="w-6 h-6 text-[#263626]" />,
      title: 'Acoustic Sanctity',
      description: 'Silence and privacy are the prerequisites for breakthrough ideas. We engineer every wall, door, and pod to eliminate auditory friction.'
    },
    {
      icon: <Building className="w-6 h-6 text-[#C29B38]" />,
      title: 'Architectural Craftsmanship',
      description: 'From solid walnut standing desks to tactile linen acoustic panels, we craft tactile spaces built with genuine architectural materials.'
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-[#C05621]" />,
      title: 'Hospitality First',
      description: 'We treat our members like valued hotel guests—with white-glove concierge support, barista service, and proactive care.'
    }
  ];

  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const typewriterLines = useMemo(
    () => ['Crafted as an architectural', 'sanctuary for', 'deep work.'],
    []
  );
  const { typedLines, currentLineIndex, isTyping } = useLineTypewriter(typewriterLines, 30);

  return (
    <div className="bg-[#FAF9F5] min-h-screen flex flex-col">
      {/* 1. Hero Section (80vh) */}
      <section className="relative h-[80vh] min-h-[600px] max-h-[820px] pt-24 sm:pt-28 lg:pt-32 pb-8 w-full flex flex-col justify-center overflow-hidden">
        {/* Background Image / Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0E170E]/40 via-[#0E170E]/20 to-[#0E170E]/50 z-10 " />
          <img 
            src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=2000&q=80" 
            alt="About EnCourtyard" 
            className={`w-full h-full object-cover object-center filter brightness-100 contrast-105 transition-transform duration-[7000ms] ease-out ${isLoaded ? 'scale-105' : 'scale-100'}`}
          />
        </div>

        {/* Foreground Content with Typewriter and Centered Frosted Glass Blur text boxes */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto text-center flex flex-col items-center justify-center">
          
          {/* <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#4ADE80] mb-6">
            <Compass className="w-3.5 h-3.5" />
            <span>About & Philosophy</span>
          </div> */}

          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="inline-block px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-3xl bg-white/45 hover:bg-white/60 backdrop-blur-md border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
              <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#141F14] leading-[1.15]">
                {typedLines[0]}
                {isTyping && currentLineIndex === 0 && <span className="inline-block w-1 sm:w-1.5 h-6 sm:h-9 bg-[#2E7D32] ml-1 align-middle animate-pulse" />}
              </h1>
            </div>
            
            <div className="inline-block px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-3xl bg-white/45 hover:bg-white/60 backdrop-blur-md border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
              <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1B3B22] italic font-normal leading-[1.15]">
                {typedLines[1]}
                {isTyping && currentLineIndex === 1 && <span className="inline-block w-1 sm:w-1.5 h-6 sm:h-9 bg-[#2E7D32] ml-1 align-middle animate-pulse" />}
              </h1>
            </div>

            <div className="inline-block px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-3xl bg-white/45 hover:bg-white/60 backdrop-blur-md border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
              <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#141F14] leading-[1.15]">
                {typedLines[2]}
                {isTyping && currentLineIndex === 2 && <span className="inline-block w-1 sm:w-1.5 h-6 sm:h-9 bg-[#2E7D32] ml-1 align-middle animate-pulse" />}
              </h1>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="inline-block px-5 sm:px-8 py-2.5 sm:py-3 rounded-2xl bg-white/45 hover:bg-white/60 backdrop-blur-md border border-white/60 text-sm sm:text-lg text-[#181F18] font-sans shadow-[0_8px_25px_rgba(0,0,0,0.1)] leading-relaxed max-w-2xl text-center">
              Learn about our single-company vision, our design principles, and how to schedule your private visit to EnCourtyard.
            </div>
          </div>
        </div>
      </section>

      {/* Company Story & Philosophy */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-6 space-y-6 text-left">
            <span className="text-xs uppercase font-mono tracking-widest text-[#263626] font-semibold">
              The EnCourtyard Story
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#181F18] leading-tight">
              Rethinking workspace through the lens of architectural serenity.
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-[#5C665C] leading-relaxed">
              <p>
                EnCourtyard was founded on a simple observation: modern offices had become noisy, fluorescent-lit warehouses that drained creative energy rather than fostering it.
              </p>
              <p>
                We set out to build a physical sanctuary around an open-air botanical courtyard in the heart of the Innovation District. Every workstation, private suite, and meeting room was custom-commissioned with natural oak, acoustic wool, and circadian lighting.
              </p>
              <p>
                Today, EnCourtyard serves as the exclusive headquarters for pioneering startups, architecture studios, and regional enterprise teams who require confidentiality, hospitality, and serene focus.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden shadow-warm-lg border-2 border-white bg-[#EAE5DB]">
              <img
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80"
                alt="EnCourtyard interior architectural design"
                className="w-full h-[480px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 sm:-right-8 bg-[#263626] text-white p-6 rounded-2xl shadow-2xl border border-[#3A4D3A] max-w-xs hidden sm:block">
              <span className="text-xs font-mono uppercase text-[#4ADE80] block mb-1 font-semibold">
                Our Guarantee
              </span>
              <p className="font-serif text-sm font-semibold">
                "Zero density compromises. Every member enjoys generous personal breathing room."
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Core Values Grid */}
      <section className="py-20 bg-[#F7F5F0] border-y border-[#E5E1D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs uppercase font-mono tracking-widest text-[#263626] font-semibold">
              Our Core Principles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#181F18]">
              What guides our space design
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, idx) => (
              <div
                key={idx}
                className="bg-white p-7 rounded-2xl border border-[#E5E1D8] shadow-warm hover:shadow-warm-lg hover:border-[#263626] transition-all flex flex-col justify-between transform hover:-translate-y-1"
              >
                <div>
                  <div className="w-13 h-13 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] flex items-center justify-center mb-5">
                    {v.icon}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#181F18] mb-2">
                    {v.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C665C] leading-relaxed">
                    {v.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
