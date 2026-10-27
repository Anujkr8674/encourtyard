/**
 * Booking Notes Utility
 * Handles separation of:
 * 1. User Notes: Special requests and instructions entered by customer during booking.
 * 2. Admin Notes: Official notes added/updated by administrators during review or status updates.
 * Also handles technical metadata (UTR number, Payment Proof URL, Timeline history).
 */

export interface ParsedBookingNotes {
  utr: string | null;
  proofUrl: string | null;
  userNotes: string | null;
  adminNotes: string | null;
  timeline: Array<{ status: string; timestamp: string; note?: string | null }>;
}

export function parseBookingNotes(notes?: string | null): ParsedBookingNotes {
  if (!notes || typeof notes !== 'string') {
    return {
      utr: null,
      proofUrl: null,
      userNotes: null,
      adminNotes: null,
      timeline: [],
    };
  }

  const utrMatch = notes.match(/UTR:\s*([^|\n]+)/i);
  const proofMatch = notes.match(/Proof:\s*(https?:\/\/[^\s|\n]+)/i);
  const timelineMatch = notes.match(/Timeline:\s*(\[[^\]]*\])/i);
  const userNotesMatch = notes.match(/UserNotes:\s*([^|\n]+)/i);
  const adminNotesMatch = notes.match(/AdminNotes:\s*([^|\n]+)/i);

  let timeline: Array<{ status: string; timestamp: string; note?: string | null }> = [];
  if (timelineMatch) {
    try {
      timeline = JSON.parse(timelineMatch[1]);
    } catch {
      timeline = [];
    }
  }

  let userNotes = userNotesMatch ? userNotesMatch[1].trim() : null;
  let adminNotes = adminNotesMatch ? adminNotesMatch[1].trim() : null;

  // Backwards compatibility for legacy `Notes: <text>` format:
  if (!userNotes && !adminNotes) {
    const legacyNotesMatch = notes.match(/Notes:\s*([^|\n]+)/i);
    if (legacyNotesMatch) {
      // Legacy "Notes:" came from specialRequests during booking
      userNotes = legacyNotesMatch[1].trim();
    } else {
      // If no prefix but string has content not matching UTR/Proof/Timeline
      const clean = notes
        .replace(/Timeline:\s*(\[[^\]]*\])\s*\|?\s*/gi, '')
        .replace(/UTR:\s*([^|\n]+)\s*\|?\s*/gi, '')
        .replace(/Proof:\s*(https?:\/\/[^\s|\n]+)\s*\|?\s*/gi, '')
        .replace(/^[| ]+|[| ]+$/g, '')
        .trim();
      if (clean) {
        userNotes = clean;
      }
    }
  }

  return {
    utr: utrMatch ? utrMatch[1].trim() : null,
    proofUrl: proofMatch ? proofMatch[1].trim() : null,
    userNotes: userNotes || null,
    adminNotes: adminNotes || null,
    timeline,
  };
}

export function assembleBookingNotes(data: {
  utr?: string | null;
  proofUrl?: string | null;
  userNotes?: string | null;
  adminNotes?: string | null;
  timeline?: Array<{ status: string; timestamp: string; note?: string | null }> | null;
}): string | null {
  const parts: string[] = [];

  if (data.utr && data.utr.trim()) {
    parts.push(`UTR: ${data.utr.trim()}`);
  }
  if (data.proofUrl && data.proofUrl.trim()) {
    parts.push(`Proof: ${data.proofUrl.trim()}`);
  }
  if (data.userNotes && data.userNotes.trim()) {
    parts.push(`UserNotes: ${data.userNotes.trim()}`);
  }
  if (data.adminNotes && data.adminNotes.trim()) {
    parts.push(`AdminNotes: ${data.adminNotes.trim()}`);
  }
  if (data.timeline && data.timeline.length > 0) {
    parts.push(`Timeline: ${JSON.stringify(data.timeline)}`);
  }

  return parts.length > 0 ? parts.join(' | ') : null;
}
