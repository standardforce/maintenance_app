import pool from "@/lib/db";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';

const JWT_SECRET=process.env.JWT_KEY;

async function extractUser(request){
     try{
        const cookiesStore= await cookies();
        const token=cookiesStore.get('jwt')?.value;

        if(!token){
            throw new Error('Unauthorized: No token found');
        }

      const payload=jwt.verify(token,JWT_SECRET);
      return payload.user_id;
     }
     catch(error){
        console.error("Error extracting user_id:", error.message);
       throw new Error("Unauthorized: Invalid or expired token"); 
     }
}

export async function GET(request){
    try{
    const userId=await extractUser(request);

    if(!userId){
        return new Response(JSON.stringify({message:"Unauthorized"}, {status:404}));
    }
     const [rows]=await pool.query("SELECT * FROM t_matter");
     return new Response(JSON.stringify(rows), {
        status:200,
        headers:{
            "Content-Type":"application/json",
        },
     });
    }
    catch(error){
        console.error("Error in GET /api/constructions:",error);
        return new Response(JSON.stringify({message:error.message || "Internal Server Error"},{
            status:error.message.startsWith("Unauthorized") ? 401 : 500,
        }))

    }
}