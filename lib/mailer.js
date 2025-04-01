import nodemailer from "nodemailer";
import pool from "@/lib/db"; 


const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS, 
  },
});

export async function sendVerificationEmail(email, token) {
  const verificationLink = `http://localhost:3000/verify-email?token=${token}`; 

  await transporter.sendMail({
    from: `"Infrapulse" <${process.env.SMTP_USER}>`, 
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
    from: `"Infrapulse" <${process.env.SMTP_USER}>`, 
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
