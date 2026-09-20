'use client';

import React, { useState } from 'react';
import { Calendar, Plus, Search, Filter, Clock, MapPin, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

export default function AdminBookingsPage() {
  const [filterType, setFilterType] = useState('ALL');

  const bookings = [
    { id: 'BK-991', host: 'Elena Rostova', company: 'Vanguard BioTech', space: 'The Oak Executive Boardroom', city: 'Hyderabad', date: 'Tomorrow, 20 Sep', time: '10:00 AM – 12:00 PM', attendees: 8, amount: '₹7,000', status: 'Confirmed' },
    { id: 'BK-992', host: 'Marcus Lindqvist', company: 'Studio Lindqvist', space: 'The Cedar Creative Pod', city: 'Bangalore', date: '21 Sep 2026', time: '03:00 PM – 04:30 PM', attendees: 4, amount: '₹3,500', status: 'Confirmed' },
    { id: 'BK-993', host: 'Devin Thorne', company: 'Kinetix AI', space: 'Glasshouse Strategy Studio', city: 'Mumbai BKC', date: '22 Sep 2026', time: '11:00 AM – 02:00 PM', attendees: 12, amount: '₹12,000', status: 'Confirmed' },
    { id: 'BK-994', host: 'Rohan Sharma', company: 'Botanical Labs', space: 'Soundproof Solo Podcast Booth', city: 'Hyderabad', date: '20 Sep 2026', time: '02:00 PM – 03:00 PM', attendees: 1, amount: '₹1,200', status: 'Pending Approval' },
    { id: 'BK-995', host: 'Aarav Patel', company: 'Zenith Health', space: 'Courtyard Solarium Event Space', city: 'Pune', date: '25 Sep 2026', time: '05:00 PM – 08:00 PM', attendees: 40, amount: '₹35,000', status: 'Confirmed' },
    { id: 'BK-996', host: 'Chloe Mercer', company: 'Apex Robotics', space: 'Executive Boardroom', city: 'Delhi NCR', date: '23 Sep 2026', time: '09:00 AM – 11:00 AM', attendees: 6, amount: '₹5,500', status: 'Cancelled' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E3EBE3] text-[#2E7D32] text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <span>Reservation Control</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18]">
            Meeting Room & Desk Bookings
          </h1>
          <p className="text-xs sm:text-sm text-[#5C665C]">
            Live schedule for boardrooms, podcast suites, event courtyards, and hot desk passes.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#388E3C] text-white text-xs font-bold shadow-md transition-all">
          <Plus className="w-4 h-4" />
          <span>Create Manual Booking</span>
        </button>
      </div>

      {/* Bookings Table */}
      <div className="bg-white border border-[#E5E1D8] rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E5E1D8] text-[#6A806A] font-mono uppercase text-[11px]">
                <th className="py-3.5 px-4">Booking Ref</th>
                <th className="py-3.5 px-4">Space / Room</th>
                <th className="py-3.5 px-4">City</th>
                <th className="py-3.5 px-4">Host & Company</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4 text-center">Attendees</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E1D8]/60">
              {bookings.map((bk) => (
                <tr key={bk.id} className="hover:bg-[#FAF9F5] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#181F18]">{bk.id}</td>
                  <td className="py-3.5 px-4 font-bold text-[#181F18]">{bk.space}</td>
                  <td className="py-3.5 px-4 font-medium text-[#181F18]">{bk.city}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-[#181F18] block">{bk.host}</span>
                    <span className="text-[10px] text-[#6A806A]">{bk.company}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[#181F18] block font-medium">{bk.date}</span>
                    <span className="text-[10px] text-[#6A806A]">{bk.time}</span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold">{bk.attendees}</td>
                  <td className="py-3.5 px-4 font-bold text-[#2E7D32]">{bk.amount}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                      bk.status === 'Confirmed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : bk.status.includes('Pending')
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {bk.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="px-3 py-1 rounded-lg bg-[#FAF9F5] hover:bg-[#E3EBE3] border border-[#E5E1D8] text-[#263626] font-semibold text-[11px] transition-colors cursor-pointer">
                      Details
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
