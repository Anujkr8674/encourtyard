import { NextRequest, NextResponse } from 'next/server';
import { uploadCategoryImage, STORAGE_BUCKET, STORAGE_FOLDER } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided for category upload' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = file.name || 'category_image.jpg';
    const contentType = file.type || 'image/jpeg';

    // Upload directly to Supabase Storage: encourtyard-upload/category/<filename>
    const publicUrl = await uploadCategoryImage(buffer, fileName, contentType);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      bucket: STORAGE_BUCKET,
      folder: STORAGE_FOLDER,
      fileName,
      size: file.size,
    });
  } catch (error: any) {
    console.error('Error in category image upload:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload category image' },
      { status: 500 }
    );
  }
}
