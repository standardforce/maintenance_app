'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Use Next.js navigation hook
import { Button } from "@/components/ui/button";
import { 
  HomeIcon, 
  BuildingIcon, 
  UserIcon, 
  BellIcon, 
  LogInIcon as LoginIcon 
} from 'lucide-react';
const Navbar = () => {
  const [username,setUsername]=useState("Tomiken")
  const [loading, setLoading] = useState(true); // State to track loading
  const [authChecked, setAuthChecked] = useState(false);
  const router=useRouter()
  const pathname = usePathname();
  const onClick= async() =>{
  try{
    const response=await fetch("/api/logout",{
      method:"POST",
    });

    if(response.ok){
      console.log('Logout successful');
      router.push('/');
    }
    else{
      const errorData = await response.json();
      console.error('Logout failed:', errorData.message);
    }
  }
  catch (error) {
    console.error('Error during logout:', error);
  }
  }


  useEffect(()=>{
  const checkAuth=async()=>{
    try{
      const response=await fetch('/api/auth/verify-token',{
        method:'GET',
      });
      if(!response.ok){
        console.log('Unauthorized');
        router.push('/');
        return;
      }

      const result= await response.json();
      const {username}=result.payload;

      console.log('Username:', username);
      setUsername(username)
      setAuthChecked(true); 
    }
    catch (error) {
      console.error('Authentication failed:', error);
      router.push('/');
    } finally{
      setLoading(false);
    }
  };
  checkAuth();
  }, [router])

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
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink href="/dashboard" icon={<HomeIcon className="h-5 w-5" />} pathname={pathname}>
                Dashboard
              </NavLink>
              <NavLink href="/new-construction" icon={<BuildingIcon className="h-5 w-5" />} pathname={pathname}>
                New Construction
              </NavLink>
              <NavLink href="/maintenance" icon={<BuildingIcon className="h-5 w-5" />} pathname={pathname}>
                Maintenance
              </NavLink>
              <NavLink href="/homeowner" icon={<UserIcon className="h-5 w-5" />} pathname={pathname}>
                Homeowner
              </NavLink>
              <NavLink href="/notifications" icon={<BellIcon className="h-5 w-5" />} pathname={pathname}>
                Notifications
              </NavLink>
              <Button className='mt-4' onClick={onClick}>
                Logout
              </Button>
              <div className="flex justify-between items-center bg-gray-800 text-white px-4 py-2 m-3.5 rounded-md">
             <h1 className="text-sm font-bold">Welcome, {username || 'User'}!</h1>
             </div>
            </div>
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
          ? 'border-blue-500 text-gray-900'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
      }`}
    >
      {icon}
      <span className="ml-2">{children}</span>
    </Link>
  );
};

export default Navbar;
