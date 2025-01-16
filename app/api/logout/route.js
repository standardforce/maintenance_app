import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore =await cookies();
    // Clear the JWT cookie by setting Max-Age to 0
    cookieStore.set('jwt', '', {
      httpOnly: true, // Same settings as the login cookie
      maxAge: 0, // Effectively deletes the cookie
      secure: true,
      sameSite: 'Strict',
      path: '/', // Ensure the path matches where the cookie was set
    });

    return new Response(JSON.stringify({ message: 'Logout successful' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Logout error:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
