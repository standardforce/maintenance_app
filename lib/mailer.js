import nodemailer from "nodemailer";
import pool from "@/lib/db";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Sends a verification email with a tokenized link.
 */
export async function sendVerificationEmail(email, token) {
  const verificationLink = `https://infrapulse.net/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"Infrapulse" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "【Infrapulse】Email Verification Required",
    html: `
      <div style="font-family: sans-serif; padding: 16px;">
        <p>Hello,</p>
        <p>You recently requested to change your login credentials for your Infrapulse account.</p>
        <p>Please verify your email by clicking the link below:</p>
        <p>
          <a href="${verificationLink}" style="color: #1d4ed8; font-weight: bold;">
            Verify My Email
          </a>
        </p>
        <p>This link will expire in <strong>15 minutes</strong>.</p>
        <p>If you did not make this request, please ignore this email.</p>
        <hr />
        <small>© ${new Date().getFullYear()} Infrapulse</small>
      </div>
    `,
  });
}

/**
 * Sends login credentials to the staff after verification.
 */
export async function sendCredentialsEmail(email, plainPassword) {
  const [rows] = await pool.query(
    `SELECT login_id FROM m_staff_infrapulse WHERE email = ?`,
    [email]
  );

  const user = rows[0];

  if (!user) {
    console.warn(`No user found for email: ${email}`);
    return;
  }

  await transporter.sendMail({
    from: `"Infrapulse" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "【Infrapulse】Your Login Credentials",
    html: `
      <div style="font-family: sans-serif; padding: 16px;">
        <p>Hello,</p>
        <p>Your email has been successfully verified. You can now log in with the following credentials:</p>
        <ul>
          <li><strong>Login ID:</strong> ${user.login_id}</li>
          <li><strong>Password:</strong> ${plainPassword}</li>
        </ul>
        <p>
          <a href="https://infrapulse.net/" style="color: #1d4ed8; font-weight: bold;">
            Go to Login Page
          </a>
        </p>
        <p>For security, we recommend changing your password after first login.</p>
        <hr />
        <small>© ${new Date().getFullYear()} Infrapulse</small>
      </div>
    `,
  });
}
