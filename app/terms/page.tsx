'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function TermsConditionsPage() {
  return (
    <div className="bg-[#FAF9F5] min-h-screen flex flex-col">
      {/* Hero Section (60vh) */}
      <section className="relative h-[60vh] min-h-[450px] max-h-[700px] w-full flex flex-col justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0E170E]/80 via-[#0E170E]/60 to-[#0E170E]/90 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1574618797825-788c03e658bb?auto=format&fit=crop&w=2000&q=80" 
            alt="Terms and Conditions" 
            className="w-full h-full object-cover object-center filter brightness-100 contrast-105"
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto text-center flex flex-col items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#4ADE80] mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Legal</span>
          </div>
          
          <div className="inline-block px-5 sm:px-10 py-3.5 sm:py-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
              Terms & Conditions
            </h1>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-10 text-center">
          <p className="text-[#5C665C] text-lg font-medium">Last updated: October 2023</p>
        </div>

        <div className="space-y-6 text-[#5C665C] leading-relaxed">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-[#E5E1D8] hover:bg-[#F0ECE1] transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
            <h2 className="text-2xl font-serif text-[#181F18] font-bold mb-4 group-hover:text-[#2E7D32] transition-colors">1. Agreement to Terms</h2>
            <p>
              These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and EnCourtyard ("we," "us" or "our"), concerning your access to and use of our workspaces and website. You agree that by accessing the site and our facilities, you have read, understood, and agreed to be bound by all of these Terms and Conditions.
            </p>
          </div>
          
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-[#E5E1D8] hover:bg-[#F0ECE1] transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
            <h2 className="text-2xl font-serif text-[#181F18] font-bold mb-4 group-hover:text-[#2E7D32] transition-colors">2. User Representations</h2>
            <p className="mb-3">
              By using the Site and our services, you represent and warrant that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>All registration information you submit will be true, accurate, current, and complete.</li>
              <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
              <li>You have the legal capacity and you agree to comply with these Terms and Conditions.</li>
              <li>You will not use our spaces for any illegal or unauthorized purpose.</li>
            </ul>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-[#E5E1D8] hover:bg-[#F0ECE1] transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
            <h2 className="text-2xl font-serif text-[#181F18] font-bold mb-4 group-hover:text-[#2E7D32] transition-colors">3. Workspace Etiquette & Rules</h2>
            <p className="mb-3">
              To ensure a productive and serene environment for all members, you agree to adhere to our community guidelines:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintain acoustic sanctity in designated quiet zones.</li>
              <li>Treat all staff, members, and guests with professional respect and courtesy.</li>
              <li>Do not leave personal belongings unattended in unassigned areas overnight.</li>
              <li>Guests must be registered and accompanied by a member at all times.</li>
            </ul>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-[#E5E1D8] hover:bg-[#F0ECE1] transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
            <h2 className="text-2xl font-serif text-[#181F18] font-bold mb-4 group-hover:text-[#2E7D32] transition-colors">4. Modifications and Interruptions</h2>
            <p>
              We reserve the right to change, modify, or remove the contents of the Site or our physical amenities at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Site. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of services.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-[#E5E1D8] hover:bg-[#F0ECE1] transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
            <h2 className="text-2xl font-serif text-[#181F18] font-bold mb-4 group-hover:text-[#2E7D32] transition-colors">5. Contact Us</h2>
            <p className="mb-2">
              In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
            </p>
            <p>
              Email address: <a href="mailto:info@courtyard.com" className="text-[#2E7D32] hover:underline font-medium">info@courtyard.com</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
