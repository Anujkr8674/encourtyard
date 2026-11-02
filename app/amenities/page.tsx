'use client';

import React from 'react';
import Link from 'next/link';
import {
  Monitor,
  Zap,
  Wifi,
  ShieldCheck,
  Coffee,
  Sparkles,
  ArrowRight,
  CheckCircle,
  CheckCircle2,
  Calendar,
  Phone,
  Users,
  Printer,
  Mic,
  Utensils,
  UserCheck
} from 'lucide-react';
import { AMENITIES_DATA } from '@/lib/amenitiesData';

export default function AmenitiesCatalogPage() {
  const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
    Monitor,
    Zap,
    Wifi,
    ShieldCheck,
    Coffee,
    Sparkles,
    Users,
    Printer,
    Mic,
    Utensils,
    UserCheck
  };

  return (
    <div
      style={{ fontFamily: 'Tahoma, Verdana, Segoe UI, sans-serif' }}
      className="bg-[#FAF9F5] min-h-screen text-[#181F18] selection:bg-[#2E7D32] selection:text-white pb-24 amenities-tahoma"
    >
      <style>{`
        .amenities-tahoma, .amenities-tahoma * {
          font-family: Tahoma, Verdana, 'Segoe UI', sans-serif !important;
        }
      `}</style>
      
      {/* 1. Hero Header Banner with Privacy Page Background */}
      <section className="relative h-[50vh] min-h-[420px] max-h-[600px] w-full flex flex-col justify-center overflow-hidden pt-36 sm:pt-40 md:pt-44 pb-12 border-b border-[#EAE5DB]">
        {/* Background Image / Overlay matching Privacy & Policies */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0E170E]/85 via-[#0E170E]/65 to-[#0E170E]/90 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2000&q=80" 
            alt="Best Co Working Space In Hyderabad Amenities" 
            className="w-full h-full object-cover object-center filter brightness-100 contrast-105"
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto text-center flex flex-col items-center justify-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#4ADE80]">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest text-[11px] font-semibold">WORLD-CLASS AMENITIES</span>
          </div>

          <div className="inline-block px-6 sm:px-10 py-3.5 sm:py-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-[1.15]">
              Best Co Working Space In Hyderabad
            </h1>
          </div>
        </div>
      </section>

      {/* 2. Text + Image Section (Left: Text, Right: Image) */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white border-b border-[#EAE5DB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left: Textual Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] text-[11px] uppercase tracking-widest text-[#1B5E20] font-bold">
                HYDERABAD'S PREMIER WORKSPACE
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181F18] leading-tight">
                Elevate Your Everyday Workday in Hyderabad.
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-[#4A574A] leading-relaxed">
                <p>
                  Thoughtfully designed for creators, teams, and growing enterprises in Hyderabad. Enjoy uninterrupted high-speed connectivity, premium computer rentals, 100% power backup, and rejuvenating spaces built around your workday.
                </p>
                <p>
                  At EnCourtyard, we believe that world-class amenities should eliminate friction from your daily workflow. Whether you need a dedicated workstation, a soundproof space for private client negotiations, or continuous 24/7 night-shift capability, our facility is engineered to support your highest ambitions.
                </p>
              </div>

              {/* Highlights 2-column checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF9F5] border border-[#EAE5DB]">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-[#181F18]">100% Redundant Power Backup</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF9F5] border border-[#EAE5DB]">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-[#181F18]">Ultra-Fast Fiber Connectivity</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF9F5] border border-[#EAE5DB]">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-[#181F18]">Pre-Configured Computer Rentals</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF9F5] border border-[#EAE5DB]">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-[#181F18]">24/7 Security & Full Access</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/book-space"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book a Tour or Space</span>
                </Link>
                <a
                  href="tel:+919908209993"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-[#DDD7CA] bg-[#FAF9F5] hover:bg-[#EAE5DB] text-[#181F18] text-xs sm:text-sm font-semibold transition-all"
                >
                  <Phone className="w-4 h-4 text-[#2E7D32]" />
                  <span>+91 99082 09993</span>
                </a>
              </div>
            </div>

            {/* Right: High-Res Showcase Image */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-white aspect-[4/3] bg-[#EAE5DB]">
                <img
                  src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80"
                  alt="EnCourtyard Premium Workspace Amenities in Hyderabad"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-[#263626] text-white p-4 sm:p-5 rounded-2xl shadow-xl border border-[#3A4D3A] max-w-xs hidden sm:block">
                <span className="text-[10px] uppercase text-[#4ADE80] font-bold block mb-0.5">
                  Designed For Focus & Comfort
                </span>
                <p className="text-xs text-[#E3EBE3] leading-relaxed">
                  "Everything you need to focus on what matters most — growing your business."
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Grid of 6 Amenities */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        
        {/* Amenities Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] text-[11px] font-bold uppercase tracking-widest text-[#1B5E20]">
            OUR SIGNATURE AMENITIES
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181F18] tracking-tight">
            Crafted for Convenience, Performance & Well-Being
          </h2>
          <p className="text-sm sm:text-base text-[#5C665C] leading-relaxed max-w-2xl mx-auto">
            Explore our curated suite of modern workspace amenities designed to empower freelancers, growing startups, and corporate teams in Hyderabad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {AMENITIES_DATA.map((item) => {
            const IconComp = iconComponents[item.iconName] || Sparkles;
            return (
              <div
                key={item.id}
                className="group rounded-3xl bg-white border border-[#EAE5DB] hover:border-[#2E7D32] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Photo Top */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F2EEE7]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    
                    <div className="absolute top-4 left-4 w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md text-[#2E7D32] flex items-center justify-center shadow-md">
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#181F18] group-hover:text-[#2E7D32] transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#4F634F] leading-relaxed line-clamp-3">
                      {item.description}
                    </p>

                    <div className="pt-2 space-y-1.5 border-t border-[#F2EEE7]">
                      {item.highlights.slice(0, 3).map((hl, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-[#5C665C]">
                          <CheckCircle className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                          <span className="truncate">{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="px-6 pb-6 pt-2">
                  <Link
                    href={`/amenities/${item.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#FAF9F5] group-hover:bg-[#2E7D32] text-[#181F18] group-hover:text-white border border-[#DDD7CA] group-hover:border-[#2E7D32] text-xs font-bold transition-all shadow-2xs"
                  >
                    <span>View Full Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 rounded-3xl bg-[#263626] text-white p-8 sm:p-12 text-center space-y-5 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Experience All Amenities in Person
          </h2>
          <p className="max-w-xl mx-auto text-sm text-white/80">
            Book a complimentary day pass or scheduled tour to experience EnCourtyard's world-class facilities in Hyderabad.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/book-space"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#4ADE80] text-[#121B12] text-sm font-bold shadow-md hover:bg-[#22C55E] transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Space</span>
            </Link>
            <a
              href="tel:+919908209993"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all"
            >
              <Phone className="w-4 h-4 text-[#86EFAC]" />
              <span>+91 99082 09993</span>
            </a>
          </div>
        </div>
      </main>

    </div>
  );
}
