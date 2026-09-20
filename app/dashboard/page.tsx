'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  Building2, 
  Users, 
  Calendar, 
  Clock, 
  CreditCard, 
  Bell, 
  Key, 
  Wifi, 
  Coffee, 
  Monitor, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Plus,
  LogOut,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { UserLoginForm } from '@/components/user/UserLoginForm';

export default function UserDashboardPage() {
  const { user, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'seats' | 'bookings' | 'billing'>('overview');

  // If loading session, show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center text-[#181F18]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#2E7D32] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono tracking-widest uppercase text-[#5C665C]">
            Loading Member Profile...
          </span>
        </div>
      </div>
    );
  }

  // If NOT logged in as User, show User Sign In
  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[#FAF9F5] flex items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#263626 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="w-full max-w-md relative z-10">
          <UserLoginForm />
        </div>
      </div>
    );
  }

  const userName = user?.name || 'Valued Member';
  const userCompany = user?.company || 'Innovation Studio';
  const userEmail = user?.email || 'member@encourtyard.com';

  const upcomingBookings = [
    {
      id: 'bk-1',
      room: 'The Oak Executive Boardroom (Bangalore)',
      date: 'Tomorrow, 10:00 AM – 12:00 PM',
      host: userName,
      attendees: '8 Persons',
      status: 'Confirmed'
    },
    {
      id: 'bk-2',
      room: 'The Cedar Creative Pod (Mumbai BKC)',
      date: 'Thursday, 3:00 PM – 4:30 PM',
      host: userName,
      attendees: '4 Persons',
      status: 'Confirmed'
    }
  ];

  const allocatedSeats = [
    { seatNumber: 'Suite 304 - Desk 01', user: `${userName} (Lead)`, status: 'Active', keycard: 'EC-9481' },
    { seatNumber: 'Suite 304 - Desk 02', user: 'Alexander Vance (Tech)', status: 'Active', keycard: 'EC-9482' },
    { seatNumber: 'Suite 304 - Desk 03', user: 'Sarah Jenkins (Design)', status: 'Active', keycard: 'EC-9483' },
    { seatNumber: 'Suite 304 - Desk 04', user: 'Dmitri Chen (Engineering)', status: 'Active', keycard: 'EC-9484' },
    { seatNumber: 'Suite 304 - Desk 05', user: 'Marcus Wright (Growth)', status: 'Active', keycard: 'EC-9485' },
    { seatNumber: 'Suite 304 - Desk 06', user: 'Unassigned Guest Desk', status: 'Available', keycard: 'EC-9486' }
  ];

  return (
    <div className="bg-[#FAF9F5] min-h-screen">
      {/* Dashboard Header Banner */}
      <section className="bg-[#181F18] text-white pt-32 pb-16 border-b border-[#263626] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#4ADE80] text-xs font-semibold">
                <Building2 className="w-3.5 h-3.5" />
                <span>Verified Member Portal</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                {userCompany} Workspace
              </h1>
              <p className="text-xs sm:text-sm text-[#C5D5C5] flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#4ADE80]" />
                <span>Primary Account: <strong className="text-white">{userName}</strong> ({userEmail})</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                href="/meeting-rooms"
                variant="white"
                size="sm"
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Reserve Meeting Room
              </Button>
              <button
                onClick={() => logout()}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-200 text-xs font-semibold transition-all cursor-pointer shadow-md"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 text-xs sm:text-sm">
            <div>
              <span className="text-white/70 block text-xs">Active Membership</span>
              <span className="font-bold text-white">Executive Private Suite (6 Desks)</span>
            </div>
            <div>
              <span className="text-white/70 block text-xs">Meeting Room Credits</span>
              <span className="font-bold text-[#4ADE80]">16 / 20 Hours Remaining</span>
            </div>
            <div>
              <span className="text-white/70 block text-xs">Biometric Keycards</span>
              <span className="font-bold text-white">5 Active (1 Spare)</span>
            </div>
            <div>
              <span className="text-white/70 block text-xs">Monthly Billing</span>
              <span className="font-bold text-white">Current (Next: Oct 1st)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 pb-6 border-b border-[#E5E1D8]">
          {[
            { id: 'overview', label: 'Workspace Overview' },
            { id: 'seats', label: 'Seat Allocation (6)' },
            { id: 'bookings', label: 'Upcoming Bookings' },
            { id: 'billing', label: 'Billing & Invoices' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#263626] text-white shadow-sm'
                  : 'bg-white text-[#5C665C] border border-[#E5E1D8] hover:bg-[#F2EEE7] hover:text-[#181F18]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
            
            {/* Left 8 Cols: Space Status & Upcoming */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Space Photo Banner */}
              <div className="bg-white rounded-2xl border border-[#E5E1D8] overflow-hidden shadow-warm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-xl font-bold text-[#181F18]">
                    Your Private Suite 304 Overview
                  </h3>
                  <Badge variant="available" size="sm" dot>
                    Active Membership
                  </Badge>
                </div>

                <div className="h-56 w-full rounded-xl overflow-hidden bg-[#EAE5DB] mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
                    alt="Executive Private Suite"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E5E1D8]">
                    <span className="text-[#5C665C] block">Dedicated Bandwidth</span>
                    <strong className="text-[#181F18] font-mono">1 Gbps Symmetric</strong>
                  </div>
                  <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E5E1D8]">
                    <span className="text-[#5C665C] block">Private Subnet VLAN</span>
                    <strong className="text-[#2E7D32] font-mono">Encrypted 10.10.4.0/24</strong>
                  </div>
                  <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E5E1D8]">
                    <span className="text-[#5C665C] block">Daily Housekeeping</span>
                    <strong className="text-[#181F18]">7:30 AM & 6:00 PM</strong>
                  </div>
                </div>
              </div>

              {/* Upcoming Room Reservations Card */}
              <div className="bg-white rounded-2xl border border-[#E5E1D8] shadow-warm p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl font-bold text-[#181F18]">
                    Upcoming Meeting Room Reservations
                  </h3>
                  <Link href="/meeting-rooms" className="text-xs text-[#263626] font-semibold underline">
                    Book Room &rarr;
                  </Link>
                </div>

                <div className="space-y-3">
                  {upcomingBookings.map((bk) => (
                    <div
                      key={bk.id}
                      className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-[#181F18]">{bk.room}</h4>
                        <div className="flex items-center gap-3 text-xs text-[#5C665C]">
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#263626]" /> {bk.date}</span>
                          <span>·</span>
                          <span>{bk.attendees}</span>
                        </div>
                      </div>
                      <Badge variant="available" size="sm" dot>
                        {bk.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right 4 Cols: Concierge & Guest Access */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Daily Amenities Quick Card */}
              <div className="bg-[#263626] text-white rounded-2xl p-6 shadow-warm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1A261A] flex items-center justify-center text-[#4ADE80]">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-white">Botanical Café Bar</h4>
                    <span className="text-xs text-[#A3BFA3]">Complimentary Member Perks</span>
                  </div>
                </div>
                <p className="text-xs text-[#C5D5C5] leading-relaxed">
                  Single-origin Kenyan & Ethiopian roasts are freshly ground at the central courtyard bar.
                </p>
                <div className="text-xs text-[#4ADE80] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Barista hours: 8:00 AM – 4:30 PM
                </div>
              </div>

              {/* Concierge Desk Direct Contact */}
              <div className="bg-white rounded-2xl border border-[#E5E1D8] p-6 shadow-warm space-y-3 text-xs">
                <h4 className="font-serif text-base font-bold text-[#181F18]">
                  On-Site Concierge Support
                </h4>
                <p className="text-[#5C665C]">
                  Need extra visitor passes, courier sorting, or private catering for tomorrow’s client pitch?
                </p>
                <div className="pt-2">
                  <Button href="/about#visit-form" variant="secondary" size="sm" className="w-full justify-center">
                    Contact Resident Manager
                  </Button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Seat Allocation Map */}
        {activeTab === 'seats' && (
          <div className="bg-white rounded-2xl border border-[#E5E1D8] shadow-warm p-8 mt-8 space-y-6 animate-fadeIn text-left">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E1D8]">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#181F18]">
                  Suite 304 Workstation Roster
                </h3>
                <p className="text-xs text-[#5C665C]">
                  Manage active keycards and registered team members assigned to your private office.
                </p>
              </div>
              <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                Add Team Member
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allocatedSeats.map((seat, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-[#E5E1D8] bg-[#FAF9F5] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#263626] bg-[#E3EBE3] px-2.5 py-1 rounded">
                      {seat.seatNumber}
                    </span>
                    <Badge variant={seat.status === 'Active' ? 'available' : 'neutral'} size="sm" dot>
                      {seat.status}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#181F18]">{seat.user}</h4>
                    <span className="text-xs text-[#5C665C] font-mono">Keycard: {seat.keycard}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Bookings List */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl border border-[#E5E1D8] shadow-warm p-8 mt-8 space-y-4 animate-fadeIn text-left">
            <h3 className="font-serif text-xl font-bold text-[#181F18] mb-4">
              Meeting Room & Event Reservations
            </h3>
            {upcomingBookings.map((bk) => (
              <div
                key={bk.id}
                className="p-5 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-base text-[#181F18]">{bk.room}</h4>
                  <p className="text-xs text-[#5C665C] mt-1">{bk.date} · {bk.attendees}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="available" size="sm" dot>
                    {bk.status}
                  </Badge>
                  <Button href="/meeting-rooms" variant="secondary" size="sm">
                    Modify Slot
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Billing */}
        {activeTab === 'billing' && (
          <div className="bg-white rounded-2xl border border-[#E5E1D8] shadow-warm p-8 mt-8 space-y-6 animate-fadeIn text-left">
            <h3 className="font-serif text-xl font-bold text-[#181F18]">
              Billing History & Active Plan
            </h3>
            <div className="p-5 rounded-xl bg-[#F7F5F0] border border-[#E5E1D8] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#5C665C] block">Current Membership</span>
                <strong className="text-base text-[#181F18]">Executive Private Suite (6-Person)</strong>
                <div className="text-xs text-[#263626] font-semibold mt-0.5">$1,850.00 / month · Auto-renewing</div>
              </div>
              <Badge variant="available" size="sm" dot>
                Paid & Active
              </Badge>
            </div>
          </div>
        )}

      </section>
    </div>
  );
}
