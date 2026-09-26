import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseBookingDateTime, formatTimestampToDateAndTimeString } from '@/lib/availability';

// Since this route runs via cron, we use GET or POST.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: 'auto_complete_bookings' }
    });
    
    // If setting doesn't exist, we assume it's true by default
    const isAutoCompleteEnabled = setting ? setting.value === 'true' : true;
    
    if (!isAutoCompleteEnabled) {
      return NextResponse.json({ success: true, message: 'Auto-complete is disabled in settings.' });
    }
    
    // Fetch all CONFIRMED bookings
    const confirmedBookings = await prisma.booking.findMany({
      where: { status: 'CONFIRMED' }
    });

    let processedCount = 0;
    const nowTimestamp = Date.now();

    // Process expired bookings
    for (const booking of confirmedBookings) {
      if (!booking.endDate || !booking.endTime) continue;
      
      const endTimestamp = parseBookingDateTime(booking.endDate, booking.endTime);
      
      // If the booking's end time is strictly in the past
      if (endTimestamp > 0 && endTimestamp < nowTimestamp) {
        
        // Mark as COMPLETED
        await prisma.booking.update({
          where: { id: booking.id },
          data: { 
            status: 'COMPLETED',
            statusUpdatedAt: new Date(),
            adminNotes: (booking.adminNotes ? booking.adminNotes + '\n' : '') + '[System]: Auto-completed by cron job.',
          }
        });

        // Add 1 hour maintenance buffer
        const bufferEndTimestamp = endTimestamp + 60 * 60 * 1000;
        const { dateStr, timeStr } = formatTimestampToDateAndTimeString(bufferEndTimestamp);

        if (booking.workspaceId) {
          await prisma.maintenanceBlock.create({
            data: {
              workspaceId: booking.workspaceId,
              startDate: booking.endDate,
              startTime: booking.endTime,
              endDate: dateStr,
              endTime: timeStr,
              reason: 'Auto-Maintenance Buffer from Expired Booking',
            }
          });
        }
        
        processedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Cron executed successfully. Auto-completed ${processedCount} bookings.`,
      processedCount
    });

  } catch (error: any) {
    console.error('❌ [Auto-Complete Cron Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
