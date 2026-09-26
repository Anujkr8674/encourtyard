import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signUserToken, USER_COOKIE_NAME, SESSION_DURATION_SECONDS } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp, password, name, phone, company } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await hashPassword(password);

    // Mark OTP as used
    if (otp) {
      await prisma.otpVerification.updateMany({
        where: { email: normalizedEmail, otpCode: otp.toString().trim() },
        data: { isUsed: true },
      });
    }

    // Upsert User
    const dbUser = await prisma.user.upsert({
      where: { email: normalizedEmail },
      update: {
        name: name || undefined,
        phone: phone || undefined,
        company: company || undefined,
        passwordHash,
        isEmailVerified: true,
      },
      create: {
        name: name || 'Valued Member',
        email: normalizedEmail,
        phone: phone || null,
        company: company || null,
        passwordHash,
        isEmailVerified: true,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normalizedEmail)}`,
      },
    });

    // Generate 30-day persistent JWT session token
    const token = await signUserToken({
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
      isEmailVerified: true,
      company: dbUser.company,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Account created and verified successfully! Welcome to EnCourtyard.',
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        phone: dbUser.phone,
        company: dbUser.company,
        role: dbUser.role,
        avatarUrl: dbUser.avatarUrl,
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
    const message = error instanceof Error ? error.message : 'Registration completion failed';
    console.error('❌ [Complete Signup Route Error]:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
