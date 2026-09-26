import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabaseAdmin, STORAGE_BUCKET, GALLERY_STORAGE_FOLDER } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { heading, description, order } = body;

    const updateData: any = {};
    if (heading !== undefined) updateData.heading = heading?.trim() || null;
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (order !== undefined) updateData.order = order;

    const image = await prisma.galleryImage.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      image,
      message: 'Image metadata updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating gallery image in DB:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Image not found in database' }, { status: 404 });
    }
    return NextResponse.json(
      { error: error.message || 'Failed to update image in database' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Find and Delete from Prisma Database
    const deletedImage = await prisma.galleryImage.delete({
      where: { id }
    });

    const imageUrl = deletedImage.url;

    // 2. Try to delete the file from Supabase Storage if it's hosted there
    if (imageUrl && imageUrl.includes(STORAGE_BUCKET)) {
      try {
        const urlParts = imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        if (fileName) {
          const filePath = `${GALLERY_STORAGE_FOLDER}/${fileName}`;
          await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([filePath]);
        }
      } catch (storageErr) {
        console.warn('Could not delete file from Supabase Storage:', storageErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully from database and storage'
    });
  } catch (error: any) {
    console.error('Error deleting gallery image from DB:', error);
    if (error.code === 'P2025') {
       // Item was already deleted or doesn't exist
       return NextResponse.json({ success: true, message: 'Image was already deleted' });
    }
    return NextResponse.json(
      { error: error.message || 'Failed to delete image from database' },
      { status: 500 }
    );
  }
}
