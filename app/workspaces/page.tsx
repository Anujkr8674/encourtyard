'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Building2, Users, Check, ArrowRight, ShieldCheck, Filter } from 'lucide-react';
import { WORKSPACES } from '@/lib/data';
import { WorkspaceCard } from '@/components/workspaces/WorkspaceCard';
import { Button } from '@/components/ui/Button';

export default function WorkspacesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Workspaces', count: WORKSPACES.length },
    { id: 'private-office', label: 'Private Suites', count: 1 },
    { id: 'dedicated-desk', label: 'Dedicated Desks', count: 1 },
    { id: 'hot-desk', label: 'Courtyard Hot Desks', count: 1 },
    { id: 'team-suite', label: 'Enterprise Team Wings', count: 2 },
  ];

  const filteredWorkspaces =
    selectedCategory === 'all'
      ? WORKSPACES
      : WORKSPACES.filter((w) => w.category === selectedCategory);

  return (
    <div className="bg-[#FAF9F5] min-h-screen">
      {/* Page Hero with Dark Architectural Canvas */}
      <section className="bg-[#181F18] text-white pt-32 pb-20 border-b border-[#263626] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#3A4D3A_1px,transparent_1px)] [background-size:28px_28px] opacity-25 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#4ADE80]">
              <Building2 className="w-3.5 h-3.5" />
              <span>Workspace Directory</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
              Workspaces engineered for clarity and momentum.
            </h1>
            <p className="text-base sm:text-lg text-[#C5D5C5] leading-relaxed">
              Explore our collection of sound-insulated private suites, fixed dedicated workstations, and vibrant open courtyard desks.
            </p>
          </div>
        </div>
      </section>

      {/* Catalog & Filter Section */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Interactive Filter Pills */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-[#E5E1D8]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#5C665C] uppercase tracking-wider mr-2 hidden sm:inline-flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-[#263626] text-white shadow-sm'
                    : 'bg-white text-[#5C665C] border border-[#E5E1D8] hover:bg-[#F2EEE7] hover:text-[#181F18]'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedCategory === cat.id
                      ? 'bg-[#3A4D3A] text-white'
                      : 'bg-[#F2EEE7] text-[#5C665C]'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          <div className="text-xs text-[#5C665C]">
            Showing <strong className="text-[#181F18]">{filteredWorkspaces.length}</strong> available spaces
          </div>
        </div>

        {/* Workspaces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {filteredWorkspaces.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </div>

        {/* Meeting Rooms Callout Card */}
        <div className="mt-16 p-8 bg-white rounded-2xl border border-[#E5E1D8] shadow-warm flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-warm-lg transition-all">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-block text-xs uppercase font-mono tracking-wider text-[#2E7D32] bg-[#EAF5EA] px-2.5 py-1 rounded">
              Hourly & Day Access
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#181F18]">
              Looking specifically for Meeting Rooms or Event Halls?
            </h3>
            <p className="text-sm text-[#5C665C] max-w-xl">
              We offer four dedicated high-spec meeting facilities with Sony 4K displays, Shure acoustic beamforming mics, and catering services.
            </p>
          </div>
          <Button
            href="/meeting-rooms"
            variant="primary"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Explore Meeting Rooms
          </Button>
        </div>

        {/* Custom Enterprise Headquarters Banner */}
        <div className="mt-12 bg-[#263626] rounded-3xl text-white p-8 sm:p-12 overflow-hidden relative shadow-2xl border border-[#3A4D3A]">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs uppercase font-mono tracking-widest text-[#4ADE80] font-semibold">
              Bespoke Enterprise Wings (20 – 60 Members)
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
              Need a completely dedicated private headquarters?
            </h3>
            <p className="text-sm sm:text-base text-[#C5D5C5] leading-relaxed">
              We design, build, and manage bespoke private wings configured precisely to your security, IT infrastructure, and corporate identity needs.
            </p>
            <div className="pt-2">
              <Button
                href="/about#visit-form"
                variant="white"
                size="md"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Inquire for Custom Enterprise Build
              </Button>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
