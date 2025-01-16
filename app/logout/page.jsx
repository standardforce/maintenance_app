'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Logout() {
    const router = useRouter();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const response = await fetch('/api/logout', {
          method: 'POST',
        });

        if (response.ok) {
          console.log('Logout successful');
          // Redirect to the login page
          router.push('/');
        } else {
          const errorData = await response.json();
          console.error('Logout failed:', errorData.message);
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

    logoutUser();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Logging out...</h1>
      <p className="text-gray-600 mt-2">Please wait while we log you out.</p>
    </div>
  );

}