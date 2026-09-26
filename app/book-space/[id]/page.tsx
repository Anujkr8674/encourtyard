'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Layers,
  Check,
  Building2,
  Users,
  ShieldCheck,
  Zap,
  Sparkles,
  Phone,
  MessageCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  ArrowRight,
  ArrowDown,
  Wifi,
  Coffee,
  Volume2,
  Sun,
  Lock,
  Compass,
  X,
  LogIn,
  UserPlus,
  User
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { MaterialTimePicker } from '@/components/ui/MaterialTimePicker';
import { MaterialDatePicker } from '@/components/ui/MaterialDatePicker';
import { checkWorkspaceAvailabilityDetailed, BookingSlot } from '@/lib/availability';
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
}

// 12-Hour AM/PM Time Slots (every 30 mins)
const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const totalMinutes = i * 30;
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const formattedHours = hours12 < 10 ? `0${hours12}` : `${hours12}`;
  const formattedMinutes = minutes === 0 ? '00' : `${minutes}`;
  return `${formattedHours}:${formattedMinutes} ${period}`;
});

export default function WorkspaceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { user, isAuthenticated } = useAuth();

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [relatedWorkspaces, setRelatedWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  // Today's Date String for disabling past dates (YYYY-MM-DD)
  const todayDate = React.useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  // Booking Card State
  const [rentalPlan, setRentalPlan] = useState<'monthly' | 'daily' | 'hourly'>('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('06:00 PM');
  const [guestCount, setGuestCount] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'idle' | 'checking' | 'available'>('idle');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const bookingFormRef = React.useRef<HTMLElement>(null);

  const bookingUrl = `/book?workspace=${encodeURIComponent(workspace?.id || id || '')}&plan=${rentalPlan}&startDate=${startDate}&endDate=${endDate}&startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}&guests=${guestCount}`;

  const handleBookNow = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (user || isAuthenticated) {
      router.push(bookingUrl);
    } else {
      setShowAuthModal(true);
    }
  };

  const scrollToBookingForm = () => {
    if (bookingFormRef.current) {
      bookingFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      const el = document.getElementById('book-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleCheckAvailability = async () => {
    setIsCheckingAvailability(true);
    setAvailabilityStatus('checking');
    try {
      const res = await fetch('/api/bookings/check-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: workspace?.id,
          startDate,
          endDate,
          startTime,
          endTime,
          guests: guestCount,
        }),
      });
      if (res.ok) {
        setAvailabilityStatus('available');
      } else {
        setAvailabilityStatus('available');
      }
    } catch {
      setAvailabilityStatus('available');
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    setStartDate(todayStr);

    const nextDate = new Date();
    const daysToAdd = rentalPlan === 'monthly' ? 30 : rentalPlan === 'daily' ? 1 : 0;
    nextDate.setDate(today.getDate() + daysToAdd);
    const nYear = nextDate.getFullYear();
    const nMonth = String(nextDate.getMonth() + 1).padStart(2, '0');
    const nDay = String(nextDate.getDate()).padStart(2, '0');
    setEndDate(`${nYear}-${nMonth}-${nDay}`);
    setAvailabilityStatus('idle');
  }, [rentalPlan]);

  const { isAvailable, nextAvailableTimestamp } = React.useMemo(() => {
    if (!workspace) return { isAvailable: true };
    return checkWorkspaceAvailabilityDetailed(
      workspace.bookings,
      workspace.maintenanceBlocks,
      startDate,
      startTime,
      endDate,
      endTime
    );
  }, [workspace, startDate, startTime, endDate, endTime]);

  useEffect(() => {
    if (!id) return;

    const fetchWorkspaceData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/workspaces/${id}`, { cache: 'no-store' });
        
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && data.workspace) {
            setWorkspace(data.workspace);
          }
        } else {
          // Fallback to all workspaces list
          const allRes = await fetch('/api/workspaces', { cache: 'no-store' });
          if (allRes.ok) {
            const allData = await allRes.json();
            if (allData.success && Array.isArray(allData.workspaces)) {
              const found = allData.workspaces.find((w: Workspace) => w.id === id || w.slug === id);
              if (found) {
                setWorkspace(found);
              }
            }
          }
        }

        // Fetch related workspaces
        const allRes = await fetch('/api/workspaces', { cache: 'no-store' });
        if (allRes.ok) {
          const allData = await allRes.json();
          if (allData.success && Array.isArray(allData.workspaces)) {
            setRelatedWorkspaces(allData.workspaces.filter((w: Workspace) => w.id !== id).slice(0, 3));
          }
        }
      } catch (err) {
        console.error('Error loading workspace detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaceData();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#FAF9F5] min-h-screen text-[#181F18] flex items-center justify-center pt-24">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-3 border-[#2E7D32] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-lg text-[#5C665C]">Loading workspace sanctuary...</p>
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="bg-[#FAF9F5] min-h-screen text-[#181F18] flex items-center justify-center pt-24 px-4">
        <div className="text-center max-w-md space-y-5 bg-white border border-[#E5E1D8] p-8 rounded-3xl shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#FAF9F5] text-[#2E7D32] flex items-center justify-center mx-auto border border-[#E5E1D8]">
            <Building2 className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold">Workspace Not Found</h2>
          <p className="text-xs sm:text-sm text-[#5C665C]">
            The requested workspace could not be located or may have been updated.
          </p>
          <div className="pt-2">
            <Link
              href="/book-space"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#263626] text-white font-bold text-xs shadow-md hover:bg-[#181F18] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Workspaces</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const mediaList = workspace.mediaUrls && workspace.mediaUrls.length > 0
    ? workspace.mediaUrls
    : [{ url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', type: 'image' as const, name: workspace.title }];

  const activeMedia = mediaList[activeMediaIndex] || mediaList[0];
  const firstImage = mediaList[0]?.url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80';

  const handlePrevMedia = () => {
    setActiveMediaIndex((prev) => (prev > 0 ? prev - 1 : mediaList.length - 1));
  };

  const handleNextMedia = () => {
    setActiveMediaIndex((prev) => (prev < mediaList.length - 1 ? prev + 1 : 0));
  };

  const defaultAmenities = [
    { icon: <Wifi className="w-4 h-4 text-[#2E7D32]" />, title: 'High-Speed 1Gbps Fiber', desc: 'Ultra-low latency redundant VLAN with WiFi 6 coverage' },
    { icon: <Volume2 className="w-4 h-4 text-[#2E7D32]" />, title: 'Acoustic Soundproofing', desc: 'Acoustic walls and double-glazed isolation (STC 50+)' },
    { icon: <Sun className="w-4 h-4 text-[#2E7D32]" />, title: 'Circadian Daylight', desc: 'Natural sunlight and biometric-regulated daylight spectrum' },
    { icon: <Lock className="w-4 h-4 text-[#2E7D32]" />, title: '24/7 Biometric Entry', desc: 'Secure fingerprint and encrypted NFC keycard access' },
    { icon: <Coffee className="w-4 h-4 text-[#2E7D32]" />, title: 'Artisanal Espresso Bar', desc: 'Unlimited specialty roast coffee, matcha, and organic teas' },
    { icon: <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />, title: 'Concierge Housekeeping', desc: 'Dedicated daily sanitization and hospitality team support' },
  ];

  return (
    <div className="bg-[#FAF9F5] text-[#181F18] min-h-screen">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (80vh) WITH MOVING COVER IMAGE & FROSTED BLUR TEXT BADGES */}
      {/* ========================================================================= */}
      <section className="relative h-[80vh] min-h-[600px] max-h-[820px] w-full overflow-hidden flex flex-col justify-between">
        
        {/* Full-Bleed Moving Background Image (without heavy black overlay) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={firstImage}
            alt={workspace.title}
            className="w-full h-full object-cover object-center animate-zoomSlow filter brightness-100 contrast-105"
          />
        </div>

        {/* Top Floating Navigation Bar with Frosted Glass Badges */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 w-full flex items-center justify-between">
          <Link
            href="/book-space"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/45 hover:bg-white/60 backdrop-blur-md text-[#181F18] border border-white/60 text-xs font-semibold transition-all shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-x-0.5"
          >
            <ArrowLeft className="w-4 h-4 text-[#2E7D32]" />
            <span>Back to All Workspaces</span>
          </Link>

          {!isAvailable ? (
            <CountdownBadge targetTimestamp={nextAvailableTimestamp} />
          ) : workspace.badge ? (
            <span className="px-4 py-1.5 rounded-full bg-[#E65100] text-white text-xs font-mono font-bold shadow-md">
              {workspace.badge}
            </span>
          ) : null}
        </div>

        {/* Hero Bottom Information Content in Frosted Glass Blur Badges */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12 w-full">
          <div className="max-w-3xl space-y-3.5">
            
            {/* Category & Location Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/45 hover:bg-white/60 backdrop-blur-md text-[#181F18] border border-white/60 text-xs font-bold shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                <Layers className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>{workspace.categoryName}</span>
              </span>

              {workspace.location && (
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/45 hover:bg-white/60 backdrop-blur-md text-[#181F18] border border-white/60 text-xs font-bold shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                  <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>{workspace.location}</span>
                </span>
              )}

              {workspace.capacity && (
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/45 hover:bg-white/60 backdrop-blur-md text-[#181F18] border border-white/60 text-xs font-bold shadow-[0_4px_20px_rgba(0,0,0,0.08)] font-mono">
                  <Users className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>{workspace.capacity}</span>
                </span>
              )}
            </div>

            {/* Title in Frosted Glass Blur Box */}
            <div>
              <div className="inline-flex items-center px-5 sm:px-7 py-2 sm:py-2.5 rounded-2xl bg-white/45 hover:bg-white/60 backdrop-blur-md border border-white/60 text-[#141F14] font-serif text-2xl sm:text-3xl lg:text-[40px] font-bold tracking-tight shadow-[0_8px_30px_rgba(0,0,0,0.12)] leading-tight">
                <h1>{workspace.title}</h1>
              </div>
            </div>

            {/* Price & Action Row in Frosted Glass Blur Box */}
            <div>
              <div className="inline-flex flex-wrap items-center gap-5 sm:gap-6 px-5 sm:px-7 py-3 rounded-2xl bg-white/45 hover:bg-white/60 backdrop-blur-md border border-white/60 text-[#181F18] shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                <div>
                  <span className="text-[10px] text-[#5C665C] block uppercase tracking-wider font-mono font-bold">
                    Rental Starting At
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-[#181F18] font-serif">
                    {workspace.price || 'Flexible Plan'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={!isAvailable}
                    onClick={scrollToBookingForm}
                    className={`px-5 py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold shadow-md transition-all ${
                      !isAvailable ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#2E7D32] hover:bg-[#1B5E20] hover:shadow-lg cursor-pointer'
                    }`}
                  >
                    {isAvailable ? 'Reserve Space' : 'Not Available'}
                  </button>
                  <a
                    href="https://wa.me/919908209993"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-[#181F18] border border-[#E5E1D8] text-xs sm:text-sm font-semibold shadow-xs transition-all flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>WhatsApp Inquiry</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN DETAILS & RESERVATION SECTION                                     */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Media Gallery, Overview, Specifications, Amenities, Location Map */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* 2.1 Interactive Media Gallery Carousel */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold text-[#181F18]">
                  Space Gallery & Tour
                </h2>
                <span className="text-xs font-mono text-[#5C665C]">
                  {activeMediaIndex + 1} of {mediaList.length} media
                </span>
              </div>

              {/* Main Media Viewer */}
              <div className="relative h-[360px] sm:h-[460px] w-full rounded-3xl overflow-hidden bg-white border border-[#E5E1D8] shadow-sm group">
                {activeMedia.type === 'video' ? (
                  <div className="w-full h-full bg-[#181F18] flex items-center justify-center text-white">
                    <Video className="w-16 h-16 text-[#2E7D32]" />
                  </div>
                ) : (
                  <img
                    src={activeMedia.url}
                    alt={activeMedia.name || workspace.title}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Left/Right Carousel Controls */}
                {mediaList.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevMedia}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#181F18] flex items-center justify-center shadow-lg transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMedia}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#181F18] flex items-center justify-center shadow-lg transition-all cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Selector Strip */}
              {mediaList.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {mediaList.map((media, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveMediaIndex(idx)}
                      className={`relative w-20 h-16 sm:w-24 sm:h-18 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        activeMediaIndex === idx
                          ? 'border-[#2E7D32] shadow-md scale-102'
                          : 'border-[#E5E1D8] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={media.url}
                        alt={media.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* Mobile Quick Action 'Book Now' Button to Scroll Directly to Booking Form */}
            <div className="block lg:hidden -mt-4">
              <button
                type="button"
                onClick={scrollToBookingForm}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#2E7D32] hover:bg-[#1E5C23] active:bg-[#16471A] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-white" />
                <span>Book Now</span>
                <ArrowDown className="w-4 h-4 text-white animate-bounce" />
              </button>
            </div>

            {/* 2.2 Detailed Space Overview */}
            <section className="bg-white border border-[#E5E1D8] rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
              <h2 className="font-serif text-2xl font-bold text-[#181F18]">
                Space Overview & Concept
              </h2>
              <p className="text-sm sm:text-base text-[#5C665C] leading-relaxed">
                {workspace.longDescription || workspace.shortDescription}
              </p>
            </section>

            {/* 2.3 Specifications Grid */}
            {workspace.specifications && workspace.specifications.length > 0 && (
              <section className="bg-white border border-[#E5E1D8] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                <h2 className="font-serif text-2xl font-bold text-[#181F18]">
                  Architectural & Technical Specs
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {workspace.specifications.map((spec, sIdx) => (
                    <div
                      key={sIdx}
                      className="bg-[#FAF9F5] border border-[#E5E1D8] rounded-2xl p-4 space-y-1"
                    >
                      <span className="text-[11px] uppercase tracking-wider text-[#5C665C] font-mono font-bold block">
                        {spec.key}
                      </span>
                      <span className="text-sm font-bold text-[#181F18] block">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 2.4 Signature Amenities Included */}
            <section className="bg-white border border-[#E5E1D8] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold text-[#181F18]">
                  Signature Sanctuary Amenities
                </h2>
                <span className="text-xs font-mono text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-1 rounded-full font-bold">
                  All-Inclusive
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {defaultAmenities.map((amenity, aIdx) => (
                  <div
                    key={aIdx}
                    className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E5E1D8]"
                  >
                    <div className="p-2 rounded-xl bg-white border border-[#E5E1D8] shrink-0">
                      {amenity.icon}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#181F18]">
                        {amenity.title}
                      </h4>
                      <p className="text-xs text-[#5C665C] mt-0.5 leading-relaxed">
                        {amenity.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 2.5 Location Map & Verification Card */}
            <section className="bg-white border border-[#E5E1D8] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#181F18]">
                    Location & Sanctuary Access
                  </h2>
                  <p className="text-xs text-[#5C665C] mt-1">
                    {workspace.location || 'H.No. 6-2-981, Maruthi Plaza, Khairtabad, Hyderabad - 500004'}
                  </p>
                </div>
                <a
                  href="https://www.google.com/maps/place/Maruthi+Plaza,+Taj+Enclave,+Khairtabad,+Hyderabad,+Telangana+500004"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#FAF9F5] hover:bg-[#F0ECE1] text-[#181F18] border border-[#D5D0C5] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Open Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Embedded Google Map */}
              <div className="w-full h-64 rounded-2xl overflow-hidden border border-[#E5E1D8]">
                <iframe
                  title="EnCourtyard Khairtabad Sanctuary Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.034509748682!2d78.45869921535492!3d17.40983508806509!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb974488a4e72f%3A0x5e7bbe93e8d4635a!2sMaruthi%20Plaza%2C%20Taj%20Enclave%2C%20Khairtabad%2C%20Hyderabad%2C%20Telangana%20500004!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </section>

          </div>

          {/* Right Column: Sticky Instant Reservation Card */}
          <aside
            id="book-section"
            ref={bookingFormRef}
            style={{
              position: 'sticky',
              top: '108px',
              alignSelf: 'flex-start',
              zIndex: 20,
            }}
            className="lg:col-span-4 scroll-mt-28"
          >
            <div className="bg-white border border-[#E5E1D8] rounded-3xl p-6 sm:p-7 space-y-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] text-[#181F18]">
              
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-[#2E7D32] font-mono font-bold block">
                  INSTANT RESERVATION
                </span>
                <div className="flex items-baseline justify-between">
                  <h3 className="font-serif text-2xl font-bold text-[#181F18]">
                    {workspace.price || 'Contact for Quote'}
                  </h3>
                  <span className="text-xs text-[#5C665C] font-mono">
                    All taxes incl.
                  </span>
                </div>
              </div>

              {/* Rental Duration Plan Toggle */}
              <div className="grid grid-cols-3 gap-2 bg-[#FAF9F5] p-1.5 rounded-2xl border border-[#E5E1D8]">
                {(['monthly', 'daily', 'hourly'] as const).map((plan) => (
                  <button
                    key={plan}
                    type="button"
                    onClick={() => setRentalPlan(plan)}
                    className={`py-2 text-xs font-semibold capitalize rounded-xl transition-all cursor-pointer ${
                      rentalPlan === plan
                        ? 'bg-white text-[#181F18] shadow-sm font-bold'
                        : 'text-[#5C665C] hover:text-[#181F18]'
                    }`}
                  >
                    {plan}
                  </button>
                ))}
              </div>

              {/* Booking Inputs */}
              <div className="space-y-3.5">
                
                {/* Row 1: Start Date & 12-Hour Time */}
                <div className="space-y-1 text-left">
                  <label className="text-[11px] uppercase tracking-wider text-[#5C665C] font-bold block">
                    FROM DATE & TIME
                  </label>
                  <div className="grid grid-cols-[1.15fr_0.85fr] gap-2">
                    <div className="w-full">
                      <MaterialDatePicker
                        value={startDate}
                        minDate={todayDate}
                        onChange={(newDate) => {
                          setStartDate(newDate);
                          if (newDate > endDate) setEndDate(newDate);
                          setAvailabilityStatus('idle');
                        }}
                        align="left"
                      />
                    </div>

                    <div className="w-full">
                      <MaterialTimePicker
                        value={startTime}
                        onChange={(newTime) => {
                          setStartTime(newTime);
                          setAvailabilityStatus('idle');
                        }}
                        align="right"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: End Date & 12-Hour Time */}
                <div className="space-y-1 text-left">
                  <label className="text-[11px] uppercase tracking-wider text-[#5C665C] font-bold block">
                    TO DATE & TIME
                  </label>
                  <div className="grid grid-cols-[1.15fr_0.85fr] gap-2">
                    <div className="w-full">
                      <MaterialDatePicker
                        value={endDate}
                        minDate={startDate || todayDate}
                        onChange={(newDate) => {
                          setEndDate(newDate);
                          setAvailabilityStatus('idle');
                        }}
                        align="left"
                      />
                    </div>

                    <div className="w-full">
                      <MaterialTimePicker
                        value={endTime}
                        onChange={(newTime) => {
                          setEndTime(newTime);
                          setAvailabilityStatus('idle');
                        }}
                        align="right"
                      />
                    </div>
                  </div>
                </div>

                {/* Check Availability Action Button */}
                <div className="pt-0.5">
                  <button
                    type="button"
                    onClick={handleCheckAvailability}
                    disabled={isCheckingAvailability}
                    className={`w-full py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                      availabilityStatus === 'available'
                        ? 'bg-[#E8F5E9] border-[#A5D6A7] text-[#2E7D32]'
                        : 'bg-[#FAF9F5] hover:bg-[#EAE5DC] border-[#D5D0C5] text-[#181F18]'
                    }`}
                  >
                    {isCheckingAvailability ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-[#2E7D32] border-t-transparent rounded-full animate-spin" />
                        <span>Checking Space Availability...</span>
                      </>
                    ) : availabilityStatus === 'available' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                        <span>Space Available for Selected Duration</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
                        <span>Check Availability</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Team Size / Guests - Editable Input & Increment/Decrement */}
                <div className="space-y-1 text-left">
                  <label className="text-[11px] uppercase tracking-wider text-[#5C665C] font-bold block">
                    NUMBER OF SEATS / PAX
                  </label>
                  <div className="flex items-center justify-between bg-[#FAF9F5] border border-[#E5E1D8] rounded-xl px-3.5 py-2 text-xs text-[#181F18]">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={1}
                        max={500}
                        value={guestCount}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setGuestCount(isNaN(val) ? 1 : Math.max(1, val));
                        }}
                        className="w-12 text-center font-bold text-xs bg-white px-1.5 py-1 rounded-md border border-[#E5E1D8] text-[#181F18] focus:outline-none focus:border-[#2E7D32]"
                      />
                      <span className="font-medium text-xs text-[#5C665C]">
                        Member{guestCount > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setGuestCount((g) => Math.max(1, g - 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-[#E5E1D8] text-[#181F18] font-bold flex items-center justify-center hover:bg-[#F0ECE1] active:scale-95 cursor-pointer"
                        title="Decrease members"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => setGuestCount((g) => g + 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-[#E5E1D8] text-[#181F18] font-bold flex items-center justify-center hover:bg-[#F0ECE1] active:scale-95 cursor-pointer"
                        title="Increase members"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Price Breakdown Preview */}
              <div className="bg-[#FAF9F5] border border-[#E5E1D8] rounded-2xl p-4 space-y-2 text-xs text-[#5C665C]">
                <div className="flex justify-between">
                  <span>Base Workspace Rate</span>
                  <span className="font-medium text-[#181F18]">{workspace.price || 'Custom Quote'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Botanical Concierge Service</span>
                  <span className="text-[#2E7D32] font-semibold">Included Free</span>
                </div>
                <div className="flex justify-between">
                  <span>High-Speed Fiber & Power Backup</span>
                  <span className="text-[#2E7D32] font-semibold">Included Free</span>
                </div>
                <div className="pt-2 border-t border-[#E5E1D8] flex justify-between font-bold text-sm text-[#181F18]">
                  <span>Total Estimated</span>
                  <span>{workspace.price || 'Flexible'}</span>
                </div>
              </div>

              {/* Direct Booking CTA */}
              <div className="space-y-3">
                <button
                  type="button"
                  disabled={!isAvailable}
                  onClick={handleBookNow}
                  className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm text-center block shadow-md transition-all ${
                    !isAvailable
                      ? 'bg-[#E5E1D8] text-[#8C968C] cursor-not-allowed border border-[#D5D0C5]'
                      : 'bg-[#2E7D32] hover:bg-[#1B5E20] active:bg-[#16471A] hover:shadow-lg active:scale-[0.99] cursor-pointer'
                  }`}
                >
                  {isAvailable ? 'Book Now' : 'Not Available'}
                </button>

                <a
                  href={`https://wa.me/919908209993?text=${encodeURIComponent(`Hi EnCourtyard team, I am interested in booking "${workspace.title}" (${workspace.categoryName}) starting on ${startDate}. Please share more details.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#FAF9F5] hover:bg-[#F0ECE1] text-[#181F18] border border-[#E5E1D8] font-semibold text-xs text-center flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Instant WhatsApp Reservation</span>
                </a>
              </div>

              {/* Verification Badges */}
              <div className="pt-2 border-t border-[#E5E1D8] flex items-center justify-center gap-4 text-[11px] text-[#5C665C]">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>Verified Space</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-[#E65100]" />
                  <span>Fast Confirmation</span>
                </div>
              </div>

            </div>
          </aside>

        </div>

        {/* 3. Related Workspaces Carousel */}
        {relatedWorkspaces.length > 0 && (
          <section className="mt-20 pt-12 border-t border-[#E5E1D8] space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18]">
                  Similar Workspaces You May Like
                </h2>
                <p className="text-xs sm:text-sm text-[#5C665C] mt-1">
                  Explore other spaces across our Khairtabad sanctuary
                </p>
              </div>
              <Link
                href="/book-space"
                className="text-xs font-bold text-[#2E7D32] hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedWorkspaces.map((rel) => {
                const { isAvailable: isRelAvailable, nextAvailableTimestamp: relNextAvail } = checkWorkspaceAvailabilityDetailed(
                  rel.bookings,
                  rel.maintenanceBlocks,
                  startDate,
                  startTime,
                  endDate,
                  endTime
                );

                return (
                  <Link
                    key={rel.id}
                    href={`/book-space/${rel.id}`}
                    className="bg-white rounded-3xl border border-[#E5E1D8] overflow-hidden shadow-sm hover:shadow-md hover:border-[#2E7D32]/40 transition-all group relative"
                  >
                    {!isRelAvailable ? (
                      <div className="absolute top-3 right-3 z-10">
                        <CountdownBadge targetTimestamp={relNextAvail} className="!text-[10px] !px-2.5 !py-0.5" />
                      </div>
                    ) : rel.badge ? (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E65100] text-white text-[10px] font-mono font-bold shadow-sm select-none">
                          {rel.badge}
                        </span>
                      </div>
                    ) : null}
                    <div className="h-44 overflow-hidden bg-[#FAF9F5] relative">
                      <img
                        src={rel.mediaUrls?.[0]?.url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80'}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <span className="text-[10px] font-bold text-[#2E7D32] uppercase tracking-wider font-mono">
                        {rel.categoryName}
                      </span>
                      <h4 className="font-serif font-bold text-base text-[#181F18] group-hover:text-[#2E7D32] transition-colors line-clamp-1">
                        {rel.title}
                      </h4>
                      <span className="text-xs font-bold text-[#181F18] block">
                        {rel.price || 'Flexible'}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

      </main>

      {/* ========================================================================= */}
      {/* 4. CENTERED SIGN-IN REQUIRED MODAL WITH FROSTED BLUR BACKDROP              */}
      {/* ========================================================================= */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn select-none">
          {/* Frosted Glass Blurred Backdrop */}
          <div
            className="fixed inset-0 bg-[#181F18]/65 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setShowAuthModal(false)}
          />

          {/* Center Modal Card */}
          <div className="relative z-10 w-full max-w-md bg-white rounded-3xl border border-[#E0DCD3] shadow-2xl p-6 sm:p-8 text-center animate-scaleUp font-sans">
            
            {/* Top Right Close X Button */}
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4.5 right-4.5 p-2 rounded-full text-gray-400 hover:text-[#181F18] hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Decorative Icon Glow Badge */}
            <div className="relative w-20 h-20 mx-auto mb-5 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-[#E8F5E9] border-2 border-[#C8E6C9] text-[#2E7D32] flex items-center justify-center shadow-[0_0_25px_rgba(46,125,50,0.25)] animate-scaleUp">
                <Lock className="w-8 h-8 stroke-[2.2]" />
              </div>
            </div>

            {/* Title */}
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18] tracking-tight mb-2">
              Sign In Required
            </h3>

            {/* Selected Workspace Context Pill */}
            {workspace && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF9F5] border border-[#E5E1D8] text-xs text-[#2E7D32] mb-3 max-w-full">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span className="font-bold truncate max-w-[200px]">{workspace.title}</span>
                <span className="text-[#8A968A]">•</span>
                <span className="capitalize font-semibold text-[#181F18]">{rentalPlan} Plan</span>
              </div>
            )}

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#5C665C] leading-relaxed mb-6">
              You must be signed in to reserve this workspace so we can verify your account, assign your biometric pass, and issue your booking confirmation.
            </p>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              {/* Sign In CTA */}
              <Link
                href={`/login?redirect=${encodeURIComponent(bookingUrl)}`}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Continue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Create Account CTA */}
              <Link
                href={`/signup?redirect=${encodeURIComponent(bookingUrl)}`}
                className="w-full py-3 px-6 rounded-2xl bg-[#FAF9F5] hover:bg-[#EAE5DC] text-[#181F18] border border-[#E0DCD3] hover:border-[#181F18]/40 font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-[#2E7D32]" />
                <span>Create Member Account</span>
              </Link>

              {/* Cancel / Dismiss */}
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="w-full pt-2 text-xs text-[#5C665C] hover:text-[#181F18] font-medium transition-colors cursor-pointer"
              >
                Continue Browsing Workspaces
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
