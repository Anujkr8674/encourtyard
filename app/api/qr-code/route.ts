import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [configSetting, methodsSetting] = await Promise.all([
      prisma.systemSetting.findUnique({ where: { key: 'qr_code_config' } }),
      prisma.systemSetting.findUnique({ where: { key: 'qr_payment_methods' } }),
    ]);

    let config = {
      enabled: true,
      qrCodeUrl: '',
      upiId: 'encourtyard@upi',
      merchantName: 'EnCourtyard Architectural Coworking',
      notes: 'Scan using any UPI app (GPay, PhonePe, Paytm, BHIM). After payment, enter your 12-digit UTR number and upload screenshot.',
    };

    if (configSetting?.value) {
      try {
        config = { ...config, ...JSON.parse(configSetting.value) };
      } catch {
        // default fallback
      }
    }

    // If config.qrCodeUrl is missing, check methods setting
    if (!config.qrCodeUrl && methodsSetting?.value) {
      try {
        const methods = JSON.parse(methodsSetting.value);
        if (Array.isArray(methods) && methods.length > 0) {
          const activeMethod = methods.find((m: any) => m.isActive) || methods[0];
          if (activeMethod?.qrCodeUrl) {
            config.qrCodeUrl = activeMethod.qrCodeUrl;
            config.upiId = activeMethod.upiId || config.upiId;
            config.merchantName = activeMethod.merchantName || config.merchantName;
          }
        }
      } catch {
        // ignore
      }
    }

    return NextResponse.json({
      success: true,
      config,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to load QR code config' },
      { status: 500 }
    );
  }
}
