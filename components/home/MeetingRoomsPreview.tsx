'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Monitor, Users, Clock, Video } from 'lucide-react';
import { MEETING_ROOMS } from '@/lib/data';
import { MeetingRoomCard } from '@/components/meeting-rooms/MeetingRoomCard';
import { Button } from '@/components/ui/Button';

export const MeetingRoomsPreview: React.FC = () => {
  const previewRooms = MEETING_ROOMS.slice(0, 2);

  return (
    <section className="py-24 lg:py-32 bg-[#F7F5F0] border-b border-[#E5E1D8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E3EBE3] border border-[#CFDCCF] text-xs font-semibold text-[#263626]">
              <Monitor className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Smart Conference Suites</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181F18] leading-tight">
              High-spec meeting rooms that elevate every presentation.
            </h2>
            <p className="text-base sm:text-lg text-[#5C665C] leading-relaxed">
              Equipped with Sony 4K displays, beamforming ceiling microphones, Neat Bar AI video conferencing, and full catering support.
            </p>
          </div>

          <div className="shrink-0">
            <Button
              href="/meeting-rooms"
              variant="outline"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Explore All 4 Meeting Suites
            </Button>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {previewRooms.map((room) => (
            <MeetingRoomCard key={room.id} room={room} />
          ))}
        </div>

        {/* Event banner */}
        <div className="mt-16 p-8 sm:p-10 bg-[#263626] rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-warm-lg border border-[#3A4D3A]">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase font-mono tracking-widest text-[#4ADE80] font-semibold">
              Need Event Space for 50–70 Attendees?
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Host your Demo Day, Panel, or All-Hands in The Glass Pavilion
            </h3>
            <p className="text-xs sm:text-sm text-[#C5D5C5] max-w-xl">
              18-foot vaulted glass ceilings, laser 4K projection, multi-zone sound system, and private foyer.
            </p>
          </div>
          <Button
            href="/meeting-rooms"
            variant="white"
            size="md"
            className="shrink-0"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Discover Pavilion Hall
          </Button>
        </div>

      </div>
    </section>
  );
};
