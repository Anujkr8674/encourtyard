'use client';

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

// BroadcastChannel name for instant cross-tab communication
const BOOKINGS_BROADCAST_CHANNEL = 'encourtyard_bookings_realtime';

/**
 * Broadcasts an instant update notification to all open tabs and windows
 */
export function notifyBookingChange() {
  if (typeof window === 'undefined') return;

  // 1. Cross-tab BroadcastChannel
  try {
    const bc = new BroadcastChannel(BOOKINGS_BROADCAST_CHANNEL);
    bc.postMessage({ type: 'BOOKING_CHANGED', timestamp: Date.now() });
    bc.close();
  } catch {
    // BroadcastChannel unsupported fallback
  }

  // 2. Same-window custom event dispatch
  try {
    window.dispatchEvent(new CustomEvent('encourtyard:booking_changed', { detail: { timestamp: Date.now() } }));
  } catch {
    // Ignore
  }
}

/**
 * React hook that connects via WebSockets (Supabase Realtime Channel)
 * and BroadcastChannel to receive instant updates without page refresh.
 */
export function useRealtimeBookings(onUpdate: () => void, intervalMs: number = 4000) {
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let broadcastChannel: BroadcastChannel | null = null;

    // 1. Supabase WebSocket Subscription
    try {
      channel = supabase
        .channel('public:bookings')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'bookings' },
          () => {
            onUpdateRef.current();
          }
        )
        .subscribe();
    } catch (err) {
      console.warn('Realtime websocket subscription warning:', err);
    }

    // 2. Cross-tab BroadcastChannel listener (Instant 0ms sync)
    try {
      broadcastChannel = new BroadcastChannel(BOOKINGS_BROADCAST_CHANNEL);
      broadcastChannel.onmessage = (event) => {
        if (event.data?.type === 'BOOKING_CHANGED') {
          onUpdateRef.current();
        }
      };
    } catch {
      // Ignore
    }

    // 3. Same-window custom event listener
    const handleCustomEvent = () => {
      onUpdateRef.current();
    };
    window.addEventListener('encourtyard:booking_changed', handleCustomEvent);

    // 4. Window focus & visibility sync
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        onUpdateRef.current();
      }
    };
    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    // 5. Lightweight background polling fallback (every intervalMs)
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        onUpdateRef.current();
      }
    }, intervalMs);

    return () => {
      clearInterval(timer);
      window.removeEventListener('encourtyard:booking_changed', handleCustomEvent);
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);

      if (broadcastChannel) {
        broadcastChannel.close();
      }
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [intervalMs]);
}
