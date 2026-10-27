'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  QrCode,
  Upload,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  Trash2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Save,
  Check,
  Sparkles,
  Layers,
  ArrowUpRight,
  Clock,
  Radio
} from 'lucide-react';
import { FeedbackModal } from '@/components/ui/FeedbackModal';

export interface QrPaymentMethod {
  id: string;
  name: string;
  qrCodeUrl: string;
  upiId: string;
  merchantName: string;
  notes: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface QrConfig {
  enabled: boolean;
  qrCodeUrl: string;
  upiId: string;
  merchantName: string;
  notes: string;
}

export default function AdminQrCodePage() {
  const [config, setConfig] = useState<QrConfig>({
    enabled: true,
    qrCodeUrl: '',
    upiId: 'encourtyard@upi',
    merchantName: 'EnCourtyard Architectural Coworking',
    notes: 'Scan using any UPI app (GPay, PhonePe, Paytm, BHIM). After payment, enter your 12-digit UTR number and upload screenshot.',
  });

  const [methods, setMethods] = useState<QrPaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedUrlId, setCopiedUrlId] = useState<string | null>(null);
  const [methodNameInput, setMethodNameInput] = useState('');
  const [selectedMethodForView, setSelectedMethodForView] = useState<QrPaymentMethod | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [feedback, setFeedback] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  // Fetch current config & table of payment methods
  const fetchConfig = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await fetch('/api/admin/qr-code', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (data.config) {
            setConfig(data.config);
            if (data.config.qrCodeUrl) {
              setPreviewUrl(data.config.qrCodeUrl);
            }
          }
          if (Array.isArray(data.methods)) {
            setMethods(data.methods);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load QR code config:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Upload file directly to Supabase Storage and auto-persist to table immediately!
  const handleUploadAndSave = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upiId', config.upiId);
      formData.append('merchantName', config.merchantName);
      formData.append('notes', config.notes);
      formData.append('name', methodNameInput.trim() || selectedFile.name.replace(/\.[^/.]+$/, "") || 'Official UPI QR Code');

      const res = await fetch('/api/admin/qr-code/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setConfig((prev) => ({ ...prev, qrCodeUrl: data.url }));
        setPreviewUrl(data.url);
        setSelectedFile(null);
        setMethodNameInput('');
        if (fileInputRef.current) fileInputRef.current.value = '';

        if (Array.isArray(data.methods)) {
          setMethods(data.methods);
        } else {
          fetchConfig(true);
        }

        setFeedback({
          isOpen: true,
          type: 'success',
          title: 'QR Code Saved & Activated',
          message: 'QR code uploaded to Supabase Storage (encourtyard-upload/qr-code/) and activated in database table. It is now live for user payments.',
        });
      } else {
        throw new Error(data.error || 'Failed to upload QR code image');
      }
    } catch (err: any) {
      setFeedback({
        isOpen: true,
        type: 'error',
        title: 'Upload Failed',
        message: err.message || 'Error uploading QR code to Supabase',
      });
    } finally {
      setUploading(false);
    }
  };

  // Save UPI & Merchant form details
  const handleSaveFormDetails = async () => {
    try {
      setSaving(true);

      const res = await fetch('/api/admin/qr-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_config',
          ...config,
          methodName: methodNameInput.trim() || 'Primary UPI QR Code',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (Array.isArray(data.methods)) {
          setMethods(data.methods);
        }
        setFeedback({
          isOpen: true,
          type: 'success',
          title: 'Details Saved Successfully',
          message: 'UPI ID, Merchant Name, and Checkout Instructions have been updated in the database and applied to the user payment page.',
        });
      } else {
        throw new Error(data.error || 'Failed to save details');
      }
    } catch (err: any) {
      setFeedback({
        isOpen: true,
        type: 'error',
        title: 'Save Failed',
        message: err.message || 'Error saving settings',
      });
    } finally {
      setSaving(false);
    }
  };

  // Set a specific method from table as active
  const handleSetActiveMethod = async (method: QrPaymentMethod) => {
    try {
      const res = await fetch('/api/admin/qr-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'set_active',
          id: method.id,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setConfig((prev) => ({
          ...prev,
          qrCodeUrl: method.qrCodeUrl,
          upiId: method.upiId || prev.upiId,
          merchantName: method.merchantName || prev.merchantName,
        }));
        setPreviewUrl(method.qrCodeUrl);
        if (Array.isArray(data.methods)) {
          setMethods(data.methods);
        }
        setFeedback({
          isOpen: true,
          type: 'success',
          title: 'Active QR Method Switched',
          message: `"${method.name}" is now the active QR code for customer bookings.`,
        });
      }
    } catch (err: any) {
      console.error('Failed to set active QR:', err);
    }
  };

