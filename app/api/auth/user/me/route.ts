import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma, isLiveDbConfigured, localStore } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    let fullUser = localStore.users?.get(session.email);

    if (isLiveDbConfigured) {
      try {
        const dbUser = await prisma.user.findUnique({
          where: { id: session.id },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            company: true,
            role: true,
            avatarUrl: true,
            isEmailVerified: true,
            createdAt: true,
          },
        });

        if (dbUser) {
          return NextResponse.json({
            authenticated: true,
            user: dbUser,
          });
        }
      } catch (err) {
        console.warn('⚠️ [Prisma DB Warning]:', err);
      }
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.id,
        name: fullUser?.name || session.name,
        email: session.email,
        phone: fullUser?.phone || null,
        company: fullUser?.company || session.company || null,
        role: session.role,
        avatarUrl: fullUser?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(session.email)}`,
        isEmailVerified: session.isEmailVerified,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
