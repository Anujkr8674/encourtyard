'use client';

import React from 'react';
import { 
  Building, 
  Leaf, 
  ShieldCheck, 
  HeartHandshake, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Sparkles, 
  ArrowRight,
  Sun,
  VolumeX,
  Compass
} from 'lucide-react';
import { ContactForm } from '@/components/about/ContactForm';
import { Button } from '@/components/ui/Button';

export default function AboutPage() {
  const values = [
    {
      icon: <Leaf className="w-6 h-6 text-[#2E7D32]" />,
      title: 'Biophilic Harmony',
      description: 'We believe nature is vital for intellectual endurance. Our spaces integrate natural sunlight, living botanical courtyards, and purified airflow.'
    },
    {
      icon: <VolumeX className="w-6 h-6 text-[#263626]" />,
      title: 'Acoustic Sanctity',
      description: 'Silence and privacy are the prerequisites for breakthrough ideas. We engineer every wall, door, and pod to eliminate auditory friction.'
    },
    {
      icon: <Building className="w-6 h-6 text-[#C29B38]" />,
      title: 'Architectural Craftsmanship',
      description: 'From solid walnut standing desks to tactile linen acoustic panels, we craft tactile spaces built with genuine architectural materials.'
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-[#C05621]" />,
      title: 'Hospitality First',
      description: 'We treat our members like valued hotel guests—with white-glove concierge support, barista service, and proactive care.'
    }
  ];

  return (
    <div className="bg-[#FAF9F5] min-h-screen">
      {/* Page Hero with Dark Canvas */}
      <section className="bg-[#181F18] text-white pt-32 pb-20 border-b border-[#263626] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#3A4D3A_1px,transparent_1px)] [background-size:28px_28px] opacity-25 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#4ADE80]">
              <Compass className="w-3.5 h-3.5" />
              <span>About & Contact</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
              Crafted as an architectural sanctuary for deep work.
            </h1>
            <p className="text-base sm:text-lg text-[#C5D5C5] leading-relaxed font-sans">
              Learn about our single-company vision, our design principles, and how to schedule your private visit to EnCourtyard.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story & Philosophy */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-6 space-y-6 text-left">
            <span className="text-xs uppercase font-mono tracking-widest text-[#263626] font-semibold">
              The EnCourtyard Story
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#181F18] leading-tight">
              Rethinking workspace through the lens of architectural serenity.
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-[#5C665C] leading-relaxed">
              <p>
                EnCourtyard was founded on a simple observation: modern offices had become noisy, fluorescent-lit warehouses that drained creative energy rather than fostering it.
              </p>
              <p>
                We set out to build a physical sanctuary around an open-air botanical courtyard in the heart of the Innovation District. Every workstation, private suite, and meeting room was custom-commissioned with natural oak, acoustic wool, and circadian lighting.
              </p>
              <p>
                Today, EnCourtyard serves as the exclusive headquarters for pioneering startups, architecture studios, and regional enterprise teams who require confidentiality, hospitality, and serene focus.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden shadow-warm-lg border-2 border-white bg-[#EAE5DB]">
              <img
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80"
                alt="EnCourtyard interior architectural design"
                className="w-full h-[480px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 sm:-right-8 bg-[#263626] text-white p-6 rounded-2xl shadow-2xl border border-[#3A4D3A] max-w-xs hidden sm:block">
              <span className="text-xs font-mono uppercase text-[#4ADE80] block mb-1 font-semibold">
                Our Guarantee
              </span>
              <p className="font-serif text-sm font-semibold">
                "Zero density compromises. Every member enjoys generous personal breathing room."
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Core Values Grid */}
      <section className="py-20 bg-[#F7F5F0] border-y border-[#E5E1D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs uppercase font-mono tracking-widest text-[#263626] font-semibold">
              Our Core Principles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#181F18]">
              What guides our space design
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, idx) => (
              <div
                key={idx}
                className="bg-white p-7 rounded-2xl border border-[#E5E1D8] shadow-warm hover:shadow-warm-lg hover:border-[#263626] transition-all flex flex-col justify-between transform hover:-translate-y-1"
              >
                <div>
                  <div className="w-13 h-13 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] flex items-center justify-center mb-5">
                    {v.icon}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#181F18] mb-2">
                    {v.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C665C] leading-relaxed">
                    {v.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Contact & Tour Section */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ContactForm />
      </section>

      {/* Location & Opening Hours Section */}
      <section id="location-hours" className="py-20 bg-[#F7F5F0] border-t border-[#E5E1D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-[#263626] font-semibold">
                  Campus Location & Accessibility
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18] mt-2">
                  Situated in the heart of Innovation District
                </h3>
                <p className="text-sm text-[#5C665C] mt-2 leading-relaxed">
                  Located directly opposite the Botanical Arboretum with dedicated underground parking, secure indoor bike valet, and subway access 2 blocks away.
                </p>
              </div>

              <div className="space-y-3 bg-white p-7 rounded-2xl border border-[#E5E1D8] shadow-warm text-xs sm:text-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E1D8]">
                  <span className="font-medium text-[#181F18]">EnCourtyard Member Access</span>
                  <span className="font-mono text-[#2E7D32] font-bold">24/7 / 365 Days</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E1D8]">
                  <span className="font-medium text-[#181F18]">Concierge & Tour Hours</span>
                  <span className="font-mono text-[#5C665C]">Mon–Fri: 8:00 AM – 6:00 PM</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E1D8]">
                  <span className="font-medium text-[#181F18]">Botanical Café & Barista</span>
                  <span className="font-mono text-[#5C665C]">Mon–Fri: 8:00 AM – 4:30 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#181F18]">Weekend Member Support</span>
                  <span className="font-mono text-[#5C665C]">On-Call Resident Manager</span>
                </div>
              </div>
            </div>

            {/* Architectural Campus Map Card */}
            <div className="lg:col-span-6 bg-white p-7 rounded-3xl border border-[#E5E1D8] shadow-warm text-center space-y-4">
              <div className="h-72 sm:h-80 w-full rounded-2xl overflow-hidden bg-[#181F18] relative flex items-center justify-center text-white">
                {/* Visual Map Representation */}
                <div className="absolute inset-0 bg-[radial-gradient(#3A4D3A_1px,transparent_1px)] [background-size:20px_20px] opacity-45" />
                <div className="relative z-10 p-6 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-[#4ADE80] text-[#181F18] flex items-center justify-center mx-auto shadow-xl animate-bounce">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div className="font-serif text-2xl font-bold text-white">EnCourtyard Campus</div>
                  <div className="text-xs text-[#C5D5C5] font-mono">
                    450 Botanical Way, Suite 100
                  </div>
                  <div className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur-md rounded-full text-xs text-[#E3EBE3] border border-white/20">
                    Visitor Parking Entry via Gate 2
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#5C665C] pt-2">
                <span>Direct Transit: Metro Line A (Botanical Station)</span>
                <span className="font-semibold text-[#263626]">EV Fast Chargers On-Site</span>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
