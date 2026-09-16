'use client';

import React from 'react';
import Link from 'next/link';
import { Monitor, Users, Clock, Coffee, ShieldCheck, Sparkles, ArrowRight, Mic, Video, Cast } from 'lucide-react';
import { MEETING_ROOMS, FAQS } from '@/lib/data';
import { MeetingRoomCard } from '@/components/meeting-rooms/MeetingRoomCard';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';

export default function MeetingRoomsPage() {
  const meetingFaqs = [
    {
      id: 'mr-1',
      question: 'Do I need to be an EnCourtyard member to book a meeting room?',
      answer: 'No. Our executive meeting rooms, collaboration pods, and Glass Pavilion Hall are available for both EnCourtyard members and external corporate clients. Members receive discounted booking rates and monthly credit allocations.'
    },
    {
      id: 'mr-2',
      question: 'What AV equipment and cables are provided in the room?',
      answer: 'Every room is fully equipped with Sony 4K commercial displays, Neat Bar Pro AI cameras with auto-speaker framing, Shure ceiling beamforming microphones, and wireless screencasting via Apple AirPlay, Miracast, and HDMI.'
    },
    {
      id: 'mr-3',
      question: 'Can you provide catering and barista coffee for our meetings?',
      answer: 'Yes! Our on-site botanical café can provide customized artisanal coffee service, pastries, organic lunch platters, and sparkling refreshments delivered directly to your meeting room at scheduled times.'
    },
    {
      id: 'mr-4',
      question: 'What is the cancellation policy for meeting room reservations?',
      answer: 'Meeting rooms can be cancelled or rescheduled with zero penalty up to 24 hours prior to the scheduled reservation start time.'
    }
  ];

  const avHighlights = [
    {
      icon: <Video className="w-6 h-6 text-[#2E7D32]" />,
      title: 'Neat AI Smart Video Conferencing',
      description: 'Auto-framing and noise cancellation ensure every participant is seen and heard with studio fidelity.'
    },
    {
      icon: <Mic className="w-6 h-6 text-[#263626]" />,
      title: 'Shure Beamforming Ceiling Mics',
      description: 'Crystal-clear acoustic pickup from any corner of the room without cluttered tabletop microphone cables.'
    },
    {
      icon: <Cast className="w-6 h-6 text-[#C29B38]" />,
      title: 'One-Touch Wireless Screen Casting',
      description: 'Instant wireless sharing from MacBook, Windows, iPad, or Android with zero software dongles required.'
    },
    {
      icon: <Coffee className="w-6 h-6 text-[#C05621]" />,
      title: 'Barista Service & Butler Button',
      description: 'Direct in-room call button for on-demand espresso, herbal teas, and executive catering refreshes.'
    }
  ];

  return (
    <div className="bg-[#FAF9F5] min-h-screen">
      {/* Page Hero with Dark Canvas */}
      <section className="bg-[#181F18] text-white pt-32 pb-20 border-b border-[#263626] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#3A4D3A_1px,transparent_1px)] [background-size:28px_28px] opacity-25 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#4ADE80]">
              <Monitor className="w-3.5 h-3.5" />
              <span>Smart Meeting & Event Suites</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
              Architectural rooms engineered for impactful decisions.
            </h1>
            <p className="text-base sm:text-lg text-[#C5D5C5] leading-relaxed font-sans">
              From high-stakes 16-person executive boardrooms to 70-person keynote amphitheaters, experience seamless AV tech, acoustic privacy, and concierge hospitality.
            </p>
          </div>
        </div>
      </section>

      {/* Meeting Rooms Catalog Grid */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18]">
              Available Meeting & Presentation Suites
            </h2>
            <p className="text-xs sm:text-sm text-[#5C665C] mt-1">
              Select a room below to view equipment specifications or request static reservation hold.
            </p>
          </div>
          <div className="text-xs font-mono text-[#5C665C] bg-[#F2EEE7] px-3.5 py-1.5 rounded-full border border-[#E5E1D8] hidden sm:block font-medium">
            Sony 4K Displays & Fiber Included
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MEETING_ROOMS.map((room) => (
            <MeetingRoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>

      {/* AV Technology & Smart Suite Specs */}
      <section className="py-20 bg-[#F7F5F0] border-y border-[#E5E1D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase font-mono tracking-widest text-[#263626] font-semibold">
              Broadcast Grade AV Suite
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#181F18]">
              Technology that gets out of your way
            </h2>
            <p className="text-base sm:text-lg text-[#5C665C]">
              No confusing remotes or awkward video delays. Start hybrid video meetings in under 10 seconds with single-tap controls.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {avHighlights.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-7 rounded-2xl border border-[#E5E1D8] shadow-warm hover:shadow-warm-lg hover:border-[#263626] transition-all transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-serif text-lg font-bold text-[#181F18] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5C665C] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meeting Rooms FAQ Section */}
      <section className="py-20 lg:py-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 space-y-2">
          <span className="text-xs uppercase font-mono tracking-widest text-[#263626] font-semibold">
            Reservation Inquiries
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#181F18]">
            Meeting Room FAQs
          </h2>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-[#E5E1D8] shadow-warm">
          <Accordion items={meetingFaqs} defaultOpenIndex={0} />
        </div>

        {/* Schedule a Visit Banner */}
        <div className="mt-14 p-8 sm:p-10 bg-[#263626] text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl border border-[#3A4D3A]">
          <div>
            <h4 className="font-serif text-2xl font-bold text-white">
              Want a walkthrough of our meeting facilities?
            </h4>
            <p className="text-xs sm:text-sm text-[#C5D5C5] mt-1">
              Test the acoustics and video conferencing firsthand with our technical team.
            </p>
          </div>
          <Button
            href="/about#visit-form"
            variant="white"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Schedule a Visit
          </Button>
        </div>
      </section>
    </div>
  );
}
