'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, HelpCircle, MessageSquare } from 'lucide-react';
import { FAQS } from '@/lib/data';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';

export const HomeFAQ: React.FC = () => {
  const previewFaqs = FAQS.slice(0, 5);

  return (
    <section id="faq-section" className="py-24 lg:py-32 bg-[#F7F5F0] border-b border-[#E5E1D8] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E3EBE3] border border-[#CFDCCF] text-xs font-semibold text-[#263626]">
            <HelpCircle className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>Common Inquiries</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181F18] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-[#5C665C] max-w-lg mx-auto leading-relaxed">
            Everything you need to know about our memberships, access hours, and hospitality amenities.
          </p>
        </div>

        {/* Accordion Container with Enhanced Warm Shadow */}
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-[#E5E1D8] shadow-warm hover:shadow-warm-lg transition-all">
          <Accordion items={previewFaqs} defaultOpenIndex={0} />
        </div>

        {/* Bottom Help Callout */}
        <div className="mt-12 text-center text-sm text-[#5C665C] flex items-center justify-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#263626]" />
          <span>Have a specific requirement or question not listed here?</span>
          <Link href="/about#visit-form" className="font-semibold text-[#263626] underline hover:text-[#3A4D3A] ml-1">
            Speak with our concierge team &rarr;
          </Link>
        </div>

      </div>
    </section>
  );
};
