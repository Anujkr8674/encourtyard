import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({
      success: true,
      images,
      count: images.length,
    });
  } catch (error: any) {
    console.error('Error in GET /api/admin/gallery:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch gallery images from database' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, heading, description, order } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    const image = await prisma.galleryImage.create({
      data: {
        id: `img-${Date.now()}`,
        url,
        heading: heading?.trim() || null,
        description: description?.trim() || null,
        order: typeof order === 'number' ? order : 0,
      }
    });

    return NextResponse.json({
      success: true,
      image,
      message: 'Image added to gallery database',
    });
  } catch (error: any) {
    console.error('Error adding gallery image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add image to database' },
      { status: 500 }
    );
  }
}
