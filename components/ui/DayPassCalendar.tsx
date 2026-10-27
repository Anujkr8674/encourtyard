'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Clock, ArrowRight } from 'lucide-react';

interface DayPassCalendarProps {
  onSelectDate: (dateStr: string) => void;
  selectedDate?: string;
  onCancel?: () => void;
  className?: string;
  showTitle?: boolean;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEKDAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function DayPassCalendar({
  onSelectDate,
  selectedDate: initialSelected,
  onCancel,
  className = '',
  showTitle = true,
}: DayPassCalendarProps) {
  // Safe Date parsing (YYYY-MM-DD)
  const parseDate = useCallback((dateStr?: string) => {
    if (!dateStr) {
      const now = new Date();
      return { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() };
    }
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return { year, month, day };
      }
    }
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() };
  }, []);

  const formatYMD = (y: number, m: number, d: number) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  const today = useMemo(() => {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate(),
      ymd: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
    };
  }, []);

  const init = useMemo(() => parseDate(initialSelected || today.ymd), [initialSelected, today.ymd, parseDate]);
  const [navYear, setNavYear] = useState<number>(init.year);
  const [navMonth, setNavMonth] = useState<number>(init.month);
  const [selectedYMD, setSelectedYMD] = useState<string>(initialSelected || today.ymd);
  const [confirmingDate, setConfirmingDate] = useState<string | null>(null);

  // Month navigation
  const canGoPrev = useMemo(() => {
    if (navYear < today.year) return false;
    if (navYear === today.year && navMonth <= today.month) return false;
    return true;
  }, [navYear, navMonth, today]);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canGoPrev) return;
    if (navMonth === 0) {
      setNavMonth(11);
      setNavYear((prev) => prev - 1);
    } else {
      setNavMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navMonth === 11) {
      setNavMonth(0);
      setNavYear((prev) => prev + 1);
    } else {
      setNavMonth((prev) => prev + 1);
    }
  };

  // Build calendar days
  const calendarDays = useMemo(() => {
    const firstDayOfWeek = new Date(navYear, navMonth, 1).getDay();
    const daysInMonth = new Date(navYear, navMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(navYear, navMonth, 0).getDate();

    const days: Array<{
      day: number;
      month: number;
      year: number;
      ymd: string;
      isCurrentMonth: boolean;
      isDisabled: boolean;
      isSelected: boolean;
      isToday: boolean;
    }> = [];

    // Prev month padding
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const m = navMonth === 0 ? 11 : navMonth - 1;
      const y = navMonth === 0 ? navYear - 1 : navYear;
      const ymd = formatYMD(y, m, d);
      days.push({
        day: d,
        month: m,
        year: y,
        ymd,
        isCurrentMonth: false,
        isDisabled: ymd < today.ymd,
        isSelected: ymd === selectedYMD,
        isToday: ymd === today.ymd,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const ymd = formatYMD(navYear, navMonth, d);
      days.push({
        day: d,
        month: navMonth,
        year: navYear,
        ymd,
        isCurrentMonth: true,
        isDisabled: ymd < today.ymd,
        isSelected: ymd === selectedYMD,
        isToday: ymd === today.ymd,
      });
    }

    // Next month padding to fill complete weeks (multiples of 7)
    const totalCells = Math.ceil(days.length / 7) * 7;
    const remaining = totalCells - days.length;
    for (let d = 1; d <= remaining; d++) {
      const m = navMonth === 11 ? 0 : navMonth + 1;
      const y = navMonth === 11 ? navYear + 1 : navYear;
      const ymd = formatYMD(y, m, d);
      days.push({
        day: d,
        month: m,
        year: y,
        ymd,
        isCurrentMonth: false,
        isDisabled: ymd < today.ymd,
        isSelected: ymd === selectedYMD,
        isToday: ymd === today.ymd,
      });
    }

    return days;
  }, [navYear, navMonth, selectedYMD, today.ymd]);

  // Handle day selection
  const handleSelectDay = (ymd: string) => {
    setSelectedYMD(ymd);
    setConfirmingDate(ymd);
    // Smooth fast feedback then navigate
    setTimeout(() => {
      onSelectDate(ymd);
    }, 180);
  };

  const handleChooseToday = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleSelectDay(today.ymd);
  };

  const handleManualConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedYMD) {
      onSelectDate(selectedYMD);
    }
  };

  // Format chosen date for label e.g. "Thu, 24 Oct"
  const formattedSelectedLabel = useMemo(() => {
    if (!selectedYMD) return '';
    const [y, m, d] = selectedYMD.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  }, [selectedYMD]);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`bg-white text-[#181F18] font-sans rounded-2xl sm:rounded-3xl p-4 sm:p-5 select-none shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-[#DDD7CA] ${className}`}
    >
      {/* Optional Header Banner */}
      {showTitle && (
        <div className="pb-3 mb-3 border-b border-[#EAE5DB]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" />
              <span className="text-xs sm:text-sm font-serif font-bold text-[#181F18]">
                Select Day Pass Date
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EBF3EB] text-[#2E7D32] text-[10px] font-mono font-bold">
              <Sparkles className="w-2.5 h-2.5" />
              <span>1-Day Pass</span>
            </span>
          </div>
          {/* Default time badge as requested: between 9:00 AM to 6:00 PM */}
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#5C665C]">
            <Clock className="w-3 h-3 text-[#2E7D32]" />
            <span>Pass Hours: <strong className="text-[#181F18] font-semibold">9:00 AM – 6:00 PM</strong></span>
          </div>
        </div>
      )}

      {/* Month & Year Navigation Row */}
      <div className="flex items-center justify-between py-1.5 px-0.5 mb-1.5">
        <button
          type="button"
          onClick={handlePrevMonth}
          disabled={!canGoPrev}
          className={`p-1.5 rounded-lg text-[#181F18] transition-colors cursor-pointer ${
            canGoPrev ? 'hover:bg-[#EAE5DB]' : 'opacity-25 cursor-not-allowed text-[#A0A0A0]'
          }`}
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-xs sm:text-sm font-serif font-bold text-[#181F18]">
          {MONTH_NAMES[navMonth]} {navYear}
        </span>

        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1.5 rounded-lg hover:bg-[#EAE5DB] text-[#181F18] transition-colors cursor-pointer"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {WEEKDAY_NAMES.map((w, idx) => (
          <span
            key={idx}
            className="text-[10px] font-mono font-bold text-[#738273] py-0.5"
          >
            {w}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {calendarDays.map((d, idx) => {
          let dayClass = 'text-[#181F18] hover:bg-[#EBF3EB] hover:text-[#2E7D32]';
          if (d.isDisabled) {
            dayClass = 'text-[#C5BEB2] cursor-not-allowed opacity-35 hover:bg-transparent';
          } else if (d.isSelected || confirmingDate === d.ymd) {
            dayClass = 'bg-[#2E7D32] text-white font-bold shadow-sm scale-105';
          } else if (!d.isCurrentMonth) {
            dayClass = 'text-[#A0A0A0] hover:bg-[#EAE5DB]';
          } else if (d.isToday) {
            dayClass = 'border border-[#2E7D32] text-[#2E7D32] font-bold hover:bg-[#EBF3EB]';
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={d.isDisabled}
              onClick={() => handleSelectDay(d.ymd)}
              className={`w-7 h-7 sm:w-8 sm:h-8 mx-auto rounded-full text-xs font-sans flex items-center justify-center transition-all cursor-pointer ${dayClass}`}
            >
              {d.day}
            </button>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#EAE5DB]">
        <button
          type="button"
          onClick={handleChooseToday}
          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#2E7D32] hover:bg-[#EBF3EB] transition-colors cursor-pointer"
        >
          Today
        </button>

        <div className="flex items-center gap-1.5">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#5C665C] hover:bg-[#EAE5DB] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={handleManualConfirm}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#2E7D32] hover:bg-[#1E5C23] text-white shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <span>{formattedSelectedLabel || 'Continue'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
