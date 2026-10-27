import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dispatchStatusUpdatedEmails, BookingEmailData } from '@/lib/email';
import { BookingStatus, PaymentStatus } from '@prisma/client';
import { parseBookingDateTime, formatTimestampToDateAndTimeString } from '@/lib/availability';
import { parseBookingNotes, assembleBookingNotes } from '@/lib/bookingNotes';

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
    const newStatus = status ? (status as BookingStatus) : existing.status;
    const isStatusChanging = newStatus !== previousStatus;
    const now = new Date();

    // Parse existing technical payment info, User Notes, and Admin Notes
    const parsedExisting = parseBookingNotes(existing.adminNotes);
    let timelineHistory: Array<{ status: string; timestamp: string; note?: string | null }> = parsedExisting.timeline || [];

    if (timelineHistory.length === 0) {
      timelineHistory.push({
        status: 'PENDING',
        timestamp: (existing.createdAt || now).toISOString(),
        note: parsedExisting.userNotes ? `User Request: ${parsedExisting.userNotes}` : 'Reservation submitted by member',
      });
    }

    const cleanNewNote =
      adminNotes !== undefined && adminNotes !== null
        ? adminNotes
            .replace(/Timeline:\s*(\[[^\]]*\])\s*\|?\s*/gi, '')
            .replace(/UTR:\s*([^|\n]+)\s*\|?\s*/gi, '')
            .replace(/Proof:\s*(https?:\/\/[^\s|\n]+)\s*\|?\s*/gi, '')
            .replace(/^(AdminNotes|UserNotes|Notes):\s*/gi, '')
            .trim()
        : null;

    if (isStatusChanging || (cleanNewNote && cleanNewNote.length > 0)) {
      timelineHistory.push({
        status: newStatus,
        timestamp: now.toISOString(),
        note: cleanNewNote || (isStatusChanging ? `Status updated to ${newStatus}` : null),
      });
    }

    // Assemble parts preserving User Notes from booking time and setting Admin Notes from update
    const finalAdminNotes = assembleBookingNotes({
      utr: parsedExisting.utr,
      proofUrl: parsedExisting.proofUrl,
      userNotes: parsedExisting.userNotes, // Keep original member booking request intact!
      adminNotes: cleanNewNote !== null ? cleanNewNote : parsedExisting.adminNotes, // Set or preserve admin note
      timeline: timelineHistory,
    });

    const isNotesChanging = finalAdminNotes !== existing.adminNotes;

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status: newStatus,
        paymentStatus: paymentStatus ? (paymentStatus as PaymentStatus) : existing.paymentStatus,
        adminNotes: finalAdminNotes,
        statusUpdatedAt: isStatusChanging ? now : existing.statusUpdatedAt,
        notesUpdatedAt: isNotesChanging ? now : existing.notesUpdatedAt,
      }
    });

    // Handle Maintenance Buffer if completing booking
    if (updated.status === 'COMPLETED' && completionType === 'maintenance' && updated.workspaceId && updated.endDate && updated.endTime) {
      const endTimestamp = parseBookingDateTime(updated.endDate, updated.endTime);
      if (endTimestamp > 0) {
        const cat = (updated.categoryName || '').toLowerCase();
        const title = (updated.workspaceTitle || '').toLowerCase();
        const space = (updated.spaceType || '').toLowerCase();
        const isMeetingOrConference =
          cat.includes('meeting') ||
          title.includes('meeting') ||
          space.includes('meeting') ||
          cat.includes('confr') ||
          title.includes('confr') ||
          title.includes('boardroom') ||
          space.includes('confr');

        // Buffer duration: 15 minutes for Meeting Hall and Conference Hall; 1 hour (60 min) for Day Pass
        const bufferMinutes = isMeetingOrConference ? 15 : 60;
        const bufferEndTimestamp = endTimestamp + bufferMinutes * 60 * 1000;
        const { dateStr, timeStr } = formatTimestampToDateAndTimeString(bufferEndTimestamp);

        await prisma.maintenanceBlock.create({
          data: {
            workspaceId: updated.workspaceId,
            startDate: updated.endDate,
            startTime: updated.endTime,
            endDate: dateStr,
            endTime: timeStr,
            reason: `Booking Auto-Maintenance Buffer (${bufferMinutes} Min)`,
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
