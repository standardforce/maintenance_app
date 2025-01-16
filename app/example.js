"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogInIcon as LoginIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";

// Define form schema using zod
const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LandingPage() {
  const router = useRouter();
  const { toast } = useToast();

  // Initialize the form using useForm
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

  // Define submit handler
  const onSubmit = (values) => {
    if (values.username === "admin" && values.password === "password") {
      localStorage.setItem("isLoggedIn", "true");
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      router.push("/dashboard");
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: "#275cb8",
          padding: "1rem 0",
          color: "#fff",
        }}
      >
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 1rem",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "1.5rem" }}>Standard Force</h1>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link
              href="/about"
              style={{ color: "#fff", textDecoration: "none", fontSize: "1rem" }}
            >
              About Us
            </Link>
            <Link
              href="/services"
              style={{ color: "#fff", textDecoration: "none", fontSize: "1rem" }}
            >
              Services
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main
        style={{
          flex: "1",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "3rem 2rem",
          color: "#000",
        }}
      >
        {/* Text Content */}
        <div style={{ flex: 1, padding: "1rem" }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
            Welcome to the Maintenance Notification App
          </h1>
          <p style={{ fontSize: "1.2rem", lineHeight: "1.5" }}>
            Effortlessly manage maintenance plans for newly built or renovated
            homes.
          </p>
        </div>

        {/* Login Form */}
        <div style={{ flex: 1, padding: "1rem" }}>
          <Card className="w-[350px]" style={{ margin: "0 auto" }}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block mb-1">
                    Username
                  </label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    {...register("username")}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm">
                      {errors.username.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="password" className="block mb-1">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  <LoginIcon className="mr-2 h-4 w-4" /> Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#333",
          color: "#fff",
          padding: "1rem 0",
          textAlign: "center",
        }}
      >
        <p>&copy; 2025 Standard Force. All rights reserved.</p>
      </footer>
    </div>
  );
}
