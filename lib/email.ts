import nodemailer from 'nodemailer';

interface SendOtpEmailParams {
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
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || `"EnCourtyard Workspaces" <${user || 'no-reply@encourtyard.com'}>`;

  // Check if live credentials are configured
  const isSmtpConfigured = Boolean(
    user &&
    pass &&
    !user.includes('your_email') &&
    !pass.includes('your_16_char')
  );

  // Always log OTP in server console for easy developer testing
  console.log('\n======================================================');
  console.log(`🌿 [EnCourtyard Auth] OTP DISPATCH FOR: ${toEmail}`);
  console.log(`🔐 6-DIGIT VERIFICATION CODE: >>> ${otp} <<<`);
  console.log(`⏳ VALID FOR: 10 MINUTES`);
  console.log(`👤 RECIPIENT: ${name}`);
  console.log(`📡 SMTP STATUS: ${isSmtpConfigured ? 'LIVE GOOGLE SMTP' : 'DEVELOPMENT CONSOLE FALLBACK'}`);
  console.log('======================================================\n');

  if (!isSmtpConfigured) {
    return {
      success: true,
      simulated: true,
      messageId: `dev-simulated-${Date.now()}`,
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

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
            79 Centres across 8 Premium Cities in India.
          </div>
        </div>
      </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from,
      to: toEmail,
      subject: `${otp} is your EnCourtyard Verification Code`,
      text: `Your EnCourtyard 6-digit verification code is: ${otp}. It will expire in 10 minutes.`,
      html: htmlContent,
    });

    return { success: true, messageId: info.messageId };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to dispatch email';
    console.error('❌ [Nodemailer SMTP Error]:', errMessage);
    // Return success in development so flow is uninterrupted
    return { success: true, simulated: true, error: errMessage };
  }
}
