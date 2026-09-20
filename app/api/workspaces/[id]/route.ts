import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { prisma, localStore } from '@/lib/prisma';

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

    const updatePayload: any = {
      updatedAt: new Date().toISOString(),
    };
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

    let updatedWorkspace: any = null;

    // 1. Direct Supabase update
    try {
      const { data, error } = await supabaseAdmin
        .from('workspaces')
        .update(updatePayload)
        .or(`id.eq.${id},slug.eq.${id}`)
        .select();

      if (!error && Array.isArray(data) && data.length > 0) {
        updatedWorkspace = data[0];
      }
    } catch (sbErr) {
      console.warn('Supabase workspace update error:', sbErr);
    }

    // 2. Prisma fallback
    if (!updatedWorkspace) {
      try {
        updatedWorkspace = await (prisma as any).workspace.update({
          where: { id },
          data: updatePayload,
        });
      } catch (dbErr) {
        console.warn('Prisma workspace update fallback:', dbErr);
      }
    }

    // 3. localStore fallback
    if (!updatedWorkspace && localStore.workspaces?.has(id)) {
      const existing = localStore.workspaces.get(id)!;
      updatedWorkspace = { ...existing, ...updatePayload };
      localStore.workspaces.set(id, updatedWorkspace);
    }

    if (!updatedWorkspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

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

    // Direct Supabase delete
    try {
      await supabaseAdmin
        .from('workspaces')
        .delete()
        .or(`id.eq.${id},slug.eq.${id}`);
    } catch (sbErr) {
      console.warn('Supabase workspace delete error:', sbErr);
    }

    try {
      await (prisma as any).workspace.delete({
        where: { id },
      });
    } catch (dbErr) {
      console.warn('Prisma workspace delete fallback:', dbErr);
    }

    localStore.workspaces?.delete(id);

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

