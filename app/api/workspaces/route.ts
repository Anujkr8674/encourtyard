import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const categoryId = req.nextUrl?.searchParams?.get('categoryId');

    const whereClause = categoryId ? { categoryId } : {};

    const workspaces = await prisma.workspace.findMany({
      where: whereClause,
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

    const activeMaintenanceBlocks = await prisma.maintenanceBlock.findMany({
      select: {
        workspaceId: true,
        startDate: true,
        endDate: true,
        startTime: true,
        endTime: true,
      }
    });

    // Parse JSON fields safely
    const formatted = workspaces.map((w) => {
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
      const wMaintenanceBlocks = activeMaintenanceBlocks.filter(b => b.workspaceId === w.id);

      return {
        ...w,
        specifications: specs,
        mediaUrls: media,
        bookings: wBookings,
        maintenanceBlocks: wMaintenanceBlocks,
      };
    });

    return NextResponse.json({
      success: true,
      workspaces: formatted,
      count: formatted.length,
    });
  } catch (error: any) {
    console.error('Error in GET /api/workspaces:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch workspaces' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      categoryId,
      categoryName,
      shortDescription,
      longDescription,
      specifications,
      mediaUrls,
      price,
      capacity,
      location,
      badge,
      order,
      isActive,
    } = body;

    if (!title || !categoryId || !shortDescription) {
      return NextResponse.json(
        { error: 'Title, Category, and Short Description are required' },
        { status: 400 }
      );
    }

    const slug = body.slug
      ? body.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const specsJson = typeof specifications === 'string' ? specifications : JSON.stringify(specifications || []);
    const mediaJson = typeof mediaUrls === 'string' ? mediaUrls : JSON.stringify(mediaUrls || []);

    const createdWorkspace = await prisma.workspace.create({
      data: {
        title: title.trim(),
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        categoryId: categoryId.trim(),
        categoryName: categoryName?.trim() || 'Workspace Category',
        shortDescription: shortDescription.trim(),
        longDescription: longDescription?.trim() || null,
        specifications: specsJson,
        mediaUrls: mediaJson,
        price: price?.trim() || null,
        capacity: capacity?.trim() || null,
        location: location?.trim() || null,
        badge: badge?.trim() || null,
        order: typeof order === 'number' ? order : 1,
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({
      success: true,
      workspace: {
        ...createdWorkspace,
        specifications: JSON.parse(specsJson),
        mediaUrls: JSON.parse(mediaJson),
      },
      message: 'Workspace created successfully',
    });
  } catch (error: any) {
    console.error('Error creating workspace:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create workspace' },
      { status: 500 }
    );
  }
}
