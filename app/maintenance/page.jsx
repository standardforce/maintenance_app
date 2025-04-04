"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";

// Validation Schema
const formSchema = z.object({
  matter_no:z.string().min(1,"matter_no is required"),
  matter_name:z.string().min(1,"matter_name is required"),
  customer_name:z.string(),
  owner_name:z.string(),
  architecture_type:z.string(),
  address_1: z.string().min(1, "Address is required"),
  address_2: z.string().min(1, "Address is required"),
  department_name: z.string().min(1, "Department is required"),
  staff_name: z.string().min(1, "Department is required"),
  update_date: z.string().min(1, "Registration date is required"),
});

export default function MaintenanceSchedule() {
  const [properties, setProperties] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      matter_no:"",
      matter_name:"",
      customer_name:"",
      owner_name:"",
      architecture_type:"",
      address_1: "",
      address_2: "",
      department_name: "",
      staff_name: "",
      update_date: "",
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
          matter_no: item.matter_no,
          matter_name:item.matter_name,
          customer_name:item.customer_name,
          owner_name:item.owner_name,
          architecture_type:item.architecture_type,
          address_1:item.address1, 
          address_2:item.address2, 
          department_name:item.department_name,
          staff_name:item.staff_name,
          update_date:item.update_at.split('T')[0],
        }));

        setProperties(formattedData);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    }
    fetchData();
  }, []);

  const handleEdit = (item) => {
    setEditingProperty(item);
    form.reset({
      matter_no: item.matter_no,
      matter_name:item.matter_name,
      customer_name:item.customer_name,
      owner_name:item.owner_name,
      architecture_type:item.architecture_type,
      address_1:item.address1, 
      address_2:item.address2, 
      department_name:item.department_name,
      staff_name:item.staff_name,
      update_date:item.update_at,
    });

    setIsDialogOpen(true);
  };

  // const filteredProperties = properties.filter((property) =>
  //   property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   property.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   property.constructionCompany.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const router = useRouter();
  const handleRedirect = async (matterNo) => {
    router.push(`/new-construction/${matterNo}`);
  };
  return (
    <motion.div
      className="max-w-8xl mx-auto p-2 md:p-3 lg:pl-1 lg:pr-1 lg:pt-4"
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
        className="mt-6 overflow-x-auto p-2 text-3xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Table className="w-full">
        <TableHeader className="bg-blue-600">
        <TableRow>
        <TableHead className="text-white text-xs w-32">ID</TableHead>
        <TableHead className="text-white text-xs w-48">Matter Name</TableHead>
        <TableHead className="text-white text-xs w-48">Customer Name</TableHead>
        <TableHead className="text-white text-xs w-40">Owner Name</TableHead>
        <TableHead className="text-white text-xs w-32">Architecture</TableHead>
        <TableHead className="text-white text-xs w-48">Address1</TableHead>
        <TableHead className="text-white text-xs w-48">Address2</TableHead>
        <TableHead className="text-white text-xs w-48">Department Name</TableHead>
        <TableHead className="text-white text-xs w-48">Staff Name</TableHead>
        <TableHead className="text-white text-xs w-36">Update Date</TableHead>
        <TableHead className="text-white text-xs w-24">Actions</TableHead>
        </TableRow>
      </TableHeader>
          <TableBody>
            {properties.length > 0 ? (
              properties.map((property, index) => (
                <motion.tr
                  key={property.id}
                  className="border-b"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <TableCell>{property.matter_no}</TableCell>
                  <TableCell>{property.matter_name}</TableCell>
                  <TableCell>{property.customer_name}</TableCell>
                  <TableCell>{property.owner_name}</TableCell>
                  <TableCell>{property.architecture_type}</TableCell>
                  <TableCell>{property.address_1}</TableCell>
                  <TableCell>{property.address_2}</TableCell>
                  <TableCell>{property.department_name}</TableCell>
                  <TableCell>{property.staff_name}</TableCell>
                  <TableCell>{property.update_date}</TableCell>
                  <TableCell>
                  <Button onClick={() => handleRedirect(property.matter_no)} className="bg-green-600 text-white hover:bg-green-700">
                    Edit
                  </Button>
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
    </motion.div>
  );
}
