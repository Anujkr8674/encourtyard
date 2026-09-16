'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, CheckCircle2, ArrowRight, Sparkles, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    spaceInterest: 'private-office',
    teamSize: '1-5',
    tourDate: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div id="visit-form" className="scroll-mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Direct Contact & Concierge Information */}
        <div className="lg:col-span-5 bg-[#263626] text-white p-8 sm:p-10 rounded-2xl shadow-warm border border-[#3A4D3A] space-y-8">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-[#A3BFA3] block mb-2">
              Concierge & Private Tours
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
              Get in touch or visit our courtyard.
            </h3>
            <p className="text-sm text-[#C5D5C5] mt-3 leading-relaxed">
              Whether you are looking for an executive suite for your expanding team or want to host a keynote in our Glass Pavilion, our hospitality team is here to assist.
            </p>
          </div>

          <div className="space-y-5 text-sm text-[#E3EBE3]">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-[#1A261A] flex items-center justify-center text-[#4ADE80] shrink-0 border border-[#3A4D3A]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-[#A3BFA3] uppercase tracking-wider block font-semibold">
                  Physical Address
                </span>
                <span className="font-medium">450 Botanical Way, Suite 100</span>
                <div className="text-xs text-[#A3B0A3]">Innovation District, Central Campus</div>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-[#1A261A] flex items-center justify-center text-[#4ADE80] shrink-0 border border-[#3A4D3A]">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-[#A3BFA3] uppercase tracking-wider block font-semibold">
                  Direct Telephone
                </span>
                <a href="tel:5552348900" className="font-medium hover:underline text-white">
                  +1 (555) 234-8900
                </a>
                <div className="text-xs text-[#A3B0A3]">Mon–Fri from 8:00 AM to 6:00 PM</div>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-[#1A261A] flex items-center justify-center text-[#4ADE80] shrink-0 border border-[#3A4D3A]">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-[#A3BFA3] uppercase tracking-wider block font-semibold">
                  Email Concierge
                </span>
                <a href="mailto:concierge@encourtyard.com" className="font-medium hover:underline text-white">
                  concierge@encourtyard.com
                </a>
                <div className="text-xs text-[#A3B0A3]">Inquiries answered within 2 hours</div>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-[#1A261A] flex items-center justify-center text-[#4ADE80] shrink-0 border border-[#3A4D3A]">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-[#A3BFA3] uppercase tracking-wider block font-semibold">
                  Operating Hours
                </span>
                <span className="font-medium">24/7 Access for EnCourtyard Members</span>
                <div className="text-xs text-[#A3B0A3]">Reception & Public Tours: Weekdays 8am–6pm</div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#3A4D3A] text-xs text-[#A3BFA3] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#4ADE80]" />
            <span>Complimentary barista coffee during all scheduled private tours</span>
          </div>
        </div>

        {/* Right Column: Contact & Tour Form UI */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl shadow-warm border border-[#E5E1D8]">
          {submitted ? (
            <div className="py-12 text-center space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#EAF5EA] text-[#2E7D32] flex items-center justify-center mx-auto border border-[#C8E6C9]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18]">
                Thank You, {formData.fullName || 'Valued Guest'}!
              </h3>
              <p className="text-base text-[#5C665C] max-w-md mx-auto leading-relaxed">
                Your tour request and inquiry have been received by the EnCourtyard concierge team. We will review your requirements and email you confirmation within 2 hours.
              </p>
              <div className="pt-4">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      fullName: '',
                      email: '',
                      phone: '',
                      company: '',
                      spaceInterest: 'private-office',
                      teamSize: '1-5',
                      tourDate: '',
                      message: ''
                    });
                  }}
                >
                  Send Another Inquiry
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h4 className="font-serif text-2xl font-bold text-[#181F18] mb-1">
                  Schedule a Tour or Inquire
                </h4>
                <p className="text-xs sm:text-sm text-[#5C665C]">
                  Complete the details below to arrange a personal visit or request customized space terms.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C665C] mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Marcus Lindqvist"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E5E1D8] rounded-md text-sm text-[#181F18] focus:bg-white focus:outline-none focus:border-[#263626] focus:ring-1 focus:ring-[#263626]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C665C] mb-1.5">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="marcus@company.com"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E5E1D8] rounded-md text-sm text-[#181F18] focus:bg-white focus:outline-none focus:border-[#263626] focus:ring-1 focus:ring-[#263626]"
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
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 012-3456"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E5E1D8] rounded-md text-sm text-[#181F18] focus:bg-white focus:outline-none focus:border-[#263626] focus:ring-1 focus:ring-[#263626]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C665C] mb-1.5">
                    Company / Brand Name
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Studio Lindqvist & Co"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E5E1D8] rounded-md text-sm text-[#181F18] focus:bg-white focus:outline-none focus:border-[#263626] focus:ring-1 focus:ring-[#263626]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C665C] mb-1.5">
                    Space of Interest
                  </label>
                  <select
                    value={formData.spaceInterest}
                    onChange={(e) => setFormData({ ...formData, spaceInterest: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E5E1D8] rounded-md text-sm text-[#181F18] focus:bg-white focus:outline-none focus:border-[#263626] focus:ring-1 focus:ring-[#263626]"
                  >
                    <option value="private-office">Executive Private Suite (4–8 people)</option>
                    <option value="dedicated-desk">Atelier Dedicated Desk (1 person)</option>
                    <option value="hot-desk">Courtyard Flex Hot Desk</option>
                    <option value="team-suite">Custom Enterprise Suite (12–25+ people)</option>
                    <option value="meeting-room">Executive Boardroom / Meeting Suite</option>
                    <option value="event-hall">Glass Pavilion Event Hall (50+ people)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C665C] mb-1.5">
                    Preferred Tour Date
                  </label>
                  <input
                    type="date"
                    value={formData.tourDate}
                    onChange={(e) => setFormData({ ...formData, tourDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E5E1D8] rounded-md text-sm text-[#181F18] focus:bg-white focus:outline-none focus:border-[#263626] focus:ring-1 focus:ring-[#263626]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C665C] mb-1.5">
                  How can we help your team?
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details about your team size, expected move-in timeline, acoustic requirements, or specific questions..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E5E1D8] rounded-md text-sm text-[#181F18] focus:bg-white focus:outline-none focus:border-[#263626] focus:ring-1 focus:ring-[#263626]"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full justify-center"
                  icon={<Send className="w-4 h-4" />}
                >
                  Send Inquiry & Book Walkthrough
                </Button>
                <p className="text-[11px] text-[#738273] text-center mt-2">
                  Static UI demonstration · Submissions are acknowledged immediately in session.
                </p>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
