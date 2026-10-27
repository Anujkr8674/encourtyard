'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Printer,
  ExternalLink,
  ShieldCheck,
  Building2,
  PlusCircle,
  Search,
  ArrowUpRight,
  QrCode,
} from 'lucide-react';
import { InvoiceModal } from '@/components/user/InvoiceModal';

interface PaymentBooking {
  id: string;
  workspaceTitle: string;
  categoryName?: string;
  plan: string;
  startDate: string;
  endDate?: string;
  totalAmount: number | null;
  status: string;
  paymentStatus: string;
  adminNotes?: string;
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  createdAt: string;
}

export default function UserPaymentsPage() {
  const [bookings, setBookings] = useState<PaymentBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/bookings', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.bookings)) {
            setBookings(data.bookings);
          }
        }
      } catch (err) {
        console.error('Failed to load payment transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Compute metrics
  const totalSettled = bookings
    .filter((b) => b.status !== 'CANCELLED' && b.status !== 'REJECTED')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const verifiedPayments = bookings.filter(
    (b) => b.status === 'CONFIRMED' || b.paymentStatus === 'PAID'
  ).length;

  const pendingVerification = bookings.filter(
    (b) => b.status === 'PENDING'
  ).length;

  // Filtered payments
  const filteredBookings = bookings.filter((b) => {
    const q = searchQuery.toLowerCase();
    const titleMatch = b.workspaceTitle.toLowerCase().includes(q);
    const idMatch = b.id.toLowerCase().includes(q);
    let utrMatch = false;
    if (b.adminNotes) {
      utrMatch = b.adminNotes.toLowerCase().includes(q);
    }
    return titleMatch || idMatch || utrMatch;
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto text-[#181F18] font-sans">
      {/* Page Header */}
      <div className="bg-white rounded-3xl border border-[#E5E1D8] shadow-warm p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-mono font-bold uppercase tracking-wider">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Financial Ledger & Tax Receipts</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18]">
              Payments & Invoices
            </h1>
            <p className="text-xs sm:text-sm text-[#5C665C]">
              Review your transaction history, verified UPI/UTR submissions, and download official
              GST tax invoices.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/meeting-rooms"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Reserve Hourly Space</span>
            </Link>
          </div>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E5E1D8]">
          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E1D8]">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#5C665C] block">
              Cumulative Amount Settled
            </span>
            <div className="font-serif text-2xl font-bold text-[#2E7D32] mt-1 font-mono">
              ₹{totalSettled.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-[#5C665C] mt-0.5 block">
              Across {bookings.length} reservations
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E1D8]">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#5C665C] block">
              Verified Transactions
            </span>
            <div className="font-serif text-2xl font-bold text-[#181F18] mt-1">
              {verifiedPayments}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Audit verified by finance
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E1D8]">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#5C665C] block">
              In Verification Queue
            </span>
            <div className="font-serif text-2xl font-bold text-amber-700 mt-1">
              {pendingVerification}
            </div>
            <span className="text-[11px] text-amber-700 font-medium mt-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Concierge reviewing UTR
            </span>
          </div>
        </div>
      </div>

      {/* Official EnCourtyard Payment Details Notice */}
      <div className="bg-[#182618] text-white rounded-3xl p-6 sm:p-8 shadow-warm border border-[#2B402B] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#4ADE80]">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Official Settlement Account
              </h3>
              <p className="text-xs text-[#A5C0A5]">
                Direct UPI & RTGS credentials for corporate memberships
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 rounded-full bg-[#2E7D32]/40 border border-[#4ADE80]/30 text-[#4ADE80] text-xs font-mono font-bold">
              GST: 36AAECE8291M1ZP
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
            <span className="text-[#A5C0A5] block text-[11px]">EnCourtyard UPI ID</span>
            <strong className="text-white font-mono text-sm select-all">
              encourtyard@icici
            </strong>
          </div>
          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
            <span className="text-[#A5C0A5] block text-[11px]">Beneficiary Name</span>
            <strong className="text-white font-sans text-sm">
              EnCourtyard Workspaces Pvt. Ltd.
            </strong>
          </div>
          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
            <span className="text-[#A5C0A5] block text-[11px]">Instant Invoice Dispatch</span>
            <strong className="text-[#4ADE80] font-sans text-sm flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-4 h-4" /> Automated within 15 mins
            </strong>
          </div>
        </div>
      </div>

      {/* Transaction Records Table */}
      <div className="bg-white rounded-3xl border border-[#E5E1D8] shadow-warm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E1D8]">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#181F18]">
              Transaction History & Invoices
            </h3>
            <p className="text-xs text-[#5C665C]">
              Download tax invoices or check UTR settlement status.
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-[#5C665C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter by UTR or workspace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] text-xs text-[#181F18] placeholder-[#5C665C] focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-[#2E7D32] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#5C665C]">
              Loading Financial Records...
            </span>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#5C665C] space-y-2">
            <FileText className="w-10 h-10 mx-auto text-[#5C665C]/40" />
            <p>No payment records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E5E1D8] text-[10px] font-mono uppercase tracking-wider text-[#5C665C]">
                  <th className="pb-3.5 px-3 font-semibold">Invoice No.</th>
                  <th className="pb-3.5 px-3 font-semibold">Workspace Service</th>
                  <th className="pb-3.5 px-3 font-semibold">Date</th>
                  <th className="pb-3.5 px-3 font-semibold">UTR Reference</th>
                  <th className="pb-3.5 px-3 font-semibold">Amount</th>
                  <th className="pb-3.5 px-3 font-semibold">Status</th>
                  <th className="pb-3.5 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1D8]/60">
                {filteredBookings.map((b) => {
                  const invoiceNo = `INV-${b.id.replace(/-/g, '').slice(0, 8).toUpperCase()}`;

                  // Extract UTR from adminNotes
                  let utrNumber = 'Pending UTR';
                  let proofUrl = '';
                  if (b.adminNotes) {
                    const utrMatch = b.adminNotes.match(/UTR:\s*([^\s|]+)/i);
                    if (utrMatch) utrNumber = utrMatch[1];
                    const proofMatch = b.adminNotes.match(/Proof:\s*([^\s|]+)/i);
                    if (proofMatch) proofUrl = proofMatch[1];
                  }

                  const isPaid = b.status === 'CONFIRMED' || b.paymentStatus === 'PAID';

                  return (
                    <tr key={b.id} className="hover:bg-[#FAF9F5] transition-colors">
                      <td className="py-4 px-3 font-mono font-bold text-[#2E7D32]">
                        {invoiceNo}
                      </td>

                      <td className="py-4 px-3">
                        <strong className="block text-[#181F18] font-bold">
                          {b.workspaceTitle}
                        </strong>
                        <span className="text-[11px] text-[#5C665C] capitalize">
                          {b.plan || 'Workspace'}
                        </span>
                      </td>

                      <td className="py-4 px-3 text-[#5C665C]">
                        {new Date(b.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-4 px-3 font-mono">
                        <span className="bg-[#FAF9F5] px-2 py-1 rounded border border-[#E5E1D8] text-[11px] text-[#181F18]">
                          {utrNumber}
                        </span>
                        {proofUrl && (
                          <a
                            href={proofUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-[10px] text-[#2E7D32] hover:underline mt-1 inline-flex items-center gap-1"
                          >
                            <span>Receipt Image</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </td>

                      <td className="py-4 px-3 font-mono font-bold text-sm text-[#181F18]">
                        ₹{(b.totalAmount || 0).toLocaleString('en-IN')}
                      </td>

                      <td className="py-4 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isPaid ? 'bg-emerald-600' : 'bg-amber-600'
                            }`}
                          />
                          {isPaid ? 'Settled' : 'In Review'}
                        </span>
                      </td>

                      <td className="py-4 px-3 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedInvoice({
                              id: b.id,
                              workspaceTitle: b.workspaceTitle,
                              workspaceType: b.categoryName || 'Workspace',
                              bookingType: b.plan || 'Standard',
                              startDate: b.startDate,
                              endDate: b.endDate,
                              totalPrice: b.totalAmount || 0,
                              status: b.status,
                              userName: b.fullName,
                              userEmail: b.email,
                              userPhone: b.phone,
                              companyName: b.companyName,
                              adminNotes: b.adminNotes,
                              createdAt: b.createdAt,
                            })
                          }
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FAF9F5] hover:bg-[#2E7D32] text-[#181F18] hover:text-white border border-[#E5E1D8] text-xs font-semibold transition-all cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Tax Invoice</span>
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

      {/* Invoice Modal */}
      {selectedInvoice && (
        <InvoiceModal
          booking={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}
