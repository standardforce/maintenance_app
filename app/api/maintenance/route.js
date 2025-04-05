import pool from "@/lib/db";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';

const JWT_SECRET=process.env.JWT_KEY;

async function extractUser(request){
    try{
        const cookieStore=await cookies();
        const token=cookieStore.get('jwt')?.value;

        if(!token){
            throw new Error('Unauthorized: No token found');
        }

        const payload=jwt.verify(token,JWT_SECRET);
        return payload.user_id;
    }
    catch(error){
        console.error("Error extracting user_id:", error.message);
        throw new Error('Unauthorized: Invalid or expired token');
    }
}

export async function GET(request){
    try{
    const userId=await extractUser(request);

    if(!userId){
        return new Response(JSON.stringify({message:"Unauthorized"}), {status:404});
    }
    const [rows] = await pool.query(`
        SELECT 
          tm.matter_no,
          tm.matter_name,
          mc.customer_name,
          tm.owner_name,
          tm.architecture_type,
          ma.address1,
          ma.address2,
          md.department_name,
          ms.staff_name,
          tm.update_at
        FROM t_matter_infrapulse AS tm
        LEFT JOIN m_customer AS mc ON mc.id = tm.customer_id
        LEFT JOIN m_address AS ma ON ma.id = tm.address_id
        LEFT JOIN m_department AS md ON md.id = tm.department_id
        LEFT JOIN m_staff AS ms ON ms.id = tm.staff_id
        WHERE tm.staff_id = ?
      `, [userId]);
      
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