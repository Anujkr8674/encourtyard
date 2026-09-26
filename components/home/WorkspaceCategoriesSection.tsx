'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Building2,
  CalendarCheck,
  Sparkles,
  CheckCircle2,
  Layers,
  Laptop,
  Users,
  Briefcase,
  Mic,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { checkWorkspaceAvailabilityDetailed, getDefaultDates, BookingSlot } from '@/lib/availability';
import { CountdownBadge } from '@/components/ui/CountdownBadge';

// Sub-Item Interface
export interface SubCategoryItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  bookLink: string;
  capacity?: string | null;
  badge?: string | null;
  bookings?: BookingSlot[];
  maintenanceBlocks?: BookingSlot[];
}

// Category Interface
export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  bgFeatureImage: string;
  icon: React.ComponentType<{ className?: string }>;
  link: string;
  detailTitle: string;
  detailDescription: string;
  ctaText: string;
  handwrittenTag: string;
  features: string[];
  subItems: SubCategoryItem[];
  order: number;
}

// Helper to choose appropriate category icon
const getCategoryIcon = (name: string = '', slug: string = '') => {
  const text = `${name} ${slug}`.toLowerCase();
  if (text.includes('meet') || text.includes('room') || text.includes('board')) return Users;
  if (text.includes('private') || text.includes('office') || text.includes('cabin')) return Building2;
  if (text.includes('hot') || text.includes('flex')) return Laptop;
  if (text.includes('desk') || text.includes('dedicate')) return Layers;
  if (text.includes('podcast') || text.includes('studio') || text.includes('mic') || text.includes('media')) return Mic;
  if (text.includes('team') || text.includes('squad') || text.includes('enterprise')) return Briefcase;
  if (text.includes('virtual')) return Building2;
  return Building2;
};

// Helper for handwritten tag
const getCategoryTag = (name: string = '') => {
  const text = name.toLowerCase();
  if (text.includes('office')) return 'More Than An Office';
  if (text.includes('desk')) return 'More Than A Desk';
  if (text.includes('hot')) return 'More Than A Seat';
  if (text.includes('room') || text.includes('meet')) return 'More Than A Room';
  if (text.includes('podcast') || text.includes('studio')) return 'More Than A Mic';
  if (text.includes('virtual')) return 'More Than An Address';
  if (text.includes('team')) return 'More Than A Space';
  return 'More Than A Space';
};

// Safe image extractor for database workspaces
const getWorkspaceImage = (ws: any, fallbackCatImage: string): string => {
  try {
    if (ws?.mediaUrls) {
      const rawMedia = ws.mediaUrls;
      let media: any = rawMedia;
      if (typeof rawMedia === 'string') {
        try {
          media = JSON.parse(rawMedia);
        } catch {
          if (rawMedia.startsWith('http')) return rawMedia;
        }
      }
      if (Array.isArray(media) && media.length > 0) {
        const first = media[0];
        if (typeof first === 'string' && first.trim()) return first;
        if (typeof first === 'object' && first && 'url' in first && typeof first.url === 'string') {
          return first.url;
        }
      }
    }
  } catch (err) {
    console.warn('Error extracting workspace image:', err);
  }
  return fallbackCatImage || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80';
};

