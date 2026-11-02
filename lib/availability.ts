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

export interface WorkspaceInventoryStatus {
  totalUnits: number;
  bookedUnits: number;
  availableUnits: number;
  isAvailable: boolean;
  isLowStock: boolean;
  alertThreshold: number;
  nextAvailableTimestamp?: number;
}

export function checkWorkspaceAvailabilityDetailed(
  bookings: BookingSlot[] | undefined,
  maintenanceBlocks: BookingSlot[] | undefined,
  userStartDate: string,
  userStartTime: string,
  userEndDate: string,
  userEndTime: string,
  totalUnits: number = 1,
  alertThreshold: number = 5
): WorkspaceInventoryStatus {
  const safeTotalUnits = Math.max(1, totalUnits || 1);
  const safeAlertThreshold = Math.max(0, alertThreshold !== undefined ? alertThreshold : 5);
  const combinedBlocks = [...(bookings || []), ...(maintenanceBlocks || [])];

  if (combinedBlocks.length === 0) {
    return {
      totalUnits: safeTotalUnits,
      bookedUnits: 0,
      availableUnits: safeTotalUnits,
      isAvailable: true,
      isLowStock: safeTotalUnits <= safeAlertThreshold,
      alertThreshold: safeAlertThreshold,
    };
  }

  const userStart = parseBookingDateTime(userStartDate, userStartTime);
  const userEnd = parseBookingDateTime(userEndDate, userEndTime);
  if (!userStart || !userEnd) {
    return {
      totalUnits: safeTotalUnits,
      bookedUnits: 0,
      availableUnits: safeTotalUnits,
      isAvailable: true,
      isLowStock: safeTotalUnits <= safeAlertThreshold,
      alertThreshold: safeAlertThreshold,
    };
  }

  let overlappingCount = 0;
  let maxEndTime = 0;

  for (const b of combinedBlocks) {
    const bStart = parseBookingDateTime(b.startDate, b.startTime);
    const bEnd = parseBookingDateTime(b.endDate, b.endTime);
    if (!bStart || !bEnd) continue;

    // Check if slot overlaps with requested window
    if (userStart < bEnd && userEnd > bStart) {
      overlappingCount++;
      if (bEnd > maxEndTime) {
        maxEndTime = bEnd;
      }
    }
  }

  const availableUnits = Math.max(0, safeTotalUnits - overlappingCount);
  const isAvailable = availableUnits > 0;
  const isLowStock = isAvailable && availableUnits <= safeAlertThreshold;

  return {
    totalUnits: safeTotalUnits,
    bookedUnits: overlappingCount,
    availableUnits,
    isAvailable,
    isLowStock,
    alertThreshold: safeAlertThreshold,
    nextAvailableTimestamp: !isAvailable ? maxEndTime : undefined,
  };
}

/**
 * Universal helper to calculate inventory & stock status for any workspace object
 */
export function calculateWorkspaceInventory(
  workspace: any,
  userStartDate?: string,
  userStartTime?: string,
  userEndDate?: string,
  userEndTime?: string
): WorkspaceInventoryStatus {
  if (!workspace) {
    return {
      totalUnits: 1,
      bookedUnits: 0,
      availableUnits: 1,
      isAvailable: true,
      isLowStock: false,
      alertThreshold: 5,
    };
  }

  // 1. Resolve totalUnits
  let totalUnits = 1;
  if (typeof workspace.totalUnits === 'number' && workspace.totalUnits > 0) {
    totalUnits = workspace.totalUnits;
  } else if (Array.isArray(workspace.specifications)) {
    const spec = workspace.specifications.find(
      (s: any) => s.key === 'totalUnits' || s.key === 'Total Units' || s.key === 'quantity' || s.key === 'inventory'
    );
    if (spec && !isNaN(parseInt(spec.value, 10))) {
      totalUnits = Math.max(1, parseInt(spec.value, 10));
    }
  }

  // 2. Resolve alertThreshold
  let alertThreshold = 5;
  if (typeof workspace.alertThreshold === 'number') {
    alertThreshold = workspace.alertThreshold;
  } else if (Array.isArray(workspace.specifications)) {
    const spec = workspace.specifications.find(
      (s: any) => s.key === 'alertThreshold' || s.key === 'Alert Threshold' || s.key === 'lowStockLimit'
    );
    if (spec && !isNaN(parseInt(spec.value, 10))) {
      alertThreshold = Math.max(0, parseInt(spec.value, 10));
    }
  }

  // 3. Fallback dates to today if unspecified
  const defaultDates = getDefaultDates();
  const startD = userStartDate || defaultDates.startDate;
  const startT = userStartTime || defaultDates.startTime;
  const endD = userEndDate || startD;
  const endT = userEndTime || defaultDates.endTime;

  return checkWorkspaceAvailabilityDetailed(
    workspace.bookings,
    workspace.maintenanceBlocks,
    startD,
    startT,
    endD,
    endT,
    totalUnits,
    alertThreshold
  );
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

export function hasValidPrice(price: string | null | undefined): boolean {
  if (!price) return false;
  const trimmed = String(price).trim();
  if (!trimmed) return false;
  const lower = trimmed.toLowerCase();
  if (
    lower.includes('quote') ||
    lower.includes('flexible') ||
    lower.includes('optional') ||
    lower === 'free'
  ) {
    return false;
  }
  const clean = trimmed.replace(/[^0-9.]/g, '');
  const num = parseFloat(clean);
  return !isNaN(num) && num > 0;
}

export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const match = timeStr.trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3] ? match[3].toUpperCase() : null;

  if (period === 'PM' && hours < 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  return hours * 60 + minutes;
}

export function calculateHourlyDuration(startTime: string, endTime: string) {
  const startMins = parseTimeToMinutes(startTime);
  const endMins = parseTimeToMinutes(endTime);
  let totalMinutes = endMins - startMins;

  // Fallback to minimum 1 hour (60 mins) if invalid or <= 0
  if (totalMinutes <= 0) {
    totalMinutes = 60;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  let formatted = '';
  if (hours > 0 && minutes > 0) {
    formatted = `${hours} hr${hours > 1 ? 's' : ''} ${minutes} min${minutes > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    formatted = `${hours} hr${hours > 1 ? 's' : ''}`;
  } else {
    formatted = `${minutes} min${minutes > 1 ? 's' : ''}`;
  }

  return {
    totalMinutes,
    hours,
    minutes,
    durationInHours: totalMinutes / 60,
    formatted,
  };
}
