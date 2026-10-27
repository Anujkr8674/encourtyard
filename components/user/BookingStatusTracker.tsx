'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Ban,
  ShieldCheck,
  MessageSquare,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  User,
} from 'lucide-react';
import { parseBookingNotes } from '@/lib/bookingNotes';

interface BookingStatusTrackerProps {
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | string;
  paymentStatus?: 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED' | string;
  createdAt?: string | Date;
  statusUpdatedAt?: string | Date | null;
  startDate?: string | null;
  utrNumber?: string | null;
  adminNotes?: string | null;
  compact?: boolean;
}

// Expandable text component with "See more" / "See less"
const ExpandableText: React.FC<{ text: string; maxLen?: number; isDanger?: boolean }> = ({
  text,
  maxLen = 50,
  isDanger = false,
}) => {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;
  if (text.length <= maxLen) {
    return <span className="leading-snug block">{text}</span>;
  }
  return (
    <div className="leading-snug">
      <span>{expanded ? text : `${text.slice(0, maxLen)}...`}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(!expanded);
        }}
        className={`font-bold text-[10px] underline ml-1 cursor-pointer transition-colors inline-flex items-center gap-0.5 ${
          isDanger ? 'text-rose-700 hover:text-rose-900' : 'text-[#2E7D32] hover:text-[#1E5C23]'
        }`}
      >
        <span>{expanded ? 'See less' : 'See more'}</span>
        {expanded ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
      </button>
    </div>
  );
};

