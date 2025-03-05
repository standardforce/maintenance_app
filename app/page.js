'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  LogInIcon, 
  HomeIcon, 
  ConstructionIcon, 
  BellIcon, 
  ShieldIcon, 
  ClipboardListIcon, 
  CalendarIcon, 
  MessageCircleIcon, 
  ReceiptIcon, 
  DollarSignIcon,
  ShieldCheckIcon 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogInIcon as LoginIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Home() {
  const router = useRouter();
  const [loginError, setLoginError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify-token", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (response.ok) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error verifying token:", error);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router])

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
    setLoginError(null);
  
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include",
      });
  
      const data = await response.json();
      if (response.ok) {
        router.push("/dashboard");
      } else {
        // Handle login error
        setLoginError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setLoginError("An unexpected error occurred. Please try again.");
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Feature list for construction company operations
  const features = [
    {
      icon: ClipboardListIcon,
      title: "Comprehensive Estimates",
      description: "Create detailed project estimates with precision and ease",
    },
    {
      icon: CalendarIcon,
      title: "Advanced Schedule Management",
      description: "Plan, track, and optimize project timelines efficiently",
    },
    {
      icon: MessageCircleIcon,
      title: "On-Site Communication",
      description: "Real-time messaging and updates for field teams",
    },
    {
      icon: ConstructionIcon,
      title: "Maintenance History Tracking",
      description: "Comprehensive records of all maintenance activities",
    },
    {
      icon: DollarSignIcon,
      title: "Cost Management",
      description: "Monitor and control project expenses in real-time",
    },
    {
      icon: ReceiptIcon,
      title: "Billing Management",
      description: "Streamlined invoicing and financial tracking",
    }
  ];

  return (
    <div className="flex flex-col pt-20">
      {/* Main Content Section */}
      <main className="flex-grow flex items-center justify-center">
        <div className="flex flex-col md:flex-row items-center max-w-7xl w-full gap-10">
          {/* Welcome Section */}
          <div className="flex-1 mb-8 md:mb-0 md:pr-10">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to <span className="text-blue-600">MaintenanceHub</span>
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Comprehensive operations management for construction companies
            </p>

            {/* Enhanced Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white p-4 rounded-lg shadow-sm flex items-start space-x-3 hover:shadow-md transition-shadow duration-300"
                >
                  <feature.icon className="h-8 w-8 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Login Section (Unchanged) */}
          <div className="flex-1 max-w-md">
            <Card className="pt-4 pb-10 bg-white shadow-2xl rounded-xl border-t-4 border-blue-600">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <ShieldCheckIcon className="h-8 w-8 text-blue-600 animate-pulse" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">Login</CardTitle>
                <p className="text-gray-500 text-sm mt-2">Access your MaintenanceHub dashboard</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {loginError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                      <span className="block sm:inline">{loginError}</span>
                    </div>
                  )}
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      {...register("username")}
                    />
                    {errors.username && (
                      <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      {...register("password")}
                    />
                    {errors.password && (
                      <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition-colors duration-300 flex items-center justify-center"
                  >
                    <LoginIcon className="mr-2 h-5 w-5" /> Login
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}