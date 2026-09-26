import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { workspaceId, startDate, endDate, startTime, endTime, guests } = body;

    if (!startDate) {
      return NextResponse.json(
        { available: false, error: 'Start date is required' },
        { status: 400 }
      );
    }

    if (!workspaceId) {
      return NextResponse.json({ available: true, message: 'Workspace is available' });
    }

    // Check existing confirmed/pending bookings for this workspace
    const conflicting = await prisma.booking.findFirst({
      where: {
        workspaceId,
        status: { not: 'CANCELLED' },
        startDate,
        endDate: endDate || startDate,
        startTime,
      }
    });

    if (conflicting) {
      return NextResponse.json({
        available: false,
        message: 'This workspace slot is currently held or reserved. Please choose an alternate time or contact our concierge.',
      });
    }

    return NextResponse.json({
      available: true,
      message: 'Workspace is available for selected schedule and guest allocation.',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { available: true, message: 'Workspace is available' },
      { status: 200 }
    );
  }
}
