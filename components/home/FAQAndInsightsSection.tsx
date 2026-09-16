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
    <section className="py-20 lg:py-24 secondary-section-bg border-b border-[#E5E1D8] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Centered Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#738273] font-bold block mb-2">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#181F18] tracking-tight leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-[#5C665C] mt-2.5 font-sans">
            Get quick answers to common questions about memberships, amenities, and booking.
          </p>
        </div>

        {/* Centered Accordion FAQ List */}
        <div className="space-y-4">
          {FAQS_DATA.map((faq, idx) => {
            const isOpen = openFaq === idx;

            return (
              <div
                key={idx}
                onClick={() => toggleFaq(idx)}
                className={`bg-white rounded-2xl sm:rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden p-5 sm:p-6 shadow-[0_4px_16px_rgba(24,31,24,0.04)] ${
                  isOpen
                    ? 'border-[#263626] ring-2 ring-[#263626]/10 shadow-md'
                    : 'border-[#E5E1D8] hover:border-[#263626]/40 hover:shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
                        isOpen
                          ? 'bg-[#263626] text-white'
                          : 'bg-[#FAF9F5] text-[#263626] border border-[#E5E1D8]'
                      }`}
                    >
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <h3
                      className={`font-serif font-bold text-base sm:text-lg transition-colors duration-300 ${
                        isOpen ? 'text-[#263626]' : 'text-[#181F18]'
                      }`}
                    >
                      {faq.q}
                    </h3>
                  </div>

                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen
                        ? 'bg-[#263626] text-white rotate-180'
                        : 'bg-[#FAF9F5] text-[#263626] border border-[#E5E1D8]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>

                {/* Animated Expandable Answer */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100 mt-4 pt-4 border-t border-[#F0EBE1]' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-xs sm:text-sm text-[#5C665C] font-sans leading-relaxed pl-10.5 sm:pl-11.5">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Centered Support CTA Footer */}
        <div className="mt-10 sm:mt-12 p-6 sm:p-8 rounded-3xl bg-[#FAF9F5] border border-[#E8E2D6] text-center flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="text-left">
            <h4 className="font-serif font-bold text-base sm:text-lg text-[#181F18]">
              Still have questions?
            </h4>
            <p className="text-xs sm:text-sm text-[#6A786A] font-sans mt-0.5">
              Our community concierge team is here to help you anytime.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/about#contact"
              className="inline-flex items-center gap-2 bg-[#263626] hover:bg-[#384D34] text-white px-5 py-2.5 rounded-full font-sans text-xs font-semibold transition-all duration-300 shadow-xs hover:shadow-md"
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
