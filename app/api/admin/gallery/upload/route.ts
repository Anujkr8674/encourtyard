import { NextRequest, NextResponse } from 'next/server';
import { uploadGalleryImage } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No valid file provided' }, { status: 400 });
    }

    // Read the file into a buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Upload directly to Supabase Storage: encourtyard-upload/gallery/<filename>
    const url = await uploadGalleryImage(
      buffer,
      file.name || 'image.jpg',
      file.type || 'image/jpeg'
    );

    return NextResponse.json({
      success: true,
      url,
      message: 'File uploaded successfully'
    });
  } catch (error: any) {
    console.error('Error uploading gallery image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}
