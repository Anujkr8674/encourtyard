import { NextRequest, NextResponse } from 'next/server';
import { uploadWorkspaceMedia, STORAGE_BUCKET, WORKSPACE_STORAGE_FOLDER } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      // Check single file fallback
      const singleFile = formData.get('file') as File | null;
      if (singleFile) {
        files.push(singleFile);
      } else {
        return NextResponse.json(
          { error: 'No media files provided for workspace upload' },
          { status: 400 }
        );
      }
    }

    const uploadedFiles: Array<{
      url: string;
      type: 'image' | 'video';
      name: string;
      size: number;
    }> = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = file.name || `workspace-media-${Date.now()}`;
      const contentType = file.type || 'image/jpeg';
      const isVideo = contentType.startsWith('video/');

      // Upload directly into Supabase Storage: encourtyard-upload/work-space/<filename>
      const publicUrl = await uploadWorkspaceMedia(buffer, fileName, contentType);

      uploadedFiles.push({
        url: publicUrl,
        type: isVideo ? 'video' : 'image',
        name: fileName,
        size: file.size,
      });
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      bucket: STORAGE_BUCKET,
      folder: WORKSPACE_STORAGE_FOLDER,
      count: uploadedFiles.length,
    });
  } catch (error: any) {
    console.error('Error in workspace media upload:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload workspace media files' },
      { status: 500 }
    );
  }
}
