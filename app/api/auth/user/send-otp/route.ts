import { NextResponse } from 'next/server';
import { prisma, isLiveDbConfigured, localStore, LocalUser, LocalOtp } from '@/lib/prisma';
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
    if (isLiveDbConfigured) {
      try {
        const existing = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });
        if (existing && existing.isEmailVerified) {
          return NextResponse.json(
            { error: 'An account with this email already exists. Please sign in.' },
            { status: 409 }
          );
        }
      } catch (err) {
        console.warn('⚠️ [Prisma DB Warning]:', err);
      }
    }

    const existingLocal = localStore.users?.get(normalizedEmail);
    if (existingLocal && existingLocal.isEmailVerified) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in.' },
        { status: 409 }
      );
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store in local store
    const otpData: LocalOtp = {
      id: `otp_${Date.now()}`,
      email: normalizedEmail,
      otpCode,
      purpose: 'SIGNUP_STEP_VERIFICATION',
      expiresAt,
      isUsed: false,
      createdAt: new Date(),
    };
    localStore.otps?.set(normalizedEmail, otpData);

    // Save pending info
    const pendingData: LocalUser = {
      id: existingLocal?.id || `user_${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      phone: phone ? phone.trim() : null,
      passwordHash: '',
      company: company ? company.trim() : null,
      role: 'USER',
      isEmailVerified: false,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normalizedEmail)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    localStore.users?.set(normalizedEmail, pendingData);

    // Save in Prisma if live
    if (isLiveDbConfigured) {
      try {
        await prisma.otpVerification.create({
          data: {
            email: normalizedEmail,
            otpCode,
            purpose: 'SIGNUP_STEP_VERIFICATION',
            expiresAt,
          },
        });
      } catch (err) {
        console.warn('⚠️ [Prisma DB Warning]:', err);
      }
    }

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
