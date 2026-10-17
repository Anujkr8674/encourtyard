'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  MapPin, 
  Building2, 
  Clock, 
  Sparkles, 
  Sun, 
  Moon, 
  Laptop, 
  Users, 
  Mic, 
  Coffee, 
  CheckCircle2, 
  Navigation,
  ExternalLink
} from 'lucide-react';
import { FinalCTA } from '@/components/home/FinalCTA';

// Custom Typewriter Effect Hook
function useTypewriter(text: string, speed: number = 45) {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, speed);

    return () => clearInterval(typingInterval);
  }, [text, speed]);

  return displayText;
}

export default function HyderabadPage() {
  const heroHeadingText = "Work from the Heart of Hyderabad.";
  const typedHeading = useTypewriter(heroHeadingText, 50);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const experienceSteps = [
    { step: '01', title: 'Start your day with a cup of coffee', desc: 'Fresh coffee and tea available for members to start the morning energized.', icon: <Coffee className="w-4 h-4 text-[#2E7D32]" /> },
    { step: '02', title: 'Settle into your desk', desc: '110 ergonomic open desks with high-speed internet and power access.', icon: <Laptop className="w-4 h-4 text-[#2E7D32]" /> },
    { step: '03', title: 'Meet your team', desc: 'Collaborate inside 8 private cabins and dedicated team clusters.', icon: <Users className="w-4 h-4 text-[#2E7D32]" /> },
    { step: '04', title: 'Bring your clients into a professional meeting room', desc: 'Hourly meeting rooms and 20-seater conference hall with video displays.', icon: <Building2 className="w-4 h-4 text-[#2E7D32]" /> },
    { step: '05', title: 'Record your next podcast', desc: 'Studio room with podcast setup ready for interviews and content creation.', icon: <Mic className="w-4 h-4 text-[#2E7D32]" /> },
    { step: '06', title: 'Take a break at the cafeteria', desc: 'Dedicated member cafeteria for food, conversations, and refreshments.', icon: <Coffee className="w-4 h-4 text-[#2E7D32]" /> },
    { step: '07', title: 'And if the work isn’t finished by evening, stay. We’re open 24/7', desc: 'Work around the clock according to your schedule with full security.', icon: <Moon className="w-4 h-4 text-[#2E7D32]" /> },
  ];

  return (
    <div className="flex flex-col w-full max-w-full overflow-x-hidden min-h-screen bg-white font-sans">
      
      {/* 1. HERO SECTION (80vh) */}
      <section className="relative h-[80vh] min-h-[580px] max-h-[800px] pt-24 sm:pt-28 lg:pt-32 pb-8 w-full flex flex-col justify-center overflow-hidden">
        {/* Background Image / Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0E170E]/50 via-[#0E170E]/25 to-[#0E170E]/60 z-10" />
         
          <img 
            src="/images/book.png" 
            alt="EnCourtyard Workspaces Hyderabad" 
            className={`w-full h-full object-cover object-center filter brightness-100 contrast-105 transition-transform duration-[7000ms] ease-out ${isLoaded ? 'scale-105' : 'scale-100'}`}
          />
        </div>

        {/* Foreground Content with Centered Frosted Glass Boxes */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto text-center flex flex-col items-center justify-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-semibold text-white mb-6">
            <MapPin className="w-3.5 h-3.5 text-[#4ADE80]" />
            <span className="tracking-widest uppercase font-mono text-[11px]">KHAIRTABAD, HYDERABAD</span>
          </div>

          <div className="flex justify-center mb-6">
            <div className="inline-block px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-3xl bg-white/50 hover:bg-white/65 backdrop-blur-md border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-colors">
              <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#141F14] leading-[1.15] text-center">
                {typedHeading}
                <span className="inline-block w-1 sm:w-1.5 h-6 sm:h-9 bg-[#2E7D32] ml-1 align-middle animate-pulse" />
              </h1>
            </div>
          </div>
          
          <div className="flex justify-center max-w-2xl px-2">
            <div className="inline-block px-5 sm:px-8 py-2.5 sm:py-3 rounded-2xl bg-white/50 hover:bg-white/65 backdrop-blur-md border border-white/60 text-xs sm:text-sm md:text-base text-[#181F18] font-sans shadow-[0_8px_25px_rgba(0,0,0,0.1)] leading-relaxed text-center font-medium">
              Located in Khairtabad, Encourtyard Workspaces offers a professional and accessible workspace for individuals, teams, and businesses across Hyderabad.
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://www.google.com/maps/search/?api=1&query=EnCourtyard+Workspaces+Khairtabad+Hyderabad"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#2E7D32] hover:bg-[#1E5C23] text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-md hover:scale-105"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Directions</span>
            </a>

            <Link
              href="/book-space?plan=day-pass"
              className="inline-flex items-center gap-2 bg-white/80 hover:bg-white text-[#181F18] px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-md hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Book Day Pass</span>
            </Link>
          </div>

        </div>
      </section>

      {/* 2. SECTION 13: LOCATION (Work from the Heart of Hyderabad) */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#E5E1D8]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] text-[11px] font-mono uppercase tracking-widest text-[#1B5E20] font-bold">
              LOCATION
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181F18] leading-tight">
              Work from the Heart of Hyderabad.
            </h2>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF9F5] border border-[#DDD7CA] space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#738273] font-semibold block">
                PRIME ADDRESS
              </span>
              <p className="font-serif text-lg sm:text-xl font-bold text-[#181F18]">
                Location: Khairtabad, Hyderabad
              </p>
              <p className="text-xs text-[#5C665C]">
                H.No. 6-2-981, Flat No. 101, Maruthi Plaza, Shadan College Road, Above Axis Bank, Khairtabad, Hyderabad - 500004
              </p>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-[#4A574A] leading-relaxed">
              <p>
                Located in Khairtabad, Encourtyard Workspaces offers a professional and accessible workspace for individuals, teams, and businesses across Hyderabad.
              </p>
              <p>
                Whether you’re coming in for a full workday, a client meeting, a conference, or simply need a desk for a few hours, Encourtyard is ready for you.
              </p>
            </div>

            {/* Highlights Bar */}
            <div className="p-4 rounded-xl bg-[#E8F5E9]/50 border border-[#C8E6C9] text-xs sm:text-sm font-semibold text-[#1B5E20] flex flex-wrap items-center gap-2 sm:gap-4">
              <span>Central Location.</span>
              <span className="text-[#81C784]">•</span>
              <span>Premium Workspace.</span>
              <span className="text-[#81C784]">•</span>
              <span>Flexible Access.</span>
            </div>

            {/* Button: Get Directions */}
            <div className="pt-2">
              <a
                href="https://www.google.com/maps/search/?api=1&query=EnCourtyard+Workspaces+Khairtabad+Hyderabad"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-[#2E7D32] hover:bg-[#1E5C23] text-white px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 group"
              >
                <Navigation className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>Get Directions</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-white aspect-[4/3] bg-[#FAF9F5]">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop"
                alt="EnCourtyard Khairtabad Hyderabad Workspace"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white p-5 rounded-2xl shadow-xl border border-[#DDD7CA] max-w-xs hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#738273] font-semibold block">Transit Hub</span>
                  <p className="text-xs font-bold text-[#181F18]">Minutes from Khairtabad Metro & Lakdi-ka-pul</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. SECTION 14: A PROFESSIONAL ADDRESS FOR YOUR BUSINESS (Make the Right Impression) */}
      <section className="py-20 lg:py-28 bg-[#FAF9F5] border-b border-[#E5E1D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 relative order-2 lg:order-1">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-white aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80"
                  alt="Make the right impression at EnCourtyard Hyderabad"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5 text-left order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] text-[11px] font-mono uppercase tracking-widest text-[#1B5E20] font-bold">
                A PROFESSIONAL ADDRESS FOR YOUR BUSINESS
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181F18] leading-tight">
                Make the Right Impression.
              </h2>
              
              <p className="text-base text-[#2E7D32] font-medium font-serif">
                Your workspace is more than where you sit.
              </p>

              <ul className="space-y-2.5 text-sm sm:text-base text-[#4A574A]">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                  <span>It’s where you meet clients.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                  <span>It’s where your team collaborates.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                  <span>It’s where ideas become businesses.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                  <span>It’s where your brand makes an impression.</span>
                </li>
              </ul>

              <p className="text-sm sm:text-base text-[#4A574A] leading-relaxed pt-1">
                That’s why Encourtyard has been designed and maintained as a premium professional workspace where you can confidently bring your clients, partners, and team.
              </p>

              <div className="pt-2">
                <div className="inline-block px-5 py-3 rounded-xl bg-white border border-[#DDD7CA] text-xs sm:text-sm font-bold text-[#181F18] font-serif shadow-xs">
                  Look professional. Work comfortably. Grow confidently.
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. SECTION 3: 24/7 WORKSPACE ACCESS (WORK ON YOUR TERMS) */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#E5E1D8]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] text-[11px] font-mono uppercase tracking-widest text-[#1B5E20] font-bold">
              WORK ON YOUR TERMS
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181F18] leading-tight">
              Your Office Doesn’t Have a Closing Time.
            </h2>

            <p className="text-base sm:text-lg text-[#2E7D32] font-medium font-serif">
              Your work doesn’t always happen between 9 and 6. That’s why Encourtyard is open 24/7.
            </p>

            <p className="text-sm sm:text-base text-[#4A574A] leading-relaxed">
              Whether you’re an early riser, working late into the night, running a night shift, managing an international team, or simply need a workspace outside conventional office hours, we’re here when you need us.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#DDD7CA]">
                <div className="flex items-center gap-2 text-sm font-bold text-[#181F18] mb-1">
                  <Sun className="w-4 h-4 text-[#D97706]" />
                  <span>Day or Night</span>
                </div>
                <p className="text-xs text-[#5C665C]">
                  Weekday or weekend. Your workspace is ready.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#DDD7CA]">
                <div className="flex items-center gap-2 text-sm font-bold text-[#181F18] mb-1">
                  <Moon className="w-4 h-4 text-[#2E7D32]" />
                  <span>No Closing Time</span>
                </div>
                <p className="text-xs text-[#5C665C]">
                  No worrying about night shifts. No rushing to finish before closing.
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm font-bold text-[#181F18] pt-1 font-serif">
              At Encourtyard, you work according to your schedule.
            </p>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl bg-[#0c1b2a] text-white p-7 sm:p-9 shadow-2xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-44 h-44 bg-[#4ADE80]/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-[#4ADE80]">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#4ADE80] block font-bold">24/7/365 HYDERABAD ACCESS</span>
                  <h3 className="font-serif text-xl font-bold text-white">Full Security & Power</h3>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-[#E3EBE3]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0 mt-0.5" />
                  <span>Uninterrupted power backup & high-speed internet</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0 mt-0.5" />
                  <span>Night-shift operations ready for global client teams</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0 mt-0.5" />
                  <span>Access control & round-the-clock facility security</span>
                </li>
              </ul>

              <div className="mt-7 pt-5 border-t border-white/15 flex items-center justify-between">
                <span className="text-xs text-white/70">Flexible day passes available</span>
                <Link
                  href="/book-space?plan=day-pass"
                  className="text-xs font-bold text-[#4ADE80] hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  Book 1-Day Pass &rarr;
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. SECTION 11: THE ENCOURTYARD EXPERIENCE */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#E5E1D8]">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#2E7D32] font-bold block mb-2">
            DAILY FLOW AT ENCOURTYARD
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181F18]">
            Come for the Space. Stay for the Experience.
          </h2>
          <p className="text-sm sm:text-base text-[#4A574A] mt-3">
            At Encourtyard, we have created an environment where productivity and comfort come together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {experienceSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-[#DDD7CA] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-md">
                    Step {step.step}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-[#FAF9F5] border border-[#E5E1D8] flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                <h4 className="font-serif font-bold text-base text-[#181F18] mb-1.5 leading-snug">
                  {step.title}
                </h4>
                <p className="text-xs text-[#5C665C] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <FinalCTA />

    </div>
  );
}
