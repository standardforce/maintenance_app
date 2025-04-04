// app/api/company-admin/route.js or route.ts
import pool from "@/lib/db";
import { cookies } from "next/headers";
import { sendVerificationEmail } from "@/lib/mailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_KEY;

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwt")?.value;

    if (!token) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "company_admin") {
      return new Response(JSON.stringify({ message: "Access Denied!" }), { status: 403 });
    }

    const [rows] = await pool.query(
      `SELECT id, staff_name, staff_kana, employee_code, email, login_id, tel_1, del_flg, role
       FROM m_staff_infrapulse
       ORDER BY role ASC`
    );

    return new Response(JSON.stringify({ staff: rows }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in GET /api/company-admin:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}


export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwt")?.value;

    if (!token) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "company_admin") {
      return new Response(JSON.stringify({ message: "Access Denied" }), { status: 403 });
    }

    const body = await request.json();
    const {
      id,
      staff_name,
      staff_kana,
      employee_code,
      email,
      login_id,
      password,
      tel_1,
      role,
    } = body;

    const [existing] = await pool.query(
      `SELECT password FROM m_staff_infrapulse WHERE id = ?`,
      [id]
    );

    const oldPassword = existing[0]?.password;
    let passwordChanged = false;

    // Only compare if a new password is provided
    if (password && password.trim() !== "") {
      const isSame = await bcrypt.compare(password, oldPassword);
      passwordChanged = !isSame;
    }

    if (passwordChanged) {
      const plainPassword = password;
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      const verificationToken = jwt.sign({ email, plainPassword }, JWT_SECRET, { expiresIn: "15m" });

      await pool.query(
        `UPDATE m_staff_infrapulse
         SET staff_name = ?, staff_kana = ?, employee_code = ?, email = ?, login_id = ?,
             pending_password = ?, tel_1 = ?, role = ?, verification_token = ?, email_verified = false
         WHERE id = ?`,
        [staff_name, staff_kana, employee_code, email, login_id, hashedPassword, tel_1, role, verificationToken, id]
      );

      await sendVerificationEmail(email, verificationToken);

      return new Response(
        JSON.stringify({ message: "Password change pending verification. Email sent." }),
        { status: 200 }
      );
    } else {
      await pool.query(
        `UPDATE m_staff_infrapulse
         SET staff_name = ?, staff_kana = ?, employee_code = ?, email = ?, login_id = ?, tel_1 = ?, role = ?
         WHERE id = ?`,
        [staff_name, staff_kana, employee_code, email, login_id, tel_1, role, id]
      );

      return new Response(
        JSON.stringify({ message: "Staff details updated (no password change)." }),
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error updating staff:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}
