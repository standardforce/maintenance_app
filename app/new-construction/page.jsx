"use client";

import React, {useState, useEffect} from "react";
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
} from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import { CalendarIcon, BuildingIcon, UserIcon, PhoneIcon, MailIcon, FileIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"
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




const formSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  clientName: z.string().min(1, "Client name is required"),
  address: z.string().min(1, "Address is required"),
  telephone: z.string().min(1, "Telephone number is required"),
  email: z.string().email("Invalid email address"),
  registrationDate:z.date({
    required_error:"Registration date is required",
  })
});

export default function NewConstruction() {
  const router = useRouter();
   const [loading, setLoading] = useState(true); // State to track loading
   const [authChecked, setAuthChecked] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      clientName: "",
      address: "",
      telephone: "",
      email: "",
      registarionDate:new Date(),
    },
  });

  const onSubmit = async (values) => {
    try {
      const formattedValues={
        ...values,
        regis_date:values.registrationDate.toISOString().split("T")[0],
      }
      const response = await fetch("/api/construction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formattedValues),
      });
      const data = await response.json();

      if (response.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error during construction registration", error);
    }
  };


  useEffect(()=>{
    const checkAuth=async() =>{
      try{
        const response=await fetch('/api/auth/verify-token',{
          method:'GET',
          credentials:'include',
        });
        if(!response.ok){
          console.log('Unauthorized');
          router.push('/');
          return;
        }
        const data=await response.json();
        // console.log('Authenticated user', data);
        setAuthChecked(true);
      }catch(error){
        console.error('Authentication failed:', error);
          router.push('/');
      }
      finally{
        setLoading(false);
      }
    }
    checkAuth();
  },[router]);
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">New Construction Registration</h1>
      <Card>
        <CardHeader>
          <CardTitle>Register New or Renovated Home</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Construction Company Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <BuildingIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-8" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <UserIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-8" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telephone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telephone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <PhoneIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-8" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MailIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-8" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="completion_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Completion Date</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value
                              ? format(new Date(field.value), "PPP")
                              : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => field.onChange(date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              {/* <FormField
                control={form.control}
                name="drawings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Drawings</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FileIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="file"
                          className="pl-8"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            field.onChange(file ? file.name : "");
                          }}
                          accept=".pdf,.dwg,.dxf"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="registrationDate"
                render={({ field }) => {
                  const [manualInput, setManualInput] = useState(
                    field.value ? format(new Date(field.value), "yyyy-MM-dd") : ""
                  );

                  // Handle manual input changes
                  const handleInputChange = (e) => {
                    setManualInput(e.target.value);
                    const parsedDate = parse(e.target.value, "yyyy-MM-dd", new Date());

                    // Check if it's a valid date and update form state
                    if (!isNaN(parsedDate.getTime())) {
                      field.onChange(parsedDate);
                    }
                  };

                  return (
                    <FormItem>
                      <FormLabel>Registration Date</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          {/* Manual Input for Typing Date */}
                          <Input
                            type="text"
                            placeholder="YYYY-MM-DD"
                            value={manualInput}
                            onChange={handleInputChange}
                            className="w-full"
                          />

                          {/* Popover Date Picker */}
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="flex items-center gap-2"
                              >
                                <CalendarIcon className="h-4 w-4" />
                                {field.value ? format(new Date(field.value), "PPP") : "Pick a date"}
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
