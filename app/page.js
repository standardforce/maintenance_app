'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogInIcon as LoginIcon} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();

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

  // const onSubmit = (values) => {
  //   if (values.username === "admin" && values.password === "password") {
  //     localStorage.setItem("isLoggedIn", "true");
  //     toast({
  //       title: "Login Successful",
  //       description: "Welcome back!",
  //     });
  //     router.push("/dashboard");
  //   } else {
  //     toast({
  //       title: "Login Failed",
  //       description: "Invalid username or password",
  //       variant: "destructive",
  //     });
  //   }
  // };

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
          toast({ 
            title: "Login Successful",
            description: "Welcome back!",
          });
  
          // Redirect to dashboard
          router.push("/dashboard");
      } else {
        // Handle login failure
        toast({
          title: "Login Failed",
          description: data.message || "Invalid credentials.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    }
  };
  

  return (
    <div className="flex flex-col pt-20">
      {/* Main Content Section */}
      <main className="flex-grow flex items-center justify-center py-10">
        <div className="flex flex-col md:flex-row items-center max-w-7xl w-full px-4">
          {/* Welcome Section */}
          <div className="flex-1 mb-8 md:mb-0 md:pr-10">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to the Maintenance Notification App
            </h1>
            <p className="text-lg text-gray-700">
              Effortlessly manage maintenance plans for newly built or renovated homes.
            </p>
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
                  <Button type="submit" className="w-full">
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
