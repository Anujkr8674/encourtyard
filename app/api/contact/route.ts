import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, company, spaceInterest, tourDate, message } = body;

    // Server-side validations
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Full name is required (minimum 2 characters).' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'A valid work email address is required.' },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
      return NextResponse.json(
        { success: false, error: 'A valid contact phone number is required (minimum 7 digits).' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'Please include a message describing your space needs (minimum 5 characters).' },
        { status: 400 }
      );
    }

    const inquiryId = crypto.randomUUID();
    const nowIso = new Date().toISOString();

    const newInquiry = {
      id: inquiryId,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      company: company && typeof company === 'string' ? company.trim() : null,
      spaceInterest: spaceInterest && typeof spaceInterest === 'string' ? spaceInterest.trim() : 'private-office',
      tourDate: tourDate && typeof tourDate === 'string' ? tourDate.trim() : null,
      message: message.trim(),
      status: 'PENDING',
      adminNotes: null,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const { data, error } = await supabaseAdmin
      .from('contact_inquiries')
      .insert([newInquiry])
      .select()
      .single();

    if (error) {
      console.error('Supabase error inserting contact inquiry:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to save contact inquiry to database.' },
        { status: 500 }
      );
    }

    // Attempt broadcast on realtime channel if available
    try {
      const channel = supabaseAdmin.channel('admin-realtime-notifications');
      channel.send({
        type: 'broadcast',
        event: 'new-inquiry',
        payload: {
          id: inquiryId,
          fullName: newInquiry.fullName,
          email: newInquiry.email,
          spaceInterest: newInquiry.spaceInterest,
          createdAt: nowIso,
        },
      });
    } catch (realtimeErr) {
      console.warn('Realtime broadcast warning:', realtimeErr);
    }

    return NextResponse.json({
      success: true,
      inquiryId,
      message: 'Thank you! Your inquiry has been submitted and saved successfully.',
      inquiry: data,
    });
  } catch (error: any) {
    console.error('API /api/contact error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error processing contact submission.' },
      { status: 500 }
    );
  }
}
