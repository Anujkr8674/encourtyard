'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Building2,
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
  Layers,
  Video,
  Image as ImageIcon,
  Tag,
  ListPlus,
  DollarSign,
  Users,
  MapPin,
  ExternalLink,
  Maximize2,
  Sparkles,
  Calendar,
  Hash
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useFeedbackModal } from '@/context/FeedbackModalContext';

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface SpecItem {
  key: string;
  value: string;
}

interface MediaItem {
  url: string;
  type: 'image' | 'video';
  name: string;
  size?: number;
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
  createdAt: string | Date;
}

export default function AdminWorkspacesPage() {
  const { showSuccess, showError } = useFeedbackModal();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);

  // View Details Modal State
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingWorkspace, setViewingWorkspace] = useState<Workspace | null>(null);

  // Full-Size Media Lightbox Modal State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxItems, setLightboxItems] = useState<MediaItem[]>([]);
  const [lightboxCurrentIndex, setLightboxCurrentIndex] = useState(0);
  const [lightboxTitle, setLightboxTitle] = useState('');

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formShortDescription, setFormShortDescription] = useState('');
  const [formLongDescription, setFormLongDescription] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCapacity, setFormCapacity] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);

  // Key-Value Specifications
  const [specifications, setSpecifications] = useState<SpecItem[]>([
    { key: 'Seating Capacity', value: '4 - 6 Pax' },
    { key: 'Soundproofing', value: 'Acoustic Double Glazed STC 65' },
    { key: 'Internet', value: '1Gbps Dedicated Fiber VLAN' },
  ]);

  // Multiple Media Files & Upload State
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusText, setUploadStatusText] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Workspaces and Categories from API
  const loadData = async () => {
    try {
      setLoading(true);
      const [resWs, resCat] = await Promise.all([
        fetch('/api/workspaces', { cache: 'no-store' }),
        fetch('/api/categories', { cache: 'no-store' }),
      ]);
      const dataWs = await resWs.json();
      const dataCat = await resCat.json();

      if (dataWs.success && Array.isArray(dataWs.workspaces)) {
        setWorkspaces(dataWs.workspaces);
      }
      if (dataCat.success && Array.isArray(dataCat.categories)) {
        setCategories(dataCat.categories);
        if (dataCat.categories.length > 0 && !formCategoryId) {
          setFormCategoryId(dataCat.categories[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load workspaces data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Reset pagination on filter or search
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterCategory]);

  // Lightbox handlers
  const openLightbox = (items: MediaItem[], initialIndex: number = 0, title: string = 'Workspace Media') => {
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

  // Keyboard navigation for Lightbox
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

  // Specification Key-Value Helpers
  const addSpecRow = () => {
    setSpecifications((prev) => [...prev, { key: '', value: '' }]);
  };

  const updateSpecRow = (index: number, field: 'key' | 'value', val: string) => {
    setSpecifications((prev) => {
      const next = [...prev];
      next[index][field] = val;
      return next;
    });
  };

  const removeSpecRow = (index: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

  // Multiple Media Selection & Local Preview
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate size (max 50MB per video/image)
    for (const f of files) {
      if (f.size > 50 * 1024 * 1024) {
        setFormError(`File "${f.name}" exceeds the 50MB limit.`);
        return;
      }
    }

    setFormError('');
    setSelectedFiles((prev) => [...prev, ...files]);

    // Generate local preview objects
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

  // Upload Media Files to Supabase Storage: encourtyard-upload/work-space
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

  // Submit Form (Create or Edit Workspace)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formTitle.trim()) {
      setFormError('Workspace heading/title is required.');
      return;
    }
    if (!formCategoryId) {
      setFormError('Please select a workspace category.');
      return;
    }
    if (!formShortDescription.trim()) {
      setFormError('Short description is required.');
      return;
    }
    if (mediaList.length === 0 && selectedFiles.length === 0) {
      setFormError('Please upload at least one image or video for this workspace office.');
      return;
    }

    const selectedCategory = categories.find((c) => c.id === formCategoryId);
    const categoryName = selectedCategory ? selectedCategory.name : 'Workspace Category';

    let finalMediaList = [...mediaList];

    // Upload newly chosen files to Supabase Storage if any
    if (selectedFiles.length > 0) {
      try {
        const uploadedItems = await uploadMediaToSupabase(selectedFiles);
        // Replace blob preview URLs with permanent Supabase public URLs
        const existingPermanent = mediaList.filter((m) => !m.url.startsWith('blob:'));
        finalMediaList = [...existingPermanent, ...uploadedItems];
      } catch (uploadErr: any) {
        setFormError(uploadErr.message || 'Failed to upload media to Supabase Storage');
        setUploading(false);
        return;
      }
    }

    // Filter valid specs
    const validSpecs = specifications.filter((s) => s.key.trim() && s.value.trim());

    const payload = {
      title: formTitle.trim(),
      categoryId: formCategoryId,
      categoryName,
      shortDescription: formShortDescription.trim(),
      longDescription: formLongDescription.trim() || null,
      specifications: validSpecs,
      mediaUrls: finalMediaList,
      price: formPrice.trim() || null,
      capacity: formCapacity.trim() || null,
      location: formLocation.trim() || null,
      badge: formBadge.trim() || null,
      isActive: formIsActive,
      order: workspaces.length + 1,
    };

    try {
      if (editingWorkspace) {
        // Update
        const res = await fetch(`/api/workspaces/${editingWorkspace.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update workspace');
        setFormSuccess('Workspace office updated successfully!');
        showSuccess({
          variant: 'file',
          title: 'Workspace Updated!',
          message: `Workspace "${formTitle.trim()}" specifications and media have been updated.`,
          primaryBtnText: 'Done',
          autoCloseMs: 2500,
        });
      } else {
        // Create
        const res = await fetch('/api/workspaces', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create workspace');
        setFormSuccess('Workspace office created successfully!');
        showSuccess({
          variant: 'minimal',
          title: 'Workspace Created!',
          message: `Workspace office "${formTitle.trim()}" is now published and active.`,
          primaryBtnText: 'Okay',
          autoCloseMs: 2500,
        });
      }

      await loadData();
      closeModal();
    } catch (err: any) {
      const msg = err.message || 'An error occurred while saving the workspace office.';
      setFormError(msg);
      showError({
        variant: 'cta',
        title: 'Failed to Save Workspace',
        message: msg,
        primaryBtnText: 'Try Again',
      });
    } finally {
      setUploading(false);
    }
  };

  const openCreateModal = () => {
    setEditingWorkspace(null);
    setFormTitle('');
    setFormCategoryId(categories[0]?.id || '');
    setFormShortDescription('');
    setFormLongDescription('');
    setFormPrice('');
    setFormCapacity('');
    setFormLocation('');
    setFormBadge('');
    setFormIsActive(true);
    setSpecifications([
      { key: 'Seating Capacity', value: '4 - 6 Pax' },
      { key: 'Soundproofing', value: 'Acoustic Double Glazed STC 65' },
      { key: 'Internet', value: '1Gbps Dedicated Fiber VLAN' },
    ]);
    setMediaList([]);
    setSelectedFiles([]);
    setUploadProgress(0);
    setFormError('');
    setFormSuccess('');
    setModalOpen(true);
  };

  const openEditModal = (ws: Workspace) => {
    setEditingWorkspace(ws);
    setFormTitle(ws.title);
    setFormCategoryId(ws.categoryId);
    setFormShortDescription(ws.shortDescription);
    setFormLongDescription(ws.longDescription || '');
    setFormPrice(ws.price || '');
    setFormCapacity(ws.capacity || '');
    setFormLocation(ws.location || '');
    setFormBadge(ws.badge || '');
    setFormIsActive(ws.isActive);
    setSpecifications(
      Array.isArray(ws.specifications) && ws.specifications.length > 0
        ? ws.specifications
        : [{ key: 'Capacity', value: ws.capacity || '1 Pax' }]
    );
    setMediaList(Array.isArray(ws.mediaUrls) ? ws.mediaUrls : []);
    setSelectedFiles([]);
    setUploadProgress(0);
    setFormError('');
    setFormSuccess('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingWorkspace(null);
    setSelectedFiles([]);
    setMediaList([]);
    setUploading(false);
  };

  const openViewModal = (ws: Workspace) => {
    setViewingWorkspace(ws);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setViewingWorkspace(null);
  };

  const handleEditFromView = () => {
    if (viewingWorkspace) {
      const wsToEdit = viewingWorkspace;
      closeViewModal();
      openEditModal(wsToEdit);
    }
  };

  const handleMoveWorkspace = async (ws: Workspace, direction: 'up' | 'down') => {
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

    // Optimistic UI update
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
        message: `Workspace "${ws.title}" moved ${direction}. Live position updated.`,
        primaryBtnText: 'Okay',
        autoCloseMs: 1800,
      });
    } catch (err) {
      console.error('Failed to swap workspace order:', err);
      showError({
        variant: 'cta',
        title: 'Order Update Failed',
        message: 'Could not persist the new workspace display order.',
        primaryBtnText: 'Try Again',
      });
      loadData();
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the workspace office "${title}"?`)) return;
    try {
      const res = await fetch(`/api/workspaces/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setWorkspaces((prev) => prev.filter((w) => w.id !== id));
        showSuccess({
          variant: 'minimal',
          title: 'Workspace Deleted',
          message: `Workspace office "${title}" has been permanently removed.`,
          primaryBtnText: 'Done',
          autoCloseMs: 2500,
        });
      } else {
        const data = await res.json().catch(() => ({}));
        showError({
          variant: 'warning',
          title: 'Delete Failed',
          message: data.error || `Unable to delete workspace "${title}".`,
          primaryBtnText: 'Okay',
        });
      }
    } catch (err: any) {
      console.error('Failed to delete workspace:', err);
      showError({
        variant: 'cta',
        title: 'Delete Error',
        message: err.message || 'An error occurred while deleting the workspace.',
        primaryBtnText: 'Try Again',
      });
    }
  };

  // Filter & Pagination Calculations
  const sortedWorkspaces = [...workspaces].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
  const filteredWorkspaces = sortedWorkspaces.filter((w) => {
    const matchCat = filterCategory === 'ALL' || w.categoryId === filterCategory;
    const matchSearch =
      w.title.toLowerCase().includes(search.toLowerCase()) ||
      w.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
      w.categoryName.toLowerCase().includes(search.toLowerCase()) ||
      (w.location && w.location.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const totalItems = filteredWorkspaces.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedWorkspaces = filteredWorkspaces.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Banner Header with Balanced Layout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-[#E0DCD3] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#2E7D32] text-[10px] font-mono font-bold uppercase tracking-wider">
              WORKSPACE INVENTORY
            </span>
            <span className="text-xs text-[#5C665C] font-mono hidden md:inline">
              Storage: encourtyard-upload/work-space
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18] tracking-tight">
            Workspaces & Offices ({workspaces.length})
          </h1>
          <p className="text-xs sm:text-sm text-[#5C665C] mt-0.5">
            Add offices and suites under your categories with rich descriptions, custom property specifications, and multi-media galleries.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          <Link
            href="/workspaces"
            target="_blank"
            className="h-11 px-4 py-2 rounded-2xl bg-white hover:bg-[#FAF9F5] border border-[#E0DCD3] hover:border-[#2E7D32]/50 text-[#181F18] text-xs font-semibold flex items-center gap-2 transition-all shadow-xs shrink-0 whitespace-nowrap cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#2E7D32]" />
            <span>Preview Public Workspaces</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#5C665C]" />
          </Link>

          <button
            type="button"
            onClick={openCreateModal}
            className="h-11 px-5 py-2 rounded-2xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white shadow-md flex items-center gap-2 text-xs font-bold transition-all shrink-0 whitespace-nowrap cursor-pointer hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Workspace</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E0DCD3] shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#6A806A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search workspaces, location, specs..."
              className="w-full pl-9 pr-4 py-2 bg-[#FAF9F5] border border-[#E0DCD3] focus:border-[#2E7D32] rounded-xl text-xs text-[#181F18] outline-none transition-colors"
            />
          </div>

          {/* Category Filter Dropdown */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 bg-[#FAF9F5] border border-[#E0DCD3] focus:border-[#2E7D32] rounded-xl text-xs text-[#181F18] outline-none font-medium"
          >
            <option value="ALL">All Workspace Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                Category: {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <span className="text-xs text-[#6A806A] font-mono">
            Showing {totalItems === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + pageSize, totalItems)} of {totalItems} workspaces
          </span>
          <button
            type="button"
            onClick={loadData}
            className="p-2 rounded-xl bg-[#FAF9F5] hover:bg-[#E3EBE3] border border-[#E0DCD3] text-[#181F18] text-xs transition-colors cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#2E7D32] ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Workspaces Data Table */}
      <div className="bg-white border border-[#E0DCD3] rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E0DCD3] text-[#6A806A] font-mono uppercase text-[11px] tracking-wider">
                <th className="py-4 px-4 w-20 text-center">Order</th>
                <th className="py-4 px-4 w-24">Media</th>
                <th className="py-4 px-4">Workspace Heading</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Short Description</th>
                <th className="py-4 px-4">Storage & Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E0DCD3]/70">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#5C665C]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-6 h-6 text-[#2E7D32] animate-spin" />
                      <span className="text-xs font-mono">Loading workspaces from database...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedWorkspaces.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#5C665C]">
                    <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#2E7D32] flex items-center justify-center mb-1">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <span className="font-serif text-sm font-bold text-[#181F18]">No Workspaces Found</span>
                      <span className="text-xs text-[#5C665C]">
                        {search || filterCategory !== 'ALL'
                          ? 'No workspaces matched your current filter.'
                          : 'Click "Add New Workspace" to create your first office under a category.'}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedWorkspaces.map((ws) => {
                  const firstMedia = ws.mediaUrls?.[0];
                  const mediaCount = ws.mediaUrls?.length || 0;
                  const globalIdx = sortedWorkspaces.findIndex((w) => w.id === ws.id);
                  const isFirst = globalIdx === 0;
                  const isLast = globalIdx === sortedWorkspaces.length - 1;

                  return (
                    <tr key={ws.id} className="hover:bg-[#FAF9F5] transition-colors group">
                      {/* Sort Order Position with Up/Down Arrows */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#FAF9F5] border border-[#E0DCD3] font-mono font-bold text-xs text-[#181F18] shadow-2xs">
                            {ws.order || 1}
                          </span>
                          <div className="flex flex-col gap-0.5">
                            <button
                              type="button"
                              onClick={() => handleMoveWorkspace(ws, 'up')}
                              disabled={isFirst}
                              className={`w-5 h-4 rounded flex items-center justify-center transition-colors ${
                                isFirst
                                  ? 'text-gray-300 cursor-not-allowed opacity-30'
                                  : 'text-[#5C665C] hover:bg-[#2E7D32] hover:text-white cursor-pointer'
                              }`}
                              title="Move Workspace Up"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveWorkspace(ws, 'down')}
                              disabled={isLast}
                              className={`w-5 h-4 rounded flex items-center justify-center transition-colors ${
                                isLast
                                  ? 'text-gray-300 cursor-not-allowed opacity-30'
                                  : 'text-[#5C665C] hover:bg-[#2E7D32] hover:text-white cursor-pointer'
                              }`}
                              title="Move Workspace Down"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Media Thumbnail with Gallery Counter & Fullscreen Click */}
                      <td className="py-3.5 px-4">
                        <div
                          onClick={() => {
                            if (ws.mediaUrls && ws.mediaUrls.length > 0) {
                              openLightbox(ws.mediaUrls, 0, ws.title);
                            } else {
                              openViewModal(ws);
                            }
                          }}
                          className={`w-16 h-14 rounded-xl overflow-hidden bg-[#EAE5DB] border border-[#E0DCD3] shadow-xs relative shrink-0 cursor-pointer hover:border-[#2E7D32] hover:shadow-md`}
                          title={ws.mediaUrls && ws.mediaUrls.length > 0 ? 'Click to preview media full size' : 'Click to view details'}
                        >
                          {firstMedia?.type === 'video' ? (
                            <div className="w-full h-full bg-[#181F18] flex items-center justify-center text-white">
                              <Video className="w-5 h-5 text-[#4ADE80]" />
                            </div>
                          ) : (
                            <img
                              src={firstMedia?.url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80'}
                              alt={ws.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}
                          {mediaCount > 1 && (
                            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/75 text-white text-[9px] font-mono font-bold backdrop-blur-xs">
                              +{mediaCount - 1}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Title & Route */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => openViewModal(ws)}
                          className="font-serif text-sm font-bold text-[#181F18] block leading-snug hover:text-[#2E7D32] text-left transition-colors cursor-pointer"
                        >
                          {ws.title}
                        </button>
                        <span className="text-[10px] text-[#6A806A] font-mono block mt-0.5">
                          /{ws.slug}
                        </span>
                      </td>

                      {/* Category Badge */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-[#1B5E20] border border-emerald-200 font-bold text-[11px]">
                          <Layers className="w-3 h-3 text-[#2E7D32]" />
                          <span>{ws.categoryName}</span>
                        </span>
                      </td>

                      {/* Short Description */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-xs text-[#5C665C] leading-relaxed line-clamp-2">
                          {ws.shortDescription}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                              ws.isActive
                                ? 'bg-emerald-50 text-[#2E7D32] border border-emerald-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                ws.isActive ? 'bg-[#2E7D32] animate-pulse' : 'bg-red-500'
                              }`}
                            />
                            {ws.isActive ? 'Active' : 'Hidden'}
                          </span>
                          <span className="block text-[10px] text-[#6A806A] font-mono">
                            Supabase Media
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            type="button"
                            onClick={() => openViewModal(ws)}
                            className="p-2 rounded-xl bg-[#FAF9F5] hover:bg-emerald-50 text-[#181F18] hover:text-[#2E7D32] border border-[#E0DCD3] transition-colors cursor-pointer"
                            title="View Workspace Details"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#2E7D32]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(ws)}
                            className="p-2 rounded-xl bg-[#FAF9F5] hover:bg-emerald-50 text-[#181F18] hover:text-[#2E7D32] border border-[#E0DCD3] transition-colors cursor-pointer"
                            title="Edit Workspace"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(ws.id, ws.title)}
                            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                            title="Delete Workspace"
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

        {/* Pagination Footer: 10 Rows per Window */}
        {totalItems > 0 && (
          <div className="p-4 border-t border-[#E0DCD3] bg-[#FAF9F5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-[#5C665C] font-mono">
              Page {currentPage} of {totalPages} ({totalItems} total workspaces)
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

              {/* Numbered Page Buttons */}
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
      {/* MODAL: Workspace Details View Modal (Deep Dive)                          */}
      {/* ========================================================================= */}
      {viewModalOpen && viewingWorkspace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={closeViewModal}
          />

          <div className="relative z-10 w-full max-w-3xl bg-white rounded-3xl border border-[#E0DCD3] shadow-2xl overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#E0DCD3] bg-[#FAF9F5] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#2E7D32] text-[10px] font-mono font-bold uppercase tracking-wider">
                    WORKSPACE DETAILS OVERVIEW
                  </span>
                  <span className="text-[11px] text-[#5C665C] font-mono">
                    Order #{viewingWorkspace.order || 1}
                  </span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#181F18]">
                  {viewingWorkspace.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeViewModal}
                className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[78vh] overflow-y-auto font-sans">
              {/* Media Gallery Showcase Strip */}
              {viewingWorkspace.mediaUrls && viewingWorkspace.mediaUrls.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#181F18] uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#2E7D32]" />
                      <span>Media Gallery ({viewingWorkspace.mediaUrls.length} items)</span>
                    </span>
                    <span className="text-[11px] text-[#5C665C] font-mono">
                      Click any item to view full size
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {viewingWorkspace.mediaUrls.map((media, idx) => (
                      <div
                        key={idx}
                        onClick={() => openLightbox(viewingWorkspace.mediaUrls, idx, viewingWorkspace.title)}
                        className="relative h-28 rounded-xl overflow-hidden bg-[#EAE5DB] border border-[#E0DCD3] shadow-xs cursor-pointer group hover:border-[#2E7D32] hover:shadow-md transition-all"
                      >
                        {media.type === 'video' ? (
                          <div className="w-full h-full bg-[#181F18] flex items-center justify-center text-white">
                            <Video className="w-6 h-6 text-[#4ADE80] group-hover:scale-110 transition-transform" />
                          </div>
                        ) : (
                          <img
                            src={media.url}
                            alt={media.name || `Media ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Maximize2 className="w-5 h-5 drop-shadow-md" />
                        </div>
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-mono">
                          #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Essential Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FAF9F5] border border-[#E0DCD3]">
                <div>
                  <span className="text-[10px] text-[#6A806A] uppercase font-mono block">Category</span>
                  <span className="inline-flex items-center gap-1 mt-0.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#1B5E20] border border-emerald-200 font-bold text-xs">
                    <Layers className="w-3 h-3 text-[#2E7D32]" />
                    <span>{viewingWorkspace.categoryName}</span>
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-[#6A806A] uppercase font-mono block">Slug / Public Route</span>
                  <span className="font-mono text-xs font-semibold text-[#2E7D32] block mt-0.5">
                    /{viewingWorkspace.slug}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-[#6A806A] uppercase font-mono block">Pricing & Rate</span>
                  <span className="text-xs font-bold text-[#181F18] block mt-0.5">
                    {viewingWorkspace.price || 'Contact for Quote'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-[#6A806A] uppercase font-mono block">Capacity / Team Size</span>
                  <span className="text-xs font-semibold text-[#181F18] block mt-0.5">
                    {viewingWorkspace.capacity || 'Flexible Seating'}
                  </span>
                </div>

                {viewingWorkspace.location && (
                  <div>
                    <span className="text-[10px] text-[#6A806A] uppercase font-mono block">Location / Floor</span>
                    <span className="text-xs font-semibold text-[#181F18] block mt-0.5">
                      {viewingWorkspace.location}
                    </span>
                  </div>
                )}

                {viewingWorkspace.badge && (
                  <div>
                    <span className="text-[10px] text-[#6A806A] uppercase font-mono block">Badge / Highlight</span>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold">
                      {viewingWorkspace.badge}
                    </span>
                  </div>
                )}

                <div>
                  <span className="text-[10px] text-[#6A806A] uppercase font-mono block">Visibility Status</span>
                  <span
                    className={`inline-flex items-center gap-1.5 mt-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      viewingWorkspace.isActive
                        ? 'bg-emerald-50 text-[#2E7D32] border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        viewingWorkspace.isActive ? 'bg-[#2E7D32] animate-pulse' : 'bg-red-500'
                      }`}
                    />
                    {viewingWorkspace.isActive ? 'Active on Public Site' : 'Hidden'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-[#6A806A] uppercase font-mono block">Sort Order</span>
                  <span className="text-xs font-bold font-mono text-[#181F18] block mt-0.5">
                    Position #{viewingWorkspace.order || 1}
                  </span>
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white border border-[#E0DCD3]">
                  <span className="text-[10px] text-[#6A806A] uppercase font-mono font-bold block mb-1">
                    Short Description
                  </span>
                  <p className="text-xs text-[#181F18] leading-relaxed">
                    {viewingWorkspace.shortDescription}
                  </p>
                </div>

                {viewingWorkspace.longDescription && (
                  <div className="p-4 rounded-2xl bg-white border border-[#E0DCD3]">
                    <span className="text-[10px] text-[#6A806A] uppercase font-mono font-bold block mb-1">
                      Detailed Overview
                    </span>
                    <p className="text-xs text-[#5C665C] leading-relaxed whitespace-pre-line">
                      {viewingWorkspace.longDescription}
                    </p>
                  </div>
                )}
              </div>

              {/* Key-Value Specifications Grid */}
              {Array.isArray(viewingWorkspace.specifications) && viewingWorkspace.specifications.length > 0 && (
                <div className="p-5 rounded-2xl bg-white border border-[#E0DCD3] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E0DCD3] pb-2.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#2E7D32]" />
                      <span className="text-xs font-bold text-[#181F18] uppercase tracking-wider">
                        Property Specifications ({viewingWorkspace.specifications.length} items)
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[#5C665C]">
                      Custom Property Specs
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {viewingWorkspace.specifications.map((spec, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F5] border border-[#E0DCD3]"
                      >
                        <span className="text-xs font-mono text-[#6A806A]">{spec.key}:</span>
                        <span className="text-xs font-semibold text-[#181F18]">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical / Database Metadata Box */}
              <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E0DCD3] text-[11px] space-y-1.5 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[#6A806A]">Workspace ID:</span>
                  <span className="text-[#181F18] select-all">{viewingWorkspace.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6A806A]">Storage Bucket:</span>
                  <span className="text-[#2E7D32]">encourtyard-upload/work-space</span>
                </div>
                {viewingWorkspace.createdAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#6A806A]">Created At:</span>
                    <span className="text-[#181F18]">
                      {new Date(viewingWorkspace.createdAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-[#E0DCD3] bg-[#FAF9F5] flex items-center justify-between gap-3">
              <Link
                href="/workspaces"
                target="_blank"
                className="px-4 py-2 rounded-xl bg-white hover:bg-[#EAE5DC] border border-[#E0DCD3] text-[#181F18] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Eye className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>Preview Public Page</span>
                <ArrowUpRight className="w-3 h-3 text-[#5C665C]" />
              </Link>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeViewModal}
                  className="rounded-xl text-xs"
                >
                  Close
                </Button>
                <button
                  type="button"
                  onClick={handleEditFromView}
                  className="px-5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit This Workspace</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Create / Edit Workspace with Multi-Media & Key-Value Properties   */}
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
                  SUPABASE BUCKET · encourtyard-upload/work-space
                </span>
                <h2 className="font-serif text-xl font-bold text-[#181F18] mt-0.5">
                  {editingWorkspace ? 'Edit Workspace Office' : 'Add New Workspace Office'}
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
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto font-sans">
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

              {/* 1. Category Selection & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider mb-1.5">
                    Parent Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E0DCD3] bg-[#FAF9F5] text-xs text-[#181F18] focus:outline-none focus:border-[#2E7D32] focus:bg-white font-medium"
                  >
                    {categories.length === 0 ? (
                      <option value="">No categories available - create one first</option>
                    ) : (
                      categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider mb-1.5">
                    Workspace Heading / Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Single Executive Suite, Team Pod A"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E0DCD3] bg-[#FAF9F5] text-xs text-[#181F18] focus:outline-none focus:border-[#2E7D32] focus:bg-white font-medium"
                  />
                </div>
              </div>

              {/* 2. Short & Long Description */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider mb-1.5">
                    Short Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Brief 1-sentence summary for preview cards"
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
                    placeholder="Detailed overview of layout, acoustic treatment, seating ergonomics, and included services..."
                    value={formLongDescription}
                    onChange={(e) => setFormLongDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E0DCD3] bg-[#FAF9F5] text-xs text-[#181F18] focus:outline-none focus:border-[#2E7D32] focus:bg-white font-medium"
                  />
                </div>
              </div>

              {/* 3. Key-Value Specifications */}
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E0DCD3] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#181F18] uppercase tracking-wider block">
                      Property Specifications (Key-Value Pairs)
                    </span>
                    <span className="text-[11px] text-[#5C665C] block">
                      Add features like seating, acoustic rating, power, floor location, and amenities.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={addSpecRow}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-[#2E7D32] border border-[#E0DCD3] hover:border-emerald-300 text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Property</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {specifications.map((spec, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Key (e.g. Seating Capacity)"
                        value={spec.key}
                        onChange={(e) => updateSpecRow(index, 'key', e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-[#E0DCD3] bg-white text-xs text-[#181F18] focus:border-[#2E7D32] outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. 6 Pax)"
                        value={spec.value}
                        onChange={(e) => updateSpecRow(index, 'value', e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-[#E0DCD3] bg-white text-xs text-[#181F18] focus:border-[#2E7D32] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecRow(index)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                        title="Delete Property"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Multiple Images / Video Uploads with Supabase Storage */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider">
                  Multiple Media Files (Supabase: <span className="text-[#2E7D32] font-mono font-normal">encourtyard-upload/work-space</span>) <span className="text-red-500">*</span>
                </label>

                {/* Dropzone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#D0C9BE] hover:border-[#2E7D32] rounded-2xl p-5 text-center cursor-pointer bg-[#FAF9F5] hover:bg-[#F4F1EA] transition-all"
                >
                  <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFilesChange}
                    accept="image/*,video/*"
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-11 h-11 rounded-full bg-emerald-100 text-[#2E7D32] flex items-center justify-center shadow-xs">
                      <FolderUp className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#181F18]">
                        Click to select multiple images & video files
                      </p>
                      <p className="text-[11px] text-[#5C665C]">
                        Upload JPG, PNG, WEBP, MP4, MOV (Auto-saved to <span className="text-[#2E7D32] font-mono">encourtyard-upload/work-space</span>)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Media Preview Grid with Fullscreen Click */}
                {mediaList.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[#5C665C]">
                        {mediaList.length} media file{mediaList.length > 1 ? 's' : ''} attached (Click any thumbnail to preview in full size)
                      </span>
                      <button
                        type="button"
                        onClick={() => openLightbox(mediaList, 0, formTitle || 'Workspace Media Preview')}
                        className="text-[11px] font-bold text-[#2E7D32] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Full Size Gallery</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-3 rounded-2xl bg-[#FAF9F5] border border-[#E0DCD3]">
                      {mediaList.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => openLightbox(mediaList, idx, formTitle || 'Workspace Media Preview')}
                          className="relative rounded-xl overflow-hidden border border-[#E0DCD3] hover:border-[#2E7D32] bg-[#EAE5DB] aspect-video group cursor-pointer shadow-xs hover:shadow-md transition-all"
                          title="Click to open full size preview"
                        >
                          {item.type === 'video' ? (
                            <div className="w-full h-full bg-[#181F18] flex items-center justify-center text-white">
                              <Video className="w-6 h-6 text-[#4ADE80] group-hover:scale-110 transition-transform" />
                            </div>
                          ) : (
                            <img
                              src={item.url}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}

                          {/* Hover Overlay with Eye */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="p-1.5 rounded-full bg-white/90 text-[#181F18] shadow-sm transform scale-90 group-hover:scale-100 transition-transform">
                              <Maximize2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                            </span>
                          </div>

                          <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded backdrop-blur-xs truncate max-w-[70%]">
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

                {/* Upload Progress Bar */}
                {uploading && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#181F18]">
                      <span className="flex items-center gap-1.5 text-[#2E7D32]">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading media files to Supabase...</span>
                      </span>
                      <span className="font-mono text-[#2E7D32]">{uploadProgress}%</span>
                    </div>

                    <div className="w-full h-2.5 bg-emerald-200/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#2E7D32] to-[#4ADE80] transition-all duration-300 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-[#5C665C] font-mono">{uploadStatusText}</p>
                  </div>
                )}
              </div>

              {/* 5. Pricing, Capacity & Location (PRICING IS OPTIONAL) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider">
                      Pricing <span className="text-[10px] font-normal text-[#5C665C] normal-case">(Optional)</span>
                    </label>
                    <span className="text-[10px] font-mono text-[#2E7D32] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">
                      Optional
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. ₹45,000 / month (or leave empty)"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0DCD3] bg-[#FAF9F5] text-xs text-[#181F18] outline-none focus:border-[#2E7D32] focus:bg-white"
                  />
                  <span className="text-[10px] text-[#6A806A] block mt-1">
                    Leave blank for &quot;Contact for Quote&quot;
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider mb-1.5">
                    Seating Capacity <span className="text-[10px] font-normal text-[#5C665C] normal-case">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4 - 6 Pax"
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0DCD3] bg-[#FAF9F5] text-xs text-[#181F18] outline-none focus:border-[#2E7D32] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider mb-1.5">
                    Centre Location <span className="text-[10px] font-normal text-[#5C665C] normal-case">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kanke Road Sanctuary"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0DCD3] bg-[#FAF9F5] text-xs text-[#181F18] outline-none focus:border-[#2E7D32] focus:bg-white"
                  />
                </div>
              </div>

              {/* 6. Visibility Status Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E0DCD3]">
                <div>
                  <span className="text-xs font-bold text-[#181F18] block">Workspace Active Status</span>
                  <span className="text-[11px] text-[#5C665C] block">Display immediately on the user portal under the category</span>
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
              <div className="pt-4 border-t border-[#E0DCD3] flex items-center justify-end gap-3">
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
                  className="rounded-xl bg-gradient-to-r from-[#2E7D32] to-[#1E5C23] hover:from-[#1E5C23] hover:to-[#144218] text-white shadow-md text-xs font-bold px-6 py-2.5 cursor-pointer"
                >
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Workspace...</span>
                    </span>
                  ) : editingWorkspace ? (
                    'Update Workspace'
                  ) : (
                    'Create Workspace'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULL-SIZE MEDIA LIGHTBOX MODAL (OPENS ON IMAGE / VIDEO CLICK)            */}
      {/* ========================================================================= */}
      {lightboxOpen && lightboxItems.length > 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 select-none animate-fadeIn">
          {/* Dark Backdrop */}
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-md"
            onClick={closeLightbox}
          />

          <div className="relative z-10 max-w-5xl w-full max-h-[92vh] flex flex-col bg-[#141B14] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-scaleUp text-white">
            {/* Lightbox Top Header */}
            <div className="p-4 px-6 border-b border-white/10 bg-black/40 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <span className="px-2.5 py-0.5 rounded-full bg-[#2E7D32] text-white text-[10px] font-mono font-bold uppercase tracking-wider shrink-0">
                  {lightboxItems[lightboxCurrentIndex]?.type === 'video' ? 'VIDEO PREVIEW' : 'IMAGE PREVIEW'}
                </span>
                <div className="truncate">
                  <h3 className="font-serif text-sm sm:text-base font-bold text-white truncate">
                    {lightboxTitle}
                  </h3>
                  <p className="text-[11px] text-emerald-400 font-mono truncate">
                    {lightboxItems[lightboxCurrentIndex]?.name || `Media Item ${lightboxCurrentIndex + 1}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono text-white/70 px-2.5 py-1 rounded-lg bg-white/10">
                  {lightboxCurrentIndex + 1} / {lightboxItems.length}
                </span>
                <a
                  href={lightboxItems[lightboxCurrentIndex]?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Open original file in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={closeLightbox}
                  className="p-2 rounded-xl bg-white/10 hover:bg-red-500/80 text-white transition-colors cursor-pointer"
                  title="Close Preview (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Lightbox Media Container */}
            <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 bg-black/60 min-h-[350px] max-h-[70vh] overflow-hidden">
              {lightboxItems[lightboxCurrentIndex]?.type === 'video' ? (
                <video
                  src={lightboxItems[lightboxCurrentIndex]?.url}
                  controls
                  autoPlay
                  className="max-h-[66vh] max-w-full rounded-2xl shadow-2xl bg-black"
                />
              ) : (
                <img
                  src={lightboxItems[lightboxCurrentIndex]?.url}
                  alt={lightboxItems[lightboxCurrentIndex]?.name || 'Workspace Image'}
                  className="max-h-[66vh] max-w-full object-contain rounded-2xl shadow-2xl"
                />
              )}

              {/* Previous Navigation Button */}
              {lightboxItems.length > 1 && (
                <button
                  type="button"
                  onClick={prevLightboxItem}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-[#2E7D32] text-white border border-white/20 backdrop-blur-sm transition-all shadow-xl cursor-pointer hover:scale-110"
                  title="Previous item (Left Arrow)"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Next Navigation Button */}
              {lightboxItems.length > 1 && (
                <button
                  type="button"
                  onClick={nextLightboxItem}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-[#2E7D32] text-white border border-white/20 backdrop-blur-sm transition-all shadow-xl cursor-pointer hover:scale-110"
                  title="Next item (Right Arrow)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Lightbox Thumbnails Strip (if multiple items) */}
            {lightboxItems.length > 1 && (
              <div className="p-3 px-6 border-t border-white/10 bg-black/40 flex items-center gap-2.5 overflow-x-auto">
                {lightboxItems.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setLightboxCurrentIndex(idx)}
                    className={`relative w-14 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      lightboxCurrentIndex === idx
                        ? 'border-[#4ADE80] scale-105 shadow-md ring-2 ring-[#4ADE80]/30'
                        : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/50'
                    }`}
                  >
                    {item.type === 'video' ? (
                      <div className="w-full h-full bg-[#181F18] flex items-center justify-center text-white">
                        <Video className="w-4 h-4 text-[#4ADE80]" />
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
