'use client';
import { useState, useEffect } from "react";
import { useRouter,usePathname } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  LogInIcon, 
  ConstructionIcon, 
  ClipboardListIcon, 
  CalendarIcon, 
  MessageCircleIcon, 
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
  const pathname = usePathname();
    const [loginError, setLoginError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (pathname !== '/') return;
        const checkAuth = async () => {
            try {
                const response = await fetch("/api/auth/verify-token", {
                    method: "GET",
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    handleRedirect(data.payload.role);
                }
            } catch (error) {
                console.error("Error verifying token:", error);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, [router]);

    const handleRedirect = (role) => {
        // console.log("Redirecting user with role:", role);  // Debugging

        if (role === "system_admin") {
            router.push("/system-admin");
        } else if (role === "company_admin") {
            router.push("/company-admin");
        } else {
            router.push("/dashboard");
        }
    };

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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
                credentials: "include",
            });

            const data = await response.json();
            if (response.ok) {
                handleRedirect(data.role);
            } else {
                setLoginError(data.message || "Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error("Error logging in:", error);
            setLoginError("An unexpected error occurred. Please try again.");
        }
    };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  // Feature list for construction business operations
  const features = [
    { icon: ClipboardListIcon, title: "Comprehensive Estimation", description: "Accurate and efficient cost estimation for construction projects." },
    { icon: CalendarIcon, title: "Project Scheduling", description: "Optimize timelines and resource allocation effortlessly." },
    { icon: MessageCircleIcon, title: "Real-time Collaboration", description: "Seamless communication between teams and stakeholders." },
    { icon: ConstructionIcon, title: "Maintenance & Tracking", description: "Monitor project progress and maintenance records efficiently." },
  ];

  return (
    <div className="flex flex-col lg:mt-[-60px]  w-full min-h-screen">
      {/* Main Content Section (100vh height applied) */}
      <main className="flex flex-col md:flex-row items-center justify-center w-full min-h-screen px-4 gap-12">
        {/* Welcome Section */}
        <div className="flex-1 text-center md:text-left max-w-lg">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Welcome to <span className="text-blue-600">InfraPulse</span>
          </h1>
          <p className="text-lg text-gray-700 mt-3">
            A Comprehensive System for Construction Businesses
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            {features.map((feature, index) => (
              <div 
              key={index} 
              className="bg-white p-4 rounded-lg shadow-md flex items-start space-x-3 transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              <feature.icon className="h-8 w-8 text-blue-500 mt-1 animate-bounce" />
              <div>
                <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </div>
            ))}
          </div>
        </div>

        {/* Login Section */}
        <div
          className="flex-1 max-w-md w-full"
        >
          <Card className="pt-4 pb-10 bg-white shadow-2xl rounded-xl border-t-4 border-blue-600">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <ShieldCheckIcon className="h-8 w-8 text-blue-600 animate-pulse" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">Login</CardTitle>
              <p className="text-gray-500 text-sm mt-2">Access your InfraPulse dashboard</p>
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
                  <Input id="username" type="text" placeholder="Enter your username" {...register("username")} />
                  {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>}
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <Input id="password" type="password" placeholder="Enter your password" {...register("password")} />
                  {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
                </div>
                <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md flex items-center justify-center active:scale-95 transition-transform duration-100"
              >
                <LoginIcon className="mr-2 h-5 w-5" /> Login
              </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
