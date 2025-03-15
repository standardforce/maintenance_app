import pool from '@/lib/db'
import { cookies } from 'next/headers';
import jwt from "jsonwebtoken"
const JWT_SECRET=process.env.JWT_KEY
export async function POST(request){
    const {username,password}=await request.json();

    try{
        const [rows]=await pool.query(
            "SELECT id, username,role, password FROM users WHERE username=? AND password=?",
            [username,password]
        );
        console.log(rows);
       if(rows.length>0){
        const user=rows[0];
        const token=jwt.sign(
            {user_id:user.id, username:user.username, role:user.role},
            JWT_SECRET,
            {expiresIn:"1h"}
        );

        const cookiestore=await cookies();
        cookiestore.set('jwt', token, {
            httpOnly: true,  // Secure against client-side access
            maxAge: 24 * 60 * 60,  // 1 day (seconds)
            // secure: process.env.NODE_ENV === "production", // Secure only in production
            sameSite: "Strict", // Prevents CSRF attacks
            path: "/"
          });

        return new Response(JSON.stringify({
            message:"Login Successful",
            role:user.role
        }),{
            status:200,
            headers:{
                "Content-Type":"application/json",
            },
        });
       }
       else{
        return new Response(
            JSON.stringify({
                message:"Invalid username or password"
            }),{status:401}
        );
       }
    }
    catch (error) {
        console.error("Login error:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
          status: 500,
    });
    }
}

// export async function GET(request) {
//     try {
//       // Verify token and extract user ID
//       const userId = authmiddleware(request);
  
//       if (!userId) {
//         return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
//       }
  
//       // Proceed with database query
//       const [rows] = await pool.query("SELECT * FROM users");
  
//       return new Response(JSON.stringify(rows), {
//         status: 200,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//     } catch (error) {
//       console.error("Error in GET /api/users:", error.message);
//       return new Response(JSON.stringify({ message: "Internal Server Error" }), {
//         status: error.message.startsWith("Unauthorized") ? 401 : 500,
//       });
//     }
//   }