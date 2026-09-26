'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Building2,
  Users,
  Layers,
  MapPin,
  CheckCircle2,
  Calendar,
  X,
  Eye,
  Check,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  Video,
  MoveHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

import { useRouter } from 'next/navigation';
import { checkWorkspaceAvailabilityDetailed, getDefaultDates, BookingSlot } from '@/lib/availability';
import { CountdownBadge } from '@/components/ui/CountdownBadge';

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
  bookings?: BookingSlot[];
  maintenanceBlocks?: BookingSlot[];
}

export const PopularPicksSection: React.FC = () => {
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Quick Details Modal State
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);

  // Quick Book Enquiry Modal State
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [bookingWorkspace, setBookingWorkspace] = useState<Workspace | null>(null);
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Drag & Scroll Refs
  const sliderRef = useRef<HTMLDivElement>(null);
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const dragDistanceRef = useRef(0);
  const interactionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch curated top 10 popular picks
  useEffect(() => {
    const fetchPopularPicks = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/popular-picks', { cache: 'no-store' });
        const data = await res.json();
        if (data.success && Array.isArray(data.workspaces)) {
          setWorkspaces(data.workspaces.slice(0, 10));
        }
      } catch (err) {
        console.error('Failed to load popular picks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPicks();
  }, []);

  // Total slides = up to 10 workspaces + 1 "View All" card
  const totalSlides = workspaces.length + 1;

  // Mark user interaction (pauses auto-slide for 4.5s of idle time)
  const markUserInteraction = useCallback(() => {
    setIsUserInteracting(true);
    if (interactionTimerRef.current) {
      clearTimeout(interactionTimerRef.current);
    }
    interactionTimerRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 4500);
  }, []);

  // Precise scroll to a specific card index (guarantees full card alignment)
  const scrollToSlide = useCallback((index: number) => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const clampedIndex = Math.max(0, Math.min(index, totalSlides - 1));
    const cards = container.querySelectorAll<HTMLElement>('[data-slider-card]');

    if (cards[clampedIndex]) {
      const targetLeft = cards[clampedIndex].offsetLeft - container.offsetLeft;
      container.scrollTo({
        left: targetLeft,
        behavior: 'smooth',
      });
    } else {
      const cardWidth = 350;
      container.scrollTo({
        left: clampedIndex * cardWidth,
        behavior: 'smooth',
      });
    }
    setCurrentIndex(clampedIndex);
  }, [totalSlides]);

  // Auto-slide effect every 3.5 seconds - slides exactly 1 card at a time
  useEffect(() => {
    if (loading || isUserInteracting || detailsModalOpen || bookModalOpen || totalSlides <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % totalSlides;
        scrollToSlide(next);
        return next;
      });
    }, 3500);

    return () => clearInterval(timer);
  }, [loading, isUserInteracting, detailsModalOpen, bookModalOpen, totalSlides, scrollToSlide]);

  // Track active slide on scroll for indicator dots
  const handleScroll = () => {
    if (!sliderRef.current || isMouseDownRef.current) return;
    const container = sliderRef.current;
    const cards = container.querySelectorAll<HTMLElement>('[data-slider-card]');
    if (cards.length === 0) return;

    const scrollLeft = container.scrollLeft;
    let closestIndex = 0;
    let minDiff = Infinity;

    cards.forEach((card, i) => {
      const cardLeft = card.offsetLeft - container.offsetLeft;
      const diff = Math.abs(cardLeft - scrollLeft);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    });

    if (closestIndex !== currentIndex) {
      setCurrentIndex(closestIndex);
    }
  };

  // Next Slide Button Handler (1 card at a time)
  const handleNext = () => {
    markUserInteraction();
    const next = (currentIndex + 1) % totalSlides;
    scrollToSlide(next);
  };

  // Prev Slide Button Handler (1 card at a time)
  const handlePrev = () => {
    markUserInteraction();
    const prev = (currentIndex - 1 + totalSlides) % totalSlides;
    scrollToSlide(prev);
  };

  // ==========================================
  // Mouse Drag-to-Slide (Desktop Swiping)
  // ==========================================
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    isMouseDownRef.current = true;
    hasDraggedRef.current = false;
    dragDistanceRef.current = 0;
    startXRef.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeftRef.current = sliderRef.current.scrollLeft;
    setIsDragging(true);
    markUserInteraction();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.35;
    dragDistanceRef.current = Math.abs(walk);

    if (dragDistanceRef.current > 8) {
      hasDraggedRef.current = true;
    }

    sliderRef.current.scrollLeft = scrollLeftRef.current - walk;
    markUserInteraction();
  };

  const handleMouseUpOrLeave = (e: React.MouseEvent) => {
    if (isMouseDownRef.current) {
      isMouseDownRef.current = false;
      setIsDragging(false);

      if (hasDraggedRef.current && sliderRef.current) {
        const deltaX = (e.pageX - sliderRef.current.offsetLeft) - startXRef.current;
        // If dragged more than 35px, advance or retreat cleanly by 1 card
        if (deltaX < -35) {
          const nextIdx = Math.min(currentIndex + 1, totalSlides - 1);
          scrollToSlide(nextIdx);
        } else if (deltaX > 35) {
          const prevIdx = Math.max(currentIndex - 1, 0);
          scrollToSlide(prevIdx);
        } else {
          // Snap back to current card
          scrollToSlide(currentIndex);
        }
      }

      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 120);
    }
  };

  // Open Details Modal safely (prevents drag misfires)
  const openDetails = (ws: Workspace) => {
    if (hasDraggedRef.current || dragDistanceRef.current > 8) return;
    setSelectedWorkspace(ws);
    setDetailsModalOpen(true);
  };

  // Open Book Modal safely (prevents drag misfires)
  const openBookModal = (ws: Workspace) => {
    if (hasDraggedRef.current || dragDistanceRef.current > 8) return;
    setBookingWorkspace(ws);
    setBookingSuccess(false);
    setBookModalOpen(true);
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookModalOpen(false);
      setBookingSuccess(false);
      setBookingName('');
      setBookingEmail('');
      setBookingPhone('');
      setBookingDate('');
    }, 1800);
  };

  return (
    <section
      id="popular-picks"
      className="py-16 sm:py-20 secondary-section-bg relative overflow-hidden border-b border-[#E0DCD3]"
    >
      {/* Ambient Botanical Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#2E7D32]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 -z-10" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#4ADE80]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Title & Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#2E7D32] text-xs font-mono font-bold tracking-wider uppercase mb-2 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>POPULAR WORK SPACES</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181F18] tracking-tight">
              POPULAR PICKS
            </h2>
            <p className="text-sm sm:text-base text-[#5C665C] mt-2 max-w-xl leading-relaxed">
              Explore our highest-rated workspaces, executive team pods, and flexible day passes curated for unmatched productivity.
            </p>
          </div>

          {/* Navigation Controls, Drag Hint & View All Link */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Drag Hint Indicator */}
            <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-mono text-[#6A806A] bg-white px-2.5 py-1 rounded-full border border-[#E0DCD3] select-none shadow-2xs">
              <MoveHorizontal className="w-3 h-3 text-[#2E7D32]" />
              <span>Drag or swipe cards</span>
            </span>

            <Link
              href="/workspaces"
              className="text-xs font-bold text-[#2E7D32] hover:text-[#1E5C23] flex items-center gap-1.5 transition-colors group mr-1"
            >
              <span>Explore All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Prev Arrow */}
            <button
              type="button"
              onClick={handlePrev}
              className="w-11 h-11 rounded-2xl bg-white hover:bg-[#2E7D32] text-[#181F18] hover:text-white border border-[#E0DCD3] hover:border-[#2E7D32] flex items-center justify-center transition-all shadow-sm cursor-pointer active:scale-95"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Next Arrow */}
            <button
              type="button"
              onClick={handleNext}
              className="w-11 h-11 rounded-2xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white flex items-center justify-center transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-95"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Slider Track with Snap Alignment & Drag-to-Slide Support */}
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onTouchStart={markUserInteraction}
          onTouchMove={markUserInteraction}
          className={`flex gap-4 sm:gap-5 overflow-x-auto pb-6 pt-2 scroll-smooth select-none snap-x snap-mandatory ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
            }`}
          style={{
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {loading ? (
            // Skeleton Loading Placeholders
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                data-slider-card
                className="w-[85vw] max-w-[340px] sm:w-[340px] shrink-0 snap-start bg-white rounded-3xl p-4 border border-[#E0DCD3] shadow-sm animate-pulse space-y-4"
              >
                <div className="w-full h-44 bg-gray-200 rounded-2xl" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-4/5" />
                <div className="flex gap-2 pt-2">
                  <div className="h-9 bg-gray-200 rounded-xl flex-1" />
                  <div className="h-9 bg-gray-200 rounded-xl flex-1" />
                </div>
              </div>
            ))
          ) : (
            <>
              {/* Workspace Cards (Top 10) */}
              {workspaces.map((ws, idx) => {
                const firstMedia = ws.mediaUrls?.[0];
                const defaultDates = getDefaultDates();
                const { isAvailable, nextAvailableTimestamp } = checkWorkspaceAvailabilityDetailed(
                  ws.bookings,
                  ws.maintenanceBlocks,
                  defaultDates.startDate,
                  defaultDates.startTime,
                  defaultDates.endDate,
                  defaultDates.endTime
                );

                return (
                  <div
                    key={ws.id}
                    data-slider-card
                    className="w-[85vw] max-w-[340px] sm:w-[340px] shrink-0 snap-start bg-white hover:bg-[#2D3E2D] rounded-3xl border border-[#E0DCD3] hover:border-[#4ADE80]/50 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group font-sans cursor-pointer"
                  >
                    {/* Card Top / Media Section */}
                    <div>
                      {/* Media Image Container with Badges */}
                      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#EAE5DB]">
                        {firstMedia?.type === 'video' ? (
                          <div className="w-full h-full bg-[#181F18] flex items-center justify-center text-white">
                            <Video className="w-8 h-8 text-[#4ADE80]" />
                          </div>
                        ) : (
                          <img
                            src={firstMedia?.url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80'}
                            alt={ws.title}
                            draggable={false}
                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out select-none pointer-events-none"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                        )}

                        {/* Top Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                        {/* Top Left: Category Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[#181F18] text-[11px] font-bold shadow-xs border border-white/40 select-none">
                            <Layers className="w-3 h-3 text-[#2E7D32]" />
                            <span>{ws.categoryName}</span>
                          </span>
                        </div>

                        {/* Top Right: Popular Rank Badge / Booked Badge */}
                        {!isAvailable ? (
                          <div className="absolute top-3 right-3">
                            <CountdownBadge targetTimestamp={nextAvailableTimestamp} className="!text-[10px] !px-2.5 !py-0.5" />
                          </div>
                        ) : (
                          <div className="absolute top-3 right-3">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#2E7D32] text-white text-[10px] font-mono font-bold shadow-sm select-none">
                              #{idx + 1} PICK
                            </span>
                          </div>
                        )}

                        {/* Bottom Bar on Image: Price & Capacity */}
                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs select-none">
                          <span className="font-bold text-sm text-white drop-shadow-md">
                            {ws.price || 'Contact for Quote'}
                          </span>
                          {ws.capacity && (
                            <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-mono text-emerald-300">
                              {ws.capacity}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Content Area - Transforms seamlessly on hover */}
                      <div className="p-4 sm:p-5 space-y-2.5">
                        {/* Title */}
                        <h3 className="font-serif text-lg font-bold text-[#181F18] group-hover:text-white transition-colors leading-snug line-clamp-1">
                          {ws.title}
                        </h3>

                        {/* Short Description (Strictly 2 lines with ...) */}
                        <p className="text-xs text-[#5C665C] group-hover:text-[#D1E0D1] leading-relaxed line-clamp-2 min-h-[34px] transition-colors">
                          {ws.shortDescription}
                        </p>

                        {/* Key Specs Pills */}
                        {Array.isArray(ws.specifications) && ws.specifications.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {ws.specifications.slice(0, 2).map((spec, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-2 py-0.5 rounded-md bg-[#FAF9F5] group-hover:bg-[#1E2B1E] border border-[#E0DCD3] group-hover:border-[#4ADE80]/30 text-[10px] font-mono text-[#263626] group-hover:text-[#E3EBE3] font-medium select-none transition-colors"
                              >
                                {spec.key}: {spec.value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons: Book Now & Details (Enhanced contrast on hover) */}
                    <div className="p-4 sm:p-5 pt-0 grid grid-cols-2 gap-2 border-t border-[#E0DCD3]/60 group-hover:border-white/15 mt-2 transition-colors">
                      <button
                        type="button"
                        disabled={!isAvailable}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isAvailable) return;
                          const targetUrl = `/book?workspace=${encodeURIComponent(ws.id)}&startDate=${defaultDates.startDate}&endDate=${defaultDates.endDate}&startTime=${encodeURIComponent(defaultDates.startTime)}&endTime=${encodeURIComponent(defaultDates.endTime)}`;
                          router.push(targetUrl);
                        }}
                        className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 ${
                          !isAvailable
                            ? 'bg-[#E5E1D8] text-[#8C968C] cursor-not-allowed border border-[#D5D0C5]'
                            : 'bg-[#2E7D32] hover:bg-[#1E5C23] group-hover:bg-[#4ADE80] group-hover:hover:bg-[#3ec46f] text-white group-hover:text-[#0D160E] hover:shadow-md cursor-pointer active:scale-95'
                        }`}
                      >
                        <Calendar className={`w-3.5 h-3.5 transition-colors ${!isAvailable ? '' : 'group-hover:text-[#0D160E]'}`} />
                        <span>{isAvailable ? 'Book Now' : 'Not Available'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/book-space/${ws.id}`);
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-[#FAF9F5] hover:bg-[#EAE5DC] group-hover:bg-white/10 group-hover:hover:bg-white/20 text-[#181F18] group-hover:text-white border border-[#E0DCD3] group-hover:border-white/30 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#2E7D32] group-hover:text-[#4ADE80] transition-colors" />
                        <span>Details</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* 11th Special Card: "View All Workspaces" */}
              <div
                data-slider-card
                className="w-[85vw] max-w-[340px] sm:w-[340px] shrink-0 snap-start bg-gradient-to-br from-[#182319] to-[#0E150F] text-white rounded-3xl border border-[#2E7D32]/50 shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-900/60 border border-emerald-500/30 flex items-center justify-center mb-4 text-[#4ADE80] shadow-[0_0_15px_rgba(74,222,128,0.2)]">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#4ADE80] font-bold block mb-1 select-none">
                    FULL INVENTORY
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white tracking-tight">
                    Discover All Workspaces
                  </h3>
                  <p className="text-xs text-[#A3B0A3] mt-2.5 leading-relaxed">
                    Explore our comprehensive catalogue of 79+ handcrafted centres, enterprise suites, meeting boardrooms, and day passes across India.
                  </p>
                </div>

                <div className="pt-6">
                  <Link
                    href="/workspaces"
                    className="w-full py-3 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#4ADE80] text-white hover:text-[#0E150F] text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 group-hover:scale-102"
                  >
                    <span>View All Workspaces</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Slide Position Dots */}
        {totalSlides > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  markUserInteraction();
                  scrollToSlide(i);
                }}
                className={`h-2 rounded-full transition-all cursor-pointer ${currentIndex === i ? 'w-8 bg-[#2E7D32]' : 'w-2 bg-[#D0C9BE] hover:bg-[#5C665C]'
                  }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: Quick Workspace Details Modal                                      */}
      {/* ========================================================================= */}
      {detailsModalOpen && selectedWorkspace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/65 backdrop-blur-sm animate-fadeIn"
            onClick={() => setDetailsModalOpen(false)}
          />

          <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl border border-[#E0DCD3] shadow-2xl overflow-hidden animate-scaleUp font-sans">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#E0DCD3] bg-[#FAF9F5] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#2E7D32] text-[10px] font-mono font-bold uppercase tracking-wider">
                    {selectedWorkspace.categoryName}
                  </span>
                  {selectedWorkspace.badge && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold">
                      {selectedWorkspace.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#181F18]">
                  {selectedWorkspace.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailsModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Media Preview */}
              <div className="h-52 sm:h-60 rounded-2xl overflow-hidden bg-[#EAE5DB] border border-[#E0DCD3] shadow-sm relative">
                <img
                  src={selectedWorkspace.mediaUrls?.[0]?.url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80'}
                  alt={selectedWorkspace.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-black/70 text-white font-bold text-sm backdrop-blur-xs">
                  {selectedWorkspace.price || 'Contact for Quote'}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase font-mono text-[#6A806A] mb-1">
                  About this Workspace
                </h4>
                <p className="text-xs sm:text-sm text-[#181F18] leading-relaxed">
                  {selectedWorkspace.shortDescription}
                </p>
                {selectedWorkspace.longDescription && (
                  <p className="text-xs text-[#5C665C] mt-2 leading-relaxed whitespace-pre-line">
                    {selectedWorkspace.longDescription}
                  </p>
                )}
              </div>

              {/* Specifications */}
              {Array.isArray(selectedWorkspace.specifications) && selectedWorkspace.specifications.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E0DCD3] space-y-2.5">
                  <span className="text-xs font-bold uppercase font-mono text-[#181F18] block">
                    Property Specifications
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedWorkspace.specifications.map((spec, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E0DCD3] text-xs"
                      >
                        <span className="text-[#6A806A] font-mono">{spec.key}:</span>
                        <span className="font-semibold text-[#181F18]">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-[#E0DCD3] bg-[#FAF9F5] flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDetailsModalOpen(false)}
                className="rounded-xl text-xs"
              >
                Close
              </Button>

              <button
                type="button"
                onClick={() => {
                  setDetailsModalOpen(false);
                  openBookModal(selectedWorkspace);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book This Workspace</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Quick Booking / Enquiry Form Modal                                 */}
      {/* ========================================================================= */}
      {bookModalOpen && bookingWorkspace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/65 backdrop-blur-sm animate-fadeIn"
            onClick={() => setBookModalOpen(false)}
          />

          <div className="relative z-10 w-full max-w-md bg-white rounded-3xl border border-[#E0DCD3] shadow-2xl overflow-hidden animate-scaleUp font-sans">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#E0DCD3] bg-[#FAF9F5] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2E7D32] block">
                  INSTANT TOUR & BOOKING REQUEST
                </span>
                <h3 className="font-serif text-lg font-bold text-[#181F18] mt-0.5">
                  {bookingWorkspace.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBookModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleBookSubmit} className="p-5 space-y-4">
              {bookingSuccess ? (
                <div className="p-6 text-center space-y-2 animate-scaleUp">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#2E7D32] flex items-center justify-center mx-auto shadow-sm">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-base font-bold text-[#181F18]">
                    Booking Request Received!
                  </h4>
                  <p className="text-xs text-[#5C665C]">
                    Our concierge manager will contact you within 15 minutes with complete pass details.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider mb-1">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gautam Sharma"
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E0DCD3] bg-[#FAF9F5] text-xs text-[#181F18] focus:outline-none focus:border-[#2E7D32]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider mb-1">
                      Work Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="gautam@company.com"
                      value={bookingEmail}
                      onChange={(e) => setBookingEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E0DCD3] bg-[#FAF9F5] text-xs text-[#181F18] focus:outline-none focus:border-[#2E7D32]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={bookingPhone}
                        onChange={(e) => setBookingPhone(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E0DCD3] bg-[#FAF9F5] text-xs text-[#181F18] focus:outline-none focus:border-[#2E7D32]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E0DCD3] bg-[#FAF9F5] text-xs text-[#181F18] focus:outline-none focus:border-[#2E7D32]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Booking & Reserve</span>
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
