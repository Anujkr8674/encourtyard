'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#FAF9F5] min-h-screen flex flex-col">
      {/* Hero Section (60vh) */}
      <section className="relative h-[60vh] min-h-[450px] max-h-[700px] w-full flex flex-col justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0E170E]/80 via-[#0E170E]/60 to-[#0E170E]/90 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2000&q=80" 
            alt="Privacy Policy" 
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
              Privacy Policy
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
            <h2 className="text-2xl font-serif text-[#181F18] font-bold mb-4 group-hover:text-[#2E7D32] transition-colors">1. Introduction</h2>
            <p>
              Welcome to EnCourtyard. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
            </p>
          </div>
          
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-[#E5E1D8] hover:bg-[#F0ECE1] transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
            <h2 className="text-2xl font-serif text-[#181F18] font-bold mb-4 group-hover:text-[#2E7D32] transition-colors">2. The Data We Collect About You</h2>
            <p className="mb-3">
              Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Identity Data</strong> includes first name, maiden name, last name, username or similar identifier, marital status, title, date of birth and gender.</li>
              <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
              <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
            </ul>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-[#E5E1D8] hover:bg-[#F0ECE1] transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
            <h2 className="text-2xl font-serif text-[#181F18] font-bold mb-4 group-hover:text-[#2E7D32] transition-colors">3. How We Use Your Personal Data</h2>
            <p className="mb-3">
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-[#E5E1D8] hover:bg-[#F0ECE1] transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
            <h2 className="text-2xl font-serif text-[#181F18] font-bold mb-4 group-hover:text-[#2E7D32] transition-colors">4. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-[#E5E1D8] hover:bg-[#F0ECE1] transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
            <h2 className="text-2xl font-serif text-[#181F18] font-bold mb-4 group-hover:text-[#2E7D32] transition-colors">5. Contact Us</h2>
            <p className="mb-2">
              If you have any questions about this privacy policy or our privacy practices, please contact our data privacy manager in the following ways:
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
