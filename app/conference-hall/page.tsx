'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  Clock,
  Sparkles,
  Check,
  ArrowRight,
  Building2,
  Lock,
  LogIn,
  UserPlus,
  X,
  Layers,
  MapPin,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { CountdownBadge } from '@/components/ui/CountdownBadge';
import { Accordion } from '@/components/ui/Accordion';

interface SpecItem {
  key: string;
  value: string;
}

interface MediaItem {
  url: string;
  type: 'image' | 'video';
  name: string;
}

interface Workspace {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  shortDescription: string;
  longDescription?: string | null;
  specifications: SpecItem[];
  mediaUrls: MediaItem[];
  price?: string | null;
  capacity?: string | null;
  location?: string | null;
  badge?: string | null;
  order: number;
  isActive: boolean;
  bookings?: { startDate: string; endDate: string; startTime: string; endTime: string }[];
  maintenanceBlocks?: { startDate: string; endDate: string; startTime: string; endTime: string }[];
}


function parseBookingDateTime(dateStr: string, timeStr: string): number {
  if (!dateStr || !timeStr) return 0;
  const [year, month, day] = dateStr.split('-').map(Number);
  const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)/i;
  const match = timeStr.match(timeRegex);
  if (!match) return 0;

  let [_, hoursStr, minsStr, modifier] = match;
  let hours = parseInt(hoursStr, 10);
  const mins = parseInt(minsStr, 10);

  if (modifier.toUpperCase() === 'PM' && hours < 12) hours += 12;
  if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;

  return new Date(year, month - 1, day, hours, mins).getTime();
}

function checkWorkspaceAvailability(
  workspace: Workspace,
  userStartDate: string,
  userStartTime: string,
  userEndDate: string,
  userEndTime: string
): { isAvailable: boolean; nextAvailableTimestamp?: number } {
  const combinedBlocks = [...(workspace.bookings || []), ...(workspace.maintenanceBlocks || [])];
  if (combinedBlocks.length === 0) return { isAvailable: true };

  const userStart = parseBookingDateTime(userStartDate, userStartTime);
  const userEnd = parseBookingDateTime(userEndDate, userEndTime);
  if (!userStart || !userEnd) return { isAvailable: true };

  let isAvail = true;
  let maxEndTime = 0;

  for (const b of combinedBlocks) {
    const bStart = parseBookingDateTime(b.startDate, b.startTime);
    const bEnd = parseBookingDateTime(b.endDate, b.endTime);
    if (!bStart || !bEnd) continue;

    if (userStart < bEnd && userEnd > bStart) {
      isAvail = false;
      if (bEnd > maxEndTime) maxEndTime = bEnd;
    }
  }

  if (!isAvail) {
    return { isAvailable: false, nextAvailableTimestamp: maxEndTime };
  }
  return { isAvailable: true };
}

