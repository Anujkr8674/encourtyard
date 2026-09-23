import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma, isLiveDbConfigured, localStore, syncBookingsToDisk, LocalBooking } from '@/lib/prisma';
import { dispatchBookingCreatedEmails, BookingEmailData } from '@/lib/email';

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

    const bookingId = `BK-${Math.floor(10000 + Math.random() * 90000)}`;

    const newLocalBooking: LocalBooking = {
      id: bookingId,
      userId: session.id,
      userEmail: session.email,
      userName: session.name,
      workspaceId: workspaceId || undefined,
      workspaceTitle: workspaceTitle || 'EnCourtyard Premium Workspace',
      workspaceSlug: workspaceSlug || undefined,
      workspaceImage: workspaceImage || undefined,
      categoryName: categoryName || 'Botanical Workspaces',
      locationName: locationName || 'Maruthi Plaza, Khairtabad, Hyderabad',
      fullName: fullName.trim(),
      companyName: companyName ? companyName.trim() : null,
      email: email.trim(),
      phone: phone.trim(),
      spaceType: spaceType || 'workspace',
      plan: plan || 'monthly',
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || startDate || new Date().toISOString().split('T')[0],
      startTime: startTime || '09:00 AM',
      endTime: endTime || '06:00 PM',
      guests: Number(guests) || 1,
      totalAmount: totalAmount || 'Custom Quote',
      status: 'PENDING',
      paymentStatus: 'PENDING',
      adminNotes: null,
      statusUpdatedAt: new Date(),
      notesUpdatedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to resilient local disk store
    localStore.bookings.set(bookingId, newLocalBooking);
    syncBookingsToDisk();

    // Try saving to Supabase PostgreSQL via Prisma if configured
    if (isLiveDbConfigured) {
      try {
        await (prisma.booking as any).create({
          data: {
            id: bookingId,
            userId: session.id,
            locationId: workspaceId || 'loc-default',
            locationName: locationName || 'Maruthi Plaza, Khairtabad, Hyderabad',
            spaceType: spaceType || 'workspace',
            bookingDate: new Date(startDate || Date.now()),
            startTime: startTime || '09:00 AM',
            endTime: endTime || '06:00 PM',
            guests: Number(guests) || 1,
            totalAmount: typeof totalAmount === 'number' ? totalAmount : 0,
            status: 'PENDING',
            paymentStatus: 'PENDING',
          },
        });
      } catch (dbErr) {
        console.warn('⚠️ [Prisma DB Booking Insert Warning]:', dbErr);
      }
    }

    // Trigger dual/single user email + admin alert notifications asynchronously
    const emailData: BookingEmailData = {
      id: newLocalBooking.id,
      fullName: newLocalBooking.fullName,
      companyName: newLocalBooking.companyName,
      email: newLocalBooking.email,
      phone: newLocalBooking.phone,
      workspaceTitle: newLocalBooking.workspaceTitle || 'EnCourtyard Workspace',
      categoryName: newLocalBooking.categoryName,
      locationName: newLocalBooking.locationName,
      plan: newLocalBooking.plan,
      startDate: newLocalBooking.startDate,
      endDate: newLocalBooking.endDate,
      startTime: newLocalBooking.startTime,
      endTime: newLocalBooking.endTime,
      guests: newLocalBooking.guests,
      totalAmount: newLocalBooking.totalAmount,
      status: newLocalBooking.status,
      adminNotes: newLocalBooking.adminNotes,
      createdAt: newLocalBooking.createdAt,
    };

    dispatchBookingCreatedEmails(emailData, session.email).catch((mailErr) => {
      console.error('❌ [Booking Email Dispatcher Error]:', mailErr);
    });

    return NextResponse.json({
      success: true,
      booking: newLocalBooking,
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

    const allBookings = Array.from(localStore.bookings.values());
    const userBookings = allBookings.filter((b) => b.userId === session.id || b.email.toLowerCase() === session.email.toLowerCase());

    return NextResponse.json({
      success: true,
      bookings: userBookings,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to fetch bookings';
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
