import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dispatchStatusUpdatedEmails, BookingEmailData } from '@/lib/email';
import { BookingStatus, PaymentStatus } from '@prisma/client';
import { parseBookingDateTime, formatTimestampToDateAndTimeString } from '@/lib/availability';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, adminNotes, paymentStatus, completionType } = body;

    const existing = await prisma.booking.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Booking record not found' },
        { status: 404 }
      );
    }

    const previousStatus = existing.status;
    const isStatusChanging = status && status !== previousStatus;
    const isNotesChanging = adminNotes !== undefined && adminNotes !== existing.adminNotes;

    const now = new Date();

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status: status ? (status as BookingStatus) : existing.status,
        paymentStatus: paymentStatus ? (paymentStatus as PaymentStatus) : existing.paymentStatus,
        adminNotes: adminNotes !== undefined ? adminNotes : existing.adminNotes,
        statusUpdatedAt: isStatusChanging ? now : existing.statusUpdatedAt,
        notesUpdatedAt: isNotesChanging ? now : existing.notesUpdatedAt,
      }
    });

    // Handle Maintenance Buffer if completing booking
    if (updated.status === 'COMPLETED' && completionType === 'maintenance' && updated.workspaceId && updated.endDate && updated.endTime) {
      const endTimestamp = parseBookingDateTime(updated.endDate, updated.endTime);
      if (endTimestamp > 0) {
        // Add 1 hr buffer
        const bufferEndTimestamp = endTimestamp + 60 * 60 * 1000;
        const { dateStr, timeStr } = formatTimestampToDateAndTimeString(bufferEndTimestamp);

        await prisma.maintenanceBlock.create({
          data: {
            workspaceId: updated.workspaceId,
            startDate: updated.endDate,
            startTime: updated.endTime,
            endDate: dateStr,
            endTime: timeStr,
            reason: 'Booking Auto-Maintenance Buffer',
          }
        });
      }
    }

    // Trigger user notification email + admin status update notification
    if (isStatusChanging || isNotesChanging) {
      const emailData: BookingEmailData = {
        id: updated.id,
        fullName: updated.fullName || '',
        companyName: updated.companyName,
        email: updated.email || '',
        phone: updated.phone || '',
        workspaceTitle: updated.workspaceTitle || 'EnCourtyard Workspace',
        categoryName: updated.categoryName || '',
        locationName: updated.locationName || '',
        plan: updated.plan as any,
        startDate: updated.startDate || '',
        endDate: updated.endDate || '',
        startTime: updated.startTime || '',
        endTime: updated.endTime || '',
        guests: updated.guests,
        totalAmount: updated.totalAmount ? `₹${updated.totalAmount}` : 'Custom Quote',
        status: updated.status,
        adminNotes: updated.adminNotes,
        statusUpdatedAt: updated.statusUpdatedAt,
        notesUpdatedAt: updated.notesUpdatedAt,
        createdAt: updated.createdAt,
      };

      const userEmail = await prisma.user.findUnique({ where: { id: updated.userId } });

      dispatchStatusUpdatedEmails(emailData, userEmail?.email).catch((err) => {
        console.error('❌ [Status Update Email Error]:', err);
      });
    }

    return NextResponse.json({
      success: true,
      booking: updated,
      message: `Booking ${id} status updated to ${updated.status}`,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to update booking status';
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.booking.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: `Booking ${id} deleted successfully`,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to delete booking';
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
