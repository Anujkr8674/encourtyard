import { NextRequest, NextResponse } from 'next/server';
import { uploadPaymentProof } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No valid payment proof file provided' }, { status: 400 });
    }

    // Read the file into a buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload directly to Supabase Storage: encourtyard-upload/payment-proof/<filename>
    const url = await uploadPaymentProof(
      buffer,
      (file as any).name || 'payment-proof.jpg',
      file.type || 'image/jpeg'
    );

    return NextResponse.json({
      success: true,
      url,
      message: 'Payment proof screenshot uploaded to Supabase Storage under payment-proof/ successfully',
    });
  } catch (error: any) {
    console.error('Error uploading payment proof:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload payment proof' },
      { status: 500 }
    );
  }
}
