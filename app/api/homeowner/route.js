import pool from "@/lib/db"
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET="dfsefergesrdgdfgdghfghfg"

export async function extractuser(request){
    try{
        const cookieStore= await cookies();
        const token=cookieStore.get("jwt")?.value;

        if(!token){
            throw new Error("Unauthorized: No token found")
        }

        const payload=jwt.verify(token,JWT_SECRET);
        return payload.user_id;
    }
    catch(error){
        console.log("Error extracting user_id:",error.message);
        throw new Error("Unauthorized: Invalid or expired token");
    }
}

export async function POST(request){
    try{
    const userId=await extractuser(request);
    if(!userId){
        return new Response(
            JSON.stringify({message:"Unauthorized"}),
            {status:401}
        ); 
    }

     const {name,phone,email}=await request.json();
     console.log("Received Data:",
      {
      name,
      phone,
      email
      }
     );

     await pool.query("INSERT INTO homeowners (user_id,name,phone,email) VALUES(?,?,?,?)", [userId,name,phone,email]);

     return new Response(
        JSON.stringify({message:"HouseOwner registeration successfully Done"}),
        {status:201}
     );
    } 
    catch(error){
        console.error("POST /api/homeowner error:",error.message);
        return new Response(JSON.stringify({message:"Internal Server Error"}),{
            status:500,
        });
    }
}

// export async function GET(){
//     try{
//         const [rows]=await pool.query("SELECT * FROM homeowners")

//         return new Response(JSON.stringify(rows),{
//             status:200,
//             headers:{
//                 "Content-Type":"application/json"
//             }
//         });
//     }
//     catch (error) {
//         console.error("Error fetching owners:", error);
//         return new Response(JSON.stringify({ message: "Internal Server Error" }), {
//           status: 500,
//         });
// }
// }