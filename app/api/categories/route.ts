import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' }
    });

    // Format categories to parse features array
    const formatted = categories.map((cat) => {
      let featuresArray: string[] = [];
      if (cat.features) {
        try {
          const parsed = JSON.parse(cat.features);
          if (Array.isArray(parsed)) featuresArray = parsed;
        } catch {}
      }

      return {
        ...cat,
        features: featuresArray,
        badge: cat.badge || (featuresArray.length > 0 ? JSON.stringify(featuresArray) : null),
      };
    });

    return NextResponse.json({
      success: true,
      categories: formatted,
      count: formatted.length,
    });
  } catch (error: any) {
    console.error('Error in GET /api/categories:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
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

    const newSlug = `${slug}-${Date.now().toString().slice(-4)}`;
    const badgeJson = JSON.stringify(featuresArray);
    const featuresJson = JSON.stringify(featuresArray);

    const createdCategory = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: newSlug,
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        capacity: capacity?.trim() || null,
        badge: badgeJson,
        features: featuresJson,
        order: typeof order === 'number' ? order : 1,
        isActive: isActive !== false,
      }
    });

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
