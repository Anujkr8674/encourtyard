import { NextRequest, NextResponse } from 'next/server';
import { localStore, syncBookingsToDisk, LocalBooking } from '@/lib/prisma';
import { dispatchBookingCreatedEmails, BookingEmailData } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get('status')?.toUpperCase();
    const query = req.nextUrl.searchParams.get('q')?.toLowerCase().trim();

    let list = Array.from(localStore.bookings.values());

    // Filter by status if not ALL
    if (status && status !== 'ALL') {
      list = list.filter((b) => b.status === status);
    }

    // Search query filter
    if (query) {
      list = list.filter(
        (b) =>
          b.id.toLowerCase().includes(query) ||
          b.fullName.toLowerCase().includes(query) ||
          b.email.toLowerCase().includes(query) ||
          (b.companyName && b.companyName.toLowerCase().includes(query)) ||
          (b.workspaceTitle && b.workspaceTitle.toLowerCase().includes(query)) ||
          b.phone.toLowerCase().includes(query)
      );
    }

    // Sort latest first
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      bookings: list,
      total: list.length,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to fetch admin bookings';
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const bookingId = body.id || `BK-${Math.floor(10000 + Math.random() * 90000)}`;

    const newBooking: LocalBooking = {
      id: bookingId,
      userId: body.userId || 'admin-manual',
      userEmail: body.email,
      userName: body.fullName,
      workspaceId: body.workspaceId,
      workspaceTitle: body.workspaceTitle || 'EnCourtyard Workspace',
      categoryName: body.categoryName || 'General',
      locationName: body.locationName || 'Maruthi Plaza, Khairtabad, Hyderabad',
      fullName: body.fullName,
      companyName: body.companyName || null,
      email: body.email,
      phone: body.phone,
      spaceType: body.spaceType || 'workspace',
      plan: body.plan || 'monthly',
      startDate: body.startDate || new Date().toISOString().split('T')[0],
      endDate: body.endDate || body.startDate || new Date().toISOString().split('T')[0],
      startTime: body.startTime || '09:00 AM',
      endTime: body.endTime || '06:00 PM',
      guests: Number(body.guests) || 1,
      totalAmount: body.totalAmount || 'Custom Quote',
      status: (body.status || 'CONFIRMED') as LocalBooking['status'],
      paymentStatus: (body.paymentStatus || 'PAID') as LocalBooking['paymentStatus'],
      adminNotes: body.adminNotes || 'Manual booking created by Sanctuary Administrator',
      statusUpdatedAt: new Date(),
      notesUpdatedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    localStore.bookings.set(bookingId, newBooking);
    syncBookingsToDisk();

    const emailData: BookingEmailData = {
      id: newBooking.id,
      fullName: newBooking.fullName,
      companyName: newBooking.companyName,
      email: newBooking.email,
      phone: newBooking.phone,
      workspaceTitle: newBooking.workspaceTitle || 'EnCourtyard Workspace',
      categoryName: newBooking.categoryName,
      locationName: newBooking.locationName,
      plan: newBooking.plan,
      startDate: newBooking.startDate,
      endDate: newBooking.endDate,
      startTime: newBooking.startTime,
      endTime: newBooking.endTime,
      guests: newBooking.guests,
      totalAmount: newBooking.totalAmount,
      status: newBooking.status,
      adminNotes: newBooking.adminNotes,
      createdAt: newBooking.createdAt,
    };

    dispatchBookingCreatedEmails(emailData, body.accountEmail || newBooking.email).catch((mailErr) => {
      console.error('❌ [Admin Manual Booking Email Error]:', mailErr);
    });

    return NextResponse.json({
      success: true,
      booking: newBooking,
      message: 'Booking created successfully',
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to create booking';
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
