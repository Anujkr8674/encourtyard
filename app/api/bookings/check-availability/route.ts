import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkWorkspaceAvailabilityDetailed, BookingSlot } from '@/lib/availability';

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

    // Fetch workspace with specifications to get totalUnits & alertThreshold
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: {
        specifications: true,
      },
    });

    let totalUnits = 1;
    let alertThreshold = 5;
    if (workspace?.specifications) {
      try {
        const specs = typeof workspace.specifications === 'string' ? JSON.parse(workspace.specifications) : workspace.specifications;
        const tu = specs.find((s: any) => s.key === 'totalUnits' || s.key === 'Total Units' || s.key === 'quantity');
        if (tu && !isNaN(parseInt(tu.value, 10))) totalUnits = Math.max(1, parseInt(tu.value, 10));
        const at = specs.find((s: any) => s.key === 'alertThreshold' || s.key === 'Alert Threshold');
        if (at && !isNaN(parseInt(at.value, 10))) alertThreshold = Math.max(0, parseInt(at.value, 10));
      } catch (_) {}
    }

    // Fetch active bookings for this workspace
    const bookings = await prisma.booking.findMany({
      where: {
        workspaceId,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
      select: {
        startDate: true,
        endDate: true,
        startTime: true,
        endTime: true,
      },
    });

    const maintenanceBlocks = await prisma.maintenanceBlock.findMany({
      where: { workspaceId },
      select: {
        startDate: true,
        endDate: true,
        startTime: true,
        endTime: true,
      },
    });

    const effEndDate = endDate || startDate;
    const effStartTime = startTime || '09:00 AM';
    const effEndTime = endTime || '06:00 PM';

    const result = checkWorkspaceAvailabilityDetailed(
      bookings as BookingSlot[],
      maintenanceBlocks as BookingSlot[],
      startDate,
      effStartTime,
      effEndDate,
      effEndTime,
      totalUnits,
      alertThreshold
    );

    if (!result.isAvailable) {
      return NextResponse.json({
        available: false,
        totalUnits: result.totalUnits,
        bookedUnits: result.bookedUnits,
        availableUnits: 0,
        isLowStock: false,
        message: 'This workspace is fully booked for the selected schedule. Please select another date or time.',
        nextAvailableTimestamp: result.nextAvailableTimestamp,
      });
    }

    return NextResponse.json({
      available: true,
      totalUnits: result.totalUnits,
      bookedUnits: result.bookedUnits,
      availableUnits: result.availableUnits,
      isLowStock: result.isLowStock,
      alertThreshold: result.alertThreshold,
      message: result.isLowStock
        ? 'Only a few offices left for this date!'
        : 'Workspace is available for selected schedule.',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { available: true, message: 'Workspace is available' },
      { status: 200 }
    );
  }
}
