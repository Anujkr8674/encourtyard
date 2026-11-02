import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, email, phone, company, role, isEmailVerified } = body;

    const existing = await prisma.user.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : existing.name,
        email: email !== undefined ? email.trim().toLowerCase() : existing.email,
        phone: phone !== undefined ? (phone ? phone.trim() : null) : existing.phone,
        company: company !== undefined ? (company ? company.trim() : null) : existing.company,
        role: role !== undefined ? (role === 'ADMIN' ? 'ADMIN' : 'USER') : existing.role,
        isEmailVerified: isEmailVerified !== undefined ? Boolean(isEmailVerified) : existing.isEmailVerified,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Member profile updated successfully',
      updated: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        company: updatedUser.company,
        role: updatedUser.role,
        isEmailVerified: updatedUser.isEmailVerified,
        avatarUrl: updatedUser.avatarUrl,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Failed to update member' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Member profile deleted successfully',
      id,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Failed to delete member' }, { status: 500 });
  }
}
