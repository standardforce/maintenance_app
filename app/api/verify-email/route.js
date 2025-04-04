import pool from "@/lib/db";
import jwt from "jsonwebtoken";
import { sendCredentialsEmail } from "@/lib/mailer";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_KEY;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return new Response(JSON.stringify({ message: "Token is missing." }), { status: 400 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const email = decoded?.email;
    const plainPassword = decoded?.plainPassword;



    if (!email || !plainPassword) {
      return new Response(JSON.stringify({ message: "Invalid token payload." }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const [result] = await pool.query(
      `UPDATE m_staff_infrapulse
       SET password = ?, 
           pending_password = NULL, 
           email_verified = true, 
           verification_token = NULL
       WHERE email = ? AND verification_token = ?`,
      [hashedPassword, email, token]
    );

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ message: "Invalid or expired token." }), { status: 400 });
    }

    await sendCredentialsEmail(email, plainPassword);

    return new Response(
      JSON.stringify({ message: "Email verified. Login credentials sent." }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Verification error:", err);
    return new Response(JSON.stringify({ message: "Invalid or expired token." }), { status: 400 });
  }
}
