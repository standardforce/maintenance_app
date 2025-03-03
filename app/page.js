'use client';
import { useState,useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LogInIcon, HomeIcon, ConstructionIcon, BellIcon, ShieldIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogInIcon as LoginIcon} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Home() {
  const router = useRouter();
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    const checkAuth=async()=>{
      try{
        const response=await fetch("/api/auth/verify-token",{
          method:"GET",
          headers:{"Content-Type":"application/json"},
          credentials:"include",
        });

        if(response.ok){
          router.push("/dashboard");
        }
      }
      catch(error){
        console.error("Error verifying token:",error);
      }
      finally{
        setLoading(false);
      }
    }
    checkAuth();
  },[router])


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });


  const onSubmit = async (values, event) => {
    event?.preventDefault();
  
    try {
      // Send login request to the backend
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials:"include",
      });
  
      const data = await response.json(); // Parse the response JSON
      if (response.ok) {
          router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };
  
  if(loading){
    return (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          );
  }


  return (
    <div className="flex flex-col pt-20">
      {/* Main Content Section */}
      <main className="flex-grow flex items-center justify-center py-10">
        <div className="flex flex-col md:flex-row items-center max-w-7xl w-full px-4">
          {/* Welcome Section */}
          <div className="flex-1 mb-8 md:mb-0 md:pr-10">
            <h1 className="text-4xl font-bold mb-4">
            Welcome to <span className="text-blue-600">MaintenanceHub</span>
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Effortlessly manage maintenance plans for newly built or renovated homes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="bg-white p-4 rounded-lg shadow-sm flex items-start space-x-3">
                <BellIcon className="h-8 w-8 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Timely Notifications</h3>
                  <p className="text-gray-600 text-sm">Never miss important maintenance deadlines</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm flex items-start space-x-3">
                <ConstructionIcon className="h-8 w-8 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Project Tracking</h3>
                  <p className="text-gray-600 text-sm">Keep all construction projects organized</p>
                </div>
              </div>
              </div>
          </div>

          {/* Login Section */}
          <div className="flex-1 max-w-md">
            <Card className="pt-10 pb-10">
              <CardHeader>
                <CardTitle className="text-center">Login</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      {...register("username")}
                    />
                    {errors.username && (
                      <p className="text-red-600 text-sm">{errors.username.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      {...register("password")}
                    />
                    {errors.password && (
                      <p className="text-red-600 text-sm">{errors.password.message}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-900">
                    <LoginIcon className="mr-2 h-4 w-4" /> Login
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      {/* <footer className="bg-gray-800 text-white">
        <div className="container mx-auto text-center py-4">
          <p>&copy; 2025 Standard Force. All rights reserved.</p>
        </div>
      </footer> */}
    </div>
  );
}





