'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState(false);

  // Do not render on Admin portal or User dashboard pages
  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
    return null;
  }

  const phoneNumber = '919908209993';
  const defaultMessage =
    'Hello EnCourtyard! I would like to enquire about workspace availability, plans, and scheduling a visit.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center group select-none">
      {/* Interactive Tooltip Card / Speech Bubble on Hover */}
      <div
        className={`hidden sm:flex items-center gap-2.5 mr-3 px-3.5 py-2 rounded-2xl bg-[#0E170E]/95 text-white backdrop-blur-xl border border-emerald-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 pointer-events-none transform ${
          showTooltip
            ? 'opacity-100 translate-x-0 scale-100'
            : 'opacity-0 translate-x-4 scale-95 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100'
        }`}
      >
        <div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
        <div className="text-left font-sans">
          <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
            <span>Chat on WhatsApp</span>
            <span className="text-[9px] font-mono text-[#4ADE80] uppercase tracking-wider bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
              Online
            </span>
          </div>
          <div className="text-[10px] text-[#A3BFA3] leading-tight">
            Instant concierge response
          </div>
        </div>
      </div>

      {/* Main Floating WhatsApp Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with EnCourtyard Concierge on WhatsApp"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-[0_8px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_35px_rgba(37,211,102,0.6)] transform hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
      >
        {/* Soft Ambient Radiating Glow Ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 pointer-events-none" />

        {/* Authentic WhatsApp SVG Icon */}
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8 fill-current drop-shadow-md relative z-10"
          viewBox="0 0 24 24"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>

        {/* Online Indicator Dot */}
        <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
        </span>
      </a>
    </div>
  );
};