export const BookingStatusTracker: React.FC<BookingStatusTrackerProps> = ({
  status,
  paymentStatus = 'PENDING',
  createdAt,
  statusUpdatedAt,
  startDate,
  utrNumber,
  adminNotes,
  compact = false,
}) => {
  const normStatus = (status || '').toUpperCase();
  const isCancelled =
    normStatus === 'CANCELLED' ||
    normStatus === 'CANCELED' ||
    normStatus === 'REJECTED' ||
    normStatus.includes('CANCEL');
  const isCompleted = normStatus === 'COMPLETED';
  const isConfirmed = normStatus === 'CONFIRMED' || isCompleted;
  const isPaid = (paymentStatus || '').toUpperCase() === 'PAID' || Boolean(utrNumber);

  // Helper to format date & time like Flipkart order tracking: "24 Oct '26 • 09:08 AM"
  const formatDateTime = (date?: string | Date | null) => {
    if (!date) return '';
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return String(date);
      const datePart = d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: '2-digit',
      });
      const timePart = d.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      return `${datePart} • ${timePart}`;
    } catch {
      return String(date);
    }
  };

  // Distinct extraction of User Notes (from booking time) and Admin Notes (from concierge updates)
  const parsed = parseBookingNotes(adminNotes);
  const userNote = parsed.userNotes;
  const officialAdminNote = parsed.adminNotes;
  const timelineHistory = parsed.timeline || [];

  // Derive stage timestamps
  const step1Time = formatDateTime(createdAt);
  const step2Time = isPaid
    ? formatDateTime(createdAt)
    : 'Awaiting Verification';
  const step3Time = isConfirmed
    ? formatDateTime(statusUpdatedAt || createdAt)
    : isCancelled
    ? 'Cancelled'
    : 'In Queue';
  const step4Time = isCompleted
    ? formatDateTime(statusUpdatedAt || createdAt)
    : isCancelled
    ? formatDateTime(statusUpdatedAt || createdAt)
    : startDate
    ? `Scheduled: ${startDate}`
    : 'Upcoming';

  // Specific notes for stages if present in timeline history
  const stageNotes: { [key: string]: string | null } = {};
  timelineHistory.forEach((entry) => {
    if (entry.note) {
      stageNotes[entry.status.toUpperCase()] = entry.note;
    }
  });

  const confirmedNote =
    stageNotes['CONFIRMED'] || (isConfirmed && !isCompleted && !isCancelled ? officialAdminNote : null);
  const completedNote = stageNotes['COMPLETED'] || (isCompleted ? officialAdminNote : null);
  const cancelledNote = stageNotes['CANCELLED'] || (isCancelled ? officialAdminNote : null);

  // Stepper Stages Data (Horizontal Flipkart-Style Tracker)
  const steps = [
    {
      id: 'step1',
      stepNum: '01',
      title: 'Booking Submitted',
      timestamp: step1Time || 'Submitted',
      completed: true,
      active: false,
      isDanger: false,
      subEvents: [
        'Reservation recorded',
        'Dossier created',
      ],
      note: userNote,
      noteLabel: 'User Note',
      noteType: 'user' as const,
    },
    {
      id: 'step2',
      stepNum: '02',
      title: 'Payment Verification',
      timestamp: step2Time,
      completed: isPaid || isConfirmed,
      active: !isPaid && !isConfirmed && !isCancelled,
      isDanger: false,
      subEvents: [
        utrNumber ? `UTR: ${utrNumber}` : isPaid ? 'Payment verified' : 'Awaiting UTR / Slip',
        isPaid ? 'Receipt registered' : 'Concierge verification',
      ],
      note: null,
      noteLabel: 'Note',
      noteType: 'admin' as const,
    },
    {
      id: 'step3',
      stepNum: '03',
      title: 'Concierge Approval',
      timestamp: step3Time,
      completed: isConfirmed,
      active: isPaid && !isConfirmed && !isCancelled,
      isDanger: false,
      subEvents: [
        isConfirmed ? 'Desk & slot allocated' : 'Reviewing floor availability',
        isConfirmed ? 'Keycard pass created' : 'Floor manager clearance',
      ],
      note: confirmedNote || officialAdminNote,
      noteLabel: 'Admin Note',
      noteType: 'admin' as const,
    },
    {
      id: 'step4',
      stepNum: '04',
      title: isCancelled
        ? 'Reservation Cancelled'
        : isCompleted
        ? 'Session Completed'
        : 'Ready for Check-In',
      timestamp: step4Time,
      completed: isCompleted || isCancelled,
      active: isConfirmed && !isCompleted && !isCancelled,
      isDanger: isCancelled,
      subEvents: isCancelled
        ? ['Access revoked', 'Booking terminated']
        : isCompleted
        ? ['Session concluded', 'Feedback registered']
        : ['Pass active for event', 'Present booking ref at desk'],
      note: isCancelled ? (cancelledNote || officialAdminNote) : completedNote,
      noteLabel: isCancelled ? 'Cancellation Reason' : 'Admin Note',
      noteType: isCancelled ? ('danger' as const) : ('admin' as const),
    },
  ];

  return (
    <div
      className={`rounded-2xl border text-left transition-all ${
        isCancelled
          ? 'bg-rose-50/70 border-rose-200 p-4 sm:p-5'
          : 'bg-[#FAF9F5] border-[#E5E1D8] p-4 sm:p-6'
      }`}
    >
      {/* Header Bar */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3.5 border-b ${
          isCancelled ? 'border-rose-200' : 'border-[#E5E1D8]'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {isCancelled ? (
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Ban className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-[#2E7D32] text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}
          <div>
            <span
              className={`text-[10px] font-mono font-bold uppercase tracking-wider block ${
                isCancelled ? 'text-rose-700' : 'text-[#2E7D32]'
              }`}
            >
              LIVE TRACKING TIMELINE
            </span>
            <h4 className="font-serif text-sm sm:text-base font-bold text-[#181F18]">
              {isCancelled ? 'Reservation Cancelled' : 'Reservation Progress Status'}
            </h4>
          </div>
        </div>

        {/* Status Pill Badge */}
        <div>
          {isCancelled ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold font-mono tracking-wider shadow-xs">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>DANGER: CANCELLED</span>
            </span>
          ) : isCompleted ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
              <span>Session Completed</span>
            </span>
          ) : isConfirmed ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#1B5E20] border border-[#A5D6A7] text-xs font-bold font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Confirmed & Reserved</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold font-mono animate-pulse">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Verification In Progress</span>
            </span>
          )}
        </div>
      </div>

      {/* Horizontal Progress Timeline: Flipkart-Style Stages */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-3 relative pt-4">
        {steps.map((step, idx) => {
          return (
            <div
              key={step.id}
              className={`relative flex flex-col justify-start p-3 sm:p-3.5 rounded-xl border transition-all ${
                step.isDanger
                  ? 'bg-rose-100/90 border-rose-300 text-rose-950 shadow-2xs'
                  : step.completed
                  ? 'bg-white border-[#E5E1D8] shadow-2xs'
                  : step.active
                  ? 'bg-amber-50/70 border-amber-300 shadow-2xs ring-1 ring-amber-300'
                  : 'bg-white/50 border-[#EFECE6] text-[#717E71]'
              }`}
            >
              {/* Desktop Connecting Line */}
              {idx < steps.length - 1 && (
                <div
                  className={`hidden sm:block absolute top-7 -right-3.5 w-3.5 h-0.5 z-10 ${
                    steps[idx + 1].completed
                      ? 'bg-[#2E7D32]'
                      : steps[idx + 1].isDanger
                      ? 'bg-rose-500'
                      : 'bg-[#DCD8CF]'
                  }`}
                />
              )}

              {/* Step Header with Icon & Step Title */}
              <div className="flex items-center gap-2 pb-1.5 border-b border-[#EAE5DB]/60">
                <div className="shrink-0">
                  {step.isDanger ? (
                    <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs shadow-xs">
                      <Ban className="w-3.5 h-3.5" />
                    </div>
                  ) : step.completed ? (
                    <div className="w-6 h-6 rounded-full bg-[#2E7D32] text-white flex items-center justify-center text-xs shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  ) : step.active ? (
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs shadow-xs animate-pulse">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#EFECE6] text-[#8C988C] flex items-center justify-center font-mono text-[10px] font-bold">
                      {step.stepNum}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <span className="text-[9px] font-mono text-[#717E71] uppercase tracking-wider block leading-none">
                    Step {step.stepNum}
                  </span>
                  <h5
                    className={`font-bold text-xs truncate ${
                      step.isDanger ? 'text-rose-950 font-extrabold' : 'text-[#181F18]'
                    }`}
                  >
                    {step.title}
                  </h5>
                </div>
              </div>

              {/* Timestamp Badge (Like Flipkart "Sun, 11th Oct '26 • 9:08am") */}
              <div className="pt-2 pb-1.5">
                <span
                  className={`inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    step.isDanger
                      ? 'bg-rose-200/90 text-rose-900 border border-rose-300'
                      : step.completed
                      ? 'bg-emerald-50 text-[#1B5E20] border border-emerald-200'
                      : step.active
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-[#F2EEE6] text-[#717E71]'
                  }`}
                >
                  {step.timestamp}
                </span>
              </div>

              {/* Sub-Events List (Flipkart Style Bullet Journey) */}
              <div className="space-y-1 text-[11px] pt-1">
                {step.subEvents.map((evt, eIdx) => (
                  <div
                    key={eIdx}
                    className={`flex items-start gap-1.5 leading-snug ${
                      step.isDanger
                        ? 'text-rose-900'
                        : step.completed
                        ? 'text-[#3D4A3D]'
                        : 'text-[#717E71]'
                    }`}
                  >
                    <span
                      className={`text-[10px] shrink-0 mt-0.5 ${
                        step.isDanger ? 'text-rose-600' : 'text-[#2E7D32]'
                      }`}
                    >
                      ●
                    </span>
                    <span className="truncate">{evt}</span>
                  </div>
                ))}
              </div>

              {/* Stage Note / Admin Reason with "See more" / "See less" Button */}
              {step.note && (
                <div
                  className={`mt-2.5 p-2 rounded-lg text-[11px] border ${
                    step.noteType === 'danger'
                      ? 'bg-white border-rose-300 text-rose-950 shadow-2xs'
                      : step.noteType === 'user'
                      ? 'bg-blue-50/80 border-blue-200 text-blue-950 shadow-2xs'
                      : 'bg-emerald-50/80 border-emerald-200 text-emerald-950 shadow-2xs'
                  }`}
                >
                  <div
                    className={`flex items-center gap-1 font-bold text-[10px] uppercase font-mono tracking-wider mb-0.5 ${
                      step.noteType === 'danger'
                        ? 'text-rose-800'
                        : step.noteType === 'user'
                        ? 'text-blue-800'
                        : 'text-[#2E7D32]'
                    }`}
                  >
                    {step.noteType === 'user' ? (
                      <User className="w-3 h-3 shrink-0" />
                    ) : step.noteType === 'danger' ? (
                      <Ban className="w-3 h-3 shrink-0" />
                    ) : (
                      <ShieldCheck className="w-3 h-3 shrink-0" />
                    )}
                    <span>{step.noteLabel}:</span>
                  </div>
                  <ExpandableText
                    text={step.note}
                    maxLen={55}
                    isDanger={step.noteType === 'danger'}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
