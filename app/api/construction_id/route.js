import pool from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = "dfsefergesrdgdfgdghfghfg"; // Ensure this matches the token signing secret

async function extractUser() {
  try {
    const cookieStore =await cookies(); // Access cookies
    const token = cookieStore.get("jwt")?.value;

    if (!token) {
      throw new Error("Unauthorized: No token found");
    }

    const payload = jwt.verify(token, JWT_SECRET); // Verify JWT token
    return payload.user_id; // Extract user_id from the payload
  } catch (error) {
    console.error("Error extracting user_id:", error.message);
    throw new Error("Unauthorized: Invalid or expired token");
  }
}


// Handle GET requests
export async function GET(request) {
  try {
    const userId = await extractUser(); // Extract user_id
    
    // Fetch constructions for the given userId
    const [rows] = await pool.query(
      "SELECT * FROM constructions WHERE user_id = ?",
      [userId]
    );

    // Return response with rows
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error.message);
    const status = error.message.includes("Unauthorized") ? 401 : 500;
    return new Response(JSON.stringify({ error: error.message }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}
