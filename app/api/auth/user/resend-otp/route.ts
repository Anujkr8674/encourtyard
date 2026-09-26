import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOtpEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const targetUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    const userName = targetUser?.name || 'Valued Member';

    // Generate fresh OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Save in Prisma
    await prisma.otpVerification.create({
      data: {
        email: normalizedEmail,
        otpCode,
        purpose: 'SIGNUP_VERIFICATION',
        expiresAt,
      },
    });

    // Send email
    await sendOtpEmail({
      toEmail: normalizedEmail,
      name: userName,
      otp: otpCode,
      purpose: 'Verification Code Resend',
    });

    return NextResponse.json({
      success: true,
      message: `A new 6-digit verification code has been dispatched to ${normalizedEmail}`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to resend OTP';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
