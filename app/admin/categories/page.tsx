'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Layers,
  Plus,
  Search,
  Check,
  X,
  Trash2,
  Edit2,
  Eye,
  AlertCircle,
  RefreshCw,
  FolderUp,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Building2,
  Laptop,
  Users,
  Briefcase,
  Mic,
  CheckCircle2,
  Tag,
  Wand2,
  RotateCcw,
  MoveUp,
  MoveDown,
  PlusCircle,
  XCircle,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Rich Curated Feature Badges Grouped by Space Category
export const PRESET_BADGE_GROUPS = [
  {
    groupName: 'Executive & Private Offices',
    icon: Building2,
    badges: [
      '24/7 Biometric keyless access',
      'Acoustic soundproofing walls',
      'Dedicated 1Gbps fiber VLAN',
      'Daily executive concierge service',
      'Private internal executive restroom',
      'Dedicated soundproof phone booth'
    ]
  },
  {
    groupName: 'Desks & Shared Spaces',
    icon: Layers,
    badges: [
      'High-speed WiFi 6 & LAN drops',
      'Ergonomic seating & motorized standing desk',
      'Access to common botanical lounges & phone booths',
      'Weekly networking masterclasses & community mixer',
      'Lockable pedestal storage unit',
      'Unlimited artisanal espresso & tea bar'
    ]
  },
  {
    groupName: 'Hot Desks & Flexible Passes',
    icon: Laptop,
    badges: [
      'Unrestricted flex zone seating across all floors',
      'Unlimited artisanal espresso & gourmet tea bar',
      'Access to soundproof phone booths for calls',
      'Exclusive access to community networking events',
      'Open-air terrace workstation access',
      'Quiet focus library zone pass'
    ]
  },
  {
    groupName: 'Meeting & Boardrooms',
    icon: Users,
    badges: [
      'Dual Sony 4K Pro HDR Displays',
      'Neat Bar Pro AI video conferencing auto-tracking',
      'Ceiling-integrated beamforming acoustic mics',
      'Direct butler concierge service for tea & catering',
      'Magnetic anti-glare glass whiteboard',
      'Dedicated conference breakout lounge'
    ]
  },
  {
    groupName: 'Team Spaces & Enterprise',
    icon: Briefcase,
    badges: [
      'Private internal 6-person meeting pod inside your suite',
      'Dedicated server rack / private subnet VLAN',
      'Custom corporate wall branding & signboards',
      'Dedicated enterprise account & concierge manager',
      'Private team pantry & beverage station',
      'Custom floor layout buildout'
    ]
  },
  {
    groupName: 'Virtual Offices & Mail',
    icon: Building2,
    badges: [
      'Prestigious prime commercial address for GST & MCA',
      'Daily mail handling & digital package scanning notifications',
      'Discounted meeting room member rates across all centers',
      'Dedicated local telephone answering with IVR greeting',
      '4 monthly coworking lounge day passes included',
      'Multi-city enterprise address registration'
    ]
  },
  {
    groupName: 'Podcast & Media Studios',
    icon: Mic,
    badges: [
      'Acoustic double-wall sound isolation booth (STC 65)',
      '4x Shure SM7B broadcast dynamic microphones with Cloudlifters',
      'Dual Blackmagic Cinema 4K studio cameras & softbox lights',
      'Rødecaster Pro II audio mixing console with instant multi-track',
      'Low-latency gigabit fiber with teleprompter & stream deck',
      'Professional DAW sound engineering workstation'
    ]
  }
];

