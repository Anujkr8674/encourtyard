import { prisma } from '@/lib/prisma';

/**
 * Generates a clean, human-readable booking reference ID.
 * Format: YYYYMMDD + 6-digit sequence (e.g., 20261101000001, 20261102000005)
 * 
 * - YYYY: 4-digit Year (e.g. 2026)
 * - MM: 2-digit Month (e.g. 11)
 * - DD: 2-digit Date (e.g. 01)
 * - XXXXXX: 6-digit daily serial number (e.g. 000001, 000002, 000003...)
 */
export async function generateBookingRef(date: Date = new Date()): Promise<string> {
  const year = date.getFullYear().toString();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const datePrefix = `${year}${month}${day}`;

  try {
    // Find highest existing bookingRef for this day's datePrefix
    const latestBooking = await prisma.booking.findFirst({
      where: {
        bookingRef: {
          startsWith: datePrefix,
        },
      },
      orderBy: {
        bookingRef: 'desc',
      },
      select: {
        bookingRef: true,
      },
    });

    let nextSequence = 1;
    if (latestBooking && latestBooking.bookingRef) {
      const existingSeqStr = latestBooking.bookingRef.slice(datePrefix.length);
      const existingSeq = parseInt(existingSeqStr, 10);
      if (!isNaN(existingSeq) && existingSeq >= 1) {
        nextSequence = existingSeq + 1;
      }
    }

    const sequenceStr = String(nextSequence).padStart(6, '0');
    return `${datePrefix}${sequenceStr}`;
  } catch (err) {
    console.error('Failed to query latest bookingRef, using timestamp fallback:', err);
    // Safe fallback if DB query fails: datePrefix + 6-digit time slice
    const fallbackSeq = String(Date.now() % 1000000).padStart(6, '0');
    return `${datePrefix}${fallbackSeq}`;
  }
}

/**
 * Backfills existing database bookings that lack a bookingRef.
 * Assigns date-based YYYYMMDD + 6-digit serial based on their createdAt date.
 */
export async function backfillExistingBookingRefs(): Promise<{ updated: number }> {
  try {
    const unassigned = await prisma.booking.findMany({
      where: {
        OR: [
          { bookingRef: null },
          { bookingRef: '' },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (unassigned.length === 0) {
      return { updated: 0 };
    }

    // Group by datePrefix YYYYMMDD and assign sequence numbers
    const dailyCounters: Record<string, number> = {};

    // First, inspect what highest counters already exist for these days
    for (const b of unassigned) {
      const d = b.createdAt ? new Date(b.createdAt) : new Date();
      const year = d.getFullYear().toString();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const prefix = `${year}${month}${day}`;

      if (dailyCounters[prefix] === undefined) {
        // Query existing max in DB for this prefix
        const existingMax = await prisma.booking.findFirst({
          where: {
            bookingRef: {
              startsWith: prefix,
            },
          },
          orderBy: {
            bookingRef: 'desc',
          },
          select: {
            bookingRef: true,
          },
        });

        if (existingMax?.bookingRef) {
          const parsed = parseInt(existingMax.bookingRef.slice(prefix.length), 10);
          dailyCounters[prefix] = !isNaN(parsed) ? parsed : 0;
        } else {
          dailyCounters[prefix] = 0;
        }
      }

      dailyCounters[prefix] += 1;
      const newRef = `${prefix}${String(dailyCounters[prefix]).padStart(6, '0')}`;

      await prisma.booking.update({
        where: { id: b.id },
        data: { bookingRef: newRef },
      });
    }

    return { updated: unassigned.length };
  } catch (err) {
    console.error('Error during bookingRef backfill:', err);
    return { updated: 0 };
  }
}
