import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOtpEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Full Name and Email Address are required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already registered and verified
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    
    if (existing && existing.isEmailVerified) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in.' },
        { status: 409 }
      );
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save pending info in Prisma
    await prisma.user.upsert({
      where: { email: normalizedEmail },
      update: {
        name: name.trim(),
        phone: phone ? phone.trim() : null,
        company: company ? company.trim() : null,
      },
      create: {
        name: name.trim(),
        email: normalizedEmail,
        phone: phone ? phone.trim() : null,
        company: company ? company.trim() : null,
        passwordHash: '',
        role: 'USER',
        isEmailVerified: false,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normalizedEmail)}`,
      }
    });

    // Save OTP in Prisma
    await prisma.otpVerification.create({
      data: {
        email: normalizedEmail,
        otpCode,
        purpose: 'SIGNUP_STEP_VERIFICATION',
        expiresAt,
      },
    });

    // Send Real Email via Google SMTP (Nodemailer)
    const emailResult = await sendOtpEmail({
      toEmail: normalizedEmail,
      name: name.trim(),
      otp: otpCode,
      purpose: 'New Member Registration',
    });

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${normalizedEmail}`,
      email: normalizedEmail,
      simulated: emailResult.simulated,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('❌ [Send OTP Route Error]:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
