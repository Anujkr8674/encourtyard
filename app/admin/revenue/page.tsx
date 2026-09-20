'use client';

import React from 'react';
import { DollarSign, TrendingUp, Download, ArrowUpRight, CheckCircle2, CreditCard, Calendar } from 'lucide-react';

export default function AdminRevenuePage() {
  const invoices = [
    { id: 'INV-2026-089', company: 'Studio Lindqvist & Co', plan: 'Atelier Desks', amount: '₹95,000', date: '19 Sep 2026', method: 'Direct Bank Transfer (NEFT)', status: 'Paid' },
    { id: 'INV-2026-088', company: 'Vanguard BioTech Inc.', plan: 'Executive Suite 304', amount: '₹1,85,000', date: '18 Sep 2026', method: 'Corporate Card', status: 'Paid' },
    { id: 'INV-2026-087', company: 'Kinetix AI Systems', plan: 'Custom Wing B', amount: '₹4,20,000', date: '15 Sep 2026', method: 'Wire Transfer', status: 'Paid' },
    { id: 'INV-2026-086', company: 'Zenith Health Dynamics', plan: 'Executive Floor', amount: '₹3,15,000', date: '12 Sep 2026', method: 'ACH / Auto-Debit', status: 'Paid' },
    { id: 'INV-2026-085', company: 'Solaria Clean Energy', plan: 'Dedicated Desks', amount: '₹1,15,000', date: '05 Sep 2026', method: 'UPI Corporate', status: 'Paid' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E3EBE3] text-[#2E7D32] text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <span>Financial Analytics</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18]">
            Revenue Run-Rate & Invoice History
          </h1>
          <p className="text-xs sm:text-sm text-[#5C665C]">
            Monthly recurring revenue breakdown across 79 nationwide botanical campuses.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#E5E1D8] text-xs font-semibold text-[#181F18] hover:bg-[#FAF9F5] shadow-sm">
          <Download className="w-3.5 h-3.5 text-[#6A806A]" />
          <span>Export Financial Ledger</span>
        </button>
      </div>

      {/* Revenue Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-[#E5E1D8] shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6A806A]">Monthly Run-Rate (MRR)</span>
          <div className="font-serif text-3xl font-bold text-[#181F18] my-2">₹1.42 Cr</div>
          <span className="text-xs font-semibold text-[#2E7D32] flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% month-over-month growth</span>
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E5E1D8] shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6A806A]">Average Contract Duration</span>
          <div className="font-serif text-3xl font-bold text-[#181F18] my-2">14.6 Months</div>
          <span className="text-xs text-[#5C665C]">Enterprise suite renewals</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E5E1D8] shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6A806A]">Payment Collection Rate</span>
          <div className="font-serif text-3xl font-bold text-[#2E7D32] my-2">99.4%</div>
          <span className="text-xs text-[#5C665C]">Zero overdue accounts</span>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white border border-[#E5E1D8] rounded-3xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#E5E1D8] flex items-center justify-between">
          <h3 className="font-serif text-base font-bold text-[#181F18]">Recent Corporate Invoices</h3>
          <span className="text-xs text-[#6A806A]">All transactions verified</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E5E1D8] text-[#6A806A] font-mono uppercase text-[11px]">
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Client Organization</th>
                <th className="py-3.5 px-4">Workspace Plan</th>
                <th className="py-3.5 px-4">Invoice Date</th>
                <th className="py-3.5 px-4">Settlement Method</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E1D8]/60">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#FAF9F5] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#181F18]">{inv.id}</td>
                  <td className="py-3.5 px-4 font-bold text-[#181F18]">{inv.company}</td>
                  <td className="py-3.5 px-4 text-[#5C665C]">{inv.plan}</td>
                  <td className="py-3.5 px-4 text-[#181F18]">{inv.date}</td>
                  <td className="py-3.5 px-4 text-[#5C665C]">{inv.method}</td>
                  <td className="py-3.5 px-4 font-bold text-[#2E7D32]">{inv.amount}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold font-mono border border-emerald-200">
                      {inv.status}
                    </span>
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