  // Delete a method
  const handleDeleteMethod = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete payment method "${name}"?`)) return;

    try {
      const res = await fetch('/api/admin/qr-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_method',
          id,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (Array.isArray(data.methods)) {
          setMethods(data.methods);
          const active = data.methods.find((m: any) => m.isActive);
          if (active) {
            setConfig((prev) => ({ ...prev, qrCodeUrl: active.qrCodeUrl }));
            setPreviewUrl(active.qrCodeUrl);
          } else {
            setConfig((prev) => ({ ...prev, qrCodeUrl: '' }));
            setPreviewUrl('');
          }
        }
        setFeedback({
          isOpen: true,
          type: 'success',
          title: 'Method Removed',
          message: `Payment method "${name}" has been removed from database.`,
        });
      }
    } catch (err: any) {
      console.error('Delete error:', err);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrlId(id);
    setTimeout(() => setCopiedUrlId(null), 2000);
  };

  const handleCopyUpi = () => {
    if (config.upiId) {
      navigator.clipboard.writeText(config.upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans pb-16 text-[#181F18]">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <QrCode className="w-3.5 h-3.5" />
            <span>PAYMENT GATEWAY MANAGER</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18]">
            QR Code & UPI Gateway
          </h1>
          <p className="text-xs sm:text-sm text-[#5C665C] mt-0.5">
            Upload merchant QR codes directly to Supabase storage (<code className="font-mono text-[#2E7D32]">encourtyard-upload/qr-code</code>), view configured payment methods table, and manage active checkout.
          </p>
        </div>

        {/* Action Buttons - Fixed single-row styling matching Image 2 */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={handleSaveFormDetails}
            disabled={saving || loading}
            className="h-11 px-5 py-2 rounded-2xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white shadow-md flex items-center gap-2 text-xs font-bold transition-all shrink-0 whitespace-nowrap cursor-pointer hover:shadow-lg disabled:opacity-60"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                <span className="whitespace-nowrap">Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Save QR Settings</span>
              </>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-[#E5E1D8] rounded-3xl p-16 text-center space-y-3 shadow-xs">
          <div className="w-8 h-8 border-3 border-[#2E7D32] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-sm text-[#5C665C]">Loading QR Code Configuration & Methods Table...</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN: Upload & Configuration Form (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* 1. Gateway Status Switch Card */}
              <div className="bg-white border border-[#E5E1D8] rounded-3xl p-5 sm:p-6 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-mono font-bold text-[#2E7D32] block mb-0.5">
                    GATEWAY ACTIVE STATUS
                  </span>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#181F18]">
                    Enable QR Code Payment
                  </h3>
                  <p className="text-xs text-[#5C665C] mt-0.5">
                    When enabled, users will see the UPI QR code on the payment page for Day Pass, Meeting Rooms, and Conference Hall.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={(e) => {
                      const newEnabled = e.target.checked;
                      setConfig((prev) => ({ ...prev, enabled: newEnabled }));
                      // Persist toggle immediately
                      fetch('/api/admin/qr-code', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...config, enabled: newEnabled }),
                      });
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6.5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5.5 after:w-5.5 after:transition-all peer-checked:bg-[#2E7D32]"></div>
                </label>
              </div>

              {/* 2. QR Code Image Upload to Supabase Card */}
              <div className="bg-white border border-[#E5E1D8] rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E1D8]">
                  <div>
                    <span className="text-xs uppercase font-mono font-bold text-[#2E7D32] block mb-0.5">
                      SUPABASE STORAGE BUCKET
                    </span>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#181F18]">
                      Upload QR Code File
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#2E7D32] border border-emerald-200 text-[10px] font-mono font-bold">
                    Folder: qr-code/
                  </span>
                </div>

                {/* Upload Dropzone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#D2CBBF] hover:border-[#2E7D32] bg-[#FAF9F5] hover:bg-emerald-50/20 rounded-2xl p-6 text-center cursor-pointer transition-all group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-white border border-[#E5E1D8] text-[#2E7D32] flex items-center justify-center mx-auto mb-2 shadow-2xs group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-[#181F18]">
                    Click or drag UPI QR Code image here
                  </h4>
                  <p className="text-[11px] text-[#5C665C] mt-0.5">
                    Recommended format: Square PNG, JPG, or SVG (Minimum 400x400 px)
                  </p>
                  {selectedFile && (
                    <span className="inline-block mt-3 px-3 py-1 bg-emerald-100 text-[#1E5C23] rounded-lg text-xs font-mono font-bold border border-emerald-300">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </span>
                  )}
                </div>

                {/* Optional Method Title before upload */}
                {selectedFile && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-[#181F18] uppercase tracking-wider mb-1">
                        Payment Method Title (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Primary GPay / PhonePe QR, EnCourtyard Corporate"
                        value={methodNameInput}
                        onChange={(e) => setMethodNameInput(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E5E1D8] bg-white text-xs text-[#181F18] focus:outline-none focus:border-[#2E7D32]"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(config.qrCodeUrl);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="px-3 py-2 rounded-xl border border-[#E5E1D8] bg-white text-xs text-[#5C665C] hover:bg-[#FAF9F5] cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleUploadAndSave}
                        disabled={uploading}
                        className="px-5 py-2 rounded-xl bg-[#2E7D32] text-white text-xs font-bold hover:bg-[#1E5C23] cursor-pointer inline-flex items-center gap-1.5 shadow-md active:scale-98"
                      >
                        {uploading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading & Activating...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload & Save in Table</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Merchant & UPI Details Form with SAVE BUTTON */}
              <div className="bg-white border border-[#E5E1D8] rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#E5E1D8]">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#181F18]">
                    UPI & Merchant Details
                  </h3>
                  <span className="text-[10px] font-mono text-[#5C665C]">
                    Displayed on user payment page
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#181F18] uppercase tracking-wider mb-1.5">
                      UPI ID / VPA <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. encourtyard@upi"
                      value={config.upiId}
                      onChange={(e) => setConfig((prev) => ({ ...prev, upiId: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E1D8] bg-[#FAF9F5] text-[#181F18] font-mono text-xs focus:outline-none focus:border-[#2E7D32] focus:bg-white"
                    />
                    <span className="text-[10px] text-[#5C665C] mt-1 block">
                      Clients can copy this UPI ID to pay manually.
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-[#181F18] uppercase tracking-wider mb-1.5">
                      Merchant / Business Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. EnCourtyard Architectural Coworking"
                      value={config.merchantName}
                      onChange={(e) => setConfig((prev) => ({ ...prev, merchantName: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E1D8] bg-[#FAF9F5] text-[#181F18] text-xs font-medium focus:outline-none focus:border-[#2E7D32] focus:bg-white"
                    />
                    <span className="text-[10px] text-[#5C665C] mt-1 block">
                      Displayed above QR code for payee verification.
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#181F18] uppercase tracking-wider mb-1.5 text-xs">
                    Checkout Payment Instructions
                  </label>
                  <textarea
                    rows={3}
                    value={config.notes}
                    onChange={(e) => setConfig((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="e.g. Scan using any UPI app (GPay, PhonePe, Paytm). Enter UTR and upload screenshot..."
                    className="w-full p-3 rounded-xl border border-[#E5E1D8] bg-[#FAF9F5] text-[#181F18] text-xs focus:outline-none focus:border-[#2E7D32] focus:bg-white resize-none"
                  />
                </div>

                {/* Explicit SAVE BUTTON inside this form as requested by user in Image 1 */}
                <div className="pt-3 border-t border-[#E5E1D8] flex items-center justify-end">
                  <button
                    type="button"
                    onClick={handleSaveFormDetails}
                    disabled={saving}
                    className="h-11 px-6 py-2.5 rounded-2xl bg-[#2E7D32] hover:bg-[#1E5C23] text-white text-xs font-bold shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-60 inline-flex items-center gap-2 shrink-0 whitespace-nowrap"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save UPI & Merchant Details</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN: Live Customer Preview (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF9F5] border border-[#E5E1D8] rounded-3xl p-5 sm:p-6 shadow-sm sticky top-6">
                
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E1D8]">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#2E7D32]" />
                    <span className="text-xs font-bold font-serif text-[#181F18]">
                      Active QR Code On Checkout
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      config.enabled && config.qrCodeUrl
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}
                  >
                    {config.enabled && config.qrCodeUrl ? '● Active' : '○ Standby'}
                  </span>
                </div>

                <div className="py-5 flex flex-col items-center text-center space-y-4">
                  
                  {/* Merchant Name */}
                  <div>
                    <h4 className="font-serif text-base font-bold text-[#181F18]">
                      {config.merchantName || 'EnCourtyard Architectural Coworking'}
                    </h4>
                    <p className="text-[11px] text-[#5C665C] mt-0.5">
                      Official Verified UPI Merchant
                    </p>
                  </div>

                  {/* QR Code Container */}
                  <div className="p-4 bg-white rounded-2xl border-2 border-[#E5E1D8] shadow-sm relative group max-w-[240px] aspect-square flex items-center justify-center">
                    {previewUrl ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img
                          src={previewUrl}
                          alt="EnCourtyard UPI QR Code"
                          className="w-full h-full object-contain rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity">
                          <a
                            href={previewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-white text-xs font-bold text-[#181F18] shadow-md inline-flex items-center gap-1"
                          >
                            <span>Open Image</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-6 text-neutral-400 space-y-2">
                        <QrCode className="w-16 h-16 mx-auto stroke-1" />
                        <span className="text-[11px] font-mono block">No QR Uploaded Yet</span>
                      </div>
                    )}
                  </div>

                  {/* Amount Simulation Badge */}
                  <div className="px-4 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                    <span className="text-[10px] font-mono text-[#5C665C] block">Sample Office Booking Amount</span>
                    <strong className="text-base font-serif font-bold text-[#1E5C23]">
                      ₹ 1,180 (Inc. 18% GST)
                    </strong>
                  </div>

                  {/* Copy UPI Section */}
                  <div className="w-full bg-white p-3 rounded-xl border border-[#E5E1D8] flex items-center justify-between gap-2 text-xs">
                    <div className="text-left truncate">
                      <span className="text-[9px] uppercase font-mono text-[#5C665C] block">UPI ID / VPA</span>
                      <strong className="font-mono text-[#181F18] truncate block">
                        {config.upiId || 'not configured'}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="p-1.5 rounded-lg bg-[#FAF9F5] hover:bg-neutral-100 text-[#2E7D32] border border-[#E5E1D8] shrink-0 cursor-pointer"
                      title="Copy UPI ID"
                    >
                      {copiedUpi ? <Check className="w-3.5 h-3.5 text-[#2E7D32]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Client Instruction Snippet */}
                  <p className="text-[11px] text-[#5C665C] leading-relaxed">
                    {config.notes}
                  </p>

                  {/* Guaranteed Secure Badge */}
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#2E7D32]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>256-bit Encrypted Merchant Settlement</span>
                  </div>

                </div>

              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* 4. PAYMENT METHODS & QR CODE TABLE (Requested by User in Image 1)         */}
          {/* ========================================================================= */}
          <div className="bg-white border border-[#E5E1D8] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E5E1D8]">
              <div>
                <span className="text-xs uppercase font-mono font-bold text-[#2E7D32] block mb-0.5">
                  DATABASE RECORDS · SUPABASE STORAGE
                </span>
                <h3 className="font-serif text-xl font-bold text-[#181F18]">
                  Configured QR Code Payment Methods
                </h3>
                <p className="text-xs text-[#5C665C]">
                  All uploaded QR codes saved in Supabase Storage under <code className="font-mono text-[#2E7D32]">qr-code/</code>. Admin can inspect, copy URLs, and select which QR code is active on checkout.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#E5E1D8] text-xs font-mono font-bold text-[#5C665C] self-start sm:self-center">
                Total: {methods.length} {methods.length === 1 ? 'Method' : 'Methods'}
              </span>
            </div>

            {methods.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#FAF9F5] border border-[#E5E1D8] flex items-center justify-center mx-auto text-[#738273]">
                  <QrCode className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-base font-bold text-[#181F18]">
                  No QR Code Records Found
                </h4>
                <p className="text-xs text-[#5C665C]">
                  Upload a QR code using the upload box above to populate this payment method table.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF9F5] border-b border-[#E5E1D8] text-[#5C665C] font-mono uppercase text-[11px]">
                      <th className="py-3 px-4 font-bold text-center">Active</th>
                      <th className="py-3 px-4 font-bold">QR Preview</th>
                      <th className="py-3 px-4 font-bold">Method Name</th>
                      <th className="py-3 px-4 font-bold">Merchant Name</th>
                      <th className="py-3 px-4 font-bold">UPI ID / VPA</th>
                      <th className="py-3 px-4 font-bold">Supabase Storage Folder</th>
                      <th className="py-3 px-4 font-bold">Date Added</th>
                      <th className="py-3 px-4 text-right font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E1D8]/60">
                    {methods.map((method) => {
                      const isActive = method.isActive || method.qrCodeUrl === config.qrCodeUrl;
                      return (
                        <tr
                          key={method.id}
                          className={`hover:bg-[#FAF9F5]/70 transition-colors ${
                            isActive ? 'bg-emerald-50/40' : ''
                          }`}
                        >
                          {/* Active Selector */}
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleSetActiveMethod(method)}
                              className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                                isActive
                                  ? 'bg-[#2E7D32] border-[#2E7D32] text-white shadow-xs'
                                  : 'bg-white border-[#D2CBBF] text-neutral-300 hover:border-[#2E7D32]'
                              }`}
                              title={isActive ? 'Currently Active' : 'Click to Set as Active'}
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                          </td>

                          {/* QR Code Thumbnail Preview */}
                          <td className="py-3 px-4">
                            <div
                              onClick={() => setSelectedMethodForView(method)}
                              className="w-12 h-12 rounded-xl border border-[#E5E1D8] bg-white p-1 overflow-hidden shadow-2xs hover:shadow-md hover:scale-105 transition-all cursor-pointer group relative"
                            >
                              <img
                                src={method.qrCodeUrl}
                                alt={method.name}
                                className="w-full h-full object-contain rounded-md"
                              />
                            </div>
                          </td>

                          {/* Method Name & Status Badge */}
                          <td className="py-3 px-4">
                            <strong className="text-[#181F18] font-bold block text-xs">
                              {method.name}
                            </strong>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {isActive ? (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#1E5C23] border border-emerald-300 font-mono text-[9px] font-bold inline-flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse" />
                                  <span>Active on User Site</span>
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-300 font-mono text-[9px]">
                                  Standby
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Merchant Name */}
                          <td className="py-3 px-4 font-medium text-[#181F18]">
                            {method.merchantName}
                          </td>

                          {/* UPI ID */}
                          <td className="py-3 px-4">
                            <span className="font-mono text-xs font-bold text-[#181F18] bg-[#FAF9F5] px-2 py-0.5 rounded border border-[#E5E1D8]">
                              {method.upiId}
                            </span>
                          </td>

                          {/* Supabase Folder */}
                          <td className="py-3 px-4 font-mono text-[10px] text-[#2E7D32]">
                            encourtyard-upload/qr-code
                          </td>

                          {/* Created At */}
                          <td className="py-3 px-4 font-mono text-[11px] text-[#5C665C]">
                            {method.createdAt ? new Date(method.createdAt).toLocaleDateString() : 'Active'}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleCopy(method.qrCodeUrl, method.id)}
                              className="p-1.5 rounded-lg border border-[#E5E1D8] bg-white hover:bg-[#FAF9F5] text-[#5C665C] hover:text-[#2E7D32] transition-colors cursor-pointer"
                              title="Copy Public URL"
                            >
                              {copiedUrlId === method.id ? <Check className="w-3.5 h-3.5 text-[#2E7D32]" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>

                            <a
                              href={method.qrCodeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg border border-[#E5E1D8] bg-white hover:bg-[#FAF9F5] text-[#5C665C] hover:text-[#2E7D32] transition-colors cursor-pointer inline-block"
                              title="Open Full Image"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>

                            <button
                              type="button"
                              onClick={() => handleDeleteMethod(method.id, method.name)}
                              className="p-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                              title="Delete Method"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Lightbox / Zoom Modal for QR Code */}
      {selectedMethodForView && (
        <div
          onClick={() => setSelectedMethodForView(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl animate-scaleUp cursor-default"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E1D8]">
              <h4 className="font-serif font-bold text-base text-[#181F18]">
                {selectedMethodForView.name}
              </h4>
              <button
                type="button"
                onClick={() => setSelectedMethodForView(null)}
                className="p-1 rounded-full hover:bg-neutral-100 text-neutral-500 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-3 bg-white rounded-2xl border-2 border-[#E5E1D8] max-w-[260px] mx-auto aspect-square flex items-center justify-center">
              <img
                src={selectedMethodForView.qrCodeUrl}
                alt={selectedMethodForView.name}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div className="space-y-1 text-xs text-[#5C665C]">
              <p><strong>Merchant:</strong> {selectedMethodForView.merchantName}</p>
              <p className="font-mono"><strong>UPI:</strong> {selectedMethodForView.upiId}</p>
            </div>
            <div className="pt-2 flex justify-center gap-2">
              <a
                href={selectedMethodForView.qrCodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#2E7D32] text-white font-bold text-xs shadow-sm hover:bg-[#1E5C23] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Download / Open Full Size</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedback.isOpen}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
        onClose={() => setFeedback((f) => ({ ...f, isOpen: false }))}
      />

    </div>
  );
}
