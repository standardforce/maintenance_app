import pool from "@/lib/db";
import jwt from "jsonwebtoken";
import { sendCredentialsEmail } from "@/lib/mailer";

const JWT_SECRET = process.env.JWT_KEY;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return new Response(JSON.stringify({ message: "Token is missing" }), {
      status: 400,
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const email = decoded.email;

    // Update DB: mark email as verified
    const [result] = await pool.query(
      `UPDATE m_staff_infrapulse
       SET email_verified = true, verification_token = NULL
       WHERE email = ? AND verification_token = ?`,
      [email, token]
    );

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ message: "Invalid or expired token" }), {
        status: 400,
      });
    }

    // Send login credentials
    await sendCredentialsEmail(email);

    return new Response(
      JSON.stringify({ message: "Email verified. Credentials sent." }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Verification error:", err);
    return new Response(JSON.stringify({ message: "Invalid or expired token" }), {
      status: 400,
    });
  }
}
