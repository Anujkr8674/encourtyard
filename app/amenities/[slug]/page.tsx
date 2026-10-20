'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Monitor,
  Zap,
  Wifi,
  ShieldCheck,
  Coffee,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  Share2,
  CheckCircle,
  Phone,
  Calendar,
  Layers,
  HelpCircle
} from 'lucide-react';
import { AMENITIES_DATA, AmenityItem, getAmenityBySlug } from '@/lib/amenitiesData';

export default function AmenityDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'rental-computer';

  const amenity: AmenityItem = getAmenityBySlug(slug) || AMENITIES_DATA[0];
  const [copied, setCopied] = useState(false);

  const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
    Monitor,
    Zap,
    Wifi,
    ShieldCheck,
    Coffee,
    Sparkles
  };

  const IconComp = iconComponents[amenity.iconName] || Sparkles;

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const otherAmenities = AMENITIES_DATA.filter((item) => item.id !== amenity.id);

  return (
    <div className="bg-[#FAF9F5] min-h-screen text-[#181F18] selection:bg-[#2E7D32] selection:text-white pb-24">
      
      {/* 1. Breadcrumbs Navigation */}
      <section className="bg-white border-b border-[#EAE5DB] pt-32 pb-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Breadcrumb Path */}
            <div className="flex items-center gap-2 text-xs text-[#5C665C]">
              <Link href="/" className="hover:text-[#2E7D32] transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/#amenities" className="hover:text-[#2E7D32] transition-colors">
                Amenities
              </Link>
              <span>/</span>
              <span className="text-[#181F18] font-bold">{amenity.title}</span>
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
                href="/#amenities"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#2E7D32] hover:underline"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>All Amenities</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 lg:space-y-20">

        {/* ============================================================== */}
        {/* ROW 1: Hero Overview (Left) + High-Res Photo Showcase (Right)   */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Heading, Badge, 2 Detailed Paragraphs, and Action Buttons */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] text-xs font-mono font-bold uppercase tracking-wider text-[#1B5E20] mb-3">
                <IconComp className="w-3.5 h-3.5" />
                <span>HYDERABAD COWORKING AMENITY</span>
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#181F18] leading-[1.15]">
                {amenity.title}
              </h1>
              <p className="font-serif text-lg sm:text-xl text-[#2E7D32] italic mt-2">
                {amenity.tagline}
              </p>
            </div>

            {/* Paragraph 1 */}
            <p className="text-sm sm:text-base text-[#4F634F] leading-relaxed">
              {amenity.overviewParagraph1}
            </p>

            {/* Paragraph 2 */}
            <p className="text-sm sm:text-base text-[#4F634F] leading-relaxed">
              {amenity.overviewParagraph2}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/book-space"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#2E7D32] hover:bg-[#256829] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book a Tour or Workspace</span>
              </Link>

              <a
                href="tel:+919908209993"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-[#DDD7CA] bg-white hover:bg-[#F2EEE7] text-[#181F18] text-sm font-semibold transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#2E7D32]" />
                <span>+91 99082 09993</span>
              </a>
            </div>
          </div>

          {/* Right: Featured Photo Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#DDD7CA] bg-[#182218] aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3]">
              <img
                src={amenity.image}
                alt={`${amenity.title} at EnCourtyard Hyderabad`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-[#DDD7CA] shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#263626] text-[#4ADE80] flex items-center justify-center shrink-0">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-[#181F18] leading-tight">
                      {amenity.title}
                    </h4>
                    <p className="text-[11px] text-[#5C665C]">
                      Included for EnCourtyard Members
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1B5E20] bg-[#E8F5E9] px-2.5 py-1 rounded-full">
                  Verified
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* ============================================================== */}
        {/* ROW 2: Key Highlights & Benefits Grid                          */}
        {/* ============================================================== */}
        <div className="bg-white rounded-3xl border border-[#EAE5DB] p-6 sm:p-10 shadow-sm space-y-6">
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#2E7D32]">
              WHAT MAKES IT EXCEPTIONAL
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18] mt-1">
              Key Highlights & Advantages
            </h2>
            <p className="text-sm text-[#5C665C] mt-1.5">
              Everything you need to know about our {amenity.title.toLowerCase()} service in Hyderabad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {amenity.highlights.map((highlight, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#EAE5DB] flex items-start gap-3.5 hover:border-[#2E7D32] transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 stroke-[2.5]" />
                </div>
                <p className="text-xs sm:text-sm font-medium text-[#181F18] leading-snug">
                  {highlight}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================== */}
        {/* ROW 3: Technical Specifications & Infrastructure Standards     */}
        {/* ============================================================== */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#2E7D32]">
              ENTERPRISE-GRADE STANDARDS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18]">
              Technical Specifications & Features
            </h2>
            <p className="text-sm text-[#5C665C]">
              Built with precision and reliability for demanding businesses and innovators.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {amenity.specifications.map((spec, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-[#EAE5DB] shadow-xs flex flex-col justify-between space-y-2 hover:shadow-md transition-shadow"
              >
                <span className="text-xs font-mono font-semibold text-[#738273] uppercase tracking-wider">
                  {spec.label}
                </span>
                <p className="font-serif text-base sm:text-lg font-bold text-[#181F18]">
                  {spec.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================== */}
        {/* ROW 4: Frequently Asked Questions                              */}
        {/* ============================================================== */}
        <div className="bg-white rounded-3xl border border-[#EAE5DB] p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18]">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-[#5C665C]">
                Common inquiries regarding {amenity.title.toLowerCase()} at EnCourtyard.
              </p>
            </div>
          </div>

          <div className="divide-y divide-[#EAE5DB]">
            {amenity.faqs.map((faq, idx) => (
              <div key={idx} className="py-5 first:pt-2 last:pb-2 space-y-2">
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#181F18]">
                  {faq.question}
                </h3>
                <p className="text-xs sm:text-sm text-[#4F634F] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================== */}
        {/* ROW 5: Browse Other Amenities                                  */}
        {/* ============================================================== */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#2E7D32]">
                MORE WORKSPACE ADVANTAGES
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18] mt-1">
                Explore Other Amenities
              </h2>
            </div>
            <Link
              href="/#amenities"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E7D32] hover:underline"
            >
              <span>Back to Overview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {otherAmenities.map((other) => {
              const OtherIcon = iconComponents[other.iconName] || Sparkles;
              return (
                <Link
                  key={other.id}
                  href={`/amenities/${other.slug}`}
                  className="group p-4 rounded-2xl bg-white border border-[#EAE5DB] hover:border-[#2E7D32] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF9F5] group-hover:bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center transition-colors">
                      <OtherIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-sm font-bold text-[#181F18] group-hover:text-[#2E7D32] transition-colors leading-snug">
                        {other.title}
                      </h3>
                      <p className="text-[11px] text-[#5C665C] mt-1 line-clamp-2">
                        {other.subtitle}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2E7D32] mt-3 group-hover:translate-x-1 transition-transform">
                    <span>View Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* ROW 6: Final CTA Banner                                        */}
        {/* ============================================================== */}
        <div className="relative rounded-3xl bg-[#263626] text-white p-8 sm:p-12 overflow-hidden shadow-xl text-center space-y-5">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#86EFAC]">
              BEST COWORKING SPACE IN HYDERABAD
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Ready to Upgrade Your Workday?
            </h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              Join Hyderabad's most vibrant community of founders, innovators, and teams at EnCourtyard. Experience world-class amenities designed around your workday.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/book-space"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#4ADE80] hover:bg-[#22C55E] text-[#121B12] text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              <span>Explore Workspaces</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all backdrop-blur-xs"
            >
              <span>Contact Hyderabad Concierge</span>
            </Link>
          </div>
        </div>

      </main>

    </div>
  );
}
