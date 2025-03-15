import pool from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
const JWT_SECRET=process.env.JWT_KEY;


export async function POST(request){
    const cookieStore=await cookies();
    const token=cookieStore.get("jwt")?.value;

    if(!token){
        return new Response(JSON.stringify({message:"unauthorized"}), {status:401});
    }

    try{
        const decoded=jwt.verify(token,JWT_SECRET);
        if(decoded.role!="system_admin"){
            return new Response(JSON.stringify({message:"Forbidden"}),{status:403});
        }


        const {username,password,companyName}=await request.json();
        if(!username || !password || !companyName){
            return new Response(JSON.stringify({message:"All fields are required"}), {status:400})
        }
        const [result] = await pool.query(
            "INSERT INTO users (username, password, role, company_name) VALUES (?, ?, 'company_admin', ?)",
            [username, password, companyName]
        );
    
        return new Response(JSON.stringify({ message: "Company Admin Created!", userId: result.insertId }), { status: 201 });
    }
    catch (error) {
        console.error("Error adding company admin:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }  

}
