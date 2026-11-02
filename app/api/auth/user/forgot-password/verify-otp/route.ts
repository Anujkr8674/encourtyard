import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and verification code are required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    // Verify OTP record in database
    const record = await prisma.otpVerification.findFirst({
      where: {
        email: normalizedEmail,
        otpCode: cleanOtp,
        purpose: 'PASSWORD_RESET',
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code. Please request a new code.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code confirmed. You can now set a new password.',
    });
  } catch (error: any) {
    console.error('Forgot password verify-otp error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to verify code. Please try again.' },
      { status: 500 }
    );
  }
}
