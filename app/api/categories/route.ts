import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function getLocalCategoriesFallback(): any[] {
  try {
    const filePath = path.join(process.cwd(), 'data', 'local_categories.json');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read local_categories.json:', err);
  }
  return [];
}

// Helper to parse features from badge column or features field
export function parseCategoryFeatures(cat: any): string[] {
  let featuresArray: string[] = [];

  // Try features field first
  if (cat.features) {
    if (Array.isArray(cat.features)) {
      featuresArray = cat.features.map((f: any) => String(f || '').trim()).filter(Boolean);
    } else if (typeof cat.features === 'string' && cat.features.trim()) {
      try {
        const parsed = JSON.parse(cat.features);
        if (Array.isArray(parsed)) {
          featuresArray = parsed.map((f: any) => String(f || '').trim()).filter(Boolean);
        }
      } catch {
        // Not JSON
      }
    }
  }

  // If empty, try badge column
  if (featuresArray.length === 0 && cat.badge) {
    if (typeof cat.badge === 'string' && cat.badge.trim()) {
      try {
        const parsed = JSON.parse(cat.badge);
        if (Array.isArray(parsed)) {
          featuresArray = parsed.map((f: any) => String(f || '').trim()).filter(Boolean);
        } else if (typeof parsed === 'string') {
          featuresArray = [parsed.trim()];
        }
      } catch {
        // Plain text badge
        featuresArray = [cat.badge.trim()];
      }
    }
  }

  // If still empty, provide standard contextual defaults (4 items max)
  if (featuresArray.length === 0) {
    const name = (cat.name || '').toLowerCase();
    if (name.includes('office') || name.includes('private')) {
      featuresArray = [
        '24/7 Biometric keyless access',
        'Acoustic soundproofing walls',
        'Dedicated 1Gbps fiber VLAN',
        'Daily executive concierge service'
      ];
    } else if (name.includes('desk') && !name.includes('hot')) {
      featuresArray = [
        'High-speed WiFi 6 & LAN drops',
        'Ergonomic seating & motorized standing desk',
        'Access to common botanical lounges & phone booths',
        'Weekly networking masterclasses & community mixer'
      ];
    } else if (name.includes('hot') || name.includes('flex')) {
      featuresArray = [
        'Unrestricted flex zone seating across all floors',
        'Unlimited artisanal espresso & gourmet tea bar',
        'Access to soundproof phone booths for calls',
        'Exclusive access to community networking events'
      ];
    } else if (name.includes('meeting') || name.includes('room') || name.includes('board')) {
      featuresArray = [
        'Dual Sony 4K Pro HDR Displays',
        'Neat Bar Pro AI video conferencing auto-tracking',
        'Ceiling-integrated beamforming acoustic mics',
        'Direct butler concierge service for tea & catering'
      ];
    } else if (name.includes('podcast') || name.includes('studio') || name.includes('media')) {
      featuresArray = [
        'Acoustic double-wall sound isolation booth (STC 65)',
        '4x Shure SM7B broadcast dynamic microphones with Cloudlifters',
        'Dual Blackmagic Cinema 4K studio cameras & softbox lights',
        'Rødecaster Pro II audio mixing console with instant multi-track'
      ];
    } else if (name.includes('team') || name.includes('enterprise')) {
      featuresArray = [
        'Private internal 6-person meeting pod inside your suite',
        'Dedicated server rack / private subnet VLAN',
        'Custom corporate wall branding & signboards',
        'Dedicated enterprise account & concierge manager'
      ];
    } else if (name.includes('virtual')) {
      featuresArray = [
        'Prestigious prime commercial address for GST & MCA',
        'Daily mail handling & digital package scanning notifications',
        'Discounted meeting room member rates across all centers',
        'Dedicated local telephone answering with IVR greeting'
      ];
    } else {
      featuresArray = [
        'High-speed WiFi 6 & VLAN connectivity',
        'Acoustic soundproofing & ergonomic furniture',
        'Access to botanical lounges & espresso bar',
        '24/7 keyless access & concierge support'
      ];
    }
  }

  return featuresArray.slice(0, 4);
}

