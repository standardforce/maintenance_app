'use client'
import { useState,useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { BellIcon, CheckIcon } from 'lucide-react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form"

const formSchema = z.object({
  sixMonths: z.boolean(),
  oneYear: z.boolean(),
  threeYears: z.boolean(),
  tenYears: z.boolean(),
})

export default function NotificationSettings() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sixMonths:false,
      oneYear: false,
      threeYears: false,
      tenYears: false,
    },
  })

async function extractUser(){
  try{
    const response = await fetch('/api/auth/verify-token', {
      method: 'GET',
    });
    const res= await response.json();
    const data=res.payload.user_id;
    return data;
  }
  catch(error){
    console.error("Error extracting user_id:", error);
      return null;
  }
}

async function fetchPreferences() {
  try {
    const response = await fetch("/api/updateNotification",{
      method:"GET",
    });
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
  return <p>Loading...</p>;
}
  // return (
  //   <div className="max-w-2xl mx-auto">
  //     <h1 className="text-3xl font-bold mb-6">Notification Settings</h1>
  //     <Card>
  //       <CardHeader>
  //         <CardTitle className="flex items-center">
  //           <BellIcon className="mr-2 h-6 w-6" />
  //           Configure Email Notifications
  //         </CardTitle>
  //       </CardHeader>
  //       <CardContent>
  //         <Form {...form}>
  //           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
  //             <FormField
  //               control={form.control}
  //               name="sixMonths"
  //               render={({ field }) => (
  //                 <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 ">
  //                   <div className="space-y-0.5">
  //                     <FormLabel className="text-base">
  //                       6 Months Inspection
  //                     </FormLabel>
  //                     <FormDescription>
  //                       Receive notifications for 6-month inspections
  //                     </FormDescription>
  //                   </div>
  //                   <FormControl>
  //                   <Switch
  //                     checked={field.value}
  //                     onCheckedChange={field.onChange}
  //                     className="data-[state=checked]:bg-blue-600" // Default bg and when checked
  //                   />
  //                 </FormControl>

  //                 </FormItem>
  //               )}
  //             />
  //             <FormField
  //               control={form.control}
  //               name="oneYear"
  //               render={({ field }) => (
  //                 <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
  //                   <div className="space-y-0.5">
  //                     <FormLabel className="text-base">
  //                       1 Year Inspection
  //                     </FormLabel>
  //                     <FormDescription>
  //                       Receive notifications for 1-year inspections
  //                     </FormDescription>
  //                   </div>
  //                   <FormControl>
  //                     <Switch
  //                       checked={field.value}
  //                       onCheckedChange={field.onChange}
  //                        className="data-[state=checked]:bg-blue-600"
  //                     />
  //                   </FormControl>
  //                 </FormItem>
  //               )}
  //             />
  //             <FormField
  //               control={form.control}
  //               name="threeYears"
  //               render={({ field }) => (
  //                 <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
  //                   <div className="space-y-0.5">
  //                     <FormLabel className="text-base">
  //                       3 Years Inspection
  //                     </FormLabel>
  //                     <FormDescription>
  //                       Receive notifications for 3-year inspections
  //                     </FormDescription>
  //                   </div>
  //                   <FormControl>
  //                     <Switch
  //                       checked={field.value}
  //                       onCheckedChange={field.onChange}
  //                      className="data-[state=checked]:bg-blue-600"
  //                     />
  //                   </FormControl>
  //                 </FormItem>
  //               )}
  //             />
  //             <FormField
  //               control={form.control}
  //               name="tenYears"
  //               render={({ field }) => (
  //                 <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
  //                   <div className="space-y-0.5">
  //                     <FormLabel className="text-base">
  //                       10 Years Inspection
  //                     </FormLabel>
  //                     <FormDescription>
  //                       Receive notifications for 10-year inspections
  //                     </FormDescription>
  //                   </div>
  //                   <FormControl>
  //                     <Switch
  //                       checked={field.value}
  //                       onCheckedChange={field.onChange}
  //                       className="data-[state=checked]:bg-blue-600"
  //                     />
  //                   </FormControl>
  //                 </FormItem>
  //               )}
  //             />
  //             <Button type="submit" className="w-full bg-blue-600">
  //               <CheckIcon className="mr-2 h-4 w-4" />
  //               Save Preferences
  //             </Button>
  //           </form>
  //         </Form>
  //       </CardContent>
  //     </Card>
  //   </div>
  // )

  return (
    <div>
      <div className="container mx-auto max-w-5xl">
        <div className="grid md:grid-cols-2 gap-4 bg-white rounded-2xl shadow-2xl overflow-hidden h-[500px]">
          {/* Left Container - Notification Information */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 pl-6 pr-6 pb-20 text-white flex flex-col justify-center">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-2">
                <BellIcon className="h-8 w-8 text-white" />
                <h1 className="text-2xl font-bold">Notification Settings</h1>
              </div>
              
              <div className="space-y-3">
                <div className="bg-white/10 p-3 rounded-lg">
                  <h2 className="text-lg font-semibold mb-1">Stay Informed</h2>
                  <p className="text-white/80 text-sm">
                    Customize your notification preferences to ensure you never miss critical maintenance milestones.
                  </p>
                </div>
                
                <div className="bg-white/10 p-3 rounded-lg">
                  <h2 className="text-lg font-semibold mb-1">Inspection Reminders</h2>
                  <p className="text-white/80 text-sm">
                    Select the inspection periods you want to be notified about. From 6 months to 10 years, we've got you covered.
                  </p>
                </div>
                
                <div className="bg-white/10 p-3 rounded-lg">
                  <h2 className="text-lg font-semibold mb-1">Proactive Maintenance</h2>
                  <p className="text-white/80 text-sm">
                    Early notifications help you plan and budget for upcoming maintenance, preventing costly repairs.
                  </p>
                </div>
              </div>
            </div>
          </div>
  
          {/* Right Container - Notification Form */}
          <div className="p-6">
            <Card className="w-full border-none shadow-none">
              <CardHeader className="px-0 pb-4">
                <CardTitle className="text-xl font-bold text-gray-800">
                  Configure Your Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {["sixMonths", "oneYear", "threeYears", "tenYears"].map((field, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 bg-gray-100 rounded-lg transition-all hover:bg-gray-200"
                    >
                      <div className="space-y-1 flex-grow pr-4">
                        <label className="text-sm font-medium text-gray-800">
                          {`${field.replace(/([A-Z])/g, " $1")} Inspection`}
                        </label>
                        <p className="text-xs text-gray-500">
                          Receive notifications for {field.replace(/([A-Z])/g, " $1").toLowerCase()} inspections.
                        </p>
                      </div>
                      <Switch
                        {...form.register(field)}
                        checked={form.watch(field)}
                        onCheckedChange={(checked) => form.setValue(field, checked)}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>
                  ))}
                  
                  <Button 
                    type="submit" 
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
                  >
                    <CheckIcon className="mr-2 h-4 w-4" /> 
                    Save Preferences
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

