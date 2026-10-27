import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Verify ownership
    const isOwner =
      booking.userId === session.id ||
      (booking.email && booking.email.toLowerCase() === session.email.toLowerCase());

    if (!isOwner) {
      return NextResponse.json({ error: 'Unauthorized to view this booking' }, { status: 403 });
    }

    // Attempt to fetch workspace image if workspaceId exists
    let workspaceImage: string | null = null;
    if (booking.workspaceId) {
      try {
        const ws = await prisma.workspace.findUnique({
          where: { id: booking.workspaceId },
          select: { mediaUrls: true },
        });
        if (ws && ws.mediaUrls) {
          try {
            const parsed = JSON.parse(ws.mediaUrls);
            if (Array.isArray(parsed) && parsed.length > 0) {
              workspaceImage = typeof parsed[0] === 'string' ? parsed[0] : parsed[0]?.url || null;
            }
          } catch {
            if (typeof ws.mediaUrls === 'string') workspaceImage = ws.mediaUrls;
          }
        }
      } catch {
        // Fallback gracefully
      }
    }

    return NextResponse.json({
      success: true,
      booking: {
        ...booking,
        workspaceImage,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