export async function GET() {
  try {
    let categories: any[] = [];

    // 1. Query Supabase directly
    try {
      const { data, error } = await supabaseAdmin
        .from('categories')
        .select('*')
        .order('order', { ascending: true });

      if (!error && Array.isArray(data) && data.length > 0) {
        categories = data;
      }
    } catch (sbErr) {
      console.warn('Supabase categories fetch warning:', sbErr);
    }

    // 2. Fallback to local JSON file
    if (categories.length === 0) {
      const localList = getLocalCategoriesFallback();
      categories = localList.sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    // Format categories with parsed features array
    const formatted = categories.map((cat: any) => {
      const features = parseCategoryFeatures(cat);
      return {
        ...cat,
        features,
        badge: cat.badge || (features.length > 0 ? JSON.stringify(features) : null),
      };
    });

    return NextResponse.json({
      success: true,
      categories: formatted,
      count: formatted.length,
    });
  } catch (error: any) {
    console.error('Error in GET /api/categories:', error);
    const fallbackList = getLocalCategoriesFallback();
    return NextResponse.json({
      success: true,
      categories: fallbackList,
      count: fallbackList.length,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, imageUrl, capacity, badge, features, order, isActive } = body;

    if (!name || !description || !imageUrl) {
      return NextResponse.json(
        { error: 'Name, description, and image URL are required' },
        { status: 400 }
      );
    }

    const slug = body.slug
      ? body.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Clean features
    let featuresArray: string[] = [];
    if (Array.isArray(features)) {
      featuresArray = features.map((f: any) => String(f || '').trim()).filter(Boolean).slice(0, 4);
    } else if (typeof features === 'string') {
      try {
        const parsed = JSON.parse(features);
        if (Array.isArray(parsed)) {
          featuresArray = parsed.map((f: any) => String(f || '').trim()).filter(Boolean).slice(0, 4);
        }
      } catch {
        featuresArray = [features.trim()];
      }
    } else if (badge) {
      try {
        const parsed = JSON.parse(badge);
        if (Array.isArray(parsed)) featuresArray = parsed.slice(0, 4);
        else featuresArray = [badge];
      } catch {
        featuresArray = [badge];
      }
    }

    const newId = `cat-${Date.now()}`;
    const newSlug = `${slug}-${Date.now().toString().slice(-4)}`;
    const badgeJson = JSON.stringify(featuresArray);

    const newCategoryData = {
      id: newId,
      name: name.trim(),
      slug: newSlug,
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      capacity: capacity?.trim() || null,
      badge: badgeJson,
      order: typeof order === 'number' ? order : 1,
      isActive: isActive !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let createdCategory = newCategoryData;

    // Save directly to Supabase
    try {
      const { data, error } = await supabaseAdmin
        .from('categories')
        .insert(newCategoryData)
        .select()
        .single();

      if (!error && data) {
        createdCategory = data;
      }
    } catch (sbErr) {
      console.warn('Supabase category create fallback:', sbErr);
    }

    // Also persist to local JSON
    try {
      const filePath = path.join(process.cwd(), 'data', 'local_categories.json');
      const currentList = getLocalCategoriesFallback();
      const updatedList = [createdCategory, ...currentList.filter(c => c.id !== createdCategory.id)];
      fs.writeFileSync(filePath, JSON.stringify(updatedList, null, 2), 'utf-8');
    } catch (fsErr) {
      console.warn('Could not write category to local_categories.json:', fsErr);
    }

    return NextResponse.json({
      success: true,
      category: {
        ...createdCategory,
        features: featuresArray,
      },
      message: 'Category created successfully',
    });
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create category' },
      { status: 500 }
    );
  }
}
