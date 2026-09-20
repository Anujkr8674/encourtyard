import { NextResponse } from 'next/server';
import { prisma, isLiveDbConfigured, localStore, LocalUser } from '@/lib/prisma';
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

    let createdUser: LocalUser | null = null;

    // 1. Save in Supabase PostgreSQL
    try {
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

      if (dbUser) {
        createdUser = {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          phone: dbUser.phone,
          passwordHash: dbUser.passwordHash,
          company: dbUser.company,
          role: dbUser.role,
          isEmailVerified: true,
          avatarUrl: dbUser.avatarUrl,
          createdAt: dbUser.createdAt,
          updatedAt: dbUser.updatedAt,
        };
      }
    } catch (dbErr) {
      console.warn('⚠️ [Prisma DB Warning]:', dbErr);
    }

    // 2. Also keep in Local Store for instant cache
    if (!createdUser) {
      const existing = localStore.users?.get(normalizedEmail);
      createdUser = {
        id: existing?.id || `user_${Date.now()}`,
        name: name || existing?.name || 'Valued Member',
        email: normalizedEmail,
        phone: phone || existing?.phone || null,
        company: company || existing?.company || null,
        passwordHash,
        role: 'USER',
        isEmailVerified: true,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normalizedEmail)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      localStore.users?.set(normalizedEmail, createdUser);
    }

    // Generate 30-day persistent JWT session token
    const token = await signUserToken({
      id: createdUser.id,
      email: createdUser.email,
      name: createdUser.name,
      role: createdUser.role,
      isEmailVerified: true,
      company: createdUser.company,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Account created and verified successfully! Welcome to EnCourtyard.',
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        phone: createdUser.phone,
        company: createdUser.company,
        role: createdUser.role,
        avatarUrl: createdUser.avatarUrl,
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
