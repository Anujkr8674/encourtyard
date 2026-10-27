'use client';

import React from 'react';
import {
  X,
  Printer,
  Download,
  Building2,
  CheckCircle2,
  CreditCard,
  Calendar,
  Clock,
  ShieldCheck,
  FileText,
  ExternalLink,
} from 'lucide-react';

interface InvoiceBooking {
  id: string;
  workspaceTitle: string;
  workspaceType: string;
  bookingType: string;
  startDate: string;
  endDate?: string;
  totalPrice: number;
  status: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  companyName?: string;
  adminNotes?: string;
  createdAt: string;
}

interface InvoiceModalProps {
  booking: InvoiceBooking;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ booking, onClose }) => {
  const invoiceNumber = `INV-${booking.id.replace(/-/g, '').slice(0, 8).toUpperCase()}`;
  const invoiceDate = new Date(booking.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Extract UTR from adminNotes if present
  let utrNumber = 'N/A';
  if (booking.adminNotes) {
    const utrMatch = booking.adminNotes.match(/UTR:\s*([^\s|]+)/i);
    if (utrMatch) utrNumber = utrMatch[1];
  }

  // Calculate tax breakdown (assuming inclusive 18% GST or base + 18%)
  const total = booking.totalPrice || 0;
  const baseAmount = Math.round((total / 1.18) * 100) / 100;
  const totalTax = Math.round((total - baseAmount) * 100) / 100;
  const cgst = Math.round((totalTax / 2) * 100) / 100;
  const sgst = Math.round((totalTax / 2) * 100) / 100;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E5E1D8] relative text-left">
        {/* Sticky Action Header (hidden during print) */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#E5E1D8] flex items-center justify-between z-10 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#E8F5E9] text-[#2E7D32]">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-serif text-base font-bold text-[#181F18]">
                Official Tax Invoice
              </h3>
              <p className="text-[11px] text-[#5C665C] font-mono">{invoiceNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#5C665C] hover:bg-[#FAF9F5] hover:text-[#181F18] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-6 sm:p-8 space-y-6 text-[#181F18] font-sans printable-invoice">
          {/* Header & Seller Info */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#E5E1D8]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#121E12] text-white flex items-center justify-center font-serif font-bold text-sm">
                  EC
                </div>
                <span className="font-serif text-xl font-bold tracking-tight text-[#181F18]">
                  EnCourtyard Workspaces
                </span>
              </div>
              <p className="text-xs text-[#5C665C]">Architectural Coworking & Executive Suites</p>
              <p className="text-[11px] text-[#717E71] font-mono">
                GSTIN: 36AAECE8291M1ZP · HSN: 997212
              </p>
              <p className="text-[11px] text-[#717E71]">
                Sanctuary Tower, Jubilee Hills, Hyderabad 500033
              </p>
              <p className="text-[11px] text-[#717E71]">
                Email: billing@encourtyard.com | Phone: +91 99082 09993
              </p>
            </div>

            <div className="sm:text-right space-y-1 bg-[#FAF9F5] p-3.5 rounded-2xl border border-[#E5E1D8]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#5C665C] block">
                Tax Invoice
              </span>
              <strong className="text-sm font-mono text-[#2E7D32] block">{invoiceNumber}</strong>
              <div className="text-xs text-[#5C665C]">
                Date: <span className="font-medium text-[#181F18]">{invoiceDate}</span>
              </div>
              <div className="text-xs">
                Status:{' '}
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                  <CheckCircle2 className="w-3 h-3" /> Settlement Received
                </span>
              </div>
            </div>
          </div>

          {/* Billed To / Client Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF9F5] p-4 rounded-2xl border border-[#E5E1D8] text-xs">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#5C665C] block mb-1">
                Billed To
              </span>
              <h4 className="font-bold text-sm text-[#181F18]">{booking.userName}</h4>
              {booking.companyName && (
                <p className="font-medium text-[#2E7D32]">{booking.companyName}</p>
              )}
              <p className="text-[#5C665C] mt-0.5">{booking.userEmail}</p>
              {booking.userPhone && <p className="text-[#5C665C]">{booking.userPhone}</p>}
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#5C665C] block mb-1">
                Payment Verification
              </span>
              <p className="text-[#5C665C]">
                Payment Mode:{' '}
                <strong className="text-[#181F18]">UPI QR / Bank Transfer</strong>
              </p>
              <p className="text-[#5C665C]">
                Transaction UTR:{' '}
                <strong className="font-mono text-[#2E7D32]">{utrNumber}</strong>
              </p>
              <p className="text-[#5C665C]">
                Booking Reference:{' '}
                <span className="font-mono text-[#181F18]">{booking.id.slice(0, 8)}</span>
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#E5E1D8]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] border-b border-[#E5E1D8] text-[#5C665C] font-mono uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Item Description</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Date / Schedule</th>
                  <th className="py-3 px-4 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1D8]">
                <tr>
                  <td className="py-3.5 px-4">
                    <strong className="text-sm text-[#181F18] block">
                      {booking.workspaceTitle}
                    </strong>
                    <span className="text-[11px] text-[#5C665C]">
                      Full amenities, high-speed fiber, complimentary botanical bar
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-medium capitalize">
                    {booking.bookingType || 'Standard'}
                  </td>
                  <td className="py-3.5 px-3 text-[#5C665C]">
                    {new Date(booking.startDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#181F18]">
                    ₹{baseAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Calculation Breakdown */}
          <div className="flex justify-end pt-2">
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-[#5C665C]">
                <span>Taxable Amount:</span>
                <span className="font-mono">
                  ₹{baseAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-[#5C665C]">
                <span>CGST (9.0%):</span>
                <span className="font-mono">
                  ₹{cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-[#5C665C]">
                <span>SGST (9.0%):</span>
                <span className="font-mono">
                  ₹{sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="border-t border-[#E5E1D8] pt-2 flex justify-between font-bold text-sm text-[#181F18]">
                <span>Total Settled:</span>
                <span className="font-mono text-base text-[#2E7D32]">
                  ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          <div className="pt-4 border-t border-[#E5E1D8] text-[11px] text-[#717E71] space-y-1">
            <p className="font-semibold text-[#181F18]">Declaration & Terms:</p>
            <p>
              1. This is a computer-generated tax invoice and requires no physical signature.
            </p>
            <p>
              2. For any invoice queries or corporate GST credit updates, please write to{' '}
              <span className="text-[#2E7D32] font-medium">billing@encourtyard.com</span>.
            </p>
            <p>
              3. Check-in requires presentation of a valid photo ID and confirmation code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
