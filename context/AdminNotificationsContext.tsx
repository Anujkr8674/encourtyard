'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { AdminNotification } from '@/app/api/admin/notifications/route';

interface AdminNotificationsContextType {
  notifications: AdminNotification[];
  latest10: AdminNotification[];
  unreadCount: number;
  loading: boolean;
  isWebSocketConnected: boolean;
  markAsRead: (id: string, e?: React.MouseEvent) => void;
  markAllAsRead: () => void;
  clearReadNotifications: () => void;
  refresh: () => Promise<void>;
}

const AdminNotificationsContext = createContext<AdminNotificationsContextType | undefined>(undefined);

const STORAGE_KEY = 'encourtyard_admin_read_notifications';

export const AdminNotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);

  // Load read IDs from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setReadIds(new Set(parsed));
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored read notification IDs:', e);
    }
  }, []);

  // Fetch notifications from API
  const fetchNotifications = useCallback(async (currentReadIds?: Set<string>) => {
    try {
      const idsToUse = currentReadIds || readIds;
      const idsParam = Array.from(idsToUse).join(',');
      const res = await fetch(`/api/admin/notifications?readIds=${encodeURIComponent(idsParam)}`, {
        cache: 'no-store',
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error('Failed to fetch admin notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [readIds]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Mark single notification as read
  const markAsRead = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setReadIds((prev) => {
      const updated = new Set(prev);
      updated.add(id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(updated)));
      } catch (err) {
        console.warn('Could not persist read IDs:', err);
      }
      return updated;
    });

    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    const allIds = notifications.map((n) => n.id);
    const updated = new Set([...Array.from(readIds), ...allIds]);
    setReadIds(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(updated)));
    } catch (err) {
      console.warn('Could not persist read IDs:', err);
    }
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  }, [notifications, readIds]);

  // Clear read notifications from list view
  const clearReadNotifications = useCallback(() => {
    setNotifications((prev) => prev.filter((item) => !item.isRead));
  }, []);

  // Set up Supabase Realtime WebSocket Connection
  useEffect(() => {
    let channel: any = null;
    try {
      channel = supabase
        .channel('admin-realtime-notifications')
        // 1. Listen for new bookings inserted
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'bookings' },
          (payload) => {
            const newBooking = payload.new as any;
            const notifId = `booking-${newBooking.id}`;
            const customerName = newBooking.fullName || newBooking.companyName || newBooking.email || 'Customer';
            const spaceName = newBooking.workspaceTitle || newBooking.spaceType || 'Workspace';

            const incoming: AdminNotification = {
              id: notifId,
              type: 'NEW_BOOKING',
              title: newBooking.status === 'CONFIRMED' ? 'Confirmed Booking' : 'New Booking Request',
              message: `${customerName} placed a booking for ${spaceName} (${newBooking.plan || 'Standard'}).`,
              time: (newBooking.createdAt || new Date()).toISOString?.() || new Date().toISOString(),
              timeAgo: 'Just now',
              targetUrl: '/admin/bookings',
              isRead: false,
              priority: 'high',
              metadata: { bookingId: newBooking.id, status: newBooking.status },
            };

            setNotifications((prev) => [incoming, ...prev.filter((n) => n.id !== notifId)]);
          }
        )
        // 2. Listen for booking status updates (Cancellations, Confirmations, Payments)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'bookings' },
          (payload) => {
            const updatedBooking = payload.new as any;
            if (updatedBooking.status === 'CANCELLED') {
              const notifId = `cancel-${updatedBooking.id}`;
              const incoming: AdminNotification = {
                id: notifId,
                type: 'BOOKING_CANCELLED',
                title: 'Booking Cancelled',
                message: `Booking #${updatedBooking.id?.slice(0, 8)} was cancelled.`,
                time: new Date().toISOString(),
                timeAgo: 'Just now',
                targetUrl: '/admin/bookings',
                isRead: false,
                priority: 'high',
                metadata: { bookingId: updatedBooking.id },
              };
              setNotifications((prev) => [incoming, ...prev.filter((n) => n.id !== notifId)]);
            } else if (updatedBooking.paymentStatus === 'PAID') {
              const notifId = `pay-${updatedBooking.id}`;
              const incoming: AdminNotification = {
                id: notifId,
                type: 'PAYMENT_RECEIVED',
                title: 'Payment Received',
                message: `Payment of ₹${Number(updatedBooking.totalAmount || 0).toLocaleString('en-IN')} confirmed for #${updatedBooking.id?.slice(0, 8)}.`,
                time: new Date().toISOString(),
                timeAgo: 'Just now',
                targetUrl: '/admin/bookings',
                isRead: false,
                priority: 'info',
                metadata: { bookingId: updatedBooking.id },
              };
              setNotifications((prev) => [incoming, ...prev.filter((n) => n.id !== notifId)]);
            } else {
              // General update, refresh full list
              fetchNotifications();
            }
          }
        )
        // 3. Listen for Workspace updates (Inventory changes)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'workspaces' },
          () => {
            fetchNotifications();
          }
        )
        // 4. Listen for User registrations (New Members)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'users' },
          (payload) => {
            const newUser = payload.new as any;
            const notifId = `user-${newUser.id}`;
            const incoming: AdminNotification = {
              id: notifId,
              type: 'NEW_MEMBER',
              title: 'New Member Registered',
              message: `${newUser.name || 'A user'} (${newUser.email}) joined the workspace community.`,
              time: new Date().toISOString(),
              timeAgo: 'Just now',
              targetUrl: '/admin/members',
              isRead: false,
              priority: 'info',
              metadata: { userId: newUser.id },
            };
            setNotifications((prev) => [incoming, ...prev.filter((n) => n.id !== notifId)]);
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setIsWebSocketConnected(true);
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            setIsWebSocketConnected(false);
          }
        });
    } catch (err) {
      console.warn('Realtime WebSocket subscription warning:', err);
    }

    // Heartbeat sync every 25 seconds as backup
    const heartbeat = setInterval(() => {
      fetchNotifications();
    }, 25000);

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
      clearInterval(heartbeat);
    };
  }, [fetchNotifications]);

  const latest10 = useMemo(() => notifications.slice(0, 10), [notifications]);
  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  return (
    <AdminNotificationsContext.Provider
      value={{
        notifications,
        latest10,
        unreadCount,
        loading,
        isWebSocketConnected,
        markAsRead,
        markAllAsRead,
        clearReadNotifications,
        refresh: () => fetchNotifications(),
      }}
    >
      {children}
    </AdminNotificationsContext.Provider>
  );
};

export const useAdminNotifications = () => {
  const context = useContext(AdminNotificationsContext);
  if (!context) {
    throw new Error('useAdminNotifications must be used within an AdminNotificationsProvider');
  }
  return context;
};
