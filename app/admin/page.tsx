'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'kpis' | 'companies' | 'rooms'>('companies');

  const companiesList = [
    {
      id: 'COMP-01',
      name: 'Vanguard BioTech Inc.',
      contact: 'Elena Rostova',
      plan: 'Executive Private Suite (Suite 304)',
      seats: 6,
      monthlyRevenue: '$1,850',
      status: 'Approved & Active',
      joined: '12 Jan 2026'
    },
    {
      id: 'COMP-02',
      name: 'Studio Lindqvist & Co',
      contact: 'Marcus Lindqvist',
      plan: 'Atelier Dedicated Desks',
      seats: 4,
      monthlyRevenue: '$1,680',
      status: 'Approved & Active',
      joined: '03 Feb 2026'
    },
    {
      id: 'COMP-03',
      name: 'Kinetix AI Systems',
      contact: 'Devin Thorne',
      plan: 'Enterprise Custom Wing (Wing B)',
      seats: 18,
      monthlyRevenue: '$5,200',
      status: 'Approved & Active',
      joined: '28 Feb 2026'
    },
    {
      id: 'COMP-04',
      name: 'Apex Robotics Labs',
      contact: 'Chloe Mercer',
      plan: 'Executive Private Suite',
      seats: 8,
      monthlyRevenue: '$2,400',
      status: 'Pending Review',
      joined: '14 Sep 2026'
    }
  ];

  return (
    <div className="bg-[#FAF9F5] min-h-screen">
      {/* Admin Header Banner */}
      <section className="bg-[#181F18] text-white pt-32 pb-16 border-b border-[#263626] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#4ADE80] text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Executive Operational Portal</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                EnCourtyard Campus Operations
              </h1>
              <p className="text-xs sm:text-sm text-[#C5D5C5]">
                Real-time occupancy analytics, company rosters, and meeting room utilization.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                href="/book"
                variant="white"
                size="sm"
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                New Company Contract
              </Button>
            </div>
          </div>

          {/* Core Platform KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-8 pt-6 border-t border-white/10 text-xs sm:text-sm">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="text-white/70 block text-xs">Total Companies</span>
              <span className="font-serif text-2xl font-bold text-white">28</span>
              <span className="text-[10px] text-[#4ADE80] block mt-0.5">+3 this month</span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="text-white/70 block text-xs">Active Members</span>
              <span className="font-serif text-2xl font-bold text-white">342</span>
              <span className="text-[10px] text-[#4ADE80] block mt-0.5">98% retention</span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="text-white/70 block text-xs">Seat Occupancy</span>
              <span className="font-serif text-2xl font-bold text-[#4ADE80]">89.4%</span>
              <span className="text-[10px] text-white/60 block mt-0.5">38 seats open</span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="text-white/70 block text-xs">Monthly Run-Rate</span>
              <span className="font-serif text-2xl font-bold text-white">$142,800</span>
              <span className="text-[10px] text-[#4ADE80] block mt-0.5">+14% vs Q2</span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 col-span-2 sm:col-span-1">
              <span className="text-white/70 block text-xs">Room Utilization</span>
              <span className="font-serif text-2xl font-bold text-white">78.2%</span>
              <span className="text-[10px] text-[#C29B38] block mt-0.5">Peak: 10am-3pm</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Admin Section */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tab Controls */}
        <div className="flex items-center gap-2 pb-6 border-b border-[#E5E1D8]">
          <button
            onClick={() => setActiveTab('companies')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'companies'
                ? 'bg-[#263626] text-white shadow-sm'
                : 'bg-white text-[#5C665C] border border-[#E5E1D8] hover:bg-[#F2EEE7] hover:text-[#181F18]'
            }`}
          >
            Company Management (28)
          </button>
          <button
            onClick={() => setActiveTab('kpis')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'kpis'
                ? 'bg-[#263626] text-white shadow-sm'
                : 'bg-white text-[#5C665C] border border-[#E5E1D8] hover:bg-[#F2EEE7] hover:text-[#181F18]'
            }`}
          >
            Recent Platform Activities
          </button>
        </div>

        {/* Company Management Roster */}
        {activeTab === 'companies' && (
          <div className="bg-white rounded-2xl border border-[#E5E1D8] shadow-warm p-6 sm:p-8 mt-8 space-y-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#181F18]">
                  Registered Client Organizations
                </h3>
                <p className="text-xs text-[#5C665C]">
                  View membership tiers, seat assignments, and approval workflows.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Filter company..."
                  className="px-3.5 py-2 bg-[#FAF9F5] border border-[#E5E1D8] rounded-xl text-xs text-[#181F18] focus:outline-none"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#FAF9F5] border-b border-[#E5E1D8] text-[#5C665C]">
                    <th className="p-4 font-semibold uppercase text-[11px] tracking-wider">Company</th>
                    <th className="p-4 font-semibold uppercase text-[11px] tracking-wider">Lead Contact</th>
                    <th className="p-4 font-semibold uppercase text-[11px] tracking-wider">Membership Plan</th>
                    <th className="p-4 font-semibold uppercase text-[11px] tracking-wider text-center">Seats</th>
                    <th className="p-4 font-semibold uppercase text-[11px] tracking-wider text-right">Revenue</th>
                    <th className="p-4 font-semibold uppercase text-[11px] tracking-wider text-center">Status</th>
                    <th className="p-4 font-semibold uppercase text-[11px] tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E1D8]">
                  {companiesList.map((comp) => (
                    <tr key={comp.id} className="hover:bg-[#FAF9F5] transition-colors">
                      <td className="p-4 font-bold text-[#181F18]">
                        {comp.name}
                        <span className="block text-[11px] font-mono text-[#738273] font-normal">{comp.id}</span>
                      </td>
                      <td className="p-4 text-[#5C665C]">
                        {comp.contact}
                      </td>
                      <td className="p-4 text-[#263626] font-medium">
                        {comp.plan}
                      </td>
                      <td className="p-4 text-center font-mono font-bold text-[#181F18]">
                        {comp.seats}
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-[#263626]">
                        {comp.monthlyRevenue}
                      </td>
                      <td className="p-4 text-center">
                        <Badge
                          variant={comp.status.includes('Active') ? 'available' : 'limited'}
                          size="sm"
                          dot
                        >
                          {comp.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="secondary" size="sm">
                          Manage
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Activities Tab */}
        {activeTab === 'kpis' && (
          <div className="bg-white rounded-2xl border border-[#E5E1D8] shadow-warm p-8 mt-8 space-y-4 text-left">
            <h3 className="font-serif text-xl font-bold text-[#181F18] mb-4">
              Recent Campus Activity Log
            </h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] flex items-center justify-between">
                <div>
                  <strong className="text-[#181F18]">New Contract Submitted</strong>: Apex Robotics requested 8 seats in Executive Suite 302.
                  <span className="block text-[11px] text-[#738273] mt-0.5">14 Sep 2026 · 17:45</span>
                </div>
                <Badge variant="limited" size="sm">Review Required</Badge>
              </div>
              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] flex items-center justify-between">
                <div>
                  <strong className="text-[#181F18]">Oak Boardroom Reserved</strong>: Vanguard BioTech reserved 10am–12pm slot tomorrow.
                  <span className="block text-[11px] text-[#738273] mt-0.5">14 Sep 2026 · 15:20</span>
                </div>
                <Badge variant="available" size="sm">Auto-Approved</Badge>
              </div>
            </div>
          </div>
        )}

      </section>
    </div>
  );
}