// Quick Full-Packs (4 Items)
export const FULL_PRESET_PACKS = [
  {
    name: 'Executive Office Pack',
    icon: Building2,
    features: [
      '24/7 Biometric keyless access',
      'Acoustic soundproofing walls',
      'Dedicated 1Gbps fiber VLAN',
      'Daily executive concierge service'
    ]
  },
  {
    name: 'Dedicated Desks Pack',
    icon: Layers,
    features: [
      'High-speed WiFi 6 & LAN drops',
      'Ergonomic seating & motorized standing desk',
      'Access to common botanical lounges & phone booths',
      'Weekly networking masterclasses & community mixer'
    ]
  },
  {
    name: 'Hot Desks Pack',
    icon: Laptop,
    features: [
      'Unrestricted flex zone seating across all floors',
      'Unlimited artisanal espresso & gourmet tea bar',
      'Access to soundproof phone booths for calls',
      'Exclusive access to community networking events'
    ]
  },
  {
    name: 'Boardroom Pack',
    icon: Users,
    features: [
      'Dual Sony 4K Pro HDR Displays',
      'Neat Bar Pro AI video conferencing auto-tracking',
      'Ceiling-integrated beamforming acoustic mics',
      'Direct butler concierge service for tea & catering'
    ]
  },
  {
    name: 'Team Space Pack',
    icon: Briefcase,
    features: [
      'Private internal 6-person meeting pod inside your suite',
      'Dedicated server rack / private subnet VLAN',
      'Custom corporate wall branding & signboards',
      'Dedicated enterprise account & concierge manager'
    ]
  },
  {
    name: 'Podcast Studio Pack',
    icon: Mic,
    features: [
      'Acoustic double-wall sound isolation booth (STC 65)',
      '4x Shure SM7B broadcast dynamic microphones with Cloudlifters',
      'Dual Blackmagic Cinema 4K studio cameras & softbox lights',
      'Rødecaster Pro II audio mixing console with instant multi-track'
    ]
  }
];

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  capacity?: string | null;
  badge?: string | null;
  features?: string[];
  order: number;
  isActive: boolean;
  createdAt: string | Date;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCapacity, setFormCapacity] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formOrder, setFormOrder] = useState<number>(1);
  const [formIsActive, setFormIsActive] = useState(true);

  // Granular Dynamic Feature Highlights State (Up to 4 Items)
  const [formFeatures, setFormFeatures] = useState<string[]>([
    'High-speed WiFi 6 & VLAN connectivity',
    'Acoustic soundproofing & ergonomic furniture',
    'Access to botanical lounges & espresso bar',
    '24/7 keyless access & concierge support'
  ]);
  const [activeBadgeCategoryTab, setActiveBadgeCategoryTab] = useState<number>(0);
  const [featureMessage, setFeatureMessage] = useState<string>('');

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusText, setUploadStatusText] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch categories on mount
  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/categories', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Reset pagination on search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Handle local file selection & immediate preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (JPEG, PNG, WebP, SVG)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFormError('Image size exceeds 10MB limit');
      return;
    }

    setFormError('');
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  // Upload image to Supabase Bucket 'encourtyard-upload/category' with progress tracking
  const uploadImageToSupabase = async (file: File): Promise<string> => {
    setUploading(true);
    setUploadProgress(0);
    setUploadStatusText('Connecting to Supabase Storage (encourtyard-upload/category)...');

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 90);
          setUploadProgress(percentComplete);
          const kbLoaded = (event.loaded / 1024).toFixed(1);
          const kbTotal = (event.total / 1024).toFixed(1);
          setUploadStatusText(`Uploading ${kbLoaded} KB of ${kbTotal} KB (${percentComplete}%)...`);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            setUploadProgress(100);
            setUploadStatusText('Upload to Supabase completed successfully!');
            resolve(response.url);
          } catch {
            setUploadProgress(100);
            resolve(previewUrl);
          }
        } else {
          try {
            const errRes = JSON.parse(xhr.responseText);
            reject(new Error(errRes.error || 'Upload failed'));
          } catch {
            reject(new Error('Server responded with upload error'));
          }
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error occurred during Supabase storage upload'));
      };

      xhr.open('POST', '/api/admin/categories/upload', true);
      xhr.send(formData);
    });
  };

  // =========================================================================
  // GRANULAR HIGHLIGHTS CRUD & SORTING LOGIC
  // =========================================================================

  // Update specific highlight text
  const handleFeatureChange = (index: number, value: string) => {
    const updated = [...formFeatures];
    updated[index] = value;
    setFormFeatures(updated);
    setFeatureMessage('');
  };

  // Remove individual highlight by index ("X" Button)
  const removeFeature = (index: number) => {
    const updated = formFeatures.filter((_, i) => i !== index);
    setFormFeatures(updated);
    setFeatureMessage(`Removed highlight #${index + 1}. You can add another or pick from badges below.`);
  };

  // Move highlight UP in order
  const moveFeatureUp = (index: number) => {
    if (index === 0) return;
    const updated = [...formFeatures];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setFormFeatures(updated);
    setFeatureMessage(`Moved highlight #${index + 1} up to position #${index}.`);
  };

  // Move highlight DOWN in order
  const moveFeatureDown = (index: number) => {
    if (index === formFeatures.length - 1) return;
    const updated = [...formFeatures];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setFormFeatures(updated);
    setFeatureMessage(`Moved highlight #${index + 1} down to position #${index + 2}.`);
  };

  // Add empty custom highlight slot (up to 4 max)
  const addEmptyFeature = () => {
    if (formFeatures.length >= 4) {
      setFeatureMessage('Maximum of 4 highlights allowed per category.');
      return;
    }
    setFormFeatures([...formFeatures, '']);
    setFeatureMessage(`Added slot #${formFeatures.length + 1}. Type your custom highlight text.`);
  };

  // Toggle or add individual preset badge
  const togglePresetBadge = (badgeText: string) => {
    const existingIndex = formFeatures.findIndex(
      (f) => f.trim().toLowerCase() === badgeText.trim().toLowerCase()
    );

    if (existingIndex >= 0) {
      // If already present, remove it
      removeFeature(existingIndex);
      setFeatureMessage(`Removed "${badgeText}".`);
    } else {
      // If not present, add it if slot available
      if (formFeatures.length >= 4) {
        // If there's an empty slot, fill it
        const emptyIndex = formFeatures.findIndex((f) => !f.trim());
        if (emptyIndex >= 0) {
          const updated = [...formFeatures];
          updated[emptyIndex] = badgeText;
          setFormFeatures(updated);
          setFeatureMessage(`Added "${badgeText}" into position #${emptyIndex + 1}.`);
          return;
        }

        setFeatureMessage('4 Highlights limit reached. Click the "X" button on any highlight above to replace it with this badge.');
        return;
      }

      setFormFeatures([...formFeatures, badgeText]);
      setFeatureMessage(`Added "${badgeText}" to highlights.`);
    }
  };

  // Apply complete 4-item pack in one click
  const applyFullPack = (pack: typeof FULL_PRESET_PACKS[0]) => {
    setFormFeatures([...pack.features]);
    setFeatureMessage(`Loaded 4-item pack: "${pack.name}". You can reorder, edit, or remove any with the "X" button.`);
  };

  // Clear all features
  const clearAllFeatures = () => {
    setFormFeatures([]);
    setFeatureMessage('Cleared all highlights. Click badges below or "+ Add Custom Highlight" to select up to 4 items.');
  };

  // Reset Features to standard default 4
  const resetFeaturesToDefault = () => {
    setFormFeatures([
      'High-speed WiFi 6 & VLAN connectivity',
      'Acoustic soundproofing & ergonomic furniture',
      'Access to botanical lounges & espresso bar',
      '24/7 keyless access & concierge support'
    ]);
    setFeatureMessage('Reset highlights to standard 4 defaults.');
  };

  // Submit Category Form (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formName.trim()) {
      setFormError('Category name/heading is required');
      return;
    }
    if (!formDescription.trim()) {
      setFormError('Short description is required');
      return;
    }

    // Clean features (filter empty, strictly 4 items max)
    const cleanedFeatures = formFeatures
      .map((f) => f.trim())
      .filter((f) => f.length > 0)
      .slice(0, 4);

    if (cleanedFeatures.length === 0) {
      setFormError('Please add at least 1 feature highlight or choose from the badges below');
      return;
    }

    let finalImageUrl = formImageUrl.trim();

    // If a new local file is selected, upload to Supabase first
    if (selectedFile) {
      try {
        finalImageUrl = await uploadImageToSupabase(selectedFile);
        setFormImageUrl(finalImageUrl);
      } catch (err: any) {
        setFormError(`Image upload failed: ${err.message}`);
        setUploading(false);
        return;
      }
    }

    if (!finalImageUrl) {
      setFormError('Please select and upload an image for this category');
      return;
    }

    try {
      const payload = {
        name: formName.trim(),
        description: formDescription.trim(),
        imageUrl: finalImageUrl,
        capacity: formCapacity.trim() || null,
        badge: formBadge.trim() || null,
        features: cleanedFeatures,
        order: Number(formOrder) || 1,
        isActive: formIsActive,
      };

      if (editingCategory) {
        // Update existing
        const res = await fetch(`/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update category');
        setFormSuccess('Category and highlights updated successfully!');
      } else {
        // Create new
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create category');
        setFormSuccess('Category created successfully!');
      }

      await loadCategories();
      setTimeout(() => {
        closeModal();
      }, 600);
    } catch (err: any) {
      setFormError(err.message || 'An error occurred');
    } finally {
      setUploading(false);
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormName('');
    setFormDescription('');
    setFormCapacity('');
    setFormBadge('');
    setFormImageUrl('');
    setFormOrder(categories.length + 1);
    setFormIsActive(true);
    setFormFeatures([
      'High-speed WiFi 6 & VLAN connectivity',
      'Acoustic soundproofing & ergonomic furniture',
      'Access to botanical lounges & espresso bar',
      '24/7 keyless access & concierge support'
    ]);
    setFeatureMessage('');
    setSelectedFile(null);
    setPreviewUrl('');
    setUploadProgress(0);
    setFormError('');
    setFormSuccess('');
    setModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormName(category.name);
    setFormDescription(category.description);
    setFormCapacity(category.capacity || '');
    setFormBadge(category.badge || '');
    setFormImageUrl(category.imageUrl);
    setFormOrder(typeof category.order === 'number' ? category.order : 1);
    setFormIsActive(category.isActive);

    // Populate existing features (up to 4)
    if (Array.isArray(category.features) && category.features.length > 0) {
      setFormFeatures(category.features.slice(0, 4));
    } else {
      setFormFeatures([
        'High-speed WiFi 6 & VLAN connectivity',
        'Acoustic soundproofing & ergonomic furniture',
        'Access to botanical lounges & espresso bar',
        '24/7 keyless access & concierge support'
      ]);
    }

    setFeatureMessage('');
    setSelectedFile(null);
    setPreviewUrl(category.imageUrl);
    setUploadProgress(0);
    setFormError('');
    setFormSuccess('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
    setSelectedFile(null);
    setPreviewUrl('');
    setUploading(false);
    setFeatureMessage('');
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the category "${name}"?`)) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase()) ||
    (c.badge && c.badge.toLowerCase().includes(search.toLowerCase())) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination Slice
  const totalItems = filteredCategories.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Banner Header with Clean, Balanced Layout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-[#E0DCD3] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#2E7D32] text-[10px] font-mono font-bold uppercase tracking-wider">
              PUBLIC HOME SECTION & FEATURES
            </span>
            <span className="text-xs text-[#5C665C] font-mono hidden md:inline">
              Storage: encourtyard-upload/category
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18] tracking-tight">
            Workspace Categories ({categories.length})
          </h1>
          <p className="text-xs sm:text-sm text-[#5C665C] mt-0.5">
            Manage category items, image uploads, sorting order, and individually customizable 4-bullet "Included Highlights".
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          <Link
            href="/#categories"
            target="_blank"
            className="h-11 px-4 py-2 rounded-2xl bg-white hover:bg-[#FAF9F5] border border-[#E0DCD3] hover:border-[#2E7D32]/50 text-[#181F18] text-xs font-semibold flex items-center gap-2 transition-all shadow-xs shrink-0 whitespace-nowrap cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#2E7D32]" />
            <span>Preview Live Site</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#5C665C]" />
          </Link>

          <button
            type="button"
            onClick={openCreateModal}
            className="h-11 px-5 py-2 rounded-2xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white shadow-md flex items-center gap-2 text-xs font-bold transition-all shrink-0 whitespace-nowrap cursor-pointer hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Category</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E0DCD3] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#6A806A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by category name, description, badge..."
            className="w-full pl-9 pr-4 py-2 bg-[#FAF9F5] border border-[#E0DCD3] focus:border-[#2E7D32] rounded-xl text-xs text-[#181F18] outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-[#6A806A] font-mono">
            Showing {totalItems === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + pageSize, totalItems)} of {totalItems} categories
          </span>
          <button
            type="button"
            onClick={loadCategories}
            className="p-2 rounded-xl bg-[#FAF9F5] hover:bg-[#E3EBE3] border border-[#E0DCD3] text-[#181F18] text-xs transition-colors cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#2E7D32] ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Categories Data Table */}
      <div className="bg-white border border-[#E0DCD3] rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E0DCD3] text-[#6A806A] font-mono uppercase text-[11px] tracking-wider">
                <th className="py-4 px-4 w-16 text-center">Order</th>
                <th className="py-4 px-4 w-20">Thumbnail</th>
                <th className="py-4 px-4">Category Heading</th>
                <th className="py-4 px-4">Slug / Route</th>
                <th className="py-4 px-4">Included Highlights (Ordered 4 Bullets)</th>
                <th className="py-4 px-4">Capacity / Badge</th>
                <th className="py-4 px-4">Storage & Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E0DCD3]/70">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#5C665C]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-6 h-6 text-[#2E7D32] animate-spin" />
                      <span className="text-xs font-mono">Loading categories from database...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedCategories.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#5C665C]">
                    <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#2E7D32] flex items-center justify-center mb-1">
                        <Layers className="w-6 h-6" />
                      </div>
                      <span className="font-serif text-sm font-bold text-[#181F18]">No Categories Found</span>
                      <span className="text-xs text-[#5C665C]">
                        {search ? 'No categories matched your search criteria.' : 'Click "Create New Category" to add your first category.'}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCategories.map((category) => {
                  const featureList = Array.isArray(category.features) && category.features.length > 0
                    ? category.features
                    : [
                        'High-speed WiFi 6 & VLAN connectivity',
                        'Acoustic soundproofing & ergonomic furniture',
                        'Access to botanical lounges & espresso bar',
                        '24/7 keyless access & concierge support'
                      ];

                  return (
                    <tr key={category.id} className="hover:bg-[#FAF9F5] transition-colors group">
                      {/* Sort Order Position */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#FAF9F5] border border-[#E0DCD3] font-mono font-bold text-xs text-[#181F18]">
                          {category.order || 1}
                        </span>
                      </td>

                      {/* Thumbnail Image */}
                      <td className="py-3.5 px-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#EAE5DB] border border-[#E0DCD3] shadow-xs relative shrink-0">
                          <img
                            src={category.imageUrl}
                            alt={category.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                        </div>
                      </td>

                      {/* Category Heading */}
                      <td className="py-3.5 px-4">
                        <span className="font-serif text-sm font-bold text-[#181F18] block leading-snug">
                          {category.name}
                        </span>
                        <p className="text-[11px] text-[#5C665C] line-clamp-1 max-w-[180px] mt-0.5">
                          {category.description}
                        </p>
                      </td>

                      {/* Slug */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-1 rounded-md bg-[#FAF9F5] border border-[#E0DCD3] font-mono text-[11px] text-[#2E7D32] font-semibold">
                          /{category.slug}
                        </span>
                      </td>

                      {/* 4 Feature Highlights Preview with numbering */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#2E7D32]">
                            <Sparkles className="w-3 h-3" />
                            <span>{featureList.length} Highlights Configured</span>
                          </div>
                          <ul className="space-y-1">
                            {featureList.map((feat, i) => (
                              <li key={i} className="text-[11px] text-[#263626] flex items-center gap-1.5 truncate">
                                <span className="w-4 h-4 rounded-full bg-emerald-50 text-[#2E7D32] border border-emerald-200 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                                  {i + 1}
                                </span>
                                <span className="truncate">{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </td>

                      {/* Capacity / Badge */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          {category.badge && (
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              {category.badge}
                            </span>
                          )}
                          {category.capacity && (
                            <span className="block text-[11px] text-[#5C665C] font-mono">
                              {category.capacity}
                            </span>
                          )}
                          {!category.badge && !category.capacity && (
                            <span className="text-[11px] text-[#A3B0A3]">—</span>
                          )}
                        </div>
                      </td>

                      {/* Storage & Status */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                              category.isActive
                                ? 'bg-emerald-50 text-[#2E7D32] border border-emerald-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                category.isActive ? 'bg-[#2E7D32] animate-pulse' : 'bg-red-500'
                              }`}
                            />
                            {category.isActive ? 'Active on Homepage' : 'Hidden'}
                          </span>
                          <span className="block text-[10px] text-[#6A806A] font-mono">
                            Supabase Stored
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <Link
                            href="/#categories"
                            target="_blank"
                            className="p-2 rounded-xl bg-[#FAF9F5] hover:bg-emerald-50 text-[#181F18] hover:text-[#2E7D32] border border-[#E0DCD3] transition-colors"
                            title="View on Homepage"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#2E7D32]" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => openEditModal(category)}
                            className="p-2 rounded-xl bg-[#FAF9F5] hover:bg-emerald-50 text-[#181F18] hover:text-[#2E7D32] border border-[#E0DCD3] transition-colors cursor-pointer"
                            title="Edit Category, Order & Badges"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(category.id, category.name)}
                            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalItems > 0 && (
          <div className="p-4 border-t border-[#E0DCD3] bg-[#FAF9F5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-[#5C665C] font-mono">
              Page {currentPage} of {totalPages} ({totalItems} total categories)
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-xl border border-[#E0DCD3] flex items-center gap-1 font-semibold transition-all ${
                  currentPage === 1
                    ? 'bg-[#EAE5DC] text-[#A3B0A3] opacity-50 cursor-not-allowed'
                    : 'bg-white text-[#181F18] hover:bg-[#2E7D32] hover:text-white hover:border-[#2E7D32] cursor-pointer shadow-xs'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                      currentPage === pageNum
                        ? 'bg-[#2E7D32] text-white shadow-sm'
                        : 'bg-white hover:bg-[#EAE5DC] text-[#181F18] border border-[#E0DCD3] cursor-pointer'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 rounded-xl border border-[#E0DCD3] flex items-center gap-1 font-semibold transition-all ${
                  currentPage === totalPages
                    ? 'bg-[#EAE5DC] text-[#A3B0A3] opacity-50 cursor-not-allowed'
                    : 'bg-white text-[#181F18] hover:bg-[#2E7D32] hover:text-white hover:border-[#2E7D32] cursor-pointer shadow-xs'
                }`}
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: Category Form with Individual Badge Selection, X & Sorting Controls */}
      {/* ========================================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={closeModal}
          />

          <div className="relative z-10 w-full max-w-3xl bg-white rounded-3xl border border-[#E0DCD3] shadow-2xl overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#E0DCD3] bg-[#FAF9F5] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#2E7D32] block">
                  CATEGORY DETAILS & INCLUDED HIGHLIGHTS
                </span>
                <h2 className="font-serif text-xl font-bold text-[#181F18] mt-0.5">
                  {editingCategory ? 'Edit Workspace Category' : 'Create Workspace Category'}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[82vh] overflow-y-auto font-sans">
              {/* Status Alerts */}
              {formError && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{formError}</span>
                </div>
              )}
              {formSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{formSuccess}</span>
                </div>
              )}

              {/* 1. Category Heading & Display Order Row */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                <div className="sm:col-span-8">
                  <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider mb-1.5">
                    Category Name / Heading <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Private Offices, Dedicated Desks, Hot Desks, Meeting Rooms"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E0DCD3] bg-[#FAF9F5] text-xs text-[#181F18] focus:outline-none focus:border-[#2E7D32] focus:bg-white transition-all font-medium"
                  />
                </div>

                {/* Display Sort Order Position */}
                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider mb-1.5">
                    Carousel Sort Order Position
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setFormOrder((o) => Math.max(1, o - 1))}
                      className="w-9 h-9 rounded-xl border border-[#E0DCD3] bg-[#FAF9F5] hover:bg-[#EAE5DC] text-[#181F18] font-bold text-sm flex items-center justify-center transition-colors cursor-pointer"
                      title="Decrease order"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={formOrder}
                      onChange={(e) => setFormOrder(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full text-center py-2 bg-[#FAF9F5] border border-[#E0DCD3] rounded-xl text-xs font-mono font-bold text-[#181F18] focus:border-[#2E7D32] focus:bg-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setFormOrder((o) => o + 1)}
                      className="w-9 h-9 rounded-xl border border-[#E0DCD3] bg-[#FAF9F5] hover:bg-[#EAE5DC] text-[#181F18] font-bold text-sm flex items-center justify-center transition-colors cursor-pointer"
                      title="Increase order"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Short Description */}
              <div>
                <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider mb-1.5">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. A focused space to do your best work / Flexible seating anywhere in our botanical lounges"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E0DCD3] bg-[#FAF9F5] text-xs text-[#181F18] focus:outline-none focus:border-[#2E7D32] focus:bg-white transition-all font-medium"
                />
              </div>

              {/* ========================================================================= */}
              {/* 3. INCLUDED HIGHLIGHTS: SORTABLE LIST WITH "X" BUTTONS & BADGES BANK      */}
              {/* ========================================================================= */}
              <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#E0DCD3] space-y-4">
                {/* Header with Quick Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E0DCD3] pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#2E7D32]" />
                      <span className="text-xs font-bold text-[#181F18]">
                        INCLUDED HIGHLIGHTS ({formFeatures.length}/4 Bullet Points)
                      </span>
                      <span className="text-red-500">*</span>
                    </div>
                    <p className="text-[11px] text-[#5C665C] mt-0.5">
                      Use the <strong>Up/Down arrows</strong> to change sort position, <strong>"X"</strong> to delete, or click any badge chip below to toggle into the list.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                    <button
                      type="button"
                      onClick={clearAllFeatures}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg border border-red-200 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear All</span>
                    </button>

                    <button
                      type="button"
                      onClick={resetFeaturesToDefault}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-[#5C665C] hover:text-[#2E7D32] bg-white hover:bg-[#EAE5DC] px-2.5 py-1 rounded-lg border border-[#E0DCD3] transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Defaults</span>
                    </button>
                  </div>
                </div>

                {/* Status Notice Toast / Message */}
                {featureMessage && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-[#2E7D32] flex items-center justify-between animate-fadeIn">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="font-medium">{featureMessage}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFeatureMessage('')}
                      className="text-[#2E7D32] hover:text-emerald-800 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* 1 to 4 Configured Highlight Rows with Sorting & "X" Delete Button */}
                <div className="space-y-2.5">
                  {formFeatures.length === 0 ? (
                    <div className="p-6 rounded-xl border border-dashed border-[#D0C9BE] bg-white text-center space-y-1">
                      <p className="text-xs font-semibold text-[#181F18]">
                        No highlights added yet (0/4)
                      </p>
                      <p className="text-[11px] text-[#5C665C]">
                        Click on any badge chip below or click "+ Add Custom Highlight" to add up to 4 bullet points.
                      </p>
                    </div>
                  ) : (
                    formFeatures.map((featureText, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E0DCD3] shadow-2xs hover:border-[#2E7D32]/60 transition-all group"
                      >
                        {/* Position Indicator */}
                        <div className="w-7 h-7 rounded-lg bg-[#E8F5E9] text-[#2E7D32] border border-emerald-200 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                          #{idx + 1}
                        </div>

                        {/* Reorder Buttons (Up / Down) */}
                        <div className="flex flex-col gap-0.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => moveFeatureUp(idx)}
                            disabled={idx === 0}
                            className={`w-6 h-3.5 rounded flex items-center justify-center transition-colors ${
                              idx === 0
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-[#5C665C] hover:bg-[#2E7D32] hover:text-white cursor-pointer'
                            }`}
                            title="Move Highlight Up in Order"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => moveFeatureDown(idx)}
                            disabled={idx === formFeatures.length - 1}
                            className={`w-6 h-3.5 rounded flex items-center justify-center transition-colors ${
                              idx === formFeatures.length - 1
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-[#5C665C] hover:bg-[#2E7D32] hover:text-white cursor-pointer'
                            }`}
                            title="Move Highlight Down in Order"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Text Input */}
                        <div className="relative flex-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            required
                            placeholder={`Highlight bullet #${idx + 1}...`}
                            value={featureText}
                            onChange={(e) => handleFeatureChange(idx, e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 bg-[#FAF9F5] focus:bg-white border border-[#E0DCD3] focus:border-[#2E7D32] rounded-lg text-xs text-[#181F18] font-medium outline-none transition-colors"
                          />
                        </div>

                        {/* "X" Remove Button */}
                        <button
                          type="button"
                          onClick={() => removeFeature(idx)}
                          className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 hover:border-red-500 flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-2xs"
                          title="Delete this Highlight (X)"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}

                  {/* Add Custom Highlight Button (when < 4 items) */}
                  {formFeatures.length < 4 && (
                    <button
                      type="button"
                      onClick={addEmptyFeature}
                      className="w-full py-2.5 px-3 rounded-xl border border-dashed border-[#2E7D32]/60 hover:border-[#2E7D32] bg-emerald-50/40 hover:bg-emerald-50 text-[#2E7D32] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>+ Add Custom Highlight ({formFeatures.length}/4)</span>
                    </button>
                  )}
                </div>

                {/* ===================================================================== */}
                {/* PRESET BADGES BANK: CLICK TO INDIVIDUALLY ADD / TOGGLE CHIPS          */}
                {/* ===================================================================== */}
                <div className="pt-3 border-t border-[#E0DCD3] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#263626] flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-[#2E7D32]" />
                      <span>Individual Badge Chips Library (Click to Add / Remove):</span>
                    </span>

                    <span className="text-[11px] text-[#5C665C] font-mono">
                      Selected: {formFeatures.filter(Boolean).length}/4
                    </span>
                  </div>

                  {/* Badge Category Navigation Tabs */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {PRESET_BADGE_GROUPS.map((grp, gIdx) => {
                      const IconComp = grp.icon;
                      const isActiveTab = activeBadgeCategoryTab === gIdx;

                      return (
                        <button
                          key={grp.groupName}
                          type="button"
                          onClick={() => setActiveBadgeCategoryTab(gIdx)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                            isActiveTab
                              ? 'bg-[#263626] text-white shadow-xs'
                              : 'bg-white hover:bg-[#EAE5DC] text-[#5C665C] border border-[#E0DCD3]'
                          }`}
                        >
                          <IconComp className={`w-3.5 h-3.5 ${isActiveTab ? 'text-[#4ADE80]' : 'text-[#2E7D32]'}`} />
                          <span>{grp.groupName}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Individual Clickable Badges in Selected Tab */}
                  <div className="p-3 rounded-xl bg-white border border-[#E0DCD3] flex flex-wrap gap-2">
                    {PRESET_BADGE_GROUPS[activeBadgeCategoryTab].badges.map((badgeText) => {
                      const isSelected = formFeatures.some(
                        (f) => f.trim().toLowerCase() === badgeText.trim().toLowerCase()
                      );

                      return (
                        <button
                          key={badgeText}
                          type="button"
                          onClick={() => togglePresetBadge(badgeText)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                            isSelected
                              ? 'bg-[#263626] text-white border border-[#263626] ring-1 ring-[#4ADE80]/50'
                              : 'bg-[#FAF9F5] hover:bg-[#EAE5DC] text-[#181F18] border border-[#E0DCD3] hover:border-[#2E7D32]'
                          }`}
                        >
                          {isSelected ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#4ADE80] shrink-0" />
                          ) : (
                            <Plus className="w-3 h-3 text-[#2E7D32] shrink-0" />
                          )}
                          <span>{badgeText}</span>
                          {isSelected && (
                            <span className="ml-1 text-[10px] text-red-300 hover:text-white font-bold">×</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Quick 1-Click 4-Item Packs Accordion */}
                  <div className="pt-2">
                    <span className="text-[10px] font-mono text-[#5C665C] uppercase tracking-wider block mb-1.5">
                      Or Load a Full 4-Item Pack in 1-Click:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {FULL_PRESET_PACKS.map((pack) => {
                        const IconComp = pack.icon;

                        return (
                          <button
                            key={pack.name}
                            type="button"
                            onClick={() => applyFullPack(pack)}
                            className="p-2 rounded-xl bg-white hover:bg-emerald-50 text-[#181F18] hover:text-[#2E7D32] border border-[#E0DCD3] hover:border-[#2E7D32] text-left flex items-center gap-1.5 text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            <IconComp className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                            <span className="truncate">{pack.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Image Upload to Supabase Bucket with Live Progress & Preview */}
              <div>
                <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider mb-1.5">
                  Category Image (Supabase Storage: <span className="text-[#2E7D32] font-mono font-normal">encourtyard-upload/category</span>) <span className="text-red-500">*</span>
                </label>

                {/* File Dropzone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                    previewUrl
                      ? 'border-[#2E7D32] bg-emerald-50/40'
                      : 'border-[#D0C9BE] hover:border-[#2E7D32] bg-[#FAF9F5] hover:bg-[#F2EFE8]'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {previewUrl ? (
                    <div className="space-y-3">
                      <div className="relative h-44 rounded-xl overflow-hidden border border-[#E0DCD3] shadow-sm max-w-md mx-auto">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-mono px-2 py-0.5 rounded-md backdrop-blur-xs">
                          {selectedFile ? `${selectedFile.name} (${(selectedFile.size / 1024).toFixed(0)} KB)` : 'Current Image'}
                        </div>
                      </div>
                      <p className="text-[11px] text-[#2E7D32] font-semibold">
                        Click here to replace with another image file
                      </p>
                    </div>
                  ) : (
                    <div className="py-6 space-y-2">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#2E7D32] flex items-center justify-center mx-auto shadow-sm">
                        <FolderUp className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-[#181F18]">
                        Click to browse & upload category image
                      </p>
                      <p className="text-[11px] text-[#5C665C]">
                        Supports JPG, PNG, WEBP (Saved directly to Supabase bucket: <span className="font-mono text-[#2E7D32]">encourtyard-upload/category</span>)
                      </p>
                    </div>
                  )}
                </div>

                {/* Real-Time Upload Progress Bar */}
                {uploading && (
                  <div className="mt-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#181F18]">
                      <span className="flex items-center gap-1.5 text-[#2E7D32]">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading to Supabase...</span>
                      </span>
                      <span className="font-mono text-[#2E7D32]">{uploadProgress}%</span>
                    </div>

                    <div className="w-full h-2.5 bg-emerald-200/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#2E7D32] to-[#4ADE80] transition-all duration-300 rounded-full shadow-sm"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-[#5C665C] font-mono">{uploadStatusText}</p>
                  </div>
                )}
              </div>

              {/* 5. Optional Fields: Capacity & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider mb-1.5">
                    Capacity / Team Size (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1 - 20 Pax / Dedicated"
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-[#E0DCD3] bg-[#FAF9F5] text-xs text-[#181F18] focus:outline-none focus:border-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider mb-1.5">
                    Badge Pill (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Popular, Enterprise, Flex Pass"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-[#E0DCD3] bg-[#FAF9F5] text-xs text-[#181F18] focus:outline-none focus:border-[#2E7D32]"
                  />
                </div>
              </div>

              {/* 6. Visibility Status Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E0DCD3]">
                <div>
                  <span className="text-xs font-bold text-[#181F18] block">Homepage Visibility</span>
                  <span className="text-[11px] text-[#5C665C] block">Display immediately on the user-facing homepage carousel</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2E7D32]"></div>
                </label>
              </div>

              {/* Footer Submit Buttons */}
              <div className="pt-4 border-t border-[#E0DCD3] flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  disabled={uploading}
                  className="rounded-xl"
                >
                  Cancel
                </Button>

                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving to Supabase & DB...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingCategory ? 'Update Category & Highlights' : 'Create Category'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
