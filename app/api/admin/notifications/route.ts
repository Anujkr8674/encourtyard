import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export interface AdminNotification {
  id: string;
  type: 'NEW_BOOKING' | 'BOOKING_CANCELLED' | 'LOW_ALERT' | 'PAYMENT_RECEIVED' | 'NEW_MEMBER' | 'NEW_INQUIRY';
  title: string;
  message: string;
  time: string;
  timeAgo: string;
  targetUrl: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'info';
  metadata?: Record<string, any>;
}

// Helper to format relative time
function getRelativeTime(dateString: string | Date): string {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return past.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const readIdsParam = url.searchParams.get('readIds') || '';
    const readIdsSet = new Set(readIdsParam ? readIdsParam.split(',') : []);

    // 1. Fetch recent bookings (last 40 bookings)
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      take: 40,
    });

    // 2. Fetch workspaces to check inventory thresholds
    const workspaces = await prisma.workspace.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    // 3. Active bookings for inventory counting
    const activeBookings = await prisma.booking.findMany({
      where: { status: { in: ['PENDING', 'CONFIRMED'] } },
      select: { workspaceId: true },
    });

    // 4. Fetch recent registered users / members (last 20)
    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // 5. Fetch recent contact inquiries (last 25)
    let recentInquiries: any[] = [];
    try {
      const { data: inqData } = await supabaseAdmin
        .from('contact_inquiries')
        .select('*')
        .order('createdAt', { ascending: false })
        .limit(25);
      if (Array.isArray(inqData)) recentInquiries = inqData;
    } catch (e) {
      console.warn('Failed to fetch inquiries for notifications:', e);
    }

    const notifications: AdminNotification[] = [];

    // Parse Low Stock Alerts
    workspaces.forEach((w) => {
      let specs: any[] = [];
      try {
        specs = typeof w.specifications === 'string' ? JSON.parse(w.specifications || '[]') : w.specifications || [];
      } catch {
        specs = [];
      }

      const totalUnitsSpec = specs.find((s: any) => s.key === 'totalUnits' || s.key === 'Total Units' || s.key === 'quantity' || s.key === 'inventory');
      const totalUnits = totalUnitsSpec ? Math.max(1, parseInt(totalUnitsSpec.value, 10) || 1) : 1;

      const alertThresholdSpec = specs.find((s: any) => s.key === 'alertThreshold' || s.key === 'Alert Threshold' || s.key === 'lowStockLimit');
      const alertThreshold = alertThresholdSpec ? Math.max(0, parseInt(alertThresholdSpec.value, 10) || 5) : 5;

      const bookedCount = activeBookings.filter((b) => b.workspaceId === w.id).length;
      const availableUnits = Math.max(0, totalUnits - bookedCount);

      if (availableUnits <= alertThreshold) {
        const notifId = `low-stock-${w.id}-${availableUnits}`;
        const isSoldOut = availableUnits === 0;
        notifications.push({
          id: notifId,
          type: 'LOW_ALERT',
          title: isSoldOut ? 'Sold Out Alert' : 'Low Inventory Alert',
          message: isSoldOut
            ? `Space "${w.title}" is completely booked! (0 units left)`
            : `Space "${w.title}" has only ${availableUnits} unit${availableUnits > 1 ? 's' : ''} left (Alert limit: ${alertThreshold}).`,
          time: (w.updatedAt || new Date()).toISOString(),
          timeAgo: getRelativeTime(w.updatedAt || new Date()),
          targetUrl: '/admin/workspaces',
          isRead: readIdsSet.has(notifId),
          priority: isSoldOut ? 'high' : 'medium',
          metadata: { workspaceId: w.id, availableUnits, alertThreshold, totalUnits },
        });
      }
    });

    // Parse Bookings into Notifications
    bookings.forEach((b) => {
      const customerName = b.fullName || b.companyName || b.email || 'Customer';
      const spaceName = b.workspaceTitle || b.spaceType || 'Workspace';

      if (b.cancellationRequested && b.status !== 'CANCELLED') {
        const notifId = `cancel-req-${b.id}`;
        notifications.push({
          id: notifId,
          type: 'BOOKING_CANCELLED',
          title: `⚠️ Cancellation Requested: ${b.bookingRef || b.id.slice(0, 8)}`,
          message: `${customerName} requested cancellation for ${spaceName}. Reason: "${b.cancellationReason || 'No reason specified'}".`,
          time: (b.cancellationRequestedAt || b.updatedAt || b.createdAt).toISOString(),
          timeAgo: getRelativeTime(b.cancellationRequestedAt || b.updatedAt || b.createdAt),
          targetUrl: '/admin/bookings',
          isRead: readIdsSet.has(notifId),
          priority: 'high',
          metadata: { bookingId: b.id, cancellationRequested: true, reason: b.cancellationReason },
        });
      }

      if (b.status === 'CANCELLED') {
        const notifId = `cancel-${b.id}`;
        notifications.push({
          id: notifId,
          type: 'BOOKING_CANCELLED',
          title: 'Booking Cancelled',
          message: `${customerName} cancelled booking #${b.id.slice(0, 8)} for ${spaceName}.`,
          time: (b.statusUpdatedAt || b.updatedAt || b.createdAt).toISOString(),
          timeAgo: getRelativeTime(b.statusUpdatedAt || b.updatedAt || b.createdAt),
          targetUrl: '/admin/bookings',
          isRead: readIdsSet.has(notifId),
          priority: 'high',
          metadata: { bookingId: b.id, status: b.status },
        });
      } else {
        const notifId = `booking-${b.id}`;
        const isConfirmed = b.status === 'CONFIRMED';
        notifications.push({
          id: notifId,
          type: 'NEW_BOOKING',
          title: isConfirmed ? 'Confirmed Booking' : 'New Booking Request',
          message: `${customerName} placed a booking for ${spaceName} (${b.plan || 'Standard'}).`,
          time: (b.createdAt || new Date()).toISOString(),
          timeAgo: getRelativeTime(b.createdAt || new Date()),
          targetUrl: '/admin/bookings',
          isRead: readIdsSet.has(notifId),
          priority: isConfirmed ? 'info' : 'medium',
          metadata: { bookingId: b.id, status: b.status, totalAmount: b.totalAmount },
        });
      }

      // Payment Confirmation notification
      if (b.paymentStatus === 'PAID') {
        const notifId = `pay-${b.id}`;
        notifications.push({
          id: notifId,
          type: 'PAYMENT_RECEIVED',
          title: 'Payment Received',
          message: `Payment of ₹${(b.totalAmount || 0).toLocaleString('en-IN')} confirmed for #${b.id.slice(0, 8)}.`,
          time: (b.updatedAt || b.createdAt).toISOString(),
          timeAgo: getRelativeTime(b.updatedAt || b.createdAt),
          targetUrl: '/admin/bookings',
          isRead: readIdsSet.has(notifId),
          priority: 'info',
          metadata: { bookingId: b.id, totalAmount: b.totalAmount },
        });
      }
    });

    // Parse Recent Users into Notifications
    recentUsers.forEach((u) => {
      const notifId = `user-${u.id}`;
      notifications.push({
        id: notifId,
        type: 'NEW_MEMBER',
        title: 'New Member Registered',
        message: `${u.name || 'A user'} (${u.email}) joined the workspace community.`,
        time: (u.createdAt || new Date()).toISOString(),
        timeAgo: getRelativeTime(u.createdAt || new Date()),
        targetUrl: '/admin/members',
        isRead: readIdsSet.has(notifId),
        priority: 'info',
        metadata: { userId: u.id, email: u.email },
      });
    });

    // Parse Contact & Tour Inquiries into Notifications
    recentInquiries.forEach((inq) => {
      const notifId = `inquiry-${inq.id}`;
      const isPending = inq.status === 'PENDING';
      const spaceLabel = (inq.spaceInterest || 'Workspace')
        .split('-')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      notifications.push({
        id: notifId,
        type: 'NEW_INQUIRY',
        title: isPending ? 'New Contact Inquiry' : `Inquiry (${inq.status})`,
        message: `${inq.fullName || 'Guest'} inquired about ${spaceLabel}${inq.tourDate ? ` (Tour: ${inq.tourDate})` : ''}.`,
        time: inq.createdAt ? new Date(inq.createdAt).toISOString() : new Date().toISOString(),
        timeAgo: getRelativeTime(inq.createdAt || new Date()),
        targetUrl: '/admin/inquiries',
        isRead: readIdsSet.has(notifId),
        priority: isPending ? 'high' : 'medium',
        metadata: {
          inquiryId: inq.id,
          fullName: inq.fullName,
          email: inq.email,
          phone: inq.phone,
          status: inq.status,
          spaceInterest: inq.spaceInterest,
        },
      });
    });

    // Sort all notifications chronologically descending (newest first)
    notifications.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    // Calculate unread count
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
      total: notifications.length,
      latest10: notifications.slice(0, 10),
    });
  } catch (error: any) {
    console.error('Failed to fetch admin notifications:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch admin notifications' },
      { status: 500 }
    );
  }
}
