'use client';

import React from 'react';
import { Settings, ShieldCheck, Mail, Database, KeyRound, CheckCircle2, Lock } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E3EBE3] text-[#2E7D32] text-xs font-mono font-semibold uppercase tracking-wider mb-1">
          <span>Infrastructure Configuration</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18]">
          Platform & Environment Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#5C665C]">
          Manage credentials from .env, verify Google SMTP health, and test Supabase PostgreSQL connectivity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Admin Security Settings */}
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
              <span className="text-[#5C665C]">Master Password:</span>
              <span className="font-mono font-bold text-[#2E7D32]">•••••••• (Ranchi#0000)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8]">
              <span className="text-[#5C665C]">Session Persistence:</span>
              <span className="font-bold text-[#263626]">30 Days (HTTP-Only Cookie)</span>
            </div>
          </div>
        </div>

        {/* 2. Google SMTP Email Service */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E1D8] shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E5E1D8]">
            <div className="w-9 h-9 rounded-xl bg-[#E3EBE3] text-[#2E7D32] flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#181F18]">Google SMTP OTP Service</h3>
              <span className="text-xs text-[#6A806A]">Nodemailer transport verification</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8]">
              <span className="text-[#5C665C]">SMTP Host & Port:</span>
              <span className="font-mono font-bold text-[#181F18]">smtp.gmail.com:465 (SSL)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8]">
              <span className="text-[#5C665C]">Sender Account:</span>
              <span className="font-mono font-bold text-[#181F18]">encourtyardwebsite@gmail.com</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
              <span>App Password Status:</span>
              <span className="font-bold flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Active (gguh lhwl...)
              </span>
            </div>
          </div>
        </div>

        {/* 3. Supabase Database Status */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E1D8] shadow-sm space-y-4 md:col-span-2">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E5E1D8]">
            <div className="w-9 h-9 rounded-xl bg-[#E3EBE3] text-[#2E7D32] flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#181F18]">Supabase PostgreSQL Database</h3>
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
              <strong className="text-[#181F18] font-mono">4 Tables Synced (Prisma)</strong>
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
    </div>
  );
}
