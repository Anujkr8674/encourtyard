'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface GoogleReview {
  id: string;
  author: string;
  role: string;
  company: string;
  avatarBg: string;
  initial: string;
  rating: number;
  timeAgo: string;
  review: string;
}

const GOOGLE_REVIEWS: GoogleReview[] = [
  {
    id: 'rev-1',
    author: 'Emma Thompson',
    role: 'VP Engineering',
    company: 'RetailMax',
    avatarBg: 'bg-[#7C3AED]',
    initial: 'E',
    rating: 5,
    timeAgo: '3 days ago',
    review:
      'We needed a high-performance space for our distributed engineering sprints. EnCourtyard delivered a next-gen environment with zero latency WiFi and peaceful private suites.'
  },
  {
    id: 'rev-2',
    author: 'Ritika Sharma',
    role: 'Founder & CEO',
    company: 'BlinkTech',
    avatarBg: 'bg-[#0284C7]',
    initial: 'R',
    rating: 5,
    timeAgo: '5 days ago',
    review:
      'EnCourtyard has been the perfect space for our growing team. The botanical atmosphere, world-class amenities, and supportive community have completely transformed our culture.'
  },
  {
    id: 'rev-3',
    author: 'Arjun Mehta',
    role: 'CTO',
    company: 'GrowthLabs',
    avatarBg: 'bg-[#059669]',
    initial: 'A',
    rating: 5,
    timeAgo: '1 week ago',
    review:
      'A truly productive, inspiring and remarkably well-managed workspace. The acoustic privacy in meeting rooms and artisanal espresso bar make every single workday effortless.'
  },
  {
    id: 'rev-4',
    author: 'Neha Kapoor',
    role: 'Head of Talent',
    company: 'ScaleUp India',
    avatarBg: 'bg-[#D97706]',
    initial: 'N',
    rating: 5,
    timeAgo: '2 weeks ago',
    review:
      'The meeting rooms and hospitality amenities are top-notch. It feels like a 5-star hotel combined with a high-focus tech sanctuary. Our clients are always blown away!'
  },
  {
    id: 'rev-5',
    author: 'David Chen',
    role: 'Principal Architect',
    company: 'Studio Zen',
    avatarBg: 'bg-[#4F46E5]',
    initial: 'D',
    rating: 5,
    timeAgo: '3 weeks ago',
    review:
      'The architectural craftsmanship and botanical daylight across EnCourtyard are second to none. It fosters deep focus and genuine creative collaboration.'
  },
  {
    id: 'rev-6',
    author: 'Pooja Hegde',
    role: 'Product Director',
    company: 'FinCore Labs',
    avatarBg: 'bg-[#E11D48]',
    initial: 'P',
    rating: 5,
    timeAgo: '1 month ago',
    review:
      'From 24/7 keycard access to ultra-fast fiber networks, everything is enterprise-grade. Moving our regional office here was the best operational decision we made.'
  }
];

export const TestimonialsSection: React.FC = () => {
  // Duplicate array for seamless infinite looping
  const reviewsStream = [...GOOGLE_REVIEWS, ...GOOGLE_REVIEWS, ...GOOGLE_REVIEWS];

  return (
    <section className="py-20 lg:py-24 primary-section-bg border-b border-[#E5E1D8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#738273] font-bold">
                MEMBER EXPERIENCES
              </span>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1 text-[#F59E0B]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B]" />
                ))}
                <span className="text-xs font-bold text-[#181F18] ml-1">4.9 / 5</span>
              </div>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#181F18] tracking-tight leading-tight">
              What Our Members Say
            </h2>
            <p className="text-sm sm:text-base text-[#5C665C] mt-1.5 font-sans">
              Real stories from founders, creators, and teams thriving at EnCourtyard.
            </p>
          </div>

          {/* <div className="flex items-center gap-2">
            <span className="text-xs text-[#738273] font-sans italic hidden sm:inline">
              Hover over cards to pause auto-scroll
            </span>
          </div> */}
        </div>

      </div>

      {/* Auto-scrolling Infinite Marquee (Left to Right) */}
      <div className="relative w-full overflow-hidden py-4">

        {/* Subtle Side Fade Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#FAF9F5] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#FAF9F5] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-ltr flex gap-6 px-4">
          {reviewsStream.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="w-[330px] sm:w-[370px] bg-white rounded-3xl p-6 sm:p-7 border border-[#E5E1D8] shadow-[0_4px_16px_rgba(24,31,24,0.04)] hover:shadow-2xl hover:border-[#263626]/40 transform hover:-translate-y-2.5 transition-all duration-300 flex flex-col justify-between shrink-0 group cursor-pointer"
            >
              <div>
                {/* Google Review Header Row */}
                <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE1] mb-4">
                  <div className="flex items-center gap-2">
                    {/* Official Google G SVG */}
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span className="font-sans font-bold text-[11px] tracking-wider text-[#6B7280] uppercase">
                      GOOGLE REVIEW
                    </span>
                  </div>

                  {/* Verified Badge */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    Verified
                  </span>
                </div>

                {/* Member Profile Row */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div
                    className={`w-11 h-11 rounded-full ${item.avatarBg} text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0`}
                  >
                    {item.initial}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm sm:text-base text-[#181F18] leading-tight group-hover:text-[#263626] transition-colors">
                      {item.author}
                    </h4>
                    <p className="text-xs text-[#6B7280] font-sans mt-0.5">
                      {item.role} at {item.company}
                    </p>
                  </div>
                </div>

                {/* Star Rating & Timestamp */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-0.5 text-[#F59E0B]">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#F59E0B]" />
                    ))}
                  </div>
                  <span className="text-xs text-[#9CA3AF] font-sans">
                    {item.timeAgo}
                  </span>
                </div>

                {/* Testimonial Quote */}
                <p className="text-xs sm:text-[13px] text-[#374151] leading-relaxed font-sans">
                  “{item.review}”
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