export default function ConferenceHallPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkspaceForAuth, setSelectedWorkspaceForAuth] = useState<Workspace | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Today's date (YYYY-MM-DD)
  const todayDate = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const defaultStartTime = '09:00 AM';
  const defaultEndTime = '06:00 PM';

  // Fetch workspaces from API and filter ONLY the "Confrence Hall" category offices
  useEffect(() => {
    const fetchConferenceWorkspaces = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/workspaces', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && Array.isArray(data.workspaces)) {
            // Strictly filter workspaces belonging to Confrence Hall category (matches Supabase database)
            const conferenceOnly = data.workspaces.filter((ws: any) => {
              const catName = (ws.categoryName || '').toLowerCase().trim();
              const catId = (ws.categoryId || '').toLowerCase().trim();

              return (
                catName.includes('conf') ||
                catId === '1ac79bff-71f9-4924-8091-f07c9ae1ec06'
              );
            });
            setWorkspaces(conferenceOnly);
          }
        }
      } catch (err) {
        console.error('Failed to fetch conference workspaces:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConferenceWorkspaces();
  }, []);



  const handleBookNow = (ws: Workspace) => {
    try {
      sessionStorage.setItem(`ws_cache_${ws.id}`, JSON.stringify(ws));
    } catch (_) {}
    const targetUrl = `/book?workspace=${encodeURIComponent(ws.id)}&plan=hourly&startDate=${todayDate}&endDate=${todayDate}&startTime=${encodeURIComponent(defaultStartTime)}&endTime=${encodeURIComponent(defaultEndTime)}`;
    if (user || isAuthenticated) {
      router.push(targetUrl);
    } else {
      setSelectedWorkspaceForAuth(ws);
      setShowAuthModal(true);
    }
  };

  const conferenceFaqs = [
    {
      id: 'ch-1',
      question: 'What is included with a Conference Hall booking?',
      answer: 'Every Conference Hall reservation includes complete broadcast-grade AV equipment (4K projection or LED video wall, Shure wireless microphones, high-speed dedicated gigabit fiber), wireless screen casting, pre-function reception area, and dedicated on-site AV technician support throughout your event.'
    },
    {
      id: 'ch-2',
      question: 'Can you host hybrid in-person and virtual attendees simultaneously?',
      answer: 'Yes. Our halls are outfitted with Neat AI auto-tracking cameras, ceiling beamforming microphone arrays, and seamless Zoom Rooms / Microsoft Teams integration, allowing remote speakers and attendees to interact in real time with zero acoustic feedback.'
    },
    {
      id: 'ch-3',
      question: 'What executive catering and refreshment options are available?',
      answer: 'Our on-site culinary partners provide bespoke breakfast spreads, artisanal barista coffee stations, multi-course buffet lunches, and evening canapé receptions. Custom dietary requests (vegan, gluten-free, halal, Jain) are fully accommodated.'
    },
    {
      id: 'ch-4',
      question: 'What is the deposit and cancellation policy for large conference halls?',
      answer: 'Large presentation halls and auditoriums can be reserved with a 20% holding deposit. Cancellations or date rescheduling made at least 7 days before the event receive a 100% full refund.'
    }
  ];

  return (
    <div className="bg-white min-h-screen text-[#181F18] font-sans">
      
      {/* ========================================================================= */}
      {/* CONFERENCE HALLS CATALOG (Direct load of office cards)                    */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-36 pb-16">

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((n) => (
              <div key={n} className="bg-white rounded-3xl border border-[#E5E1D8] overflow-hidden shadow-sm p-6 space-y-4 animate-pulse">
                <div className="h-64 bg-[#EAE5DB] rounded-2xl" />
                <div className="h-6 bg-[#EAE5DB] rounded w-2/3" />
                <div className="h-4 bg-[#EAE5DB] rounded w-full" />
                <div className="h-10 bg-[#EAE5DB] rounded-xl" />
              </div>
            ))}
          </div>
        ) : workspaces.length === 0 ? (
          <div className="text-center py-16 bg-[#FAF9F5] rounded-3xl border border-[#E5E1D8]">
            <Building2 className="w-12 h-12 text-[#738273] mx-auto mb-3" />
            <h3 className="font-serif text-xl font-bold text-[#181F18]">No Conference Halls Found</h3>
            <p className="text-xs sm:text-sm text-[#5C665C] mt-1 max-w-md mx-auto">
              No workspaces are currently assigned to the Confrence Hall category in the database.
            </p>
          </div>
        ) : (
          /* 2-Column Wide Grid matching current layout without left sidebar filter */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {workspaces.map((ws) => {
              const firstMedia = ws.mediaUrls?.[0];
              const { isAvailable, nextAvailableTimestamp } = checkWorkspaceAvailability(
                ws,
                todayDate,
                defaultStartTime,
                todayDate,
                defaultEndTime
              );

              return (
                <div
                  key={ws.id}
                  className="bg-white hover:bg-[#2D3E2D] rounded-3xl border border-[#E0DCD3] hover:border-[#4ADE80]/50 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group font-sans cursor-pointer hover:-translate-y-1"
                >
                  {/* Top Image Container */}
                  <div>
                    <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#EAE5DB]">
                      <img
                        src={
                          firstMedia?.url ||
                          'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'
                        }
                        alt={ws.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out select-none"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80';
                        }}
                      />

                      {/* Top Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#181F18] text-xs font-bold shadow-xs">
                          <Layers className="w-3.5 h-3.5 text-[#2E7D32]" />
                          <span>{ws.categoryName || 'Confrence Hall'}</span>
                        </span>

                        {!isAvailable ? (
                          <CountdownBadge targetTimestamp={nextAvailableTimestamp} className="!text-[10px] !px-2.5 !py-0.5" />
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-xs bg-emerald-500/90 text-white">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            <span>Available Today</span>
                          </span>
                        )}
                      </div>

                      {/* Bottom Bar on Image: Price & Capacity */}
                      <div className="absolute bottom-4 left-4 right-4 text-white flex items-center justify-between z-10">
                        <span className="font-serif font-bold text-base text-white drop-shadow-md bg-black/40 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/20">
                          {ws.price || 'Flexible Plan'}
                        </span>
                        {ws.capacity && (
                          <span className="flex items-center gap-1.5 text-xs font-semibold drop-shadow-md px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs border border-white/20 text-[#4ADE80]">
                            <Users className="w-3.5 h-3.5" />
                            <span>{ws.capacity} Pax</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Information */}
                    <div className="p-6 sm:p-7 space-y-3.5">
                      <div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#181F18] group-hover:text-white transition-colors leading-snug">
                          {ws.title}
                        </h3>
                        {ws.location && (
                          <div className="flex items-center gap-1.5 text-xs text-[#5C665C] group-hover:text-[#D1E0D1] mt-1 transition-colors">
                            <MapPin className="w-3.5 h-3.5 text-[#2E7D32] group-hover:text-[#4ADE80]" />
                            <span>{ws.location}</span>
                          </div>
                        )}
                        <p className="text-xs sm:text-sm text-[#5C665C] group-hover:text-[#D1E0D1] line-clamp-2 mt-2 leading-relaxed transition-colors min-h-[38px]">
                          {ws.shortDescription}
                        </p>
                      </div>

                      {/* Specifications Snippet */}
                      {ws.specifications && ws.specifications.length > 0 && (
                        <div className="pt-3 border-t border-[#E5E1D8] group-hover:border-white/15 flex flex-wrap gap-2 text-xs transition-colors">
                          {ws.specifications.slice(0, 3).map((spec, sIdx) => (
                            <span
                              key={sIdx}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAF9F5] group-hover:bg-[#1E2B1E] border border-[#E5E1D8] group-hover:border-[#4ADE80]/30 text-[#334133] group-hover:text-[#E3EBE3] transition-colors text-[11px] font-mono"
                            >
                              <Check className="w-3 h-3 text-[#2E7D32] group-hover:text-[#4ADE80] transition-colors" />
                              <span>
                                {spec.key}: {spec.value}
                              </span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Action Buttons (Identical Booking Features as /book-space) */}
                  <div className="p-6 pt-0 flex items-center gap-3 border-t border-[#E5E1D8]/60 group-hover:border-white/15 pt-4 mt-2 transition-colors">
                    {/* 1. Details Button -> navigates to /book-space/[id] with hourly plan */}
                    <Link
                      href={`/book-space/${ws.id}?plan=hourly&startDate=${todayDate}&endDate=${todayDate}&startTime=${encodeURIComponent(defaultStartTime)}&endTime=${encodeURIComponent(defaultEndTime)}`}
                      onClick={() => {
                        try {
                          sessionStorage.setItem(`ws_cache_${ws.id}`, JSON.stringify(ws));
                        } catch (_) {}
                      }}
                      className="flex-1 py-3 px-4 rounded-xl bg-[#FAF9F5] hover:bg-[#EAE5DC] group-hover:bg-white/10 group-hover:hover:bg-white/20 text-[#181F18] group-hover:text-white border border-[#D5D0C5] group-hover:border-white/30 text-xs font-bold text-center transition-all duration-200 active:scale-95 shadow-2xs"
                    >
                      Details
                    </Link>

                    {/* 2. Book Now Button -> triggers auth check if guest, else navigates to /book */}
                    <button
                      type="button"
                      disabled={!isAvailable}
                      onClick={(e) => {
                        e.preventDefault();
                        if (!isAvailable) return;
                        handleBookNow(ws);
                      }}
                      className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold text-center shadow-xs transition-all duration-200 flex items-center justify-center gap-1.5 ${
                        !isAvailable
                          ? 'bg-[#E5E1D8] text-[#8C968C] cursor-not-allowed border border-[#D5D0C5]'
                          : 'bg-[#2E7D32] hover:bg-[#1E5C23] text-white hover:shadow-md active:scale-95 cursor-pointer'
                      }`}
                    >
                      <span>{isAvailable ? 'Book Now' : 'Not Available'}</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>


      {/* ========================================================================= */}
      {/* 4. CONFERENCE FAQS                                                        */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 space-y-2">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#181F18]">
           Frequently Asked Questions
          </h2>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-[#E5E1D8] shadow-warm">
          <Accordion items={conferenceFaqs} defaultOpenIndex={0} />
        </div>

        {/* Schedule a Walkthrough Banner */}
        <div className="mt-14 p-8 sm:p-10 bg-[#263626] text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl border border-[#3A4D3A]">
          <div>
            <h4 className="font-serif text-2xl font-bold text-white">
              Want a private technical inspection of our halls?
            </h4>
            <p className="text-xs sm:text-sm text-[#C5D5C5] mt-1">
              Test the acoustics, laser displays, and broadcast switchers firsthand with our AV engineering team.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#185ADB] hover:bg-[#144BB8] text-white font-semibold text-xs sm:text-sm rounded-full px-6 py-3 shadow-md transition-all shrink-0 cursor-pointer"
          >
            <span>Schedule a Visit</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. AUTH CHECK MODAL (Same as /book-space)                                 */}
      {/* ========================================================================= */}
      {showAuthModal && selectedWorkspaceForAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => {
              setShowAuthModal(false);
              setSelectedWorkspaceForAuth(null);
            }}
          />

          <div className="relative z-10 w-full max-w-md bg-white rounded-3xl border border-[#E0DCD3] shadow-2xl p-6 sm:p-8 text-center animate-scaleUp font-sans">
            <button
              type="button"
              onClick={() => {
                setShowAuthModal(false);
                setSelectedWorkspaceForAuth(null);
              }}
              className="absolute top-4.5 right-4.5 p-2 rounded-full text-gray-400 hover:text-[#181F18] hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative w-20 h-20 mx-auto mb-5 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-[#E8F5E9] border-2 border-[#C8E6C9] text-[#2E7D32] flex items-center justify-center shadow-[0_0_25px_rgba(46,125,50,0.25)] animate-scaleUp">
                <Lock className="w-8 h-8 stroke-[2.2]" />
              </div>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18] tracking-tight mb-2">
              Sign In Required
            </h3>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF9F5] border border-[#E5E1D8] text-xs text-[#2E7D32] mb-3 max-w-full">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="font-bold truncate max-w-[200px]">{selectedWorkspaceForAuth.title}</span>
              <span className="text-[#8A968A]">•</span>
              <span className="capitalize font-semibold text-[#181F18]">{selectedWorkspaceForAuth.categoryName}</span>
            </div>

            <p className="text-xs sm:text-sm text-[#5C665C] leading-relaxed mb-6">
              You must be signed in to reserve this conference hall so our team can coordinate your AV equipment, assign your guest pass, and issue your booking confirmation.
            </p>

            <div className="space-y-2.5">
              <Link
                href={`/login?redirect=${encodeURIComponent(`/book?workspace=${encodeURIComponent(selectedWorkspaceForAuth.id)}&plan=daily&startDate=${todayDate}&endDate=${todayDate}&startTime=${encodeURIComponent(defaultStartTime)}&endTime=${encodeURIComponent(defaultEndTime)}`)}`}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#185ADB] hover:bg-[#144BB8] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Continue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href={`/signup?redirect=${encodeURIComponent(`/book?workspace=${encodeURIComponent(selectedWorkspaceForAuth.id)}&plan=daily&startDate=${todayDate}&endDate=${todayDate}&startTime=${encodeURIComponent(defaultStartTime)}&endTime=${encodeURIComponent(defaultEndTime)}`)}`}
                className="w-full py-3 px-6 rounded-2xl bg-[#FAF9F5] hover:bg-[#EAE5DC] text-[#181F18] border border-[#E0DCD3] hover:border-[#181F18]/40 font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-[#185ADB]" />
                <span>Create Corporate Account</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setShowAuthModal(false);
                  setSelectedWorkspaceForAuth(null);
                }}
                className="w-full pt-2 text-xs text-[#5C665C] hover:text-[#181F18] font-medium transition-colors cursor-pointer"
              >
                Continue Browsing Halls
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
