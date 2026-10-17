'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Laptop, 
  Globe, 
  Plane, 
  Moon, 
  Mic, 
  Rocket, 
  ArrowRight 
} from 'lucide-react';

// Line-by-line typewriter animation hook
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

export default function AboutPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const typewriterLines = useMemo(
    () => ['More Than Just A Desk.', 'A Workspace Built Around', 'Your Workday.'],
    []
  );
  const { typedLines, currentLineIndex, isTyping } = useLineTypewriter(typewriterLines, 30);

  const whoWeServeList = [
    {
      title: 'Startups',
      icon: <Rocket className="w-5 h-5 text-[#2E7D32]" />,
      desc: 'Launch and grow your business without the cost and complexity of setting up your own office.',
      quote: 'Build your business. Not your office infrastructure.'
    },
    {
      title: 'Growing Teams',
      icon: <Users className="w-5 h-5 text-[#2E7D32]" />,
      desc: 'Give your team a professional environment with private cabins, meeting facilities, and access to shared amenities.',
      quote: 'A workspace that grows with you.'
    },
    {
      title: 'Freelancers',
      icon: <Laptop className="w-5 h-5 text-[#2E7D32]" />,
      desc: 'Get away from the distractions of home and work from a professional environment built for productivity.',
      quote: 'Your work deserves a proper workspace.'
    },
    {
      title: 'Remote Professionals',
      icon: <Globe className="w-5 h-5 text-[#2E7D32]" />,
      desc: 'Working remotely doesn’t mean you have to work alone.',
      quote: 'Get a professional workspace that helps you build a productive routine.'
    },
    {
      title: 'Business Travellers',
      icon: <Plane className="w-5 h-5 text-[#2E7D32]" />,
      desc: 'In Hyderabad for a day? Don’t settle for working from a hotel room or café.',
      quote: 'Get a professional workspace with our Day Pass.'
    },
    {
      title: 'Night-Shift Teams',
      icon: <Moon className="w-5 h-5 text-[#2E7D32]" />,
      desc: 'Customer support, technology, operations, or international teams—if your business works at night, your workspace should too.',
      quote: '24/7 access. No closing time.'
    },
    {
      title: 'Creators',
      icon: <Mic className="w-5 h-5 text-[#2E7D32]" />,
      desc: 'Podcasts, interviews, videos, and business content—our ready-to-use studio gives creators the space to turn ideas into content.',
      quote: 'Studio ready for audio, video, and content creation.'
    }
  ];

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      
      {/* 1. HERO SECTION (80vh) */}
      <section className="relative h-[80vh] min-h-[580px] max-h-[800px] pt-24 sm:pt-28 lg:pt-32 pb-8 w-full flex flex-col justify-center overflow-hidden">
        {/* Background Image / Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0E170E]/50 via-[#0E170E]/25 to-[#0E170E]/60 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=2000&q=80" 
            alt="About EnCourtyard" 
            className={`w-full h-full object-cover object-center filter brightness-100 contrast-105 transition-transform duration-[7000ms] ease-out ${isLoaded ? 'scale-105' : 'scale-100'}`}
          />
        </div>

        {/* Foreground Content with Typewriter */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto text-center flex flex-col items-center justify-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-semibold text-white mb-6">
            <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
            <span className="tracking-widest uppercase font-mono text-[11px]">MORE THAN JUST A DESK</span>
          </div>

          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="inline-block px-5 sm:px-8 py-2 sm:py-3 rounded-2xl bg-white/50 hover:bg-white/65 backdrop-blur-md border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
              <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#141F14] leading-[1.15]">
                {typedLines[0]}
                {isTyping && currentLineIndex === 0 && <span className="inline-block w-1 sm:w-1.5 h-6 sm:h-9 bg-[#2E7D32] ml-1 align-middle animate-pulse" />}
              </h1>
            </div>
            
            <div className="inline-block px-5 sm:px-8 py-2 sm:py-3 rounded-2xl bg-white/50 hover:bg-white/65 backdrop-blur-md border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
              <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1B3B22] italic font-normal leading-[1.15]">
                {typedLines[1]}
                {isTyping && currentLineIndex === 1 && <span className="inline-block w-1 sm:w-1.5 h-6 sm:h-9 bg-[#2E7D32] ml-1 align-middle animate-pulse" />}
              </h1>
            </div>

            <div className="inline-block px-5 sm:px-8 py-2 sm:py-3 rounded-2xl bg-white/50 hover:bg-white/65 backdrop-blur-md border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
              <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#141F14] leading-[1.15]">
                {typedLines[2]}
                {isTyping && currentLineIndex === 2 && <span className="inline-block w-1 sm:w-1.5 h-6 sm:h-9 bg-[#2E7D32] ml-1 align-middle animate-pulse" />}
              </h1>
            </div>
          </div>
          
          <div className="flex justify-center max-w-2xl px-2">
            <div className="inline-block px-5 sm:px-8 py-2.5 sm:py-3 rounded-2xl bg-white/50 hover:bg-white/65 backdrop-blur-md border border-white/60 text-xs sm:text-sm md:text-base text-[#181F18] font-sans shadow-[0_8px_25px_rgba(0,0,0,0.1)] leading-relaxed text-center font-medium">
              We believe a good workspace should do more than give you a chair and a desk. It should provide the environment, flexibility, comfort, and professional infrastructure you need to do your best work.
            </div>
          </div>

        </div>
      </section>

      {/* 2. SECTION: ABOUT US (MORE THAN JUST A DESK) */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] text-[11px] font-mono uppercase tracking-widest text-[#1B5E20] font-bold">
              MORE THAN JUST A DESK
            </div>
            
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181F18] leading-tight">
              A Workspace Built Around Your Workday.
            </h2>
            
            <div className="space-y-4 text-sm sm:text-base text-[#4A574A] leading-relaxed">
              <p>
                We believe a good workspace should do more than give you a chair and a desk. It should provide the environment, flexibility, comfort, and professional infrastructure you need to do your best work.
              </p>
              <p>
                Encourtyard Workspaces has been thoughtfully designed to provide a premium experience for individuals, teams, and businesses looking for a better way to work.
              </p>
            </div>

            <div className="pt-2">
              <div className="inline-block p-4 sm:p-5 rounded-2xl bg-[#FAF9F5] border border-[#DDD7CA] shadow-sm">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#738273] block mb-1 font-semibold">
                  OUR PHILOSOPHY
                </span>
                <p className="font-serif text-lg sm:text-xl font-bold text-[#2E7D32]">
                  Work. Meet. Create. Connect. Grow.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-white bg-[#EAE5DB] aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
                alt="EnCourtyard thoughtful workspace environment"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-[#263626] text-white p-5 sm:p-6 rounded-2xl shadow-2xl border border-[#3A4D3A] max-w-xs hidden sm:block">
              <span className="text-xs font-mono uppercase text-[#4ADE80] block mb-1 font-semibold">
                Designed For Excellence
              </span>
              <p className="font-serif text-sm font-medium text-[#E3EBE3]">
                "Environment, flexibility, comfort, and infrastructure crafted for peak performance."
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. SECTION: WHO WE SERVE (BUILT FOR EVERY KIND OF PROFESSIONAL) */}
      <section className="py-20 lg:py-28 bg-[#FAF9F5] border-y border-[#E5E1D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] text-[11px] font-mono uppercase tracking-widest text-[#1B5E20] font-bold mb-3">
              BUILT FOR EVERY KIND OF PROFESSIONAL
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181F18] tracking-tight">
              A Workspace for Every Ambition.
            </h2>
            <p className="text-sm sm:text-base text-[#5C665C] mt-2.5">
              Designed to empower every stage of professional pursuit in Hyderabad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whoWeServeList.map((item, idx) => (
              <div
                key={idx}
                className={`p-6 sm:p-7 rounded-2xl bg-white border border-[#DDD7CA] shadow-warm hover:shadow-xl hover:border-[#2E7D32] transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 ${
                  idx === whoWeServeList.length - 1 ? 'md:col-span-2 lg:col-span-3 lg:max-w-xl lg:mx-auto' : ''
                }`}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#FAF9F5] border border-[#DDD7CA] group-hover:bg-[#E8F5E9] group-hover:border-[#2E7D32] flex items-center justify-center mb-4 transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#181F18] mb-2 group-hover:text-[#2E7D32] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4A574A] leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EAE5DB]">
                  <p className="text-xs font-semibold text-[#2E7D32] font-serif italic">
                    "{item.quote}"
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. SECTION: A COMMUNITY OF PEOPLE WHO BUILD */}
      <section className="py-20 lg:py-26 bg-[#0c1b2a] text-white relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2E7D32]/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#4ADE80] font-bold block">
            ECOSYSTEM OF BUILDERS
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Work Around People. Grow With People.
          </h2>

          <p className="text-base sm:text-lg text-[#DCE6DC] leading-relaxed max-w-3xl mx-auto">
            Coworking isn’t just about sharing a building. It’s about being surrounded by people with ideas, ambition, and different perspectives.
          </p>

          <p className="text-sm sm:text-base text-[#DCE6DC]/90 leading-relaxed max-w-2xl mx-auto">
            At Encourtyard, you become part of an environment where entrepreneurs, professionals, freelancers, startups, and creators work alongside one another.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-4 text-left">
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <p className="font-serif italic text-sm text-[#86EFAC]">
                "A coffee conversation could become a collaboration."
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <p className="font-serif italic text-sm text-[#86EFAC]">
                "A casual introduction could become a business opportunity."
              </p>
            </div>
          </div>

          <p className="text-sm sm:text-base font-bold text-white pt-2 font-serif tracking-wide">
            Work independently. Connect naturally. Grow together.
          </p>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/book-space"
              className="inline-flex items-center gap-2 bg-[#2E7D32] hover:bg-[#1E5C23] text-white px-6 py-3 rounded-full font-semibold text-xs sm:text-sm transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span>Explore Workspaces</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-semibold text-xs sm:text-sm border border-white/30 transition-all hover:scale-105"
            >
              <span>Schedule a Tour</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
