'use client';

import React, { useState } from 'react';
import { Building2, Plus, Search, Filter, Check, X, MoreVertical, MapPin, Users, DollarSign, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminCompaniesPage() {
  const [search, setSearch] = useState('');

  const companies = [
    { id: 'COMP-01', name: 'Vanguard BioTech Inc.', city: 'Hyderabad', contact: 'Elena Rostova', email: 'elena@vanguardbio.com', plan: 'Executive Suite 304', seats: 6, monthlyRevenue: '₹1,85,000', status: 'Active', renewal: '31 Dec 2026' },
    { id: 'COMP-02', name: 'Studio Lindqvist & Co', city: 'Bangalore', contact: 'Marcus Lindqvist', email: 'marcus@lindqvist.design', plan: 'Atelier Desks', seats: 4, monthlyRevenue: '₹95,000', status: 'Active', renewal: '15 Jan 2027' },
    { id: 'COMP-03', name: 'Kinetix AI Systems', city: 'Mumbai BKC', contact: 'Devin Thorne', email: 'devin@kinetix.ai', plan: 'Custom Wing B', seats: 18, monthlyRevenue: '₹4,20,000', status: 'Active', renewal: '28 Feb 2027' },
    { id: 'COMP-04', name: 'Apex Robotics Labs', city: 'Delhi NCR', contact: 'Chloe Mercer', email: 'chloe@apexrobotics.io', plan: 'Private Suite', seats: 8, monthlyRevenue: '₹2,10,000', status: 'Pending Review', renewal: 'Pending' },
    { id: 'COMP-05', name: 'Zenith Health Dynamics', city: 'Pune', contact: 'Aarav Patel', email: 'aarav@zenithhealth.in', plan: 'Executive Floor', seats: 12, monthlyRevenue: '₹3,15,000', status: 'Active', renewal: '10 Nov 2026' },
    { id: 'COMP-06', name: 'Solaria Clean Energy', city: 'Chennai', contact: 'Meera Nambiar', email: 'meera@solariaclean.com', plan: 'Dedicated Desks', seats: 5, monthlyRevenue: '₹1,15,000', status: 'Active', renewal: '05 Mar 2027' },
  ];

  const filtered = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.contact.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E3EBE3] text-[#2E7D32] text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <span>Client Accounts</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18]">
            Client Organizations (28 Companies)
          </h1>
          <p className="text-xs sm:text-sm text-[#5C665C]">
            Manage enterprise licenses, seat quotas, monthly contract billing, and approval workflows.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#E5E1D8] text-xs font-semibold text-[#181F18] hover:bg-[#FAF9F5] transition-all shadow-sm">
            <Download className="w-3.5 h-3.5 text-[#6A806A]" />
            <span>Export CSV</span>
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#388E3C] text-white text-xs font-bold shadow-md transition-all">
            <Plus className="w-4 h-4" />
            <span>Add New Company</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E1D8] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#6A806A] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company, contact, or city..."
            className="w-full pl-9 pr-4 py-2 bg-[#FAF9F5] border border-[#E5E1D8] focus:border-[#263626] rounded-xl text-xs text-[#181F18] outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-[#6A806A]">Showing {filtered.length} of 28 records</span>
        </div>
      </div>

      {/* Companies Data Table */}
      <div className="bg-white border border-[#E5E1D8] rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E5E1D8] text-[#6A806A] font-mono uppercase text-[11px]">
                <th className="py-3.5 px-4">Organization Name</th>
                <th className="py-3.5 px-4">City</th>
                <th className="py-3.5 px-4">Key Contact</th>
                <th className="py-3.5 px-4">Membership Plan</th>
                <th className="py-3.5 px-4 text-center">Allocated Desks</th>
                <th className="py-3.5 px-4">Contract MRR</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E1D8]/60">
              {filtered.map((comp) => (
                <tr key={comp.id} className="hover:bg-[#FAF9F5] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#181F18]">
                    {comp.name}
                    <span className="block text-[10px] text-[#6A806A] font-mono">{comp.id} · Renews {comp.renewal}</span>
                  </td>
                  <td className="py-3.5 px-4 text-[#181F18] font-medium">{comp.city}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-[#181F18] block">{comp.contact}</span>
                    <span className="text-[10px] text-[#6A806A]">{comp.email}</span>
                  </td>
                  <td className="py-3.5 px-4 text-[#181F18]">{comp.plan}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-sm">{comp.seats}</td>
                  <td className="py-3.5 px-4 font-bold text-[#2E7D32]">{comp.monthlyRevenue}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                      comp.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {comp.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="px-3 py-1 rounded-lg bg-[#FAF9F5] hover:bg-[#E3EBE3] border border-[#E5E1D8] text-[#263626] font-semibold text-[11px] transition-colors cursor-pointer">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
