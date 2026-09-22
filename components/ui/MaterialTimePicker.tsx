'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, Keyboard } from 'lucide-react';

interface MaterialTimePickerProps {
  value: string; // e.g. "07:00 AM", "09:30 PM"
  onChange: (value: string) => void;
  align?: 'right' | 'left' | 'center';
  className?: string;
  disabled?: boolean;
}

export function MaterialTimePicker({
  value,
  onChange,
  align = 'right',
  className = '',
  disabled = false,
}: MaterialTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Parse incoming value e.g. "07:00 AM" or "19:00" or fallback to default
  const parseTime = useCallback((val: string) => {
    let hour = 9;
    let minute = 0;
    let period: 'AM' | 'PM' = 'AM';

    if (val) {
      const match = val.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (match) {
        hour = parseInt(match[1], 10);
        minute = parseInt(match[2], 10);
        if (match[3]) {
          period = match[3].toUpperCase() as 'AM' | 'PM';
        } else if (hour >= 12) {
          period = 'PM';
          if (hour > 12) hour -= 12;
        } else if (hour === 0) {
          hour = 12;
          period = 'AM';
        }
      }
    }
    if (hour < 1 || hour > 12) hour = 12;
    if (minute < 0 || minute > 59) minute = 0;
    return { hour, minute, period };
  }, []);

  // Temporary selection state when popover is open
  const [tempHour, setTempHour] = useState<number>(9);
  const [tempMinute, setTempMinute] = useState<number>(0);
  const [tempPeriod, setTempPeriod] = useState<'AM' | 'PM'>('AM');
  const [viewMode, setViewMode] = useState<'hours' | 'minutes'>('hours');
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);

  // Sync temp state when opening
  useEffect(() => {
    if (isOpen) {
      const parsed = parseTime(value);
      setTempHour(parsed.hour);
      setTempMinute(parsed.minute);
      setTempPeriod(parsed.period);
      setViewMode('hours');
      setIsKeyboardMode(false);
    }
  }, [isOpen, value, parseTime]);

  // Click outside to close without full-screen backdrop
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

  // Format single/double digit helper
  const padZero = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  // Formatted display strings
  const formattedHour = padZero(tempHour);
  const formattedMinute = padZero(tempMinute);

  // Dial Geometry for 190px diameter face
  const DIAL_RADIUS = 70; // Radius of number centers in px
  const CENTER_OFFSET = 95; // Center X & Y inside 190px container

  // Handle pointer/touch interaction on clock face
  const handleClockInteraction = useCallback(
    (clientX: number, clientY: number, isFinal: boolean = false) => {
      if (!clockRef.current) return;
      const rect = clockRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = clientX - centerX;
      const dy = clientY - centerY;

      // Calculate angle from 12 o'clock (0 to 360 deg)
      let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      if (angle < 0) angle += 360;

      if (viewMode === 'hours') {
        let hour = Math.round(angle / 30);
        if (hour === 0) hour = 12;
        if (hour > 12) hour = 12;
        setTempHour(hour);

        if (isFinal) {
          // Auto switch to minute view after selecting hour
          setTimeout(() => {
            setViewMode('minutes');
          }, 150);
        }
      } else {
        let minute = Math.round(angle / 6) % 60;
        setTempMinute(minute);
      }
    },
    [viewMode]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    handleClockInteraction(e.clientX, e.clientY, false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    handleClockInteraction(e.clientX, e.clientY, false);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    handleClockInteraction(e.clientX, e.clientY, true);
  };

  // Close on Cancel
  const handleCancel = () => {
    setIsOpen(false);
  };

  // Save on OK
  const handleConfirm = () => {
    const timeStr = `${padZero(tempHour)}:${padZero(tempMinute)} ${tempPeriod}`;
    onChange(timeStr);
    setIsOpen(false);
  };

  // Pointer angles
  const hourAngle = (tempHour % 12) * 30;
  const minuteAngle = tempMinute * 6;
  const currentAngle = viewMode === 'hours' ? hourAngle : minuteAngle;

  // Alignment classes
  const alignmentClass =
    align === 'left'
      ? 'left-0'
      : align === 'center'
        ? 'left-1/2 -translate-x-1/2'
        : 'right-0';

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Interactive Trigger Button matching Date input height & style */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 flex items-center gap-2 px-3 py-2 rounded-xl bg-white hover:bg-[#FAF9F5] border border-[#E5E1D8] text-xs font-mono font-medium text-[#6200EE] transition-colors focus:outline-none focus:border-[#6200EE] cursor-pointer text-left select-none shadow-2xs group"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <Clock className="w-4 h-4 text-[#6200EE] group-hover:scale-110 transition-transform shrink-0" />
        <span className="flex-1 truncate">{value || '09:00 AM'}</span>
      </button>

      {/* Material Design Time Picker In-Place Dropdown Popover */}
      {isOpen && (
        <div
          className={`absolute top-[calc(100%+8px)] ${alignmentClass} z-50 bg-[#FAF9F5] rounded-2xl shadow-[0_16px_40px_rgba(26,38,26,0.2)] border border-[#E5E1D8] w-[260px] p-3.5 text-[#6200EE] font-sans flex flex-col items-center animate-in fade-in zoom-in-95 duration-150 select-none`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header: SELECT TIME label */}
          <div className="w-full flex items-center justify-between pb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#5C665C] font-bold">
              SELECT TIME
            </span>
          </div>

          {/* Digital Display Section */}
          <div className="w-full flex items-center justify-center gap-1.5 mb-3">
            {/* Hours Box */}
            <button
              type="button"
              onClick={() => {
                setViewMode('hours');
                setIsKeyboardMode(false);
              }}
              className={`w-15 h-13 rounded-xl flex items-center justify-center text-3xl font-sans transition-all cursor-pointer border ${viewMode === 'hours' && !isKeyboardMode
                  ? 'bg-[#E3EBE3] text-[#6200EE] font-medium border-[#6200EE]/30 shadow-xs'
                  : 'bg-[#F2EEE7] text-[#6200EE] font-light border-transparent hover:bg-[#EAE5DB]'
                }`}
            >
              {formattedHour}
            </button>

            {/* Colon Separator */}
            <span className="text-3xl font-sans font-bold text-[#6200EE] pb-1">:</span>

            {/* Minutes Box */}
            <button
              type="button"
              onClick={() => {
                setViewMode('minutes');
                setIsKeyboardMode(false);
              }}
              className={`w-15 h-13 rounded-xl flex items-center justify-center text-3xl font-sans transition-all cursor-pointer border ${viewMode === 'minutes' && !isKeyboardMode
                  ? 'bg-[#E3EBE3] text-[#6200EE] font-medium border-[#6200EE]/30 shadow-xs'
                  : 'bg-[#F2EEE7] text-[#6200EE] font-light border-transparent hover:bg-[#EAE5DB]'
                }`}
            >
              {formattedMinute}
            </button>

            {/* AM / PM Segmented Control */}
            <div className="flex flex-col rounded-lg border border-[#E5E1D8] overflow-hidden ml-1">
              <button
                type="button"
                onClick={() => setTempPeriod('AM')}
                className={`px-2.5 py-1 text-[11px] font-bold font-sans transition-colors cursor-pointer border-b border-[#E5E1D8] ${tempPeriod === 'AM'
                    ? 'bg-[#6200EE] text-white'
                    : 'bg-white text-[#5C665C] hover:bg-[#F2EEE7]'
                  }`}
              >
                AM
              </button>
              <button
                type="button"
                onClick={() => setTempPeriod('PM')}
                className={`px-2.5 py-1 text-[11px] font-bold font-sans transition-colors cursor-pointer ${tempPeriod === 'PM'
                    ? 'bg-[#6200EE] text-white'
                    : 'bg-white text-[#5C665C] hover:bg-[#F2EEE7]'
                  }`}
              >
                PM
              </button>
            </div>
          </div>

          {/* Middle Section: Analog Clock Dial (190px diameter) or Keyboard Input */}
          {!isKeyboardMode ? (
            <div
              ref={clockRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="relative w-[190px] h-[190px] rounded-full bg-[#EAE5DB] shadow-inner flex items-center justify-center cursor-pointer touch-none mb-3"
            >
              {/* Center Pivot Dot */}
              <div className="absolute w-2 h-2 rounded-full bg-[#6200EE] z-20 pointer-events-none" />

              {/* Clock Hand / Pointer */}
              <div
                className="absolute bottom-1/2 left-1/2 origin-bottom pointer-events-none transition-transform duration-75"
                style={{
                  height: `${DIAL_RADIUS}px`,
                  width: '2px',
                  backgroundColor: '#6200EE',
                  transform: `translateX(-50%) rotate(${currentAngle}deg)`,
                }}
              >
                {/* Selected Indicator Bubble at End of Hand - pure background disc with no duplicate rotated text */}
                <div className="absolute -top-3.5 -left-3.5 w-7 h-7 rounded-full bg-[#6200EE] shadow-md flex items-center justify-center z-30 pointer-events-none">
                  {/* Small white dot if minute selected is not an exact 5-min interval */}
                  {viewMode === 'minutes' && tempMinute % 5 !== 0 && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white pointer-events-none" />
                  )}
                </div>
              </div>

              {/* Dial Numbers: Hour Mode (1 to 12) */}
              {viewMode === 'hours' && (
                <>
                  {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((hour) => {
                    const angle = (hour * 30 - 90) * (Math.PI / 180);
                    const x = CENTER_OFFSET + DIAL_RADIUS * Math.cos(angle);
                    const y = CENTER_OFFSET + DIAL_RADIUS * Math.sin(angle);
                    const isSelected = tempHour === hour;

                    return (
                      <span
                        key={hour}
                        style={{
                          left: `${x}px`,
                          top: `${y}px`,
                          transform: 'translate(-50%, -50%)',
                        }}
                        className={`absolute text-xs select-none pointer-events-none transition-colors ${isSelected ? 'text-white font-bold z-40' : 'text-[#6200EE] font-medium'
                          }`}
                      >
                        {hour}
                      </span>
                    );
                  })}
                </>
              )}

              {/* Dial Numbers: Minute Mode (00, 05, 10 ... 55) */}
              {viewMode === 'minutes' && (
                <>
                  {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((minute) => {
                    const angle = (minute * 6 - 90) * (Math.PI / 180);
                    const x = CENTER_OFFSET + DIAL_RADIUS * Math.cos(angle);
                    const y = CENTER_OFFSET + DIAL_RADIUS * Math.sin(angle);
                    const isSelected = tempMinute === minute;

                    return (
                      <span
                        key={minute}
                        style={{
                          left: `${x}px`,
                          top: `${y}px`,
                          transform: 'translate(-50%, -50%)',
                        }}
                        className={`absolute text-[11px] select-none pointer-events-none transition-colors ${isSelected ? 'text-white font-bold z-40' : 'text-[#6200EE] font-medium'
                          }`}
                      >
                        {padZero(minute)}
                      </span>
                    );
                  })}
                </>
              )}
            </div>
          ) : (
            /* Keyboard Manual Number Input Mode */
            <div className="w-[190px] h-[190px] flex flex-col items-center justify-center gap-3 bg-[#F2EEE7] rounded-2xl p-3 mb-3 border border-[#E5E1D8]">
              <span className="text-[10px] text-[#5C665C] font-mono">ENTER TIME (12-HR)</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={tempHour}
                  onChange={(e) => {
                    let val = parseInt(e.target.value, 10);
                    if (isNaN(val)) val = 1;
                    if (val > 12) val = 12;
                    if (val < 1) val = 1;
                    setTempHour(val);
                  }}
                  className="w-13 h-11 bg-white border border-[#E5E1D8] rounded-xl text-center text-xl font-mono text-[#6200EE] focus:outline-none focus:border-[#6200EE]"
                />
                <span className="text-xl font-bold text-[#6200EE]">:</span>
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={tempMinute}
                  onChange={(e) => {
                    let val = parseInt(e.target.value, 10);
                    if (isNaN(val)) val = 0;
                    if (val > 59) val = 59;
                    if (val < 0) val = 0;
                    setTempMinute(val);
                  }}
                  className="w-13 h-11 bg-white border border-[#E5E1D8] rounded-xl text-center text-xl font-mono text-[#6200EE] focus:outline-none focus:border-[#6200EE]"
                />
              </div>
            </div>
          )}

          {/* Bottom Bar: Keyboard Toggle + Cancel + OK */}
          <div className="w-full flex items-center justify-between pt-2 border-t border-[#E5E1D8]">
            <button
              type="button"
              onClick={() => setIsKeyboardMode(!isKeyboardMode)}
              className="p-1.5 rounded-lg hover:bg-[#E3EBE3] text-[#5C665C] hover:text-[#6200EE] transition-colors cursor-pointer"
              title={isKeyboardMode ? 'Switch to Clock Dial' : 'Switch to Keyboard Input'}
            >
              <Keyboard className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#6200EE] hover:bg-[#E3EBE3] transition-colors cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#6200EE] hover:bg-[#6200EE] text-white shadow-xs transition-colors cursor-pointer"
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

