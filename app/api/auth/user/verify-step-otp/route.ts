import { NextResponse } from 'next/server';
import { prisma, isLiveDbConfigured, localStore } from '@/lib/prisma';

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

    let isValid = false;

    // 1. Check in Prisma DB
    if (isLiveDbConfigured) {
      try {
        const dbOtp = await prisma.otpVerification.findFirst({
          where: {
            email: normalizedEmail,
            otpCode: cleanedOtp,
            isUsed: false,
            expiresAt: { gt: new Date() },
          },
          orderBy: { createdAt: 'desc' },
        });

        if (dbOtp) {
          isValid = true;
        }
      } catch (err) {
        console.warn('⚠️ [Prisma DB Warning]:', err);
      }
    }

    // 2. Check in Local Store
    if (!isValid) {
      const localOtp = localStore.otps?.get(normalizedEmail);
      if (
        localOtp &&
        localOtp.otpCode === cleanedOtp &&
        !localOtp.isUsed &&
        new Date(localOtp.expiresAt) > new Date()
      ) {
        isValid = true;
      }
    }

    if (!isValid) {
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
