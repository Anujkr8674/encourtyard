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

      // Extract showInDayPass, gstPercent, totalUnits, and alertThreshold
      const dayPassSpec = specs.find((s: any) => s.key === 'showInDayPass' || s.key === 'Show in Day Pass');
      const showInDayPass = dayPassSpec ? dayPassSpec.value === 'true' : false;
      const gstSpec = specs.find((s: any) => s.key === 'gstPercent' || s.key === 'GST %' || s.key === 'gstRate');
      const gstPercent = gstSpec ? parseFloat(gstSpec.value) || 18 : 18;

      const totalUnitsSpec = specs.find((s: any) => s.key === 'totalUnits' || s.key === 'Total Units' || s.key === 'quantity' || s.key === 'inventory');
      const totalUnits = totalUnitsSpec ? Math.max(1, parseInt(totalUnitsSpec.value, 10) || 1) : 1;

      const alertThresholdSpec = specs.find((s: any) => s.key === 'alertThreshold' || s.key === 'Alert Threshold' || s.key === 'lowStockLimit');
      const alertThreshold = alertThresholdSpec ? Math.max(0, parseInt(alertThresholdSpec.value, 10) || 5) : 5;

      const cleanSpecs = specs.filter((s: any) => 
        s.key !== 'showInDayPass' && 
        s.key !== 'Show in Day Pass' &&
        s.key !== 'totalUnits' &&
        s.key !== 'Total Units' &&
        s.key !== 'alertThreshold' &&
        s.key !== 'Alert Threshold'
      );

      return {
        ...w,
        showInDayPass,
        gstPercent,
        totalUnits,
        alertThreshold,
        specifications: cleanSpecs,
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
      gstPercent,
      totalUnits,
      alertThreshold,
      capacity,
      location,
      badge,
      order,
      isActive,
      showInDayPass,
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

    let parsedSpecs = Array.isArray(specifications)
      ? [...specifications]
      : typeof specifications === 'string'
      ? JSON.parse(specifications || '[]')
      : [];

    parsedSpecs = parsedSpecs.filter((s: any) => s.key !== 'showInDayPass' && s.key !== 'Show in Day Pass');
    if (showInDayPass) {
      parsedSpecs.push({ key: 'showInDayPass', value: 'true' });
    }

    if (gstPercent !== undefined) {
      parsedSpecs = parsedSpecs.filter((s: any) => s.key !== 'gstPercent' && s.key !== 'GST %' && s.key !== 'gstRate');
      parsedSpecs.push({ key: 'gstPercent', value: String(gstPercent) });
    }

    // Save totalUnits and alertThreshold into specifications
    const safeTotalUnits = Math.max(1, parseInt(String(totalUnits || 1), 10) || 1);
    const safeAlertThreshold = Math.max(0, parseInt(String(alertThreshold !== undefined ? alertThreshold : 5), 10) || 5);

    parsedSpecs = parsedSpecs.filter((s: any) => s.key !== 'totalUnits' && s.key !== 'Total Units' && s.key !== 'quantity' && s.key !== 'inventory');
    parsedSpecs.push({ key: 'totalUnits', value: String(safeTotalUnits) });

    parsedSpecs = parsedSpecs.filter((s: any) => s.key !== 'alertThreshold' && s.key !== 'Alert Threshold' && s.key !== 'lowStockLimit');
    parsedSpecs.push({ key: 'alertThreshold', value: String(safeAlertThreshold) });

    const specsJson = JSON.stringify(parsedSpecs);
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

    const savedGst = parsedSpecs.find((s: any) => s.key === 'gstPercent')?.value;

    return NextResponse.json({
      success: true,
      workspace: {
        ...createdWorkspace,
        showInDayPass: !!showInDayPass,
        gstPercent: savedGst ? parseFloat(savedGst) || 18 : 18,
        totalUnits: safeTotalUnits,
        alertThreshold: safeAlertThreshold,
        specifications: parsedSpecs.filter((s: any) => 
          s.key !== 'showInDayPass' && 
          s.key !== 'Show in Day Pass' &&
          s.key !== 'totalUnits' &&
          s.key !== 'Total Units' &&
          s.key !== 'alertThreshold' &&
          s.key !== 'Alert Threshold'
        ),
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
