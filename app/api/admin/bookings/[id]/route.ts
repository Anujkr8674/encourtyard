import { NextRequest, NextResponse } from 'next/server';
import { localStore, syncBookingsToDisk } from '@/lib/prisma';
import { dispatchStatusUpdatedEmails, BookingEmailData } from '@/lib/email';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, adminNotes, paymentStatus } = body;

    const existing = localStore.bookings.get(id);
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

    const updated = {
      ...existing,
      status: status ? (status as typeof existing.status) : existing.status,
      paymentStatus: paymentStatus ? (paymentStatus as typeof existing.paymentStatus) : existing.paymentStatus,
      adminNotes: adminNotes !== undefined ? adminNotes : existing.adminNotes,
      statusUpdatedAt: isStatusChanging ? now : existing.statusUpdatedAt,
      notesUpdatedAt: isNotesChanging ? now : existing.notesUpdatedAt,
      updatedAt: now,
    };

    localStore.bookings.set(id, updated);
    syncBookingsToDisk();

    // Trigger user notification email + admin status update notification
    if (isStatusChanging || isNotesChanging) {
      const emailData: BookingEmailData = {
        id: updated.id,
        fullName: updated.fullName,
        companyName: updated.companyName,
        email: updated.email,
        phone: updated.phone,
        workspaceTitle: updated.workspaceTitle || 'EnCourtyard Workspace',
        categoryName: updated.categoryName,
        locationName: updated.locationName,
        plan: updated.plan,
        startDate: updated.startDate,
        endDate: updated.endDate,
        startTime: updated.startTime,
        endTime: updated.endTime,
        guests: updated.guests,
        totalAmount: updated.totalAmount,
        status: updated.status,
        adminNotes: updated.adminNotes,
        statusUpdatedAt: updated.statusUpdatedAt,
        notesUpdatedAt: updated.notesUpdatedAt,
        createdAt: updated.createdAt,
      };

      dispatchStatusUpdatedEmails(emailData, updated.userEmail).catch((err) => {
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
    const existing = localStore.bookings.get(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Booking record not found' },
        { status: 404 }
      );
    }

    localStore.bookings.delete(id);
    syncBookingsToDisk();

    return NextResponse.json({
      success: true,
      message: `Booking ${id} deleted successfully`,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to delete booking';
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
