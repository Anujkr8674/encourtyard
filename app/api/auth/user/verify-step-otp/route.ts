import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and 6-digit verification code are required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanedOtp = otp.toString().trim();

    const dbOtp = await prisma.otpVerification.findFirst({
      where: {
        email: normalizedEmail,
        otpCode: cleanedOtp,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!dbOtp) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code. Please check your inbox or request a new code.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email OTP verified successfully. Please configure your password.',
      verified: true,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
