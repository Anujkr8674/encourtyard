'use client';

import React, { useState } from 'react';
import { Users, Clock, Monitor, Sparkles, Check, ArrowRight, Calendar, Coffee, Tv } from 'lucide-react';
import { MeetingRoom } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

export interface MeetingRoomCardProps {
  room: MeetingRoom;
}

export const MeetingRoomCard: React.FC<MeetingRoomCardProps> = ({ room }) => {
  const [isReserveOpen, setIsReserveOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(room.availabilitySample[0] || '');
  const [reserved, setReserved] = useState(false);

  const handleReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setReserved(true);
    setTimeout(() => {
      setReserved(false);
      setIsReserveOpen(false);
    }, 2500);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#E5E1D8] overflow-hidden shadow-warm hover:shadow-warm-lg hover:border-[#263626] transition-all duration-300 flex flex-col h-full group transform hover:-translate-y-1.5">
        
        {/* Room Image Header */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#EAE5DB]">
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
            <Badge variant="olive" size="sm" className="shadow-sm backdrop-blur-md bg-white/90">
              {room.typeLabel}
            </Badge>
            <Badge
              variant={room.availability === 'available' ? 'available' : 'limited'}
              size="sm"
              dot
              className="shadow-sm backdrop-blur-md bg-white/90"
            >
              {room.availability === 'available' ? 'Available Today' : 'High Demand'}
            </Badge>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white flex items-center justify-between z-10">
            <span className="flex items-center gap-1.5 text-xs font-medium drop-shadow-md">
              <Users className="w-3.5 h-3.5 text-[#4ADE80]" />
              {room.capacity}
            </span>
            <span className="font-serif font-bold text-lg text-white drop-shadow-md bg-black/40 backdrop-blur-sm px-3 py-1 rounded-md border border-white/20">
              {room.hourlyPrice}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-7 flex flex-col flex-grow bg-white">
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#181F18] group-hover:text-[#263626] transition-colors mb-2">
            {room.name}
          </h3>

          <p className="text-xs sm:text-sm text-[#5C665C] mb-5 line-clamp-2 leading-relaxed">
            {room.tagline}
          </p>

          {/* Pricing Grid */}
          <div className="grid grid-cols-3 gap-2 py-3 px-3.5 bg-[#FAF9F5] rounded-xl border border-[#E5E1D8] text-center mb-5">
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#738273] block">Hourly</span>
              <span className="text-xs sm:text-sm font-bold text-[#181F18]">{room.hourlyPrice}</span>
            </div>
            <div className="border-x border-[#E5E1D8] px-1">
              <span className="text-[10px] uppercase font-semibold text-[#738273] block">Half Day</span>
              <span className="text-xs sm:text-sm font-bold text-[#181F18]">{room.halfDayPrice}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#738273] block">Full Day</span>
              <span className="text-xs sm:text-sm font-bold text-[#181F18]">{room.fullDayPrice}</span>
            </div>
          </div>

          {/* Static Available Sample Slots */}
          <div className="mb-5">
            <span className="text-[11px] font-semibold text-[#5C665C] uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#263626]" /> Open Slots Today:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {room.availabilitySample.map((slot, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-mono bg-[#FAF9F5] text-[#263626] px-2.5 py-1 rounded-md border border-[#E5E1D8] hover:bg-[#E3EBE3] transition-colors"
                >
                  {slot}
                </span>
              ))}
            </div>
          </div>

          {/* Key Equipment Checklist */}
          <div className="space-y-2 mb-6 flex-grow">
            <span className="text-[11px] font-semibold text-[#738273] uppercase tracking-wider block">
              Audio-Visual Tech:
            </span>
            {room.equipment.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-[#181F18]">
                <div className="w-4 h-4 rounded-full bg-[#EAF5EA] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-[#2E7D32]" />
                </div>
                <span className="truncate">{item}</span>
              </div>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-[#E5E1D8] mt-auto grid grid-cols-2 gap-2.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsDetailsOpen(true)}
              className="justify-center"
            >
              Specs & AV
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsReserveOpen(true)}
              className="justify-center"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Reserve Room
            </Button>
          </div>
        </div>
      </div>

      {/* Specs & Room Details Modal */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={room.name}
        subtitle={`${room.typeLabel} · Capacity: ${room.capacity}`}
      >
        <div className="space-y-5">
          <div className="h-60 sm:h-64 w-full rounded-xl overflow-hidden bg-[#EAE5DB]">
            <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
          </div>

          <div>
            <h4 className="text-xs uppercase font-semibold text-[#5C665C] tracking-wider mb-1.5">
              Room Architectural Design
            </h4>
            <p className="text-sm text-[#181F18] leading-relaxed">
              {room.description}
            </p>
          </div>

          <div className="bg-[#F7F5F0] p-4 rounded-xl border border-[#E5E1D8] space-y-2">
            <h4 className="text-xs uppercase font-semibold text-[#263626] tracking-wider">
              Audio-Visual & Smart Tech Suite
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {room.equipment.map((eq, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[#181F18]">
                  <Check className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                  <span>{eq}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-[#FAF9F5] border border-[#E5E1D8] rounded-xl">
            <div className="flex items-center gap-2.5">
              <Coffee className="w-4 h-4 text-[#C29B38]" />
              <span className="text-xs font-medium text-[#181F18]">
                Artisanal Coffee & Catering Concierge
              </span>
            </div>
            <span className="text-xs font-semibold text-[#2E7D32]">Included Option</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E1D8]">
            <Button variant="secondary" size="md" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setIsDetailsOpen(false);
                setIsReserveOpen(true);
              }}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Reserve Slot
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reserve Room Modal UI */}
      <Modal
        isOpen={isReserveOpen}
        onClose={() => setIsReserveOpen(false)}
        title={`Reserve ${room.name}`}
        subtitle="Static reservation demonstration · No card required."
      >
        {reserved ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#EAF5EA] text-[#2E7D32] flex items-center justify-center mx-auto border border-[#C8E6C9]">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-xl font-bold text-[#181F18]">
              Room Slot Held
            </h4>
            <p className="text-sm text-[#5C665C] max-w-sm mx-auto">
              Your reservation request for {room.name} ({selectedSlot}) has been logged. Our concierge will send calendar invites and AV access codes shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleReservation} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C665C] mb-1.5">
                  Host Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Marcus Lindqvist"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E5E1D8] rounded-md text-sm text-[#181F18] focus:outline-none focus:border-[#263626]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C665C] mb-1.5">
                  Company / Organization
                </label>
                <input
                  type="text"
                  required
                  placeholder="Studio Lindqvist"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E5E1D8] rounded-md text-sm text-[#181F18] focus:outline-none focus:border-[#263626]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C665C] mb-1.5">
                  Reservation Date
                </label>
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E5E1D8] rounded-md text-sm text-[#181F18] focus:outline-none focus:border-[#263626]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C665C] mb-1.5">
                  Preferred Time Slot
                </label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E5E1D8] rounded-md text-sm text-[#181F18] focus:outline-none focus:border-[#263626]"
                >
                  {room.availabilitySample.map((s, idx) => (
                    <option key={idx} value={s}>{s}</option>
                  ))}
                  <option value="Half Day Morning (8:30 AM – 12:30 PM)">Half Day Morning (8:30 AM – 12:30 PM)</option>
                  <option value="Half Day Afternoon (1:30 PM – 5:30 PM)">Half Day Afternoon (1:30 PM – 5:30 PM)</option>
                  <option value="Full Day (8:30 AM – 5:30 PM)">Full Day (8:30 AM – 5:30 PM)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input type="checkbox" id="cateringCheck" className="rounded text-[#263626] focus:ring-[#263626]" />
              <label htmlFor="cateringCheck" className="text-xs text-[#5C665C]">
                Include complimentary artisanal espresso and tea station service
              </label>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#E5E1D8]">
              <Button type="button" variant="secondary" size="md" onClick={() => setIsReserveOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                Confirm Reservation Request
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};
