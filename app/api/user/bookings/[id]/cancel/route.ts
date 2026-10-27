import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { BookingStatus } from '@prisma/client';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Booking ID required' }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    // Verify ownership
    if (booking.userId !== session.id && booking.email !== session.email) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED') {
      return NextResponse.json(
        { success: false, error: `Booking cannot be cancelled because it is already ${booking.status.toLowerCase()}` },
        { status: 400 }
      );
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED' as BookingStatus,
        statusUpdatedAt: new Date(),
        adminNotes: booking.adminNotes
          ? `${booking.adminNotes} | Cancelled by user on ${new Date().toLocaleDateString()}`
          : `Cancelled by user on ${new Date().toLocaleDateString()}`,
      },
    });

    return NextResponse.json({
      success: true,
      booking: updated,
      message: 'Booking cancelled successfully',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to cancel booking';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
