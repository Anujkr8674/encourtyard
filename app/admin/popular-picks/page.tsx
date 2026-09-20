'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Search,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ArrowUpRight,
  RefreshCw,
  CheckCircle2,
  Check,
  X,
  Building2,
  Layers,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useFeedbackModal } from '@/context/FeedbackModalContext';

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
}

export default function AdminPopularPicksPage() {
  const { showSuccess, showError } = useFeedbackModal();
  const [popularWorkspaces, setPopularWorkspaces] = useState<Workspace[]>([]);
  const [allWorkspaces, setAllWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [searchLibrary, setSearchLibrary] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');

  // Load Popular Picks and All Workspaces
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/popular-picks', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setPopularWorkspaces(data.workspaces || []);
        setAllWorkspaces(data.allWorkspaces || []);
      }
    } catch (err) {
      console.error('Failed to load popular picks admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save current order of featured IDs
  const savePopularPicks = async (updatedList: Workspace[]) => {
    try {
      setSaving(true);
      const featuredIds = updatedList.map((w) => w.id).slice(0, 10);
      const res = await fetch('/api/popular-picks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featuredIds }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess('Top 10 Popular Picks updated & published to homepage!');
        showSuccess({
          variant: 'minimal',
          title: 'Popular Picks Saved',
          message: 'Top 10 workspace selection and display order updated successfully.',
          primaryBtnText: 'Okay',
          autoCloseMs: 2000,
        });
        setTimeout(() => setSaveSuccess(''), 3000);
      }
    } catch (err: any) {
      console.error('Failed to save popular picks:', err);
      showError({
        variant: 'cta',
        title: 'Save Failed',
        message: err.message || 'Could not update Popular Picks list.',
        primaryBtnText: 'Try Again',
      });
    } finally {
      setSaving(false);
    }
  };

  // Reorder Item UP
  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...popularWorkspaces];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setPopularWorkspaces(updated);
    savePopularPicks(updated);
  };

  // Reorder Item DOWN
  const moveDown = (index: number) => {
    if (index === popularWorkspaces.length - 1) return;
    const updated = [...popularWorkspaces];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setPopularWorkspaces(updated);
    savePopularPicks(updated);
  };

  // Remove Workspace from Top 10
  const removeFeatured = (id: string) => {
    const updated = popularWorkspaces.filter((w) => w.id !== id);
    setPopularWorkspaces(updated);
    savePopularPicks(updated);
  };

  // Add Workspace into Top 10
  const addFeatured = (ws: Workspace) => {
    if (popularWorkspaces.some((w) => w.id === ws.id)) return;
    if (popularWorkspaces.length >= 10) {
      showError({
        variant: 'warning',
        title: 'Top 10 Limit Reached',
        message: 'Maximum of 10 workspaces allowed in the Popular Picks slider. Please remove one first.',
        primaryBtnText: 'Okay',
      });
      return;
    }
    const updated = [...popularWorkspaces, ws];
    setPopularWorkspaces(updated);
    savePopularPicks(updated);
  };

  // Reset to default latest 10
  const resetToLatest = () => {
    const latest10 = allWorkspaces.slice(0, 10);
    setPopularWorkspaces(latest10);
    savePopularPicks(latest10);
    showSuccess({
      variant: 'cta',
      title: 'Reset to Latest Workspaces',
      message: 'The top 10 popular picks have been reset to the most recent workspaces.',
      primaryBtnText: 'Done',
      autoCloseMs: 2000,
    });
  };

  // Categories list for filtering
  const categoriesList = Array.from(new Set(allWorkspaces.map((w) => w.categoryName))).filter(Boolean);

  // Filter Library
  const filteredLibrary = allWorkspaces.filter((w) => {
    const matchCat = filterCategory === 'ALL' || w.categoryName === filterCategory;
    const matchSearch =
      w.title.toLowerCase().includes(searchLibrary.toLowerCase()) ||
      w.categoryName.toLowerCase().includes(searchLibrary.toLowerCase()) ||
      w.shortDescription.toLowerCase().includes(searchLibrary.toLowerCase());
    return matchCat && matchSearch;
  });

  const featuredIdSet = new Set(popularWorkspaces.map((w) => w.id));

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-[#E0DCD3] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-mono font-bold uppercase tracking-wider">
              HOMEPAGE SLIDER CURATION
            </span>
            <span className="text-xs text-[#5C665C] font-mono hidden md:inline">
              Slider Capacity: Max 10 Cards
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18] tracking-tight">
            Popular Picks Manager ({popularWorkspaces.length}/10)
          </h1>
          <p className="text-xs sm:text-sm text-[#5C665C] mt-0.5">
            Curate and arrange the order of the Top 10 workspaces featured on the homepage "POPULAR PICKS" slider.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          <Link
            href="/#popular-picks"
            target="_blank"
            className="h-11 px-4 py-2 rounded-2xl bg-white hover:bg-[#FAF9F5] border border-[#E0DCD3] hover:border-[#2E7D32]/50 text-[#181F18] text-xs font-semibold flex items-center gap-2 transition-all shadow-xs shrink-0 whitespace-nowrap cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#2E7D32]" />
            <span>Preview Live Slider</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#5C665C]" />
          </Link>

          <button
            type="button"
            onClick={resetToLatest}
            className="h-11 px-4 py-2 rounded-2xl bg-[#FAF9F5] hover:bg-[#EAE5DC] text-[#181F18] border border-[#E0DCD3] text-xs font-semibold flex items-center gap-2 transition-all shrink-0 whitespace-nowrap cursor-pointer"
            title="Auto-fill with latest 10 workspaces"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>Reset to Latest</span>
          </button>
        </div>
      </div>

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{saveSuccess}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccess('')}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Grid: Top 10 Featured (Left) & Full Library (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: TOP 10 CURATED SLIDER ORDER (UP/DOWN REORDERING)            */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-[#E0DCD3] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E0DCD3] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2E7D32]" />
                <h2 className="font-serif text-base font-bold text-[#181F18]">
                  Currently Featured in Slider ({popularWorkspaces.length}/10)
                </h2>
              </div>
              <span className="text-[11px] text-[#5C665C] font-mono">
                Use arrows to change display order
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-[#5C665C] flex flex-col items-center gap-2">
                <RefreshCw className="w-6 h-6 text-[#2E7D32] animate-spin" />
                <span className="text-xs font-mono">Loading Popular Picks...</span>
              </div>
            ) : popularWorkspaces.length === 0 ? (
              <div className="py-10 text-center space-y-2 border border-dashed border-[#D0C9BE] rounded-2xl bg-[#FAF9F5] p-6">
                <p className="text-xs font-semibold text-[#181F18]">
                  No workspaces selected for Popular Picks
                </p>
                <p className="text-[11px] text-[#5C665C]">
                  Click the "+ Add" button on any workspace from the library on the right.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {popularWorkspaces.map((ws, index) => {
                  const firstMedia = ws.mediaUrls?.[0];
                  const isFirst = index === 0;
                  const isLast = index === popularWorkspaces.length - 1;

                  return (
                    <div
                      key={ws.id}
                      className="p-3 rounded-2xl bg-[#FAF9F5] hover:bg-white border border-[#E0DCD3] hover:border-[#2E7D32]/60 transition-all flex items-center justify-between gap-3 shadow-2xs group"
                    >
                      {/* Left: Position Badge & Reorder Arrows */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="w-7 h-7 rounded-xl bg-[#2E7D32] text-white text-xs font-mono font-bold flex items-center justify-center shadow-xs">
                          #{index + 1}
                        </span>

                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            onClick={() => moveUp(index)}
                            disabled={isFirst}
                            className={`w-6 h-4 rounded flex items-center justify-center transition-colors ${
                              isFirst
                                ? 'text-gray-300 cursor-not-allowed opacity-40'
                                : 'text-[#5C665C] hover:bg-[#2E7D32] hover:text-white cursor-pointer'
                            }`}
                            title="Move Workspace Up (#1 comes first in slider)"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveDown(index)}
                            disabled={isLast}
                            className={`w-6 h-4 rounded flex items-center justify-center transition-colors ${
                              isLast
                                ? 'text-gray-300 cursor-not-allowed opacity-40'
                                : 'text-[#5C665C] hover:bg-[#2E7D32] hover:text-white cursor-pointer'
                            }`}
                            title="Move Workspace Down"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Middle: Thumbnail & Title Info */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#EAE5DB] border border-[#E0DCD3] shrink-0">
                          <img
                            src={firstMedia?.url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80'}
                            alt={ws.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="px-2 py-0.2 rounded-md bg-white border border-[#E0DCD3] text-[10px] font-bold text-[#1B5E20]">
                              {ws.categoryName}
                            </span>
                            {ws.price && (
                              <span className="text-[10px] text-[#5C665C] font-mono">
                                · {ws.price}
                              </span>
                            )}
                          </div>
                          <h3 className="font-serif text-xs sm:text-sm font-bold text-[#181F18] truncate">
                            {ws.title}
                          </h3>
                        </div>
                      </div>

                      {/* Right: Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeFeatured(ws.id)}
                        className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 hover:border-red-500 flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-2xs"
                        title="Remove from Top 10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: FULL WORKSPACES INVENTORY LIBRARY (+ ADD TO TOP 10)        */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-[#E0DCD3] shadow-sm space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-serif text-base font-bold text-[#181F18]">
                  Workspace Inventory Library
                </h2>
                <span className="text-[11px] text-[#6A806A] font-mono">
                  {allWorkspaces.length} Total
                </span>
              </div>
              <p className="text-[11px] text-[#5C665C]">
                Search and click "+ Add" to include in the Top 10 Popular Picks slider.
              </p>
            </div>

            {/* Filter Toolbar */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#6A806A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchLibrary}
                  onChange={(e) => setSearchLibrary(e.target.value)}
                  placeholder="Search by name, category..."
                  className="w-full pl-8 pr-3 py-1.5 bg-[#FAF9F5] border border-[#E0DCD3] focus:border-[#2E7D32] rounded-xl text-xs text-[#181F18] outline-none"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#FAF9F5] border border-[#E0DCD3] focus:border-[#2E7D32] rounded-xl text-xs text-[#181F18] outline-none font-medium"
              >
                <option value="ALL">All Categories ({categoriesList.length})</option>
                {categoriesList.map((catName) => (
                  <option key={catName} value={catName}>
                    {catName}
                  </option>
                ))}
              </select>
            </div>

            {/* Workspaces Scrollable List */}
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {filteredLibrary.length === 0 ? (
                <p className="py-6 text-center text-xs text-[#5C665C]">
                  No matching workspaces found.
                </p>
              ) : (
                filteredLibrary.map((ws) => {
                  const isFeatured = featuredIdSet.has(ws.id);
                  const firstMedia = ws.mediaUrls?.[0];

                  return (
                    <div
                      key={ws.id}
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 ${
                        isFeatured
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : 'bg-[#FAF9F5] hover:bg-white border-[#E0DCD3] hover:border-[#2E7D32]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#EAE5DB] border border-[#E0DCD3] shrink-0">
                          <img
                            src={firstMedia?.url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80'}
                            alt={ws.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-serif text-xs font-bold text-[#181F18] truncate">
                            {ws.title}
                          </h4>
                          <span className="text-[10px] text-[#5C665C] block truncate font-mono">
                            {ws.categoryName}
                          </span>
                        </div>
                      </div>

                      {/* Action / Added Status */}
                      {isFeatured ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-[#1B5E20] text-[10px] font-bold shrink-0">
                          <Check className="w-3 h-3 text-[#2E7D32]" />
                          <span>Featured</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addFeatured(ws)}
                          disabled={popularWorkspaces.length >= 10}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all shrink-0 cursor-pointer ${
                            popularWorkspaces.length >= 10
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white hover:bg-[#2E7D32] text-[#181F18] hover:text-white border border-[#E0DCD3] hover:border-[#2E7D32] shadow-2xs'
                          }`}
                        >
                          <Plus className="w-3 h-3" />
                          <span>+ Add</span>
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
