'use client';

import React, { useState, useEffect } from 'react';

interface CountdownBadgeProps {
  targetTimestamp: number | undefined;
  className?: string;
}

export function CountdownBadge({ targetTimestamp, className }: CountdownBadgeProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!targetTimestamp) return;

    const updateCountdown = () => {
      const now = Date.now();
      const diff = targetTimestamp - now;

      if (diff <= 0) {
        setTimeLeft('Available Soon');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(`Available in ${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`Available in ${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`Available in ${minutes}m ${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetTimestamp]);

  if (!targetTimestamp) {
    return (
      <span className={`px-4 py-1.5 rounded-full bg-red-600 text-white text-xs font-mono font-bold shadow-md ${className || ''}`}>
        Already Booked
      </span>
    );
  }

  return (
    <span className={`px-4 py-1.5 rounded-full bg-red-600 text-white text-xs font-mono font-bold shadow-md flex items-center gap-1.5 ${className || ''}`}>
      <span className="w-2 h-2 rounded-full bg-white/40 animate-pulse" />
      {timeLeft || 'Already Booked'}
    </span>
  );
}
