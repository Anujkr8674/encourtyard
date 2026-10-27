import { NextResponse } from 'next/server';
import { getCurrentUser, signUserToken, USER_COOKIE_NAME, SESSION_DURATION_SECONDS } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        avatarUrl: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch profile';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, company, avatarUrl } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: {
        name: name.trim(),
        phone: phone ? phone.trim() : null,
        company: company ? company.trim() : null,
        avatarUrl: avatarUrl ? avatarUrl.trim() : null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        avatarUrl: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Refresh JWT session token with updated name and company
    const newSessionToken = await signUserToken({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      isEmailVerified: updatedUser.isEmailVerified,
      company: updatedUser.company,
    });

    const response = NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'Profile updated successfully',
    });

    response.cookies.set({
      name: USER_COOKIE_NAME,
      value: newSessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_DURATION_SECONDS,
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update profile';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
