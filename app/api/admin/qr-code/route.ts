import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

import { supabaseAdmin, STORAGE_BUCKET, QR_CODE_STORAGE_FOLDER } from '@/lib/supabase';

export interface QrPaymentMethod {
  id: string;
  name: string;
  qrCodeUrl: string;
  upiId: string;
  merchantName: string;
  notes: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_QR_CONFIG = {
  enabled: true,
  qrCodeUrl: '',
  upiId: 'encourtyard@upi',
  merchantName: 'EnCourtyard Architectural Coworking',
  notes: 'Scan using any UPI app (GPay, PhonePe, Paytm, BHIM). After payment, enter your 12-digit UTR number and upload screenshot.',
};

export async function GET() {
  try {
    const [configSetting, methodsSetting] = await Promise.all([
      prisma.systemSetting.findUnique({ where: { key: 'qr_code_config' } }),
      prisma.systemSetting.findUnique({ where: { key: 'qr_payment_methods' } }),
    ]);

    let config = DEFAULT_QR_CONFIG;
    if (configSetting?.value) {
      try {
        config = { ...DEFAULT_QR_CONFIG, ...JSON.parse(configSetting.value) };
      } catch {
        config = DEFAULT_QR_CONFIG;
      }
    }

    let methods: QrPaymentMethod[] = [];
    if (methodsSetting?.value) {
      try {
        methods = JSON.parse(methodsSetting.value);
      } catch {
        methods = [];
      }
    }

    // If methods array is empty, check if files exist in Supabase storage qr-code/ folder
    if (methods.length === 0) {
      try {
        const { data: storageFiles } = await supabaseAdmin.storage
          .from(STORAGE_BUCKET)
          .list(QR_CODE_STORAGE_FOLDER, {
            sortBy: { column: 'created_at', order: 'desc' },
          });

        const validFiles = (storageFiles || []).filter(
          (f) => f.name && !f.name.startsWith('.') && f.metadata?.size !== 0
        );

        if (validFiles.length > 0) {
          methods = validFiles.map((file, idx) => {
            const { data } = supabaseAdmin.storage
              .from(STORAGE_BUCKET)
              .getPublicUrl(`${QR_CODE_STORAGE_FOLDER}/${file.name}`);
            return {
              id: `qr-${file.id || idx}-${Date.now()}`,
              name: `Supabase Storage QR (${file.name})`,
              qrCodeUrl: data.publicUrl,
              upiId: config.upiId || 'encourtyard@upi',
              merchantName: config.merchantName || 'EnCourtyard Architectural Coworking',
              notes: config.notes || DEFAULT_QR_CONFIG.notes,
              isActive: idx === 0, // Most recent file is active
              createdAt: file.created_at || new Date().toISOString(),
              updatedAt: file.updated_at || new Date().toISOString(),
            };
          });

          if (methods.length > 0) {
            config.qrCodeUrl = methods[0].qrCodeUrl;
            await Promise.all([
              prisma.systemSetting.upsert({
                where: { key: 'qr_payment_methods' },
                update: { value: JSON.stringify(methods) },
                create: { key: 'qr_payment_methods', value: JSON.stringify(methods) },
              }),
              prisma.systemSetting.upsert({
                where: { key: 'qr_code_config' },
                update: { value: JSON.stringify(config) },
                create: { key: 'qr_code_config', value: JSON.stringify(config) },
              }),
            ]);
          }
        } else if (config.qrCodeUrl) {
          // Fallback if config has qrCodeUrl but methods was empty
          const initialMethod: QrPaymentMethod = {
            id: `qr-${Date.now()}`,
            name: 'Primary UPI QR Code',
            qrCodeUrl: config.qrCodeUrl,
            upiId: config.upiId || 'encourtyard@upi',
            merchantName: config.merchantName || 'EnCourtyard Architectural Coworking',
            notes: config.notes || DEFAULT_QR_CONFIG.notes,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          methods = [initialMethod];
          await prisma.systemSetting.upsert({
            where: { key: 'qr_payment_methods' },
            update: { value: JSON.stringify(methods) },
            create: { key: 'qr_payment_methods', value: JSON.stringify(methods) },
          });
        }
      } catch (storageErr) {
        console.warn('Could not scan Supabase qr-code folder:', storageErr);
      }
    }

    // Ensure the active method matches config.qrCodeUrl
    const activeMethod = methods.find((m) => m.isActive) || methods[0];
    if (activeMethod && (!config.qrCodeUrl || config.qrCodeUrl !== activeMethod.qrCodeUrl)) {
      config.qrCodeUrl = activeMethod.qrCodeUrl;
      config.upiId = activeMethod.upiId || config.upiId;
      config.merchantName = activeMethod.merchantName || config.merchantName;
    }

    return NextResponse.json({
      success: true,
      config,
      methods,
    });
  } catch (error: any) {
    console.error('Error fetching QR code config and methods:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch QR configuration' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action = 'save_config' } = body;

    // Fetch current methods
    const methodsSetting = await prisma.systemSetting.findUnique({
      where: { key: 'qr_payment_methods' },
    });
    let currentMethods: QrPaymentMethod[] = [];
    if (methodsSetting?.value) {
      try {
        currentMethods = JSON.parse(methodsSetting.value);
      } catch {
        currentMethods = [];
      }
    }

    // Action 1: Set specific method as ACTIVE
    if (action === 'set_active') {
      const { id } = body;
      currentMethods = currentMethods.map((m) => ({
        ...m,
        isActive: m.id === id,
      }));

      const selected = currentMethods.find((m) => m.id === id);
      if (selected) {
        await prisma.systemSetting.upsert({
          where: { key: 'qr_code_config' },
          update: {
            value: JSON.stringify({
              enabled: true,
              qrCodeUrl: selected.qrCodeUrl,
              upiId: selected.upiId,
              merchantName: selected.merchantName,
              notes: selected.notes || DEFAULT_QR_CONFIG.notes,
            }),
          },
          create: {
            key: 'qr_code_config',
            value: JSON.stringify({
              enabled: true,
              qrCodeUrl: selected.qrCodeUrl,
              upiId: selected.upiId,
              merchantName: selected.merchantName,
              notes: selected.notes || DEFAULT_QR_CONFIG.notes,
            }),
          },
        });
      }

      await prisma.systemSetting.upsert({
        where: { key: 'qr_payment_methods' },
        update: { value: JSON.stringify(currentMethods) },
        create: { key: 'qr_payment_methods', value: JSON.stringify(currentMethods) },
      });

      return NextResponse.json({
        success: true,
        message: 'Active QR payment method updated successfully',
        methods: currentMethods,
        activeMethod: selected,
      });
    }

    // Action 2: Delete a method
    if (action === 'delete_method') {
      const { id } = body;
      currentMethods = currentMethods.filter((m) => m.id !== id);

      // If we deleted the active one, activate the first remaining one
      if (currentMethods.length > 0 && !currentMethods.some((m) => m.isActive)) {
        currentMethods[0].isActive = true;
        await prisma.systemSetting.upsert({
          where: { key: 'qr_code_config' },
          update: {
            value: JSON.stringify({
              enabled: true,
              qrCodeUrl: currentMethods[0].qrCodeUrl,
              upiId: currentMethods[0].upiId,
              merchantName: currentMethods[0].merchantName,
              notes: currentMethods[0].notes || DEFAULT_QR_CONFIG.notes,
            }),
          },
          create: {
            key: 'qr_code_config',
            value: JSON.stringify({
              enabled: true,
              qrCodeUrl: currentMethods[0].qrCodeUrl,
              upiId: currentMethods[0].upiId,
              merchantName: currentMethods[0].merchantName,
              notes: currentMethods[0].notes || DEFAULT_QR_CONFIG.notes,
            }),
          },
        });
      }

      await prisma.systemSetting.upsert({
        where: { key: 'qr_payment_methods' },
        update: { value: JSON.stringify(currentMethods) },
        create: { key: 'qr_payment_methods', value: JSON.stringify(currentMethods) },
      });

      return NextResponse.json({
        success: true,
        message: 'Payment method deleted successfully',
        methods: currentMethods,
      });
    }

    // Action 3: General Save Config & Details
    const { enabled, qrCodeUrl, upiId, merchantName, notes, methodName } = body;

    const cleanUpi = (upiId || 'encourtyard@upi').trim();
    const cleanMerchant = (merchantName || 'EnCourtyard Architectural Coworking').trim();
    const cleanNotes = (notes || DEFAULT_QR_CONFIG.notes).trim();
    const cleanQrUrl = qrCodeUrl || '';

    const configToSave = {
      enabled: enabled !== false,
      qrCodeUrl: cleanQrUrl,
      upiId: cleanUpi,
      merchantName: cleanMerchant,
      notes: cleanNotes,
    };

    // If qrCodeUrl is present, update or create in methods table
    if (cleanQrUrl) {
      const existingIndex = currentMethods.findIndex((m) => m.qrCodeUrl === cleanQrUrl);
      if (existingIndex >= 0) {
        currentMethods[existingIndex].upiId = cleanUpi;
        currentMethods[existingIndex].merchantName = cleanMerchant;
        currentMethods[existingIndex].notes = cleanNotes;
        currentMethods[existingIndex].updatedAt = new Date().toISOString();
        if (body.makeActive !== false) {
          currentMethods.forEach((m) => (m.isActive = false));
          currentMethods[existingIndex].isActive = true;
        }
      } else {
        // Mark others inactive and push new one
        currentMethods.forEach((m) => (m.isActive = false));
        const newMethod: QrPaymentMethod = {
          id: `qr-${Date.now()}`,
          name: methodName || 'Official UPI QR Code',
          qrCodeUrl: cleanQrUrl,
          upiId: cleanUpi,
          merchantName: cleanMerchant,
          notes: cleanNotes,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        currentMethods.unshift(newMethod);
      }

      await prisma.systemSetting.upsert({
        where: { key: 'qr_payment_methods' },
        update: { value: JSON.stringify(currentMethods) },
        create: { key: 'qr_payment_methods', value: JSON.stringify(currentMethods) },
      });
    }

    await prisma.systemSetting.upsert({
      where: { key: 'qr_code_config' },
      update: { value: JSON.stringify(configToSave) },
      create: { key: 'qr_code_config', value: JSON.stringify(configToSave) },
    });

    return NextResponse.json({
      success: true,
      message: 'QR Code settings and payment methods table updated successfully',
      config: configToSave,
      methods: currentMethods,
    });
  } catch (error: any) {
    console.error('Error updating QR code config:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update QR configuration' },
      { status: 500 }
    );
  }
}
