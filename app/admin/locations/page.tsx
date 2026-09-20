'use client';

import React from 'react';
import { MapPin, Building2, Users, CheckCircle2, TrendingUp } from 'lucide-react';

export default function AdminLocationsPage() {
  const cities = [
    { city: 'Hyderabad', state: 'Telangana', centres: 16, totalDesks: 1450, occupancy: '92.4%', leadHub: 'HITEC City & Gachibowli Botanical Campus', image: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=800&q=80' },
    { city: 'Bangalore', state: 'Karnataka', centres: 21, totalDesks: 2100, occupancy: '94.8%', leadHub: 'Indiranagar Sanctuary & Whitefield Hub', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80' },
    { city: 'Mumbai', state: 'Maharashtra', centres: 14, totalDesks: 1320, occupancy: '91.2%', leadHub: 'BKC Financial Enclave & Lower Parel', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80' },
    { city: 'Delhi NCR', state: 'Delhi & Haryana', centres: 11, totalDesks: 980, occupancy: '87.5%', leadHub: 'Cyber City Gurugram & Connaught Place', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80' },
    { city: 'Pune', state: 'Maharashtra', centres: 7, totalDesks: 640, occupancy: '85.0%', leadHub: 'Koregaon Park & Baner Botanical Wing', image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80' },
    { city: 'Chennai', state: 'Tamil Nadu', centres: 5, totalDesks: 490, occupancy: '88.3%', leadHub: 'OMR IT Corridor & Guindy Estate', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80' },
    { city: 'Kolkata', state: 'West Bengal', centres: 3, totalDesks: 320, occupancy: '82.1%', leadHub: 'Salt Lake Sector V & Park Street', image: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80' },
    { city: 'Ahmedabad', state: 'Gujarat', centres: 2, totalDesks: 240, occupancy: '86.4%', leadHub: 'SG Highway & GIFT City Pavilion', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E3EBE3] text-[#2E7D32] text-xs font-mono font-semibold uppercase tracking-wider mb-1">
          <span>Pan-India Presence</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18]">
          79 Workspaces Across 8 Prime Cities
        </h1>
        <p className="text-xs sm:text-sm text-[#5C665C]">
          Campus network inventory, real-time occupancy rates, and facility health status.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {cities.map((c) => (
          <div key={c.city} className="bg-white rounded-3xl border border-[#E5E1D8] overflow-hidden shadow-sm hover:shadow-md transition-all group">
            <div className="h-36 relative overflow-hidden bg-[#263626]">
              <img src={c.image} alt={c.city} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="font-serif text-lg font-bold block">{c.city}</span>
                <span className="text-[11px] text-[#4ADE80] font-mono">{c.centres} Centres Active</span>
              </div>
            </div>

            <div className="p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-[#5C665C]">
                <span>Total Desks:</span>
                <strong className="text-[#181F18] font-mono">{c.totalDesks}</strong>
              </div>
              <div className="flex items-center justify-between text-[#5C665C]">
                <span>Occupancy Rate:</span>
                <span className="font-bold text-[#2E7D32] font-mono">{c.occupancy}</span>
              </div>
              <div className="pt-2 border-t border-[#E5E1D8] text-[11px] text-[#6A806A] truncate">
                Hub: {c.leadHub}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
