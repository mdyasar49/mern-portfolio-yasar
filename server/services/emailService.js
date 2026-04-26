const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Create a reusable transporter object using explicit SMTP settings for Gmail
// This is more reliable than using the 'service' shortcut in some environments.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    // Cleanse the password of any accidental spaces from the .env file
    pass: (process.env.EMAIL_PASS || '').replace(/\s+/g, ''),
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 15000,
});

logger.info(`SMTP Config: User=${process.env.EMAIL_USER || 'NOT SET'}`);

// Verify connection on startup
if (process.env.NODE_ENV !== 'test') {
  logger.info('Verifying SMTP connection...');
  transporter.verify((error, success) => {
    if (error) {
      logger.error('SMTP Verification Failed:', error);
    } else {
      logger.info('Email service is ready');
    }
  });
}

/**
 * Sends an email notification for new contact form submissions.
 */
exports.sendContactAlert = async (contactData) => {
  try {
    const { name, email, profession, subject, message } = contactData;

    const receiver = process.env.RECEIVER_EMAIL || process.env.EMAIL_USER;
    if (!receiver) {
      logger.warn('No RECEIVER_EMAIL or EMAIL_USER defined, skipping alert.');
      return false;
    }

    const mailOptions = {
      from: `"Portfolio Notification" <${process.env.EMAIL_USER}>`,
      to: receiver,
      subject: `Portfolio Inquiry: ${name} [${profession || 'PRO'}]`,
      html: `
                <div style="background-color: #030303; color: #ffffff; padding: 40px; font-family: 'Inter', sans-serif; max-width: 650px; margin: 0 auto; border-radius: 20px; border: 1px solid #1a1a1a; box-shadow: 0 50px 100px rgba(0,0,0,0.8);">
                    <div style="border-bottom: 2px solid #e11d48; padding-bottom: 25px; margin-bottom: 35px; text-align: left;">
                        <h1 style="margin: 10px 0 0 0; font-size: 32px; font-weight: 900; letter-spacing: -1px; line-height: 1.1;">New Message <span style="color: #e11d48;">Received.</span></h1>
                    </div>

                    <!-- Meta Data Grid -->
                    <div style="display: flex; gap: 10px; margin-bottom: 30px;">
                        <div style="flex: 1; background: #0a0a0a; border: 1px solid #1f1f1f; padding: 20px; border-radius: 12px;">
                            <label style="display: block; color: #555; font-size: 9px; font-weight: 800; text-transform: uppercase; margin-bottom: 8px;">SENDER</label>
                            <span style="font-size: 16px; font-weight: 700; color: #fff;">${name}</span>
                            <div style="margin-top: 4px; color: #e11d48; font-size: 11px; font-weight: 800; text-transform: uppercase;">${profession || 'Independent'}</div>
                        </div>
                        <div style="flex: 1; background: #0a0a0a; border: 1px solid #1f1f1f; padding: 20px; border-radius: 12px;">
                            <label style="display: block; color: #555; font-size: 9px; font-weight: 800; text-transform: uppercase; margin-bottom: 8px;">SUBJECT</label>
                            <span style="font-size: 16px; font-weight: 700; color: #fff;">${subject || 'General Connection'}</span>
                        </div>
                    </div>

                    <div style="background: #0a0a0a; border: 1px solid #1f1f1f; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
                        <label style="display: block; color: #555; font-size: 9px; font-weight: 800; text-transform: uppercase; margin-bottom: 8px;">EMAIL</label>
                        <a href="mailto:${email}" style="color: #e11d48; text-decoration: none; font-size: 14px; font-weight: 600;">${email}</a>
                    </div>

                    <!-- Message Body -->
                    <div style="background: rgba(225, 29, 72, 0.03); border: 1px solid rgba(225, 29, 72, 0.1); border-left: 5px solid #e11d48; padding: 30px; border-radius: 12px;">
                        <label style="display: block; color: #e11d48; font-size: 10px; font-weight: 900; text-transform: uppercase; margin-bottom: 15px; letter-spacing: 2px;">MESSAGE CONTENT</label>
                        <div style="font-size: 17px; line-height: 1.8; color: #e2e8f0; white-space: pre-wrap;">${message}</div>
                    </div>

                    <!-- Footer -->
                    <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #1a1a1a; text-align: center;">
                        <p style="color: #444; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
                            Portfolio Inquiry
                        </p>
                        <div style="margin-top: 10px; font-size: 10px; color: #222;">
                            ${new Date().toUTCString()}
                        </div>
                    </div>
                </div>
            `,
    };

    logger.info(`Sending contact alert email to ${receiver}...`);
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Contact alert sent: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error('Contact alert failed:', {
      message: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack
    });
    return false;
  }
};

/**
 * Sends a confirmation email to the user.
 */
exports.sendAcknowledgmentEmail = async (contactData) => {
  try {
    const { name, email, subject } = contactData;

    const mailOptions = {
      from: `"Mohamed Yasar" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Thank you for reaching out: ${subject || 'Connection Request'}`,
      html: `
                <div style="background-color: #030303; color: #ffffff; padding: 40px; font-family: 'Inter', sans-serif; max-width: 650px; margin: 0 auto; border-radius: 20px; border: 1px solid #1a1a1a; box-shadow: 0 50px 100px rgba(0,0,0,0.8);">
                    <div style="text-align: center; margin-bottom: 40px;">
                        <div style="display: inline-block; padding: 10px 20px; border: 1px solid #e11d48; border-radius: 50px; color: #e11d48; font-size: 10px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase;">
                            CONFIRMATION
                        </div>
                    </div>
                    
                    <h1 style="font-size: 28px; font-weight: 900; letter-spacing: -0.5px; text-align: center; margin-bottom: 25px;">Hello ${name},</h1>
                    
                    <p style="color: #94a3b8; line-height: 1.8; font-size: 16px; text-align: center; margin-bottom: 30px;">
                        I have successfully received your message regarding <span style="color: #ffffff; font-weight: 700;">"${subject || 'General Inquiry'}"</span>. 
                        Your inquiry is currently being processed.
                    </p>
                    
                    <div style="background: #0a0a0a; border: 1px solid #1f1f1f; padding: 25px; border-radius: 12px; text-align: center; margin-bottom: 35px;">
                        <p style="color: #e11d48; font-weight: 800; font-size: 12px; margin-bottom: 5px; text-transform: uppercase;">Response Time</p>
                        <p style="color: #ffffff; font-size: 22px; font-weight: 900; margin: 0;">ASAP</p>
                    </div>

                    <p style="color: #475569; font-size: 14px; text-align: center; line-height: 1.6;">
                        Thank you for reaching out. I look forward to connecting with you soon.
                    </p>

                    <div style="margin-top: 45px; padding-top: 30px; border-top: 1px solid #1a1a1a; text-align: center;">
                        <p style="color: #444; font-size: 10px; font-weight: 800; letter-spacing: 4px; text-transform: uppercase;">
                            A. MOHAMED YASAR
                        </p>
                    </div>
                </div>
            `,
    };

    logger.info(`Sending acknowledgment email to ${email}...`);
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Acknowledgment sent to ${email}`);
    return true;
  } catch (error) {
    logger.error('Acknowledgment email failed:', {
      message: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack
    });
    return false;
  }
};
