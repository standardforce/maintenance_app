

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import * as z from "zod";
import { format, parseISO } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import {
  BuildingIcon,
  CalendarIcon,
  CircleUserIcon,
  Factory,
  Mail,
  Phone,
  User2Icon,
  UserCheck2Icon,
  BellIcon
} from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

// 🔹 Validation Schema
const formSchema = z.object({
  matter_no: z.string(),
  matter_name: z.string(),
  customer_name: z.string(),
  owner_name: z.string().min(1, "Owner Name is required"),
  architecture_type: z.string(), 
  address1: z.string(),
  address2: z.string(),
  department_name: z.string(),
  staff_name: z.string(),
  telephone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email"),
  delivery_expected_date: z.date({ required_error: "Delivery Date is required" }),
  sixMonths: z.boolean(),
  oneYear: z.boolean(),
  threeYear: z.boolean(),
  tenYear: z.boolean(),
  period: z.array(z.number()), // period array
  confirmationNotification: z.boolean().refine(val => val === true, {
    message: "You must confirm your notification preferences before submitting."
  }),
});

export default function NewConstruction() {
  const router = useRouter();
  const { matterNo } = useParams(); // Get matter number from URL
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // for showing spinner when fetching
  const [originalData, setOriginalData] = useState(null); // Store original data for comparison

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      matter_no: "",
      matter_name: "",
      customer_name: "",
      owner_name: "",
      architecture_type: "",
      address1: "",
      address2: "",
      department_name: "",
      staff_name: "",
      telephone: "",
      email: "",
      delivery_expected_date: new Date(),
      sixMonths: false,
      oneYear: false,
      threeYear: false,
      tenYear: false,
      period: [],
      confirmationNotification: false,
    },
  });
  
  // Moved fetchConstructionData outside useEffect and made it a useCallback

  const fetchConstructionData = useCallback(async () => {
    if (!matterNo) {
      setInitialLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/new-construction/${matterNo}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch construction data");

      const data = await response.json();
      setOriginalData(data); // Store original data
      
      // Parse date properly
      const deliveryDate = data.delivery_expected_date 
        ? new Date(data.delivery_expected_date) 
        : new Date();
      
      // Parse period data properly
      let periodData = [];
      if (data.period) {
        try {
          // Handle if period is stored as a JSON string
          if (typeof data.period === 'string') {
            periodData = JSON.parse(data.period);
          } else if (Array.isArray(data.period)) {
            periodData = data.period;
          }
        } catch (e) {
          console.error("Error parsing period data:", e);
        }
      }

      form.reset({
        matter_no: data.matter_no || "",
        matter_name: data.matter_name || "",
        customer_name: data.customer_name || "",
        owner_name: data.owner_name || "",
        architecture_type: data.architecture_type || "",
        address1: data.address1 || "",
        address2: data.address2 || "",
        department_name: data.department_name || "",
        staff_name: data.staff_name || "",
        telephone: data.telephone || "",
        email: data.email || "",
        delivery_expected_date: deliveryDate,
        sixMonths: Boolean(data.sixMonths),
        oneYear: Boolean(data.oneYear),
        threeYear: Boolean(data.threeYear),
        tenYear: Boolean(data.tenYear),
        period: periodData,
        confirmationNotification: false, // always reset this
      });
    } catch (error) {
      console.error("Error fetching construction:", error);
    }
    setInitialLoading(false);
  }, [matterNo, form]);

  useEffect(() => {
    fetchConstructionData();
  }, [fetchConstructionData]); 
  

  const onSubmit = async (values) => {
    if (!values.confirmationNotification) {
      form.setError("confirmationNotification", {
        type: "manual",
        message: "You must confirm your notification preferences before submitting."
      });
      return;
    }
    
    setLoading(true);
    try {
      if (!matterNo) {
        alert("Invalid matter number.");
        setLoading(false);
        return;
      }
      
      const payload = {
        ...values,
        delivery_expected_date: format(values.delivery_expected_date, "yyyy-MM-dd"),
      };
      
      const res = await fetch(`/api/new-construction/${matterNo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Update failed");

      // Update our original data record after successful submission
      setOriginalData({...payload});
      
      alert("Update successful!");
      
      // Reset the confirmation flag only
      form.setValue("confirmationNotification", false);
      
    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
    setLoading(false);
  };

  // Handle adding periods
  const handleAddPeriod = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newPeriod = Number(e.currentTarget.value);
      if (!isNaN(newPeriod) && newPeriod > 0) {
        const currentPeriods = form.getValues().period || [];
        form.setValue("period", [...currentPeriods, newPeriod]);
        e.currentTarget.value = ""; // clear input after adding
      }
    }
  };

  // Remove a period
  const handleRemovePeriod = (index) => {
    const currentPeriods = form.getValues().period;
    form.setValue("period", currentPeriods.filter((_, idx) => idx !== index));
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h1
        className="text-2xl font-bold mb-6 text-center md:text-left"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {matterNo ? "Edit Construction" : "New Construction Registration"}
      </motion.h1>

      {initialLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>
                {matterNo ? "Update Construction Details" : "Register New Construction"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: "matter_no", label: "Matter Number", icon: BuildingIcon },
                      { name: "matter_name", label: "Matter Name", icon: BuildingIcon },
                      { name: "customer_name", label: "Customer Name", icon: BuildingIcon },
                      { name: "owner_name", label: "Owner Name", icon: User2Icon },
                      { name: "architecture_type", label: "Architecture Type", icon: BuildingIcon },
                      { name: "department_name", label: "Department Name", icon: Factory },
                      { name: "staff_name", label: "Staff Name", icon: UserCheck2Icon },
                      { name: "telephone", label: "Telephone Number", icon: Phone },
                      { name: "email", label: "Email", icon: Mail },
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
                              <FormLabel htmlFor={name}>{label}</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Icon className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                                  <Input id={name} {...field} className="pl-8" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Address */}
                  <motion.div >
                    <FormField
                      control={form.control}
                      name="address1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address 1</FormLabel>
                          <FormControl>
                            <Textarea className="w-full" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address 2</FormLabel>
                          <FormControl>
                            <Textarea className="w-full" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  {/* Delivery Date */}
                  <motion.div >
                    <FormField
                      control={form.control}
                      name="delivery_expected_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Date</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input
                                type="text"
                                placeholder="YYYY-MM-DD"
                                value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
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

                  {/* Notification Preferences */}
                  <Card className="p-6 bg-gray-50 rounded-lg shadow-sm border">
                    <CardHeader className="border-b pb-4">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BellIcon className="h-6 w-6 text-blue-600" />
                        <span className="text-gray-800">Notification Preferences</span>
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        Select the inspection reminders you want to receive.
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-4">
                      {[
                        { name: "sixMonths", label: "6-Month Inspection Reminder" },
                        { name: "oneYear", label: "1-Year Inspection Reminder" },
                        { name: "threeYear", label: "3-Year Inspection Reminder" },
                        { name: "tenYear", label: "10-Year Inspection Reminder" },
                      ].map(({ name, label }, index) => (
                        <FormField
                          key={index}
                          control={form.control}
                          name={name}
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm border hover:bg-gray-100 transition-all">
                              <div className="flex flex-col">
                                <FormLabel className="text-sm font-medium text-gray-700">{label}</FormLabel>
                                <FormDescription className="text-xs text-gray-500">
                                  Receive a notification for your {label.toLowerCase()}.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-blue-600"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      ))}

                      {/* Dynamic Period Field */}
                      <FormField
                        control={form.control}
                        name="period"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dynamic Period</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <Input
                                  type="number"
                                  placeholder="Enter period in months"
                                  onKeyDown={handleAddPeriod}
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Press Enter to add multiple periods (like 6, 12, etc.)
                            </FormDescription>
                            <FormMessage />
                            {/* Show added periods with remove button */}
                            <div className="flex gap-2 mt-2 flex-wrap">
                              {field.value && field.value.map((p, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded flex items-center"
                                >
                                  {p} months
                                  <button 
                                    type="button"
                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                    onClick={() => handleRemovePeriod(idx)}
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Confirm Notifications */}
                  <FormField
                    control={form.control}
                    name="confirmationNotification"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                        </FormControl>
                        <FormLabel className="text-sm">
                          I confirm that I have selected the notification preferences.
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Complete Registration"}
                  </motion.button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}