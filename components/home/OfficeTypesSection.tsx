'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { OFFICE_TYPES, OfficeTypeItem } from '@/lib/officeTypesData';

export const OfficeTypesSection: React.FC = () => {
  // Default to 'private-office' active so it matches Image 1 on initial load, and reacts dynamically on hover
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  return (
    <section id="office-types" className="relative w-full py-16 sm:py-20 lg:py-24 bg-white border-t border-[#EAE5DB] overflow-hidden">
      
      {/* Subtle Ambient Natural Tint */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2E7D32]/[0.025] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#FAF9F5] rounded-full blur-2xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Heading - Exact Wording & Centered Style as Image 1 */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-2.5">
          {/* <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#2E7D32] bg-[#E8F5E9] px-3.5 py-1 rounded-full inline-block">
            Workspace Directory
          </span> */}
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#181F18] leading-[1.18]">
            Workspaces Designed Around You
          </h2>
          <p className="text-sm sm:text-base text-[#5C665C]">
            Thoughtfully crafted office solutions designed for productivity, collaboration, and executive focus.
          </p>
        </div>

        {/* 4 Cards In a Single Row of Window (Matching Image 1) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {OFFICE_TYPES.map((office: OfficeTypeItem) => {
            // Card is active if it's currently hovered, or if nothing is hovered and this is the default active card ('private-office')
            const isHovered = hoveredSlug === office.slug;
            const isSolidCard = isHovered || (hoveredSlug === null && office.slug === 'private-office');

            return (
              <div
                key={office.id}
                onMouseEnter={() => setHoveredSlug(office.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
                className="flex flex-col h-full"
              >
                {/* Clickable Card Linking to Office Type Detail Page */}
                <Link
                  href={`/office-types/${office.slug}`}
                  className={`relative w-full rounded-2xl sm:rounded-3xl transition-all duration-300 flex flex-col items-center overflow-hidden shadow-sm hover:shadow-xl cursor-pointer ${
                    isSolidCard
                      ? 'bg-[#2E7D32] text-white ring-2 ring-[#2E7D32] ring-offset-2 scale-[1.02] justify-center'
                      : 'bg-white hover:bg-[#FAF9F5] border border-[#EAE5DB]'
                  }`}
                  style={{ minHeight: '320px' }}
                >
                  {isSolidCard ? (
                    /* Solid Brand Green Card Layout (Matches Image 1 Active State) */
                    <div className="w-full h-full p-6 sm:p-7 flex flex-col items-center justify-center text-center my-auto space-y-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center shadow-xs">
                        <Sparkles className="w-5 h-5 text-[#86EFAC]" />
                      </div>
                      
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                        {office.name}
                      </h3>

                      <p className="text-xs text-white/90 line-clamp-2 max-w-[220px]">
                        {office.tagline}
                      </p>

                      <div className="pt-1.5">
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#166534] text-xs font-bold shadow-sm hover:bg-[#F0FDF4] transition-colors">
                          <span>Explore Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* Standard Card Layout (Photo on top, Centered Title Directly Below without unwanted space) */
                    <div className="w-full h-full p-3 sm:p-3.5 flex flex-col">
                      {/* Top Photo with Rounded Corners filling the space */}
                      <div className="relative flex-1 w-full min-h-[200px] rounded-xl sm:rounded-2xl overflow-hidden bg-[#F2EEE7] shadow-xs">
                        <img
                          src={office.image}
                          alt={office.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-colors" />
                      </div>

                      {/* Bottom Centered Title snug right below photo */}
                      <div className="pt-3 pb-1 text-center">
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#181F18] transition-colors">
                          {office.name}
                        </h3>
                      </div>
                    </div>
                  )}
                </Link>

                {/* Direct Booking Button Linked with Matching Category */}
                {/* <div className="mt-3">
                  <Link
                    href={`/book-space?category=${encodeURIComponent(office.categoryName)}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#FAF9F5] hover:bg-[#2E7D32] text-[#263626] hover:text-white border border-[#DDD7CA] hover:border-[#2E7D32] text-xs font-bold transition-all duration-200 shadow-2xs hover:shadow-md cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book {office.categoryName}</span>
                  </Link>
                </div> */}

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
