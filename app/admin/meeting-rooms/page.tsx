'use client';

import React from 'react';
import { Monitor, Users, Wifi, Clock, Plus, CheckCircle2, DollarSign } from 'lucide-react';

export default function AdminMeetingRoomsPage() {
  const rooms = [
    { id: 'RM-01', name: 'The Oak Executive Boardroom', capacity: '12 Persons', city: 'Hyderabad', hourlyRate: '₹3,500/hr', av: '4K Dual Displays, Studio Microphones, Polycom Poly-X50', status: 'Available', image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80' },
    { id: 'RM-02', name: 'The Cedar Creative Strategy Pod', capacity: '6 Persons', city: 'Bangalore', hourlyRate: '₹2,200/hr', av: 'Interactive 65" Touchboard, Acoustic Felt Wall', status: 'In Use (until 4:30 PM)', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80' },
    { id: 'RM-03', name: 'Glasshouse Solarium Boardroom', capacity: '18 Persons', city: 'Mumbai BKC', hourlyRate: '₹5,000/hr', av: '85" MicroLED Screen, AI Framing Camera, High-Fidelity Audio', status: 'Available', image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80' },
    { id: 'RM-04', name: 'Soundproof Solo Podcast Booth', capacity: '2 Persons', city: 'Hyderabad', hourlyRate: '₹1,200/hr', av: 'Shure SM7B Microphones, RodeCaster Pro II Audio Interface', status: 'Available', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E3EBE3] text-[#2E7D32] text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <span>Audio-Visual Spaces</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18]">
            Meeting Rooms & Executive Boardrooms
          </h1>
          <p className="text-xs sm:text-sm text-[#5C665C]">
            Manage AV hardware specs, hourly commercial rates, and room availability switches.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#388E3C] text-white text-xs font-bold shadow-md transition-all">
          <Plus className="w-4 h-4" />
          <span>Add Meeting Room</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {rooms.map((r) => (
          <div key={r.id} className="bg-white rounded-3xl border border-[#E5E1D8] overflow-hidden shadow-sm flex flex-col sm:flex-row">
            <div className="w-full sm:w-48 h-40 sm:h-auto relative bg-[#263626] shrink-0">
              <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-[#6A806A]">{r.id} · {r.city}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                    r.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {r.status}
                  </span>
                </div>
                <h3 className="font-serif text-base font-bold text-[#181F18]">{r.name}</h3>
                <p className="text-xs text-[#5C665C] mt-1">{r.av}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#E5E1D8] text-xs">
                <div>
                  <span className="text-[#6A806A] block text-[10px]">Capacity:</span>
                  <strong className="text-[#181F18]">{r.capacity}</strong>
                </div>
                <div>
                  <span className="text-[#6A806A] block text-[10px]">Hourly Rate:</span>
                  <strong className="text-[#2E7D32] font-mono">{r.hourlyRate}</strong>
                </div>
                <button className="px-3 py-1 rounded-lg bg-[#FAF9F5] hover:bg-[#E3EBE3] border border-[#E5E1D8] text-[#263626] font-semibold text-[11px] cursor-pointer">
                  Configure
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
