'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Compass, 
  MapPin, 
  ExternalLink, 
  Navigation 
} from 'lucide-react';
import { ContactForm } from '@/components/about/ContactForm';

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

export default function ContactPage() {
  const typewriterLines = useMemo(
    () => ['Connect with our team.', 'Schedule a private', 'tour today.'],
    []
  );
  const { typedLines, currentLineIndex, isTyping } = useLineTypewriter(typewriterLines, 30);

  return (
    <div className="bg-[#FAF9F5] min-h-screen flex flex-col">
      {/* 1. Hero Section (80vh) */}
      <section className="relative h-[80vh] min-h-[600px] max-h-[820px] pt-24 sm:pt-28 lg:pt-32 pb-8 w-full flex flex-col justify-center overflow-hidden">
        {/* Background Image / Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0E170E]/40 via-[#0E170E]/20 to-[#0E170E]/50 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80" 
            alt="Contact EnCourtyard" 
            className="w-full h-full object-cover object-center filter brightness-100 contrast-105"
          />
        </div>

        {/* Foreground Content with Typewriter and Centered Frosted Glass Blur text boxes */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto text-center flex flex-col items-center justify-center">
          
          {/* <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#4ADE80] mb-6">
            <Compass className="w-3.5 h-3.5" />
            <span>Contact Us</span>
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
              Our concierge team is ready to answer your questions and arrange a bespoke tour of our facilities.
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Contact & Tour Section */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ContactForm />
      </section>

      {/* Location & Opening Hours Section */}
      <section id="location-hours" className="py-20 bg-[#F7F5F0] border-t border-[#E5E1D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-[#263626] font-semibold">
                  Campus Location & Accessibility
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18] mt-2">
                  Situated in Khairtabad, Hyderabad
                </h3>
                <p className="text-sm text-[#5C665C] mt-2 leading-relaxed">
                  Located at Maruthi Plaza, Shadan College Road, Above Axis Bank, Khairtabad. Conveniently situated with direct city connectivity, nearby Metro station, and dedicated visitor parking.
                </p>
              </div>

              <div className="space-y-3 bg-white p-7 rounded-2xl border border-[#E5E1D8] shadow-warm text-xs sm:text-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E1D8]">
                  <span className="font-medium text-[#181F18]">EnCourtyard Member Access</span>
                  <span className="font-mono text-[#2E7D32] font-bold">24/7 / 365 Days</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E1D8]">
                  <span className="font-medium text-[#181F18]">Concierge & Tour Hours</span>
                  <span className="font-mono text-[#5C665C]">Mon–Sat: 9:00 AM – 7:00 PM</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E1D8]">
                  <span className="font-medium text-[#181F18]">Botanical Café & Barista</span>
                  <span className="font-mono text-[#5C665C]">Mon–Sat: 8:30 AM – 6:30 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#181F18]">Support & Concierge</span>
                  <span className="font-mono text-[#2E7D32] font-bold">+91 99082 09993</span>
                </div>
              </div>
            </div>

            {/* Architectural Campus Map Card with Embedded Google Maps */}
            <div className="lg:col-span-6 bg-white p-5 sm:p-7 rounded-3xl border border-[#E5E1D8] shadow-warm space-y-4">
              <div className="h-72 sm:h-80 w-full rounded-2xl overflow-hidden bg-[#181F18] relative shadow-inner border border-[#E5E1D8] group">
                <iframe
                  src="https://maps.google.com/maps?q=Maruthi+Plaza,+Taj+Enclave,+Khairtabad,+Hyderabad,+Telangana+500004&t=&z=17&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="EnCourtyard Location - Maruthi Plaza, Khairtabad, Hyderabad"
                  className="w-full h-full rounded-2xl filter contrast-[1.02]"
                />

                {/* Direct Google Maps Direction Floating Badge */}
                <a
                  href="https://www.google.com/maps/place/Maruthi+Plaza,+Taj+Enclave,+Khairtabad,+Hyderabad,+Telangana+500004/@17.4098351,78.4586992,17z/data=!3m1!4b1!4m6!3m5!1s0x3bcb974488a4e72f:0x5e7bbe93e8d4635a!8m2!3d17.40983!4d78.4612741!16s%2Fg%2F11vcmzws2x?authuser=0&entry=ttu&g_ep=EgoyMDI2MDkxNi4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#181F18]/90 hover:bg-[#263626] text-white text-xs font-semibold backdrop-blur-md border border-white/20 shadow-lg transition-all hover:scale-105 group-hover:border-[#4ADE80]"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#4ADE80]" />
                  <span>Get Directions</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#5C665C] pt-1 gap-2">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                  <span className="font-medium text-[#181F18]">Maruthi Plaza, Above Axis Bank, Khairtabad</span>
                </div>
                <a
                  href="https://www.google.com/maps/place/Maruthi+Plaza,+Taj+Enclave,+Khairtabad,+Hyderabad,+Telangana+500004/@17.4098351,78.4586992,17z/data=!3m1!4b1!4m6!3m5!1s0x3bcb974488a4e72f:0x5e7bbe93e8d4635a!8m2!3d17.40983!4d78.4612741!16s%2Fg%2F11vcmzws2x?authuser=0&entry=ttu&g_ep=EgoyMDI2MDkxNi4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2E7D32] hover:text-[#181F18] font-semibold inline-flex items-center gap-1 hover:underline shrink-0"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
