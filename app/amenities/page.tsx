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
  Calendar,
  Phone
} from 'lucide-react';
import { AMENITIES_DATA } from '@/lib/amenitiesData';

export default function AmenitiesCatalogPage() {
  const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
    Monitor,
    Zap,
    Wifi,
    ShieldCheck,
    Coffee,
    Sparkles
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen text-[#181F18] selection:bg-[#2E7D32] selection:text-white pb-24">
      
      {/* Header Banner */}
      <section className="bg-white border-b border-[#EAE5DB] pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] text-xs font-mono font-bold uppercase tracking-widest text-[#1B5E20]">
            WORLD-CLASS AMENITIES
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#181F18]">
            Best Co Working Space In Hyderabad
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#5C665C] leading-relaxed">
            Thoughtfully designed for creators, teams, and growing enterprises in Hyderabad. Enjoy uninterrupted high-speed connectivity, premium computer rentals, 100% power backup, and rejuvenating spaces built around your workday.
          </p>
        </div>
      </section>

      {/* Grid of 6 Amenities */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
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
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#181F18] group-hover:text-[#2E7D32] transition-colors">
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
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
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
