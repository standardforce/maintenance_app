import pool from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_KEY;

async function extractUser(req) {
  try {
    const cookieStore =await cookies();
    const token = cookieStore.get("jwt")?.value;

    if (!token) {
      throw new Error("Unauthorized: No token found");
    }

    const payload = jwt.verify(token, JWT_SECRET);
    return payload.user_id;
  } catch (error) {
    console.error("Error extracting user_id:", error.message);
    return null; // Return null instead of throwing an error
  }
}

export async function POST(req) {
  try {
    const userId = await extractUser(req); // Ensure extractUser is awaited

    if (!userId) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json(); // Parse request body properly
    const { sixMonths, oneYear, threeYears, tenYears } = body;

    const query = `
      UPDATE constructions 
      SET 6_months_flag = ?, 
          1_year_flag = ?, 
          3_year_flag = ?, 
          10_year_flag = ?
      WHERE user_id = ?;
    `;

    const values = [sixMonths ? 1 : 0, oneYear ? 1 : 0, threeYears ? 1 : 0, tenYears ? 1 : 0, userId];

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Construction updated successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error updating construction:", error.message);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


export async function GET(req){
try{
    const userId=await extractUser(req);
    if(!userId){
        return new Response(json.stringify({message:'Unauthorized'}),{
            status:401,
            headers:{"Content-Type":"application/json"},
        });
    }

    const query = `
      SELECT 6_months_flag AS sixMonths, 
             1_year_flag AS oneYear, 
             3_year_flag AS threeYears, 
             10_year_flag AS tenYears 
      FROM constructions 
      WHERE user_id = ?;
    `;

    const [rows] = await pool.query(query, [userId]);

    if (!rows || rows.length === 0) {
        return new Response(JSON.stringify({ sixMonths: 0, oneYear: 0, threeYears: 0, tenYears: 0 }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      return new Response(JSON.stringify(rows[0]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
}
catch (error) {
    console.error("Error fetching preferences:", error.message);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}