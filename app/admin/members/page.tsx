'use client';

import React, { useState } from 'react';
import { Users, Plus, Search, Mail, Phone, CheckCircle2, XCircle, ShieldCheck, Key } from 'lucide-react';

export default function AdminMembersPage() {
  const [search, setSearch] = useState('');

  const members = [
    { id: 'MEM-101', name: 'Elena Rostova', email: 'elena@vanguardbio.com', phone: '+91 98255 40210', company: 'Vanguard BioTech', role: 'Executive Lead', verified: true, keycard: 'EC-9481', city: 'Hyderabad' },
    { id: 'MEM-102', name: 'Alexander Vance', email: 'alex@vanguardbio.com', phone: '+91 98255 40211', company: 'Vanguard BioTech', role: 'CTO', verified: true, keycard: 'EC-9482', city: 'Hyderabad' },
    { id: 'MEM-103', name: 'Marcus Lindqvist', email: 'marcus@lindqvist.design', phone: '+91 98765 43210', company: 'Studio Lindqvist', role: 'Principal Architect', verified: true, keycard: 'EC-8831', city: 'Bangalore' },
    { id: 'MEM-104', name: 'Devin Thorne', email: 'devin@kinetix.ai', phone: '+91 98112 33445', company: 'Kinetix AI', role: 'AI Research Lead', verified: true, keycard: 'EC-7721', city: 'Mumbai BKC' },
    { id: 'MEM-105', name: 'Rohan Sharma', email: 'rohan.encourtyard@gmail.com', phone: '+91 98255 40210', company: 'Botanical Labs', role: 'Member', verified: true, keycard: 'EC-9912', city: 'Hyderabad' },
    { id: 'MEM-106', name: 'Chloe Mercer', email: 'chloe@apexrobotics.io', phone: '+91 99000 11223', company: 'Apex Robotics', role: 'Founder', verified: false, keycard: 'Pending', city: 'Delhi NCR' },
  ];

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E3EBE3] text-[#2E7D32] text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <span>Community Directory</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18]">
            Member Directory (342 Active Members)
          </h1>
          <p className="text-xs sm:text-sm text-[#5C665C]">
            View verified members, security keycard passes, company associations, and contact records.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#388E3C] text-white text-xs font-bold shadow-md transition-all">
          <Plus className="w-4 h-4" />
          <span>Add Member Profile</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E1D8] shadow-sm flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#6A806A] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or company..."
            className="w-full pl-9 pr-4 py-2 bg-[#FAF9F5] border border-[#E5E1D8] focus:border-[#263626] rounded-xl text-xs text-[#181F18] outline-none"
          />
        </div>
        <span className="text-xs text-[#6A806A]">Showing {filtered.length} of 342 members</span>
      </div>

      {/* Members Table */}
      <div className="bg-white border border-[#E5E1D8] rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E5E1D8] text-[#6A806A] font-mono uppercase text-[11px]">
                <th className="py-3.5 px-4">Member Name</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Affiliated Company</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">City</th>
                <th className="py-3.5 px-4">Keycard RFID</th>
                <th className="py-3.5 px-4">Email Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E1D8]/60">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-[#FAF9F5] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#181F18]">
                    {m.name}
                    <span className="block text-[10px] text-[#6A806A] font-mono">{m.id}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[#181F18] block font-medium">{m.email}</span>
                    <span className="text-[10px] text-[#6A806A]">{m.phone}</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#181F18]">{m.company}</td>
                  <td className="py-3.5 px-4 text-[#5C665C]">{m.role}</td>
                  <td className="py-3.5 px-4 font-medium text-[#181F18]">{m.city}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#263626]">{m.keycard}</td>
                  <td className="py-3.5 px-4">
                    {m.verified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                        <XCircle className="w-3 h-3 text-amber-600" />
                        Unverified
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="px-3 py-1 rounded-lg bg-[#FAF9F5] hover:bg-[#E3EBE3] border border-[#E5E1D8] text-[#263626] font-semibold text-[11px] transition-colors cursor-pointer">
                      Edit
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
