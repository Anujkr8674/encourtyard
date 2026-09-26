import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { dispatchBookingCreatedEmails, BookingEmailData } from '@/lib/email';
import { BookingStatus, PaymentStatus } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required. Please sign in or create an account to reserve this workspace.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      workspaceId,
      workspaceTitle,
      workspaceSlug,
      workspaceImage,
      categoryName,
      locationName,
      fullName,
      companyName,
      email,
      phone,
      spaceType,
      plan = 'monthly',
      startDate,
      endDate,
      startTime = '09:00 AM',
      endTime = '06:00 PM',
      guests = 1,
      totalAmount,
    } = body;

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'Please provide full name, email address, and contact phone number.' },
        { status: 400 }
      );
    }

    const newBooking = await prisma.booking.create({
      data: {
        userId: session.id,
        workspaceId: workspaceId || null,
        workspaceTitle: workspaceTitle || 'EnCourtyard Premium Workspace',
        categoryName: categoryName || 'Botanical Workspaces',
        locationName: locationName || 'Maruthi Plaza, Khairtabad, Hyderabad',
        fullName: fullName.trim(),
        companyName: companyName ? companyName.trim() : null,
        email: email.trim(),
        phone: phone.trim(),
        spaceType: spaceType || 'workspace',
        plan: plan || 'monthly',
        bookingDate: startDate ? new Date(startDate) : new Date(),
        startDate: startDate || new Date().toISOString().split('T')[0],
        endDate: endDate || startDate || new Date().toISOString().split('T')[0],
        startTime: startTime || '09:00 AM',
        endTime: endTime || '06:00 PM',
        guests: Number(guests) || 1,
        totalAmount: typeof totalAmount === 'number' ? totalAmount : (totalAmount ? parseFloat(String(totalAmount).replace(/[^0-9.-]+/g, "")) : null),
        status: 'PENDING' as BookingStatus,
        paymentStatus: 'PENDING' as PaymentStatus,
        adminNotes: null,
        statusUpdatedAt: new Date(),
        notesUpdatedAt: new Date(),
      }
    });

    const emailData: BookingEmailData = {
      id: newBooking.id,
      fullName: newBooking.fullName || '',
      companyName: newBooking.companyName,
      email: newBooking.email || '',
      phone: newBooking.phone || '',
      workspaceTitle: newBooking.workspaceTitle || 'EnCourtyard Workspace',
      categoryName: newBooking.categoryName || '',
      locationName: newBooking.locationName || '',
      plan: newBooking.plan as any,
      startDate: newBooking.startDate || '',
      endDate: newBooking.endDate || '',
      startTime: newBooking.startTime || '',
      endTime: newBooking.endTime || '',
      guests: newBooking.guests,
      totalAmount: newBooking.totalAmount ? `₹${newBooking.totalAmount}` : 'Custom Quote',
      status: newBooking.status,
      adminNotes: newBooking.adminNotes,
      createdAt: newBooking.createdAt,
    };

    dispatchBookingCreatedEmails(emailData, session.email).catch((mailErr) => {
      console.error('❌ [Booking Email Dispatcher Error]:', mailErr);
    });

    return NextResponse.json({
      success: true,
      booking: newBooking,
      message: 'Reservation successfully submitted. Confirmation emails dispatched.',
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to create reservation';
    console.error('❌ [Create Booking Error]:', errMessage);
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userBookings = await prisma.booking.findMany({
      where: {
        OR: [
          { userId: session.id },
          { email: session.email }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      bookings: userBookings,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to fetch bookings';
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
