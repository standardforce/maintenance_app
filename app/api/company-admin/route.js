import pool from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_KEY;

export async function GET(request) {
  try {
    const cookieStore =await cookies(); // ✅ FIXED

    const token = cookieStore.get("jwt")?.value;

    if (!token) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "company_admin") {
      return new Response(JSON.stringify({ message: "Access Denied!" }), {
        status: 403,
      });
    }

    const [rows] = await pool.query(
      `SELECT id, staff_name, staff_kana, employee_code, email, login_id, password, tel_1, del_flg,role
       FROM m_staff_infrapulse
       WHERE role != 'company_admin'
       ORDER BY del_flg ASC`
    );

    return new Response(JSON.stringify({ staff: rows }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in GET /api/company-admin:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function POST(request) {
    try {
      const cookieStore =await cookies(); 
      const token = cookieStore.get("jwt")?.value;
  
      if (!token) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), {
          status: 401,
        });
      }
  
      const decoded = jwt.verify(token, JWT_SECRET);
  
      if (decoded.role !== "company_admin") {
        return new Response(JSON.stringify({ message: "Access Denied" }), {
          status: 403,
        });
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
  
      const [result] = await pool.query(
        `UPDATE m_staff_infrapulse
         SET staff_name = ?, staff_kana = ?, employee_code = ?, email = ?, login_id = ?, password = ?, tel_1 = ?, role=?
         WHERE id = ?`,
        [staff_name, staff_kana, employee_code, email, login_id, password, tel_1, role,id]
      );
  
      return new Response(
        JSON.stringify({ message: "Staff updated successfully" }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating staff:", error);
      return new Response(JSON.stringify({ message: "Internal Server Error" }), {
        status: 500,
      });
    }
  }