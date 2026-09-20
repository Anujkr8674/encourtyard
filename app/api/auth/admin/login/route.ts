import { NextResponse } from 'next/server';
import { validateAdminCredentials, signAdminToken, ADMIN_COOKIE_NAME, SESSION_DURATION_SECONDS } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, password } = body;

    if (!id || !password) {
      return NextResponse.json(
        { error: 'Admin ID and Password are required.' },
        { status: 400 }
      );
    }

    const isValid = validateAdminCredentials(id, password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid Admin credentials. Please check your Admin ID and Password in .env.' },
        { status: 401 }
      );
    }

    const adminPayload = {
      adminId: process.env.ADMIN_ID || 'Admin',
      name: process.env.ADMIN_NAME || 'Super Administrator',
      email: process.env.ADMIN_EMAIL || 'admin@encourtyard.com',
      role: 'ADMIN' as const,
      isSuperAdmin: true,
    };

    const token = await signAdminToken(adminPayload);

    const response = NextResponse.json({
      success: true,
      message: 'Admin authenticated successfully. Welcome to Command Center.',
      admin: adminPayload,
    });

    // Set 30-day persistent HTTP-only cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION_SECONDS,
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Admin authentication failed';
    console.error('❌ [Admin Login Error]:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
