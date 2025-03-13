"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BellIcon, CheckIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";

// Schema validation
const formSchema = z.object({
  sixMonths: z.boolean(),
  oneYear: z.boolean(),
  threeYears: z.boolean(),
  tenYears: z.boolean(),
});

export default function NotificationSettings() {
  const [loading, setLoading] = useState(true);

  // Form setup
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sixMonths: false,
      oneYear: false,
      threeYears: false,
      tenYears: false,
    },
  });

  async function fetchPreferences() {
    try {
      const response = await fetch("/api/updateNotification", { method: "GET" });
      if (!response.ok) throw new Error("Failed to fetch preferences");

      const data = await response.json();
      form.reset({
        sixMonths: data.sixMonths === 1,
        oneYear: data.oneYear === 1,
        threeYears: data.threeYears === 1,
        tenYears: data.tenYears === 1,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching preferences:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPreferences();
  }, []);

  async function onSubmit(values) {
    try {
      const response = await fetch("/api/updateNotification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sixMonths: values.sixMonths ? 1 : 0,
          oneYear: values.oneYear ? 1 : 0,
          threeYears: values.threeYears ? 1 : 0,
          tenYears: values.tenYears ? 1 : 0,
        }),
      });
      if (!response.ok) throw new Error("Failed to update preferences");
    } catch (error) {
      console.error("Error updating notifications:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        >
          Loading...
        </motion.p>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-2xl shadow-xl overflow-hidden"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Left Container - Notification Info */}
        <motion.div
          className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white flex flex-col justify-center space-y-6"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div className="flex items-center space-x-4">
            <BellIcon className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold">Notification Settings</h1>
          </motion.div>

          {["Stay Informed", "Proactive Maintenance", "Inspection Reminders"].map(
            (title, index) => (
              <motion.div
                key={index}
                className="bg-white/10 p-4 rounded-lg"
                whileHover={{ scale: 1.05 }}
              >
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-white/80 text-sm">
                  {index === 0
                    ? "Customize your notification preferences to ensure you never miss critical maintenance milestones."
                    : index === 1
                    ? "Early notifications help you plan and budget for upcoming maintenance, preventing costly repairs."
                    : "Select the inspection periods you want to be notified about. From 6 months to 10 years, we've got you covered."}
                </p>
              </motion.div>
            )
          )}
        </motion.div>

        {/* Right Container - Notification Form */}
        <motion.div className="p-6">
          <Card className="w-full border-none shadow-none">
            <CardHeader className="px-0 pb-4">
              <CardTitle className="text-xl font-bold text-gray-800">
                Configure Your Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {["sixMonths", "oneYear", "threeYears", "tenYears"].map(
                    (field, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <FormField
                          control={form.control}
                          name={field}
                          render={({ field: formField }) => (
                            <FormItem className="flex items-center justify-between p-3 bg-gray-100 rounded-lg transition-all hover:bg-gray-200">
                              <div className="space-y-1 flex-grow pr-4">
                                <FormLabel className="text-sm font-medium text-gray-800">
                                  {`${field.replace(/([A-Z])/g, " $1")} Inspection`}
                                </FormLabel>
                                <FormDescription className="text-xs text-gray-500">
                                  Receive notifications for{" "}
                                  {field.replace(/([A-Z])/g, " $1").toLowerCase()} inspections.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <motion.div whileTap={{ scale: 0.9 }}>
                                  <Switch
                                    checked={formField.value}
                                    onCheckedChange={formField.onChange}
                                    className="data-[state=checked]:bg-blue-600"
                                  />
                                </motion.div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )
                  )}

                  <motion.button
                    type="submit"
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center py-2 rounded-md text-white"
                    whileTap={{ scale: 0.95 }}
                  >
                    <CheckIcon className="mr-2 h-4 w-4" />
                    Save Preferences
                  </motion.button>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
