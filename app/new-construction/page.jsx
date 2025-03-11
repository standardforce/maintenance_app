'use client';

import React, { useState, useEffect } from "react";
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
  const [authChecked, setAuthChecked] = useState(false);

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
        headers: {
          "Content-Type": "application/json",
        },
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
        const response = await fetch('/api/auth/verify-token', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          console.log('Unauthorized');
          router.push('/');
          return;
        }
        setAuthChecked(true);
      } catch (error) {
        console.error('Authentication failed:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center md:text-left">
        New Construction Registration
      </h1>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            Register New or Renovated Home
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Grid Layout for Responsive Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Construction Company Name */}
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <BuildingIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                          <Input className="pl-8" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Client Name */}
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <UserIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                          <Input className="pl-8" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Telephone */}
                <FormField
                  control={form.control}
                  name="telephone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telephone</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <PhoneIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                          <Input className="pl-8" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MailIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                          <Input className="pl-8" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Full-width Address */}
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

              {/* Registration Date with Manual Input & Calendar Picker */}
              <FormField
                control={form.control}
                name="registrationDate"
                render={({ field }) => {
                  const [manualInput, setManualInput] = useState(
                    field.value ? format(new Date(field.value), "yyyy-MM-dd") : ""
                  );

                  const handleInputChange = (e) => {
                    setManualInput(e.target.value);
                    const parsedDate = parse(e.target.value, "yyyy-MM-dd", new Date());

                    if (!isNaN(parsedDate.getTime())) {
                      field.onChange(parsedDate);
                    }
                  };

                  return (
                    <FormItem>
                      <FormLabel>Registration Date</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="YYYY-MM-DD"
                            value={manualInput}
                            onChange={handleInputChange}
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
                                onSelect={(date) => {
                                  field.onChange(date);
                                  setManualInput(format(date, "yyyy-MM-dd"));
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <Button type="submit" className="w-full bg-blue-600">
                Register Construction
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
