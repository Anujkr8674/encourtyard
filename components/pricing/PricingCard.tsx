'use client';

import React from 'react';
import { Check, Star, ArrowRight, Sparkles } from 'lucide-react';
import { PricingPlan } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export interface PricingCardProps {
  plan: PricingPlan;
  billingCycle: 'monthly' | 'yearly';
}

export const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  billingCycle
}) => {
  const currentPrice =
    billingCycle === 'yearly' && plan.priceYearly
      ? plan.priceYearly
      : plan.priceMonthly;

  const isHighlighted = plan.isPopular;

  return (
    <div
      className={`relative rounded-2xl border flex flex-col h-full transition-all duration-300 transform hover:-translate-y-2 ${
        isHighlighted
          ? 'bg-[#263626] text-[#FAF9F5] border-[#3A4D3A] shadow-warm-lg scale-[1.02] z-10'
          : 'bg-white text-[#181F18] border-[#E5E1D8] shadow-warm hover:shadow-warm-lg hover:border-[#263626]'
      }`}
    >
      {/* Popular / Recommended Badge */}
      {plan.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <span
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase shadow-md ${
              isHighlighted
                ? 'bg-[#C29B38] text-[#181F18]'
                : 'bg-[#263626] text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            {plan.badge}
          </span>
        </div>
      )}

      {/* Card Header */}
      <div className={`p-7 sm:p-8 ${plan.badge ? 'pt-9' : ''}`}>
        <h3
          className={`font-serif text-2xl sm:text-3xl font-bold mb-2 ${
            isHighlighted ? 'text-white' : 'text-[#181F18]'
          }`}
        >
          {plan.name}
        </h3>
        <p
          className={`text-xs sm:text-sm min-h-[40px] leading-relaxed ${
            isHighlighted ? 'text-[#C5D5C5]' : 'text-[#5C665C]'
          }`}
        >
          {plan.targetAudience}
        </p>

        {/* Price Display */}
        <div className="mt-6 mb-5">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`font-serif text-4xl sm:text-5xl font-bold tracking-tight ${
                isHighlighted ? 'text-white' : 'text-[#181F18]'
              }`}
            >
              {currentPrice}
            </span>
            <span
              className={`text-xs ${
                isHighlighted ? 'text-[#A3BFA3]' : 'text-[#5C665C]'
              }`}
            >
              / month
            </span>
          </div>
          <span
            className={`text-[11px] block mt-1.5 font-medium ${
              isHighlighted ? 'text-[#A3BFA3]' : 'text-[#738273]'
            }`}
          >
            {billingCycle === 'yearly' && plan.priceYearly
              ? 'billed annually (save ~18%)'
              : plan.billingText}
          </span>
        </div>

        {/* Access & Credits Highlight */}
        <div
          className={`py-3.5 px-4 rounded-xl text-xs space-y-1 my-5 ${
            isHighlighted
              ? 'bg-[#1A261A] border border-[#3A4D3A] text-[#E3EBE3]'
              : 'bg-[#FAF9F5] border border-[#E5E1D8] text-[#263626]'
          }`}
        >
          <div className="font-semibold text-sm">{plan.accessHours}</div>
          <div
            className={`text-[11px] ${
              isHighlighted ? 'text-[#A3BFA3]' : 'text-[#5C665C]'
            }`}
          >
            {plan.creditsIncluded}
          </div>
        </div>

        {/* Primary CTA */}
        <Button
          href="/about#visit-form"
          variant={isHighlighted ? 'white' : 'primary'}
          size="md"
          className="w-full justify-center mt-2 shadow-sm font-semibold"
          icon={<ArrowRight className="w-4 h-4" />}
        >
          {plan.ctaText}
        </Button>
      </div>

      {/* Feature Inclusions Divider */}
      <div
        className={`px-7 sm:px-8 py-7 border-t rounded-b-2xl flex-grow ${
          isHighlighted
            ? 'border-[#3A4D3A] bg-[#223022]'
            : 'border-[#E5E1D8] bg-[#FAF9F5]'
        }`}
      >
        <span
          className={`text-[11px] font-semibold uppercase tracking-wider block mb-4 ${
            isHighlighted ? 'text-[#A3BFA3]' : 'text-[#5C665C]'
          }`}
        >
          Membership Inclusions:
        </span>
        <ul className="space-y-3">
          {plan.includedFeatures.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  isHighlighted ? 'bg-[#4ADE80]/20 text-[#4ADE80]' : 'bg-[#EAF5EA] text-[#2E7D32]'
                }`}
              >
                <Check className="w-2.5 h-2.5" />
              </div>
              <span
                className={
                  isHighlighted ? 'text-[#FAF9F5]' : 'text-[#181F18]'
                }
              >
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
