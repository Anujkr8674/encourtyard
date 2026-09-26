import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { sendOtpEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, password, company } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required fields.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser && existingUser.isEmailVerified) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in.' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Generate 6-Digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Upsert user in Prisma
    const user = await prisma.user.upsert({
      where: { email: normalizedEmail },
      update: {
        name: name.trim(),
        phone: phone ? phone.trim() : null,
        passwordHash,
        company: company ? company.trim() : null,
        isEmailVerified: false,
      },
      create: {
        name: name.trim(),
        email: normalizedEmail,
        phone: phone ? phone.trim() : null,
        passwordHash,
        company: company ? company.trim() : null,
        isEmailVerified: false,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normalizedEmail)}`,
      },
    });

    // Insert OTP record
    await prisma.otpVerification.create({
      data: {
        email: normalizedEmail,
        otpCode,
        purpose: 'SIGNUP_VERIFICATION',
        expiresAt,
      },
    });

    // Send OTP via Nodemailer (with console fallback)
    await sendOtpEmail({
      toEmail: normalizedEmail,
      name: user.name,
      otp: otpCode,
      purpose: 'Account Registration & Verification',
    });

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${normalizedEmail}`,
      email: normalizedEmail,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('❌ [Signup Route Error]:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
