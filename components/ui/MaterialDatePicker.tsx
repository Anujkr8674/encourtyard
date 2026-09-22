'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface MaterialDatePickerProps {
  value: string; // "YYYY-MM-DD" format e.g. "2026-09-22"
  onChange: (value: string) => void;
  minDate?: string; // "YYYY-MM-DD"
  align?: 'left' | 'right' | 'center';
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function MaterialDatePicker({
  value,
  onChange,
  minDate,
  align = 'left',
  className = '',
  disabled = false,
  placeholder = 'Select date',
}: MaterialDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse YYYY-MM-DD safely into Year, Month (0-indexed), Day
  const parseDate = useCallback((dateStr: string) => {
    if (!dateStr) {
      const now = new Date();
      return {
        year: now.getFullYear(),
        month: now.getMonth(),
        day: now.getDate(),
      };
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
    return {
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate(),
    };
  }, []);

  // Format to DD-MM-YYYY for display in input pill
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  // Helper to format Date object into YYYY-MM-DD
  const formatYMD = (y: number, m: number, d: number) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  // Temporary calendar navigation & selection state
  const initial = useMemo(() => parseDate(value), [value, parseDate]);
  const [navYear, setNavYear] = useState<number>(initial.year);
  const [navMonth, setNavMonth] = useState<number>(initial.month);
  const [selectedYMD, setSelectedYMD] = useState<string>(value || formatYMD(initial.year, initial.month, initial.day));

  // Sync state when popover opens or value changes
  useEffect(() => {
    if (isOpen) {
      const p = parseDate(value);
      setNavYear(p.year);
      setNavMonth(p.month);
      setSelectedYMD(value || formatYMD(p.year, p.month, p.day));
    }
  }, [isOpen, value, parseDate]);

  // Click outside listener
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (navMonth === 0) {
      setNavMonth(11);
      setNavYear((prev) => prev - 1);
    } else {
      setNavMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (navMonth === 11) {
      setNavMonth(0);
      setNavYear((prev) => prev + 1);
    } else {
      setNavMonth((prev) => prev + 1);
    }
  };

  // Today string for comparison
  const todayYMD = useMemo(() => {
    const now = new Date();
    return formatYMD(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  // Compute days in current calendar view
  const calendarDays = useMemo(() => {
    const firstDayOfWeek = new Date(navYear, navMonth, 1).getDay(); // 0 (Sun) to 6 (Sat)
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

    // Previous month padding days
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
        isDisabled: minDate ? ymd < minDate : false,
        isSelected: ymd === selectedYMD,
        isToday: ymd === todayYMD,
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
        isDisabled: minDate ? ymd < minDate : false,
        isSelected: ymd === selectedYMD,
        isToday: ymd === todayYMD,
      });
    }

    // Next month padding days to complete 6 weeks (or up to multiple of 7)
    const totalSlots = Math.ceil(days.length / 7) * 7;
    const remaining = totalSlots - days.length;
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
        isDisabled: minDate ? ymd < minDate : false,
        isSelected: ymd === selectedYMD,
        isToday: ymd === todayYMD,
      });
    }

    return days;
  }, [navYear, navMonth, selectedYMD, minDate, todayYMD]);

  // Select a day
  const handleSelectDay = (dayObj: typeof calendarDays[0]) => {
    if (dayObj.isDisabled) return;
    setSelectedYMD(dayObj.ymd);
    if (!dayObj.isCurrentMonth) {
      setNavMonth(dayObj.month);
      setNavYear(dayObj.year);
    }
  };

  // Confirm selection
  const handleConfirm = () => {
    onChange(selectedYMD);
    setIsOpen(false);
  };

  // Set today
  const handleSetToday = () => {
    const now = new Date();
    const ymd = formatYMD(now.getFullYear(), now.getMonth(), now.getDate());
    if (minDate && ymd < minDate) return;
    setNavYear(now.getFullYear());
    setNavMonth(now.getMonth());
    setSelectedYMD(ymd);
  };

  // Popover alignment class
  const alignmentClass =
    align === 'left'
      ? 'left-0'
      : align === 'center'
        ? 'left-1/2 -translate-x-1/2'
        : 'right-0';

  // Selected date formatted headline
  const selectedHeadline = useMemo(() => {
    if (!selectedYMD) return '';
    const parts = selectedYMD.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return selectedYMD;
  }, [selectedYMD]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Interactive Trigger Button matching Time Picker height & styling */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 flex items-center gap-2 px-3 py-2 rounded-xl bg-white hover:bg-[#FAF9F5] border border-[#E5E1D8] text-xs font-mono font-medium text-[#181F18] transition-colors focus:outline-none focus:border-[#263626] cursor-pointer text-left select-none shadow-2xs group"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <CalendarIcon className="w-4 h-4 text-[#E65100] group-hover:scale-110 transition-transform shrink-0" />
        <span className="flex-1 truncate">{formatDisplayDate(value) || placeholder}</span>
      </button>

      {/* Material Design Date Picker Dropdown Popover */}
      {isOpen && (
        <div
          className={`absolute top-[calc(100%+8px)] ${alignmentClass} z-50 bg-[#FAF9F5] rounded-2xl shadow-[0_16px_40px_rgba(26,38,26,0.2)] border border-[#E5E1D8] w-[260px] p-3 text-[#181F18] font-sans flex flex-col animate-in fade-in zoom-in-95 duration-150 select-none`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header: SELECT DATE & Selected Date Label */}
          <div className="w-full pb-2.5 border-b border-[#E5E1D8]">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#5C665C] font-bold block">
              SELECT DATE
            </span>
            <span className="text-sm font-serif font-bold text-[#181F18] mt-0.5 block truncate">
              {selectedHeadline}
            </span>
          </div>

          {/* Month & Year Navigation Row */}
          <div className="w-full flex items-center justify-between py-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-lg hover:bg-[#EAE5DB] text-[#181F18] transition-colors cursor-pointer"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-serif font-bold text-[#181F18]">
              {MONTH_NAMES[navMonth]} {navYear}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-lg hover:bg-[#EAE5DB] text-[#181F18] transition-colors cursor-pointer"
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
                className="text-[10px] font-mono font-bold text-[#5C665C] py-0.5"
              >
                {w}
              </span>
            ))}
          </div>

          {/* Days Grid (7 columns) */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {calendarDays.map((d, idx) => {
              let dayClass = 'text-[#181F18] hover:bg-[#E3EBE3]';
              if (d.isDisabled) {
                dayClass = 'text-[#D5D0C5] cursor-not-allowed opacity-40';
              } else if (d.isSelected) {
                dayClass = 'bg-[#263626] text-white font-bold shadow-xs';
              } else if (!d.isCurrentMonth) {
                dayClass = 'text-[#A0A0A0] hover:bg-[#EAE5DB]';
              } else if (d.isToday) {
                dayClass = 'border border-[#263626] text-[#263626] font-bold hover:bg-[#E3EBE3]';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={d.isDisabled}
                  onClick={() => handleSelectDay(d)}
                  className={`w-7 h-7 mx-auto rounded-full text-xs font-sans flex items-center justify-center transition-all cursor-pointer ${dayClass}`}
                >
                  {d.day}
                </button>
              );
            })}
          </div>

          {/* Bottom Action Buttons: TODAY, CANCEL, OK */}
          <div className="w-full flex items-center justify-between pt-2.5 mt-2 border-t border-[#E5E1D8]">
            <button
              type="button"
              onClick={handleSetToday}
              className="px-2 py-1 rounded-lg text-[11px] font-bold text-[#2E7D32] hover:bg-[#E8F5E9] transition-colors cursor-pointer"
            >
              TODAY
            </button>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#5C665C] hover:bg-[#EAE5DB] transition-colors cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-3 py-1 rounded-lg text-xs font-bold bg-[#263626] hover:bg-[#1A261A] text-white shadow-xs transition-colors cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
