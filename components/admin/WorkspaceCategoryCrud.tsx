'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Check,
  X,
  Trash2,
  Edit2,
  Eye,
  RefreshCw,
  FolderUp,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Layers,
  Video,
  Image as ImageIcon,
  IndianRupee,
  Users,
  MapPin,
  ExternalLink,
  Maximize2,
  Sparkles,
  Monitor,
  Building2,
  Clock,
  Calendar,
  AlertCircle,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useFeedbackModal } from '@/context/FeedbackModalContext';
import { calculateWorkspaceInventory } from '@/lib/availability';

export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

export interface SpecItem {
  key: string;
  value: string;
}

export interface MediaItem {
  url: string;
  type: 'image' | 'video';
  name: string;
  size?: number;
}

export interface Workspace {
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
  showInDayPass?: boolean;
  totalUnits?: number;
  alertThreshold?: number;
  bookings?: any[];
  maintenanceBlocks?: any[];
  createdAt: string | Date;
}

export interface WorkspaceCategoryCrudProps {
  mode: 'day-pass' | 'meeting-rooms' | 'conference-hall';
}

export default function WorkspaceCategoryCrud({ mode }: WorkspaceCategoryCrudProps) {
  const { showSuccess, showError } = useFeedbackModal();

  // Mode configuration
  const config = useMemo(() => {
    switch (mode) {
      case 'day-pass':
        return {
          title: 'Day Pass & Single-Day Desks',
          tagline: 'DAY PASS INVENTORY',
          description: 'Manage flexible day pass workspaces and drop-in desks. Day pass charges are calculated on a per-person daily basis.',
          icon: Sparkles,
          categoryQuery: 'day pass',
          targetCategoryName: 'Day Pass',
          priceLabel: 'Price (Per Person) *',
          pricePlaceholder: 'e.g. 500 / person',
          priceHelper: 'Day pass charge according to per person / seat',
          badgeText: 'Per Person',
          badgeStyle: 'bg-amber-50 text-amber-900 border-amber-200',
          addButtonText: 'Add New Day Pass',
          previewButtonText: 'Preview Public Workspaces',
          previewUrl: '/book-space?tab=day-pass',
          modalTitleAdd: 'Add New Day Pass Office / Desk',
          modalTitleEdit: 'Edit Day Pass Office / Desk',
          defaultSpecs: [
            { key: 'Pass Duration', value: 'Full Day (09:00 AM – 08:00 PM)' },
            { key: 'High-Speed WiFi', value: '1 Gbps Dedicated VLAN' },
            { key: 'Complimentary Drinks', value: 'Unlimited Espresso & Tea' },
            { key: 'Seating Type', value: 'Ergonomic Desk / Lounge Access' },
          ],
        };
      case 'meeting-rooms':
        return {
          title: 'Meeting Rooms & Presentation Pods',
          tagline: 'AUDIO-VISUAL SPACES',
          description: 'Manage executive meeting rooms, boardrooms, and creative pods. Meeting rooms charge hourly rates.',
          icon: Monitor,
          categoryQuery: 'meeting',
          targetCategoryName: 'Meeting Rooms',
          priceLabel: 'Price (Hourly Rate) *',
          pricePlaceholder: 'e.g. ₹1,500 / hr',
          priceHelper: 'Meeting rooms charge hourly',
          badgeText: 'Per Hour',
          badgeStyle: 'bg-blue-50 text-blue-900 border-blue-200',
          addButtonText: 'Add New Meeting Room',
          previewButtonText: 'Preview Public Workspaces',
          previewUrl: '/book-space?tab=meeting-rooms',
          modalTitleAdd: 'Add New Meeting Room',
          modalTitleEdit: 'Edit Meeting Room',
          defaultSpecs: [
            { key: 'Seating Capacity', value: '6 - 12 Pax' },
            { key: 'AV Display', value: '4K Ultra-HD 65" Screen' },
            { key: 'Soundproofing', value: 'Double Acoustic Glazed STC 65' },
            { key: 'Video Conference', value: 'AI Auto-framing Camera & Polycom Mic' },
          ],
        };
      case 'conference-hall':
        return {
          title: 'Conference Halls & Event Venues',
          tagline: 'LARGE VENUE INVENTORY',
          description: 'Manage large presentation halls, keynote auditoriums, and summit venues. Conference halls charge hourly commercial rates.',
          icon: Building2,
          categoryQuery: 'confr',
          targetCategoryName: 'Confreence Hall',
          priceLabel: 'Price (Hourly Rate) *',
          pricePlaceholder: 'e.g. ₹3,500 / hr',
          priceHelper: 'Conference hall charge hourly',
          badgeText: 'Per Hour',
          badgeStyle: 'bg-purple-50 text-purple-900 border-purple-200',
          addButtonText: 'Add New Conference Hall',
          previewButtonText: 'Preview Public Workspaces',
          previewUrl: '/book-space?tab=conference-hall',
          modalTitleAdd: 'Add New Conference Hall',
          modalTitleEdit: 'Edit Conference Hall',
          defaultSpecs: [
            { key: 'Seating Capacity', value: '25 - 60 Pax' },
            { key: 'Stage & Podium', value: 'Raised Keynote Stage with Wireless Lapels' },
            { key: 'Audio System', value: 'Bose Surround System with Dual Wireless Mics' },
            { key: 'Projection', value: 'Dual 4K HDR Projectors with Screen Splitter' },
          ],
        };
    }
  }, [mode]);

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [targetCategory, setTargetCategory] = useState<CategoryOption | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Add / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);

  // View Details Modal State
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingWorkspace, setViewingWorkspace] = useState<Workspace | null>(null);

  // Full-Size Media Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxItems, setLightboxItems] = useState<MediaItem[]>([]);
  const [lightboxCurrentIndex, setLightboxCurrentIndex] = useState(0);
  const [lightboxTitle, setLightboxTitle] = useState('');

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formShortDescription, setFormShortDescription] = useState('');
  const [formLongDescription, setFormLongDescription] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formGstPercent, setFormGstPercent] = useState('18');
  const [formCapacity, setFormCapacity] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formTotalUnits, setFormTotalUnits] = useState<number>(1);
  const [formAlertThreshold, setFormAlertThreshold] = useState<number>(5);
  const [specifications, setSpecifications] = useState<SpecItem[]>(config.defaultSpecs);

  // Live Inventory Date Checker State (Default Today)
  const todayStr = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }, []);
  const [inventoryCheckDate, setInventoryCheckDate] = useState<string>(todayStr);
  const [selectedCheckDate, setSelectedCheckDate] = useState<string>(todayStr);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Compute workspaces with low availability or sold out for the selected date
  const lowStockWorkspaces = useMemo(() => {
    return workspaces
      .filter((ws) => ws.isActive)
      .map((ws) => {
        const inv = calculateWorkspaceInventory(ws, inventoryCheckDate, '09:00 AM', inventoryCheckDate, '06:00 PM');
        return { ws, inv };
      })
      .filter(({ inv }) => inv.isLowStock || inv.availableUnits === 0);
  }, [workspaces, inventoryCheckDate]);

  // Media Upload State
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusText, setUploadStatusText] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-calculation for GST and Total Amount
  const numericBasePrice = useMemo(() => {
    const clean = formPrice.replace(/[^0-9.]/g, '');
    return parseFloat(clean) || 0;
  }, [formPrice]);

  const gstRate = useMemo(() => {
    const clean = formGstPercent.replace(/[^0-9.]/g, '');
    return parseFloat(clean) || 0;
  }, [formGstPercent]);

  const calculatedGstAmount = useMemo(() => {
    return Math.round((numericBasePrice * gstRate) / 100);
  }, [numericBasePrice, gstRate]);

  const calculatedTotalAmount = useMemo(() => {
    return numericBasePrice + calculatedGstAmount;
  }, [numericBasePrice, calculatedGstAmount]);

  // Fetch all workspaces and categories
  const loadData = async () => {
    try {
      setLoading(true);
      const [resWs, resCat] = await Promise.all([
        fetch('/api/workspaces', { cache: 'no-store' }),
        fetch('/api/categories', { cache: 'no-store' }),
      ]);
      const dataWs = await resWs.json();
      const dataCat = await resCat.json();

      let targetCat: CategoryOption | null = null;

      if (dataCat.success && Array.isArray(dataCat.categories)) {
        setCategories(dataCat.categories);
        // Find matching category for this mode
        targetCat =
          dataCat.categories.find((c: CategoryOption) =>
            c.name.toLowerCase().includes(config.categoryQuery) ||
            c.slug.toLowerCase().includes(config.categoryQuery)
          ) || dataCat.categories[0] || null;

        setTargetCategory(targetCat);
        if (targetCat) {
          setFormCategoryId(targetCat.id);
        }
      }

      if (dataWs.success && Array.isArray(dataWs.workspaces)) {
        // Filter workspaces that belong to this section
        const matched = dataWs.workspaces.filter((w: Workspace) => {
          if (mode === 'day-pass') {
            return (
              w.showInDayPass === true ||
              (w.categoryName || '').toLowerCase().includes('day pass') ||
              (targetCat && w.categoryId === targetCat.id)
            );
          }
          if (mode === 'meeting-rooms') {
            return (
              (w.categoryName || '').toLowerCase().includes('meeting') ||
              (targetCat && w.categoryId === targetCat.id)
            );
          }
          if (mode === 'conference-hall') {
            return (
              (w.categoryName || '').toLowerCase().includes('confr') ||
              (targetCat && w.categoryId === targetCat.id)
            );
          }
          return false;
        });

        setWorkspaces(matched);
      }
    } catch (err) {
      console.error('Failed to load category workspace data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [mode]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Lightbox Handlers
  const openLightbox = (items: MediaItem[], initialIndex = 0, title = 'Media Preview') => {
    if (!items || items.length === 0) return;
    setLightboxItems(items);
    setLightboxCurrentIndex(initialIndex);
    setLightboxTitle(title);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxItems([]);
    setLightboxCurrentIndex(0);
  };

  const nextLightboxItem = () => {
    if (lightboxItems.length <= 1) return;
    setLightboxCurrentIndex((prev) => (prev + 1) % lightboxItems.length);
  };

  const prevLightboxItem = () => {
    if (lightboxItems.length <= 1) return;
    setLightboxCurrentIndex((prev) => (prev - 1 + lightboxItems.length) % lightboxItems.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightboxItem();
      if (e.key === 'ArrowLeft') prevLightboxItem();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, lightboxItems]);

  // Specifications Handlers
  const addSpecification = () => {
    setSpecifications((prev) => [...prev, { key: '', value: '' }]);
  };

  const removeSpecification = (index: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    setSpecifications((prev) => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  // Multiple File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);

    const previews: MediaItem[] = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image',
      name: file.name,
      size: file.size,
    }));
    setMediaList((prev) => [...prev, ...previews]);
  };

  const removeMediaItem = (index: number) => {
    setMediaList((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload to Supabase
  const uploadMediaToSupabase = async (files: File[]): Promise<MediaItem[]> => {
    setUploading(true);
    setUploadProgress(0);
    setUploadStatusText(`Connecting to Supabase Storage (encourtyard-upload/work-space)...`);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 90);
          setUploadProgress(percentComplete);
          const kbLoaded = (event.loaded / 1024).toFixed(1);
          const kbTotal = (event.total / 1024).toFixed(1);
          setUploadStatusText(`Uploading ${files.length} media files: ${kbLoaded} KB of ${kbTotal} KB (${percentComplete}%)...`);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const res = JSON.parse(xhr.responseText);
            setUploadProgress(100);
            setUploadStatusText('All media uploaded to Supabase successfully!');
            resolve(res.files || []);
          } catch {
            setUploadProgress(100);
            resolve([]);
          }
        } else {
          try {
            const errRes = JSON.parse(xhr.responseText);
            reject(new Error(errRes.error || 'Media upload failed'));
          } catch {
            reject(new Error('Server responded with upload error'));
          }
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error during Supabase media upload'));
      };

      xhr.open('POST', '/api/admin/workspaces/upload', true);
      xhr.send(formData);
    });
  };

  // Submit Handler (Create or Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formTitle.trim()) {
      setFormError('Workspace heading/title is required.');
      return;
    }
    if (!formShortDescription.trim()) {
      setFormError('Short description is required.');
      return;
    }
    if (mediaList.length === 0 && selectedFiles.length === 0) {
      setFormError('Please upload at least one image or video for this workspace.');
      return;
    }

    // Determine target category
    const activeCat = targetCategory || categories.find((c) => c.id === formCategoryId) || categories[0];
    const categoryId = activeCat ? activeCat.id : formCategoryId;
    const categoryName = activeCat ? activeCat.name : config.targetCategoryName;

    let finalMediaList = [...mediaList];

    if (selectedFiles.length > 0) {
      try {
        const uploadedItems = await uploadMediaToSupabase(selectedFiles);
        const existingPermanent = mediaList.filter((m) => !m.url.startsWith('blob:'));
        finalMediaList = [...existingPermanent, ...uploadedItems];
      } catch (uploadErr: any) {
        setFormError(uploadErr.message || 'Failed to upload media to Supabase Storage');
        setUploading(false);
        return;
      }
    }

    const validSpecs = specifications.filter(
      (s) => s.key.trim() && s.value.trim() && s.key !== 'gstPercent' && s.key !== 'GST %' && s.key !== 'gstRate'
    );
    validSpecs.push({ key: 'gstPercent', value: formGstPercent.trim() || '18' });

    // Clean price
    let finalPrice = formPrice.trim();
    if (mode === 'day-pass') {
      finalPrice = finalPrice.replace(/\/\s*day/gi, '/ person');
      if (finalPrice && !finalPrice.includes('/')) {
        finalPrice = `${finalPrice} / person`;
      }
    } else if (finalPrice && !finalPrice.includes('/')) {
      finalPrice = `${finalPrice} / hr`;
    }

    const payload = {
      title: formTitle.trim(),
      categoryId: categoryId,
      categoryName: categoryName,
      shortDescription: formShortDescription.trim(),
      longDescription: formLongDescription.trim() || null,
      price: finalPrice || null,
      gstPercent: formGstPercent.trim() || '18',
      capacity: formCapacity.trim() || null,
      location: formLocation.trim() || null,
      badge: formBadge.trim() || null,
      totalUnits: Number(formTotalUnits) > 0 ? Number(formTotalUnits) : 1,
      alertThreshold: Number(formAlertThreshold) >= 0 ? Number(formAlertThreshold) : 5,
      order: editingWorkspace ? editingWorkspace.order : workspaces.length + 1,
      isActive: formIsActive,
      showInDayPass: mode === 'day-pass',
      specifications: validSpecs,
      mediaUrls: finalMediaList,
    };

    try {
      const url = editingWorkspace ? `/api/workspaces/${editingWorkspace.id}` : '/api/workspaces';
      const method = editingWorkspace ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save space');
      }

      setFormSuccess(editingWorkspace ? 'Updated successfully!' : 'Created successfully!');
      showSuccess({
        variant: 'minimal',
        title: editingWorkspace ? 'Changes Saved' : 'Space Created',
        message: `"${formTitle}" has been saved successfully in ${config.title}.`,
        primaryBtnText: 'Great',
        autoCloseMs: 2000,
      });

      setTimeout(() => {
        closeModal();
        loadData();
      }, 500);
    } catch (err: any) {
      setFormError(err.message || 'An unexpected error occurred while saving.');
    } finally {
      setUploading(false);
    }
  };

  // Open Modal for Create
  const openCreateModal = () => {
    setEditingWorkspace(null);
    setFormTitle('');
    if (targetCategory) {
      setFormCategoryId(targetCategory.id);
    }
    setFormShortDescription('');
    setFormLongDescription('');
    setFormPrice('');
    setFormGstPercent('18');
    setFormCapacity('');
    setFormLocation('Maruthi Plaza, Khairatabad');
    setFormBadge('');
    setFormIsActive(true);
    setFormTotalUnits(1);
    setFormAlertThreshold(5);
    setSpecifications(config.defaultSpecs);
    setMediaList([]);
    setSelectedFiles([]);
    setFormError('');
    setFormSuccess('');
    setModalOpen(true);
  };

  // Open Modal for Edit
  const openEditModal = (ws: Workspace) => {
    setEditingWorkspace(ws);
    setFormTitle(ws.title);
    setFormCategoryId(ws.categoryId || (targetCategory ? targetCategory.id : ''));
    setFormShortDescription(ws.shortDescription || '');
    setFormLongDescription(ws.longDescription || '');
    setFormPrice(ws.price || '');
    const existingGst = ws.specifications?.find(
      (s: any) => s.key === 'gstPercent' || s.key === 'GST %' || s.key === 'gstRate'
    )?.value;
    setFormGstPercent(existingGst || (ws as any).gstPercent?.toString() || '18');
    setFormCapacity(ws.capacity || '');
    setFormLocation(ws.location || '');
    setFormBadge(ws.badge || '');
    setFormIsActive(ws.isActive);
    setFormTotalUnits(ws.totalUnits ?? 1);
    setFormAlertThreshold(ws.alertThreshold ?? 5);
    setSpecifications(ws.specifications && ws.specifications.length > 0 ? ws.specifications : config.defaultSpecs);
    setMediaList(ws.mediaUrls || []);
    setSelectedFiles([]);
    setFormError('');
    setFormSuccess('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingWorkspace(null);
    setSelectedFiles([]);
    setFormError('');
    setFormSuccess('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Re-ordering (Move Up / Down)
  const handleMoveOrder = async (ws: Workspace, direction: 'up' | 'down') => {
    const sorted = [...workspaces].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    const currentIndex = sorted.findIndex((w) => w.id === ws.id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const targetWs = sorted[targetIndex];
    const currentOrder = ws.order ?? (currentIndex + 1);
    const targetOrder = targetWs.order ?? (targetIndex + 1);

    const newCurrentOrder = targetOrder === currentOrder
      ? (direction === 'up' ? targetOrder : targetOrder + 1)
      : targetOrder;
    const newTargetOrder = currentOrder;

    const updated = workspaces.map((w) => {
      if (w.id === ws.id) return { ...w, order: newCurrentOrder };
      if (w.id === targetWs.id) return { ...w, order: newTargetOrder };
      return w;
    });
    setWorkspaces(updated);

    try {
      await Promise.all([
        fetch(`/api/workspaces/${ws.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: newCurrentOrder }),
        }),
        fetch(`/api/workspaces/${targetWs.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: newTargetOrder }),
        }),
      ]);
      showSuccess({
        variant: 'minimal',
        title: 'Sorting Order Updated',
        message: `"${ws.title}" position adjusted.`,
        autoCloseMs: 1500,
      });
    } catch (err) {
      console.error('Failed to swap order:', err);
      loadData();
    }
  };

  // Delete Handler
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/workspaces/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setWorkspaces((prev) => prev.filter((w) => w.id !== id));
        showSuccess({
          variant: 'minimal',
          title: 'Deleted Successfully',
          message: `"${title}" has been removed from inventory.`,
          autoCloseMs: 2000,
        });
      }
    } catch (err: any) {
      showError({
        variant: 'cta',
        title: 'Delete Failed',
        message: err.message || 'Failed to delete workspace entry.',
        primaryBtnText: 'Retry',
      });
    }
  };

  // Filtered List
  const filteredWorkspaces = useMemo(() => {
    const sorted = [...workspaces].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    if (!search.trim()) return sorted;
    const q = search.toLowerCase();
    return sorted.filter(
      (w) =>
        w.title.toLowerCase().includes(q) ||
        w.shortDescription.toLowerCase().includes(q) ||
        (w.price && w.price.toLowerCase().includes(q)) ||
        (w.location && w.location.toLowerCase().includes(q))
    );
  }, [workspaces, search]);

  const totalPages = Math.ceil(filteredWorkspaces.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedWorkspaces = filteredWorkspaces.slice(startIndex, startIndex + pageSize);

  const IconComponent = config.icon;

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-16">
      
      {/* 1. Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-[#E0DCD3] shadow-xs">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold uppercase tracking-wider ${config.badgeStyle}`}>
              {config.tagline}
            </span>
            <span className="text-[10px] text-[#738273] font-mono hidden md:inline">
              Storage: encourtyard-upload/work-space
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18] tracking-tight flex items-center gap-2.5">
            <IconComponent className="w-7 h-7 text-[#2E7D32] shrink-0" />
            <span>{config.title} ({workspaces.length})</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#5C665C] mt-0.5 max-w-2xl">
            {config.description}
          </p>
        </div>

        {/* Action Buttons - Fixed single-row styling matching Image 2 */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          <Link
            href={config.previewUrl}
            target="_blank"
            className="h-11 px-4 py-2 rounded-2xl bg-white hover:bg-[#FAF9F5] border border-[#E0DCD3] hover:border-[#2E7D32]/50 text-[#181F18] text-xs font-semibold flex items-center gap-2 transition-all shadow-xs shrink-0 whitespace-nowrap cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#2E7D32]" />
            <span>{config.previewButtonText}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#5C665C]" />
          </Link>

          <button
            type="button"
            onClick={openCreateModal}
            className="h-11 px-5 py-2 rounded-2xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white shadow-md flex items-center gap-2 text-xs font-bold transition-all shrink-0 whitespace-nowrap cursor-pointer hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>{config.addButtonText}</span>
          </button>
        </div>
      </div>

      {/* Low Inventory Alert Notification Banner for Admin */}
      {lowStockWorkspaces.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 animate-pulse text-amber-800" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block">
                ⚠️ Low Inventory Alert ({lowStockWorkspaces.length} Space{lowStockWorkspaces.length > 1 ? 's' : ''} on {inventoryCheckDate})
              </span>
              <span className="text-xs text-amber-800">
                Some spaces have reached or dropped below their notification limit on {inventoryCheckDate}.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAlertModalOpen(true)}
            className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>View Low Inventory Alert List ({lowStockWorkspaces.length})</span>
          </button>
        </div>
      )}

      {/* 2. Mobile Filter Toolbar (lg:hidden) - Row 1: Search + Filters btn, Row 2: Showing count + Refresh */}
      <div className="lg:hidden bg-white p-3.5 rounded-2xl border border-[#E0DCD3] shadow-xs space-y-2.5">
        {/* Row 1: Left search field, Right filter button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-[#738273] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by space name, category, or specs..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#E0DCD3] text-xs text-[#181F18] placeholder-[#738273] focus:outline-none focus:border-[#2E7D32]"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A968A] hover:text-[#181F18]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="px-3.5 py-2 bg-[#181F18] hover:bg-[#2E7D32] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer transition-all shadow-xs active:scale-95"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {inventoryCheckDate !== todayStr && (
              <span className="w-2 h-2 rounded-full bg-[#4ADE80] ring-2 ring-[#181F18] animate-pulse" />
            )}
          </button>
        </div>

        {/* Row 2: Showing message just below search and filter row btn */}
        <div className="flex items-center justify-between pt-1 border-t border-[#E0DCD3]/60">
          <span className="text-xs text-[#5C665C] font-mono font-medium">
            Showing {filteredWorkspaces.length === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + pageSize, filteredWorkspaces.length)} of {filteredWorkspaces.length}
          </span>
          <button
            type="button"
            onClick={() => loadData()}
            className="p-1.5 rounded-xl border border-[#E0DCD3] hover:border-[#2E7D32] text-[#181F18] hover:bg-[#FAF9F5] transition-colors cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#2E7D32]' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2b. Desktop Search & Toolbar (hidden lg:flex) */}
      <div className="hidden lg:flex flex-nowrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-[#E0DCD3] shadow-xs">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-[#738273] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, price, location..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAF9F5] border border-[#E0DCD3] text-xs text-[#181F18] placeholder-[#8A968A] focus:outline-none focus:border-[#2E7D32] focus:bg-white"
            />
          </div>

          {/* Live Inventory Date Checker with Submit Button */}
          <div className="flex items-center gap-1.5 bg-[#FAF9F5] border border-[#E0DCD3] rounded-xl px-2.5 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
            <span className="text-[10px] font-bold text-[#181F18] uppercase tracking-wider hidden sm:inline whitespace-nowrap">
              Date:
            </span>
            <input
              type="date"
              value={selectedCheckDate}
              onChange={(e) => setSelectedCheckDate(e.target.value || todayStr)}
              className="text-xs font-mono font-bold text-[#181F18] bg-transparent outline-none cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setInventoryCheckDate(selectedCheckDate)}
              className="px-2.5 py-1 bg-[#2E7D32] hover:bg-[#1E5C23] text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap active:scale-95"
              title="Apply date and show details"
            >
              <Check className="w-3 h-3 stroke-[3]" />
              <span>Submit</span>
            </button>
            {(selectedCheckDate !== todayStr || inventoryCheckDate !== todayStr) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCheckDate(todayStr);
                  setInventoryCheckDate(todayStr);
                }}
                className="text-[10px] text-[#2E7D32] hover:underline font-bold px-1 cursor-pointer whitespace-nowrap"
                title="Reset to today"
              >
                Today
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Showing Count + Refresh */}
        <div className="flex items-center gap-2.5 shrink-0 whitespace-nowrap ml-auto">
          <span className="text-xs text-[#5C665C] font-mono font-medium">
            Showing {filteredWorkspaces.length === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + pageSize, filteredWorkspaces.length)} of {filteredWorkspaces.length}
          </span>
          <button
            onClick={() => loadData()}
            className="p-2 rounded-xl border border-[#E0DCD3] hover:border-[#2E7D32] text-[#181F18] hover:bg-[#FAF9F5] transition-colors cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#2E7D32]' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2c. Mobile Filter Slide-Out Drawer from Right */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Right-Side Drawer Panel */}
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-xs sm:max-w-sm bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#E0DCD3] bg-[#FAF9F5] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#181F18] text-white flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#181F18]">Filters &amp; Availability</h3>
                  <p className="text-[11px] text-[#5C665C]">{config.title} date &amp; stock</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 rounded-xl text-[#5C665C] hover:text-[#181F18] hover:bg-white border border-transparent hover:border-[#E0DCD3] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
              {/* Check Date Filter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider">
                    Check Date
                  </label>
                  {selectedCheckDate !== todayStr && (
                    <button
                      type="button"
                      onClick={() => setSelectedCheckDate(todayStr)}
                      className="text-[11px] font-bold text-[#2E7D32] hover:underline cursor-pointer"
                    >
                      Reset to Today
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 bg-[#FAF9F5] border border-[#E0DCD3] p-2.5 rounded-xl">
                  <Calendar className="w-4 h-4 text-[#2E7D32] shrink-0" />
                  <input
                    type="date"
                    value={selectedCheckDate}
                    onChange={(e) => setSelectedCheckDate(e.target.value || todayStr)}
                    className="bg-transparent text-xs text-[#181F18] font-mono font-bold outline-none flex-1 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-[#738273]">
                  Check live booked units and available capacity for this date.
                </p>
              </div>

              {/* Active Date Summary */}
              {inventoryCheckDate !== todayStr && (
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <span className="font-bold block">Active Date Filter:</span>
                  <p className="text-[11px] text-emerald-800">
                    Checking inventory for: <strong>{inventoryCheckDate}</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#E0DCD3] bg-[#FAF9F5] flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedCheckDate(todayStr);
                  setInventoryCheckDate(todayStr);
                  setMobileFilterOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl border border-[#E0DCD3] hover:bg-white text-xs font-semibold text-[#5C665C] transition-colors cursor-pointer"
              >
                Reset to Today
              </button>
              <button
                type="button"
                onClick={() => {
                  setInventoryCheckDate(selectedCheckDate);
                  setMobileFilterOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Apply &amp; Submit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Table of Spaces */}
      <div className="bg-white border border-[#E0DCD3] rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#2E7D32] animate-spin mx-auto" />
            <p className="text-xs font-mono text-[#5C665C]">Loading {config.title.toLowerCase()} from database...</p>
          </div>
        ) : filteredWorkspaces.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-[#2E7D32] flex items-center justify-center mx-auto">
              <IconComponent className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#181F18]">No {config.title} Found</h3>
              <p className="text-xs text-[#5C665C] max-w-sm mx-auto mt-1">
                {search ? 'Try clearing your search query.' : `Get started by adding your first space under ${config.title}.`}
              </p>
            </div>
            {!search && (
              <Button
                onClick={openCreateModal}
                className="rounded-xl px-4 py-2 text-xs font-bold bg-[#2E7D32] text-white hover:bg-[#1E5C23] shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-1" />
                <span>{config.addButtonText}</span>
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-[#F7F5F0] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#D2CBBF] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#2E7D32]">
            <table className="w-full text-left text-xs border-collapse min-w-[1080px]">
              <thead>
                <tr className="border-b border-[#E0DCD3] bg-[#FAF9F5] text-[#5C665C] font-mono text-[10px] uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-bold text-center w-16 whitespace-nowrap">Order</th>
                  <th className="py-3.5 px-4 font-bold w-24 whitespace-nowrap">Media</th>
                  <th className="py-3.5 px-4 font-bold min-w-[200px] whitespace-nowrap">Space Heading</th>
                  <th className="py-3.5 px-4 font-bold whitespace-nowrap">{config.priceLabel.replace('*', '')}</th>
                  <th className="py-3.5 px-4 font-bold whitespace-nowrap">Specifications</th>
                  <th className="py-3.5 px-4 font-bold text-center whitespace-nowrap">Total Inventory</th>
                  <th className="py-3.5 px-4 font-bold text-center whitespace-nowrap">Available Units</th>
                  <th className="py-3.5 px-4 font-bold text-center whitespace-nowrap">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right pr-6 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0DCD3]/60">
                {paginatedWorkspaces.map((ws, idx) => {
                  const sortedList = [...workspaces].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
                  const currentIndex = sortedList.findIndex((w) => w.id === ws.id);
                  const isFirst = currentIndex === 0;
                  const isLast = currentIndex === sortedList.length - 1;
                  const primaryMedia = ws.mediaUrls && ws.mediaUrls.length > 0 ? ws.mediaUrls[0] : null;

                  return (
                    <tr key={ws.id} className="hover:bg-[#FAF9F5]/70 transition-colors group">
                      {/* Order Controls */}
                      <td className="py-3.5 px-4 text-center align-middle whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 bg-[#FAF9F5] border border-[#E0DCD3] rounded-lg px-2 py-1 whitespace-nowrap">
                          <span className="font-mono text-xs font-bold text-[#181F18] min-w-[18px]">
                            {ws.order ?? currentIndex + 1}
                          </span>
                          <div className="flex flex-col ml-1">
                            <button
                              type="button"
                              disabled={isFirst}
                              onClick={() => handleMoveOrder(ws, 'up')}
                              className={`p-0.5 rounded transition-colors ${
                                isFirst ? 'text-[#8A968A]/40 cursor-not-allowed' : 'text-[#2E7D32] hover:bg-[#EAE5DB] cursor-pointer'
                              }`}
                              title="Move up"
                            >
                              <ChevronUp className="w-3 h-3 stroke-[3]" />
                            </button>
                            <button
                              type="button"
                              disabled={isLast}
                              onClick={() => handleMoveOrder(ws, 'down')}
                              className={`p-0.5 rounded transition-colors ${
                                isLast ? 'text-[#8A968A]/40 cursor-not-allowed' : 'text-[#2E7D32] hover:bg-[#EAE5DB] cursor-pointer'
                              }`}
                              title="Move down"
                            >
                              <ChevronDown className="w-3 h-3 stroke-[3]" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Media Thumbnail */}
                      <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                        {primaryMedia ? (
                          <div
                            onClick={() => openLightbox(ws.mediaUrls, 0, ws.title)}
                            className="relative w-16 h-12 rounded-xl overflow-hidden border border-[#E0DCD3] bg-[#EAE5DB] cursor-pointer group/img shadow-2xs hover:shadow-sm shrink-0"
                            title="Click to view all media in full screen"
                          >
                            {primaryMedia.type === 'video' ? (
                              <div className="w-full h-full bg-[#181F18] flex items-center justify-center text-white">
                                <Video className="w-5 h-5 text-[#4ADE80]" />
                              </div>
                            ) : (
                              <img
                                src={primaryMedia.url}
                                alt={ws.title}
                                className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300"
                              />
                            )}
                            {ws.mediaUrls.length > 1 && (
                              <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-[9px] font-mono px-1 py-0.2 rounded">
                                +{ws.mediaUrls.length - 1}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="w-16 h-12 rounded-xl border border-dashed border-[#E0DCD3] flex items-center justify-center text-[#8A968A] shrink-0">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                      </td>

                      {/* Space Heading & Description */}
                      <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                        <div className="space-y-0.5 min-w-[200px]">
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <span className="font-serif font-bold text-sm text-[#181F18] block group-hover:text-[#2E7D32] transition-colors whitespace-nowrap">
                              {ws.title}
                            </span>
                            {ws.badge && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-50 border border-amber-200 text-amber-900 font-mono text-[9px] font-bold shrink-0 whitespace-nowrap">
                                {ws.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#5C665C] truncate max-w-[240px]" title={ws.shortDescription}>
                            {ws.shortDescription}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-[#738273] font-mono whitespace-nowrap">
                            {ws.capacity && <span>👥 {ws.capacity}</span>}
                            {ws.location && <span>📍 {ws.location}</span>}
                          </div>
                        </div>
                      </td>

                      {/* Price Column - Single Line */}
                      <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                        {ws.price ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-mono font-bold text-xs shadow-2xs whitespace-nowrap">
                            <IndianRupee className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                            <span className="whitespace-nowrap">{ws.price}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#8A968A] italic font-mono whitespace-nowrap">
                            Quote on request
                          </span>
                        )}
                      </td>

                      {/* Specifications Summary - Single Row Chips */}
                      <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          {ws.specifications && ws.specifications.length > 0 ? (
                            ws.specifications.slice(0, 2).map((sp, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-2 py-0.5 rounded-md bg-[#FAF9F5] border border-[#E0DCD3] text-[10px] text-[#304032] font-mono whitespace-nowrap"
                                title={`${sp.key}: ${sp.value}`}
                              >
                                <strong>{sp.key}:</strong> {sp.value}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-[#8A968A] font-mono italic whitespace-nowrap">No specs added</span>
                          )}
                          {ws.specifications && ws.specifications.length > 2 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-[#EAE5DB] text-[9px] font-mono font-bold text-[#5C665C] whitespace-nowrap">
                              +{ws.specifications.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Total Inventory / Allocation Column - Single Row */}
                      <td className="py-3.5 px-4 text-center align-middle whitespace-nowrap">
                        {(() => {
                          const inv = calculateWorkspaceInventory(
                            ws,
                            inventoryCheckDate,
                            '09:00 AM',
                            inventoryCheckDate,
                            '06:00 PM'
                          );
                          return (
                            <div className="inline-flex flex-col items-center gap-0.5 whitespace-nowrap">
                              <span className="font-mono text-xs font-bold text-[#181F18] whitespace-nowrap">
                                {inv.totalUnits} Unit{inv.totalUnits > 1 ? 's' : ''}
                              </span>
                              <span className="text-[10px] text-[#738273] font-mono whitespace-nowrap">
                                {inv.bookedUnits} booked ({inventoryCheckDate})
                              </span>
                            </div>
                          );
                        })()}
                      </td>

                      {/* Dedicated Available Units Column - Single Horizontal Row */}
                      <td className="py-3.5 px-4 text-center align-middle whitespace-nowrap">
                        {(() => {
                          const inv = calculateWorkspaceInventory(
                            ws,
                            inventoryCheckDate,
                            '09:00 AM',
                            inventoryCheckDate,
                            '06:00 PM'
                          );
                          return (
                            <div className="inline-flex items-center gap-2 whitespace-nowrap justify-center">
                              <div className="flex items-baseline gap-1 whitespace-nowrap bg-[#FAF9F5] px-2 py-1 rounded-lg border border-[#E0DCD3]">
                                <span
                                  className={`font-mono text-xs font-extrabold ${
                                    inv.availableUnits === 0
                                      ? 'text-red-600'
                                      : inv.isLowStock
                                      ? 'text-amber-700'
                                      : 'text-[#2E7D32]'
                                  }`}
                                >
                                  {inv.availableUnits}
                                </span>
                                <span className="text-[10px] font-mono text-[#5C665C]">
                                  / {inv.totalUnits}
                                </span>
                              </div>

                              {inv.availableUnits === 0 ? (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-red-100 text-red-800 border border-red-200 whitespace-nowrap">
                                  ⛔ Sold Out
                                </span>
                              ) : inv.isLowStock ? (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200 whitespace-nowrap animate-pulse">
                                  ⚠️ Few Left (&le; {inv.alertThreshold})
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-200 whitespace-nowrap">
                                  ● Available
                                </span>
                              )}
                            </div>
                          );
                        })()}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center align-middle whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase whitespace-nowrap ${
                            ws.isActive
                              ? 'bg-emerald-50 border border-emerald-200 text-[#2E7D32]'
                              : 'bg-red-50 border border-red-200 text-red-700'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${ws.isActive ? 'bg-[#2E7D32]' : 'bg-red-500'}`} />
                          <span>{ws.isActive ? 'Active' : 'Hidden'}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right pr-6 align-middle whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 justify-end whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => {
                              setViewingWorkspace(ws);
                              setViewModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg border border-[#E0DCD3] bg-white hover:bg-[#FAF9F5] text-[#5C665C] hover:text-[#181F18] transition-colors cursor-pointer shadow-2xs"
                            title="View full specs & drawer"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#2E7D32]" />
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditModal(ws)}
                            className="p-1.5 rounded-lg border border-[#E0DCD3] bg-white hover:bg-emerald-50 text-[#5C665C] hover:text-[#2E7D32] hover:border-emerald-300 transition-colors cursor-pointer shadow-2xs"
                            title="Edit space details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(ws.id, ws.title)}
                            className="p-1.5 rounded-lg border border-[#E0DCD3] bg-white hover:bg-red-50 text-[#5C665C] hover:text-red-600 hover:border-red-300 transition-colors cursor-pointer shadow-2xs"
                            title="Delete workspace"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#E0DCD3] bg-[#FAF9F5] flex items-center justify-between text-xs">
            <span className="text-[#5C665C] font-mono text-[11px]">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-[#E0DCD3] bg-white hover:bg-[#FAF9F5] disabled:opacity-40 disabled:cursor-not-allowed font-medium text-[#181F18]"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-[#E0DCD3] bg-white hover:bg-[#FAF9F5] disabled:opacity-40 disabled:cursor-not-allowed font-medium text-[#181F18]"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. ADD / EDIT WORKSPACE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#E0DCD3] w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#E0DCD3] bg-[#FAF9F5] sticky top-0 z-20 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2E7D32] block mb-0.5">
                  SUPABASE BUCKET · ENCOURTYARD-UPLOAD/WORK-SPACE
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#181F18]">
                  {editingWorkspace ? config.modalTitleEdit : config.modalTitleAdd}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={uploading}
                className="p-2 rounded-full hover:bg-neutral-200/60 text-[#5C665C] hover:text-[#181F18] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
              {formError && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
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

              {/* 1. Parent Category & Space Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider mb-1.5">
                    Parent Category <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-[#E0DCD3] bg-[#EEEBE2] text-xs font-semibold text-[#181F18] flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-[#2E7D32]" />
                      <span>{targetCategory?.name || config.targetCategoryName}</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#2E7D32] uppercase font-bold bg-white px-2 py-0.5 rounded border border-[#E0DCD3]">
                      Dedicated
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider mb-1.5">
                    Workspace Heading / Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={`e.g. ${mode === 'day-pass' ? 'Dedicated Flex Desk' : mode === 'meeting-rooms' ? 'Boardroom Alpha (12 Pax)' : 'Grand Auditorium Summit Hall'}`}
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E0DCD3] bg-[#FAF9F5] text-xs text-[#181F18] focus:outline-none focus:border-[#2E7D32] focus:bg-white font-medium"
                  />
                </div>
              </div>

              {/* 2. Short & Long Descriptions */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider mb-1.5">
                    Short Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Brief 1-sentence summary for cards and booking list"
                    value={formShortDescription}
                    onChange={(e) => setFormShortDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E0DCD3] bg-[#FAF9F5] text-xs text-[#181F18] focus:outline-none focus:border-[#2E7D32] focus:bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider mb-1.5">
                    Long Detailed Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Detailed overview of layout, acoustic treatment, seating ergonomics, AV specs, and hospitality..."
                    value={formLongDescription}
                    onChange={(e) => setFormLongDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E0DCD3] bg-[#FAF9F5] text-xs text-[#181F18] focus:outline-none focus:border-[#2E7D32] focus:bg-white font-medium"
                  />
                </div>
              </div>

              {/* 3. Property Specifications (Key-Value Pairs) */}
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E0DCD3] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider">
                      Property Specifications (Key–Value Pairs)
                    </label>
                    <span className="text-[11px] text-[#5C665C]">
                      Add features like seating, acoustic rating, display resolution, and amenities.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={addSpecification}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-[#E0DCD3] hover:border-emerald-300 text-xs font-bold text-[#2E7D32] transition-colors cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Property</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {specifications.map((spec, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Feature (e.g. Seating Capacity)"
                        value={spec.key}
                        onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                        className="flex-1 px-3.5 py-2 rounded-xl border border-[#E0DCD3] bg-white text-xs text-[#181F18] outline-none focus:border-[#2E7D32]"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. 10 - 14 Pax)"
                        value={spec.value}
                        onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                        className="flex-1 px-3.5 py-2 rounded-xl border border-[#E0DCD3] bg-white text-xs text-[#181F18] outline-none focus:border-[#2E7D32]"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecification(index)}
                        className="p-2 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Remove property"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Multi-Media Upload with Supabase */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#FAF9F5] border border-[#E0DCD3]">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider">
                      Multi-Media Gallery <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-[#5C665C]">
                      Upload high-res photography and video walkthroughs directly to Supabase storage bucket.
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-50 text-[#2E7D32] px-2 py-0.5 rounded border border-emerald-200 font-bold">
                    Storage: Supabase
                  </span>
                </div>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#E0DCD3] hover:border-[#2E7D32] bg-white rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-emerald-50/20 group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-[#2E7D32] flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                    <FolderUp className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-[#181F18]">
                    Click or drag & drop images and MP4 videos here
                  </p>
                  <p className="text-[11px] text-[#5C665C] mt-0.5">
                    Supports JPG, PNG, WEBP, MP4, MOV (Multiple uploads supported)
                  </p>
                </div>

                {/* Preview Grid */}
                {mediaList.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[#5C665C]">
                        {mediaList.length} media attached (click to preview)
                      </span>
                      <button
                        type="button"
                        onClick={() => openLightbox(mediaList, 0, formTitle || 'Space Media Preview')}
                        className="text-[11px] font-bold text-[#2E7D32] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Full Size Gallery</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-3 rounded-2xl bg-white border border-[#E0DCD3]">
                      {mediaList.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => openLightbox(mediaList, idx, formTitle || 'Space Media Preview')}
                          className="relative rounded-xl overflow-hidden border border-[#E0DCD3] hover:border-[#2E7D32] bg-[#EAE5DB] aspect-video group cursor-pointer shadow-2xs hover:shadow-md transition-all"
                        >
                          {item.type === 'video' ? (
                            <div className="w-full h-full bg-[#181F18] flex items-center justify-center text-white">
                              <Video className="w-6 h-6 text-[#4ADE80]" />
                            </div>
                          ) : (
                            <img
                              src={item.url}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="p-1.5 rounded-full bg-white/90 text-[#181F18] shadow-sm transform scale-90 group-hover:scale-100 transition-transform">
                              <Maximize2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                            </span>
                          </div>
                          <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded backdrop-blur-2xs truncate max-w-[70%]">
                            {item.name}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeMediaItem(idx);
                            }}
                            className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors cursor-pointer shadow-xs z-10"
                            title="Remove file"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Progress */}
                {uploading && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#181F18]">
                      <span className="flex items-center gap-1.5 text-[#2E7D32]">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading files to Supabase Storage...</span>
                      </span>
                      <span className="font-mono text-[#2E7D32]">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-emerald-200/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2E7D32] transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-[#5C665C] font-mono">{uploadStatusText}</p>
                  </div>
                )}
              </div>

              {/* 5. PRICING SECTION - DEDICATED HOURLY OR DAILY */}
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E0DCD3] space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Category-Specific Price */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider">
                        {config.priceLabel}
                      </label>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${config.badgeStyle}`}>
                        {config.badgeText}
                      </span>
                    </div>
                    <div className="relative">
                      <IndianRupee className="w-3.5 h-3.5 text-[#5C665C] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder={config.pricePlaceholder}
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-[#E0DCD3] bg-white text-xs text-[#181F18] font-bold outline-none focus:border-[#2E7D32]"
                      />
                    </div>
                    <span className="text-[10px] text-[#2E7D32] font-semibold block mt-1">
                      {config.priceHelper}
                    </span>
                  </div>

                  {/* GST in % Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider">
                        GST IN % *
                      </label>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border bg-amber-50 text-amber-900 border-amber-200">
                        Auto-Calc
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        placeholder="18"
                        value={formGstPercent}
                        onChange={(e) => setFormGstPercent(e.target.value)}
                        className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-[#E0DCD3] bg-white text-xs text-[#181F18] font-bold outline-none focus:border-[#2E7D32]"
                      />
                      <span className="text-xs font-bold text-[#5C665C] absolute right-3 top-1/2 -translate-y-1/2">%</span>
                    </div>
                    <span className="text-[10px] text-amber-700 font-semibold block mt-1">
                      {gstRate}% GST auto-added
                    </span>
                  </div>

                  {/* Seating Capacity */}
                  <div>
                    <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider mb-1.5">
                      Seating Capacity
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 10 - 15 Pax"
                      value={formCapacity}
                      onChange={(e) => setFormCapacity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0DCD3] bg-white text-xs text-[#181F18] outline-none focus:border-[#2E7D32]"
                    />
                  </div>

                  {/* Centre Location */}
                  <div>
                    <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider mb-1.5">
                      Centre Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kanke Road Sanctuary"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0DCD3] bg-white text-xs text-[#181F18] outline-none focus:border-[#2E7D32]"
                    />
                  </div>
                </div>

                {/* Real-time GST & Total Price Auto-Calculation Preview */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#E0DCD3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-[#5C665C] block">
                        {mode === 'day-pass' ? 'Base Price (Per Person)' : 'Base Price'}
                      </span>
                      <strong className="text-[#181F18] text-sm">₹ {numericBasePrice.toLocaleString('en-IN')}</strong>
                    </div>
                    <span className="text-neutral-300 font-bold text-lg">+</span>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-amber-800 block">GST ({gstRate}%)</span>
                      <strong className="text-amber-800 text-sm">₹ {calculatedGstAmount.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 bg-[#E8F5E9] px-4 py-2 rounded-xl border border-[#C8E6C9] w-full sm:w-auto justify-between sm:justify-start">
                    <span className="text-[11px] font-bold text-[#2E7D32] uppercase tracking-wider">Total with GST:</span>
                    <strong className="font-serif text-base font-bold text-[#1E5C23]">
                      ₹ {calculatedTotalAmount.toLocaleString('en-IN')} {mode === 'day-pass' ? '/ person' : '/ hr'}
                    </strong>
                  </div>
                </div>

                {/* Badge Tag */}
                <div>
                  <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider mb-1.5">
                    Feature Badge <span className="text-[10px] font-normal text-[#5C665C] normal-case">(Optional tag)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Instant Book, 4K Screen, Soundproof, Most Popular"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0DCD3] bg-white text-xs text-[#181F18] outline-none focus:border-[#2E7D32]"
                  />
                </div>
              </div>

              {/* INVENTORY TRACKING & MULTI-OFFICE ALLOCATION */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#2E7D32]" />
                      <span>Inventory Tracking & Multi-Office Allocation</span>
                    </h3>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Manage identical units ({mode === 'day-pass' ? 'e.g. 50 Day Pass Desks' : mode === 'meeting-rooms' ? 'e.g. 40 Meeting Rooms' : 'e.g. 10 Conference Halls'}) under this single listing.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                    Live Tracking
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Total Units */}
                  <div>
                    <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider mb-1.5">
                      Total Units / Quantity Available <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="5000"
                        value={formTotalUnits}
                        onChange={(e) => setFormTotalUnits(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0DCD3] bg-white text-xs text-[#181F18] font-bold outline-none focus:border-[#2E7D32]"
                      />
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setFormTotalUnits((prev) => Math.max(1, prev - 1))}
                          className="w-9 h-9 rounded-xl border border-[#E0DCD3] bg-white hover:bg-stone-50 font-bold text-sm text-[#181F18] flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormTotalUnits((prev) => prev + 1)}
                          className="w-9 h-9 rounded-xl border border-[#E0DCD3] bg-white hover:bg-stone-50 font-bold text-sm text-[#181F18] flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#5C665C] font-mono block mt-1">
                      Each approved booking on any date automatically reserves 1 unit from this pool.
                    </span>
                  </div>

                  {/* Low Inventory Alert Threshold */}
                  <div>
                    <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider mb-1.5">
                      Low Inventory Alert Limit (Popup Reminder) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={formAlertThreshold}
                      onChange={(e) => setFormAlertThreshold(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0DCD3] bg-white text-xs text-[#181F18] font-bold outline-none focus:border-[#2E7D32]"
                    />
                    <span className="text-[10px] text-amber-800 font-mono block mt-1">
                      When available units drop to &le; {formAlertThreshold}, admin sees an alert popup and user sees &ldquo;Few Left&rdquo;.
                    </span>
                  </div>
                </div>
              </div>

              {/* 6. Visibility Active Status */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E0DCD3]">
                <div>
                  <span className="text-xs font-bold text-[#181F18] block">Workspace Active Status</span>
                  <span className="text-[11px] text-[#5C665C] block">Display immediately on public booking portal</span>
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

              {/* Modal Footer */}
              <div className="pt-4 border-t border-[#E0DCD3] flex items-center justify-end gap-3 sticky bottom-0 bg-white">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  disabled={uploading}
                  className="rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={uploading}
                  className="rounded-xl text-xs font-bold bg-[#2E7D32] text-white hover:bg-[#1E5C23] shadow-md px-6 cursor-pointer"
                >
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to Supabase...</span>
                    </span>
                  ) : editingWorkspace ? (
                    'Save Space Changes'
                  ) : (
                    'Create Space Office'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. VIEW DETAILS DRAWER */}
      {viewModalOpen && viewingWorkspace && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col border-l border-[#E0DCD3] overflow-y-auto">
            <div className="p-6 border-b border-[#E0DCD3] bg-[#FAF9F5] flex items-center justify-between sticky top-0 z-10">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#2E7D32] block">
                  {viewingWorkspace.categoryName || config.title}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#181F18]">
                  {viewingWorkspace.title}
                </h3>
              </div>
              <button
                onClick={() => setViewModalOpen(false)}
                className="p-2 rounded-full hover:bg-neutral-200 text-[#5C665C] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Media Carousel */}
              {viewingWorkspace.mediaUrls && viewingWorkspace.mediaUrls.length > 0 && (
                <div className="space-y-2">
                  <div className="aspect-video rounded-2xl overflow-hidden bg-[#EAE5DB] border border-[#E0DCD3]">
                    {viewingWorkspace.mediaUrls[0].type === 'video' ? (
                      <video
                        src={viewingWorkspace.mediaUrls[0].url}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={viewingWorkspace.mediaUrls[0].url}
                        alt={viewingWorkspace.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  {viewingWorkspace.mediaUrls.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {viewingWorkspace.mediaUrls.map((m, i) => (
                        <div
                          key={i}
                          onClick={() => openLightbox(viewingWorkspace.mediaUrls, i, viewingWorkspace.title)}
                          className="aspect-video rounded-lg overflow-hidden border border-[#E0DCD3] cursor-pointer hover:border-[#2E7D32]"
                        >
                          <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Price & Specs */}
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E0DCD3] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#5C665C]">Commercial Rate:</span>
                  <strong className="text-sm font-mono text-[#2E7D32]">
                    {viewingWorkspace.price || 'Custom Quote'}
                  </strong>
                </div>
                {viewingWorkspace.capacity && (
                  <div className="flex items-center justify-between border-t border-[#E0DCD3]/60 pt-2 text-xs">
                    <span className="text-[#5C665C]">Seating Capacity:</span>
                    <strong className="text-[#181F18]">{viewingWorkspace.capacity}</strong>
                  </div>
                )}
                {viewingWorkspace.location && (
                  <div className="flex items-center justify-between border-t border-[#E0DCD3]/60 pt-2 text-xs">
                    <span className="text-[#5C665C]">Location:</span>
                    <strong className="text-[#181F18]">{viewingWorkspace.location}</strong>
                  </div>
                )}
              </div>

              {/* Descriptions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#181F18] uppercase tracking-wider">Descriptions</h4>
                <p className="text-xs text-[#304032] leading-relaxed bg-[#FAF9F5] p-3.5 rounded-xl border border-[#E0DCD3]">
                  {viewingWorkspace.shortDescription}
                </p>
                {viewingWorkspace.longDescription && (
                  <p className="text-xs text-[#5C665C] leading-relaxed whitespace-pre-line p-3.5">
                    {viewingWorkspace.longDescription}
                  </p>
                )}
              </div>

              {/* Key-Value Specifications */}
              {viewingWorkspace.specifications && viewingWorkspace.specifications.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#181F18] uppercase tracking-wider">
                    Specifications & Amenities
                  </h4>
                  <div className="space-y-1.5">
                    {viewingWorkspace.specifications.map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF9F5] border border-[#E0DCD3] text-xs">
                        <span className="text-[#5C665C] font-mono">{s.key}</span>
                        <strong className="text-[#181F18]">{s.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#E0DCD3] bg-[#FAF9F5] flex items-center justify-end gap-2 mt-auto">
              <Button
                variant="outline"
                onClick={() => {
                  setViewModalOpen(false);
                  openEditModal(viewingWorkspace);
                }}
                className="rounded-xl text-xs cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 mr-1" />
                <span>Edit Space</span>
              </Button>
              <Button
                onClick={() => setViewModalOpen(false)}
                className="rounded-xl text-xs bg-[#2E7D32] text-white hover:bg-[#1E5C23] cursor-pointer"
              >
                Close Drawer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 6. FULL-SCREEN LIGHTBOX MODAL */}
      {lightboxOpen && lightboxItems.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 backdrop-blur-md animate-in fade-in duration-200 select-none">
          {/* Header */}
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-3">
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold">{lightboxTitle}</h3>
              <span className="text-xs font-mono text-white/60">
                Item {lightboxCurrentIndex + 1} of {lightboxItems.length} · {lightboxItems[lightboxCurrentIndex].name}
              </span>
            </div>
            <button
              onClick={closeLightbox}
              className="p-2 rounded-full hover:bg-white/10 text-white cursor-pointer transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Active Media Container */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            {lightboxItems[lightboxCurrentIndex].type === 'video' ? (
              <video
                src={lightboxItems[lightboxCurrentIndex].url}
                controls
                autoPlay
                className="max-h-[75vh] max-w-full rounded-2xl shadow-2xl"
              />
            ) : (
              <img
                src={lightboxItems[lightboxCurrentIndex].url}
                alt={lightboxItems[lightboxCurrentIndex].name}
                className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
              />
            )}

            {/* Prev / Next Arrows */}
            {lightboxItems.length > 1 && (
              <>
                <button
                  onClick={prevLightboxItem}
                  className="absolute left-2 sm:left-6 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-all cursor-pointer hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextLightboxItem}
                  className="absolute right-2 sm:right-6 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-all cursor-pointer hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
            {lightboxItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setLightboxCurrentIndex(idx)}
                className={`relative w-14 h-10 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                  idx === lightboxCurrentIndex ? 'border-[#4ADE80] scale-105' : 'border-white/30 opacity-60 hover:opacity-100'
                }`}
              >
                {item.type === 'video' ? (
                  <div className="w-full h-full bg-[#181F18] flex items-center justify-center text-white">
                    <Video className="w-4 h-4 text-[#4ADE80]" />
                  </div>
                ) : (
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Low Inventory Alert Reminder Popup Modal for Admin */}
      {alertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-amber-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="p-6 bg-amber-500/10 border-b border-amber-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-900 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-amber-700 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-amber-950">
                    Low Inventory Reminder & Alert ({config.title})
                  </h3>
                  <p className="text-xs text-amber-800">
                    Showing spaces at or below alert limit on {inventoryCheckDate}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAlertModalOpen(false)}
                className="p-2 rounded-xl text-amber-900 hover:bg-amber-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content List */}
            <div className="p-6 overflow-y-auto space-y-3">
              {lowStockWorkspaces.length === 0 ? (
                <div className="p-8 text-center text-sm text-[#5C665C]">
                  No spaces are low on stock for {inventoryCheckDate}. All inventory levels are healthy!
                </div>
              ) : (
                lowStockWorkspaces.map(({ ws, inv }) => (
                  <div
                    key={ws.id}
                    className="p-4 rounded-2xl border border-amber-200/90 bg-amber-50/40 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#181F18]">{ws.title}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                          {ws.price || 'Standard'}
                        </span>
                      </div>
                      <div className="text-xs text-[#5C665C] mt-1 flex items-center gap-3">
                        <span>Total Units: <strong>{inv.totalUnits}</strong></span>
                        <span>Booked: <strong className="text-amber-800">{inv.bookedUnits}</strong></span>
                        <span>Available: <strong className={inv.availableUnits === 0 ? 'text-red-700' : 'text-amber-700'}>{inv.availableUnits}</strong></span>
                        <span>Alert Limit: <strong>&le; {inv.alertThreshold}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                          inv.availableUnits === 0
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {inv.availableUnits === 0 ? 'Sold Out' : `Only ${inv.availableUnits} Left`}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setAlertModalOpen(false);
                          openEditModal(ws);
                        }}
                        className="px-3 py-1.5 bg-[#2E7D32] hover:bg-[#1E5C23] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        Adjust Capacity
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 px-6 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-[#5C665C]">
              <span>Tip: Set the alert limit to get notified before this space runs completely out of stock.</span>
              <button
                type="button"
                onClick={() => setAlertModalOpen(false)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold rounded-xl cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
