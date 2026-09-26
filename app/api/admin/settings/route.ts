import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSmtpConfig } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await prisma.systemSetting.findMany();
    const smtp = getSmtpConfig();

    const notifyNewBookingSetting = settings.find(s => s.key === 'admin_email_notify_new_booking');
    const notifyStatusUpdateSetting = settings.find(s => s.key === 'admin_email_notify_status_update');

    const notifyNewBooking = notifyNewBookingSetting?.value !== 'false';
    const notifyStatusUpdate = notifyStatusUpdateSetting?.value !== 'false';

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

    if (body.admin_email_notify_new_booking !== undefined) {
      await prisma.systemSetting.upsert({
        where: { key: 'admin_email_notify_new_booking' },
        update: { value: String(body.admin_email_notify_new_booking) },
        create: { key: 'admin_email_notify_new_booking', value: String(body.admin_email_notify_new_booking) }
      });
    }

    if (body.admin_email_notify_status_update !== undefined) {
      await prisma.systemSetting.upsert({
        where: { key: 'admin_email_notify_status_update' },
        update: { value: String(body.admin_email_notify_status_update) },
        create: { key: 'admin_email_notify_status_update', value: String(body.admin_email_notify_status_update) }
      });
    }

    const settings = await prisma.systemSetting.findMany();
    const notifyNewBookingSetting = settings.find(s => s.key === 'admin_email_notify_new_booking');
    const notifyStatusUpdateSetting = settings.find(s => s.key === 'admin_email_notify_status_update');

    return NextResponse.json({
      success: true,
      message: 'Admin notification preferences saved successfully',
      settings: {
        admin_email_notify_new_booking: notifyNewBookingSetting?.value !== 'false',
        admin_email_notify_status_update: notifyStatusUpdateSetting?.value !== 'false',
      },
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to update settings';
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