export const WorkspaceCategoriesSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const subItemsScrollRef = useRef<HTMLDivElement>(null);

  // Purely dynamic Database Categories State (NO static mock data)
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Selected Category State (Click/Tap ONLY - NO hover category change)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [featuredIndex, setFeaturedIndex] = useState<number>(3); // 4th card position background tracker

  // Navigation Button State for Top Carousel
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Navigation Button State for Bottom Sub-Items Carousel (Desktop)
  const [canSubScrollLeft, setCanSubScrollLeft] = useState(false);
  const [canSubScrollRight, setCanSubScrollRight] = useState(true);

  // Autoplay Pause state (pauses on user hover / drag)
  const [isPaused, setIsPaused] = useState(false);

  // Mouse Drag / Swipe State for Top Carousel
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);

  // Mouse Drag / Swipe State for Bottom Sub-Items Carousel (Desktop)
  const [isSubMouseDown, setIsSubMouseDown] = useState(false);
  const [subStartX, setSubStartX] = useState(0);
  const [subScrollLeftState, setSubScrollLeftState] = useState(0);
  const [subDragDistance, setSubDragDistance] = useState(0);

  // Fetch Database Categories & Workspaces dynamically from Supabase database
  const fetchDbData = async () => {
    try {
      setLoading(true);
      const [resCat, resWs] = await Promise.all([
        fetch('/api/categories', { cache: 'no-store' }),
        fetch('/api/workspaces', { cache: 'no-store' }),
      ]);

      const dataCat = await resCat.json();
      const dataWs = await resWs.json();

      const dbCategories: any[] = dataCat?.success && Array.isArray(dataCat.categories)
        ? dataCat.categories.filter((c: any) => c.isActive !== false)
        : [];

      const dbWorkspaces: any[] = dataWs?.success && Array.isArray(dataWs.workspaces)
        ? dataWs.workspaces.filter((w: any) => w.isActive !== false)
        : [];

      if (dbCategories.length > 0) {
        // Build category list exclusively from database records
        const mergedList: CategoryData[] = dbCategories.map((dbCat, index) => {
          // Gather database workspaces belonging to this category
          const matchingWs = dbWorkspaces.filter(
            (w) =>
              w.categoryId === dbCat.id ||
              w.categoryId === dbCat.slug ||
              (w.categoryName &&
                w.categoryName.toLowerCase() === dbCat.name.toLowerCase())
          );

          // Convert matching DB workspaces into sub-items
          const dbSubItems: SubCategoryItem[] = matchingWs.map((ws) => ({
            id: ws.id,
            title: ws.title,
            description: ws.shortDescription,
            image: getWorkspaceImage(ws, dbCat.imageUrl || ''),
            link: `/book-space/${ws.id}`,
            bookLink: `/book?workspace=${ws.id}`,
            capacity: ws.capacity,
            badge: ws.badge,
            bookings: ws.bookings,
          }));

          const catIcon = getCategoryIcon(dbCat.name, dbCat.slug);
          const catTag = getCategoryTag(dbCat.name);

          // Features directly from database badge / features column
          const catFeatures = (Array.isArray(dbCat.features) && dbCat.features.length > 0)
            ? dbCat.features
            : [
              'High-speed WiFi 6 & VLAN connectivity',
              'Acoustic soundproofing & ergonomic furniture',
              'Access to botanical lounges & espresso bar',
              '24/7 keyless access & concierge support',
            ];

          return {
            id: dbCat.id,
            name: dbCat.name,
            slug: dbCat.slug,
            description: dbCat.description || 'A focused space to do your best work',
            imageUrl: dbCat.imageUrl || '',
            bgFeatureImage: dbCat.imageUrl || '',
            icon: catIcon,
            link: `/workspaces?category=${dbCat.slug || dbCat.id}`,
            detailTitle: dbCat.name,
            detailDescription: dbCat.description || 'A focused space to do your best work',
            ctaText: `View All ${dbCat.name}`,
            handwrittenTag: catTag,
            features: catFeatures,
            subItems: dbSubItems,
            order: typeof dbCat.order === 'number' ? dbCat.order : index + 1,
          };
        });

        setCategories(mergedList);
        setSelectedCategoryId(mergedList[0].id);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error('Failed to load database categories:', err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDbData();
  }, []);

  // Scroll check for top carousel & dynamic 4th visible card calculation
  const checkScroll = useCallback(() => {
    if (scrollRef.current && categories.length > 0) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

      // Determine 4th card visible in viewport for backdrop image
      const cardWidth = 245;
      const currentFirstIndex = Math.round(scrollLeft / cardWidth);
      const target4thIndex = Math.min(
        categories.length - 1,
        Math.max(0, currentFirstIndex + 3)
      );
      setFeaturedIndex(target4thIndex);
    }
  }, [categories.length]);

  // Scroll check for bottom sub-items carousel (Desktop)
  const checkSubScroll = useCallback(() => {
    if (subItemsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = subItemsScrollRef.current;
      setCanSubScrollLeft(scrollLeft > 10);
      setCanSubScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener('scroll', checkScroll);
  }, [checkScroll, categories.length]);

  useEffect(() => {
    const subEl = subItemsScrollRef.current;
    if (!subEl) return;
    subEl.addEventListener('scroll', checkSubScroll, { passive: true });
    checkSubScroll();
    return () => subEl.removeEventListener('scroll', checkSubScroll);
  }, [checkSubScroll, selectedCategoryId]);

  // Reset sub-items scroll position to start whenever category changes
  useEffect(() => {
    if (subItemsScrollRef.current) {
      subItemsScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [selectedCategoryId]);

  // Autoplay through categories (pauses on user hover / drag)
  useEffect(() => {
    if (isPaused || categories.length <= 1) return;

    const timer = setInterval(() => {
      setSelectedCategoryId((prevId) => {
        const currentIndex = categories.findIndex((c) => c.id === prevId);
        const nextIndex = (currentIndex + 1) % categories.length;
        const nextCategory = categories[nextIndex];

        // Smoothly scroll the top carousel to keep current card in comfortable view
        if (scrollRef.current) {
          const cardWidth = 245;
          scrollRef.current.scrollTo({
            left: nextIndex * cardWidth,
            behavior: 'smooth'
          });
        }

        return nextCategory.id;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, categories]);

  // Manual Top Slide Left / Right
  const slideLeft = () => {
    if (scrollRef.current && categories.length > 0) {
      scrollRef.current.scrollBy({ left: -260, behavior: 'smooth' });
      const currentIndex = categories.findIndex((c) => c.id === selectedCategoryId);
      const prevIndex = Math.max(0, currentIndex - 1);
      setSelectedCategoryId(categories[prevIndex].id);
    }
  };

  const slideRight = () => {
    if (scrollRef.current && categories.length > 0) {
      scrollRef.current.scrollBy({ left: 260, behavior: 'smooth' });
      const currentIndex = categories.findIndex((c) => c.id === selectedCategoryId);
      const nextIndex = Math.min(categories.length - 1, currentIndex + 1);
      setSelectedCategoryId(categories[nextIndex].id);
    }
  };

  // Sub-items Slider Left / Right (Desktop)
  const slideSubLeft = () => {
    if (subItemsScrollRef.current) {
      subItemsScrollRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const slideSubRight = () => {
    if (subItemsScrollRef.current) {
      subItemsScrollRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  // Mouse Drag Handlers for Top Carousel
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsMouseDown(true);
    setIsPaused(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
    setDragDistance(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftState - walk;
    setDragDistance(Math.abs(walk));
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
    setIsPaused(false);
  };

  // Mouse Drag Handlers for Bottom Sub-Items Carousel (Desktop)
  const handleSubMouseDown = (e: React.MouseEvent) => {
    if (!subItemsScrollRef.current) return;
    setIsSubMouseDown(true);
    setSubStartX(e.pageX - subItemsScrollRef.current.offsetLeft);
    setSubScrollLeftState(subItemsScrollRef.current.scrollLeft);
    setSubDragDistance(0);
  };

  const handleSubMouseMove = (e: React.MouseEvent) => {
    if (!isSubMouseDown || !subItemsScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - subItemsScrollRef.current.offsetLeft;
    const walk = (x - subStartX) * 1.5;
    subItemsScrollRef.current.scrollLeft = subScrollLeftState - walk;
    setSubDragDistance(Math.abs(walk));
  };

  const handleSubMouseUp = () => {
    setIsSubMouseDown(false);
  };

  const handleSubMouseLeave = () => {
    setIsSubMouseDown(false);
  };

  const handleCardClick = (e: React.MouseEvent, categoryId: string) => {
    if (dragDistance > 10) {
      e.preventDefault();
      return;
    }
    setSelectedCategoryId(categoryId);
  };

  const currentFeaturedCard = categories[featuredIndex] || categories[3] || categories[0];
  const bgImageToShow = currentFeaturedCard?.imageUrl || '';

  const currentActiveCategory =
    categories.find((c) => c.id === selectedCategoryId) || categories[0];
  const ActiveIcon = currentActiveCategory?.icon || Building2;

  return (
    <section
      id="categories"
      className="py-14 sm:py-20 lg:py-24 secondary-section-bg border-b border-[#E5E1D8] relative overflow-hidden select-none"
    >
      {/* Background Watermark & Botanical Atmosphere */}
      <div className="hidden lg:block absolute top-10 right-16 select-none pointer-events-none opacity-40 z-0">
        <p className="font-handwriting text-5xl xl:text-6xl text-[#263626]/25 rotate-[-4deg] tracking-wide">
          Work Connect Grow
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 lg:mb-12 gap-5 relative z-20">
          <div className="max-w-xl text-left">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#738273] font-bold block mb-1.5">
              SPACES FOR EVERY AMBITION
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-[42px] font-bold text-[#181F18] tracking-tight">
              Workspace Categories
            </h2>
            <p className="text-xs sm:text-base text-[#5C665C] mt-2 font-sans">
              Whether you're a freelancer, startup or an enterprise, we have a space that fits your style, team size and business goals.
            </p>
          </div>

          {/* Action Links & Top Carousel Controls */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 flex-wrap md:self-start md:pt-1">
            <Link
              href="/workspaces"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#181F18] hover:text-[#263626] group transition-colors"
            >
              <span>Explore All Workspaces</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            {/* Top Carousel Arrow Buttons for Swiping */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={slideLeft}
                disabled={!canScrollLeft || loading}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#D5CEC2] flex items-center justify-center transition-all cursor-pointer shadow-xs ${canScrollLeft && !loading
                  ? 'bg-white text-[#181F18] hover:bg-[#263626] hover:text-white hover:border-[#263626]'
                  : 'bg-[#EAE5DC] text-[#A3B0A3] opacity-40 cursor-not-allowed'
                  }`}
                aria-label="Previous categories"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={slideRight}
                disabled={!canScrollRight || loading}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#D5CEC2] flex items-center justify-center transition-all cursor-pointer shadow-xs ${canScrollRight && !loading
                  ? 'bg-white text-[#181F18] hover:bg-[#263626] hover:text-white hover:border-[#263626]'
                  : 'bg-[#EAE5DC] text-[#A3B0A3] opacity-40 cursor-not-allowed'
                  }`}
                aria-label="Next categories"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Feature Background Image (Only on desktop and only after database categories are loaded) */}
        {!loading && categories.length > 0 && bgImageToShow && (
          <div className="hidden lg:block absolute top-12 bottom-3 left-[48%] right-[20.5%] rounded-t-[36px] rounded-b-2xl overflow-hidden shadow-2xl border border-[#D5CEC2] z-0 pointer-events-none transition-all duration-500">
            <img
              key={bgImageToShow}
              src={bgImageToShow}
              alt={currentFeaturedCard?.name || 'Workspace Category'}
              className="w-full h-full object-cover object-top transition-opacity duration-700 ease-in-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
          </div>
        )}

        {/* Dynamic Content: Loading State Skeleton / DB Categories */}
        {loading ? (
          <div className="space-y-6 animate-pulse">
            {/* Top Carousel Skeleton */}
            <div className="flex gap-4 overflow-hidden py-3">
              {[1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  className="w-[220px] sm:w-[240px] h-[260px] rounded-2xl bg-[#EAE5DC]/60 border border-[#E0DCD3] shrink-0 p-4 flex flex-col justify-between"
                >
                  <div className="aspect-[4/3] w-full rounded-xl bg-[#DDD7CB]/70" />
                  <div className="space-y-2 mt-3">
                    <div className="h-4 bg-[#DDD7CB] rounded w-3/4" />
                    <div className="h-3 bg-[#DDD7CB]/70 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Panel Skeleton */}
            <div className="bg-[#FAF9F5] rounded-3xl border border-[#E2DDD3] p-7 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E5E1D8]">
                <div className="w-12 h-12 rounded-2xl bg-[#DDD7CB]" />
                <div className="space-y-2">
                  <div className="h-5 bg-[#DDD7CB] rounded w-48" />
                  <div className="h-3 bg-[#DDD7CB]/70 rounded w-72" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 flex gap-4 overflow-hidden">
                  {[1, 2, 3].map((sIdx) => (
                    <div
                      key={sIdx}
                      className="w-[220px] h-[220px] rounded-2xl bg-white border border-[#E5E1D8] p-3.5 shrink-0"
                    >
                      <div className="aspect-[16/11] w-full rounded-lg bg-[#EAE5DC]" />
                      <div className="h-4 bg-[#DDD7CB] rounded w-3/4 mt-3" />
                      <div className="h-3 bg-[#DDD7CB]/60 rounded w-full mt-1.5" />
                    </div>
                  ))}
                </div>
                <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E5E1D8] p-5 space-y-3">
                  <div className="h-3 bg-[#DDD7CB] rounded w-36 mb-4" />
                  {[1, 2, 3, 4].map((fIdx) => (
                    <div key={fIdx} className="h-8 rounded-xl bg-[#FAF9F5] border border-[#EBE6DC]" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : categories.length === 0 ? (
          /* Empty Database State */
          <div className="bg-[#FAF9F5] rounded-3xl border border-[#E2DDD3] p-12 text-center max-w-lg mx-auto shadow-sm space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#2E7D32] flex items-center justify-center mx-auto mb-2">
              <FolderOpen className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#181F18]">
              No Categories in Database
            </h3>
            <p className="text-xs text-[#5C665C]">
              Create your workspace categories in the admin dashboard to populate the homepage.
            </p>
            <Link
              href="/admin/categories"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2E7D32] text-white font-bold text-xs shadow-sm hover:bg-[#1E5C23] transition-colors mt-2"
            >
              <span>Go to Admin Categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* ========================================================================= */}
            {/* TOP CATEGORY CARDS SLIDER (Auto + Manual Swappable, Mouse Drag & Click)   */}
            {/* ========================================================================= */}
            <div
              ref={scrollRef}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={handleMouseLeave}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className={`flex gap-3.5 sm:gap-4 lg:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 sm:py-3 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 relative z-10 items-end mb-6 sm:mb-8 ${isMouseDown ? 'cursor-grabbing' : 'cursor-grab'
                }`}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categories.map((category, index) => {
                const isFeatured = index === featuredIndex;
                const isActive = category.id === selectedCategoryId;
                const IconComp = category.icon;

                // =====================================================================
                // 4TH / FEATURED CARD (Matches OldWorkSpaceCategory)
                // =====================================================================
                if (isFeatured) {
                  return (
                    <div
                      key={category.id}
                      onClick={(e) => handleCardClick(e, category.id)}
                      className={`group border transition-all duration-300 transform flex flex-col justify-end w-[200px] sm:w-[230px] lg:w-[230px] shrink-0 snap-start cursor-pointer select-none relative ${isActive
                        ? 'bg-[#263626] text-white border-t-2 border-x-2 border-b-0 border-[#4E6B4E] rounded-t-2xl rounded-b-none shadow-2xl z-20 pb-4 sm:pb-5 mb-0'
                        : 'bg-white text-[#181F18] border-[#E5E1D8] rounded-2xl mb-4 sm:mb-5 shadow-warm hover:shadow-2xl hover:border-[#263626] hover:-translate-y-1.5'
                        }`}
                    >
                      {/* Floating Active Category Badge on Top */}
                      {isActive && (
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center">
                          {/* <span className="bg-[#1E2D1E] text-white border border-[#3A4D3A] text-[10px] font-sans font-bold px-3 py-0.5 rounded-full shadow-md whitespace-nowrap">
                            Active Category
                          </span> */}
                          {/* <div className="w-2 h-1 bg-[#1E2D1E] [clip-path:polygon(50%_100%,0_0,100%_0)]" /> */}
                        </div>
                      )}

                      {/* Mobile/Tablet Fallback Image if below lg */}
                      {category.imageUrl && (
                        <div className="lg:hidden aspect-[4/3] w-full overflow-hidden bg-[#EAE5DB] relative rounded-t-2xl">
                          <img
                            src={category.imageUrl}
                            alt={category.name}
                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out pointer-events-none"
                            loading="lazy"
                          />
                          {isActive && (
                            <div className="absolute inset-0 bg-gradient-to-t from-[#263626]/80 via-transparent to-transparent" />
                          )}
                        </div>
                      )}

                      <div className="p-3.5 sm:p-5 flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#4ADE80]' : 'text-[#263626]'}`} />
                            <h3 className={`font-serif text-xs sm:text-base font-bold leading-tight ${isActive ? 'text-white' : 'text-[#181F18]'}`}>
                              {category.name}
                            </h3>
                          </div>
                          <p className={`text-[11px] sm:text-xs leading-snug line-clamp-2 ${isActive ? 'text-[#D5E2D5]' : 'text-[#5C665C]'}`}>
                            {category.description}
                          </p>
                        </div>

                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 ${isActive
                          ? 'bg-white text-[#263626] shadow-sm'
                          : 'bg-[#FAF9F5] border border-[#E5E1D8] group-hover:bg-[#263626] group-hover:text-white'
                          }`}>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  );
                }

                // =====================================================================
                // STANDARD CARDS (1st, 2nd, 3rd, 5th, etc.)
                // =====================================================================
                return (
                  <div
                    key={category.id}
                    onClick={(e) => handleCardClick(e, category.id)}
                    className={`group border transition-all duration-300 transform flex flex-col justify-between w-[205px] sm:w-[240px] lg:w-[240px] shrink-0 snap-start cursor-pointer select-none relative ${isActive
                      ? 'bg-[#263626] text-white border-t-2 border-x-2 border-b-0 border-[#4E6B4E] rounded-t-2xl rounded-b-none shadow-2xl z-20 pb-4 sm:pb-5 mb-0'
                      : 'bg-white text-[#181F18] border-[#E5E1D8] rounded-2xl mb-4 sm:mb-5 shadow-warm hover:shadow-2xl hover:border-[#263626] hover:-translate-y-1.5'
                      }`}
                  >
                    {/* Floating Active Category Badge on Top */}
                    {isActive && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center">
                        {/* <span className="bg-[#1E2D1E] text-white border border-[#3A4D3A] text-[10px] font-sans font-bold px-3 py-0.5 rounded-full shadow-md whitespace-nowrap">
                          Active Category
                        </span> */}
                        {/* <div className="w-2 h-1 bg-[#1E2D1E] [clip-path:polygon(50%_100%,0_0,100%_0)]" /> */}
                      </div>
                    )}

                    {/* Thumbnail Image */}
                    <div className="aspect-[4/3] w-full overflow-hidden bg-[#EAE5DB] relative rounded-t-2xl">
                      {category.imageUrl ? (
                        <img
                          src={category.imageUrl}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out pointer-events-none"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#738273]">
                          <IconComp className="w-8 h-8 opacity-40" />
                        </div>
                      )}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-t from-[#263626]/80 via-transparent to-transparent" />
                      )}
                    </div>

                    {/* Text & Upward Arrow Button */}
                    <div className="p-3.5 sm:p-5 flex items-center justify-between gap-3 flex-grow">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#4ADE80]' : 'text-[#263626]'}`} />
                          <h3 className={`font-serif text-xs sm:text-base font-bold leading-tight ${isActive ? 'text-white' : 'text-[#181F18]'}`}>
                            {category.name}
                          </h3>
                        </div>
                        <p className={`text-[11px] sm:text-xs leading-snug line-clamp-2 ${isActive ? 'text-[#D5E2D5]' : 'text-[#5C665C]'}`}>
                          {category.description}
                        </p>
                      </div>

                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 ${isActive
                        ? 'bg-white text-[#263626] shadow-sm'
                        : 'bg-[#FAF9F5] border border-[#E5E1D8] group-hover:bg-[#263626] group-hover:text-white'
                        }`}>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* End-of-Slider Explore All Card */}
              <Link
                href="/workspaces"
                onClick={(e) => {
                  if (dragDistance > 10) e.preventDefault();
                }}
                className="group bg-gradient-to-br from-[#263626] to-[#141C14] text-white rounded-2xl border border-[#3A4D3A] p-4 sm:p-5 mb-4 sm:mb-5 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between w-[200px] sm:w-[230px] lg:w-[230px] shrink-0 snap-start min-h-[190px] sm:min-h-[220px]"
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#4ADE80]">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-white leading-snug">
                    Explore All Workspaces
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#E3EBE3]/80 leading-relaxed">
                    Discover bespoke enterprise wings, day passes, dedicated desks & suites.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-3">
                  <span className="text-xs font-mono text-[#A3D9A5] font-bold">
                    View All →
                  </span>
                  <div className="w-7 h-7 rounded-full bg-white/15 group-hover:bg-[#4ADE80] group-hover:text-[#181F18] flex items-center justify-center transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            </div>

            {/* ========================================================================= */}
            {/* DYNAMIC SUB-ITEMS DETAIL PANEL (Dark Green BG matching active category)  */}
            {/* ========================================================================= */}
            {currentActiveCategory && (
              <div
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                className="bg-[#263626] text-white rounded-2xl sm:rounded-3xl border-2 border-[#4E6B4E] p-4 sm:p-7 lg:p-8 shadow-2xl relative z-10 transition-all duration-500 -mt-0.5"
              >
                {/* Panel Top Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 sm:pb-6 border-b border-white/15 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="flex items-center gap-3 sm:gap-3.5">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/10 border border-white/15 text-white flex items-center justify-center shadow-md shrink-0">
                      <ActiveIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#4ADE80]" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg sm:text-2xl font-bold text-white leading-tight">
                        {currentActiveCategory.detailTitle}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#D5E2D5] font-sans mt-0.5 max-w-xl line-clamp-2 sm:line-clamp-none">
                        {currentActiveCategory.detailDescription}
                      </p>
                    </div>
                  </div>


                  {/* Desktop View All & Sub-item Scroll Controls */}
                  <div className="hidden sm:flex items-center gap-3 self-start sm:self-auto shrink-0 flex-wrap">
                    <Link
                      href={currentActiveCategory.link}
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#181F18] hover:text-[#263626] bg-white hover:bg-[#F2EEE7] px-5 py-2 rounded-full border border-white/20 shadow-md transition-all shrink-0"
                    >
                      <span>{currentActiveCategory.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#181F18]" />
                    </Link>

                    {/* Sub-item Carousel Arrow Buttons */}
                    {currentActiveCategory.subItems.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={slideSubLeft}
                          disabled={!canSubScrollLeft}
                          className={`w-8 h-8 rounded-full border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-xs ${canSubScrollLeft
                            ? 'bg-white/15 text-white hover:bg-white/25 hover:border-white/40'
                            : 'bg-white/5 text-white/30 border-white/10 cursor-not-allowed'
                            }`}
                          aria-label="Previous workspaces"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={slideSubRight}
                          disabled={!canSubScrollRight}
                          className={`w-8 h-8 rounded-full border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-xs ${canSubScrollRight
                            ? 'bg-white/15 text-white hover:bg-white/25 hover:border-white/40'
                            : 'bg-white/5 text-white/30 border-white/10 cursor-not-allowed'
                            }`}
                          aria-label="Next workspaces"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* MOBILE VIEW: Scrollable Vertical List + View All Button                   */}
                {/* ========================================================================= */}
                <div className="block md:hidden space-y-4">
                  {currentActiveCategory.subItems.length > 0 ? (
                    <div
                      className="max-h-[280px] sm:max-h-[300px] overflow-y-auto space-y-2.5 pr-1 py-1 rounded-xl"
                      style={{ scrollbarWidth: 'thin' }}
                    >
                      {currentActiveCategory.subItems.map((subItem) => (
                        <div
                          key={subItem.id}
                          className="bg-white rounded-xl border border-white/10 p-2.5 sm:p-3 shadow-xs flex items-center gap-3 transition-all text-[#181F18] shrink-0"
                        >
                          {/* Thumbnail Image */}
                          <div className="w-16 h-16 sm:w-20 sm:h-18 rounded-lg overflow-hidden shrink-0 bg-[#EAE5DB] relative">
                            <img
                              src={subItem.image}
                              alt={subItem.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>

                          {/* Title & Description */}
                          <div className="flex-1 min-w-0 pr-1">
                            <h4 className="font-serif font-bold text-xs sm:text-sm text-[#181F18] leading-tight mb-1 truncate">
                              {subItem.title}
                            </h4>
                            <p className="text-[11px] text-[#5C665C] font-sans leading-snug line-clamp-2">
                              {subItem.description}
                            </p>
                          </div>

                          {/* Action Group: Book Button + Arrow Mark */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Link
                              href={subItem.bookLink}
                              className="bg-[#263626] hover:bg-[#181F18] text-white text-[11px] font-semibold py-1.5 px-2.5 rounded-lg shadow-xs flex items-center gap-1 transition-colors"
                            >
                              <CalendarCheck className="w-3 h-3 text-[#4ADE80]" />
                              <span>Book</span>
                            </Link>

                            <Link
                              href={subItem.link}
                              className="w-7 h-7 rounded-lg bg-[#FAF9F5] hover:bg-[#263626] text-[#263626] hover:text-white border border-[#E5E1D8] flex items-center justify-center transition-all"
                              aria-label="View Details"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      ))}

                      {/* View All Button */}
                      <Link
                        href={currentActiveCategory.link}
                        className="w-full bg-white hover:bg-[#F2EEE7] text-[#181F18] font-bold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all shrink-0 mt-3"
                      >
                        <span>View All {currentActiveCategory.name}</span>
                        <ArrowRight className="w-4 h-4 text-[#181F18]" />
                      </Link>
                    </div>
                  ) : (
                    <div className="p-5 bg-white/10 rounded-xl border border-dashed border-white/20 text-center space-y-2 text-white">
                      <p className="text-xs font-semibold text-white">
                        No workspaces added under {currentActiveCategory.name} yet
                      </p>
                      <Link
                        href={currentActiveCategory.link}
                        className="inline-flex items-center gap-1.5 text-xs text-[#4ADE80] font-bold"
                      >
                        <span>Explore category details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}

                  {/* Mobile Included Highlights */}
                  <div className="pt-3 border-t border-white/15 space-y-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#A3D9A5] font-bold block">
                        INCLUDED HIGHLIGHTS
                      </span>
                      <Sparkles className="w-3.5 h-3.5 text-[#4ADE80]" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentActiveCategory.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-white text-[#181F18] border border-[#EBE6DC] text-xs font-medium"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                          <span className="leading-snug">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* DESKTOP VIEW: Swipeable Carousel of DB Workspaces + 7th View All Card     */}
                {/* ========================================================================= */}
                <div className="hidden md:grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                  {/* Left Swipeable Sub-Item Cards Carousel */}
                  <div className="lg:col-span-8 overflow-hidden">
                    <div
                      ref={subItemsScrollRef}
                      onMouseDown={handleSubMouseDown}
                      onMouseMove={handleSubMouseMove}
                      onMouseUp={handleSubMouseUp}
                      onMouseLeave={handleSubMouseLeave}
                      className={`flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory py-1 no-scrollbar items-stretch ${isSubMouseDown ? 'cursor-grabbing' : 'cursor-grab'
                        }`}
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {currentActiveCategory.subItems.length > 0 ? (
                        currentActiveCategory.subItems.map((subItem) => {
                          const defaultDates = getDefaultDates();
                          const { isAvailable, nextAvailableTimestamp } = checkWorkspaceAvailabilityDetailed(
                            subItem.bookings,
                            subItem.maintenanceBlocks,
                            defaultDates.startDate,
                            defaultDates.startTime,
                            defaultDates.endDate,
                            defaultDates.endTime
                          );
                          const finalBookLink = `${subItem.bookLink}&startDate=${defaultDates.startDate}&endDate=${defaultDates.endDate}&startTime=${encodeURIComponent(defaultDates.startTime)}&endTime=${encodeURIComponent(defaultDates.endTime)}`;

                          return (
                            <div
                              key={subItem.id}
                              className="group bg-white text-[#181F18] rounded-2xl border border-white/10 hover:border-white/30 overflow-hidden shadow-warm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between w-[210px] sm:w-[220px] shrink-0 snap-start select-none relative"
                            >
                              {/* Top Right: Booked Badge */}
                              {!isAvailable ? (
                                <div className="absolute top-2 right-2 z-10">
                                  <CountdownBadge targetTimestamp={nextAvailableTimestamp} className="!text-[9px] !px-2.5 !py-0.5" />
                                </div>
                              ) : subItem.badge ? (
                                <div className="absolute top-2 right-2 z-10">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E65100] text-white text-[9px] font-mono font-bold shadow-sm select-none">
                                    {subItem.badge}
                                  </span>
                                </div>
                              ) : null}

                              {/* Thumbnail Image */}
                              <div className="aspect-[16/11] w-full overflow-hidden bg-[#EAE5DB] relative">
                                <img
                                  src={subItem.image}
                                  alt={subItem.title}
                                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out pointer-events-none"
                                  loading="lazy"
                                />
                              </div>

                              {/* Text Details */}
                              <div className="p-3.5 flex flex-col justify-between flex-grow">
                                <div className="mb-3">
                                  <h4 className="font-serif font-bold text-xs sm:text-sm text-[#181F18] group-hover:text-[#263626] transition-colors leading-tight mb-1">
                                    {subItem.title}
                                  </h4>
                                  <p className="text-[11px] text-[#5C665C] font-sans leading-snug line-clamp-2">
                                    {subItem.description}
                                  </p>
                                </div>

                                {/* Card Footer with BOOK NOW Button & Direct Link */}
                                <div className="pt-2.5 border-t border-[#F2EEE7] flex items-center justify-between gap-2">
                                  {isAvailable ? (
                                    <Link
                                      href={finalBookLink}
                                      onClick={(e) => {
                                        if (subDragDistance > 10) e.preventDefault();
                                      }}
                                      className="flex-1 bg-[#263626] hover:bg-[#181F18] text-white text-[11px] font-semibold py-1.5 px-3 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                                    >
                                      <CalendarCheck className="w-3 h-3 text-[#4ADE80]" />
                                      <span>Book Now</span>
                                    </Link>
                                  ) : (
                                    <div className="flex-1 bg-[#E5E1D8] text-[#8C968C] text-[11px] font-semibold py-1.5 px-3 rounded-lg shadow-xs flex items-center justify-center gap-1.5 cursor-not-allowed">
                                      <CalendarCheck className="w-3 h-3 text-[#8C968C]" />
                                      <span>Not Available</span>
                                    </div>
                                  )}

                                  <Link
                                    href={subItem.link}
                                    onClick={(e) => {
                                      if (subDragDistance > 10) e.preventDefault();
                                    }}
                                    className="w-7 h-7 rounded-lg bg-[#FAF9F5] hover:bg-[#263626] text-[#263626] hover:text-white border border-[#E5E1D8] flex items-center justify-center transition-all shrink-0"
                                    title="View Details"
                                  >
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-6 bg-white/10 rounded-2xl border border-dashed border-white/20 flex flex-col justify-center items-center text-center w-[260px] shrink-0 text-white">
                          <p className="text-xs font-semibold text-white mb-1">
                            No workspaces added yet
                          </p>
                          <p className="text-[11px] text-[#D5E2D5] mb-3">
                            Workspaces added in this category will appear here.
                          </p>
                          <Link
                            href={currentActiveCategory.link}
                            className="text-xs text-[#4ADE80] font-bold underline"
                          >
                            Explore {currentActiveCategory.name}
                          </Link>
                        </div>
                      )}

                      {/* View All / Explore More Card */}
                      <Link
                        href={currentActiveCategory.link}
                        onClick={(e) => {
                          if (subDragDistance > 10) e.preventDefault();
                        }}
                        className="group bg-gradient-to-br from-[#1E2D1E] to-[#121B12] text-white rounded-2xl border border-white/15 hover:border-white/30 p-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between w-[190px] sm:w-[200px] shrink-0 snap-start select-none min-h-[220px]"
                      >
                        <div className="space-y-2">
                          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-[#4ADE80]">
                            <ActiveIcon className="w-4 h-4" />
                          </div>
                          <h4 className="font-serif font-bold text-sm text-white leading-tight">
                            View All {currentActiveCategory.name}
                          </h4>
                          <p className="text-[11px] text-[#E3EBE3]/80 leading-snug">
                            Explore our full collection of options & custom setups.
                          </p>
                        </div>

                        <div className="pt-3 border-t border-white/10 flex items-center justify-between mt-auto">
                          <span className="text-[11px] font-mono text-[#A3D9A5] font-bold">
                            View All →
                          </span>
                          <div className="w-6 h-6 rounded-full bg-white/15 group-hover:bg-[#4ADE80] group-hover:text-[#181F18] flex items-center justify-center transition-all">
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Right Feature Checklist & Visual Sidebar (4 cols on lg) */}
                  <div className="lg:col-span-4 bg-white text-[#181F18] rounded-2xl border border-white/10 p-5 shadow-2xl flex flex-col justify-between gap-5 h-full">
                    {/* 4 Feature Checklist Pills with rich interactive hover effects */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#738273] font-bold block">
                          INCLUDED HIGHLIGHTS
                        </span>
                        <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
                      </div>

                      {currentActiveCategory.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="group/pill flex items-center gap-2.5 p-2.5 rounded-xl bg-[#FAF9F5] hover:bg-[#EAE5DC] border border-[#EBE6DC] hover:border-[#263626]/40 text-xs text-[#263626] font-medium transition-all duration-200 cursor-pointer transform hover:scale-[1.02] hover:shadow-xs"
                        >
                          <div className="w-5 h-5 rounded-full bg-[#E8F5E9] group-hover/pill:bg-[#263626] flex items-center justify-center transition-colors shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32] group-hover/pill:text-[#4ADE80] transition-colors" />
                          </div>
                          <span className="group-hover/pill:text-[#181F18] font-semibold transition-colors leading-snug">
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Decorative Visual with Handwritten Tag */}
                    <div className="relative rounded-xl overflow-hidden border border-[#E5E1D8] bg-[#F2EEE7] p-4 flex items-center justify-between gap-3">
                      <div className="max-w-[140px]">
                        <p className="font-handwriting text-xl sm:text-2xl text-[#263626] leading-tight rotate-[-3deg]">
                          "{currentActiveCategory.handwrittenTag}"
                        </p>
                      </div>
                      <div className="w-20 h-16 rounded-lg overflow-hidden border border-[#E5E1D8] shadow-sm shrink-0 bg-[#EAE5DB]">
                        <img
                          src={currentActiveCategory.imageUrl}
                          alt={currentActiveCategory.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
