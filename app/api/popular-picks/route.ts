import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { prisma, localStore } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

const POPULAR_PICKS_FILE = path.join(process.cwd(), 'data', 'local_popular_picks.json');

function getStoredFeaturedIds(): string[] {
  try {
    if (fs.existsSync(POPULAR_PICKS_FILE)) {
      const content = fs.readFileSync(POPULAR_PICKS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
      if (Array.isArray(parsed.featuredIds)) return parsed.featuredIds;
    }
  } catch (err) {
    console.warn('Could not read local_popular_picks.json:', err);
  }
  return [];
}

function saveStoredFeaturedIds(ids: string[]): boolean {
  try {
    const dataDir = path.dirname(POPULAR_PICKS_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(POPULAR_PICKS_FILE, JSON.stringify({ featuredIds: ids }, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed to write local_popular_picks.json:', err);
    return false;
  }
}

export async function GET(req: NextRequest) {
  try {
    let allWorkspaces: any[] = [];

    // 1. Fetch from Supabase
    try {
      const { data, error } = await supabaseAdmin
        .from('workspaces')
        .select('*')
        .eq('isActive', true)
        .order('order', { ascending: true });

      if (!error && Array.isArray(data) && data.length > 0) {
        allWorkspaces = data;
      }
    } catch (sbErr) {
      console.warn('Supabase fetch fallback for popular-picks:', sbErr);
    }

    // 2. Fallback to Prisma
    if (allWorkspaces.length === 0) {
      try {
        allWorkspaces = await (prisma as any).workspace.findMany({
          where: { isActive: true },
          orderBy: { order: 'asc' },
        });
      } catch (dbErr) {
        console.warn('Prisma fetch fallback for popular-picks:', dbErr);
      }
    }

    // 3. Fallback to localStore
    if (allWorkspaces.length === 0) {
      const localList = Array.from(localStore.workspaces?.values() || []);
      allWorkspaces = localList
        .filter((w) => w.isActive !== false)
        .sort((a, b) => (a.order || 1) - (b.order || 1));
    }

    // Parse specs and media
    const formatted = allWorkspaces.map((w: any) => {
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

    const featuredIds = getStoredFeaturedIds();
    let popularPicks: any[] = [];

    if (featuredIds.length > 0) {
      // Map existing workspaces according to featuredIds order
      const workspaceMap = new Map(formatted.map((w) => [w.id, w]));
      for (const id of featuredIds) {
        const item = workspaceMap.get(id);
        if (item) {
          popularPicks.push(item);
        }
      }

      // If fewer than 10, fill up to 10 with other available workspaces
      if (popularPicks.length < 10) {
        const chosenIdSet = new Set(popularPicks.map((p) => p.id));
        for (const item of formatted) {
          if (!chosenIdSet.has(item.id) && popularPicks.length < 10) {
            popularPicks.push(item);
            chosenIdSet.add(item.id);
          }
        }
      }
    } else {
      // Default: top 10 items
      popularPicks = formatted.slice(0, 10);
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
    saveStoredFeaturedIds(cleanedIds);

    return NextResponse.json({
      success: true,
      featuredIds: cleanedIds,
      message: 'Popular Picks top 10 list saved successfully',
    });
  } catch (error: any) {
    console.error('Error in /api/popular-picks POST:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update popular picks' },
      { status: 500 }
    );
  }
}
