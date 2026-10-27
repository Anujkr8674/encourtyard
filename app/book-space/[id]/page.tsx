'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
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
  User,
  Images
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { MaterialTimePicker } from '@/components/ui/MaterialTimePicker';
import { MaterialDatePicker } from '@/components/ui/MaterialDatePicker';
import { checkWorkspaceAvailabilityDetailed, BookingSlot, hasValidPrice, calculateHourlyDuration } from '@/lib/availability';
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

const RevealSection: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = '', delay = 0 }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -50px 0px' }
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const FAQAccordion = ({ workspace }: { workspace: Workspace }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = [
    {
      question: `Are there hidden fees associated with this ${workspace.categoryName}?`,
      answer: `No, the listed pricing is all-inclusive. It covers high-speed internet, premium coffee, electricity, cleaning, and security for ${workspace.title}.`
    },
    {
      question: "How fast is the internet connection?",
      answer: "You will have access to our secure, ultra-low latency 1Gbps Fiber connection, backed up by redundant lines to ensure zero downtime."
    },
    {
      question: `What happens if I need to expand my team size beyond ${workspace.capacity}?`,
      answer: `We offer flexible membership paths! If your team outgrows ${workspace.capacity}, you can easily upgrade to a larger adjacent office or add customized dedicated desks subject to availability.`
    }
  ];

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div key={index} className={`border rounded-xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'border-[#2E7D32]/40 shadow-sm' : 'border-[#E5E1D8] hover:border-[#2E7D32]/40'}`}>
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-4 bg-white hover:bg-[#FAF9F5] transition-colors text-left"
          >
            <h4 className="text-sm font-bold text-[#181F18] pr-4">{faq.question}</h4>
            <div className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-[#2E7D32]' : 'text-[#5C665C]'}`}>
              <ArrowDown className="w-4 h-4" />
            </div>
          </button>
          <div 
            className={`transition-all duration-300 ease-in-out bg-white overflow-hidden ${openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="p-4 pt-0">
              <p className="text-xs text-[#5C665C] leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

function WorkspaceDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const { user, isAuthenticated } = useAuth();

  const queryPlan = searchParams.get('plan');
  const queryStartDate = searchParams.get('startDate');
  const queryEndDate = searchParams.get('endDate');
  const queryStartTime = searchParams.get('startTime');
  const queryEndTime = searchParams.get('endTime');
  const queryGuests = searchParams.get('guests');

  // Load from sessionStorage if available for instant 0ms rendering
  const [workspace, setWorkspace] = useState<Workspace | null>(() => {
    if (typeof window !== 'undefined' && id) {
      try {
        const cached = sessionStorage.getItem(`ws_cache_${id}`);
        if (cached) return JSON.parse(cached);
      } catch (_) {}
    }
    return null;
  });
  const [relatedWorkspaces, setRelatedWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(() => {
    if (typeof window !== 'undefined' && id) {
      try {
        const cached = sessionStorage.getItem(`ws_cache_${id}`);
        if (cached) return false;
      } catch (_) {}
    }
    return true;
  });
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isFullscreenGalleryOpen, setIsFullscreenGalleryOpen] = useState(false);

  // Today's Date String for disabling past dates (YYYY-MM-DD)
  const todayDate = React.useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  // Classify Workspace (Day Pass vs Hourly vs Standard)
  const isDayPassWorkspace = React.useMemo(() => {
    if (queryPlan === 'daily') return true;
    if (!workspace) return false;
    const cat = (workspace.categoryName || '').toLowerCase();
    const title = (workspace.title || '').toLowerCase();
    return (
      Boolean((workspace as any).showInDayPass) ||
      workspace.categoryId === 'ee0ebc73-e2ba-4534-bccb-e228400bd967' ||
      cat.includes('day pass') ||
      title.includes('day pass') ||
      title.includes('hot desk')
    );
  }, [queryPlan, workspace]);

  const isHourlyWorkspace = React.useMemo(() => {
    if (queryPlan === 'hourly') return true;
    if (!workspace) return false;
    if (isDayPassWorkspace) return false;
    const cat = (workspace.categoryName || '').toLowerCase();
    const title = (workspace.title || '').toLowerCase();
    return (
      workspace.categoryId === '1ac79bff-71f9-4924-8091-f07c9ae1ec06' ||
      workspace.categoryId === 'cat-1789845784650' ||
      cat.includes('confr') ||
      cat.includes('conference') ||
      title.includes('confr') ||
      title.includes('conference') ||
      cat.includes('meeting') ||
      title.includes('meeting')
    );
  }, [queryPlan, isDayPassWorkspace, workspace]);

  // Booking Card State
  const [rentalPlan, setRentalPlan] = useState<'monthly' | 'daily' | 'hourly'>(() => {
    if (queryPlan === 'hourly') return 'hourly';
    if (queryPlan === 'daily') return 'daily';
    return 'monthly';
  });
  const [startDate, setStartDate] = useState(queryStartDate || '');
  const [endDate, setEndDate] = useState(queryEndDate || queryStartDate || '');
  const [startTime, setStartTime] = useState(queryStartTime || '09:00 AM');
  const [endTime, setEndTime] = useState(queryEndTime || '06:00 PM');
  const [guestCount, setGuestCount] = useState(() => {
    const parsed = queryGuests ? parseInt(queryGuests, 10) : 1;
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'idle' | 'checking' | 'available'>('idle');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const bookingFormRef = React.useRef<HTMLElement>(null);

  // Dynamic duration calculation for hourly reservations
  const hourlyDuration = React.useMemo(() => {
    return calculateHourlyDuration(startTime, endTime);
  }, [startTime, endTime]);

  const numericPrice = React.useMemo(() => {
    if (!workspace?.price) return 0;
    const clean = String(workspace.price).replace(/[^0-9.]/g, '');
    return parseFloat(clean) || 0;
  }, [workspace?.price]);

  const hourlyCalculatedTotal = React.useMemo(() => {
    if (!numericPrice || !isHourlyWorkspace) return 0;
    return Math.round((numericPrice * hourlyDuration.totalMinutes) / 60);
  }, [numericPrice, isHourlyWorkspace, hourlyDuration.totalMinutes]);

  // Sync rentalPlan and single-day constraints when workspace type or plan is detected
  useEffect(() => {
    if (isHourlyWorkspace) {
      setRentalPlan('hourly');
    } else if (isDayPassWorkspace) {
      setRentalPlan('daily');
    } else if (queryPlan === 'daily' || queryPlan === 'hourly' || queryPlan === 'monthly') {
      setRentalPlan(queryPlan);
    }
  }, [isHourlyWorkspace, isDayPassWorkspace, queryPlan]);

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    const currentStart = queryStartDate || startDate || todayStr;
    if (!startDate) setStartDate(currentStart);

    if (isHourlyWorkspace || isDayPassWorkspace || rentalPlan === 'daily' || rentalPlan === 'hourly') {
      // Day Pass and Hourly must strictly be a single date
      setEndDate(currentStart);
    } else {
      if (queryEndDate) {
        setEndDate(queryEndDate);
      } else if (!endDate || endDate === currentStart) {
        const nextDate = new Date(currentStart);
        nextDate.setDate(nextDate.getDate() + 30);
        const nYear = nextDate.getFullYear();
        const nMonth = String(nextDate.getMonth() + 1).padStart(2, '0');
        const nDay = String(nextDate.getDate()).padStart(2, '0');
        setEndDate(`${nYear}-${nMonth}-${nDay}`);
      }
    }
    setAvailabilityStatus('idle');
  }, [rentalPlan, isHourlyWorkspace, isDayPassWorkspace]);

  const effectivePlan = isHourlyWorkspace ? 'hourly' : isDayPassWorkspace ? 'daily' : rentalPlan;
  const effectiveEndDate = (isHourlyWorkspace || isDayPassWorkspace) ? startDate : endDate;

  const bookingUrl = `/book?workspace=${encodeURIComponent(workspace?.id || id || '')}&plan=${effectivePlan}&startDate=${startDate}&endDate=${effectiveEndDate}&startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}&guests=${guestCount}`;

  const handleBookNow = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (workspace) {
      try {
        sessionStorage.setItem(`ws_cache_${workspace.id}`, JSON.stringify(workspace));
      } catch (_) {}
    }
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
          endDate: (isHourlyWorkspace || isDayPassWorkspace) ? startDate : endDate,
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

  const { isAvailable, nextAvailableTimestamp } = React.useMemo(() => {
    if (!workspace) return { isAvailable: true };
    return checkWorkspaceAvailabilityDetailed(
      workspace.bookings,
      workspace.maintenanceBlocks,
      startDate,
      startTime,
      (isHourlyWorkspace || isDayPassWorkspace) ? startDate : endDate,
      endTime
    );
  }, [workspace, startDate, startTime, endDate, endTime, isHourlyWorkspace, isDayPassWorkspace]);

  useEffect(() => {
    if (!id) return;

    const fetchWorkspaceData = async () => {
      try {
        setLoading(true);
        let currentWs: Workspace | null = null;
        const res = await fetch(`/api/workspaces/${id}`, { cache: 'no-store' });
        
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && data.workspace) {
            currentWs = data.workspace;
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
                currentWs = found;
                setWorkspace(found);
              }
            }
          }
        }

        // Fetch related workspaces ONLY from the SAME category from database
        if (currentWs) {
          const allRes = await fetch('/api/workspaces', { cache: 'no-store' });
          if (allRes.ok) {
            const allData = await allRes.json();
            if (allData.success && Array.isArray(allData.workspaces)) {
              const targetCategoryId = currentWs.categoryId ? String(currentWs.categoryId).trim().toLowerCase() : '';
              const targetCategoryName = currentWs.categoryName ? String(currentWs.categoryName).trim().toLowerCase() : '';

              const sameCategoryWorkspaces = allData.workspaces.filter((w: Workspace) => {
                // Exclude the current workspace itself
                if (w.id === currentWs?.id || (w.slug && w.slug === currentWs?.slug)) {
                  return false;
                }
                // Exclude inactive workspaces
                if (w.isActive === false) {
                  return false;
                }
                // Must have the exact same category
                const matchesId = Boolean(targetCategoryId && w.categoryId && String(w.categoryId).trim().toLowerCase() === targetCategoryId);
                const matchesName = Boolean(targetCategoryName && w.categoryName && String(w.categoryName).trim().toLowerCase() === targetCategoryName);

                return matchesId || matchesName;
              });

              // If other offices exist in this same category, show up to 3. If none (single office in category), hide section with empty array.
              setRelatedWorkspaces(sameCategoryWorkspaces.slice(0, 3));
            } else {
              setRelatedWorkspaces([]);
            }
          } else {
            setRelatedWorkspaces([]);
          }
        } else {
          setRelatedWorkspaces([]);
        }
      } catch (err) {
        console.error('Error loading workspace detail:', err);
        setRelatedWorkspaces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaceData();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen text-[#181F18] flex items-center justify-center pt-24">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-3 border-[#2E7D32] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-lg text-[#5C665C]">Loading workspace sanctuary...</p>
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="bg-white min-h-screen text-[#181F18] flex items-center justify-center pt-24 px-4">
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

  const rawCategory = workspace.categoryName || 'Workspace';
  const cleanCategoryName = rawCategory.replace(/confre?ence/gi, 'Conference');

  return (
    <div className="bg-white text-[#181F18] min-h-screen">
      
      {/* ========================================================================= */}
      {/* MAIN DETAILS & RESERVATION SECTION                                        */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-24 sm:pt-28 lg:pt-36">
        
        {/* ========================================================================= */}
        {/* 2-COLUMN MAIN CONTENT & RESERVATION SECTION                               */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Media Gallery, Title, Overview, Specifications, Amenities, Location Map */}
          <div className="lg:col-span-8 space-y-8 sm:space-y-10">
            
            {/* 2.1 Interactive Media Gallery */}
            <section className="space-y-4">
              {mediaList.length > 1 ? (
                <>
                  {/* Desktop / Tablet: 3-Image Collage (1 Large on Left, 2 Stacked Up/Down on Right with View All Photos button) */}
                  <div className="hidden md:grid md:grid-cols-12 gap-3 h-[380px] sm:h-[420px] lg:h-[460px] w-full">
                    {/* Left Large Image */}
                    <div
                      onClick={() => {
                        setActiveMediaIndex(0);
                        setIsFullscreenGalleryOpen(true);
                      }}
                      className="md:col-span-8 relative rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-100 border border-[#E5E1D8] shadow-xs group cursor-pointer"
                    >
                      {mediaList[0].type === 'video' ? (
                        <div className="w-full h-full bg-[#181F18] flex items-center justify-center text-white">
                          <Video className="w-16 h-16 text-[#2E7D32]" />
                        </div>
                      ) : (
                        <img
                          src={mediaList[0].url}
                          alt={mediaList[0].name || workspace.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                    </div>

                    {/* Right Stacked 2 Images */}
                    <div className="md:col-span-4 grid grid-rows-2 gap-3 h-full">
                      {/* Top Right Image */}
                      <div
                        onClick={() => {
                          setActiveMediaIndex(1);
                          setIsFullscreenGalleryOpen(true);
                        }}
                        className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-100 border border-[#E5E1D8] shadow-xs group cursor-pointer"
                      >
                        {mediaList[1]?.type === 'video' ? (
                          <div className="w-full h-full bg-[#181F18] flex items-center justify-center text-white">
                            <Video className="w-10 h-10 text-[#2E7D32]" />
                          </div>
                        ) : (
                          <img
                            src={mediaList[1]?.url || mediaList[0].url}
                            alt={mediaList[1]?.name || workspace.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                      </div>

                      {/* Bottom Right Image with 'View all photos' button */}
                      <div
                        onClick={() => {
                          setActiveMediaIndex(mediaList.length > 2 ? 2 : 1);
                          setIsFullscreenGalleryOpen(true);
                        }}
                        className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-100 border border-[#E5E1D8] shadow-xs group cursor-pointer"
                      >
                        {mediaList[2]?.type === 'video' ? (
                          <div className="w-full h-full bg-[#181F18] flex items-center justify-center text-white">
                            <Video className="w-10 h-10 text-[#2E7D32]" />
                          </div>
                        ) : (
                          <img
                            src={mediaList[2]?.url || mediaList[1]?.url || mediaList[0].url}
                            alt={mediaList[2]?.name || workspace.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />

                        {/* Floating "View all photos" button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsFullscreenGalleryOpen(true);
                          }}
                          className="absolute bottom-3 right-3 sm:bottom-3.5 sm:right-3.5 z-10 inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white/95 hover:bg-white text-[#181F18] border border-black/10 shadow-md text-xs sm:text-sm font-semibold backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                        >
                          <Images className="w-4 h-4 text-[#181F18]" />
                          <span>View all photos</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Single Image Carousel with Prev/Next and View all button */}
                  <div className="block md:hidden relative h-[300px] sm:h-[360px] w-full rounded-2xl overflow-hidden bg-white border border-[#E5E1D8] shadow-sm group">
                    <img
                      src={mediaList[activeMediaIndex]?.url || mediaList[0].url}
                      alt={mediaList[activeMediaIndex]?.name || workspace.title}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setIsFullscreenGalleryOpen(true)}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevMedia();
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-[#181F18] flex items-center justify-center shadow-md cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextMedia();
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-[#181F18] flex items-center justify-center shadow-md cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFullscreenGalleryOpen(true);
                      }}
                      className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/95 text-[#181F18] border border-black/10 shadow-sm text-xs font-semibold backdrop-blur-md cursor-pointer"
                    >
                      <Images className="w-3.5 h-3.5" />
                      <span>View all</span>
                    </button>
                  </div>
                </>
              ) : (
                /* Single Image View: Exactly matching current single image display with no counter/fullscreen bar above */
                <div
                  onClick={() => setIsFullscreenGalleryOpen(true)}
                  className="relative h-[340px] sm:h-[420px] lg:h-[460px] w-full rounded-3xl overflow-hidden bg-white border border-[#E5E1D8] shadow-sm group cursor-pointer"
                >
                  {activeMedia.type === 'video' ? (
                    <div className="w-full h-full bg-[#181F18] flex items-center justify-center text-white">
                      <Video className="w-16 h-16 text-[#2E7D32]" />
                    </div>
                  ) : (
                    <img
                      src={activeMedia.url}
                      alt={activeMedia.name || workspace.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                </div>
              )}
            </section>

            {/* Workspace Title & Category below the Image (as requested in user diagram) */}
            <div className="pt-1 pb-1 space-y-2.5">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Category Pill Tag */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF3EB] text-[#1E5C23] border border-[#2E7D32]/30 text-xs font-bold font-mono">
                  <Layers className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>{cleanCategoryName}</span>
                </span>

                {/* Location Badge */}
                {workspace.location && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F5] text-[#3D473D] border border-[#DDD7CA] text-xs font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
                    <span>{workspace.location}</span>
                  </span>
                )}

                {/* Capacity Badge */}
                {workspace.capacity && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F5] text-[#3D473D] border border-[#DDD7CA] text-xs font-medium font-mono">
                    <Users className="w-3.5 h-3.5 text-[#2E7D32]" />
                    <span>{workspace.capacity}</span>
                  </span>
                )}

                {/* Availability / Status Indicator */}
                {!isAvailable ? (
                  <CountdownBadge targetTimestamp={nextAvailableTimestamp} />
                ) : workspace.badge ? (
                  <span className="px-3 py-1 rounded-full bg-[#E65100]/10 text-[#E65100] border border-[#E65100]/30 text-xs font-mono font-bold">
                    {workspace.badge}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF3EB] text-[#2E7D32] border border-[#2E7D32]/25 text-xs font-bold font-mono">
                    <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" />
                    Available for Reservation
                  </span>
                )}
              </div>

              {/* Workspace Title */}
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#181F18] tracking-tight leading-tight">
                {workspace.title}
              </h1>
            </div>

            {/* Mobile Quick Action 'Book Now' Button to Scroll Directly to Booking Form */}
            <div className="block lg:hidden pt-1">
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
            <RevealSection delay={100}>
            <section className="bg-white border border-[#E5E1D8] rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#2E7D32]/40 transition-all duration-300 group">
              <h2 className="font-serif text-2xl font-bold text-[#181F18]">
                Space Overview & Concept
              </h2>
              {/* <p className="text-sm sm:text-base text-[#5C665C] leading-relaxed">
                {workspace.longDescription || workspace.shortDescription}
              </p> */}
              <p className="text-sm sm:text-base text-[#5C665C] leading-relaxed">
                {workspace.shortDescription}
                <br />
                {workspace.longDescription}
              </p>
            </section>
            </RevealSection>

            {/* 2.3 Specifications Grid */}
            <RevealSection delay={200}>
            {workspace.specifications && workspace.specifications.length > 0 && (
              <section className="bg-white border border-[#E5E1D8] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#2E7D32]/40 transition-all duration-300 group">
                <h2 className="font-serif text-2xl font-bold text-[#181F18]">
                  Architectural & Technical Specs
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {workspace.specifications.map((spec, sIdx) => (
                    <div
                      key={sIdx}
                      className="bg-[#FAF9F5] border border-[#E5E1D8] rounded-2xl p-4 space-y-1 hover:border-[#2E7D32]/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
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
            </RevealSection>

            {/* 2.4 Signature Amenities Included */}
            <RevealSection delay={300}>
            <section className="bg-white border border-[#E5E1D8] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#2E7D32]/40 transition-all duration-300 group">
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
                    className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E5E1D8] hover:border-[#2E7D32]/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
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
            </RevealSection>

            {/* 2.5 Location Map & Verification Card */}
            <RevealSection delay={400}>
            <section className="bg-white border border-[#E5E1D8] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#2E7D32]/40 transition-all duration-300 group">
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
            </RevealSection>

            {/* 2.6 Rental Terms */}
            <RevealSection delay={100}>
              <section className="bg-white border border-[#E5E1D8] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#2E7D32]/40 transition-all duration-300 group">
                <h2 className="font-serif text-2xl font-bold text-[#181F18]">
                  Rental Terms for {workspace.title}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#FAF9F5] border border-[#E5E1D8] rounded-2xl p-4 space-y-1.5 hover:border-[#2E7D32]/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                    <h4 className="text-sm font-bold text-[#181F18]">Access & Usage</h4>
                    <p className="text-xs text-[#5C665C] leading-relaxed">
                      Enjoy secure 24/7 access to your {workspace.categoryName} space. Includes complimentary utilities, high-speed fiber, and premium coffee setup.
                    </p>
                  </div>
                  <div className="bg-[#FAF9F5] border border-[#E5E1D8] rounded-2xl p-4 space-y-1.5 hover:border-[#2E7D32]/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                    <h4 className="text-sm font-bold text-[#181F18]">Booking Commitment</h4>
                    <p className="text-xs text-[#5C665C] leading-relaxed">
                      Instant reservation allows for immediate move-in. Flexible cancellation terms apply up to 7 days before your scheduled start date.
                    </p>
                  </div>
                  <div className="bg-[#FAF9F5] border border-[#E5E1D8] rounded-2xl p-4 space-y-1.5 hover:border-[#2E7D32]/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                    <h4 className="text-sm font-bold text-[#181F18]">Guest Policy</h4>
                    <p className="text-xs text-[#5C665C] leading-relaxed">
                      Your space accommodates up to {workspace.capacity || 'the assigned capacity'} people. You may host short-term meetings in designated common areas.
                    </p>
                  </div>
                  <div className="bg-[#FAF9F5] border border-[#E5E1D8] rounded-2xl p-4 space-y-1.5 hover:border-[#2E7D32]/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                    <h4 className="text-sm font-bold text-[#181F18]">Maintenance & Upkeep</h4>
                    <p className="text-xs text-[#5C665C] leading-relaxed">
                      Daily professional cleaning and IT support are included to ensure your workspace remains pristine and fully functional.
                    </p>
                  </div>
                </div>
              </section>
            </RevealSection>

            {/* 2.7 FAQs */}
            <RevealSection delay={200}>
              <section className="bg-white border border-[#E5E1D8] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#2E7D32]/40 transition-all duration-300 group">
                <h2 className="font-serif text-2xl font-bold text-[#181F18]">
                  Frequently Asked Questions
                </h2>
                <FAQAccordion workspace={workspace} />
              </section>
            </RevealSection>

          </div>

          {/* Right Column: Instant Reservation Card (Sticky only on desktop lg+) */}
          <aside
            id="book-section"
            ref={bookingFormRef}
            className="lg:col-span-4 scroll-mt-36 lg:sticky lg:top-36 lg:self-start lg:z-20"
          >
            <div className="bg-white border border-[#E5E1D8] rounded-3xl p-6 sm:p-7 space-y-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] text-[#181F18]">
              
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-[#2E7D32] font-mono font-bold block">
                  INSTANT RESERVATION
                </span>
                {hasValidPrice(workspace.price) && (
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-2xl font-bold text-[#181F18]">
                      {workspace.price}
                    </h3>
                    <span className="text-xs text-[#5C665C] font-mono">
                      All taxes incl.
                    </span>
                  </div>
                )}
              </div>

              {/* Rental Duration Plan Toggle - COMMENTED OUT AS PER USER REQUEST
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
              */}

              {/* Booking Inputs */}
              <div className="space-y-3.5">
                
                {isDayPassWorkspace ? (
                  /* Day Pass: Single Date Selection & Access Hours */
                  <>
                    <div className="space-y-1 text-left">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] uppercase tracking-wider text-[#5C665C] font-bold block">
                          DATE (SINGLE DAY ACCESS)
                        </label>
                        <span className="text-[10px] font-mono text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full font-bold">
                          1 Day Only
                        </span>
                      </div>
                      <MaterialDatePicker
                        value={startDate}
                        minDate={todayDate}
                        onChange={(newDate) => {
                          setStartDate(newDate);
                          setEndDate(newDate);
                          setAvailabilityStatus('idle');
                        }}
                        align="left"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[11px] uppercase tracking-wider text-[#5C665C] font-bold block">
                        ACCESS HOURS
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-[#5C665C] font-medium block">Check-in</span>
                          <MaterialTimePicker
                            value={startTime}
                            onChange={(newTime) => {
                              setStartTime(newTime);
                              setAvailabilityStatus('idle');
                            }}
                            align="left"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-[#5C665C] font-medium block">Check-out</span>
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
                  </>
                ) : isHourlyWorkspace ? (
                  /* Hourly: Conference Hall / Meeting Rooms Single Date & Event Hours */
                  <>
                    <div className="space-y-1 text-left">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] uppercase tracking-wider text-[#5C665C] font-bold block">
                          EVENT / MEETING DATE
                        </label>
                        <span className="text-[10px] font-mono text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full font-bold">
                          Hourly Slot
                        </span>
                      </div>
                      <MaterialDatePicker
                        value={startDate}
                        minDate={todayDate}
                        onChange={(newDate) => {
                          setStartDate(newDate);
                          setEndDate(newDate);
                          setAvailabilityStatus('idle');
                        }}
                        align="left"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[11px] uppercase tracking-wider text-[#5C665C] font-bold block">
                        EVENT HOURS
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-[#5C665C] font-medium block">Start Time</span>
                          <MaterialTimePicker
                            value={startTime}
                            onChange={(newTime) => {
                              setStartTime(newTime);
                              setAvailabilityStatus('idle');
                            }}
                            align="left"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-[#5C665C] font-medium block">End Time</span>
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

                      {/* Calculated Total Duration Display */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#E5E1D8] text-[11px] mt-1.5">
                        <span className="text-[#5C665C] font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#2E7D32]" />
                          <span>Calculated Duration:</span>
                        </span>
                        <span className="font-bold text-[#1B5E20] font-mono bg-[#E8F5E9] px-2 py-0.5 rounded-md border border-[#C8E6C9]">
                          {hourlyDuration.formatted}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Standard Multi-Day Mode: From Date/Time & To Date/Time */
                  <>
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
                  </>
                )}

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

              {/* Price Breakdown Preview - Completely hidden if workspace price is optional / not set */}
              {hasValidPrice(workspace.price) && (
                <div style={{ fontFamily: 'Tahoma, sans-serif' }} className="bg-[#FAF9F5] border border-[#E5E1D8] rounded-2xl p-4 space-y-2 text-xs text-[#5C665C]">
                  {isHourlyWorkspace ? (
                    <>
                      <div className="flex justify-between items-center pb-1.5 border-b border-[#E5E1D8]">
                        <span className="font-semibold text-[#181F18]">Hourly Rate (1 hr):</span>
                        <span className="font-bold text-[#181F18]">₹ {numericPrice.toLocaleString('en-IN')} / hr</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#E8F5E9] px-2 py-1 rounded-lg border border-[#C8E6C9]">
                        <span className="font-semibold text-[#1B5E20]">Selected Duration:</span>
                        <span className="font-bold font-mono text-[#1B5E20]">{hourlyDuration.formatted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Base Rate ({hourlyDuration.formatted}):</span>
                        <span className="font-semibold text-[#181F18]">₹ {hourlyCalculatedTotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Botanical Concierge Service:</span>
                        <span className="text-[#2E7D32] font-semibold">Included Free</span>
                      </div>
                      <div style={{ fontFamily: 'Tahoma, sans-serif' }} className="pt-2 border-t border-[#E5E1D8] flex justify-between font-bold text-sm text-[#181F18]">
                        <span>Total Estimated:</span>
                        <span className="text-base text-[#2E7D32] font-bold">₹ {hourlyCalculatedTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span>Base Workspace Rate:</span>
                        <span className="font-medium text-[#181F18]">{workspace.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Botanical Concierge Service:</span>
                        <span className="text-[#2E7D32] font-semibold">Included Free</span>
                      </div>
                      <div className="flex justify-between">
                        <span>High-Speed Fiber & Power Backup:</span>
                        <span className="text-[#2E7D32] font-semibold">Included Free</span>
                      </div>
                      <div style={{ fontFamily: 'Tahoma, sans-serif' }} className="pt-2 border-t border-[#E5E1D8] flex justify-between font-bold text-sm text-[#181F18]">
                        <span>Total Estimated:</span>
                        <span className="text-base text-[#2E7D32] font-bold">{workspace.price}</span>
                      </div>
                    </>
                  )}
                </div>
              )}

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
                    onClick={() => {
                      try {
                        sessionStorage.setItem(`ws_cache_${rel.id}`, JSON.stringify(rel));
                      } catch (_) {}
                    }}
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
                      {rel.mediaUrls?.[0]?.url ? (
                        <img
                          src={rel.mediaUrls[0].url}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#FAF9F5] text-[#2E7D32]/40">
                          <Building2 className="w-10 h-10" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <span className="text-[10px] font-bold text-[#2E7D32] uppercase tracking-wider font-mono">
                        {rel.categoryName}
                      </span>
                      <h4 className="font-serif font-bold text-base text-[#181F18] group-hover:text-[#2E7D32] transition-colors line-clamp-1">
                        {rel.title}
                      </h4>
                      {hasValidPrice(rel.price) && (
                        <span className="text-xs font-bold text-[#181F18] block">
                          {rel.price}
                        </span>
                      )}
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

      {/* ========================================================================= */}
      {/* 5. FULL SCREEN IMAGE GALLERY MODAL                                         */}
      {/* ========================================================================= */}
      {isFullscreenGalleryOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fadeIn">
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setIsFullscreenGalleryOpen(false)}
            className="absolute top-6 right-6 z-[110] p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left Arrow */}
          {mediaList.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handlePrevMedia(); }}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-[110] p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Main Fullscreen Image */}
          <div 
            className="w-full h-full p-4 sm:p-12 flex items-center justify-center"
            onClick={() => setIsFullscreenGalleryOpen(false)} // Close when clicking backdrop
          >
            {activeMedia.type === 'video' ? (
              <div 
                className="w-full max-w-5xl aspect-video bg-[#181F18] flex items-center justify-center text-white rounded-2xl cursor-default"
                onClick={(e) => e.stopPropagation()}
              >
                <Video className="w-24 h-24 text-[#2E7D32]" />
              </div>
            ) : (
              <img
                src={activeMedia.url}
                alt={activeMedia.name || workspace.title}
                className="max-w-full max-h-full object-contain rounded-xl cursor-default"
                onClick={(e) => e.stopPropagation()} // Prevent close when clicking image
              />
            )}
          </div>

          {/* Right Arrow */}
          {mediaList.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleNextMedia(); }}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-[110] p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[110] px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-mono tracking-wider">
            {activeMediaIndex + 1} / {mediaList.length}
          </div>
        </div>
      )}

    </div>
  );
}

export default function WorkspaceDetailsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="bg-white min-h-screen text-[#181F18] flex items-center justify-center pt-24">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-3 border-[#2E7D32] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-serif text-lg text-[#5C665C]">Loading workspace sanctuary...</p>
          </div>
        </div>
      }
    >
      <WorkspaceDetailsContent />
    </React.Suspense>
  );
}
