import pool from "@/lib/db"
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';

const JWT_SECRET=process.env.JWT_KEY;

async function extractuser(request){
    try{
        const cookieStore=await cookies();
        const token=cookieStore.get("jwt")?.value;

        if(!token){
            throw new Error("Unauthorized: No token found");
        }

        const payload=jwt.verify(token,JWT_SECRET);
        return payload.user_id;
    }
    catch(error){
        console.error("Error extracting user_id:", error.message);
       throw new Error("Unauthorized: Invalid or expired token"); 
    }
}
export async function POST(request){
    // const userId=authmiddleware(request);
    // console.log("Extracted userid:", userId)
    // if (!userId) {
    //     return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    //   }
    try{
    const userId=await extractuser(request);
    if(!userId){
        return new Response(
            JSON.stringify({message:"Unauthorized"}),
            {status:401}
        );
    }
    const {companyName,clientName,address,telephone,email,drawings} = 
    await request.json();
    // console.log("Received data:", {
    //     userId,
    //     companyName,
    //     clientName,
    //     address,
    //     telephone,
    //     email,
    //     drawings,
    //   });
        await pool.query(
         "INSERT INTO constructions (user_id, company_name,client_name,address,telephone,email) VALUES (?,?,?,?,?,?)",
         [userId,companyName,clientName,address,telephone,email,drawings]
        );

        return new Response(
            JSON.stringify({message:"Construction registered successfully done"}),
            {status:201}
        );
    }
    catch (error) {
        console.error("POST /api/constructions error:", error.message);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
          status: 500,
    });
}
}


export async function GET(request){
    try{
    const userId = await extractuser(request);

    if (!userId) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
        const [rows]=await pool.query("SELECT * FROM constructions WHERE user_id=?", [userId]);
        return new Response(JSON.stringify(rows),{
            status:200,
            headers:{
                "Content-Type":"application/json",
            },
        });
    }
    catch (error) {
        console.error("Error in GET /api/constructions:", error);
        return new Response(JSON.stringify({ message: error.message || "Internal Server Error" }), {
            status: error.message.startsWith("Unauthorized") ? 401 : 500,
        });
}
}

