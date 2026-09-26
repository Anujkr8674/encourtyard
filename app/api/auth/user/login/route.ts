import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, signUserToken, USER_COOKIE_NAME, SESSION_DURATION_SECONDS } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email address. Please sign up first.' },
        { status: 404 }
      );
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Incorrect password. Please verify your credentials and try again.' },
        { status: 401 }
      );
    }

    if (!user.isEmailVerified) {
      return NextResponse.json(
        {
          error: 'Please verify your email address to complete registration.',
          requiresVerification: true,
          email: user.email,
        },
        { status: 403 }
      );
    }

    // Generate 30-day persistent JWT token
    const token = await signUserToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isEmailVerified: true,
      company: user.company,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Signed in successfully! Welcome back.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        company: user.company,
        role: user.role,
        avatarUrl: user.avatarUrl,
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
    const message = error instanceof Error ? error.message : 'Failed to sign in';
    console.error('❌ [Login Route Error]:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
