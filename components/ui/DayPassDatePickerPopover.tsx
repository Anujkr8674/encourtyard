'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { DayPassCalendar } from './DayPassCalendar';

interface DayPassDatePickerPopoverProps {
  children: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
  onDateSelected?: (dateStr: string) => void;
}

export function DayPassDatePickerPopover({
  children,
  align = 'center',
  className = '',
  onDateSelected,
}: DayPassDatePickerPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popoverWidth = window.innerWidth < 640 ? 300 : 330;
    const popoverHeight = 360;

    let top = rect.bottom + 8;
    // If popover would extend off the bottom of the viewport on short screens, flip above if space permits
    if (top + popoverHeight > window.innerHeight && rect.top > popoverHeight + 16) {
      top = rect.top - popoverHeight - 8;
    }

    let left = rect.left + rect.width / 2 - popoverWidth / 2;
    if (align === 'left') {
      left = rect.left;
    } else if (align === 'right') {
      left = rect.right - popoverWidth;
    }

    // Clamp horizontally to stay completely within viewport
    const padding = 12;
    left = Math.max(padding, Math.min(left, window.innerWidth - popoverWidth - padding));

    setCoords({ top, left });
  }, [align]);

  // Update position on open, scroll, or resize
  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);

    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [isOpen, updatePosition]);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        popoverRef.current &&
        !popoverRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectDate = (dateYmd: string) => {
    setIsOpen(false);
    if (onDateSelected) {
      onDateSelected(dateYmd);
    } else {
      router.push(
        `/book-space?plan=day-pass&date=${encodeURIComponent(dateYmd)}&startTime=${encodeURIComponent('09:00 AM')}&endTime=${encodeURIComponent('06:00 PM')}`
      );
    }
  };

  return (
    <div ref={triggerRef} className={`relative inline-block ${className}`}>
      {/* Trigger: Wraps children and toggles popover */}
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
      >
        {children}
      </div>

      {/* Calendar Popover rendered via Portal directly to body with z-[99999] so it is NEVER behind or overlapped */}
      {mounted &&
        isOpen &&
        createPortal(
          <div
            ref={popoverRef}
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              zIndex: 99999,
            }}
            className="w-[300px] sm:w-[330px] max-w-[calc(100vw-24px)] animate-fadeIn drop-shadow-2xl"
          >
            <DayPassCalendar
              onSelectDate={handleSelectDate}
              onCancel={() => setIsOpen(false)}
              showTitle={true}
            />
          </div>,
          document.body
        )}
    </div>
  );
}
