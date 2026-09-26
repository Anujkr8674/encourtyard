'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Layers,
  ArrowRight,
  SlidersHorizontal,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Video,
  Building2,
  Users,
  ShieldCheck,
  Zap,
  DollarSign,
  Compass,
  Coffee,
  Wifi,
  Volume2,
  X,
  Lock,
  LogIn,
  UserPlus,
  User
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { MaterialTimePicker } from '@/components/ui/MaterialTimePicker';
import { MaterialDatePicker } from '@/components/ui/MaterialDatePicker';
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
  bookings?: { startDate: string, endDate: string, startTime: string, endTime: string }[];
  maintenanceBlocks?: { startDate: string, endDate: string, startTime: string, endTime: string }[];
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
  
  if (modifier.toUpperCase() === 'PM' && hours < 12) {
    hours += 12;
  }
  if (modifier.toUpperCase() === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return new Date(year, month - 1, day, hours, mins).getTime();
}

function checkWorkspaceAvailability(
  workspace: Workspace,
  userStartDate: string,
  userStartTime: string,
  userEndDate: string,
  userEndTime: string
): { isAvailable: boolean, nextAvailableTimestamp?: number } {
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
      if (bEnd > maxEndTime) {
        maxEndTime = bEnd;
      }
    }
  }
  
  if (!isAvail) {
     return { isAvailable: false, nextAvailableTimestamp: maxEndTime };
  }
  return { isAvailable: true };
}

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

// 8 rows of 2 cards each = 16 cards per page before showing pagination buttons
const ITEMS_PER_PAGE = 16;

