"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format, parse } from "date-fns";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  CalendarIcon,
  BuildingIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
} from "lucide-react";

// Schema Validation
const formSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  clientName: z.string().min(1, "Client name is required"),
  address: z.string().min(1, "Address is required"),
  telephone: z.string().min(1, "Telephone number is required"),
  email: z.string().email("Invalid email address"),
  registrationDate: z.date({
    required_error: "Registration date is required",
  }),
});

export default function NewConstruction() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      clientName: "",
      address: "",
      telephone: "",
      email: "",
      registrationDate: new Date(),
    },
  });

  const onSubmit = async (values) => {
    try {
      const formattedValues = {
        ...values,
        regis_date: values.registrationDate.toISOString().split("T")[0],
      };
      const response = await fetch("/api/construction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formattedValues),
      });

      if (response.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error during construction registration", error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify-token", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          router.push("/");
          return;
        }
      } catch (error) {
        console.error("Authentication failed:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  return (
    <motion.div
      className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h1
        className="text-3xl font-bold mb-6 text-center md:text-left"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        New Construction Registration
      </motion.h1>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Register New or Renovated Home
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: "companyName", label: "Company Name", icon: BuildingIcon },
                    { name: "clientName", label: "Client Name", icon: UserIcon },
                    { name: "telephone", label: "Telephone", icon: PhoneIcon },
                    { name: "email", label: "Email", icon: MailIcon },
                  ].map(({ name, label, icon: Icon }, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <FormField
                        control={form.control}
                        name={name}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{label}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Icon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                <Input className="pl-8" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Address Field */}
                <motion.div whileHover={{ scale: 1.02 }}>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea className="w-full" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Registration Date Picker */}
                <motion.div whileHover={{ scale: 1.02 }}>
                  <FormField
                    control={form.control}
                    name="registrationDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Date</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              type="text"
                              placeholder="YYYY-MM-DD"
                              value={format(field.value, "yyyy-MM-dd")}
                              readOnly
                              className="w-full"
                            />
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline">
                                  <CalendarIcon className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Register Construction
                </motion.button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
