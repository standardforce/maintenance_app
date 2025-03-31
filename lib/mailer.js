import nodemailer from "nodemailer";
import pool from "@/lib/db"; // ✅ Make sure this exists

// ✅ Create a single transporter instance (reusable)
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_USER, // e.g., shivankarmehta60@gmail.com
    pass: process.env.SMTP_PASS, // your App Password
  },
});

export async function sendVerificationEmail(email, token) {
  const verificationLink = `https://infrapulse.net/api/verify-email?token=${token}`; // ✅ Use actual domain or localhost in dev

  await transporter.sendMail({
    from: `"Infrapulse" <${process.env.SMTP_USER}>`, // ✅ Proper format
    to: email,
    subject: "Verify your email address",
    html: `
      <p>Hi there,</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>This link will expire in 15 minutes.</p>
    `,
  });
}

export async function sendCredentialsEmail(email) {
  // ✅ Fetch login_id and password from DB
  const [rows] = await pool.query(
    `SELECT login_id, password FROM m_staff_infrapulse WHERE email = ?`,
    [email]
  );

  const user = rows[0];

  if (!user) {
    console.warn(`No user found for email: ${email}`);
    return;
  }

  await transporter.sendMail({
    from: `"Infrapulse" <${process.env.SMTP_USER}>`, // ✅ Same here
    to: email,
    subject: "Your Login Credentials",
    html: `
      <p>Hi there,</p>
      <p>Here are your login details:</p>
      <ul>
        <li><strong>Login ID:</strong> ${user.login_id}</li>
        <li><strong>Password:</strong> ${user.password}</li>
      </ul>
      <p>You can now login to the system.</p>
    `,
  });
}
