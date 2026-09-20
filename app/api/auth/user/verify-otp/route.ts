import { NextResponse } from 'next/server';
import { prisma, isLiveDbConfigured, localStore } from '@/lib/prisma';
import { signUserToken, USER_COOKIE_NAME, SESSION_DURATION_SECONDS } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and 6-digit OTP code are required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanedOtp = otp.toString().trim();

    let isOtpValid = false;
    let targetUser = localStore.users?.get(normalizedEmail);

    // 1. Check in Prisma DB if live
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
          isOtpValid = true;
          // Mark OTP used
          await prisma.otpVerification.update({
            where: { id: dbOtp.id },
            data: { isUsed: true },
          });

          // Verify user in DB
          const verifiedDbUser = await prisma.user.update({
            where: { email: normalizedEmail },
            data: { isEmailVerified: true },
          });

          if (verifiedDbUser) {
            targetUser = {
              id: verifiedDbUser.id,
              name: verifiedDbUser.name,
              email: verifiedDbUser.email,
              phone: verifiedDbUser.phone,
              passwordHash: verifiedDbUser.passwordHash,
              company: verifiedDbUser.company,
              role: verifiedDbUser.role,
              isEmailVerified: true,
              avatarUrl: verifiedDbUser.avatarUrl,
              createdAt: verifiedDbUser.createdAt,
              updatedAt: verifiedDbUser.updatedAt,
            };
          }
        }
      } catch (dbErr) {
        console.warn('⚠️ [Prisma DB Warning]:', dbErr);
      }
    }

    // 2. Check in Local Store
    if (!isOtpValid) {
      const localOtp = localStore.otps?.get(normalizedEmail);
      if (
        localOtp &&
        localOtp.otpCode === cleanedOtp &&
        !localOtp.isUsed &&
        new Date(localOtp.expiresAt) > new Date()
      ) {
        isOtpValid = true;
        localOtp.isUsed = true;
        if (targetUser) {
          targetUser.isEmailVerified = true;
          localStore.users?.set(normalizedEmail, targetUser);
        }
      }
    }

    if (!isOtpValid || !targetUser) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP. Please verify the code or request a new one.' },
        { status: 400 }
      );
    }

    // Generate 30-day persistent JWT token
    const token = await signUserToken({
      id: targetUser.id,
      email: targetUser.email,
      name: targetUser.name,
      role: targetUser.role,
      isEmailVerified: true,
      company: targetUser.company,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Account verified successfully! Welcome to EnCourtyard.',
      user: {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        phone: targetUser.phone,
        company: targetUser.company,
        role: targetUser.role,
        avatarUrl: targetUser.avatarUrl,
      },
    });

    // Set 30-day persistent HTTP-only cookie
    response.cookies.set({
      name: USER_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION_SECONDS,
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to verify OTP';
    console.error('❌ [Verify OTP Route Error]:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
