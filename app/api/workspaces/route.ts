import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { prisma, localStore } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');

    let workspaces: any[] = [];

    // Query Supabase directly
    try {
      let query = supabaseAdmin
        .from('workspaces')
        .select('*')
        .order('order', { ascending: true });

      if (categoryId) {
        query = query.eq('categoryId', categoryId);
      }

      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        workspaces = data;
      }
    } catch (sbErr) {
      console.warn('Supabase workspaces fetch fallback:', sbErr);
    }

    // Fallback to Prisma
    if (workspaces.length === 0) {
      try {
        const whereClause = categoryId ? { categoryId } : {};
        workspaces = await (prisma as any).workspace.findMany({
          where: whereClause,
          orderBy: { order: 'asc' },
        });
      } catch (dbError) {
        console.warn('Prisma workspace fetch fallback:', dbError);
      }
    }

    // Fallback to localStore
    if (workspaces.length === 0) {
      let localList = Array.from(localStore.workspaces?.values() || []);
      if (categoryId) {
        localList = localList.filter((w) => w.categoryId === categoryId);
      }
      workspaces = localList.sort((a, b) => a.order - b.order);
    }

    // Parse JSON fields safely if stringified
    const formatted = workspaces.map((w: any) => {
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

      return {
        ...w,
        specifications: specs,
        mediaUrls: media,
      };
    });

    return NextResponse.json({
      success: true,
      workspaces: formatted,
      count: formatted.length,
    });
  } catch (error: any) {
    console.error('Error fetching workspaces:', error);
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

    const newWorkspaceData = {
      id: `ws-${Date.now()}`,
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let createdWorkspace = newWorkspaceData;

    // Save directly to Supabase
    try {
      const { data, error } = await supabaseAdmin
        .from('workspaces')
        .insert(newWorkspaceData)
        .select()
        .single();

      if (!error && data) {
        createdWorkspace = data;
      }
    } catch (sbErr) {
      console.warn('Supabase workspace create fallback:', sbErr);
    }

    localStore.workspaces?.set(createdWorkspace.id, createdWorkspace as any);

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

