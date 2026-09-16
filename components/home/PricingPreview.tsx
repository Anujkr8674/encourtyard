'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { INR_PRICING_DATA } from '@/lib/data';
import { Button } from '@/components/ui/Button';

export const PricingPreview: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section className="py-16 sm:py-20 lg:py-24 primary-section-bg border-b border-[#E5E1D8] relative overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Outer Section Banner Card (Matching WhyEnCourtyard 3D Aesthetics) */}
        <div className="relative rounded-[28px] sm:rounded-[36px] lg:rounded-[40px] bg-[#FBF9F4] border border-[#E8E2D6] shadow-[0_10px_35px_-12px_rgba(38,54,38,0.06)] overflow-hidden p-6 sm:p-8 lg:p-10 xl:p-12">

          {/* Organic 3D Layered Architectural Backdrop Accents */}
          <div
            className="hidden lg:block absolute top-0 right-[25%] w-[420px] h-[420px] rounded-tl-[120px] rounded-tr-[180px] rounded-bl-[140px] bg-gradient-to-br from-[#ECE7DB]/70 to-[#DFD8C8]/40 pointer-events-none z-0"
            aria-hidden="true"
          />
          <div
            className="hidden lg:block absolute -bottom-10 left-[20%] w-[180px] h-[180px] rounded-full bg-[#E5DFD1]/50 pointer-events-none z-0"
            aria-hidden="true"
          />

          <div className="relative z-10">

            {/* Section Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 lg:mb-12 gap-6">
              <div className="max-w-2xl text-left">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#738273] font-bold block mb-2">
                  PRICING PLANS
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#181F18] tracking-tight leading-tight">
                  Flexible Plans for Individuals, Teams <br className="hidden sm:inline" />
                  and Growing Businesses
                </h2>
              </div>

              <div className="flex items-center gap-4 sm:gap-6 shrink-0 flex-wrap">
                {/* Monthly / Yearly Toggle with High-Contrast Save 20% Badge */}
                <div className="bg-[#EBE6DC] p-1 rounded-full flex items-center border border-[#D5CEC2] shadow-xs">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      billingCycle === 'monthly'
                        ? 'bg-[#263626] text-white shadow-sm'
                        : 'text-[#5C665C] hover:text-[#181F18]'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      billingCycle === 'yearly'
                        ? 'bg-[#263626] text-white shadow-sm'
                        : 'text-[#5C665C] hover:text-[#181F18]'
                    }`}
                  >
                    <span>Yearly</span>
                    <span
                      className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                        billingCycle === 'yearly'
                          ? 'bg-[#3A4E3A] text-[#86EFAC]'
                          : 'bg-[#263626] text-white shadow-xs'
                      }`}
                    >
                      Save 20%
                    </span>
                  </button>
                </div>

                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#181F18] hover:text-[#263626] group transition-colors"
                >
                  <span>View Detailed Pricing</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* 5-Column Pricing Grid with Refined Glass Cards & Hover Elevation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-4.5 xl:gap-5 items-stretch">

              {/* 4 Standard Pricing Cards */}
              {INR_PRICING_DATA.map((plan) => {
                const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;

                return (
                  <div
                    key={plan.id}
                    className={`rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-2 relative ${
                      plan.isPopular
                        ? 'bg-white border-2 border-[#263626] shadow-xl ring-2 ring-[#263626]/10'
                        : 'bg-white/85 hover:bg-white backdrop-blur-md border border-[#E5E1D8] hover:border-[#263626]/50 shadow-[0_4px_16px_-4px_rgba(24,31,24,0.06)] hover:shadow-[0_16px_32px_-4px_rgba(24,31,24,0.16)]'
                    }`}
                  >
                    {/* Popular Pill Badge */}
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#263626] text-white text-[10px] font-mono font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md whitespace-nowrap">
                        {plan.badge}
                      </div>
                    )}

                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#181F18] mb-2.5">
                        {plan.name}
                      </h3>

                      {/* Price */}
                      <div className="mb-5">
                        <span className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18]">
                          {price}
                        </span>
                        <span className="text-xs text-[#738273] font-sans ml-1">
                          {plan.period}
                        </span>
                      </div>

                      {/* Features List */}
                      <ul className="space-y-2.5 mb-6">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-[#5C665C]">
                            <Check className="w-3.5 h-3.5 text-[#2E7D32] shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Card CTA */}
                    <Button
                      href={plan.link}
                      variant={plan.isPopular ? 'primary' : 'outline'}
                      size="md"
                      className={`w-full text-xs font-semibold py-2.5 rounded-xl cursor-pointer ${
                        plan.isPopular
                          ? 'bg-[#263626] hover:bg-[#3A4D3A] text-white shadow-sm'
                          : 'border-[#D5CEC2] text-[#181F18] hover:bg-[#263626] hover:text-white hover:border-[#263626]'
                      }`}
                    >
                      {plan.ctaText}
                    </Button>

                  </div>
                );
              })}

              {/* 5th Card: Custom Solutions for Your Team (Dark Olive Card) */}
              <div className="bg-[#263626] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-2xl border border-[#3A4D3A] transform hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(24,31,24,0.25)] transition-all duration-300">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#4ADE80] font-bold block mb-2">
                    ENTERPRISE
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white mb-2.5 leading-snug">
                    Custom Solutions for Your Team
                  </h3>
                  <p className="text-xs text-[#E3EBE3]/80 leading-relaxed mb-6">
                    Need a tailored plan? Let's create one together. Dedicated floorplates, custom branding & private security.
                  </p>
                </div>

                <Button
                  href="/book?plan=enterprise"
                  variant="white"
                  size="md"
                  className="w-full text-xs font-semibold py-2.5 rounded-xl text-[#263626] shadow-warm hover:bg-white/90 cursor-pointer"
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Contact Our Team
                </Button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
