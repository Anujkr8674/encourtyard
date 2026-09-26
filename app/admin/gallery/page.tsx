'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, Image as ImageIcon, Trash2, Edit3, Save, 
  X, AlertCircle, CheckCircle2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, RefreshCw, ZoomIn
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useFeedbackModal } from '@/context/FeedbackModalContext';

interface GalleryImage {
  id: string;
  url: string;
  heading: string | null;
  description: string | null;
  order: number;
  createdAt: string;
}

interface UploadItem {
  id: string; // local unique id
  file: File;
  preview: string;
  heading: string;
  description: string;
  progress: number;
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { showSuccess, showError } = useFeedbackModal();

  // Upload state
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(images.length / itemsPerPage);
  
  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ heading: '', description: '' });

  // Lightbox modal state
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
    // Cleanup previews on unmount
    return () => {
      uploadItems.forEach(item => URL.revokeObjectURL(item.preview));
    };
  }, []);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/gallery?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setImages(data.images);
      } else {
        showError({ title: 'Failed to fetch gallery images', message: 'Please try refreshing the page.' });
      }
    } catch (err) {
      showError({ title: 'Network Error', message: 'An error occurred while fetching images.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newItems: UploadItem[] = files.map(file => ({
        id: Math.random().toString(36).substring(7),
        file,
        preview: URL.createObjectURL(file),
        heading: '',
        description: '',
        progress: 0,
      }));
      setUploadItems(prev => [...prev, ...newItems]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeUploadItem = (id: string) => {
    setUploadItems(prev => {
      const filtered = prev.filter(item => {
        if (item.id === id) {
          URL.revokeObjectURL(item.preview);
          return false;
        }
        return true;
      });
      return filtered;
    });
  };

  const clearSelection = () => {
    uploadItems.forEach(item => URL.revokeObjectURL(item.preview));
    setUploadItems([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const updateUploadItemText = (id: string, field: 'heading' | 'description', value: string) => {
    setUploadItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const uploadFileWithProgress = (item: UploadItem): Promise<{ success: boolean; url?: string }> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/admin/gallery/upload');
      
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setUploadItems(prev => prev.map(ui => 
            ui.id === item.id ? { ...ui, progress: percentComplete } : ui
          ));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error('Upload failed'));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during upload'));

      const formData = new FormData();
      formData.append('file', item.file);
      xhr.send(formData);
    });
  };

  const handleUpload = async () => {
    if (uploadItems.length === 0) return;
    setIsUploading(true);

    let uploadedCount = 0;
    try {
      for (const item of uploadItems) {
        // 1. Upload to Supabase Storage with progress
        const uploadData = await uploadFileWithProgress(item);
        
        if (uploadData.success && uploadData.url) {
          // 2. Save metadata to DB
          // Set to minimum order - 1 so it appears at the very top
          const currentMinOrder = images.length > 0 ? Math.min(...images.map(img => img.order || 0)) : 1;
          const order = currentMinOrder - 1;
          
          const saveRes = await fetch('/api/admin/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url: uploadData.url,
              heading: item.heading,
              description: item.description,
              order,
            }),
          });
          
          if (saveRes.ok) uploadedCount++;
        }
      }

      if (uploadedCount > 0) {
        showSuccess({ title: 'Upload Complete', message: `Successfully uploaded ${uploadedCount} image(s) to the gallery.` });
        clearSelection();
        fetchImages();
      } else {
        showError({ title: 'Upload Failed', message: 'Failed to upload images. Please try again.' });
      }
    } catch (err) {
      showError({ title: 'Upload Error', message: 'An error occurred during upload. Please try again.' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setImages(images.filter(img => img.id !== id));
        setSelectedIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        showSuccess({ title: 'Image Deleted', message: 'The image has been removed from the gallery.' });
      } else {
        showError({ title: 'Delete Failed', message: 'Failed to delete the image.' });
      }
    } catch (err) {
      showError({ title: 'Error', message: 'An error occurred while deleting the image.' });
    } finally {
      setIsDeleting(false);
      fetchImages(); // Refresh to ensure UI matches DB exactly
    }
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === paginatedImages.length && paginatedImages.length > 0) {
      setSelectedIds(new Set()); // Deselect all on current page
    } else {
      const newSet = new Set(selectedIds);
      paginatedImages.forEach(img => newSet.add(img.id));
      setSelectedIds(newSet);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} selected image(s)?`)) return;
    setIsDeleting(true);
    try {
      const res = await fetch('/api/admin/gallery/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds) })
      });
      if (res.ok) {
        setImages(images.filter(img => !selectedIds.has(img.id)));
        setSelectedIds(new Set());
        showSuccess({ title: 'Images Deleted', message: `Successfully deleted selected images.` });
      } else {
        showError({ title: 'Delete Failed', message: 'Failed to delete selected images.' });
      }
    } catch (err) {
      showError({ title: 'Error', message: 'An error occurred while deleting images.' });
    } finally {
      setIsDeleting(false);
      fetchImages();
    }
  };

  const startEditing = (img: GalleryImage) => {
    setEditingId(img.id);
    setEditForm({ heading: img.heading || '', description: img.description || '' });
  };

  const saveEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setImages(images.map(img => img.id === id ? { ...img, heading: editForm.heading, description: editForm.description } : img));
        setEditingId(null);
        showSuccess({ title: 'Updated', message: 'Image metadata has been updated successfully.' });
      } else {
        showError({ title: 'Update Failed', message: 'Failed to update image metadata.' });
      }
    } catch (err) {
      showError({ title: 'Error', message: 'An error occurred while saving.' });
    }
  };

  const handleReorder = async (id: string, direction: 'left' | 'right') => {
    const currentIndex = images.findIndex(img => img.id === id);
    if (
      (direction === 'left' && currentIndex === 0) || 
      (direction === 'right' && currentIndex === images.length - 1)
    ) return;

    const targetIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;

    // Swap locally
    const newImages = [...images];
    const temp = newImages[currentIndex];
    newImages[currentIndex] = newImages[targetIndex];
    newImages[targetIndex] = temp;

    // Re-sequence all orders to ensure no duplicates (like all being 1)
    const updates = newImages.map((img, idx) => {
      img.order = idx + 1;
      return { id: img.id, order: img.order };
    });

    setImages(newImages);

    try {
      await fetch('/api/admin/gallery/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      });
    } catch (err) {
      showError({ title: 'Error', message: 'Failed to reorder items' });
      fetchImages(); 
    }
  };

  const paginatedImages = images.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-[#E5E1D8] shadow-sm">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#181F18]">Gallery Management</h1>
          <p className="text-sm text-[#5C665C] mt-1">Upload and manage workspace images for the public gallery.</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-3xl border border-[#E5E1D8] shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-[#181F18] font-serif border-b border-[#E5E1D8] pb-4">
          Upload New Images
        </h2>
        
        <div className="border-2 border-dashed border-[#C5D5C5] rounded-2xl p-8 text-center bg-[#F7F5F0] hover:bg-[#EFECE3] transition-colors relative">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            ref={fileInputRef}
          />
          <div className="pointer-events-none flex flex-col items-center">
            <Upload className="w-10 h-10 text-[#2E7D32] mb-3" />
            <p className="text-[#181F18] font-semibold text-sm">Drag and drop images here, or click to select</p>
            <p className="text-[#5C665C] text-xs mt-2">Supports JPG, PNG, WEBP</p>
          </div>
        </div>

        {uploadItems.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-[#181F18]">Selected Files ({uploadItems.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploadItems.map((item) => (
                <div key={item.id} className="bg-white border border-[#E5E1D8] rounded-xl shadow-sm flex flex-col relative overflow-hidden group">
                  {/* Remove Button */}
                  {!isUploading && (
                    <button 
                      onClick={() => removeUploadItem(item.id)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full z-10 shadow-md transition-transform hover:scale-110"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  {/* Preview Image */}
                  <div className="relative aspect-video bg-[#F7F5F0]">
                    <img src={item.preview} alt="Preview" className="w-full h-full object-cover" />
                    {/* Progress Bar Overlay */}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center flex-col gap-2 backdrop-blur-[2px]">
                        <span className="text-white font-bold text-lg">{item.progress}%</span>
                        <div className="w-3/4 h-2 bg-white/30 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#4ADE80] transition-all duration-300"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Details Inputs */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col">
                    <input 
                      type="text"
                      placeholder="Heading (Optional)"
                      value={item.heading}
                      onChange={(e) => updateUploadItemText(item.id, 'heading', e.target.value)}
                      disabled={isUploading}
                      className="w-full text-sm p-2 rounded-lg border border-[#E5E1D8] focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] outline-none disabled:bg-gray-50 disabled:text-gray-500"
                    />
                    <textarea 
                      placeholder="Description (Optional)"
                      value={item.description}
                      onChange={(e) => updateUploadItemText(item.id, 'description', e.target.value)}
                      disabled={isUploading}
                      rows={2}
                      className="w-full text-xs p-2 rounded-lg border border-[#E5E1D8] focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] outline-none resize-none flex-1 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4 border-t border-[#E5E1D8]">
              <Button onClick={handleUpload} disabled={isUploading} className="bg-[#2E7D32] hover:bg-[#263626] text-white">
                {isUploading ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Uploading...</> : 'Upload All Files'}
              </Button>
              <Button onClick={clearSelection} disabled={isUploading} variant="outline" className="border-[#E5E1D8] text-[#5C665C] hover:bg-gray-50">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Gallery Grid */}
      <div className="bg-white p-6 rounded-3xl border border-[#E5E1D8] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E5E1D8] pb-4">
          <h2 className="text-lg font-bold text-[#181F18] font-serif">
            Gallery Images ({images.length})
          </h2>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {images.length > 0 && (
              <>
                <Button onClick={handleSelectAll} variant="outline" size="sm" className="h-8 text-xs border-[#E5E1D8] whitespace-nowrap">
                  {selectedIds.size === paginatedImages.length && paginatedImages.length > 0 ? 'Deselect Page' : 'Mark All'}
                </Button>
                {selectedIds.size > 0 && (
                  <Button 
                    onClick={handleBulkDelete} 
                    size="sm" 
                    icon={<Trash2 className="w-3.5 h-3.5" />}
                    iconPosition="left"
                    className="h-8 text-xs bg-red-500 hover:bg-red-600 text-white shadow-sm whitespace-nowrap"
                  >
                    Delete Selected ({selectedIds.size})
                  </Button>
                )}
              </>
            )}
            <Button 
              onClick={fetchImages} 
              variant="outline" 
              size="sm" 
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              iconPosition="left"
              className="h-8 text-xs border-[#E5E1D8] whitespace-nowrap"
            >
              Refresh
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-[#5C665C]">
            <RefreshCw className="w-8 h-8 animate-spin mb-4 text-[#2E7D32]" />
            <p>Loading gallery...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="py-20 text-center text-[#5C665C]">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No images found in the gallery.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedImages.map((img, idx) => (
                <div key={img.id} className="bg-[#F7F5F0] rounded-2xl overflow-hidden border border-[#E5E1D8] shadow-sm flex flex-col group">
                  <div className="relative aspect-video bg-[#EAE5DB] overflow-hidden">
                    <img src={img.url} alt={img.heading || 'Gallery image'} className="w-full h-full object-cover" />
                    
                    {/* Checkbox - Top Left */}
                    <div className="absolute top-2 left-2 z-10">
                      <button 
                        onClick={() => toggleSelection(img.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shadow-lg ${
                          selectedIds.has(img.id) 
                            ? 'bg-[#2E7D32] border-[#2E7D32]' 
                            : 'bg-white/90 border-gray-300 hover:border-[#2E7D32]'
                        }`}
                        title={selectedIds.has(img.id) ? "Deselect" : "Select image"}
                      >
                        {selectedIds.has(img.id) && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </button>
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px] pointer-events-none">
                      <button 
                        onClick={() => setLightboxImage(img.url)}
                        className="pointer-events-auto bg-white/90 hover:bg-white text-[#181F18] p-2 rounded-full shadow-lg transition-transform hover:scale-110"
                        title="View Full Size"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Delete Button - Top Right */}
                    <button 
                      onClick={() => handleDelete(img.id)}
                      className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-10"
                      title="Delete Image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col gap-3">
                    {editingId === img.id ? (
                      <div className="space-y-3">
                        <input 
                          type="text" 
                          value={editForm.heading} 
                          onChange={(e) => setEditForm({ ...editForm, heading: e.target.value })}
                          placeholder="Heading (Optional)"
                          className="w-full text-sm p-2 rounded-lg border border-[#E5E1D8] focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] outline-none"
                        />
                        <textarea 
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          placeholder="Description (Optional)"
                          rows={2}
                          className="w-full text-xs p-2 rounded-lg border border-[#E5E1D8] focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] outline-none resize-none"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveEdit(img.id)} className="w-full h-8 bg-[#2E7D32] hover:bg-[#263626] text-white text-xs">
                            <Save className="w-3.5 h-3.5 mr-1.5" /> Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="w-full h-8 text-xs border-[#E5E1D8]">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <h3 className="font-semibold text-[#181F18] text-sm line-clamp-1">{img.heading || <span className="text-[#C5D5C5] italic font-normal">No heading</span>}</h3>
                          <p className="text-xs text-[#5C665C] mt-1 line-clamp-2">{img.description || <span className="text-[#C5D5C5] italic font-normal">No description provided</span>}</p>
                        </div>
                        <div className="mt-auto pt-3 border-t border-[#E5E1D8] flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-mono text-[#5C665C] mb-1">Order: {img.order || 0}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 bg-[#EFECE3] p-1 rounded-lg">
                            <button 
                              onClick={() => handleReorder(img.id, 'left')}
                              disabled={currentPage === 1 && idx === 0}
                              className="p-1 rounded text-[#5C665C] hover:bg-white hover:text-[#181F18] disabled:opacity-30 disabled:hover:bg-transparent transition-colors shadow-sm"
                              title="Move Left"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleReorder(img.id, 'right')}
                              disabled={currentPage === totalPages && idx === paginatedImages.length - 1}
                              className="p-1 rounded text-[#5C665C] hover:bg-white hover:text-[#181F18] disabled:opacity-30 disabled:hover:bg-transparent transition-colors shadow-sm"
                              title="Move Right"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button 
                            onClick={() => startEditing(img)}
                            className="text-xs text-[#2E7D32] font-semibold flex items-center hover:underline"
                          >
                            <Edit3 className="w-3 h-3 mr-1" /> Edit
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-[#E5E1D8]">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="border-[#E5E1D8] text-[#5C665C]"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <span className="text-sm font-medium text-[#181F18]">
                  Page {currentPage} of {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="border-[#E5E1D8] text-[#5C665C]"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-sm" onClick={() => setLightboxImage(null)}>
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2"
            onClick={() => setLightboxImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img 
            src={lightboxImage} 
            alt="Enlarged gallery view" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}

      {/* Global Loading Overlay for Upload/Delete */}
      {(isUploading || isDeleting) && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 select-none">
          <div className="bg-white p-8 rounded-3xl max-w-sm w-full shadow-2xl animate-scaleUp">
            <RefreshCw className="w-12 h-12 text-[#2E7D32] animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-bold font-serif text-[#181F18] mb-2 text-center">
              {isUploading ? 'Uploading Images' : 'Deleting Image'}
            </h3>
            <p className="text-[#5C665C] text-sm text-center">
              {isUploading 
                ? 'Please wait while your images are safely uploaded to the server.' 
                : 'Please wait while the image is being removed.'}
            </p>
            {isUploading && uploadItems.length > 0 && (
               <div className="mt-6 space-y-4">
                  {uploadItems.map(item => (
                    <div key={item.id} className="text-left text-xs">
                       <div className="flex justify-between mb-1.5 text-[#5C665C]">
                         <span className="truncate pr-2 font-medium">{item.file.name}</span>
                         <span className="font-bold text-[#2E7D32]">{item.progress}%</span>
                       </div>
                       <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                         <div 
                           className="h-full bg-[#4ADE80] transition-all duration-300 ease-out" 
                           style={{ width: `${item.progress}%` }} 
                         />
                       </div>
                    </div>
                  ))}
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
