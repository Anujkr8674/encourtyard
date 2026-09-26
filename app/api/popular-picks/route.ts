import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const allWorkspaces = await prisma.workspace.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    const activeBookings = await prisma.booking.findMany({
      where: {
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      },
      select: {
        workspaceId: true,
        startDate: true,
        endDate: true,
        startTime: true,
        endTime: true,
      }
    });

    const formatted = allWorkspaces.map((w) => {
      let specs = [];
      let media = [];
      try {
        specs = typeof w.specifications === 'string' ? JSON.parse(w.specifications || '[]') : w.specifications || [];
      } catch {
        specs = [];
      }
      try {
        media = typeof w.mediaUrls === 'string' ? JSON.parse(w.mediaUrls || '[]') : w.mediaUrls || [];
      } catch {
        media = [];
      }

      const wBookings = activeBookings.filter(b => b.workspaceId === w.id);

      return {
        ...w,
        specifications: specs,
        mediaUrls: media,
        bookings: wBookings,
      };
    });

    // Get popular picks from dedicated PopularPick table
    const dbPicks = await prisma.popularPick.findMany({
      orderBy: { order: 'asc' }
    });

    const featuredIds = dbPicks.map(p => p.workspaceId);
    let popularPicks: any[] = [];

    if (featuredIds.length > 0) {
      const workspaceMap = new Map(formatted.map((w) => [w.id, w]));
      for (const id of featuredIds) {
        const item = workspaceMap.get(id);
        if (item) {
          popularPicks.push(item);
        }
      }
    }

    return NextResponse.json({
      success: true,
      workspaces: popularPicks,
      allWorkspaces: formatted,
      featuredIds: popularPicks.map((p) => p.id),
      count: popularPicks.length,
    });
  } catch (error: any) {
    console.error('Error in /api/popular-picks GET:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch popular picks' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { featuredIds } = body;

    if (!Array.isArray(featuredIds)) {
      return NextResponse.json(
        { error: 'featuredIds must be an array of workspace IDs' },
        { status: 400 }
      );
    }

    const cleanedIds = featuredIds.map(String).slice(0, 10);
    
    // Clear old picks and insert new ones to maintain order
    await prisma.$transaction(async (tx) => {
      await tx.popularPick.deleteMany();
      
      if (cleanedIds.length > 0) {
        await tx.popularPick.createMany({
          data: cleanedIds.map((id, index) => ({
            workspaceId: id,
            order: index
          }))
        });
      }
    });

    return NextResponse.json({
      success: true,
      featuredIds: cleanedIds,
      message: 'Popular Picks top 10 list saved successfully to dedicated table',
    });
  } catch (error: any) {
    console.error('Error in /api/popular-picks POST:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update popular picks' },
      { status: 500 }
    );
  }
}
