import pool from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';


const JWT_SECRET=process.env.JWT_KEY;

export async function POST(request){
    try{
        const cookieStore=await cookies();
        const token=cookieStore.get('jwt')?.value;

        if(!token){
            return new Response(JSON.stringify({message:'Unauthorized'}),{status:401});
        }

        const {username,password}=await request.json();

        const decoded=jwt.verify(token,JWT_SECRET);
        if(decoded.role!=="company_admin"){
            return new Response(JSON.stringify({message:"Access Denied!"}),{status:403});
        }

        const [companyResult]= await pool.query(
            "SELECT company_name from users WHERE id=?",
            [decoded.user_id]
        );

        if(companyResult.length===0){
            return new Response(JSON.stringify({message:"Company not found"}),{status:404});
        }

        const companyName=companyResult[0].company_name;

        const [insertResult]= await pool.query(
            "INSERT INTO users (username,password,role,company_name) VALUES (?,?,'staff_user',?)",
            [username,password, companyName]
        );

        if (insertResult.affectedRows > 0) {
            return new Response(JSON.stringify({ message: "User added successfully" }), { status: 201 });
        } else {
            return new Response(JSON.stringify({ message: "Failed to add user" }), { status: 500 });
        }

    }
    catch (error) {
        console.error("Error in /api/company-admin:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}