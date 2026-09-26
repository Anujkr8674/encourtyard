import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ttnpipktscpmoujueslv.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

// Public client for browser / public operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client with service role for backend operations that bypass RLS
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey !== 'sb_secret_4jx2b_replace_with_your_secret_key' ? supabaseServiceKey : supabaseAnonKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export const STORAGE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'encourtyard-upload';
export const CATEGORY_STORAGE_FOLDER = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_FOLDER || 'category';
export const STORAGE_FOLDER = CATEGORY_STORAGE_FOLDER;
export const WORKSPACE_STORAGE_FOLDER = 'work-space';

/**
 * Uploads an image file to Supabase Storage in bucket 'encourtyard-upload' under 'category/'
 */
export async function uploadCategoryImage(file: Buffer | Blob | File, fileName: string, contentType?: string): Promise<string> {
  const cleanFileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const filePath = `${CATEGORY_STORAGE_FOLDER}/${cleanFileName}`;

  try {
    const { error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        contentType: contentType || 'image/jpeg',
        upsert: true,
      });

    if (error) {
      console.warn('Supabase storage category upload warning:', error.message);
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl || `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${filePath}`;
  } catch (err: any) {
    console.error('Failed to upload image to Supabase:', err);
    return `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${filePath}`;
  }
}

/**
 * Uploads an image or video file to Supabase Storage in bucket 'encourtyard-upload' under 'work-space/'
 */
export async function uploadWorkspaceMedia(file: Buffer | Blob | File, fileName: string, contentType?: string): Promise<string> {
  const cleanFileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const filePath = `${WORKSPACE_STORAGE_FOLDER}/${cleanFileName}`;

  try {
    const { error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        contentType: contentType || 'image/jpeg',
        upsert: true,
      });

    if (error) {
      console.warn('Supabase storage workspace media upload warning:', error.message);
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl || `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${filePath}`;
  } catch (err: any) {
    console.error('Failed to upload workspace media to Supabase:', err);
    return `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${filePath}`;
  }
}

export const GALLERY_STORAGE_FOLDER = 'gallery';

/**
 * Uploads an image file to Supabase Storage in bucket 'encourtyard-upload' under 'gallery/'
 */
export async function uploadGalleryImage(file: Buffer | Blob | File, fileName: string, contentType?: string): Promise<string> {
  const cleanFileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const filePath = `${GALLERY_STORAGE_FOLDER}/${cleanFileName}`;

  try {
    const { error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        contentType: contentType || 'image/jpeg',
        upsert: true,
      });

    if (error) {
      console.warn('Supabase storage gallery image upload warning:', error.message);
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl || `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${filePath}`;
  } catch (err: any) {
    console.error('Failed to upload gallery image to Supabase:', err);
    return `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${filePath}`;
  }
}
