import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get('q')?.toLowerCase().trim() || '';
    const status = req.nextUrl.searchParams.get('status')?.toLowerCase() || 'all';
    const role = req.nextUrl.searchParams.get('role')?.toUpperCase() || 'ALL';

    // Fetch ONLY actual registered users from Prisma database
    const dbUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Map strictly to the fields present in public.users schema
    let members = dbUsers.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone || null,
      company: u.company || null,
      role: u.role || 'USER',
      isEmailVerified: Boolean(u.isEmailVerified),
      avatarUrl: u.avatarUrl || null,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));

    // Filter by search query (id, name, email, phone, company)
    if (q) {
      members = members.filter(
        (m) =>
          m.name?.toLowerCase().includes(q) ||
          m.email?.toLowerCase().includes(q) ||
          (m.phone && m.phone.toLowerCase().includes(q)) ||
          (m.company && m.company.toLowerCase().includes(q)) ||
          m.role?.toLowerCase().includes(q) ||
          m.id?.toLowerCase().includes(q)
      );
    }

    // Filter by verification status
    if (status === 'verified') {
      members = members.filter((m) => m.isEmailVerified);
    } else if (status === 'unverified') {
      members = members.filter((m) => !m.isEmailVerified);
    }

    // Filter by role
    if (role !== 'ALL') {
      members = members.filter((m) => m.role === role);
    }

    return NextResponse.json({
      success: true,
      members,
      total: members.length,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Failed to fetch members' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, company, role, isEmailVerified } = body;

    if (!name || !email) {
      return NextResponse.json({ success: false, error: 'Name and Email are required' }, { status: 400 });
    }

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ success: false, error: 'A member with this email already exists' }, { status: 400 });
    }

    // Create user strictly matching public.users schema
    const createdUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : null,
        company: company ? company.trim() : null,
        role: role === 'ADMIN' ? 'ADMIN' : 'USER',
        isEmailVerified: Boolean(isEmailVerified),
        passwordHash: '$2b$10$defaultHashForAdminCreatedMembers77263',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Member profile created successfully',
      member: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        phone: createdUser.phone,
        company: createdUser.company,
        role: createdUser.role,
        isEmailVerified: createdUser.isEmailVerified,
        avatarUrl: createdUser.avatarUrl,
        createdAt: createdUser.createdAt,
        updatedAt: createdUser.updatedAt,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Failed to create member profile' }, { status: 500 });
  }
}
