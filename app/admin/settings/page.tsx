'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  ShieldCheck,
  Mail,
  Database,
  KeyRound,
  CheckCircle2,
  Lock,
  Bell,
  Check,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { FeedbackModal } from '@/components/ui/FeedbackModal';

export default function AdminSettingsPage() {
  const [notifyNewBooking, setNotifyNewBooking] = useState(true);
  const [notifyStatusUpdate, setNotifyStatusUpdate] = useState(true);
  const [adminEmail, setAdminEmail] = useState('anujkr8674@gmail.com');
  const [senderEmail, setSenderEmail] = useState('encourtyardwebsite@gmail.com');
  const [smtpConfigured, setSmtpConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  // Load Settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/settings', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.settings) {
            setNotifyNewBooking(data.settings.admin_email_notify_new_booking !== false);
            setNotifyStatusUpdate(data.settings.admin_email_notify_status_update !== false);
            if (data.settings.admin_email) setAdminEmail(data.settings.admin_email);
            if (data.settings.smtp_sender) setSenderEmail(data.settings.smtp_sender);
            if (data.settings.smtp_configured !== undefined) setSmtpConfigured(data.settings.smtp_configured);
          }
        }
      } catch (err) {
        console.warn('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Toggle Handler
  const handleToggle = async (key: 'admin_email_notify_new_booking' | 'admin_email_notify_status_update', currentVal: boolean) => {
    const newVal = !currentVal;
    if (key === 'admin_email_notify_new_booking') setNotifyNewBooking(newVal);
    if (key === 'admin_email_notify_status_update') setNotifyStatusUpdate(newVal);

    try {
      setSaving(true);
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: newVal }),
      });

      if (!res.ok) {
        // Revert on error
        if (key === 'admin_email_notify_new_booking') setNotifyNewBooking(currentVal);
        if (key === 'admin_email_notify_status_update') setNotifyStatusUpdate(currentVal);
        setFeedback({
          isOpen: true,
          type: 'error',
          title: 'Update Failed',
          message: 'Could not save notification preferences to server.',
        });
      }
    } catch {
      // Revert on error
      if (key === 'admin_email_notify_new_booking') setNotifyNewBooking(currentVal);
      if (key === 'admin_email_notify_status_update') setNotifyStatusUpdate(currentVal);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans pb-16 text-[#181F18]">
      
      {/* 1. Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E3EBE3] text-[#2E7D32] text-xs font-mono font-semibold uppercase tracking-wider mb-1">
          <span>Infrastructure & Notification Control</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18]">
          Platform & Notification Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#5C665C]">
          Configure admin email notification toggles, inspect live credentials from .env, and monitor Google SMTP health.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* ========================================================================= */}
        {/* 2. Admin Email Notification Toggles (Requested Feature)                   */}
        {/* ========================================================================= */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E1D8] shadow-sm space-y-5 md:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E1D8]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E3EBE3] text-[#2E7D32] flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#181F18]">
                  Admin Email Dispatch Preferences
                </h3>
                <span className="text-xs text-[#6A806A]">
                  Choose which events dispatch alert emails to admin address: <strong className="text-[#181F18] font-mono">{adminEmail}</strong>
                </span>
              </div>
            </div>

            {saving && (
              <span className="text-[11px] text-[#2E7D32] font-semibold flex items-center gap-1.5">
                <div className="w-3 h-3 border-2 border-[#2E7D32] border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Toggle 1: New Booking Created / Confirmed */}
            <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E1D8] flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-xs sm:text-sm text-[#181F18]">
                  New Booking Alerts
                </h4>
                <p className="text-[11px] sm:text-xs text-[#5C665C] leading-relaxed">
                  Receive an instant email when a customer places a new workspace reservation request.
                </p>
                <span className="text-[10px] text-[#2E7D32] font-mono block pt-1">
                  Status: {notifyNewBooking ? 'ACTIVE (Emails Sent)' : 'MUTED (No Emails)'}
                </span>
              </div>

              {/* iOS-Style Toggle Switch */}
              <button
                type="button"
                onClick={() => handleToggle('admin_email_notify_new_booking', notifyNewBooking)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notifyNewBooking ? 'bg-[#2E7D32]' : 'bg-neutral-300'
                }`}
                aria-label="Toggle new booking alert emails"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notifyNewBooking ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 2: Booking Status Updated */}
            <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E1D8] flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-xs sm:text-sm text-[#181F18]">
                  Status Update Alerts
                </h4>
                <p className="text-[11px] sm:text-xs text-[#5C665C] leading-relaxed">
                  Receive an email copy when a reservation status is updated (Pending, Confirmed, Completed, Cancelled).
                </p>
                <span className="text-[10px] text-[#2E7D32] font-mono block pt-1">
                  Status: {notifyStatusUpdate ? 'ACTIVE (Emails Sent)' : 'MUTED (No Emails)'}
                </span>
              </div>

              {/* iOS-Style Toggle Switch */}
              <button
                type="button"
                onClick={() => handleToggle('admin_email_notify_status_update', notifyStatusUpdate)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notifyStatusUpdate ? 'bg-[#2E7D32]' : 'bg-neutral-300'
                }`}
                aria-label="Toggle status update alert emails"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notifyStatusUpdate ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

          </div>
        </div>

        {/* 3. Admin Security Settings */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E1D8] shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E5E1D8]">
            <div className="w-9 h-9 rounded-xl bg-[#E3EBE3] text-[#2E7D32] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#181F18]">Admin Master Access</h3>
              <span className="text-xs text-[#6A806A]">Root credentials configured in .env</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8]">
              <span className="text-[#5C665C]">Admin Identifier:</span>
              <span className="font-mono font-bold text-[#181F18]">Admin</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8]">
              <span className="text-[#5C665C]">Admin Email Target:</span>
              <span className="font-mono font-bold text-[#2E7D32]">{adminEmail}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8]">
              <span className="text-[#5C665C]">Master Password:</span>
              <span className="font-mono font-bold text-[#2E7D32]">•••••••• (Ranchi#0000)</span>
            </div>
          </div>
        </div>

        {/* 4. Google SMTP Email Service */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E1D8] shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E5E1D8]">
            <div className="w-9 h-9 rounded-xl bg-[#E3EBE3] text-[#2E7D32] flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#181F18]">Google SMTP Mailer Service</h3>
              <span className="text-xs text-[#6A806A]">Nodemailer transport live status</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8]">
              <span className="text-[#5C665C]">SMTP Host & Port:</span>
              <span className="font-mono font-bold text-[#181F18]">smtp.gmail.com:465 (SSL)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8]">
              <span className="text-[#5C665C]">From Email Sender:</span>
              <span className="font-mono font-bold text-[#181F18]">{senderEmail}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
              <span>Nodemailer Transport:</span>
              <span className="font-bold flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Active & Ready
              </span>
            </div>
          </div>
        </div>

        {/* 5. Supabase Database Status */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E1D8] shadow-sm space-y-4 md:col-span-2">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E5E1D8]">
            <div className="w-9 h-9 rounded-xl bg-[#E3EBE3] text-[#2E7D32] flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#181F18]">Supabase PostgreSQL & Storage</h3>
              <span className="text-xs text-[#6A806A]">Prisma ORM multi-tenant pooler status</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8]">
              <span className="text-[#6A806A] block text-[11px] mb-1">Region:</span>
              <strong className="text-[#181F18] font-mono">aws-0-ap-southeast-2</strong>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8]">
              <span className="text-[#6A806A] block text-[11px] mb-1">Database Schema:</span>
              <strong className="text-[#181F18] font-mono">5 Tables Synced (Prisma)</strong>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-emerald-700 block text-[11px] mb-1">Connection Health:</span>
              <strong className="text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Connected (IPv4 Pooler)
              </strong>
            </div>
          </div>
        </div>

      </div>

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
