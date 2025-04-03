import pool from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_KEY;

export async function POST(request) {
  const { username, password } = await request.json();

  try {
    const [rows] = await pool.query(
      `SELECT id, login_id, role, password FROM m_staff_infrapulse WHERE login_id = ?`,
      [username]
    );

    if (rows.length === 0) {
      return new Response(JSON.stringify({ message: "User does not exist" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = rows[0];

    // ✅ Use bcrypt to compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ message: "Invalid password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ Issue JWT
    const token = jwt.sign(
      {
        user_id: user.id,
        username: user.login_id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const cookieStore = await cookies();
    cookieStore.set('jwt', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60,
      sameSite: 'Strict',
      path: '/',
    });

    return new Response(JSON.stringify({
      message: 'Login successful',
      role: user.role,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}


// import pool from '@/lib/db';
// import { cookies } from 'next/headers';
// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_KEY;

// export async function POST(request) {
//     const { username, password } = await request.json();

//     try {
//         const [rows] = await pool.query(
//             `SELECT login_id, role, password FROM m_staff_infrapulse WHERE login_id = ?`,
//             [username]
//         );

//         if (rows.length === 0) {
//             return new Response(JSON.stringify({ message: "User does not exist" }), {
//                 status: 404,
//                 headers: { "Content-Type": "application/json" },
//             });
//         }

//         const user = rows[0];

//         if (user.password !== password) {
//             return new Response(JSON.stringify({ message: "Invalid password" }), {
//                 status: 401,
//                 headers: { "Content-Type": "application/json" },
//             });
//         }

//         const token = jwt.sign(
//             { user_id: user.id, username: user.username, role: user.role },
//             JWT_SECRET,
//             { expiresIn: "1h" }
//         );

//         const cookieStore =await cookies();
//         cookieStore.set('jwt', token, {
//             httpOnly: true,
//             maxAge: 24 * 60 * 60,
//             sameSite: "Strict",
//             path: "/"
//         });

//         return new Response(JSON.stringify({
//             message: "Login successful",
//             role: user.role
//         }), {
//             status: 200,
//             headers: { "Content-Type": "application/json" },
//         });
//     } catch (error) {
//         console.error("Login error:", error);
//         return new Response(JSON.stringify({ message: "Internal Server Error" }), {
//             status: 500,
//         });
//     }
// }
