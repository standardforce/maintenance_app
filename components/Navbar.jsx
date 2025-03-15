"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import { Button } from "@/components/ui/button";
import { 
  HomeIcon, 
  BuildingIcon, 
  BellIcon, 
  LogInIcon as LoginIcon, 
  MenuIcon, 
  XIcon,
  UserIcon
} from 'lucide-react';

const Navbar = () => {
  const [username, setUsername] = useState("Tomiken");
  const [id, setUserid] = useState(1);
  const [role, setRole] = useState();
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const onLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          console.log('Unauthorized');
          router.push('/');
          return;
        }

        const result = await response.json();
        const { userId, username, role } = result.payload;

        setUsername(username);
        setUserid(userId);
        setRole(role);
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
    <motion.nav
      className="bg-white shadow-sm"
      initial={{ y: -50, opacity: 0 }} // Slide down effect
      animate={{ y: 0, opacity: 1 }}  // Smooth entrance
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Left side - Brand & Hamburger Menu */}
          <div className="flex items-center">
            {/* Hamburger Icon for Mobile */}
            <motion.button 
              className="block md:hidden text-gray-600 focus:outline-none" 
              onClick={() => setMenuOpen(!menuOpen)}
              whileTap={{ scale: 0.9 }} // Button click animation
            >
              {menuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </motion.button>
            
            {/* Logo or Brand Name */}
            <Link href="/dashboard" className="text-xl font-bold text-blue-600 ml-3 md:ml-0">
              InfraPulse
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <NavLink href="/dashboard" icon={<HomeIcon className="h-5 w-5" />} pathname={pathname}>
              Dashboard
            </NavLink>
            <NavLink href="/new-construction" icon={<BuildingIcon className="h-5 w-5" />} pathname={pathname}>
              New Construction
            </NavLink>
            <NavLink href="/maintenance" icon={<BuildingIcon className="h-5 w-5" />} pathname={pathname}>
              Maintenance
            </NavLink>
            <NavLink href="/notifications" icon={<BellIcon className="h-5 w-5" />} pathname={pathname}>
              Notifications
            </NavLink>
          </div>

          {/* Profile, "Add User" Button & Logout */}
          <div className="flex items-center space-x-4">
            {/* ✅ Add User Button for `company_admin` */}
            {role === "company_admin" && (
              <motion.button
                className="hidden md:block bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md text-white"
                onClick={() => router.push("/company-admin")}
                whileTap={{ scale: 0.95 }} // Button click effect
              >
                Add User
              </motion.button>
            )}

            <motion.div 
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md"
              whileHover={{ scale: 1.05 }} // Slight scale up on hover
            >
              <UserIcon className="h-5 w-5 mr-2" />
              <h1 className="text-sm font-bold">{username || 'User'}</h1>
            </motion.div>

            <motion.button
              className="hidden md:block bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-white"
              onClick={onLogout}
              whileTap={{ scale: 0.95 }} // Button click effect
            >
              Logout
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className="md:hidden bg-white border-t border-gray-200"
            initial={{ opacity: 0, y: -20 }} // Slide down animation
            animate={{ opacity: 1, y: 0 }}  
            exit={{ opacity: 0, y: -20 }} // Exit animation
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col space-y-2 py-3 px-4">
              <NavLink href="/dashboard" icon={<HomeIcon className="h-5 w-5" />} pathname={pathname}>
                Dashboard
              </NavLink>
              <NavLink href="/new-construction" icon={<BuildingIcon className="h-5 w-5" />} pathname={pathname}>
                New Construction
              </NavLink>
              <NavLink href="/maintenance" icon={<BuildingIcon className="h-5 w-5" />} pathname={pathname}>
                Maintenance
              </NavLink>
              <NavLink href="/notifications" icon={<BellIcon className="h-5 w-5" />} pathname={pathname}>
                Notifications
              </NavLink>

              {/* ✅ Mobile "Add User" Button for `company_admin` */}
              {role === "company_admin" && (
                <motion.button 
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md text-white"
                  onClick={() => router.push("/company-admin")}
                  whileTap={{ scale: 0.95 }}
                >
                  Add User
                </motion.button>
              )}

              <motion.button 
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-white"
                onClick={onLogout}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};



// Reusable Navigation Link Component
const NavLink = ({ href, children, icon, pathname }) => {
  const isActive = pathname === href;

  return (
    <motion.div whileHover={{ scale: 1.05 }}> {/* Link hover animation */}
      <Link
        href={href}
        className={`flex items-center border-b-2 px-3 py-2 text-sm font-medium ${
          isActive
            ? 'border-blue-500 text-gray-900'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
        }`}
      >
        {icon}
        <span className="ml-2">{children}</span>
      </Link>
    </motion.div>
  );
};

export default Navbar;
