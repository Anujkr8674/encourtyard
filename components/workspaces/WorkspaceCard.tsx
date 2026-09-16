'use client';

import React, { useState } from 'react';
import { Users, Maximize2, MapPin, Check, ArrowRight, Sparkles, Building, ChevronRight } from 'lucide-react';
import { Workspace } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

export interface WorkspaceCardProps {
  workspace: Workspace;
  featured?: boolean;
}

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({
  workspace,
  featured = false
}) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquirySent, setEnquirySent] = useState(false);

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnquirySent(true);
    setTimeout(() => {
      setEnquirySent(false);
      setIsEnquiryOpen(false);
    }, 2500);
  };

  return (
    <>
      <div className="group bg-white rounded-2xl border border-[#E5E1D8] overflow-hidden shadow-warm hover:shadow-warm-lg hover:border-[#263626] transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1.5">
        
        {/* Image Container with Badges */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#EAE5DB]">
          <img
            src={workspace.image}
            alt={workspace.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Top badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
            <Badge variant="olive" size="sm" className="shadow-sm backdrop-blur-md bg-white/90">
              {workspace.categoryLabel}
            </Badge>
            <Badge
              variant={workspace.availability === 'available' ? 'available' : 'limited'}
              size="sm"
              dot
              className="shadow-sm backdrop-blur-md bg-white/90"
            >
              {workspace.availabilityText}
            </Badge>
          </div>

          {/* Location & SQFT pill on bottom of image */}
          <div className="absolute bottom-4 left-4 right-4 text-white text-xs flex items-center justify-between z-10">
            <span className="flex items-center gap-1.5 drop-shadow-md font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#4ADE80]" />
              {workspace.location}
            </span>
            <span className="font-mono text-[11px] bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md text-white border border-white/20">
              {workspace.sqft}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 flex flex-col flex-grow bg-white">
          <div className="mb-2">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#181F18] group-hover:text-[#263626] transition-colors leading-tight">
              {workspace.name}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-[#5C665C] line-clamp-2 mb-5 leading-relaxed">
            {workspace.tagline}
          </p>

          {/* Meta Specifications */}
          <div className="grid grid-cols-2 gap-3 py-3 px-3.5 bg-[#FAF9F5] rounded-xl border border-[#E5E1D8] text-xs text-[#5C665C] mb-5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#E3EBE3] flex items-center justify-center text-[#263626]">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium text-[#181F18]">{workspace.capacity}</span>
            </div>
            <div className="flex items-center gap-2 border-l border-[#E5E1D8] pl-3">
              <div className="w-6 h-6 rounded-full bg-[#E3EBE3] flex items-center justify-center text-[#263626]">
                <Building className="w-3.5 h-3.5" />
              </div>
              <span className="text-[#181F18]">{workspace.floor}</span>
            </div>
          </div>

          {/* Key Amenities List */}
          <div className="space-y-2 mb-6 flex-grow">
            <span className="text-[11px] uppercase font-semibold text-[#738273] tracking-wider block mb-1">
              Included Amenities:
            </span>
            {workspace.features.slice(0, 3).map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-[#181F18]">
                <div className="w-4 h-4 rounded-full bg-[#EAF5EA] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-[#2E7D32]" />
                </div>
                <span className="truncate">{feature}</span>
              </div>
            ))}
          </div>

          {/* Price & Action Buttons */}
          <div className="pt-4 border-t border-[#E5E1D8] mt-auto">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <span className="text-[11px] text-[#738273] block uppercase tracking-wider font-semibold">Starting from</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-[#181F18]">
                    {workspace.startingPrice}
                  </span>
                  <span className="text-xs text-[#5C665C]">/{workspace.billingPeriod}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsDetailOpen(true)}
                className="justify-center"
              >
                View Details
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsEnquiryOpen(true)}
                className="justify-center"
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Enquire
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={workspace.name}
        subtitle={`${workspace.categoryLabel} · ${workspace.location}`}
      >
        <div className="space-y-6">
          <div className="h-64 sm:h-72 w-full rounded-xl overflow-hidden bg-[#EAE5DB]">
            <img
              src={workspace.image}
              alt={workspace.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h4 className="text-xs uppercase font-semibold text-[#5C665C] tracking-wider mb-2">
              Overview & Architecture
            </h4>
            <p className="text-sm text-[#181F18] leading-relaxed">
              {workspace.description}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F7F5F0] p-4 rounded-xl border border-[#E5E1D8]">
            <div>
              <span className="text-[11px] text-[#5C665C] block">Capacity</span>
              <span className="text-sm font-semibold text-[#181F18]">{workspace.capacity}</span>
            </div>
            <div>
              <span className="text-[11px] text-[#5C665C] block">Area</span>
              <span className="text-sm font-semibold text-[#181F18]">{workspace.sqft}</span>
            </div>
            <div>
              <span className="text-[11px] text-[#5C665C] block">Pricing</span>
              <span className="text-sm font-semibold text-[#263626]">{workspace.startingPrice}/mo</span>
            </div>
            <div>
              <span className="text-[11px] text-[#5C665C] block">Status</span>
              <span className="text-sm font-semibold text-[#2E7D32]">{workspace.availabilityText}</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase font-semibold text-[#5C665C] tracking-wider mb-2">
              Included Premium Inclusions
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {workspace.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[#181F18]">
                  <Check className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#E3EBE3]/60 p-4 rounded-xl border border-[#CFDCCF]">
            <span className="text-xs font-semibold text-[#263626] block mb-1">
              Ideal Fit:
            </span>
            <p className="text-xs text-[#3A4D3A] leading-relaxed">
              {workspace.idealFor}
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E1D8]">
            <Button variant="secondary" size="md" onClick={() => setIsDetailOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setIsDetailOpen(false);
                setIsEnquiryOpen(true);
              }}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Book Tour / Enquire
            </Button>
          </div>
        </div>
      </Modal>

      {/* Enquiry / Tour Modal */}
      <Modal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        title={`Enquire for ${workspace.name}`}
        subtitle="Schedule a private walkthrough or request membership paperwork."
      >
        {enquirySent ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#EAF5EA] text-[#2E7D32] flex items-center justify-center mx-auto border border-[#C8E6C9]">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-xl font-bold text-[#181F18]">
              Inquiry Received
            </h4>
            <p className="text-sm text-[#5C665C] max-w-sm mx-auto">
              Thank you! Our concierge team will reach out within 2 hours to confirm your private walkthrough of {workspace.name}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleEnquirySubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C665C] mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Elena Rostova"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E5E1D8] rounded-md text-sm text-[#181F18] focus:outline-none focus:border-[#263626]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C665C] mb-1.5">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="elena@company.com"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E5E1D8] rounded-md text-sm text-[#181F18] focus:outline-none focus:border-[#263626]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C665C] mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E5E1D8] rounded-md text-sm text-[#181F18] focus:outline-none focus:border-[#263626]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C665C] mb-1.5">
                  Target Move-in Date
                </label>
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E5E1D8] rounded-md text-sm text-[#181F18] focus:outline-none focus:border-[#263626]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C665C] mb-1.5">
                Special Requirements or Team Size
              </label>
              <textarea
                rows={3}
                placeholder="We have 6 team members and require dual-monitor setup..."
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E1D8] rounded-md text-sm text-[#181F18] focus:outline-none focus:border-[#263626]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button type="button" variant="secondary" size="md" onClick={() => setIsEnquiryOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                Submit Inquiry
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};
