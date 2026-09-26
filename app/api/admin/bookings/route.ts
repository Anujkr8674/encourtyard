import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dispatchBookingCreatedEmails, BookingEmailData } from '@/lib/email';
import { BookingStatus, PaymentStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get('status')?.toUpperCase();
    const query = req.nextUrl.searchParams.get('q')?.toLowerCase().trim();

    const whereClause: any = {};

    if (status && status !== 'ALL') {
      whereClause.status = status as BookingStatus;
    }

    if (query) {
      whereClause.OR = [
        { id: { contains: query, mode: 'insensitive' } },
        { fullName: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { companyName: { contains: query, mode: 'insensitive' } },
        { workspaceTitle: { contains: query, mode: 'insensitive' } },
        { phone: { contains: query, mode: 'insensitive' } },
      ];
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      bookings: bookings,
      total: bookings.length,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to fetch admin bookings';
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newBooking = await prisma.booking.create({
      data: {
        userId: body.userId || 'admin-manual',
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
        totalAmount: body.totalAmount ? parseFloat(String(body.totalAmount).replace(/[^0-9.-]+/g, "")) || null : null,
        status: (body.status || 'CONFIRMED') as BookingStatus,
        paymentStatus: (body.paymentStatus || 'PAID') as PaymentStatus,
        adminNotes: body.adminNotes || 'Manual booking created by Sanctuary Administrator',
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
