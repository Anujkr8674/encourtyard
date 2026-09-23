import { NextRequest, NextResponse } from 'next/server';
import { localStore, syncSettingsToDisk } from '@/lib/prisma';
import { getSmtpConfig } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settingsMap = localStore.settings;
    const smtp = getSmtpConfig();

    const notifyNewBooking = settingsMap.get('admin_email_notify_new_booking')?.value !== 'false';
    const notifyStatusUpdate = settingsMap.get('admin_email_notify_status_update')?.value !== 'false';

    return NextResponse.json({
      success: true,
      settings: {
        admin_email_notify_new_booking: notifyNewBooking,
        admin_email_notify_status_update: notifyStatusUpdate,
        admin_email: smtp.adminEmail,
        smtp_sender: smtp.user,
        smtp_host: smtp.host,
        smtp_port: smtp.port,
        smtp_configured: smtp.isConfigured,
      },
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to fetch settings';
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const settingsMap = localStore.settings;
    const now = new Date();

    if (body.admin_email_notify_new_booking !== undefined) {
      settingsMap.set('admin_email_notify_new_booking', {
        key: 'admin_email_notify_new_booking',
        value: String(body.admin_email_notify_new_booking),
        updatedAt: now,
      });
    }

    if (body.admin_email_notify_status_update !== undefined) {
      settingsMap.set('admin_email_notify_status_update', {
        key: 'admin_email_notify_status_update',
        value: String(body.admin_email_notify_status_update),
        updatedAt: now,
      });
    }

    syncSettingsToDisk();

    return NextResponse.json({
      success: true,
      message: 'Admin notification preferences saved successfully',
      settings: {
        admin_email_notify_new_booking: settingsMap.get('admin_email_notify_new_booking')?.value !== 'false',
        admin_email_notify_status_update: settingsMap.get('admin_email_notify_status_update')?.value !== 'false',
      },
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to update settings';
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
