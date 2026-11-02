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

    const booking = await prisma.booking.findFirst({
      where: {
        OR: [
          { id },
          { bookingRef: id },
        ],
      },
    });

    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    // Verify ownership
    if (booking.userId !== session.id && booking.email !== session.email) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const reason = typeof body?.reason === 'string' ? body.reason.trim() : '';

    if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED') {
      return NextResponse.json(
        { success: false, error: `Booking cannot be cancelled because it is already ${booking.status.toLowerCase()}` },
        { status: 400 }
      );
    }

    if (booking.cancellationRequested) {
      return NextResponse.json({
        success: true,
        booking,
        message: 'A cancellation request for this reservation is already under admin review.',
      });
    }

    const noteAddition = `Cancellation Requested by user on ${new Date().toLocaleDateString()}${reason ? `: "${reason}"` : ' (No reason specified)'}`;
    const updatedNotes = booking.adminNotes ? `${booking.adminNotes} | ${noteAddition}` : noteAddition;

    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        cancellationRequested: true,
        cancellationReason: reason || 'No reason specified',
        cancellationRequestedAt: new Date(),
        adminNotes: updatedNotes,
      },
    });

    return NextResponse.json({
      success: true,
      booking: updated,
      message: 'Cancellation request submitted successfully. Our admin team will review it shortly.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to cancel booking';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
