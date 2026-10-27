'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldLock,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Laptop,
  Clock,
  ShieldCheck,
  RefreshCw,
  Lock,
} from 'lucide-react';

export default function UserSecurityPage() {
  const { user, logout } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match. Please re-type.' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update password.');
      }

      setMessage({
        type: 'success',
        text: 'Your password has been successfully updated. All future sign-ins require the new password.',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error changing password.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto text-[#181F18] font-sans">
      {/* Page Header */}
      <div className="bg-white rounded-3xl border border-[#E5E1D8] shadow-warm p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-mono font-bold uppercase tracking-wider">
              <ShieldLock className="w-3.5 h-3.5" />
              <span>Authentication & Session Safeguards</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18]">
              Security & Change Password
            </h1>
            <p className="text-xs sm:text-sm text-[#5C665C]">
              Update your account credentials, manage verified active sessions, and safeguard your
              biometric keycard access.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF9F5] border border-[#E5E1D8] text-xs font-semibold text-[#2E7D32]">
            <ShieldCheck className="w-4 h-4" />
            <span>Encrypted Session</span>
          </div>
        </div>
      </div>

      {/* Change Password Form Card */}
      <div className="bg-white rounded-3xl border border-[#E5E1D8] shadow-warm p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-[#E5E1D8]">
          <h3 className="font-serif text-lg font-bold text-[#181F18]">
            Update Account Password
          </h3>
          <p className="text-xs text-[#5C665C]">
            Ensure your account uses a strong passphrase containing uppercase, lowercase, numbers,
            and symbols.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password */}
          <div className="space-y-1.5 max-w-md">
            <label className="text-xs font-bold text-[#181F18] flex items-center justify-between">
              <span>Current Password *</span>
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] text-xs text-[#181F18] focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C665C] hover:text-[#181F18]"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5 max-w-md">
            <label className="text-xs font-bold text-[#181F18] flex items-center justify-between">
              <span>New Password (min 6 chars) *</span>
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new strong password"
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] text-xs text-[#181F18] focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C665C] hover:text-[#181F18]"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5 max-w-md">
            <label className="text-xs font-bold text-[#181F18]">
              <span>Confirm New Password *</span>
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] text-xs text-[#181F18] focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C665C] hover:text-[#181F18]"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Alert Messages */}
          {message && (
            <div
              className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 max-w-md ${
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

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#2E7D32] hover:bg-[#1B5E20] disabled:bg-[#8CB88C] text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Updating Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Change Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Active Session & Complete Logout System */}
      <div className="bg-white rounded-3xl border border-[#E5E1D8] shadow-warm p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-[#E5E1D8]">
          <h3 className="font-serif text-lg font-bold text-[#181F18]">
            Active Member Session & Logout
          </h3>
          <p className="text-xs text-[#5C665C]">
            Review currently authenticated device session or sign out completely.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E1D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#182618] text-[#4ADE80] flex items-center justify-center">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-xs font-bold text-[#181F18]">
                  Current Browser Session
                </strong>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                  Active Now
                </span>
              </div>
              <p className="text-[11px] text-[#5C665C] mt-0.5">
                Authenticated as: <span className="font-mono text-[#181F18]">{user?.email}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-all cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out from Device</span>
          </button>
        </div>
      </div>
    </div>
  );
}
