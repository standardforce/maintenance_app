'use client'

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

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sixMonths: true,
      oneYear: true,
      threeYears: true,
      tenYears: true,
    },
  })

  function onSubmit(values) {
    console.log(values)
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated.",
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Notification Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BellIcon className="mr-2 h-6 w-6" />
            Configure Email Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="sixMonths"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        6 Months Inspection
                      </FormLabel>
                      <FormDescription>
                        Receive notifications for 6-month inspections
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="oneYear"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        1 Year Inspection
                      </FormLabel>
                      <FormDescription>
                        Receive notifications for 1-year inspections
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="threeYears"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        3 Years Inspection
                      </FormLabel>
                      <FormDescription>
                        Receive notifications for 3-year inspections
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tenYears"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        10 Years Inspection
                      </FormLabel>
                      <FormDescription>
                        Receive notifications for 10-year inspections
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                <CheckIcon className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

