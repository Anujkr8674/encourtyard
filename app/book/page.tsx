'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Users, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Download,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function BookSeatsPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    workspaceType: 'private-office',
    seatsRequired: '6',
    rentalDuration: '12-months',
    joiningDate: new Date().toISOString().split('T')[0],
    additionalRequirements: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomId = `EC-${Math.floor(10000 + Math.random() * 90000)}`;
    setBookingId(randomId);
    setIsSubmitted(true);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen">
      {/* Header Banner */}
      <section className="bg-[#181F18] text-white pt-32 pb-20 border-b border-[#263626] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#3A4D3A_1px,transparent_1px)] [background-size:28px_28px] opacity-25 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#4ADE80]">
              <Building2 className="w-3.5 h-3.5" />
              <span>Workspace Reservation Portal</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
              Reserve your company workspace.
            </h1>
            <p className="text-base sm:text-lg text-[#C5D5C5] leading-relaxed font-sans">
              Complete your company booking application. We will hold your designated seats and prepare your onboarding documentation.
            </p>
          </div>
        </div>
      </section>

      {/* Main Reservation & Confirmation Flow */}
      <section className="py-16 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {isSubmitted ? (
          /* STEP 4: BOOKING CONFIRMATION SCREEN */
          <div className="bg-white rounded-3xl border border-[#E5E1D8] shadow-warm-lg p-8 sm:p-12 space-y-8 animate-fadeIn text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#E5E1D8]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#EAF5EA] text-[#2E7D32] flex items-center justify-center border border-[#C8E6C9] shrink-0">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs uppercase font-mono tracking-widest text-[#2E7D32] font-bold block">
                    Booking Request Confirmed
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18]">
                    Seats Reserved for {formData.companyName || 'Your Team'}
                  </h2>
                </div>
              </div>

              {/* Booking Reference Pill */}
              <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E5E1D8] flex items-center gap-3 shrink-0">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#738273] block font-semibold">Booking Reference</span>
                  <span className="font-mono text-base font-bold text-[#263626]">{bookingId}</span>
                </div>
                <button
                  onClick={handleCopyId}
                  className="p-2 rounded-lg bg-white border border-[#E5E1D8] hover:bg-[#F2EEE7] text-[#5C665C] transition-colors cursor-pointer"
                  title="Copy Reference ID"
                >
                  {copied ? <Check className="w-4 h-4 text-[#2E7D32]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Booking Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#F7F5F0] p-6 rounded-2xl border border-[#E5E1D8]">
              <div>
                <span className="text-xs text-[#5C665C] block">Workspace Type</span>
                <span className="text-sm font-bold text-[#181F18] capitalize">
                  {formData.workspaceType.replace('-', ' ')}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#5C665C] block">Seats Allocated</span>
                <span className="text-sm font-bold text-[#181F18]">
                  {formData.seatsRequired} Dedicated Seats
                </span>
              </div>
              <div>
                <span className="text-xs text-[#5C665C] block">Target Move-In</span>
                <span className="text-sm font-bold text-[#181F18]">
                  {formData.joiningDate}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#5C665C] block">Agreement Term</span>
                <span className="text-sm font-bold text-[#263626]">
                  {formData.rentalDuration.replace('-', ' ')}
                </span>
              </div>
            </div>

            {/* Next Steps Card */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#181F18]">
                What Happens Next?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-white border border-[#E5E1D8] space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-[#263626] text-white flex items-center justify-center font-bold text-xs">1</div>
                  <h4 className="font-bold text-[#181F18]">Email Verification</h4>
                  <p className="text-[#5C665C]">A formal confirmation receipt has been sent to <strong>{formData.email}</strong>.</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#E5E1D8] space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-[#263626] text-white flex items-center justify-center font-bold text-xs">2</div>
                  <h4 className="font-bold text-[#181F18]">Keycard & IT Setup</h4>
                  <p className="text-[#5C665C]">Our concierge will configure your team's biometric credentials and VLAN subnet.</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#E5E1D8] space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-[#263626] text-white flex items-center justify-center font-bold text-xs">3</div>
                  <h4 className="font-bold text-[#181F18]">Move-in Day Tour</h4>
                  <p className="text-[#5C665C]">Welcome coffee & workstation handoff scheduled on {formData.joiningDate}.</p>
                </div>
              </div>
            </div>

            {/* Confirmation CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#E5E1D8]">
              <Link
                href="/dashboard"
                className="text-xs sm:text-sm font-semibold text-[#263626] underline hover:text-[#3A4D3A]"
              >
                Go to Member Dashboard &rarr;
              </Link>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setIsSubmitted(false)}
                >
                  Book Additional Seats
                </Button>
                <Button
                  href="/"
                  variant="primary"
                  size="md"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Return to Home
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* STEP 3: BOOK SEATS APPLICATION FORM */
          <div className="bg-white rounded-3xl border border-[#E5E1D8] shadow-warm p-8 sm:p-12 space-y-8">
            <div className="border-b border-[#E5E1D8] pb-6 text-left">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18]">
                Company Workspace Reservation Form
              </h2>
              <p className="text-xs sm:text-sm text-[#5C665C] mt-1.5">
                Please provide your company details to capture and hold seat allocation.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              {/* Section 1: Company & Contact */}
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#263626] block">
                  1. Company & Contact Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#5C665C] uppercase tracking-wider mb-1.5">
                      Company Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g., Vanguard BioTech Inc."
                      className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#E5E1D8] rounded-xl text-sm text-[#181F18] focus:bg-white focus:outline-none focus:border-[#263626]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5C665C] uppercase tracking-wider mb-1.5">
                      Lead Contact Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      placeholder="e.g., Elena Rostova"
                      className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#E5E1D8] rounded-xl text-sm text-[#181F18] focus:bg-white focus:outline-none focus:border-[#263626]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#5C665C] uppercase tracking-wider mb-1.5">
                      Corporate Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="elena@vanguard.com"
                      className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#E5E1D8] rounded-xl text-sm text-[#181F18] focus:bg-white focus:outline-none focus:border-[#263626]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5C665C] uppercase tracking-wider mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 234-8900"
                      className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#E5E1D8] rounded-xl text-sm text-[#181F18] focus:bg-white focus:outline-none focus:border-[#263626]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Seat Requirements */}
              <div className="space-y-4 pt-4 border-t border-[#E5E1D8]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#263626] block">
                  2. Workspace & Seat Configuration
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#5C665C] uppercase tracking-wider mb-1.5">
                      Workspace Tier
                    </label>
                    <select
                      value={formData.workspaceType}
                      onChange={(e) => setFormData({ ...formData, workspaceType: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#E5E1D8] rounded-xl text-sm text-[#181F18] focus:bg-white focus:outline-none focus:border-[#263626]"
                    >
                      <option value="private-office">Executive Private Suite</option>
                      <option value="dedicated-desk">Atelier Dedicated Desks</option>
                      <option value="hot-desk">Courtyard Flex Hot Desks</option>
                      <option value="team-suite">Custom Enterprise Wing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5C665C] uppercase tracking-wider mb-1.5">
                      Number of Seats Required
                    </label>
                    <select
                      value={formData.seatsRequired}
                      onChange={(e) => setFormData({ ...formData, seatsRequired: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#E5E1D8] rounded-xl text-sm text-[#181F18] focus:bg-white focus:outline-none focus:border-[#263626]"
                    >
                      <option value="1">1 Dedicated Seat</option>
                      <option value="2-4">2 – 4 Seats</option>
                      <option value="6">6 Seats (Suite A)</option>
                      <option value="8">8 Seats (Suite B)</option>
                      <option value="12-25">12 – 25 Seats (Team Wing)</option>
                      <option value="30+">30+ Enterprise Floor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5C665C] uppercase tracking-wider mb-1.5">
                      Rental Agreement Term
                    </label>
                    <select
                      value={formData.rentalDuration}
                      onChange={(e) => setFormData({ ...formData, rentalDuration: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#E5E1D8] rounded-xl text-sm text-[#181F18] focus:bg-white focus:outline-none focus:border-[#263626]"
                    >
                      <option value="month-to-month">Month-to-Month Flexible</option>
                      <option value="6-months">6-Month Term (5% savings)</option>
                      <option value="12-months">12-Month Term (18% savings)</option>
                      <option value="24-months">24-Month Custom HQ</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#5C665C] uppercase tracking-wider mb-1.5">
                      Anticipated Joining Date
                    </label>
                    <input
                      type="date"
                      value={formData.joiningDate}
                      onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#E5E1D8] rounded-xl text-sm text-[#181F18] focus:bg-white focus:outline-none focus:border-[#263626]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5C665C] uppercase tracking-wider mb-1.5">
                      Special IT or Acoustic Needs (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.additionalRequirements}
                      onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
                      placeholder="e.g., Private VLAN subnet, standing desks for all..."
                      className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#E5E1D8] rounded-xl text-sm text-[#181F18] focus:bg-white focus:outline-none focus:border-[#263626]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-[#E5E1D8]">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full justify-center py-4 rounded-xl text-base shadow-warm"
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  Submit Booking Request & Generate Confirmation
                </Button>
                <div className="text-center text-xs text-[#738273] mt-2.5">
                  Static booking demonstration · Zero payment required during test stage.
                </div>
              </div>
            </form>
          </div>
        )}

      </section>
    </div>
  );
}
