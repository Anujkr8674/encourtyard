'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Monitor, 
  ShieldCheck, 
  Check, 
  X, 
  MoreVertical,
  Plus,
  ArrowRight,
  Filter,
  LogOut,
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function AdminDashboardPage() {
  const { admin } = useAuth();
  const [activeTab, setActiveTab] = useState<'companies' | 'activities' | 'rooms'>('companies');

  const adminName = admin?.name || 'Super Administrator';

  const companiesList = [
    {
      id: 'COMP-01',
      name: 'Vanguard BioTech Inc.',
      contact: 'Elena Rostova',
      plan: 'Executive Private Suite (Suite 304)',
      seats: 6,
      monthlyRevenue: '₹1,85,000',
      status: 'Approved & Active',
      joined: '12 Jan 2026',
      city: 'Hyderabad'
    },
    {
      id: 'COMP-02',
      name: 'Studio Lindqvist & Co',
      contact: 'Marcus Lindqvist',
      plan: 'Atelier Dedicated Desks',
      seats: 4,
      monthlyRevenue: '₹95,000',
      status: 'Approved & Active',
      joined: '03 Feb 2026',
      city: 'Bangalore'
    },
    {
      id: 'COMP-03',
      name: 'Kinetix AI Systems',
      contact: 'Devin Thorne',
      plan: 'Enterprise Custom Wing (Wing B)',
      seats: 18,
      monthlyRevenue: '₹4,20,000',
      status: 'Approved & Active',
      joined: '28 Feb 2026',
      city: 'Mumbai BKC'
    },
    {
      id: 'COMP-04',
      name: 'Apex Robotics Labs',
      contact: 'Chloe Mercer',
      plan: 'Executive Private Suite',
      seats: 8,
      monthlyRevenue: '₹2,10,000',
      status: 'Pending Review',
      joined: '14 Sep 2026',
      city: 'Delhi NCR'
    }
  ];

  const recentActivities = [
    { id: 'act-1', text: 'New member registration verified via Google SMTP OTP: rohan.encourtyard@gmail.com', time: '5 mins ago', type: 'user' },
    { id: 'act-2', text: 'Vanguard BioTech reserved The Oak Boardroom (Hyderabad) for tomorrow 10:00 AM', time: '18 mins ago', type: 'booking' },
    { id: 'act-3', text: 'Payment received: ₹1,85,000 for Invoice #INV-2026-089 (Studio Lindqvist)', time: '1 hour ago', type: 'payment' },
    { id: 'act-4', text: 'Prisma ORM synced 4 schema tables to Supabase PostgreSQL database', time: '2 hours ago', type: 'system' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Top Banner Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#141C14] to-[#1E2B1E] text-white p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#4ADE80]/15 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#4ADE80] text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Operations Console</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Welcome back, {adminName}
          </h1>
          <p className="text-xs sm:text-sm text-[#C5D5C5]">
            Real-time occupancy analytics, member approvals, and 79 centre operations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/companies"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#388E3C] text-white font-bold text-xs shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Client Contract</span>
          </Link>
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all"
          >
            <Calendar className="w-4 h-4 text-[#4ADE80]" />
            <span>Review Bookings</span>
          </Link>
        </div>
      </div>

      {/* CORE PLATFORM KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Companies', val: '28', change: '+3 this month', isPos: true, icon: Building2 },
          { label: 'Active Members', val: '342', change: '98% retention', isPos: true, icon: Users },
          { label: 'Seat Occupancy', val: '89.4%', change: '38 seats open', isPos: true, icon: MapPin },
          { label: 'Monthly Run-Rate', val: '₹1.42 Cr', change: '+14% vs Q2', isPos: true, icon: DollarSign },
          { label: 'Room Utilization', val: '78.2%', change: 'Peak: 10am-3pm', isPos: true, icon: Monitor },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-[#E5E1D8] shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6A806A]">{kpi.label}</span>
                <div className="w-8 h-8 rounded-xl bg-[#E3EBE3] text-[#2E7D32] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18] mb-1.5">{kpi.val}</div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-[#2E7D32]">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{kpi.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* TABBED MANAGEMENT SECTION */}
      <div className="bg-white border border-[#E5E1D8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E1D8]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('companies')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'companies'
                  ? 'bg-[#263626] text-white shadow-sm'
                  : 'text-[#5C665C] hover:bg-[#FAF9F5]'
              }`}
            >
              Active Client Organizations (28)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('activities')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'activities'
                  ? 'bg-[#263626] text-white shadow-sm'
                  : 'text-[#5C665C] hover:bg-[#FAF9F5]'
              }`}
            >
              Live Operations Stream (4)
            </button>
          </div>

          <Link
            href={activeTab === 'companies' ? '/admin/companies' : '/admin/logs'}
            className="text-xs font-bold text-[#2E7D32] hover:text-[#181F18] flex items-center gap-1.5 transition-colors"
          >
            <span>View Full Section</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {activeTab === 'companies' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E5E1D8] text-[#6A806A] font-mono uppercase text-[11px]">
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">City Location</th>
                  <th className="py-3 px-4">Lead Contact</th>
                  <th className="py-3 px-4">Membership Plan</th>
                  <th className="py-3 px-4 text-center">Seats</th>
                  <th className="py-3 px-4">Monthly Revenue</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1D8]/60">
                {companiesList.map((comp) => (
                  <tr key={comp.id} className="hover:bg-[#FAF9F5] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#181F18]">
                      {comp.name}
                      <span className="block text-[10px] text-[#6A806A] font-mono">{comp.id}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#181F18]">{comp.city}</td>
                    <td className="py-3.5 px-4 text-[#5C665C]">{comp.contact}</td>
                    <td className="py-3.5 px-4 text-[#181F18]">{comp.plan}</td>
                    <td className="py-3.5 px-4 text-center font-bold">{comp.seats}</td>
                    <td className="py-3.5 px-4 font-bold text-[#2E7D32]">{comp.monthlyRevenue}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                        comp.status.includes('Active')
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {comp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivities.map((act) => (
              <div key={act.id} className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E5E1D8] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#E3EBE3] text-[#2E7D32] flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-[#181F18] font-medium">{act.text}</span>
                </div>
                <span className="text-[11px] font-mono text-[#6A806A] shrink-0">{act.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
