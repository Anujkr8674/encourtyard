'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Plus, Minus, HelpCircle, ArrowRight, MessageCircle } from 'lucide-react';

interface FAQ {
  q: string;
  a: string;
  category?: string;
}

const FAQS_DATA: FAQ[] = [
  {
    q: 'What are your working and access hours?',
    a: 'Dedicated Desk and Private Suite members enjoy 24/7 unmetered biometric access 365 days a year. Hot desk access and front desk concierge services are active Monday through Saturday, 8:00 AM – 8:00 PM.'
  },
  {
    q: 'Do you offer flexible day passes and trial visits?',
    a: 'Yes! We offer single-day passes starting at ₹499/day with high-speed fiber internet, unlimited artisanal coffee, and phone booth access. We also provide complimentary 30-minute workspace tours.'
  },
  {
    q: 'Can I schedule a private tour before booking?',
    a: 'Absolutely. You can schedule a complimentary walkthrough anytime to test our high-speed internet, explore the ergonomic setups, and experience the courtyard atmosphere firsthand.'
  },
  {
    q: 'Are meeting room credits included in membership plans?',
    a: 'Yes. Dedicated Desks include 8 hours of monthly meeting room credits, while Private Office suites include 20 to 40 hours per month. Additional hours can be booked on-demand through our member portal.'
  },
  {
    q: 'Can I register EnCourtyard as my official business address?',
    a: 'Yes! Dedicated Desk and Private Office plans include official commercial business registration, mail handling, and secure courier receipt with instant notifications.'
  },
  {
    q: 'Is parking and EV charging available at the locations?',
    a: 'Yes, all our prime locations provide secure multi-level underground car and two-wheeler parking with dedicated EV charging stations available for members and visitors.'
  }
];

export const FAQAndInsightsSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0); // First FAQ open by default

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-22 lg:py-26 bg-white border-b border-[#E5E1D8] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Centered Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] text-[11px] font-mono uppercase tracking-widest text-[#1B5E20] font-bold mb-3">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#181F18] tracking-tight leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-[#5C665C] mt-2.5 font-sans leading-relaxed">
            Everything you need to know about our workspaces, memberships, and flexible terms.
          </p>
        </div>

        {/* Centered Accordion FAQ List */}
        <div className="space-y-3.5 sm:space-y-4">
          {FAQS_DATA.map((faq, idx) => {
            const isOpen = openFaq === idx;

            return (
              <div
                key={idx}
                onClick={() => toggleFaq(idx)}
                className={`rounded-2xl sm:rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden p-5 sm:p-6 group ${
                  isOpen
                    ? 'bg-white border-2 border-[#263626] shadow-xl ring-4 ring-[#263626]/10 -translate-y-0.5'
                    : 'bg-[#FAF9F5] hover:bg-white border-[#DDD7CA] hover:border-[#263626] shadow-[0_4px_16px_-4px_rgba(24,31,24,0.06)] hover:shadow-xl hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 sm:gap-4">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isOpen
                          ? 'bg-[#263626] text-[#4ADE80] shadow-md'
                          : 'bg-white text-[#263626] border border-[#DDD7CA] shadow-2xs group-hover:bg-[#263626] group-hover:text-white group-hover:border-[#263626]'
                      }`}
                    >
                      <HelpCircle className="w-4.5 h-4.5" />
                    </div>
                    <h3
                      className={`font-serif font-bold text-base sm:text-lg transition-colors duration-300 leading-snug ${
                        isOpen ? 'text-[#263626]' : 'text-[#181F18] group-hover:text-[#263626]'
                      }`}
                    >
                      {faq.q}
                    </h3>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen
                        ? 'bg-[#263626] text-white rotate-180 shadow-xs'
                        : 'bg-white text-[#263626] border border-[#DDD7CA] group-hover:border-[#263626]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>

                {/* Animated Expandable Answer */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100 mt-4 pt-4 border-t border-[#EAE5DB]' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-xs sm:text-[14.5px] text-[#425042] font-sans leading-relaxed pl-12.5 sm:pl-14">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Centered Support CTA Footer */}
        <div className="mt-10 sm:mt-14 p-6 sm:p-8 rounded-[28px] bg-gradient-to-br from-[#FAF9F5] via-[#F5F2EB] to-[#FAF9F5] border border-[#DDD7CA] shadow-[0_12px_36px_-10px_rgba(24,31,24,0.08)] text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-serif font-bold text-base sm:text-lg text-[#181F18]">
              Still have questions?
            </h4>
            <p className="text-xs sm:text-sm text-[#5C665C] font-sans mt-0.5">
              Our community concierge team is here to assist you anytime.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/about#contact"
              className="inline-flex items-center gap-2 bg-[#263626] hover:bg-[#344A32] text-white px-6 py-3 rounded-full font-sans text-xs sm:text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <span>Contact Concierge</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};
