'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, Building2, ShieldCheck, Wifi, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { FeaturesTickerMarquee } from '@/components/home/FeaturesTickerMarquee';
import { WhyEnCourtyard } from '@/components/home/WhyEnCourtyard';
import { AmenitiesSection } from '@/components/home/AmenitiesSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { FinalCTA } from '@/components/home/FinalCTA';

// Custom Typewriter Effect Hook
function useTypewriter(text: string, speed: number = 50) {
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
  const heroHeadingText = "Premium Workspaces in Hyderabad.";
  const typedHeading = useTypewriter(heroHeadingText, 70);

  return (
    <div className="flex flex-col w-full max-w-full overflow-x-hidden min-h-screen">
      
      {/* 1. Hero Section (80vh) */}
      <section className="relative h-[80vh] min-h-[600px] max-h-[820px] pt-24 sm:pt-28 lg:pt-32 pb-8 w-full flex flex-col justify-center overflow-hidden">
        {/* Background Image / Overlay - Keeping hero dark for contrast */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0E170E]/40 via-[#0E170E]/20 to-[#0E170E]/50 z-10" />
         
          <img 
            src="/images/book.png" 
            alt="Hyderabad Workspace" 
            className="w-full h-full object-cover object-center filter brightness-100 contrast-105"
          />
        </div>

        {/* Foreground Content with Typewriter and Centered Frosted Glass Blur text boxes */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto text-center flex flex-col items-center justify-center">
          
          {/* <ScrollReveal animation="fade-up" duration={1000}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-4 sm:mb-6">
              <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse shadow-[0_0_8px_rgba(46,125,50,0.8)]" />
              <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[#E3EBE3] uppercase font-mono">
                Now Open in HITEC City
              </span>
            </div>
          </ScrollReveal> */}

          {/* Text Row with Backdrop Blur strictly isolated */}
          <div className="flex justify-center mb-6">
            <div className="inline-block px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-3xl bg-white/45 hover:bg-white/60 backdrop-blur-md border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-colors">
              <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#141F14] leading-[1.15] text-center">
                {typedHeading}
                <span className="inline-block w-1 sm:w-1.5 h-6 sm:h-9 bg-[#2E7D32] ml-1 align-middle animate-pulse" />
              </h1>
            </div>
          </div>
          
          <ScrollReveal animation="glide-up" delay={800}>
            <div className="flex justify-center mt-4">
              <div className="inline-block px-5 sm:px-8 py-2.5 sm:py-3 rounded-2xl bg-white/45 hover:bg-white/60 backdrop-blur-md border border-white/60 text-sm sm:text-lg text-[#181F18] font-sans shadow-[0_8px_25px_rgba(0,0,0,0.1)] leading-relaxed max-w-2xl text-center font-medium">
                Experience the pinnacle of corporate luxury and productivity in the heart of India's Silicon Valley. 
                Elevate your business with our architectural marvels.
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. Marquee Section */}
      <section className="relative w-full z-30 mt-12 sm:mt-16 mb-8">
        <ScrollReveal animation="marquee-curtain" duration={1100}>
          <FeaturesTickerMarquee />
        </ScrollReveal>
      </section>

      {/* 3. SEO Friendly Hyderabad Layout Section */}
      <section id="explore" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-olive-100)] rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            <ScrollReveal animation="slide-right">
              <div className="space-y-6 sm:space-y-8">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight text-[var(--color-charcoal)] leading-tight">
                  A sanctuary for <br className="hidden sm:block" />
                  <span className="italic text-[var(--color-success)]">Hyderabad's innovators.</span>
                </h2>
                
                <div className="space-y-4 text-[var(--color-muted)] font-light leading-relaxed text-base sm:text-lg">
                  <p>
                    Strategically located in the bustling tech corridors of HITEC City and Madhapur, our Hyderabad workspaces are meticulously engineered for clarity, momentum, and unprecedented growth. 
                  </p>
                  <p>
                    We understand that the environment you work in profoundly impacts your output. That's why our spaces combine the tranquility of biophilic design with the raw power of enterprise-grade technology. From 24/7 keyless access to dedicated 1Gbps fiber internet, every detail is optimized for performance.
                  </p>
                  <p>
                    Join a curated community of industry leaders, tech visionaries, and forward-thinking enterprises in Hyderabad's most exclusive business address.
                  </p>
                </div>
                
                <div className="pt-4">
                  <div className="flex items-center gap-4 text-sm font-semibold text-[var(--color-olive-700)]">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[var(--color-success)]" />
                      Prime Locations
                    </div>
                    <div className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-[var(--color-success)]" />
                      Grade A Buildings
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-left" delay={200}>
              <div className="relative rounded-3xl overflow-hidden border border-[var(--color-border)] shadow-[0_20px_50px_rgba(0,0,0,0.1)] group aspect-[4/3] lg:aspect-auto lg:h-[600px]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop" 
                  alt="EnCourtyard Hyderabad Interior" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <p className="text-white font-bold text-xl drop-shadow-md">The Glass Pavilion</p>
                  <p className="text-white/80 text-sm mt-1 drop-shadow-md">Executive Suite, HITEC City</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 4. Why EnCourtyard Section */}
      <WhyEnCourtyard />

      {/* 5. Amenities Section */}
      <AmenitiesSection />

      {/* 6. Testimonials Section */}
      <TestimonialsSection />

      {/* 7. Final CTA Section */}
      <FinalCTA />

    </div>
  );
}
