import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function getLocalWorkspacesFallback(): any[] {
  try {
    const filePath = path.join(process.cwd(), 'data', 'local_workspaces.json');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Could not read local_workspaces.json:', err);
  }
  return [];
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    let workspace: any = null;

    // 1. Direct Supabase query
    try {
      const { data, error } = await supabaseAdmin
        .from('workspaces')
        .select('*')
        .or(`id.eq.${id},slug.eq.${id}`)
        .single();

      if (!error && data) {
        workspace = data;
      }
    } catch (sbErr) {
      console.warn('Supabase get workspace error:', sbErr);
    }

    // 2. local JSON fallback
    if (!workspace) {
      const all = getLocalWorkspacesFallback();
      workspace = all.find((w: any) => w.id === id || w.slug === id);
    }

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

    return NextResponse.json({
      success: true,
      workspace: {
        ...workspace,
        specifications: specs,
        mediaUrls: media,
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

    // 2. local JSON file fallback
    try {
      const filePath = path.join(process.cwd(), 'data', 'local_workspaces.json');
      const all = getLocalWorkspacesFallback();
      const idx = all.findIndex((w: any) => w.id === id || w.slug === id);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...updatePayload };
        if (!updatedWorkspace) updatedWorkspace = all[idx];
        fs.writeFileSync(filePath, JSON.stringify(all, null, 2), 'utf-8');
      }
    } catch (fsErr) {
      console.warn('Could not update local_workspaces.json:', fsErr);
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
      const filePath = path.join(process.cwd(), 'data', 'local_workspaces.json');
      const all = getLocalWorkspacesFallback();
      const filtered = all.filter((w: any) => w.id !== id && w.slug !== id);
      fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2), 'utf-8');
    } catch (fsErr) {
      console.warn('Could not delete from local_workspaces.json:', fsErr);
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
