'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Building2 } from 'lucide-react';
import { WORKSPACES } from '@/lib/data';
import { WorkspaceCard } from '@/components/workspaces/WorkspaceCard';
import { Button } from '@/components/ui/Button';

export const FeaturedWorkspaces: React.FC = () => {
  const featured = WORKSPACES.slice(0, 3);

  return (
    <section className="py-24 lg:py-32 bg-[#F7F5F0] border-b border-[#E5E1D8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Editorial Alignment */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E3EBE3] border border-[#CFDCCF] text-xs font-semibold text-[#263626]">
              <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Workspace Collections</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181F18] leading-tight">
              Spaces tailored to how you perform best.
            </h2>
            <p className="text-base sm:text-lg text-[#5C665C] leading-relaxed">
              From private executive suites with acoustic glass to sunlit botanical courtyard hot desks, discover the optimal setting for your high-growth team.
            </p>
          </div>

          <div className="shrink-0">
            <Button
              href="/workspaces"
              variant="outline"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              View All 5 Workspace Types
            </Button>
          </div>
        </div>

        {/* 3-Column Card Grid with Staggered Visual Rhythm */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {featured.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </div>

        {/* Custom Layout Banner */}
        <div className="mt-16 p-8 bg-white rounded-2xl border border-[#E5E1D8] shadow-warm flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-warm-lg transition-all">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] flex items-center justify-center text-[#263626] shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-serif text-xl font-bold text-[#181F18]">
                Need a tailored headquarters for 15–50 team members?
              </h4>
              <p className="text-xs sm:text-sm text-[#5C665C] mt-1">
                We design turnkey enterprise wings with customized IT security, private conference suites, and corporate entrance branding.
              </p>
            </div>
          </div>
          <Button href="/about#visit-form" variant="primary" size="md" className="shrink-0" icon={<ArrowRight className="w-4 h-4" />}>
            Request Enterprise Spec
          </Button>
        </div>

      </div>
    </section>
  );
};
