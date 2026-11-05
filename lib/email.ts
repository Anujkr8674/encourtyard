import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';
import { parseBookingNotes } from '@/lib/bookingNotes';

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

export function getAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes('localhost')) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, '');
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'https://encourtyard.vercel.app';
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
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
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
  bookingRef?: string | null;
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
  paymentStatus?: string | null;
  adminNotes?: string | null;
  statusUpdatedAt?: Date | string | null;
  notesUpdatedAt?: Date | string | null;
  createdAt?: Date | string;
}

// ============================================================================
// 2.5 Dynamic Formatters for Booking Categories & Rental Plans
// ============================================================================
export interface FormattedBookingDetails {
  isDayPass: boolean;
  isMeetingRoom: boolean;
  isConferenceHall: boolean;
  isHourly: boolean;
  displayPlan: string;
  badgePlan: string;
  userScheduleHtml: string;
  adminScheduleHtml: string;
  scheduleSummary: string;
  plainTextSchedule: string;
}

export function formatBookingDetailsForEmail(booking: BookingEmailData): FormattedBookingDetails {
  const planLower = (booking.plan || '').toLowerCase();
  const titleLower = (booking.workspaceTitle || '').toLowerCase();
  const catLower = (booking.categoryName || '').toLowerCase();

  const isDayPass =
    planLower === 'daily' ||
    planLower.includes('day') ||
    titleLower.includes('day pass') ||
    catLower.includes('day pass') ||
    titleLower.includes('hot desk') ||
    catLower.includes('hot desk');

  const isConferenceHall =
    titleLower.includes('conference') ||
    catLower.includes('conference') ||
    planLower.includes('conference');

  const isMeetingRoom =
    !isConferenceHall &&
    (titleLower.includes('meeting') ||
      catLower.includes('meeting') ||
      planLower.includes('meeting') ||
      planLower.includes('hour'));

  const isHourly = isMeetingRoom || isConferenceHall;

  let displayPlan = 'General Office';
  let badgePlan = 'OFFICE RESERVATION';
  let userScheduleHtml = '';
  let adminScheduleHtml = '';
  let scheduleSummary = '';
  let plainTextSchedule = '';

  if (isDayPass) {
    displayPlan = 'Day Pass';
    badgePlan = 'DAY PASS RESERVATION';
    userScheduleHtml = `
      <div class="row">
        <span class="row-label">Booking Date:</span>
        <span class="row-val">${booking.startDate}</span>
      </div>
      <div class="row">
        <span class="row-label">Access Timing:</span>
        <span class="row-val">${booking.startTime} to ${booking.endTime}</span>
      </div>
      <div class="row">
        <span class="row-label">Rental Plan:</span>
        <span class="row-val" style="color: #2E7D32; font-weight: bold;">Day Pass</span>
      </div>
    `;
    adminScheduleHtml = `
      <div class="row"><span><strong>Rental Plan:</strong></span><span style="color: #2E7D32; font-weight: bold;">Day Pass • ${booking.guests} Pax</span></div>
      <div class="row"><span><strong>Booking Date:</strong></span><span>${booking.startDate}</span></div>
      <div class="row"><span><strong>Access Timing:</strong></span><span>${booking.startTime} to ${booking.endTime}</span></div>
    `;
    scheduleSummary = `${booking.startDate} • ${booking.startTime} to ${booking.endTime} (Day Pass)`;
    plainTextSchedule = `Date: ${booking.startDate} | Access Time: ${booking.startTime} to ${booking.endTime} | Rental Plan: Day Pass`;
  } else if (isConferenceHall) {
    displayPlan = 'Conference Hall (Hourly)';
    badgePlan = 'CONFERENCE HALL RESERVATION';
    userScheduleHtml = `
      <div class="row">
        <span class="row-label">Booking Date:</span>
        <span class="row-val">${booking.startDate}</span>
      </div>
      <div class="row">
        <span class="row-label">Time (From – To):</span>
        <span class="row-val">${booking.startTime} to ${booking.endTime}</span>
      </div>
      <div class="row">
        <span class="row-label">Rental Plan:</span>
        <span class="row-val" style="color: #6A1B9A; font-weight: bold;">Conference Hall (Hourly)</span>
      </div>
    `;
    adminScheduleHtml = `
      <div class="row"><span><strong>Rental Plan:</strong></span><span style="color: #6A1B9A; font-weight: bold;">Conference Hall (Hourly) • ${booking.guests} Pax</span></div>
      <div class="row"><span><strong>Booking Date:</strong></span><span>${booking.startDate}</span></div>
      <div class="row"><span><strong>Time (From – To):</strong></span><span>${booking.startTime} to ${booking.endTime}</span></div>
    `;
    scheduleSummary = `${booking.startDate} • ${booking.startTime} to ${booking.endTime} (Conference Hall - Hourly)`;
    plainTextSchedule = `Booking Date: ${booking.startDate} | Time (From - To): ${booking.startTime} to ${booking.endTime} | Rental Plan: Conference Hall (Hourly)`;
  } else if (isMeetingRoom) {
    displayPlan = 'Meeting Room (Hourly)';
    badgePlan = 'MEETING ROOM RESERVATION';
    userScheduleHtml = `
      <div class="row">
        <span class="row-label">Booking Date:</span>
        <span class="row-val">${booking.startDate}</span>
      </div>
      <div class="row">
        <span class="row-label">Time (From – To):</span>
        <span class="row-val">${booking.startTime} to ${booking.endTime}</span>
      </div>
      <div class="row">
        <span class="row-label">Rental Plan:</span>
        <span class="row-val" style="color: #1565C0; font-weight: bold;">Meeting Room (Hourly)</span>
      </div>
    `;
    adminScheduleHtml = `
      <div class="row"><span><strong>Rental Plan:</strong></span><span style="color: #1565C0; font-weight: bold;">Meeting Room (Hourly) • ${booking.guests} Pax</span></div>
      <div class="row"><span><strong>Booking Date:</strong></span><span>${booking.startDate}</span></div>
      <div class="row"><span><strong>Time (From – To):</strong></span><span>${booking.startTime} to ${booking.endTime}</span></div>
    `;
    scheduleSummary = `${booking.startDate} • ${booking.startTime} to ${booking.endTime} (Meeting Room - Hourly)`;
    plainTextSchedule = `Booking Date: ${booking.startDate} | Time (From - To): ${booking.startTime} to ${booking.endTime} | Rental Plan: Meeting Room (Hourly)`;
  } else {
    // General Office / Monthly / Multi-day
    if (planLower.includes('month')) {
      displayPlan = 'Monthly Private Office';
    } else if (booking.plan) {
      displayPlan = booking.plan.charAt(0).toUpperCase() + booking.plan.slice(1);
    } else {
      displayPlan = 'General Office Workspace';
    }
    badgePlan = 'OFFICE RESERVATION';

    userScheduleHtml = `
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
        <span class="row-val" style="text-transform: capitalize;">${displayPlan}</span>
      </div>
    `;
    adminScheduleHtml = `
      <div class="row"><span><strong>Rental Plan:</strong></span><span>${displayPlan} • ${booking.guests} Pax</span></div>
      <div class="row"><span><strong>From:</strong></span><span>${booking.startDate} (${booking.startTime})</span></div>
      <div class="row"><span><strong>To:</strong></span><span>${booking.endDate} (${booking.endTime})</span></div>
    `;
    scheduleSummary = `${booking.startDate} (${booking.startTime}) → ${booking.endDate} (${booking.endTime})`;
    plainTextSchedule = `From: ${booking.startDate} (${booking.startTime}) to ${booking.endDate} (${booking.endTime}) | Rental Plan: ${displayPlan}`;
  }

  return {
    isDayPass,
    isMeetingRoom,
    isConferenceHall,
    isHourly,
    displayPlan,
    badgePlan,
    userScheduleHtml,
    adminScheduleHtml,
    scheduleSummary,
    plainTextSchedule,
  };
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
  const details = formatBookingDetailsForEmail(booking);
  const displayRef = booking.bookingRef || booking.id;
  const appUrl = getAppUrl();
  const parsedNotes = parseBookingNotes(booking.adminNotes);

  console.log('\n======================================================');
  console.log(`🌿 [EnCourtyard Booking] CONFIRMATION DISPATCH TO: ${toEmail} (${recipientLabel || 'User'})`);
  console.log(`📋 BOOKING REF: ${displayRef} | SPACE: ${booking.workspaceTitle}`);
  console.log(`📅 PLAN: ${details.displayPlan} | SCHEDULE: ${details.scheduleSummary}`);
  console.log('======================================================\n');

  if (!cfg.isConfigured) {
    return { success: true };
  }

  try {
    const transporter = createTransporter();
    const normalizedStatus = (booking.status || 'PENDING').toUpperCase().trim();

    let emailSubject = `EnCourtyard Reservation Received: ${booking.workspaceTitle} (${displayRef})`;
    let statusBadge = `RESERVATION RECEIVED • PENDING`;
    let badgeBg = '#FEF3C7';
    let badgeTextColor = '#92400E';
    let badgeBorderColor = '#F59E0B';
    let headlineGreeting = `Hello, ${booking.fullName}!`;
    let introMessage = `Thank you for choosing EnCourtyard. We have received your reservation request for <strong>${booking.workspaceTitle}</strong>. Your booking status is currently <strong>Pending Confirmation</strong> while our concierge team verifies scheduling and seat allocation.`;

    let nextStepsHtml = `
      <div style="background: #FFFBEB; border: 1px solid #FCD34D; border-radius: 12px; padding: 18px 20px; margin: 24px 0; font-size: 13px; color: #92400E; line-height: 1.6;">
        <strong style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #78350F; margin-bottom: 8px;">🌿 What happens next:</strong>
        • Your reservation has been placed in <strong>Pending</strong> status.<br>
        • Our sanctuary concierge is reviewing seat availability and workspace preparation.<br>
        • You will receive an official confirmation email as soon as your booking is verified.<br>
        • For urgent queries or instant assistance, WhatsApp us at <a href="https://wa.me/919908209993" style="color: #2E7D32; font-weight: bold;">+91 99082 09993</a>.
      </div>
    `;

    if (normalizedStatus === 'CONFIRMED') {
      emailSubject = `✅ EnCourtyard Reservation Confirmed: ${booking.workspaceTitle} (${displayRef})`;
      statusBadge = `RESERVATION CONFIRMED`;
      badgeBg = '#DCFCE7';
      badgeTextColor = '#166534';
      badgeBorderColor = '#4ADE80';
      introMessage = `Thank you for reserving your workspace at <strong>EnCourtyard</strong>. Your reservation for <strong>${booking.workspaceTitle}</strong> is officially <strong>Confirmed</strong> and your workspace has been reserved.`;
      nextStepsHtml = `
        <div style="background: #F0FDF4; border: 1px solid #86EFAC; border-radius: 12px; padding: 18px 20px; margin: 24px 0; font-size: 13px; color: #166534; line-height: 1.6;">
          <strong style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #14532D; margin-bottom: 8px;">🌿 Check-In & Arrival Guidelines:</strong>
          • Present your booking reference (<strong>${displayRef}</strong>) at the EnCourtyard front desk on arrival.<br>
          • Unlimited artisan tea, coffee, and high-speed Wi-Fi access will be ready.<br>
          • Reserved duration: <strong>${booking.startDate} (${booking.startTime})</strong> to <strong>${booking.endDate} (${booking.endTime})</strong>.
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
          .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; overflow: hidden; border: 1px solid #E5E1D8; box-shadow: 0 12px 32px rgba(26, 38, 26, 0.08); }
          .header { background: #1A261A; padding: 36px 32px; text-align: center; color: #FFFFFF; }
          .logo-text { font-size: 26px; font-weight: 700; letter-spacing: 2px; color: #FFFFFF; margin: 0; }
          .sub-logo { font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #4ADE80; margin-top: 6px; }
          .content { padding: 36px 32px; }
          .badge { display: inline-block; padding: 6px 16px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 20px; }
          .greeting { font-size: 22px; font-weight: 700; color: #181F18; margin-bottom: 8px; line-height: 1.3; }
          .message { font-size: 14px; line-height: 1.65; color: #4A564A; margin-bottom: 24px; }
          .ref-box { background: #F4F6F4; border: 1px solid #DCE4DC; border-radius: 12px; padding: 14px 20px; text-align: center; margin-bottom: 24px; }
          .ref-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #5C665C; font-weight: 700; display: block; margin-bottom: 4px; }
          .ref-code { font-family: Consolas, 'SF Mono', monospace; font-size: 18px; font-weight: 800; color: #1A261A; letter-spacing: 1.5px; }
          .summary-card { background: #FAF9F5; border: 1px solid #E5E1D8; border-radius: 16px; padding: 20px 24px; margin: 20px 0; }
          .table-row { width: 100%; border-bottom: 1px solid #EDE9E1; }
          .table-row td { padding: 10px 0; font-size: 13px; vertical-align: top; }
          .table-row:last-child { border-bottom: none; }
          .row-label { color: #5C665C; font-weight: 500; width: 40%; }
          .row-val { color: #181F18; font-weight: 700; text-align: right; width: 60%; }
          .notes-callout { background: #FAF9F5; border-left: 4px solid #2E7D32; border: 1px solid #E5E1D8; border-radius: 10px; padding: 14px 18px; margin: 20px 0; font-size: 13px; line-height: 1.6; color: #181F18; }
          .btn-container { text-align: center; margin: 28px 0 16px 0; }
          .btn { display: inline-block; padding: 14px 32px; background: #2E7D32; color: #FFFFFF !important; font-weight: 700; font-size: 14px; text-decoration: none; border-radius: 12px; box-shadow: 0 4px 12px rgba(46, 125, 50, 0.25); }
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
            <div class="badge" style="background: ${badgeBg}; color: ${badgeTextColor}; border: 1px solid ${badgeBorderColor};">${statusBadge}</div>
            <div class="greeting">${headlineGreeting}</div>
            <p class="message">${introMessage}</p>

            <div class="ref-box">
              <span class="ref-label">Booking Reference Number</span>
              <span class="ref-code">${displayRef}</span>
            </div>

            <div class="summary-card">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr class="table-row">
                  <td class="row-label">Workspace:</td>
                  <td class="row-val">${booking.workspaceTitle}</td>
                </tr>
                <tr class="table-row">
                  <td class="row-label">Category:</td>
                  <td class="row-val">${booking.categoryName || 'Botanical Sanctuaries'}</td>
                </tr>
                <tr class="table-row">
                  <td class="row-label">Location:</td>
                  <td class="row-val">${booking.locationName || 'Maruthi Plaza, Khairtabad, Hyderabad'}</td>
                </tr>
                <tr class="table-row">
                  <td class="row-label">Rental Plan:</td>
                  <td class="row-val">${details.displayPlan}</td>
                </tr>
                <tr class="table-row">
                  <td class="row-label">Schedule / Duration:</td>
                  <td class="row-val">${details.scheduleSummary}</td>
                </tr>
                <tr class="table-row">
                  <td class="row-label">Seating / Capacity:</td>
                  <td class="row-val">${booking.guests} Seat${booking.guests > 1 ? 's' : ''}</td>
                </tr>
                <tr class="table-row">
                  <td class="row-label">Payment Status:</td>
                  <td class="row-val" style="color: ${booking.paymentStatus === 'PAID' ? '#166534' : '#B45309'}; text-transform: uppercase;">${booking.paymentStatus || 'PENDING'}</td>
                </tr>
                <tr class="table-row">
                  <td class="row-label" style="font-weight: 700; color: #181F18;">Total Amount:</td>
                  <td class="row-val" style="font-size: 16px; color: #2E7D32;">${booking.totalAmount || 'Custom Quote'}</td>
                </tr>
              </table>
            </div>

            ${parsedNotes.userNotes ? `
            <div class="notes-callout">
              <strong style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #5C665C; margin-bottom: 6px;">
                📝 Your Special Requests / Notes:
              </strong>
              <div>${parsedNotes.userNotes}</div>
            </div>` : ''}

            ${nextStepsHtml}

            <div class="btn-container">
              <a href="${appUrl}/user/bookings" class="btn">View My Bookings in Portal →</a>
            </div>

            <p style="font-size: 13px; color: #5C665C; line-height: 1.6; text-align: center; margin-top: 24px;">
              Need help or wish to reschedule? Reach out to our concierge on WhatsApp at <a href="https://wa.me/919908209993" style="color: #2E7D32; font-weight: 700;">+91 99082 09993</a> or email <a href="mailto:support@encourtyard.com" style="color: #2E7D32; font-weight: 700;">support@encourtyard.com</a>.
            </p>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} EnCourtyard Workspaces Ltd. All rights reserved.<br>
            Maruthi Plaza, Khairtabad, Hyderabad • WhatsApp: +91 99082 09993
          </div>
        </div>
      </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: cfg.from,
      to: toEmail,
      subject: emailSubject,
      text: `Your EnCourtyard booking (${displayRef}) for "${booking.workspaceTitle}" has been received. Status: ${booking.status || 'PENDING'}. ${details.plainTextSchedule}. Total: ${booking.totalAmount || 'Flexible'}. View in portal: ${appUrl}/user/bookings`,
      html: htmlContent,
    });

    return { success: true, messageId: info.messageId };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to dispatch booking notification';
    console.error('❌ [Nodemailer SMTP Error - User Notification]:', errMessage);
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
  const details = formatBookingDetailsForEmail(booking);
  const displayRef = booking.bookingRef || booking.id;
  const appUrl = getAppUrl();
  const parsedNotes = parseBookingNotes(booking.adminNotes);

  console.log('\n======================================================');
  console.log(`🚨 [EnCourtyard Admin Alert] NEW BOOKING CREATED`);
  console.log(`📬 SENDING ADMIN NOTIFICATION TO: ${cfg.adminEmail}`);
  console.log(`📋 BOOKING REF: ${displayRef}`);
  console.log(`👤 HOST: ${booking.fullName} | COMPANY: ${booking.companyName || 'N/A'}`);
  console.log(`📞 PHONE: ${booking.phone} | EMAIL: ${booking.email}`);
  console.log(`🏢 WORKSPACE: ${booking.workspaceTitle} (${details.displayPlan})`);
  console.log(`📅 DETAILS: ${details.plainTextSchedule}`);
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
        <title>New Reservation Alert: ${booking.workspaceTitle} (${displayRef})</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F3F4F3; margin: 0; padding: 24px; color: #181F18; }
          .container { max-width: 620px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; overflow: hidden; border: 1px solid #D5DDD5; box-shadow: 0 12px 32px rgba(26, 38, 26, 0.08); }
          .header { background: #142214; padding: 32px 30px; color: #FFFFFF; }
          .badge { display: inline-block; padding: 5px 14px; border-radius: 9999px; background: #FEF3C7; color: #92400E; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; }
          .header h2 { margin: 0; font-size: 22px; font-weight: 700; color: #FFFFFF; line-height: 1.3; }
          .header p { margin: 6px 0 0 0; font-size: 13px; color: #86EFAC; }
          .content { padding: 32px 30px; }
          .section-title { font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #5C665C; font-weight: 700; margin: 24px 0 10px 0; }
          .card { background: #FAF9F5; border: 1px solid #E5E1D8; border-radius: 14px; padding: 16px 20px; margin-bottom: 16px; }
          .table-row { width: 100%; border-bottom: 1px solid #EDE9E1; }
          .table-row td { padding: 9px 0; font-size: 13px; vertical-align: top; }
          .table-row:last-child { border-bottom: none; }
          .col-label { color: #5C665C; width: 38%; font-weight: 500; }
          .col-val { color: #181F18; font-weight: 700; text-align: right; width: 62%; }
          .btn-container { text-align: center; margin: 30px 0 10px 0; }
          .btn { display: inline-block; padding: 14px 34px; background: #2E7D32; color: #FFFFFF !important; font-weight: 700; font-size: 14px; text-decoration: none; border-radius: 12px; box-shadow: 0 4px 12px rgba(46, 125, 50, 0.25); }
          .proof-btn { display: inline-block; padding: 6px 14px; background: #1E40AF; color: #FFFFFF !important; font-size: 11px; font-weight: 700; text-decoration: none; border-radius: 8px; margin-top: 4px; }
          .footer { background: #EBE8E1; padding: 20px 30px; font-size: 11px; color: #667266; text-align: center; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="badge">⚡ ACTION REQUIRED • NEW RESERVATION</div>
            <h2>New Workspace Booking Received</h2>
            <p>A member has submitted a reservation request through the EnCourtyard portal.</p>
          </div>
          <div class="content">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #F4F6F4; border: 1px solid #DCE4DC; border-radius: 12px; padding: 14px 18px; margin-bottom: 24px;">
              <tr>
                <td style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #5C665C; font-weight: bold;">Booking Reference</td>
                <td style="text-align: right; font-family: Consolas, monospace; font-size: 16px; font-weight: 800; color: #142214;">${displayRef}</td>
              </tr>
            </table>

            <div class="section-title">👤 Member / Host Profile</div>
            <div class="card">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr class="table-row">
                  <td class="col-label">Full Name:</td>
                  <td class="col-val">${booking.fullName}</td>
                </tr>
                <tr class="table-row">
                  <td class="col-label">Company:</td>
                  <td class="col-val">${booking.companyName || 'Not specified'}</td>
                </tr>
                <tr class="table-row">
                  <td class="col-label">Email:</td>
                  <td class="col-val"><a href="mailto:${booking.email}" style="color: #2E7D32; text-decoration: underline;">${booking.email}</a></td>
                </tr>
                <tr class="table-row">
                  <td class="col-label">Phone:</td>
                  <td class="col-val">
                    <a href="tel:${booking.phone}" style="color: #181F18; text-decoration: none;">${booking.phone}</a> • 
                    <a href="https://wa.me/${booking.phone.replace(/[^0-9]/g, '')}" target="_blank" style="color: #2E7D32; font-weight: 700; text-decoration: underline;">WhatsApp ↗</a>
                  </td>
                </tr>
              </table>
            </div>

            <div class="section-title">🏢 Workspace & Schedule Details</div>
            <div class="card">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr class="table-row">
                  <td class="col-label">Workspace:</td>
                  <td class="col-val">${booking.workspaceTitle}</td>
                </tr>
                <tr class="table-row">
                  <td class="col-label">Category:</td>
                  <td class="col-val">${booking.categoryName || 'General Workspace'}</td>
                </tr>
                <tr class="table-row">
                  <td class="col-label">Location:</td>
                  <td class="col-val">${booking.locationName || 'Maruthi Plaza, Khairtabad, Hyderabad'}</td>
                </tr>
                <tr class="table-row">
                  <td class="col-label">Rental Plan:</td>
                  <td class="col-val">${details.displayPlan}</td>
                </tr>
                <tr class="table-row">
                  <td class="col-label">Schedule:</td>
                  <td class="col-val">${details.scheduleSummary}</td>
                </tr>
                <tr class="table-row">
                  <td class="col-label">Capacity / Guests:</td>
                  <td class="col-val">${booking.guests} Seat${booking.guests > 1 ? 's' : ''}</td>
                </tr>
                <tr class="table-row">
                  <td class="col-label">Current Status:</td>
                  <td class="col-val" style="color: #B45309; text-transform: uppercase;">${booking.status || 'PENDING'}</td>
                </tr>
              </table>
            </div>

            <div class="section-title">💳 Billing & Payment Verification</div>
            <div class="card">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr class="table-row">
                  <td class="col-label">Total Amount:</td>
                  <td class="col-val" style="font-size: 15px; color: #2E7D32;">${booking.totalAmount || 'Custom'}</td>
                </tr>
                <tr class="table-row">
                  <td class="col-label">Payment Status:</td>
                  <td class="col-val" style="color: ${booking.paymentStatus === 'PAID' ? '#166534' : '#B45309'}; text-transform: uppercase;">${booking.paymentStatus || (parsedNotes.utr ? 'PAID' : 'PENDING')}</td>
                </tr>
                ${parsedNotes.utr ? `
                <tr class="table-row">
                  <td class="col-label">UPI / UTR Ref:</td>
                  <td class="col-val" style="font-family: Consolas, monospace; color: #1E40AF;">${parsedNotes.utr}</td>
                </tr>` : ''}
                ${parsedNotes.proofUrl ? `
                <tr class="table-row">
                  <td class="col-label">Payment Proof:</td>
                  <td class="col-val">
                    <a href="${parsedNotes.proofUrl}" target="_blank" class="proof-btn">View Uploaded Screenshot ↗</a>
                  </td>
                </tr>` : ''}
              </table>
            </div>

            ${parsedNotes.userNotes ? `
            <div class="section-title">📝 Special Requests from Member</div>
            <div style="background: #FFFBEB; border: 1px solid #FCD34D; border-radius: 12px; padding: 14px 18px; font-size: 13px; color: #92400E; line-height: 1.6; margin-bottom: 20px;">
              "${parsedNotes.userNotes}"
            </div>` : ''}

            <div class="btn-container">
              <a href="${appUrl}/admin/bookings" class="btn">Open in Admin Bookings Dashboard →</a>
            </div>
          </div>
          <div class="footer">
            EnCourtyard Automated Admin Dispatcher • Sent to ${cfg.adminEmail}<br>
            Khairtabad Botanical Sanctuary, Hyderabad • Environment: ${process.env.NODE_ENV || 'production'}
          </div>
        </div>
      </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: cfg.from,
      to: cfg.adminEmail,
      subject: `🚨 [New Booking - ${booking.status || 'PENDING'}] ${booking.workspaceTitle} - ${booking.fullName} (${displayRef})`,
      text: `New reservation placed: ${displayRef} by ${booking.fullName} (${booking.email}, ${booking.phone}) for ${booking.workspaceTitle}. Plan: ${details.displayPlan}. Status: ${booking.status || 'PENDING'}. ${details.plainTextSchedule}. Total: ${booking.totalAmount || 'Custom'}. Manage in dashboard: ${appUrl}/admin/bookings`,
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
  const details = formatBookingDetailsForEmail(booking);
  const displayRef = booking.bookingRef || booking.id;
  const appUrl = getAppUrl();
  const parsedNotes = parseBookingNotes(booking.adminNotes);

  console.log('\n======================================================');
  console.log(`🌿 [EnCourtyard Status Update] DISPATCH TO: ${toEmail} (${recipientLabel || 'User'})`);
  console.log(`📋 BOOKING REF: ${displayRef} | NEW STATUS: >>> ${booking.status} <<<`);
  console.log(`📝 ADMIN NOTES: ${parsedNotes.adminNotes || 'None'}`);
  console.log('======================================================\n');

  if (!cfg.isConfigured) {
    return { success: true };
  }

  try {
    const transporter = createTransporter();
    const normalizedStatus = (booking.status || '').toUpperCase().trim();

    let statusBadge = `STATUS UPDATED: ${booking.status}`;
    let statusBg = '#E8F5E9';
    let statusTextColor = '#1B5E20';
    let statusBorderColor = '#4ADE80';
    let emailSubject = `EnCourtyard Booking Status Updated: ${displayRef} is now ${booking.status}`;
    let headline = `Hello, ${booking.fullName}!`;
    let statusMessage = `The status of your reservation <strong>${displayRef}</strong> for <strong>${booking.workspaceTitle}</strong> has been updated to <strong>${booking.status}</strong>.`;
    let nextStepsBox = '';

    if (normalizedStatus === 'CONFIRMED') {
      statusBadge = 'RESERVATION CONFIRMED';
      statusBg = '#DCFCE7';
      statusTextColor = '#166534';
      statusBorderColor = '#86EFAC';
      emailSubject = `✅ EnCourtyard Reservation Confirmed: ${booking.workspaceTitle} (${displayRef})`;
      headline = 'Your Workspace Reservation is Officially Confirmed! 🌿';
      statusMessage = `Great news! Your booking for <strong>${booking.workspaceTitle}</strong> (Ref: <strong>${displayRef}</strong>) has been approved and confirmed by the EnCourtyard team. Your workspace will be fully prepared for your arrival.`;
      nextStepsBox = `
        <div style="background: #F0FDF4; border: 1px solid #86EFAC; border-radius: 12px; padding: 18px 20px; margin: 24px 0; font-size: 13px; color: #166534; line-height: 1.6;">
          <strong style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #14532D; margin-bottom: 8px;">🌿 Check-In & Arrival Guidelines:</strong>
          • Present your booking reference (<strong>${displayRef}</strong>) at the EnCourtyard front desk upon arrival.<br>
          • Unlimited artisan tea, coffee, and high-speed botanical Wi-Fi access will be ready.<br>
          • Reserved duration: <strong>${booking.startDate} (${booking.startTime})</strong> to <strong>${booking.endDate} (${booking.endTime})</strong>.<br>
          • Address: <strong>${booking.locationName || 'Maruthi Plaza, Khairtabad, Hyderabad'}</strong>.
        </div>
      `;
    } else if (normalizedStatus === 'PENDING') {
      statusBadge = 'RESERVATION PENDING REVIEW';
      statusBg = '#FEF3C7';
      statusTextColor = '#92400E';
      statusBorderColor = '#FCD34D';
      emailSubject = `⏳ EnCourtyard Booking Pending: ${booking.workspaceTitle} (${displayRef})`;
      headline = 'Your Reservation Request is Under Review';
      statusMessage = `Thank you for choosing EnCourtyard. Your booking request for <strong>${booking.workspaceTitle}</strong> (Ref: <strong>${displayRef}</strong>) is currently in <strong>Pending</strong> status while our concierge team verifies scheduling and seat allocation.`;
      nextStepsBox = `
        <div style="background: #FFFBEB; border: 1px solid #FCD34D; border-radius: 12px; padding: 18px 20px; margin: 24px 0; font-size: 13px; color: #92400E; line-height: 1.6;">
          <strong style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #78350F; margin-bottom: 8px;">What to Expect Next:</strong>
          • No immediate action is required from you. Our sanctuary team is verifying seat availability.<br>
          • You will receive an email update as soon as the reservation status is confirmed.<br>
          • For urgent queries or instant booking verification, chat with us on WhatsApp at <a href="https://wa.me/919908209993" style="color: #2E7D32; font-weight: bold;">+91 99082 09993</a>.
        </div>
      `;
    } else if (normalizedStatus === 'COMPLETED' || normalizedStatus === 'COMPLETE') {
      statusBadge = 'RESERVATION COMPLETED';
      statusBg = '#DBEAFE';
      statusTextColor = '#1E40AF';
      statusBorderColor = '#93C5FD';
      emailSubject = `✨ EnCourtyard Reservation Completed: ${booking.workspaceTitle} (${displayRef})`;
      headline = 'Thank You for Working at EnCourtyard! ✨';
      statusMessage = `Your workspace session for booking <strong>${displayRef}</strong> (<strong>${booking.workspaceTitle}</strong>) has been marked as <strong>Completed</strong>. We truly hope you had a productive, inspiring, and comfortable work session.`;
      nextStepsBox = `
        <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 18px 20px; margin: 24px 0; font-size: 13px; color: #1E40AF; line-height: 1.6;">
          <strong style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #1E3A8A; margin-bottom: 8px;">We Look Forward to Welcoming You Again:</strong>
          • Need to reserve your next day pass, private cabin, or conference room? Book anytime on our portal.<br>
          • Have feedback or custom team requirements? Simply reply to this email to connect directly with our management team.
        </div>
      `;
    } else if (normalizedStatus === 'CANCELLED' || normalizedStatus === 'CANCELED') {
      statusBadge = 'RESERVATION CANCELLED';
      statusBg = '#FEE2E2';
      statusTextColor = '#991B1B';
      statusBorderColor = '#FCA5A5';
      emailSubject = `⚠️ EnCourtyard Reservation Cancelled: ${booking.workspaceTitle} (${displayRef})`;
      headline = 'Your Workspace Reservation Has Been Cancelled';
      statusMessage = `This is to notify you that your booking <strong>${displayRef}</strong> for <strong>${booking.workspaceTitle}</strong> scheduled for <strong>${booking.startDate}</strong> has been <strong>Cancelled</strong>.`;
      nextStepsBox = `
        <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 12px; padding: 18px 20px; margin: 24px 0; font-size: 13px; color: #991B1B; line-height: 1.6;">
          <strong style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #7F1D1D; margin-bottom: 8px;">Important Information:</strong>
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
          .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; overflow: hidden; border: 1px solid #E5E1D8; box-shadow: 0 12px 32px rgba(26, 38, 26, 0.08); }
          .header { background: #1A261A; padding: 36px 32px; text-align: center; color: #FFFFFF; }
          .logo-text { font-size: 26px; font-weight: 700; letter-spacing: 2px; color: #FFFFFF; margin: 0; }
          .sub-logo { font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #4ADE80; margin-top: 6px; }
          .content { padding: 36px 32px; }
          .status-badge { display: inline-block; padding: 6px 16px; border-radius: 9999px; background: ${statusBg}; color: ${statusTextColor}; border: 1px solid ${statusBorderColor}; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 20px; }
          .greeting { font-size: 22px; font-weight: 700; color: #181F18; margin-bottom: 8px; line-height: 1.3; }
          .message { font-size: 14px; line-height: 1.65; color: #4A564A; margin-bottom: 24px; }
          .ref-box { background: #F4F6F4; border: 1px solid #DCE4DC; border-radius: 12px; padding: 14px 20px; text-align: center; margin-bottom: 24px; }
          .ref-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #5C665C; font-weight: 700; display: block; margin-bottom: 4px; }
          .ref-code { font-family: Consolas, 'SF Mono', monospace; font-size: 18px; font-weight: 800; color: #1A261A; letter-spacing: 1.5px; }
          .notes-box { background: #FAF9F5; border-left: 4px solid #2E7D32; border: 1px solid #E5E1D8; border-radius: 12px; padding: 16px 20px; margin: 24px 0; font-size: 13px; line-height: 1.6; }
          .summary-card { background: #FAF9F5; border: 1px solid #E5E1D8; border-radius: 16px; padding: 20px 24px; margin: 20px 0; }
          .table-row { width: 100%; border-bottom: 1px solid #EDE9E1; }
          .table-row td { padding: 10px 0; font-size: 13px; vertical-align: top; }
          .table-row:last-child { border-bottom: none; }
          .row-label { color: #5C665C; font-weight: 500; width: 40%; }
          .row-val { color: #181F18; font-weight: 700; text-align: right; width: 60%; }
          .btn-container { text-align: center; margin: 28px 0 16px 0; }
          .btn { display: inline-block; padding: 14px 32px; background: #2E7D32; color: #FFFFFF !important; font-weight: 700; font-size: 14px; text-decoration: none; border-radius: 12px; box-shadow: 0 4px 12px rgba(46, 125, 50, 0.25); }
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
            <p class="message">${statusMessage}</p>

            <div class="ref-box">
              <span class="ref-label">Booking Reference Number</span>
              <span class="ref-code">${displayRef}</span>
            </div>

            ${parsedNotes.adminNotes ? `
            <div class="notes-box">
              <strong style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #2E7D32; margin-bottom: 6px;">
                📝 Message from EnCourtyard Concierge:
              </strong>
              <div style="color: #181F18; line-height: 1.6;">${parsedNotes.adminNotes}</div>
            </div>` : ''}

            ${nextStepsBox}

            <div class="summary-card">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr class="table-row">
                  <td class="row-label">Workspace:</td>
                  <td class="row-val">${booking.workspaceTitle}</td>
                </tr>
                <tr class="table-row">
                  <td class="row-label">Location:</td>
                  <td class="row-val">${booking.locationName || 'Maruthi Plaza, Khairtabad, Hyderabad'}</td>
                </tr>
                <tr class="table-row">
                  <td class="row-label">Rental Plan:</td>
                  <td class="row-val">${details.displayPlan}</td>
                </tr>
                <tr class="table-row">
                  <td class="row-label">Schedule / Duration:</td>
                  <td class="row-val">${details.scheduleSummary}</td>
                </tr>
                <tr class="table-row">
                  <td class="row-label">Capacity / Guests:</td>
                  <td class="row-val">${booking.guests} Seat${booking.guests > 1 ? 's' : ''}</td>
                </tr>
                <tr class="table-row">
                  <td class="row-label">Current Status:</td>
                  <td class="row-val" style="color: ${statusTextColor}; font-weight: 800; text-transform: uppercase;">${booking.status}</td>
                </tr>
                <tr class="table-row">
                  <td class="row-label">Payment Status:</td>
                  <td class="row-val" style="color: ${booking.paymentStatus === 'PAID' ? '#166534' : '#B45309'}; text-transform: uppercase;">${booking.paymentStatus || 'PENDING'}</td>
                </tr>
                <tr class="table-row">
                  <td class="row-label" style="font-weight: 700; color: #181F18;">Total Amount:</td>
                  <td class="row-val" style="font-size: 16px; color: #2E7D32;">${booking.totalAmount || 'Custom Quote'}</td>
                </tr>
              </table>
            </div>

            <div class="btn-container">
              <a href="${appUrl}/user/bookings" class="btn">View Reservation in Portal →</a>
            </div>

            <p style="font-size: 13px; color: #5C665C; line-height: 1.6; text-align: center; margin-top: 24px;">
              For questions regarding your reservation, reach out to our concierge team at <a href="mailto:support@encourtyard.com" style="color: #2E7D32; font-weight: 700;">support@encourtyard.com</a> or WhatsApp <a href="https://wa.me/919908209993" style="color: #2E7D32; font-weight: 700;">+91 99082 09993</a>.
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

    const plainText = `EnCourtyard Booking Status Update\n\n${headline}\n\n${statusMessage.replace(/<[^>]+>/g, '')}\n\nStatus: ${booking.status}\nBooking Reference: ${displayRef}\nWorkspace: ${booking.workspaceTitle}\nRental Plan: ${details.displayPlan}\nSchedule: ${details.scheduleSummary}\nSeats: ${booking.guests}\n\n${parsedNotes.adminNotes ? `Concierge Notes: ${parsedNotes.adminNotes}\n\n` : ''}View in portal: ${appUrl}/user/bookings\nContact Concierge: support@encourtyard.com | +91 99082 09993`;

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
  const details = formatBookingDetailsForEmail(booking);
  const displayRef = booking.bookingRef || booking.id;
  const appUrl = getAppUrl();
  const parsedNotes = parseBookingNotes(booking.adminNotes);

  if (!cfg.isConfigured) return { success: true };

  try {
    const transporter = createTransporter();
    const normalizedStatus = (booking.status || '').toUpperCase().trim();

    let statusColor = '#2E7D32';
    let statusBg = '#DCFCE7';
    if (normalizedStatus === 'CANCELLED' || normalizedStatus === 'CANCELED') {
      statusColor = '#991B1B';
      statusBg = '#FEE2E2';
    } else if (normalizedStatus === 'COMPLETED') {
      statusColor = '#1E40AF';
      statusBg = '#DBEAFE';
    } else if (normalizedStatus === 'PENDING') {
      statusColor = '#92400E';
      statusBg = '#FEF3C7';
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Status Changed: ${displayRef} is now ${booking.status}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F3F4F3; margin: 0; padding: 24px; color: #181F18; }
          .container { max-width: 620px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; overflow: hidden; border: 1px solid #D5DDD5; box-shadow: 0 12px 32px rgba(26, 38, 26, 0.08); }
          .header { background: #142214; padding: 28px 30px; color: #FFFFFF; }
          .badge { display: inline-block; padding: 5px 14px; border-radius: 9999px; background: ${statusBg}; color: ${statusColor}; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px; }
          .header h2 { margin: 0; font-size: 20px; font-weight: 700; color: #FFFFFF; }
          .header p { margin: 4px 0 0 0; font-size: 13px; color: #86EFAC; }
          .content { padding: 30px; }
          .card { background: #FAF9F5; border: 1px solid #E5E1D8; border-radius: 14px; padding: 16px 20px; margin-bottom: 16px; }
          .table-row { width: 100%; border-bottom: 1px solid #EDE9E1; }
          .table-row td { padding: 9px 0; font-size: 13px; vertical-align: top; }
          .table-row:last-child { border-bottom: none; }
          .col-label { color: #5C665C; width: 38%; font-weight: 500; }
          .col-val { color: #181F18; font-weight: 700; text-align: right; width: 62%; }
          .btn-container { text-align: center; margin: 28px 0 10px 0; }
          .btn { display: inline-block; padding: 12px 30px; background: #2E7D32; color: #FFFFFF !important; font-weight: 700; font-size: 13px; text-decoration: none; border-radius: 10px; }
          .footer { background: #EBE8E1; padding: 18px 30px; font-size: 11px; color: #667266; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="badge">STATUS UPDATED: ${booking.status}</div>
            <h2>Booking Status Changed</h2>
            <p>A reservation record has been updated in the management dashboard.</p>
          </div>
          <div class="content">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #F4F6F4; border: 1px solid #DCE4DC; border-radius: 12px; padding: 14px 18px; margin-bottom: 20px;">
              <tr>
                <td style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #5C665C; font-weight: bold;">Booking Reference</td>
                <td style="text-align: right; font-family: Consolas, monospace; font-size: 16px; font-weight: 800; color: #142214;">${displayRef}</td>
              </tr>
            </table>

            <div class="card">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr class="table-row">
                  <td class="col-label">Client Name:</td>
                  <td class="col-val">${booking.fullName}</td>
                </tr>
                <tr class="table-row">
                  <td class="col-label">Company:</td>
                  <td class="col-val">${booking.companyName || 'Not specified'}</td>
                </tr>
                <tr class="table-row">
                  <td class="col-label">Client Contact:</td>
                  <td class="col-val"><a href="mailto:${booking.email}" style="color: #2E7D32;">${booking.email}</a> • <a href="tel:${booking.phone}" style="color: #181F18;">${booking.phone}</a></td>
                </tr>
                <tr class="table-row">
                  <td class="col-label">Workspace:</td>
                  <td class="col-val">${booking.workspaceTitle}</td>
                </tr>
                <tr class="table-row">
                  <td class="col-label">Schedule:</td>
                  <td class="col-val">${details.scheduleSummary}</td>
                </tr>
                <tr class="table-row">
                  <td class="col-label">New Status:</td>
                  <td class="col-val" style="color: ${statusColor}; text-transform: uppercase;">${booking.status}</td>
                </tr>
                <tr class="table-row">
                  <td class="col-label">Total Amount:</td>
                  <td class="col-val" style="color: #2E7D32;">${booking.totalAmount || 'Custom'}</td>
                </tr>
              </table>
            </div>

            ${parsedNotes.adminNotes ? `
            <div style="background: #FAF9F5; border-left: 4px solid #2E7D32; border: 1px solid #E5E1D8; border-radius: 10px; padding: 14px 18px; margin: 18px 0; font-size: 13px;">
              <strong style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #5C665C; margin-bottom: 4px;">Updated Admin Notes:</strong>
              <div style="color: #181F18; line-height: 1.5;">${parsedNotes.adminNotes}</div>
            </div>` : ''}

            <div class="btn-container">
              <a href="${appUrl}/admin/bookings" class="btn">View in Admin Dashboard →</a>
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
      subject: `ℹ️ [Status: ${booking.status}] Booking ${displayRef} - ${booking.fullName} (${booking.workspaceTitle})`,
      text: `Booking ${displayRef} (${booking.fullName} - ${booking.workspaceTitle}) status updated to ${booking.status}. Notes: ${parsedNotes.adminNotes || 'None'}. Dashboard: ${appUrl}/admin/bookings`,
      html: htmlContent,
    });
    return { success: true, messageId: info.messageId };
  } catch (error: unknown) {
    const err = String(error);
    console.error('❌ [Nodemailer SMTP Error - Admin Status Update]:', err);
    return { success: true, error: err };
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

  // Dispatch both user emails and admin email concurrently
  const userEmailPromises = emailsToDispatch.map((item) =>
    sendBookingConfirmationEmail(item.email, booking, item.label)
  );

  const adminNotificationPromise = (async () => {
    try {
      const checkTogglePromise = prisma.systemSetting.findUnique({
        where: { key: 'admin_email_notify_new_booking' }
      });
      const timeoutPromise = new Promise<{ value: string } | null>((resolve) =>
        setTimeout(() => resolve(null), 2500)
      );
      const adminToggle = await Promise.race([checkTogglePromise, timeoutPromise]);
      const shouldNotifyAdmin = adminToggle?.value !== 'false';
      if (shouldNotifyAdmin) {
        await sendAdminNewBookingNotification(booking);
      }
    } catch (err) {
      console.warn('Could not check admin notification toggle, sending by default:', err);
      await sendAdminNewBookingNotification(booking);
    }
  })();

  const results = await Promise.allSettled([...userEmailPromises, adminNotificationPromise]);
  results.forEach((res, index) => {
    if (res.status === 'rejected') {
      console.error(`❌ [Booking Email Dispatcher Task ${index} Rejected]:`, res.reason);
    }
  });
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

  // Send status update to user recipient(s) and admin concurrently
  const userEmailPromises = emailsToDispatch.map((item) =>
    sendStatusUpdateEmail(item.email, booking, item.label)
  );

  const adminNotificationPromise = (async () => {
    try {
      const checkTogglePromise = prisma.systemSetting.findUnique({
        where: { key: 'admin_email_notify_status_update' }
      });
      const timeoutPromise = new Promise<{ value: string } | null>((resolve) =>
        setTimeout(() => resolve(null), 2500)
      );
      const adminToggle = await Promise.race([checkTogglePromise, timeoutPromise]);
      const shouldNotifyAdmin = adminToggle?.value !== 'false';
      if (shouldNotifyAdmin) {
        await sendAdminStatusUpdateNotification(booking);
      }
    } catch (err) {
      console.warn('Could not check admin status toggle, sending by default:', err);
      await sendAdminStatusUpdateNotification(booking);
    }
  })();

  const results = await Promise.allSettled([...userEmailPromises, adminNotificationPromise]);
  results.forEach((res, index) => {
    if (res.status === 'rejected') {
      console.error(`❌ [Status Email Dispatcher Task ${index} Rejected]:`, res.reason);
    }
  });
}
