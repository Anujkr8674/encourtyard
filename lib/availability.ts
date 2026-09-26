export interface BookingSlot {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

export function parseBookingDateTime(dateStr: string, timeStr: string): number {
  if (!dateStr || !timeStr) return 0;
  
  const [year, month, day] = dateStr.split('-').map(Number);
  
  const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)/i;
  const match = timeStr.match(timeRegex);
  if (!match) return 0;
  
  let [_, hoursStr, minsStr, modifier] = match;
  let hours = parseInt(hoursStr, 10);
  const mins = parseInt(minsStr, 10);
  
  if (modifier.toUpperCase() === 'PM' && hours < 12) {
    hours += 12;
  }
  if (modifier.toUpperCase() === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return new Date(year, month - 1, day, hours, mins).getTime();
}

export function checkWorkspaceAvailabilityDetailed(
  bookings: BookingSlot[] | undefined,
  maintenanceBlocks: BookingSlot[] | undefined,
  userStartDate: string,
  userStartTime: string,
  userEndDate: string,
  userEndTime: string
): { isAvailable: boolean, nextAvailableTimestamp?: number } {
  const combinedBlocks = [...(bookings || []), ...(maintenanceBlocks || [])];
  
  if (combinedBlocks.length === 0) return { isAvailable: true };
  
  const userStart = parseBookingDateTime(userStartDate, userStartTime);
  const userEnd = parseBookingDateTime(userEndDate, userEndTime);
  if (!userStart || !userEnd) return { isAvailable: true };

  let isAvail = true;
  let maxEndTime = 0;

  for (const b of combinedBlocks) {
    const bStart = parseBookingDateTime(b.startDate, b.startTime);
    const bEnd = parseBookingDateTime(b.endDate, b.endTime);
    if (!bStart || !bEnd) continue;

    // Normal bookings used to have a 1 hour buffer automatically.
    // If it's a maintenance block, the buffer is already explicitly baked into its endTime.
    // However, to keep it simple and robust, we assume all provided blocks represent actual blocked time.
    // Wait, the prompt says "maintains and another is instant avivlbe", meaning if instant, there's NO 1hr buffer.
    // So bookings alone SHOULD NOT have an implicit 1hr buffer anymore, EXCEPT for existing CONFIRMED ones that don't have a block yet.
    // Let's just use the exact times of the blocks provided.
    // But since the legacy logic added 1hr to bookings, I will keep it for backwards compatibility if needed, but the prompt says 1hr buffer is applied via Maintenance.
    // Let's treat bookings as exactly their times. (We explicitly add Maintenance blocks for the buffer now).

    if (userStart < bEnd && userEnd > bStart) {
      isAvail = false;
      if (bEnd > maxEndTime) {
        maxEndTime = bEnd;
      }
    }
  }
  
  if (!isAvail) {
     return { isAvailable: false, nextAvailableTimestamp: maxEndTime };
  }
  return { isAvailable: true };
}

export function checkWorkspaceAvailability(
  bookings: BookingSlot[] | undefined,
  userStartDate: string,
  userStartTime: string,
  userEndDate: string,
  userEndTime: string
): boolean {
  // Legacy wrapper that implicitly adds 1 hr buffer for backwards compatibility
  if (!bookings || bookings.length === 0) return true;
  
  const userStart = parseBookingDateTime(userStartDate, userStartTime);
  const userEnd = parseBookingDateTime(userEndDate, userEndTime);
  if (!userStart || !userEnd) return true;

  for (const b of bookings) {
    const bStart = parseBookingDateTime(b.startDate, b.startTime);
    const bEnd = parseBookingDateTime(b.endDate, b.endTime);
    if (!bStart || !bEnd) continue;

    const bEndWithBuffer = bEnd + 60 * 60 * 1000; 
    if (userStart < bEndWithBuffer && userEnd > bStart) {
      return false; 
    }
  }
  return true; 
}

export function getDefaultDates() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  const nextMonth = new Date();
  nextMonth.setDate(today.getDate() + 30);
  const nmYear = nextMonth.getFullYear();
  const nmMonth = String(nextMonth.getMonth() + 1).padStart(2, '0');
  const nmDay = String(nextMonth.getDate()).padStart(2, '0');
  const nextMonthStr = `${nmYear}-${nmMonth}-${nmDay}`;

  return {
    startDate: todayStr,
    endDate: nextMonthStr,
    startTime: '09:00 AM',
    endTime: '06:00 PM'
  };
}

export function formatTimestampToDateAndTimeString(timestamp: number) {
  const d = new Date(timestamp);
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  
  let hours = d.getHours();
  const mins = String(d.getMinutes()).padStart(2, '0');
  const modifier = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const hoursStr = String(hours).padStart(2, '0');
  const timeStr = `${hoursStr}:${mins} ${modifier}`;
  
  return { dateStr, timeStr };
}
