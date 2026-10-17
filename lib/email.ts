import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user?: string;
  pass?: string;
  from: string;
  adminEmail: string;
  isConfigured: boolean;
}

export function getSmtpConfig(): SmtpConfig {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER || 'encourtyardwebsite@gmail.com';
  const pass = process.env.SMTP_PASS || 'gguhlhwlssuaauic';
  const from = process.env.SMTP_FROM || `"EnCourtyard Workspaces" <${user}>`;
  const adminEmail = process.env.ADMIN_EMAIL || 'anujkr8674@gmail.com';

  const isConfigured = Boolean(
    user &&
    pass &&
    !user.includes('your_email') &&
    !pass.includes('your_16_char')
  );

  return {
    host,
    port,
    secure,
    user,
    pass,
    from,
    adminEmail,
    isConfigured,
  };
}

function createTransporter() {
  const cfg = getSmtpConfig();
  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: {
      user: cfg.user,
      pass: cfg.pass,
    },
  });
}

// ============================================================================
// 1. OTP Verification Email
// ============================================================================
export interface SendOtpEmailParams {
  toEmail: string;
  name: string;
  otp: string;
  purpose?: string;
}

export async function sendOtpEmail({
  toEmail,
  name,
  otp,
  purpose = 'Account Registration & Verification',
}: SendOtpEmailParams): Promise<{ success: boolean; messageId?: string; simulated?: boolean; error?: string }> {
  const cfg = getSmtpConfig();

  console.log('\n======================================================');
  console.log(`🌿 [EnCourtyard Auth] OTP DISPATCH FOR: ${toEmail}`);
  console.log(`🔐 6-DIGIT VERIFICATION CODE: >>> ${otp} <<<`);
  console.log(`⏳ VALID FOR: 10 MINUTES`);
  console.log(`👤 RECIPIENT: ${name}`);
  console.log(`📡 SMTP STATUS: ${cfg.isConfigured ? 'LIVE GOOGLE SMTP' : 'DEVELOPMENT CONSOLE FALLBACK'}`);
  console.log('======================================================\n');

  if (!cfg.isConfigured) {
    return { success: true, simulated: true, messageId: `dev-simulated-${Date.now()}` };
  }

  try {
    const transporter = createTransporter();
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EnCourtyard Verification Code</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF9F5; margin: 0; padding: 24px; color: #181F18; }
          .container { max-width: 540px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; overflow: hidden; border: 1px solid #E5E1D8; box-shadow: 0 12px 32px rgba(26, 38, 26, 0.08); }
          .header { background: #1A261A; padding: 36px 32px; text-align: center; color: #FFFFFF; }
          .logo-text { font-size: 24px; font-weight: 700; letter-spacing: 2px; color: #FFFFFF; margin: 0; }
          .sub-logo { font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #4ADE80; margin-top: 6px; }
          .content { padding: 40px 32px; }
          .greeting { font-size: 20px; font-weight: 700; color: #1A261A; margin-bottom: 12px; }
          .message { font-size: 15px; line-height: 1.6; color: #4F634F; margin-bottom: 28px; }
          .otp-box { background: #F1F5F1; border: 2px dashed #3A4D3A; border-radius: 14px; padding: 22px; text-align: center; margin: 24px 0; }
          .otp-code { font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #1A261A; font-family: monospace; }
          .otp-expiry { font-size: 12px; color: #C05621; margin-top: 8px; font-weight: 600; }
          .footer { background: #F7F5F0; padding: 24px 32px; text-align: center; font-size: 12px; color: #6A806A; border-top: 1px solid #EAE5DB; }
          .note { font-size: 13px; color: #6A806A; line-height: 1.5; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo-text">EnCourtyard</h1>
            <div class="sub-logo">Handcrafted Workspaces & Botanical Sanctuaries</div>
          </div>
          <div class="content">
            <div class="greeting">Hello, ${name}!</div>
            <p class="message">
              Thank you for choosing <strong>EnCourtyard</strong>. To complete your <strong>${purpose}</strong>, please use the 6-digit verification code below:
            </p>
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
              <div class="otp-expiry">⏳ Valid for 10 minutes only</div>
            </div>
            <p class="note">
              🔒 If you did not request this verification code, please ignore this email or contact our support team at <a href="mailto:support@encourtyard.com" style="color: #2E7D32;">support@encourtyard.com</a>.
            </p>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} EnCourtyard Workspaces Ltd. All rights reserved.<br>
          
          </div>
        </div>
      </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: cfg.from,
      to: toEmail,
      subject: `${otp} is your EnCourtyard Verification Code`,
      text: `Your EnCourtyard 6-digit verification code is: ${otp}. It will expire in 10 minutes.`,
      html: htmlContent,
    });

    return { success: true, messageId: info.messageId };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to dispatch email';
    console.error('❌ [Nodemailer SMTP Error - OTP]:', errMessage);
    return { success: true, simulated: true, error: errMessage };
  }
}

// ============================================================================
// 2. Booking Data Interface for Email Templates
// ============================================================================
export interface BookingEmailData {
  id: string;
  fullName: string;
  companyName?: string | null;
  email: string;
  phone: string;
  workspaceTitle: string;
  categoryName?: string;
  locationName?: string;
  plan: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  guests: number;
  totalAmount?: string | number;
  status: string;
  adminNotes?: string | null;
  statusUpdatedAt?: Date | string | null;
  notesUpdatedAt?: Date | string | null;
  createdAt?: Date | string;
}

// ============================================================================
// 3. User Booking Confirmation Email
// ============================================================================
export async function sendBookingConfirmationEmail(
  toEmail: string,
  booking: BookingEmailData,
  recipientLabel?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const cfg = getSmtpConfig();

  console.log('\n======================================================');
  console.log(`🌿 [EnCourtyard Booking] CONFIRMATION DISPATCH TO: ${toEmail} (${recipientLabel || 'User'})`);
  console.log(`📋 BOOKING REF: ${booking.id} | SPACE: ${booking.workspaceTitle}`);
  console.log(`📅 DATES: ${booking.startDate} (${booking.startTime}) -> ${booking.endDate} (${booking.endTime})`);
  console.log('======================================================\n');

  if (!cfg.isConfigured) {
    return { success: true };
  }

  try {
    const transporter = createTransporter();
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EnCourtyard Reservation Confirmation</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF9F5; margin: 0; padding: 24px; color: #181F18; }
          .container { max-width: 580px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; overflow: hidden; border: 1px solid #E5E1D8; box-shadow: 0 12px 32px rgba(26, 38, 26, 0.08); }
          .header { background: #1A261A; padding: 36px 32px; text-align: center; color: #FFFFFF; }
          .logo-text { font-size: 24px; font-weight: 700; letter-spacing: 2px; color: #FFFFFF; margin: 0; }
          .sub-logo { font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #4ADE80; margin-top: 6px; }
          .content { padding: 36px 32px; }
          .badge { display: inline-block; padding: 6px 14px; border-radius: 9999px; background: #E8F5E9; color: #2E7D32; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
          .greeting { font-size: 22px; font-weight: 700; color: #181F18; margin-bottom: 8px; }
          .message { font-size: 14px; line-height: 1.6; color: #5C665C; margin-bottom: 24px; }
          .summary-card { background: #FAF9F5; border: 1px solid #E5E1D8; border-radius: 16px; padding: 20px; margin: 20px 0; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #EAE5DB; font-size: 13px; }
          .row:last-child { border-bottom: none; }
          .row-label { color: #5C665C; }
          .row-val { color: #181F18; font-weight: 600; text-align: right; }
          .total-row { padding-top: 12px; margin-top: 4px; font-size: 15px; font-weight: 700; color: #2E7D32; }
          .ref-pill { display: inline-block; background: #181F18; color: #FFFFFF; font-family: monospace; font-size: 14px; font-weight: 700; padding: 6px 14px; border-radius: 8px; letter-spacing: 1px; }
          .footer { background: #F7F5F0; padding: 24px 32px; text-align: center; font-size: 12px; color: #6A806A; border-top: 1px solid #EAE5DB; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo-text">EnCourtyard</h1>
            <div class="sub-logo">Handcrafted Workspaces & Botanical Sanctuaries</div>
          </div>
          <div class="content">
            <div class="badge">Booking Confirmed • ${booking.status}</div>
            <div class="greeting">Hello, ${booking.fullName}!</div>
            <p class="message">
              Thank you for reserving your workspace sanctuary at <strong>EnCourtyard</strong>. We have registered your reservation and reserved your seats.
            </p>

            <div style="text-align: center; margin: 20px 0;">
              <span style="font-size: 11px; text-transform: uppercase; color: #738273; display: block; margin-bottom: 4px; font-weight: 600;">Booking Reference</span>
              <span class="ref-pill">${booking.id}</span>
            </div>

            <div class="summary-card">
              <div class="row">
                <span class="row-label">Workspace:</span>
                <span class="row-val">${booking.workspaceTitle} (${booking.categoryName || 'Sanctuary'})</span>
              </div>
              <div class="row">
                <span class="row-label">Location:</span>
                <span class="row-val">${booking.locationName || 'Maruthi Plaza, Khairtabad, Hyderabad'}</span>
              </div>
              <div class="row">
                <span class="row-label">From:</span>
                <span class="row-val">${booking.startDate} at ${booking.startTime}</span>
              </div>
              <div class="row">
                <span class="row-label">To:</span>
                <span class="row-val">${booking.endDate} at ${booking.endTime}</span>
              </div>
              <div class="row">
                <span class="row-label">Rental Plan:</span>
                <span class="row-val" style="text-transform: capitalize;">${booking.plan}</span>
              </div>
              <div class="row">
                <span class="row-label">Seats / Pax:</span>
                <span class="row-val">${booking.guests} Seat${booking.guests > 1 ? 's' : ''}</span>
              </div>
              ${booking.companyName ? `
              <div class="row">
                <span class="row-label">Company:</span>
                <span class="row-val">${booking.companyName}</span>
              </div>` : ''}
              <div class="row total-row">
                <span class="row-label" style="color: #181F18;">Total Estimated:</span>
                <span class="row-val">${booking.totalAmount || 'Flexible Plan'}</span>
              </div>
            </div>

            <p style="font-size: 13px; color: #5C665C; line-height: 1.6;">
              🌿 <strong>What happens next:</strong> Our executive hospitality concierge will verify your team details, configure your high-speed WiFi VLAN subnet, and prepare your arrival credentials.
            </p>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} EnCourtyard Workspaces Ltd. All rights reserved.<br>
            Khairtabad Botanical Sanctuary • Need help? Reply directly or WhatsApp us at +91 99082 09993.
          </div>
        </div>
      </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: cfg.from,
      to: toEmail,
      subject: `EnCourtyard Reservation Confirmed: ${booking.workspaceTitle} (${booking.id})`,
      text: `Your EnCourtyard booking (${booking.id}) for "${booking.workspaceTitle}" has been received for ${booking.startDate} (${booking.startTime}) to ${booking.endDate} (${booking.endTime}). Total: ${booking.totalAmount || 'Flexible'}.`,
      html: htmlContent,
    });

    return { success: true, messageId: info.messageId };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to dispatch booking confirmation';
    console.error('❌ [Nodemailer SMTP Error - User Confirmation]:', errMessage);
    return { success: true, error: errMessage };
  }
}

// ============================================================================
// 4. Admin New Booking Alert Email
// ============================================================================
export async function sendAdminNewBookingNotification(
  booking: BookingEmailData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const cfg = getSmtpConfig();

  console.log('\n======================================================');
  console.log(`🚨 [EnCourtyard Admin Alert] NEW BOOKING CREATED`);
  console.log(`📬 SENDING ADMIN NOTIFICATION TO: ${cfg.adminEmail}`);
  console.log(`👤 HOST: ${booking.fullName} | COMPANY: ${booking.companyName || 'N/A'}`);
  console.log(`📞 PHONE: ${booking.phone} | EMAIL: ${booking.email}`);
  console.log(`🏢 WORKSPACE: ${booking.workspaceTitle} (${booking.plan})`);
  console.log('======================================================\n');

  if (!cfg.isConfigured) {
    return { success: true };
  }

  try {
    const transporter = createTransporter();
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Booking Alert - EnCourtyard Admin</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F4F6F4; margin: 0; padding: 24px; color: #181F18; }
          .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 18px; overflow: hidden; border: 1px solid #D5DDD5; }
          .header { background: #263626; padding: 24px 28px; color: #FFFFFF; }
          .header h2 { margin: 0; font-size: 20px; font-weight: 700; color: #4ADE80; }
          .header p { margin: 4px 0 0 0; font-size: 12px; color: #C5D5C5; }
          .content { padding: 28px; }
          .card { background: #FAF9F5; border: 1px solid #E5E1D8; border-radius: 12px; padding: 16px; margin: 16px 0; }
          .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; border-bottom: 1px solid #EDE9E1; }
          .row:last-child { border-bottom: none; }
          .btn { display: inline-block; padding: 12px 24px; background: #2E7D32; color: #FFFFFF !important; font-weight: 700; font-size: 13px; text-decoration: none; border-radius: 10px; margin-top: 16px; }
          .footer { background: #EFECE6; padding: 16px 28px; font-size: 11px; color: #738273; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>⚡ New Reservation Received</h2>
            <p>A user has placed a new workspace booking request</p>
          </div>
          <div class="content">
            <p style="font-size: 14px; margin-top: 0;">
              <strong>Booking Reference:</strong> <span style="font-family: monospace; background: #E3EBE3; padding: 2px 8px; border-radius: 6px; font-weight: bold;">${booking.id}</span>
            </p>

            <div class="card">
              <div class="row"><span><strong>Client Name:</strong></span><span>${booking.fullName}</span></div>
              <div class="row"><span><strong>Company:</strong></span><span>${booking.companyName || 'Not specified'}</span></div>
              <div class="row"><span><strong>Email:</strong></span><span>${booking.email}</span></div>
              <div class="row"><span><strong>Phone:</strong></span><span>${booking.phone}</span></div>
              <div class="row"><span><strong>Workspace:</strong></span><span>${booking.workspaceTitle}</span></div>
              <div class="row"><span><strong>Plan & Seats:</strong></span><span>${booking.plan} • ${booking.guests} Pax</span></div>
              <div class="row"><span><strong>From:</strong></span><span>${booking.startDate} (${booking.startTime})</span></div>
              <div class="row"><span><strong>To:</strong></span><span>${booking.endDate} (${booking.endTime})</span></div>
              <div class="row"><span><strong>Status:</strong></span><span style="color: #E65100; font-weight: bold;">${booking.status}</span></div>
              <div class="row"><span><strong>Estimated Amount:</strong></span><span style="color: #2E7D32; font-weight: bold;">${booking.totalAmount || 'Custom'}</span></div>
            </div>

            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/bookings" class="btn">
                Open Admin Bookings Dashboard →
              </a>
            </div>
          </div>
          <div class="footer">
            EnCourtyard Automated Admin Dispatcher • Sent to ${cfg.adminEmail}
          </div>
        </div>
      </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: cfg.from,
      to: cfg.adminEmail,
      subject: `🚨 [New Booking] ${booking.workspaceTitle} - ${booking.fullName} (${booking.id})`,
      text: `New reservation placed: ${booking.id} by ${booking.fullName} (${booking.email}, ${booking.phone}) for ${booking.workspaceTitle}.`,
      html: htmlContent,
    });

    return { success: true, messageId: info.messageId };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to dispatch admin notification';
    console.error('❌ [Nodemailer SMTP Error - Admin Alert]:', errMessage);
    return { success: true, error: errMessage };
  }
}

// ============================================================================
// 5. Booking Status Update Email (Dispatched to User on Admin Status Change)
// ============================================================================
export async function sendStatusUpdateEmail(
  toEmail: string,
  booking: BookingEmailData,
  recipientLabel?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const cfg = getSmtpConfig();

  console.log('\n======================================================');
  console.log(`🌿 [EnCourtyard Status Update] DISPATCH TO: ${toEmail} (${recipientLabel || 'User'})`);
  console.log(`📋 BOOKING REF: ${booking.id} | NEW STATUS: >>> ${booking.status} <<<`);
  console.log(`📝 ADMIN NOTES: ${booking.adminNotes || 'None'}`);
  console.log('======================================================\n');

  if (!cfg.isConfigured) {
    return { success: true };
  }

  try {
    const transporter = createTransporter();

    const normalizedStatus = (booking.status || '').toUpperCase().trim();

    // Status-specific template configuration
    let statusBadge = `STATUS UPDATED: ${booking.status}`;
    let statusBg = '#E8F5E9';
    let statusTextColor = '#2E7D32';
    let statusBorderColor = '#4ADE80';
    let emailSubject = `EnCourtyard Booking Status Updated: ${booking.id} is now ${booking.status}`;
    let headline = `Hello, ${booking.fullName}!`;
    let statusMessage = `The status of your reservation <strong>${booking.id}</strong> for <strong>${booking.workspaceTitle}</strong> has been updated to <strong>${booking.status}</strong>.`;
    let nextStepsBox = '';

    if (normalizedStatus === 'CONFIRMED') {
      statusBadge = 'RESERVATION CONFIRMED';
      statusBg = '#E8F5E9';
      statusTextColor = '#1B5E20';
      statusBorderColor = '#2E7D32';
      emailSubject = `✅ Reservation Confirmed: Your workspace at EnCourtyard is ready (${booking.id})`;
      headline = 'Your Workspace Reservation is Officially Confirmed!';
      statusMessage = `Great news! Your booking for <strong>${booking.workspaceTitle}</strong> (Ref: <strong>${booking.id}</strong>) has been approved and confirmed by the EnCourtyard team. Your workspace will be fully prepared for your arrival.`;
      nextStepsBox = `
        <div style="background: #F1F8E9; border: 1px solid #C5E1A5; border-radius: 12px; padding: 16px 20px; margin: 20px 0; font-size: 13px; color: #2E7D32; line-height: 1.6;">
          <strong style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #1B5E20; margin-bottom: 6px;">Check-In & Arrival Guidelines:</strong>
          • Present this confirmation email or booking ID at the EnCourtyard reception on arrival.<br>
          • Unlimited artisan tea, coffee, and high-speed Wi-Fi access will be ready.<br>
          • Reserved duration: <strong>${booking.startDate} (${booking.startTime})</strong> to <strong>${booking.endDate} (${booking.endTime})</strong>.
        </div>
      `;
    } else if (normalizedStatus === 'PENDING') {
      statusBadge = 'RESERVATION PENDING REVIEW';
      statusBg = '#FFF8E1';
      statusTextColor = '#B78103';
      statusBorderColor = '#F59E0B';
      emailSubject = `⏳ Booking Received: Reservation ${booking.id} is Pending Review`;
      headline = 'Your Reservation Request is Under Review';
      statusMessage = `Thank you for choosing EnCourtyard. Your booking request for <strong>${booking.workspaceTitle}</strong> (Ref: <strong>${booking.id}</strong>) is currently in <strong>Pending</strong> status while our concierge team verifies scheduling and seat allocation.`;
      nextStepsBox = `
        <div style="background: #FFFBEB; border: 1px solid #FCD34D; border-radius: 12px; padding: 16px 20px; margin: 20px 0; font-size: 13px; color: #92400E; line-height: 1.6;">
          <strong style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #78350F; margin-bottom: 6px;">What to Expect Next:</strong>
          • No immediate action is required from you. Our team is reviewing your schedule.<br>
          • You will receive an email update as soon as the reservation status is confirmed.<br>
          • For urgent queries or instant booking verification, chat with us on WhatsApp at +91 99082 09993.
        </div>
      `;
    } else if (normalizedStatus === 'COMPLETED' || normalizedStatus === 'COMPLETE') {
      statusBadge = 'SESSION COMPLETED';
      statusBg = '#EFF6FF';
      statusTextColor = '#1E40AF';
      statusBorderColor = '#3B82F6';
      emailSubject = `✨ Booking Completed: Thank you for working with EnCourtyard (${booking.id})`;
      headline = 'Thank You for Working at EnCourtyard!';
      statusMessage = `Your workspace session for booking <strong>${booking.id}</strong> (<strong>${booking.workspaceTitle}</strong>) has been marked as <strong>Completed</strong>. We truly hope you had a productive, inspiring, and comfortable work session.`;
      nextStepsBox = `
        <div style="background: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 12px; padding: 16px 20px; margin: 20px 0; font-size: 13px; color: #0369A1; line-height: 1.6;">
          <strong style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #0C4A6E; margin-bottom: 6px;">We Look Forward to Seeing You Again:</strong>
          • Need to reserve your next day pass, private cabin, or conference room? Book anytime on our portal.<br>
          • Have feedback or custom team requirements? Simply reply to this email to connect with our team.
        </div>
      `;
    } else if (normalizedStatus === 'CANCELLED' || normalizedStatus === 'CANCELED') {
      statusBadge = 'BOOKING CANCELLED';
      statusBg = '#FEF2F2';
      statusTextColor = '#B91C1C';
      statusBorderColor = '#EF4444';
      emailSubject = `⚠️ Reservation Cancellation: Booking ${booking.id}`;
      headline = 'Your Workspace Reservation Has Been Cancelled';
      statusMessage = `This is to notify you that your booking <strong>${booking.id}</strong> for <strong>${booking.workspaceTitle}</strong> scheduled for <strong>${booking.startDate}</strong> has been <strong>Cancelled</strong>.`;
      nextStepsBox = `
        <div style="background: #FFF5F5; border: 1px solid #FECACA; border-radius: 12px; padding: 16px 20px; margin: 20px 0; font-size: 13px; color: #991B1B; line-height: 1.6;">
          <strong style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #7F1D1D; margin-bottom: 6px;">Important Information:</strong>
          • If you requested this cancellation or if a refund applies, our support desk will process it per policy.<br>
          • If this was cancelled by mistake or you need to reschedule, reach out to us at <a href="mailto:support@encourtyard.com" style="color: #DC2626; font-weight: bold; text-decoration: underline;">support@encourtyard.com</a> or call +91 99082 09993.
        </div>
      `;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${emailSubject}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF9F5; margin: 0; padding: 24px; color: #181F18; }
          .container { max-width: 580px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; overflow: hidden; border: 1px solid #E5E1D8; box-shadow: 0 12px 32px rgba(26, 38, 26, 0.08); }
          .header { background: #1A261A; padding: 32px 28px; text-align: center; color: #FFFFFF; }
          .logo-text { font-size: 24px; font-weight: 700; letter-spacing: 2px; color: #FFFFFF; margin: 0; }
          .sub-logo { font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #4ADE80; margin-top: 6px; }
          .content { padding: 36px 32px; }
          .status-badge { display: inline-block; padding: 8px 18px; border-radius: 9999px; background: ${statusBg}; color: ${statusTextColor}; border: 1px solid ${statusBorderColor}; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 18px; }
          .greeting { font-size: 21px; font-weight: 700; color: #181F18; margin-bottom: 10px; line-height: 1.3; }
          .message { font-size: 14px; line-height: 1.6; color: #425042; margin-bottom: 16px; }
          .notes-box { background: #FAF9F5; border-left: 4px solid ${statusBorderColor}; border: 1px solid #E5E1D8; border-radius: 10px; padding: 14px 18px; margin: 20px 0; font-size: 13px; color: #181F18; }
          .summary-card { background: #FAF9F5; border: 1px solid #E5E1D8; border-radius: 16px; padding: 18px; margin: 20px 0; font-size: 13px; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #EAE5DB; }
          .row:last-child { border-bottom: none; }
          .footer { background: #F7F5F0; padding: 24px 32px; text-align: center; font-size: 12px; color: #6A806A; border-top: 1px solid #EAE5DB; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo-text">EnCourtyard</h1>
            <div class="sub-logo">Handcrafted Workspaces & Botanical Sanctuaries</div>
          </div>
          <div class="content">
            <div class="status-badge">${statusBadge}</div>
            <div class="greeting">${headline}</div>
            <p class="message">
              ${statusMessage}
            </p>

            ${booking.adminNotes ? `
            <div class="notes-box">
              <strong style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #5C665C; margin-bottom: 6px;">
                📝 Concierge & Admin Notes:
              </strong>
              <div style="line-height: 1.6; white-space: pre-wrap; color: #181F18;">${booking.adminNotes}</div>
            </div>` : ''}

            ${nextStepsBox}

            <div class="summary-card">
              <div class="row"><span><strong>Booking Reference:</strong></span><span>${booking.id}</span></div>
              <div class="row"><span><strong>Workspace:</strong></span><span>${booking.workspaceTitle}</span></div>
              <div class="row"><span><strong>Schedule:</strong></span><span>${booking.startDate} (${booking.startTime}) → ${booking.endDate} (${booking.endTime})</span></div>
              <div class="row"><span><strong>Capacity / Guests:</strong></span><span>${booking.guests} Seat${booking.guests > 1 ? 's' : ''}</span></div>
              <div class="row"><span><strong>Current Status:</strong></span><span style="color: ${statusTextColor}; font-weight: bold; text-transform: uppercase;">${booking.status}</span></div>
            </div>

            <p style="font-size: 13px; color: #5C665C; line-height: 1.6; margin-top: 24px;">
              For any questions regarding your booking, please reach out to our concierge team at <a href="mailto:support@encourtyard.com" style="color: #2E7D32; font-weight: 600;">support@encourtyard.com</a> or WhatsApp <a href="https://wa.me/919908209993" style="color: #2E7D32; font-weight: 600;">+91 99082 09993</a>.
            </p>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} EnCourtyard Workspaces Ltd.<br>
            Khairtabad Botanical Sanctuary, Hyderabad • WhatsApp: +91 99082 09993
          </div>
        </div>
      </body>
      </html>
    `;

    const plainText = `EnCourtyard Booking Status Update\n\n${headline}\n\n${statusMessage.replace(/<[^>]+>/g, '')}\n\nStatus: ${booking.status}\nBooking ID: ${booking.id}\nWorkspace: ${booking.workspaceTitle}\nSchedule: ${booking.startDate} (${booking.startTime}) → ${booking.endDate} (${booking.endTime})\nSeats: ${booking.guests}\n\n${booking.adminNotes ? `Admin Notes: ${booking.adminNotes}\n\n` : ''}Contact Concierge: support@encourtyard.com | +91 99082 09993`;

    const info = await transporter.sendMail({
      from: cfg.from,
      to: toEmail,
      subject: emailSubject,
      text: plainText,
      html: htmlContent,
    });

    return { success: true, messageId: info.messageId };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to dispatch status update email';
    console.error('❌ [Nodemailer SMTP Error - User Status Update]:', errMessage);
    return { success: true, error: errMessage };
  }
}

// ============================================================================
// 6. Admin Status Update Notification Email
// ============================================================================
export async function sendAdminStatusUpdateNotification(
  booking: BookingEmailData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const cfg = getSmtpConfig();

  if (!cfg.isConfigured) return { success: true };

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: cfg.from,
      to: cfg.adminEmail,
      subject: `ℹ️ [Status Changed] Booking ${booking.id} updated to ${booking.status}`,
      text: `Booking ${booking.id} (${booking.fullName} - ${booking.workspaceTitle}) status updated to ${booking.status}. Notes: ${booking.adminNotes || 'None'}.`,
    });
    return { success: true, messageId: info.messageId };
  } catch (error: unknown) {
    return { success: true, error: String(error) };
  }
}

// ============================================================================
// 7. Master Dispatchers with Single vs Dual Email and Admin Toggles
// ============================================================================
export async function dispatchBookingCreatedEmails(
  booking: BookingEmailData,
  userAccountEmail?: string | null
): Promise<void> {
  const formEmail = booking.email?.trim().toLowerCase();
  const accountEmail = userAccountEmail?.trim().toLowerCase();

  const emailsToDispatch: { email: string; label: string }[] = [];

  if (formEmail) {
    emailsToDispatch.push({ email: formEmail, label: 'Booking Contact Email' });
  }

  // Dual Email Check: If account email exists and is different from form email, send to BOTH
  if (accountEmail && accountEmail !== formEmail) {
    emailsToDispatch.push({ email: accountEmail, label: 'User Account Email' });
  }

  // Send to user recipient(s)
  await Promise.all(
    emailsToDispatch.map((item) =>
      sendBookingConfirmationEmail(item.email, booking, item.label)
    )
  );

  // Check Admin Notification Toggle from settings
  try {
    const adminToggle = await prisma.systemSetting.findUnique({
      where: { key: 'admin_email_notify_new_booking' }
    });
    const shouldNotifyAdmin = adminToggle?.value !== 'false';
    if (shouldNotifyAdmin) {
      await sendAdminNewBookingNotification(booking);
    }
  } catch (err) {
    console.warn('Could not check admin notification toggle:', err);
    await sendAdminNewBookingNotification(booking);
  }
}

export async function dispatchStatusUpdatedEmails(
  booking: BookingEmailData,
  userAccountEmail?: string | null
): Promise<void> {
  const formEmail = booking.email?.trim().toLowerCase();
  const accountEmail = userAccountEmail?.trim().toLowerCase();

  const emailsToDispatch: { email: string; label: string }[] = [];

  if (formEmail) {
    emailsToDispatch.push({ email: formEmail, label: 'Booking Contact Email' });
  }

  // Dual Email Check: If account email exists and is different from form email, send to BOTH
  if (accountEmail && accountEmail !== formEmail) {
    emailsToDispatch.push({ email: accountEmail, label: 'User Account Email' });
  }

  // Send status update to user recipient(s)
  await Promise.all(
    emailsToDispatch.map((item) =>
      sendStatusUpdateEmail(item.email, booking, item.label)
    )
  );

  // Check Admin Status Update Toggle from settings
  try {
    const adminToggle = await prisma.systemSetting.findUnique({
      where: { key: 'admin_email_notify_status_update' }
    });
    const shouldNotifyAdmin = adminToggle?.value !== 'false';
    if (shouldNotifyAdmin) {
      await sendAdminStatusUpdateNotification(booking);
    }
  } catch (err) {
    console.warn('Could not check admin status toggle:', err);
  }
}
