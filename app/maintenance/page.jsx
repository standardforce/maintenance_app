'use client'
import { useState, useEffect } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon, SearchIcon, FileIcon, DownloadIcon, TrashIcon, PlusIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const formSchema=z.object({
  address:z.string().min(1,"Address is required"),
  clientName:z.string().min(1,"client name is required"),
  constructionCompany:z.string().min(1,"Construction Company is required"),
  registrationdate:z.string().min(1,"Registration date is required"),
})
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
export default function MaintenanceSchedule(){
  const [properties, setProperties]=useState([]);
  const [editingProperty,setEditingProperty]=useState(null);
  const [searchTerm, setSearchTerm]=useState('');
  const [isDialogOpen,setIsDialogOpen]=useState(false);
  
  const form=useForm({
    resolver:zodResolver(formSchema),
    defaultValues:{
      address:"",
      clientName:"",
      constructionCompany:"",
      registrationdate:"",
    },
  });


  useEffect(()=>{
    async function fetchData(){
      try{
        const response=await fetch('/api/maintenance',{
          method:"GET",
          headers:{"Content-Type":"application/json"},
          credentials:"include",
        });
        if(!response.ok){
          throw new Error("Failed to fetch maintenance schedule");
        }

        const data=await response.json();

        const formattedData= data.map((item)=>({
          id:item.id,
          address:item.address,
          clientName:item.client_name,
          constructionCompany:item.company_name,
          registrationdate:item.regis_date? new Date(item.regis_date).toISOString().split("T")[0] : "",
        }))

       setProperties(formattedData);
      }
      catch(error){
        console.error("Error fetching properites:",error);
      }
    }

    fetchData();
  },[]);


  const handleEdit=(property)=>{
    setEditingProperty(property);
    form.reset({
      address:property.address,
      clientName:property.clientName,
      constructionCompany:property.constructionCompany,
      registrationdate:property.registrationdate,
    });

   setIsDialogOpen(true);
  }


  const onSubmit=async(values)=>{

  }

  const filteredProperties=properties.filter((property)=>
  property.address.toLowerCase().includes(searchTerm.toLowerCase()) || 
  property.clientName.toLoweCase().includes(searchTerm.toLowerCase()) ||
  property.constructionCompany.toLowerCase().includes(searchTerm.toLowerCase())
);


return(
 <div className="space-y-6">
  <h1 className="text-3xl font-bold">Maintenance Schedule Management</h1>
  <div className="flex justify-between items-center">
    <div className="relative w-64">
   <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-forgeground"/>
   <Input
    placeholder="Search properties..."
    value={searchTerm}
    onChange={(e)=>setSearchTerm(e.target.value)}
    className="pl-8"
   />
   </div>
  </div>
  <Table>
  <TableHeader>
    <TableRow>
      <TableHead>Address</TableHead>
      <TableHead>Client Name</TableHead>
      <TableHead>Construction Company</TableHead>
      <TableHead>Registration Date</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  {
    filteredProperties.map((property)=>(
    <TableRow>
      <TableCell>{property.address}</TableCell>
      <TableCell>{property.clientName}</TableCell>
      <TableCell>{property.constructionCompany}</TableCell>
      <TableCell>{property.registrationdate}</TableCell>
      <TableCell>
        <TooltipProvider>
         <Tooltip>
          <TooltipTrigger as child>
           <Button variant="outline" size="icon" onClick={()=> handleEdit(property)}>
            <PencilIcon className="h-4 w-4"/>
           </Button>
          </TooltipTrigger>
          <TooltipContent>
          <p>Edit details</p>
          </TooltipContent>
         </Tooltip>
         </TooltipProvider>
      </TableCell>
    </TableRow>
    ))
  }
   </Table>

   <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Property Details</DialogTitle>
      </DialogHeader>
      <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="registrationdate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
        </Form>
    </DialogContent>
   </Dialog>
 </div>
)


}

