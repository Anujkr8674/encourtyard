'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Mail,
  Phone,
  Building2,
  CheckCircle2,
  Save,
  ShieldCheck,
  Sparkles,
  Camera,
  RefreshCw,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
];

export default function UserProfilePage() {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [workstyle, setWorkstyle] = useState('courtyard');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setCompany(user.company || '');
      setAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          company: company.trim(),
          avatarUrl: avatarUrl.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update profile settings.');
      }

      setMessage({ type: 'success', text: 'Member profile updated successfully.' });
      await refreshUser();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error updating profile.' });
    } finally {
      setSaving(false);
    }
  };

  const currentDisplayAvatar =
    avatarUrl ||
    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email || name || 'member')}`;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto text-[#181F18] font-sans">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-[#E5E1D8] shadow-warm p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-mono font-bold uppercase tracking-wider">
              <User className="w-3.5 h-3.5" />
              <span>Identity & Member Preferences</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18]">
              Personal & Company Profile
            </h1>
            <p className="text-xs sm:text-sm text-[#5C665C]">
              Manage your personal credentials, contact points, and workspace preferences for your
              EnCourtyard membership.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF9F5] border border-[#E5E1D8] text-xs font-semibold text-[#2E7D32]">
            <CheckCircle2 className="w-4 h-4" />
            <span>Verified Resident</span>
          </div>
        </div>
      </div>

      {/* Profile Form Card */}
      <div className="bg-white rounded-3xl border border-[#E5E1D8] shadow-warm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Form Fields Grid */}
          <div className="space-y-6">
            <h3 className="font-serif text-lg font-bold text-[#181F18]">
              Personal & Company Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#181F18] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>Full Legal Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] text-xs text-[#181F18] focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:bg-white transition-all"
                />
              </div>

              {/* Email (Read-Only) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#181F18] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>Email Address (Primary Identity)</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F0ECE1]/50 border border-[#E5E1D8] text-xs text-[#5C665C] cursor-not-allowed font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Verified
                  </span>
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#181F18] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] text-xs text-[#181F18] focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:bg-white transition-all font-mono"
                />
              </div>

              {/* Company */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#181F18] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>Company / Studio Name</span>
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Studio Morphogenesis"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] text-xs text-[#181F18] focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Workstyle Preferences */}
          <div className="space-y-4 pt-6 border-t border-[#E5E1D8] hidden">
            <h3 className="font-serif text-lg font-bold text-[#181F18]">
              Sanctuary Workstyle Preferences
            </h3>
            <p className="text-xs text-[#5C665C]">
              Help our resident concierge calibrate your desk environment and welcome hospitality.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {[
                { id: 'courtyard', label: 'Botanical Courtyard', desc: 'Natural daylight & ficus grove' },
                { id: 'focus', label: 'Acoustic Library Focus', desc: 'Pin-drop quiet for deep work' },
                { id: 'executive', label: 'Executive Boardroom', desc: 'Multi-screen presentation ready' },
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setWorkstyle(style.id)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    workstyle === style.id
                      ? 'border-[#2E7D32] bg-[#E8F5E9]/50 shadow-xs'
                      : 'border-[#E5E1D8] bg-[#FAF9F5] hover:bg-[#F2EEE7]'
                  }`}
                >
                  <strong className="block text-xs font-bold text-[#181F18]">
                    {style.label}
                  </strong>
                  <span className="text-[11px] text-[#5C665C] mt-0.5 block">
                    {style.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Alert Messages */}
          {message && (
            <div
              className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Submit Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-[#E5E1D8]">
            <p className="text-[11px] text-[#5C665C]">
              Profile updates reflect immediately across your keycard passes and tax invoices.
            </p>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#2E7D32] hover:bg-[#1B5E20] disabled:bg-[#8CB88C] text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
