import { NextResponse } from 'next/server';
import { USER_COOKIE_NAME, ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully.',
    });

    // Explicitly delete both user and admin session cookies
    response.cookies.delete(USER_COOKIE_NAME);
    response.cookies.delete(ADMIN_COOKIE_NAME);

    response.cookies.set({
      name: USER_COOKIE_NAME,
      value: '',
      httpOnly: true,
      expires: new Date(0),
      maxAge: 0,
      path: '/',
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: '',
      httpOnly: true,
      expires: new Date(0),
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to logout';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
