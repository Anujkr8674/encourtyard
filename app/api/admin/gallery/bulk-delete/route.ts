import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabaseAdmin, STORAGE_BUCKET, GALLERY_STORAGE_FOLDER } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Valid array of IDs is required' }, { status: 400 });
    }

    // 1. Fetch images to get their URLs for storage deletion
    const imagesToDelete = await prisma.galleryImage.findMany({
      where: { id: { in: ids } }
    });

    // 2. Delete from Prisma Database
    await prisma.galleryImage.deleteMany({
      where: { id: { in: ids } }
    });

    // 3. Try to delete files from Supabase Storage
    const filePaths = imagesToDelete
      .map(img => img.url)
      .filter(url => url && url.includes(STORAGE_BUCKET))
      .map(url => {
        const urlParts = url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        return fileName ? `${GALLERY_STORAGE_FOLDER}/${fileName}` : null;
      })
      .filter(Boolean) as string[];

    if (filePaths.length > 0) {
      try {
        await supabaseAdmin.storage.from(STORAGE_BUCKET).remove(filePaths);
      } catch (storageErr) {
        console.warn('Could not delete some files from Supabase Storage:', storageErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `${imagesToDelete.length} images deleted successfully`
    });
  } catch (error: any) {
    console.error('Error in bulk delete gallery images:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to bulk delete images' },
      { status: 500 }
    );
  }
}
