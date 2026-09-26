import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const workspace = await prisma.workspace.findFirst({
      where: {
        OR: [
          { id: id },
          { slug: id }
        ]
      }
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    let specs = [];
    let media = [];
    try {
      specs = typeof workspace.specifications === 'string' ? JSON.parse(workspace.specifications || '[]') : workspace.specifications || [];
    } catch {
      specs = [];
    }
    try {
      media = typeof workspace.mediaUrls === 'string' ? JSON.parse(workspace.mediaUrls || '[]') : workspace.mediaUrls || [];
    } catch {
      media = [];
    }

    const activeBookings = await prisma.booking.findMany({
      where: {
        workspaceId: workspace.id,
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      },
      select: {
        startDate: true,
        endDate: true,
        startTime: true,
        endTime: true,
      }
    });

    const activeMaintenanceBlocks = await prisma.maintenanceBlock.findMany({
      where: {
        workspaceId: workspace.id,
      },
      select: {
        startDate: true,
        endDate: true,
        startTime: true,
        endTime: true,
      }
    });

    return NextResponse.json({
      success: true,
      workspace: {
        ...workspace,
        specifications: specs,
        mediaUrls: media,
        bookings: activeBookings,
        maintenanceBlocks: activeMaintenanceBlocks,
      },
    });
  } catch (error: any) {
    console.error('Error fetching workspace:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch workspace' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const updatePayload: any = {};
    if (title !== undefined) updatePayload.title = title;
    if (categoryId !== undefined) updatePayload.categoryId = categoryId;
    if (categoryName !== undefined) updatePayload.categoryName = categoryName;
    if (shortDescription !== undefined) updatePayload.shortDescription = shortDescription;
    if (longDescription !== undefined) updatePayload.longDescription = longDescription;
    if (specifications !== undefined) {
      updatePayload.specifications = typeof specifications === 'string' ? specifications : JSON.stringify(specifications);
    }
    if (mediaUrls !== undefined) {
      updatePayload.mediaUrls = typeof mediaUrls === 'string' ? mediaUrls : JSON.stringify(mediaUrls);
    }
    if (price !== undefined) updatePayload.price = price;
    if (capacity !== undefined) updatePayload.capacity = capacity;
    if (location !== undefined) updatePayload.location = location;
    if (badge !== undefined) updatePayload.badge = badge;
    if (order !== undefined) updatePayload.order = order;
    if (isActive !== undefined) updatePayload.isActive = isActive;

    // We must find the id since the param might be a slug
    const existing = await prisma.workspace.findFirst({
      where: {
        OR: [
          { id: id },
          { slug: id }
        ]
      }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    const updatedWorkspace = await prisma.workspace.update({
      where: { id: existing.id },
      data: updatePayload,
    });

    let specs = [];
    let media = [];
    try {
      specs = typeof updatedWorkspace.specifications === 'string' ? JSON.parse(updatedWorkspace.specifications || '[]') : updatedWorkspace.specifications || [];
    } catch {
      specs = [];
    }
    try {
      media = typeof updatedWorkspace.mediaUrls === 'string' ? JSON.parse(updatedWorkspace.mediaUrls || '[]') : updatedWorkspace.mediaUrls || [];
    } catch {
      media = [];
    }

    return NextResponse.json({
      success: true,
      workspace: {
        ...updatedWorkspace,
        specifications: specs,
        mediaUrls: media,
      },
      message: 'Workspace updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating workspace:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update workspace' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.workspace.findFirst({
      where: {
        OR: [
          { id: id },
          { slug: id }
        ]
      }
    });

    if (existing) {
      await prisma.workspace.delete({
        where: { id: existing.id },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Workspace deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting workspace:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete workspace' },
      { status: 500 }
    );
  }
}
