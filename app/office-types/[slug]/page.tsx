'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Phone,
  Send,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Calendar,
  Share2,
  CheckCircle,
  Building2,
  Sparkles
} from 'lucide-react';
import { OFFICE_TYPES, OfficeTypeItem, getOfficeTypeBySlug } from '@/lib/officeTypesData';

export default function OfficeTypeDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'shared-office';

  // Retrieve matching office data (supporting aliases like hot-desk, team-space)
  const office: OfficeTypeItem = getOfficeTypeBySlug(slug) || OFFICE_TYPES[0];

  // Accordion state: only one menu expanded at a time (default open 'advantages')
  const [openSection, setOpenSection] = useState<string | null>('advantages');

  const [copied, setCopied] = useState(false);

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen text-[#181F18] selection:bg-[#2E7D32] selection:text-white pb-24">
      
      {/* 1. Breadcrumbs & Top Navigation */}
      <section className="bg-white border-b border-[#EAE5DB] pt-32 pb-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 hidden">
            
            {/* Breadcrumb Path */}
            <div className="flex items-center gap-2 text-xs text-[#5C665C]">
              <Link href="/" className="hover:text-[#2E7D32] transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/#office-types" className="hover:text-[#2E7D32] transition-colors">
                Office Types
              </Link>
              <span>/</span>
              <span className="text-[#181F18] font-bold">{office.name}</span>
            </div>

            {/* Back link & Share Button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DDD7CA] bg-white hover:bg-[#FAF9F5] text-xs font-semibold text-[#5C665C] transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-[#2E7D32]" />
                    <span className="text-[#2E7D32]">Link Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </>
                )}
              </button>

              <Link
                href="/#office-types"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#2E7D32] hover:underline"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>All Office Types</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content Container Matching Image 2 Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 lg:space-y-20">

        {/* ============================================================== */}
        {/* ROW 1: Title & Description (Left) + Top Photo (Right)          */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Heading, 2 Paragraphs, and 2 Action Buttons */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2E7D32] bg-[#E8F5E9] px-3 py-1 rounded-full inline-block mb-2">
                EnCourtyard Workspaces
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#181F18] leading-[1.15]">
                {office.name}
              </h1>
            </div>

            {/* Paragraph 1 */}
            <p className="text-sm sm:text-base text-[#4F634F] leading-relaxed">
              {office.descriptionParagraph1}
            </p>

            {/* Paragraph 2 */}
            <p className="text-sm sm:text-base text-[#4F634F] leading-relaxed">
              {office.descriptionParagraph2}
            </p>

            {/* Two Action Buttons Matching Image 2 */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              
              {/* Button 1: Contact Us (Outline with Phone Icon) */}
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-[#2E7D32] text-[#2E7D32] bg-white hover:bg-[#2E7D32] hover:text-white text-sm font-bold transition-all duration-200 shadow-2xs hover:shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Contact Us</span>
              </Link>

              {/* Button 2: Enquiry Now / Direct Booking Linked with matching Category */}
              <Link
                href={`/book-space?category=${encodeURIComponent(office.categoryName)}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-[#2E7D32] text-white bg-[#2E7D32] hover:bg-[#1E5C23] hover:border-[#1E5C23] text-sm font-bold transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Enquiry Now</span>
              </Link>

            </div>
          </div>

          {/* Right: Top Office Image with Rounded Corners */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-md border border-[#EAE5DB] bg-[#F2EEE7]">
              <img
                src={office.image}
                alt={`${office.name} preview`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>

        {/* ============================================================== */}
        {/* ROW 2: Bottom Photo (Left) + Amenities Accordion (Right)        */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left: Second Office Image with Rounded Corners */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-md border border-[#EAE5DB] bg-[#F2EEE7]">
              <img
                src={office.image2}
                alt={`${office.name} interior setup`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Amenities Heading + 3-Panel Accordion */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#181F18]">
              {office.amenitiesHeading}
            </h2>

            {/* Accordion Component Exactly Styled as in Image 2 */}
            <div className="space-y-2 border border-[#EAE5DB] rounded-xl overflow-hidden bg-white shadow-xs">
              
              {/* Accordion Item 1: Advantages (Expanded by Default) */}
              <div className="border-b border-[#EAE5DB] last:border-b-0">
                <button
                  type="button"
                  onClick={() => toggleSection('advantages')}
                  className="w-full flex items-center gap-3.5 text-left py-3.5 px-4 bg-[#FBF9F5] hover:bg-[#F2EEE7] transition-colors cursor-pointer select-none"
                >
                  {/* Square Box with Minus or Plus Icon */}
                  <span className="w-7 h-7 rounded-md bg-[#2E7D32] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    {openSection === 'advantages' ? (
                      <Minus className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <Plus className="w-4 h-4 stroke-[3]" />
                    )}
                  </span>
                  <span className="font-bold text-sm sm:text-base text-[#181F18]">
                    Advantages
                  </span>
                </button>

                {openSection === 'advantages' && (
                  <div className="px-6 py-5 bg-white space-y-2.5">
                    <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#4F634F]">
                      {office.accordion.advantages.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <span className="w-1.5 h-1.5 rounded-full border border-[#2E7D32] bg-white shrink-0" />
                          <span className="text-[#2E7D32] font-mono text-xs font-bold shrink-0">⇾</span>
                          <span className="font-medium text-[#181F18]">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion Item 2: Membership Benefits */}
              <div className="border-b border-[#EAE5DB] last:border-b-0">
                <button
                  type="button"
                  onClick={() => toggleSection('membershipBenefits')}
                  className="w-full flex items-center gap-3.5 text-left py-3.5 px-4 bg-[#FBF9F5] hover:bg-[#F2EEE7] transition-colors cursor-pointer select-none"
                >
                  <span className="w-7 h-7 rounded-md bg-[#2E7D32] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    {openSection === 'membershipBenefits' ? (
                      <Minus className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <Plus className="w-4 h-4 stroke-[3]" />
                    )}
                  </span>
                  <span className="font-bold text-sm sm:text-base text-[#181F18]">
                    Membership Benefits
                  </span>
                </button>

                {openSection === 'membershipBenefits' && (
                  <div className="px-6 py-5 bg-white space-y-2.5">
                    <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#4F634F]">
                      {office.accordion.membershipBenefits.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <span className="w-1.5 h-1.5 rounded-full border border-[#2E7D32] bg-white shrink-0" />
                          <span className="text-[#2E7D32] font-mono text-xs font-bold shrink-0">⇾</span>
                          <span className="font-medium text-[#181F18]">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion Item 3: Additional Services* */}
              <div className="border-b border-[#EAE5DB] last:border-b-0">
                <button
                  type="button"
                  onClick={() => toggleSection('additionalServices')}
                  className="w-full flex items-center gap-3.5 text-left py-3.5 px-4 bg-[#FBF9F5] hover:bg-[#F2EEE7] transition-colors cursor-pointer select-none"
                >
                  <span className="w-7 h-7 rounded-md bg-[#2E7D32] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    {openSection === 'additionalServices' ? (
                      <Minus className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <Plus className="w-4 h-4 stroke-[3]" />
                    )}
                  </span>
                  <span className="font-bold text-sm sm:text-base text-[#181F18]">
                    Additional Services*
                  </span>
                </button>

                {openSection === 'additionalServices' && (
                  <div className="px-6 py-5 bg-white space-y-2.5">
                    <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#4F634F]">
                      {office.accordion.additionalServices.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <span className="w-1.5 h-1.5 rounded-full border border-[#2E7D32] bg-white shrink-0" />
                          <span className="text-[#2E7D32] font-mono text-xs font-bold shrink-0">⇾</span>
                          <span className="font-medium text-[#181F18]">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Banner to Explore Other Types or Book Directly */}
        <div className="mt-12 p-8 rounded-2xl bg-white border border-[#EAE5DB] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif text-xl font-bold text-[#181F18]">
              Ready to explore live available {office.categoryName} desks?
            </h3>
            <p className="text-xs sm:text-sm text-[#5C665C]">
              View current pricing, layout dimensions, and reserve online with immediate confirmation.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/book-space?category=${encodeURIComponent(office.categoryName)}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all duration-200"
            >
              <Calendar className="w-4 h-4 text-[#86EFAC]" />
              <span>Book {office.categoryName}</span>
            </Link>
          </div>
        </div>

      </main>

    </div>
  );
}
