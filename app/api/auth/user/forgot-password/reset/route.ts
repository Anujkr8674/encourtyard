import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp, newPassword, confirmPassword } = body;

    if (!email || !otp || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match. Please verify both fields.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    // 1. Verify OTP record in database
    const record = await prisma.otpVerification.findFirst({
      where: {
        email: normalizedEmail,
        otpCode: cleanOtp,
        purpose: 'PASSWORD_RESET',
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      return NextResponse.json(
        { error: 'Invalid or expired verification session. Please restart the forgot password process.' },
        { status: 400 }
      );
    }

    // 2. Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // 3. Update user password in database
    const updatedUser = await prisma.user.update({
      where: { email: normalizedEmail },
      data: {
        passwordHash,
        updatedAt: new Date(),
      },
    });

    // 4. Mark OTP record as used so it cannot be reused
    await prisma.otpVerification.update({
      where: { id: record.id },
      data: { isUsed: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Password has been successfully updated. You can now sign in with your new password.',
      user: {
        email: updatedUser.email,
        name: updatedUser.name,
      },
    });
  } catch (error: any) {
    console.error('Forgot password reset error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to reset password. Please try again later.' },
      { status: 500 }
    );
  }
}
