import { NextRequest, NextResponse } from 'next/server';
import { uploadQrCodeImage } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No valid QR code file provided' }, { status: 400 });
    }

    const upiId = (formData.get('upiId') as string) || 'encourtyard@upi';
    const merchantName = (formData.get('merchantName') as string) || 'EnCourtyard Architectural Coworking';
    const methodName = (formData.get('name') as string) || 'Primary UPI QR Code';
    const notes = (formData.get('notes') as string) || 'Scan using any UPI app (GPay, PhonePe, Paytm, BHIM). After payment, enter your 12-digit UTR number and upload screenshot.';

    // Read the file into a buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload directly to Supabase Storage: encourtyard-upload/qr-code/<filename>
    const url = await uploadQrCodeImage(
      buffer,
      (file as any).name || 'qr-code.png',
      file.type || 'image/png'
    );

    // Auto-persist to DB immediately so it is NEVER lost on page reload!
    const methodsSetting = await prisma.systemSetting.findUnique({
      where: { key: 'qr_payment_methods' },
    });
    let currentMethods: any[] = [];
    if (methodsSetting?.value) {
      try {
        currentMethods = JSON.parse(methodsSetting.value);
      } catch {
        currentMethods = [];
      }
    }

    // Mark previous as inactive
    currentMethods.forEach((m) => (m.isActive = false));

    const newMethod = {
      id: `qr-${Date.now()}`,
      name: methodName,
      qrCodeUrl: url,
      upiId: upiId.trim(),
      merchantName: merchantName.trim(),
      notes: notes.trim(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    currentMethods.unshift(newMethod);

    await Promise.all([
      prisma.systemSetting.upsert({
        where: { key: 'qr_payment_methods' },
        update: { value: JSON.stringify(currentMethods) },
        create: { key: 'qr_payment_methods', value: JSON.stringify(currentMethods) },
      }),
      prisma.systemSetting.upsert({
        where: { key: 'qr_code_config' },
        update: {
          value: JSON.stringify({
            enabled: true,
            qrCodeUrl: url,
            upiId: upiId.trim(),
            merchantName: merchantName.trim(),
            notes: notes.trim(),
          }),
        },
        create: {
          key: 'qr_code_config',
          value: JSON.stringify({
            enabled: true,
            qrCodeUrl: url,
            upiId: upiId.trim(),
            merchantName: merchantName.trim(),
            notes: notes.trim(),
          }),
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      url,
      method: newMethod,
      methods: currentMethods,
      message: 'QR Code uploaded to Supabase Storage under qr-code/ and activated in database successfully',
    });
  } catch (error: any) {
    console.error('Error uploading QR code:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload QR code' },
      { status: 500 }
    );
  }
}
