import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";


export async function GET(req, context) {
  const params = await context.params;
  const user=params.user;             // Get dynamic user ID from route

  try {
    // Check authentication via cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("jwt")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token found" }, { status: 401 });
    }

    // Fetch user details dynamically from 'constructions' table based on ID
    const [userData] = await pool.query(
      `SELECT id, company_name, client_name, email, address, DATE_FORMAT(regis_date, '%Y-%m-%d') AS regis_date FROM constructions WHERE id = ?`,
      [user] // Correct MySQL placeholder syntax
    );

    if (!userData.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userData[0], { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function PUT(req, context) {
    const params = await context.params;
    const userId = params.user;  // Get dynamic user ID from route
  
    try {
      // Check authentication via cookies
      const cookieStore = await cookies();
      const token = cookieStore.get("jwt")?.value;
  
      if (!token) {
        return NextResponse.json({ error: "Unauthorized: No token found" }, { status: 401 });
      }
  
      // Parse the request body for updated user data
      const { client_name, email, address, registration_date} = await req.json();
  
      // Validate required fields
      if (!client_name || !email || !address || !registration_date) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }
  
      // Update user details in the 'constructions' table
      const [result] = await pool.query(
        `UPDATE constructions 
         SET client_name = ?, email = ?, address = ?, regis_date= ?
         WHERE id = ?`,
        [client_name, email, address, registration_date,userId]
      );
  
      // Check if update was successful
      if (result.affectedRows === 0) {
        return NextResponse.json({ error: "User not found or no changes made" }, { status: 404 });
      }
  
      // Fetch the updated user data to return
      const [updatedUserData] = await pool.query(
        `SELECT id, company_name, client_name, email, address FROM constructions WHERE id = ?`,
        [userId]
      );
  
      if (!updatedUserData.length) {
        return NextResponse.json({ error: "Failed to retrieve updated user data" }, { status: 500 });
      }
  
      return NextResponse.json(updatedUserData[0], { status: 200 });
    } catch (error) {
      console.error("API Error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }