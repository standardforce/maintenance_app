"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

// Validation Schema
const formSchema = z.object({
  address: z.string().min(1, "Address is required"),
  clientName: z.string().min(1, "Client name is required"),
  constructionCompany: z.string().min(1, "Construction Company is required"),
  registrationdate: z.string().min(1, "Registration date is required"),
});

export default function MaintenanceSchedule() {
  const [properties, setProperties] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      clientName: "",
      constructionCompany: "",
      registrationdate: "",
    },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/maintenance", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch maintenance schedule");
        }

        const data = await response.json();

        const formattedData = data.map((item) => ({
          id: item.id,
          address: item.address,
          clientName: item.client_name,
          constructionCompany: item.company_name,
          registrationdate: item.regis_date ? new Date(item.regis_date).toISOString().split("T")[0] : "",
        }));

        setProperties(formattedData);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    }
    fetchData();
  }, []);

  const handleEdit = (property) => {
    setEditingProperty(property);
    form.reset({
      address: property.address,
      clientName: property.clientName,
      constructionCompany: property.constructionCompany,
      registrationdate: property.registrationdate,
    });

    setIsDialogOpen(true);
  };

  const onSubmit = async (values) => {
    console.log("Updated values:", values);
    setIsDialogOpen(false);
  };

  const filteredProperties = properties.filter((property) =>
    property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.constructionCompany.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8"
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
        Maintenance Schedule Management
      </motion.h1>

      {/* Search Bar */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-center gap-4"
        whileHover={{ scale: 1.02 }}
      >
        <div className="relative w-full sm:w-64">
          <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </motion.div>

      {/* Responsive Table */}
      <motion.div
        className="mt-6 overflow-x-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>Client Name</TableHead>
              <TableHead>Construction Company</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property, index) => (
                <motion.tr
                  key={property.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <TableCell>{property.address}</TableCell>
                  <TableCell>{property.clientName}</TableCell>
                  <TableCell>{property.constructionCompany}</TableCell>
                  <TableCell>{property.registrationdate}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.button
                            className="bg-gray-200 p-2 rounded-md"
                            onClick={() => handleEdit(property)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </motion.button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit details</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No properties found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>


      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Property Details</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="constructionCompany"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Construction Company</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="registrationdate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