// Line-by-line typewriter animation hook
function useLineTypewriter(lines: string[], speed: number = 32) {
  const [typedLines, setTypedLines] = useState<string[]>(['', '', '']);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setTypedLines(['', '', '']);
    setCurrentLineIndex(0);
    setIsTyping(true);

    let lineIdx = 0;
    let charIdx = 0;
    const current = ['', '', ''];

    const timer = setInterval(() => {
      if (lineIdx < lines.length) {
        const targetLine = lines[lineIdx];
        if (charIdx <= targetLine.length) {
          current[lineIdx] = targetLine.slice(0, charIdx);
          setTypedLines([...current]);
          setCurrentLineIndex(lineIdx);
          charIdx++;
        } else {
          lineIdx++;
          charIdx = 0;
        }
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [lines, speed]);

  return { typedLines, currentLineIndex, isTyping };
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

export default function BookSpacePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedWorkspaceForAuth, setSelectedWorkspaceForAuth] = useState<Workspace | null>(null);

  // Today's Date String for disabling past dates (YYYY-MM-DD)
  const todayDate = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('09:00 AM');
  const [endDate, setEndDate] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('06:00 PM');
  const [maxPrice, setMaxPrice] = useState<number>(200000);
  const [selectedCapacity, setSelectedCapacity] = useState<string>('all');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'capacity-desc'>('recommended');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Typewriter lines
  const typewriterLines = useMemo(
    () => ['Find Your Ideal', 'Coworking Space,', 'Handcrafted For Focus'],
    []
  );
  const { typedLines, currentLineIndex, isTyping } = useLineTypewriter(typewriterLines, 30);

  // Default dates initialization (Today & Next Month)
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30);
    const nmYear = nextMonth.getFullYear();
    const nmMonth = String(nextMonth.getMonth() + 1).padStart(2, '0');
    const nmDay = String(nextMonth.getDate()).padStart(2, '0');
    const nextMonthStr = `${nmYear}-${nmMonth}-${nmDay}`;

    setStartDate(todayStr);
    setEndDate(nextMonthStr);
  }, []);

  // Fetch workspaces and categories from API with defensive fallback handling
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [wsRes, catRes] = await Promise.all([
          fetch('/api/workspaces', { cache: 'no-store' }),
          fetch('/api/categories', { cache: 'no-store' })
        ]);

        if (wsRes.ok) {
          const wsData = await wsRes.json();
          if (wsData && wsData.success && Array.isArray(wsData.workspaces)) {
            setWorkspaces(wsData.workspaces);
          }
        }

        if (catRes.ok) {
          const catData = await catRes.json();
          if (catData && catData.success && Array.isArray(catData.categories)) {
            setCategories(catData.categories);
          }
        }
      } catch (err) {
        console.error('Error fetching book space data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Parse price numeric value from string (e.g., "₹42,000 / month" -> 42000)
  const extractNumericPrice = (priceStr?: string | null): number => {
    if (!priceStr) return 0;
    const clean = priceStr.replace(/[^0-9]/g, '');
    return clean ? parseInt(clean, 10) : 0;
  };

  // Parse capacity number (e.g. "4 – 8 Pax" -> 8, "10 max" -> 10)
  const extractNumericCapacity = (capStr?: string | null): number => {
    if (!capStr) return 1;
    const matches = capStr.match(/\d+/g);
    if (!matches || matches.length === 0) return 1;
    return parseInt(matches[matches.length - 1], 10);
  };

  // Filter & Sort Logic
  const filteredWorkspaces = useMemo(() => {
    return workspaces.filter((ws) => {
      // Category filter (match by ID, slug, or name)
      if (selectedCategory !== 'all') {
        const matchesCat =
          ws.categoryId === selectedCategory ||
          ws.categoryName?.toLowerCase().trim() === selectedCategory.toLowerCase().trim() ||
          ws.slug?.includes(selectedCategory);
        if (!matchesCat) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = ws.title?.toLowerCase().includes(query);
        const matchesDesc = ws.shortDescription?.toLowerCase().includes(query);
        const matchesLoc = ws.location?.toLowerCase().includes(query);
        const matchesCat = ws.categoryName?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesLoc && !matchesCat) return false;
      }

      // Price filter
      const numPrice = extractNumericPrice(ws.price);
      if (numPrice > 0 && numPrice > maxPrice) {
        return false;
      }

      // Capacity filter
      if (selectedCapacity !== 'all') {
        const numCap = extractNumericCapacity(ws.capacity);
        if (selectedCapacity === '1-2' && (numCap < 1 || numCap > 2)) return false;
        if (selectedCapacity === '3-6' && (numCap < 3 || numCap > 6)) return false;
        if (selectedCapacity === '7-15' && (numCap < 7 || numCap > 15)) return false;
        if (selectedCapacity === '16+' && numCap < 16) return false;
      }

      // Amenities filter
      if (selectedAmenities.length > 0) {
        const specText = JSON.stringify(ws.specifications || []).toLowerCase();
        const descText = ((ws.shortDescription || '') + (ws.longDescription || '')).toLowerCase();
        const hasAllAmenities = selectedAmenities.every(
          (amenity) => specText.includes(amenity.toLowerCase()) || descText.includes(amenity.toLowerCase())
        );
        if (!hasAllAmenities) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') {
        return extractNumericPrice(a.price) - extractNumericPrice(b.price);
      }
      if (sortBy === 'price-desc') {
        return extractNumericPrice(b.price) - extractNumericPrice(a.price);
      }
      if (sortBy === 'capacity-desc') {
        return extractNumericCapacity(b.capacity) - extractNumericCapacity(a.capacity);
      }
      return (a.order || 0) - (b.order || 0);
    });
  }, [workspaces, selectedCategory, searchQuery, maxPrice, selectedCapacity, selectedAmenities, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredWorkspaces.length / ITEMS_PER_PAGE) || 1;
  const paginatedWorkspaces = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredWorkspaces.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredWorkspaces, currentPage]);

  const workspacesSectionRef = useRef<HTMLElement>(null);

  // Handle page change and smoothly scroll to the top of the workspaces section just below hero
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (workspacesSectionRef.current) {
      const element = workspacesSectionRef.current;
      const yOffset = -80; // Clearance for fixed header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategory('all');
    setShowAllCategories(false);
    setSearchQuery('');
    setMaxPrice(200000);
    setSelectedCapacity('all');
    setSelectedAmenities([]);
    setSortBy('recommended');
    setCurrentPage(1);
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
    setCurrentPage(1);
  };

  // Active filter count
  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (maxPrice < 200000 ? 1 : 0) +
    (selectedCapacity !== 'all' ? 1 : 0) +
    selectedAmenities.length;

  // Prevent body scrolling when mobile filter drawer is open
  useEffect(() => {
    if (mobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileFilterOpen]);

  // Reusable Filter Sections Component for Desktop Sidebar & Mobile Right Drawer
  const renderFilterSections = () => (
    <>
      {/* SECTION 1: RENTAL PERIOD (Pickup & Drop-off Date Time Box) */}
      <div className="bg-[#FAF9F5] border border-[#E5E1D8] rounded-2xl p-4 space-y-4">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#E65100] font-bold block">
          RENTAL PERIOD
        </span>

        {/* Pickup / Start Date & Time */}
        <div className="space-y-1.5 text-left relative z-30">
          <label className="text-[11px] uppercase tracking-wider text-[#5C665C] font-bold block">
            START DATE & TIME
          </label>
          <div className="grid grid-cols-[1.15fr_0.85fr] gap-2">
            {/* Start Date (Material Design Calendar Picker) */}
            <div className="w-full">
              <MaterialDatePicker
                value={startDate}
                minDate={todayDate}
                onChange={(newStart) => {
                  setStartDate(newStart);
                  if (endDate && newStart > endDate) {
                    setEndDate(newStart);
                  }
                }}
                align="left"
              />
            </div>

            {/* Start Time (Material Design Analog Clock Picker) */}
            <div className="w-full">
              <MaterialTimePicker
                value={startTime}
                onChange={(newTime) => setStartTime(newTime)}
                align="right"
              />
            </div>
          </div>
        </div>

        {/* Drop Off / End Date & Time */}
        <div className="space-y-1.5 text-left relative z-20">
          <label className="text-[11px] uppercase tracking-wider text-[#5C665C] font-bold block">
            END DATE & TIME
          </label>
          <div className="grid grid-cols-[1.15fr_0.85fr] gap-2">
            {/* End Date (Material Design Calendar Picker) */}
            <div className="w-full">
              <MaterialDatePicker
                value={endDate}
                minDate={startDate || todayDate}
                onChange={(newEnd) => setEndDate(newEnd)}
                align="left"
              />
            </div>

            {/* End Time (Material Design Analog Clock Picker) */}
            <div className="w-full">
              <MaterialTimePicker
                value={endTime}
                onChange={(newTime) => setEndTime(newTime)}
                align="right"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: CATEGORY */}
      <div className="space-y-2.5 text-left">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase tracking-widest text-[#181F18] font-bold block">
            CATEGORY
          </label>
          {categories.length > 5 && (
            <button
              type="button"
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-[11px] font-bold text-[#2E7D32] hover:text-[#1B5E20] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>{showAllCategories ? 'Show Less' : `+ See More (${categories.length - 5})`}</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showAllCategories ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {/* Item 1: All */}
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#263626] text-white font-bold shadow-sm border border-[#263626]'
                : 'bg-[#FAF9F5] text-[#5C665C] hover:text-[#181F18] hover:bg-[#F0ECE1] border border-[#E5E1D8]'
            }`}
          >
            All
          </button>

          {/* Items 2..6: Categories */}
          {(showAllCategories ? categories : categories.slice(0, 5)).map((cat) => {
            const isSelected = selectedCategory === cat.id || selectedCategory === cat.slug || selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#263626] text-white font-bold shadow-sm border border-[#263626]'
                    : 'bg-[#FAF9F5] text-[#5C665C] hover:text-[#181F18] hover:bg-[#F0ECE1] border border-[#E5E1D8]'
                }`}
              >
                {cat.name}
              </button>
            );
          })}

          {/* Expand / Collapse Button Pill */}
          {categories.length > 5 && (
            <button
              type="button"
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#2E7D32] hover:text-[#1B5E20] bg-[#E8F5E9]/60 hover:bg-[#E8F5E9] border border-[#2E7D32]/30 transition-all cursor-pointer inline-flex items-center gap-1"
            >
              <span>{showAllCategories ? 'Show Less' : '+ See More'}</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showAllCategories ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* SECTION 3: MAX BUDGET / PRICE SLIDER */}
      <div className="space-y-2.5 text-left">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase tracking-widest text-[#181F18] font-bold block">
            MAX BUDGET / MONTH
          </label>
          <span className="text-xs font-mono font-bold text-[#2E7D32]">
            Up to ₹{maxPrice.toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min={5000}
          max={200000}
          step={5000}
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(parseInt(e.target.value, 10));
            setCurrentPage(1);
          }}
          className="w-full accent-[#2E7D32] bg-[#E5E1D8] rounded-lg h-2 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-[#5C665C]">
          <span>₹5,000</span>
          <span>₹1,00,000</span>
          <span>₹2,00,000+</span>
        </div>
      </div>

      {/* SECTION 4: TEAM CAPACITY */}
      <div className="space-y-2.5 text-left">
        <label className="text-[11px] font-mono uppercase tracking-widest text-[#181F18] font-bold block">
          TEAM CAPACITY
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'all', label: 'Any' },
            { id: '1-2', label: '1–2 Pax' },
            { id: '3-6', label: '3–6 Pax' },
            { id: '7-15', label: '7–15 Pax' },
            { id: '16+', label: '16+ Pax' },
          ].map((cap) => (
            <button
              key={cap.id}
              type="button"
              onClick={() => {
                setSelectedCapacity(cap.id);
                setCurrentPage(1);
              }}
              className={`py-1.5 px-2.5 rounded-xl text-xs font-medium text-center transition-all cursor-pointer ${
                selectedCapacity === cap.id
                  ? 'bg-[#263626] text-white font-bold shadow-sm'
                  : 'bg-[#FAF9F5] text-[#5C665C] hover:text-[#181F18] hover:bg-[#F0ECE1] border border-[#E5E1D8]'
              }`}
            >
              {cap.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 5: FEATURES & AMENITIES */}
      <div className="space-y-2.5 text-left">
        <label className="text-[11px] font-mono uppercase tracking-widest text-[#181F18] font-bold block">
          DESIRED AMENITIES
        </label>
        <div className="space-y-2">
          {[
            '24/7 Access',
            'Fiber',
            'Soundproof',
            'Espresso',
            'Meeting',
            'Biometric',
          ].map((amenity) => {
            const isChecked = selectedAmenities.includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer border ${
                  isChecked
                    ? 'bg-[#E8F5E9] border-[#2E7D32] text-[#1B5E20] font-semibold'
                    : 'bg-[#FAF9F5] border-[#E5E1D8] text-[#5C665C] hover:bg-[#F0ECE1] hover:text-[#181F18]'
                }`}
              >
                <span>
                  {amenity === 'Fiber'
                    ? '1 Gbps Fiber VLAN'
                    : amenity === 'Soundproof'
                      ? 'Acoustic Soundproofing'
                      : amenity === 'Espresso'
                        ? 'Artisanal Espresso Bar'
                        : amenity === 'Meeting'
                          ? 'Meeting Room Credits'
                          : amenity === 'Biometric'
                            ? 'Biometric Keyless Entry'
                            : '24/7 Unlimited Access'}
                </span>
                <div
                  className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                    isChecked
                      ? 'bg-[#2E7D32] border-[#2E7D32] text-white'
                      : 'border-[#D5D0C5] bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );

  return (
    <div className="bg-[#FAF9F5] text-[#181F18] min-h-screen">

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (80vh) WITH FULL-BLEED book.png, MOVING ZOOM & CENTERED FROSTED TEXT */}
      {/* ========================================================================= */}
      <section className="relative w-full h-[80vh] min-h-[600px] max-h-[820px] pt-24 sm:pt-28 lg:pt-32 pb-8 flex flex-col justify-center overflow-hidden">

        {/* Full-Bleed Background Cover Image with Slow Moving Animation (book.png) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="/images/book.png"
            alt="EnCourtyard Workspace Sanctuary"
            className="w-full h-full object-cover object-center animate-zoomSlow filter brightness-100 contrast-105"
          />
        </div>

        {/* Foreground Content with Typewriter and Centered Frosted Glass Blur text boxes */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto text-center flex flex-col items-center justify-center">

          {/* Tagline Eyebrow in Frosted Glass Pill */}
          <div className="flex items-center justify-center mb-3.5">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/45 hover:bg-white/60 backdrop-blur-md border border-white/60 text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#141F14] font-bold shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
              <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>A Modern Coworking Experience</span>
            </span>
          </div>

          {/* Animated Main Hero Headline with Each Line in Its Own Frosted Glass Blur Pill */}
          <div className="relative mb-4 flex flex-col items-center justify-center">
            <h1 className="flex flex-col items-center justify-center gap-2.5 min-h-[135px] sm:min-h-[165px]">
              {typedLines.map((line, idx) => {
                if (!line && idx > currentLineIndex) return null;
                return (
                  <div
                    key={idx}
                    className="inline-flex items-center justify-center px-5 sm:px-8 py-1.5 sm:py-2 rounded-2xl bg-white/45 hover:bg-white/60 backdrop-blur-md border border-white/60 text-[#141F14] font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold tracking-tight shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all leading-tight text-center"
                  >
                    <span className={idx === 1 ? 'text-[#1B3B22] italic font-normal' : ''}>
                      {line || '\u00A0'}
                    </span>
                    {isTyping && idx === currentLineIndex && (
                      <span className="inline-block w-[3px] h-[0.75em] bg-[#2E7D32] ml-1.5 animate-pulse align-middle" />
                    )}
                  </div>
                );
              })}
            </h1>
          </div>

          {/* Subheading in Pill: Work • Connect • Grow ↳ */}
          <div className="flex justify-center mb-3">
            <div className="inline-block px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-white/45 hover:bg-white/60 backdrop-blur-md border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-serif font-bold text-[#141F14] tracking-wide">
                <span className="font-handwriting text-2xl lg:text-3xl font-bold leading-none">
                  Work
                </span>
                <span className="font-handwriting text-2xl lg:text-3xl font-bold leading-none">
                  Connect
                </span>
                <span className="font-handwriting text-2xl lg:text-3xl font-bold leading-none">
                  Grow
                </span>
                <span className="text-xl -mt-1 font-sans opacity-80">↳</span>
              </div>
            </div>
          </div>

          {/* Description Subtext in Centered Frosted Glass Blur Pill */}
          <div className="flex justify-center">
            <div className="inline-block px-5 sm:px-8 py-2.5 sm:py-3 rounded-2xl bg-white/45 hover:bg-white/60 backdrop-blur-md border border-white/60 text-xs sm:text-sm text-[#181F18] font-sans font-medium shadow-[0_8px_25px_rgba(0,0,0,0.1)] leading-relaxed max-w-xl text-center">
              Flexible spaces. Meaningful connections. Real opportunities. Welcome to EnCourtyard.
            </div>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT LAYOUT: Sidebar Filter (Left) + Workspaces Grid (Right)    */}
      {/* ========================================================================= */}
      <main
        id="workspaces-section"
        ref={workspacesSectionRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 scroll-mt-24"
      >

        {/* Mobile Slide-Over Right Sidebar Drawer */}
        <div
          className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
            mobileFilterOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
          }`}
        >
          {/* Backdrop Overlay */}
          <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 ${
              mobileFilterOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Slide-over Right Drawer Panel */}
          <div
            className={`fixed inset-y-0 right-0 w-[88vw] max-w-[380px] bg-white shadow-2xl flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
              mobileFilterOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Drawer Header: Title + Active Count + Close 'X' button */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E1D8] bg-[#FAF9F5]">
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal className="w-5 h-5 text-[#2E7D32]" />
                <h3 className="font-serif text-lg font-bold text-[#181F18]">
                  Filters
                </h3>
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#2E7D32] text-white text-[11px] font-bold font-mono">
                    {activeFiltersCount} active
                  </span>
                )}
              </div>

              {/* Close 'X' Button */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 rounded-xl text-[#5C665C] hover:text-[#181F18] hover:bg-[#EAE5DB] transition-colors cursor-pointer"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Filter Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 overscroll-contain custom-sidebar-scroll text-[#181F18]">
              {renderFilterSections()}
            </div>

            {/* Drawer Sticky Footer with Reset & Show Results button */}
            <div className="p-4 border-t border-[#E5E1D8] bg-[#FAF9F5] flex items-center gap-3">
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E1D8] bg-white text-xs font-bold text-[#E65100] hover:bg-[#FFF3E0] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#181F18] hover:bg-[#263626] text-white text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Show {filteredWorkspaces.length} Spaces</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">

          {/* ========================================================================= */}
          {/* LEFT SIDEBAR FILTERS (Desktop Only - Sticky & In-Viewport Scroll)         */}
          {/* ========================================================================= */}
          <aside
            style={{
              position: 'sticky',
              top: '128px',
              alignSelf: 'flex-start',
              zIndex: 20,
            }}
            className="hidden lg:block lg:col-span-4"
          >
            <div
              style={{
                maxHeight: 'calc(100vh - 148px)',
              }}
              className="bg-white border border-[#E5E1D8] rounded-3xl p-6 space-y-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-y-auto overscroll-contain pr-3 custom-sidebar-scroll text-[#181F18]"
            >

              {/* Sidebar Top: Filter Title & Reset */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E1D8]">
                <div className="flex items-center gap-2.5">
                  <SlidersHorizontal className="w-5 h-5 text-[#2E7D32]" />
                  <h3 className="font-serif text-lg font-bold text-[#181F18] tracking-wide">
                    Filters
                  </h3>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs text-[#E65100] hover:text-[#C84300] flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All</span>
                  </button>
                )}
              </div>

              {renderFilterSections()}

            </div>
          </aside>

          {/* ========================================================================= */}
          {/* RIGHT SIDE: WORKSPACES LISTING CARDS (8 Rows = 16 Cards) & PAGINATION     */}
          {/* ========================================================================= */}
          <section className="lg:col-span-8 space-y-6">

            {/* Top Toolbar: Search Bar + Live Count + Sort */}
            <div className="bg-white border border-[#E5E1D8] rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-sm">

              {/* Search Bar Input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C665C]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by space name, category, or amenities..."
                  className="w-full pl-9.5 pr-4 py-2 bg-[#FAF9F5] border border-[#E5E1D8] rounded-xl text-xs sm:text-sm text-[#181F18] focus:outline-none focus:border-[#2E7D32] transition-colors placeholder:text-[#8C968C]"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-[#5C665C] font-mono hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#FAF9F5] border border-[#E5E1D8] rounded-xl px-3 py-2 text-xs font-sans text-[#181F18] focus:outline-none focus:border-[#2E7D32] cursor-pointer"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="capacity-desc">Capacity: Largest First</option>
                </select>
              </div>

            </div>

            {/* Results Count & Parallel Mobile Filter Trigger Button */}
            <div className="flex items-center justify-between gap-3 px-1">
              {/* Two-row stack: Row 1 = Workspaces available, Row 2 = Page count */}
              <div className="flex flex-col text-left">
                <span className="text-xs sm:text-sm font-mono font-bold text-[#181F18]">
                  {filteredWorkspaces.length} workspace{filteredWorkspaces.length === 1 ? '' : 's'} available
                </span>
                <span className="text-[11px] font-mono text-[#5C665C]">
                  Page {currentPage} of {totalPages}
                </span>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-[#E65100] hover:underline font-bold text-xs hidden sm:inline"
                  >
                    Clear all filters
                  </button>
                )}

                {/* Mobile / Responsive Filter Trigger Button */}
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#181F18] hover:bg-[#263626] text-white font-sans text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
                  aria-label="Open filter menu"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#FAF9F5]" />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#2E7D32] text-white text-[10px] flex items-center justify-center font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Loading Skeletons */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-3xl border border-[#E5E1D8] p-4 space-y-4 animate-pulse shadow-sm"
                  >
                    <div className="h-52 bg-[#F0ECE1] rounded-2xl w-full" />
                    <div className="h-5 bg-[#F0ECE1] rounded w-2/3" />
                    <div className="h-4 bg-[#F0ECE1] rounded w-full" />
                    <div className="flex gap-2 pt-2">
                      <div className="h-10 bg-[#F0ECE1] rounded-xl flex-1" />
                      <div className="h-10 bg-[#F0ECE1] rounded-xl flex-1" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredWorkspaces.length === 0 ? (
              /* Empty State */
              <div className="py-20 text-center bg-white border border-[#E5E1D8] rounded-3xl p-8 space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-[#FAF9F5] text-[#2E7D32] flex items-center justify-center mx-auto border border-[#E5E1D8]">
                  <Building2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#181F18]">No Workspaces Found</h3>
                <p className="text-xs sm:text-sm text-[#5C665C] max-w-md mx-auto">
                  We could not find any spaces matching your exact filters. Try adjusting your dates, budget, or clearing category selections.
                </p>
                <div className="pt-2">
                  <Button variant="outline" size="sm" onClick={handleResetFilters}>
                    Reset All Filters
                  </Button>
                </div>
              </div>
            ) : (
              /* Workspaces Grid: 8 rows of 2 cards each = 16 cards per page */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {paginatedWorkspaces.map((ws) => {
                  const firstMedia = ws.mediaUrls?.[0];
                  const { isAvailable, nextAvailableTimestamp } = checkWorkspaceAvailability(ws, startDate, startTime, endDate, endTime);

                  return (
                    <div
                      key={ws.id}
                      className="bg-white hover:bg-[#2D3E2D] rounded-3xl border border-[#E0DCD3] hover:border-[#4ADE80]/50 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group font-sans cursor-pointer hover:-translate-y-1"
                    >
                      {/* Top Media Image / Video Container */}
                      <div>
                        <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-[#EAE5DB]">
                          {firstMedia?.type === 'video' ? (
                            <div className="w-full h-full bg-[#181F18] flex items-center justify-center text-white">
                              <Video className="w-10 h-10 text-[#4ADE80]" />
                            </div>
                          ) : (
                            <img
                              src={
                                firstMedia?.url ||
                                'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
                              }
                              alt={ws.title}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out select-none pointer-events-none"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80';
                              }}
                            />
                          )}

                          {/* Top Scrim Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/35 pointer-events-none" />

                          {/* Category Badge */}
                          <div className="absolute top-3 left-3">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[#181F18] text-[11px] font-bold shadow-xs border border-white/40 select-none">
                              <Layers className="w-3 h-3 text-[#2E7D32]" />
                              <span>{ws.categoryName || 'Workspace'}</span>
                            </span>
                          </div>

                          {/* Badge / Status Tag */}
                          {!isAvailable ? (
                            <div className="absolute top-3 right-3">
                              <CountdownBadge targetTimestamp={nextAvailableTimestamp} className="!text-[10px] !px-2.5 !py-0.5" />
                            </div>
                          ) : ws.badge ? (
                            <div className="absolute top-3 right-3">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E65100] text-white text-[10px] font-mono font-bold shadow-sm select-none">
                                {ws.badge}
                              </span>
                            </div>
                          ) : null}

                          {/* Bottom Bar on Image: Price & Capacity */}
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs select-none">
                            <span className="font-bold text-sm text-white drop-shadow-md">
                              {ws.price || 'Flexible Plan'}
                            </span>
                            {ws.capacity && (
                              <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-[#4ADE80] border border-emerald-500/30">
                                {ws.capacity}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Information */}
                        <div className="p-5 space-y-3">
                          <div>
                            <h3 className="font-serif text-lg font-bold text-[#181F18] group-hover:text-white transition-colors leading-snug line-clamp-1">
                              {ws.title}
                            </h3>
                            <p className="text-xs text-[#5C665C] group-hover:text-[#D1E0D1] line-clamp-2 mt-1 leading-relaxed transition-colors min-h-[34px]">
                              {ws.shortDescription}
                            </p>
                          </div>

                          {/* Location snippet */}
                          {ws.location && (
                            <div className="flex items-center gap-1.5 text-xs text-[#5C665C] group-hover:text-[#D1E0D1] transition-colors">
                              <MapPin className="w-3.5 h-3.5 text-[#2E7D32] group-hover:text-[#4ADE80] shrink-0 transition-colors" />
                              <span className="truncate">{ws.location}</span>
                            </div>
                          )}

                          {/* Key Specifications snippet */}
                          {ws.specifications && ws.specifications.length > 0 && (
                            <div className="pt-2.5 border-t border-[#E5E1D8] group-hover:border-white/15 flex flex-wrap gap-1.5 text-[11px] transition-colors">
                              {ws.specifications.slice(0, 2).map((spec, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FAF9F5] group-hover:bg-[#1E2B1E] border border-[#E5E1D8] group-hover:border-[#4ADE80]/30 text-[#334133] group-hover:text-[#E3EBE3] transition-colors text-[10px] font-mono"
                                >
                                  <Check className="w-2.5 h-2.5 text-[#2E7D32] group-hover:text-[#4ADE80] transition-colors" />
                                  <span>
                                    {spec.key}: {spec.value}
                                  </span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Action Buttons (Details & Book Now) */}
                      <div className="p-5 pt-0 flex items-center gap-2.5 border-t border-[#E5E1D8]/60 group-hover:border-white/15 pt-3 mt-1 transition-colors">
                        {/* 1. Details Button -> navigates to /book-space/[id] */}
                        <Link
                          href={`/book-space/${ws.id}`}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-[#FAF9F5] hover:bg-[#EAE5DC] group-hover:bg-white/10 group-hover:hover:bg-white/20 text-[#181F18] group-hover:text-white border border-[#D5D0C5] group-hover:border-white/30 text-xs font-bold text-center transition-all duration-200 active:scale-95 shadow-2xs"
                        >
                          Details
                        </Link>

                        {/* 2. Book Now Button -> triggers auth check modal if guest, else navigates to /book */}
                        <button
                          type="button"
                          disabled={!isAvailable}
                          onClick={(e) => {
                            e.preventDefault();
                            if (!isAvailable) return;
                            const targetUrl = `/book?workspace=${encodeURIComponent(ws.id)}&startDate=${startDate}&endDate=${endDate}&startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}`;
                            if (user || isAuthenticated) {
                              router.push(targetUrl);
                            } else {
                              setSelectedWorkspaceForAuth(ws);
                              setShowAuthModal(true);
                            }
                          }}
                          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold text-center shadow-xs transition-all duration-200 flex items-center justify-center gap-1 ${
                            !isAvailable 
                              ? 'bg-[#E5E1D8] text-[#8C968C] cursor-not-allowed border border-[#D5D0C5]'
                              : 'bg-[#2E7D32] hover:bg-[#1E5C23] group-hover:bg-[#4ADE80] group-hover:hover:bg-[#3ec46f] text-white group-hover:text-[#0D160E] hover:shadow-md active:scale-95 cursor-pointer'
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

            {/* 3. Pagination Controls (Displayed right after the 8 rows) */}
            {totalPages > 1 && (
              <div className="pt-8 flex items-center justify-center gap-2">
                {/* Previous Button */}
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-[#E5E1D8] text-xs text-[#181F18] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#2E7D32] transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>

                {/* Page Number Buttons */}
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNumber = idx + 1;
                  const isActive = pageNumber === currentPage;
                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => handlePageChange(pageNumber)}
                      className={`w-9 h-9 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${isActive
                          ? 'bg-[#263626] text-white shadow-sm'
                          : 'bg-white text-[#181F18] border border-[#E5E1D8] hover:bg-[#FAF9F5]'
                        }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                {/* Next Button */}
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-[#E5E1D8] text-xs text-[#181F18] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#2E7D32] transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </section>

        </div>

      </main>

      {/* ========================================================================= */}
      {/* 4. CENTERED SIGN-IN REQUIRED MODAL WITH FROSTED BLUR BACKDROP              */}
      {/* ========================================================================= */}
      {showAuthModal && selectedWorkspaceForAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn select-none">
          {/* Frosted Glass Blurred Backdrop */}
          <div
            className="fixed inset-0 bg-[#181F18]/65 backdrop-blur-md transition-opacity duration-300"
            onClick={() => {
              setShowAuthModal(false);
              setSelectedWorkspaceForAuth(null);
            }}
          />

          {/* Center Modal Card */}
          <div className="relative z-10 w-full max-w-md bg-white rounded-3xl border border-[#E0DCD3] shadow-2xl p-6 sm:p-8 text-center animate-scaleUp font-sans">
            
            {/* Top Right Close X Button */}
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF9F5] border border-[#E5E1D8] text-xs text-[#2E7D32] mb-3 max-w-full">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="font-bold truncate max-w-[200px]">{selectedWorkspaceForAuth.title}</span>
              <span className="text-[#8A968A]">•</span>
              <span className="capitalize font-semibold text-[#181F18]">{selectedWorkspaceForAuth.categoryName}</span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#5C665C] leading-relaxed mb-6">
              You must be signed in to reserve this workspace so we can verify your account, assign your biometric pass, and issue your booking confirmation.
            </p>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              {/* Sign In CTA */}
              <Link
                href={`/login?redirect=${encodeURIComponent(`/book?workspace=${encodeURIComponent(selectedWorkspaceForAuth.id)}&startDate=${startDate}&endDate=${endDate}&startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}`)}`}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Continue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Create Account CTA */}
              <Link
                href={`/signup?redirect=${encodeURIComponent(`/book?workspace=${encodeURIComponent(selectedWorkspaceForAuth.id)}&startDate=${startDate}&endDate=${endDate}&startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}`)}`}
                className="w-full py-3 px-6 rounded-2xl bg-[#FAF9F5] hover:bg-[#EAE5DC] text-[#181F18] border border-[#E0DCD3] hover:border-[#181F18]/40 font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-[#2E7D32]" />
                <span>Create Member Account</span>
              </Link>

              {/* Cancel / Dismiss */}
              <button
                type="button"
                onClick={() => {
                  setShowAuthModal(false);
                  setSelectedWorkspaceForAuth(null);
                }}
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
