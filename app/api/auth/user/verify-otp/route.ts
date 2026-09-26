import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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
        { error: 'Invalid or expired OTP. Please verify the code or request a new one.' },
        { status: 400 }
      );
    }

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

    // Generate 30-day persistent JWT token
    const token = await signUserToken({
      id: verifiedDbUser.id,
      email: verifiedDbUser.email,
      name: verifiedDbUser.name,
      role: verifiedDbUser.role,
      isEmailVerified: true,
      company: verifiedDbUser.company,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Account verified successfully! Welcome to EnCourtyard.',
      user: {
        id: verifiedDbUser.id,
        name: verifiedDbUser.name,
        email: verifiedDbUser.email,
        phone: verifiedDbUser.phone,
        company: verifiedDbUser.company,
        role: verifiedDbUser.role,
        avatarUrl: verifiedDbUser.avatarUrl,
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
