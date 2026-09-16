'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, X, Sparkles, HelpCircle, ArrowRight, ShieldCheck, DollarSign } from 'lucide-react';
import { PRICING_PLANS, FAQS } from '@/lib/data';
import { PricingCard } from '@/components/pricing/PricingCard';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const comparisonFeatures = [
    {
      name: 'Access Hours',
      dayPass: 'Mon–Fri 8am–7pm',
      hotDesk: '24/7 Access',
      dedicated: '24/7 Access',
      privateOffice: '24/7 Exclusive Access'
    },
    {
      name: 'Monthly Meeting Room Credits',
      dayPass: 'Pay-per-hour',
      hotDesk: '4 Hours / mo',
      dedicated: '8 Hours / mo',
      privateOffice: '20+ Hours / mo'
    },
    {
      name: 'Dual 1Gbps Fiber & WiFi 6',
      dayPass: true,
      hotDesk: true,
      dedicated: true,
      privateOffice: true
    },
    {
      name: 'Dedicated Private VLAN / IP',
      dayPass: false,
      hotDesk: false,
      dedicated: 'Optional Add-on',
      privateOffice: true
    },
    {
      name: 'Business Address & Mail Handling',
      dayPass: false,
      hotDesk: 'Optional ($40/mo)',
      dedicated: true,
      privateOffice: true
    },
    {
      name: 'Lockable Pedestal Storage',
      dayPass: false,
      hotDesk: false,
      dedicated: true,
      privateOffice: true
    },
    {
      name: 'Acoustic STC 48 Glazing',
      dayPass: false,
      hotDesk: false,
      dedicated: false,
      privateOffice: true
    },
    {
      name: 'Artisanal Coffee & Tea Bar',
      dayPass: true,
      hotDesk: true,
      dedicated: true,
      privateOffice: true
    },
    {
      name: 'Guest Passes / Month',
      dayPass: 'None',
      hotDesk: '2 Passes',
      dedicated: '5 Passes',
      privateOffice: 'Unlimited Guests'
    },
    {
      name: 'Daily Housekeeping & Concierge',
      dayPass: true,
      hotDesk: true,
      dedicated: true,
      privateOffice: true
    }
  ];

  const pricingFaqs = FAQS.filter(
    (f) => f.category === 'membership' || f.category === 'billing' || f.category === 'general'
  );

  return (
    <div className="bg-[#FAF9F5] min-h-screen">
      {/* Page Hero with Dark Architectural Canvas */}
      <section className="bg-[#181F18] text-white pt-32 pb-20 border-b border-[#263626] relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(#3A4D3A_1px,transparent_1px)] [background-size:28px_28px] opacity-25 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#4ADE80] mb-4">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Clear & Transparent Plans</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12] max-w-3xl mx-auto">
            Memberships built with clarity and flexibility.
          </h1>
          <p className="text-base sm:text-lg text-[#C5D5C5] max-w-2xl mx-auto mt-4 leading-relaxed font-sans">
            Choose the membership that aligns with your ambition. Upgrade, downscale, or customize as your business evolves.
          </p>

          {/* Billing Switcher */}
          <div className="inline-flex items-center p-1.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 mt-8 shadow-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-white text-[#181F18] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                billingCycle === 'yearly'
                  ? 'bg-white text-[#181F18] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <span>Annual Agreement</span>
              <span className="bg-[#C29B38] text-[#181F18] text-[10px] font-bold px-2 py-0.5 rounded-full">
                Save ~18%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* 4 Pricing Cards Grid */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch">
          {PRICING_PLANS.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              billingCycle={billingCycle}
            />
          ))}
        </div>
      </section>

      {/* Detailed Plan Comparison Section */}
      <section className="py-20 bg-[#F7F5F0] border-y border-[#E5E1D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14 text-left">
            <span className="text-xs uppercase font-mono tracking-widest text-[#263626] block mb-2 font-semibold">
              Deep Feature Comparison
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#181F18]">
              Compare plan inclusions side by side
            </h2>
            <p className="text-sm text-[#5C665C] mt-2">
              Review exactly what is provided with each membership tier.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto bg-white rounded-2xl border border-[#E5E1D8] shadow-warm">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-[#E5E1D8]">
                  <th className="p-5 font-serif text-base font-bold text-[#181F18] w-1/3">
                    Features & Services
                  </th>
                  <th className="p-5 font-semibold text-[#181F18] text-center">
                    Day Pass
                  </th>
                  <th className="p-5 font-semibold text-[#181F18] text-center">
                    Hot Desk
                  </th>
                  <th className="p-5 font-semibold text-[#263626] bg-[#E3EBE3]/40 text-center">
                    Dedicated Desk
                  </th>
                  <th className="p-5 font-semibold text-[#181F18] text-center">
                    Private Suite
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1D8]">
                {comparisonFeatures.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF9F5] transition-colors">
                    <td className="p-5 font-medium text-[#181F18]">
                      {row.name}
                    </td>

                    {/* Day Pass */}
                    <td className="p-5 text-center text-[#5C665C]">
                      {typeof row.dayPass === 'boolean' ? (
                        row.dayPass ? (
                          <Check className="w-4 h-4 text-[#2E7D32] mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-[#A3B0A3] mx-auto" />
                        )
                      ) : (
                        row.dayPass
                      )}
                    </td>

                    {/* Hot Desk */}
                    <td className="p-5 text-center text-[#5C665C]">
                      {typeof row.hotDesk === 'boolean' ? (
                        row.hotDesk ? (
                          <Check className="w-4 h-4 text-[#2E7D32] mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-[#A3B0A3] mx-auto" />
                        )
                      ) : (
                        row.hotDesk
                      )}
                    </td>

                    {/* Dedicated Desk */}
                    <td className="p-5 text-center font-semibold text-[#263626] bg-[#E3EBE3]/20">
                      {typeof row.dedicated === 'boolean' ? (
                        row.dedicated ? (
                          <Check className="w-4 h-4 text-[#2E7D32] mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-[#A3B0A3] mx-auto" />
                        )
                      ) : (
                        row.dedicated
                      )}
                    </td>

                    {/* Private Office */}
                    <td className="p-5 text-center text-[#181F18] font-semibold">
                      {typeof row.privateOffice === 'boolean' ? (
                        row.privateOffice ? (
                          <Check className="w-4 h-4 text-[#2E7D32] mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-[#A3B0A3] mx-auto" />
                        )
                      ) : (
                        row.privateOffice
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing FAQ Section */}
      <section className="py-20 lg:py-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 space-y-2">
          <span className="text-xs uppercase font-mono tracking-widest text-[#263626] font-semibold">
            Membership Questions
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#181F18]">
            Frequently Asked Billing & Membership Questions
          </h2>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-[#E5E1D8] shadow-warm">
          <Accordion items={pricingFaqs} defaultOpenIndex={0} />
        </div>

        {/* Action Banner */}
        <div className="mt-14 p-8 sm:p-10 bg-[#263626] text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl border border-[#3A4D3A]">
          <div>
            <h4 className="font-serif text-2xl font-bold text-white">
              Want to see our workspaces before deciding?
            </h4>
            <p className="text-xs sm:text-sm text-[#C5D5C5] mt-1">
              Book a complimentary private walkthrough and experience the atmosphere in person.
            </p>
          </div>
          <Button
            href="/about#visit-form"
            variant="white"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Schedule a Visit
          </Button>
        </div>
      </section>
    </div>
  );
}
