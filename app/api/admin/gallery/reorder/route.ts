import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { updates } = body; // Expects an array of { id: string, order: number }

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: 'Valid updates array is required' }, { status: 400 });
    }

    // Update in Prisma using transaction for safety
    await prisma.$transaction(
      updates.map((update) => {
        return prisma.galleryImage.update({
          where: { id: update.id },
          data: { order: update.order }
        });
      })
    );

    return NextResponse.json({
      success: true,
      message: 'Gallery reordered successfully in database'
    });
  } catch (error: any) {
    console.error('Error reordering gallery images in DB:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to reorder images in database' },
      { status: 500 }
    );
  }
}
