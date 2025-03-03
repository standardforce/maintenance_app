'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  HomeIcon, 
  BuildingIcon, 
  UserIcon, 
  BellIcon, 
  LogInIcon as LoginIcon 
} from 'lucide-react';

const Navbar = () => {
  const [username, setUsername] = useState("Tomiken");
  const [id, setUserid] = useState(1);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const onClick = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        console.log('Logout successful');
        router.push('/');
      } else {
        const errorData = await response.json();
        console.error('Logout failed:', errorData.message);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify-token', {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          console.log('Unauthorized');
          router.push('/');
          return;
        }

        const result = await response.json();
        const { userId, username } = result.payload;
       
        setUsername(username);
        setUserid(userId);
      } catch (error) {
        console.error('Authentication failed:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Left side - Navigation Links */}
          <div className="flex space-x-8">
            <NavLink href="/dashboard" icon={<HomeIcon className="h-5 w-5" />} pathname={pathname}>
              Dashboard
            </NavLink>
            <NavLink href="/new-construction" icon={<BuildingIcon className="h-5 w-5" />} pathname={pathname}>
              New Construction
            </NavLink>
            <NavLink href="/maintenance" icon={<BuildingIcon className="h-5 w-5" />} pathname={pathname}>
              Maintenance
            </NavLink>
            <NavLink href={`/notifications`} icon={<BellIcon className="h-5 w-5" />} pathname={pathname}>
              Notifications
            </NavLink>
          </div>

          {/* Right side - Profile & Logout */}
          <div className="ml-auto flex items-center space-x-4">
            <div className="bg-gray-800 text-white px-4 py-2 rounded-md">
              <h1 className="text-sm font-bold">Welcome, {username || 'User'}!</h1>
            </div>
            <Button className="bg-red-500 hover:bg-red-600" onClick={onClick}>
              Logout
            </Button>
          </div>

        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ href, children, icon, pathname }) => {
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
        isActive
          ? 'pb-2 border-blue-500 text-gray-900'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
      }`}
    >
      {icon}
      <span className="ml-2">{children}</span>
    </Link>
  );
};

export default Navbar;
