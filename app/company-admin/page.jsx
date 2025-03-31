'use client';

import { useEffect, useState } from 'react';
import StaffTable from '../../components/staffTable';
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";
export default function CompanyAdminPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const router=useRouter();
  useEffect(() => {
    const getStaffList = async () => {
      try {
        const res = await fetch('/api/company-admin', {
          credentials: 'include',
        });

        if (!res.ok) {
          console.error("Server responded with error:", res.status);
          setStaff([]); // prevent undefined
          return;
        }

        const data = await res.json();

        if (!data.staff) {
          console.warn("No staff data received.");
          setStaff([]);
          return;
        }

        setStaff(data.staff);
      } catch (error) {
        console.error('Failed to fetch staff:', error);
        setStaff([]); // fallback
      } finally {
        setLoading(false);
      }
    };

    getStaffList();
  }, []);


  useEffect(() => {
    const checkAuth = async () => {
        try {
            const response = await fetch("/api/auth/verify-token", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                if (data.payload.role !== "company_admin") {
                    router.push('/');
                } else {
                    setLoading(false);
                }
            }
        } catch (error) {
            console.error('Authentication failed');
            router.push('/');
        }
    };
    checkAuth();
}, [router]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        // Redirect to login page after successful logout
        window.location.href = '/'; // Change this path as needed
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Manage Staff</h1>
  
        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
        >
          Logout
        </Button>
      </div>
  
      <div className="bg-white p-4 overflow-x-auto">
        <StaffTable staff={staff} />
      </div>
    </div>
  );
  
}
