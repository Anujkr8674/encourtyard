import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOtpEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: 'Please enter your registered email address.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check if user exists in database
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email address. Please check your spelling or create an account.' },
        { status: 404 }
      );
    }

    // 2. Generate 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 3. Invalidate any previous unused password reset OTPs for this email
    await prisma.otpVerification.updateMany({
      where: {
        email: normalizedEmail,
        purpose: 'PASSWORD_RESET',
        isUsed: false,
      },
      data: {
        isUsed: true,
      },
    });

    // 4. Save new OTP in Prisma
    await prisma.otpVerification.create({
      data: {
        email: normalizedEmail,
        otpCode,
        purpose: 'PASSWORD_RESET',
        expiresAt,
        userId: user.id,
      },
    });

    // 5. Send authentic OTP email via Nodemailer
    await sendOtpEmail({
      toEmail: normalizedEmail,
      name: user.name || 'Member',
      otp: otpCode,
      purpose: 'Password Reset & Account Recovery',
    });

    return NextResponse.json({
      success: true,
      message: 'A 6-digit verification code has been sent to your email.',
      email: normalizedEmail,
    });
  } catch (error: any) {
    console.error('Forgot password send-otp error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to send verification code. Please try again later.' },
      { status: 500 }
    );
  }
}
