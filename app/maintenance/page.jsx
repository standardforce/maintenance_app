'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast'
import { PencilIcon, SearchIcon, FileIcon, DownloadIcon, TrashIcon, PlusIcon } from 'lucide-react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"

const formSchema = z.object({
  address: z.string().min(1, "Address is required"),
  clientName: z.string().min(1, "Client name is required"),
  constructionCompany: z.string().min(1, "Construction company is required"),
  nextInspection: z.string().min(1, "Next inspection date is required"),
})



const initialProperties = [
  { id: 1, address: '123 Main St', clientName: 'John Doe', constructionCompany: 'ABC Construction', nextInspection: '2023-12-01', files: [{ name: 'document1.pdf', type: 'pdf' }, { name: 'notes.txt', type: 'txt' }] },
  { id: 2, address: '456 Elm St', clientName: 'Jane Smith', constructionCompany: 'XYZ Builders', nextInspection: '2024-06-15', files: [{ name: 'blueprint.pdf', type: 'pdf' }] },
  { id: 3, address: '789 Oak St', clientName: 'Bob Johnson', constructionCompany: 'Best Homes', nextInspection: '2026-03-10', files: [] },
]

export default function MaintenanceSchedule() {
  const [properties, setProperties] = useState(initialProperties)
  const [editingProperty, setEditingProperty] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      clientName: "",
      constructionCompany: "",
      nextInspection: "",
    },
  })

  const handleEdit = (property) => {
    setEditingProperty(property)
    form.reset({
      address: property.address,
      clientName: property.clientName,
      constructionCompany: property.constructionCompany,
      nextInspection: property.nextInspection,
    })
    setIsDialogOpen(true)
  }

  const onSubmit = (values) => {
    if (editingProperty) {
      const updatedProperties = properties.map(p => 
        p.id === editingProperty.id 
          ? { ...p, ...values, files: editingProperty.files } 
          : p
      )
      setProperties(updatedProperties)
      setEditingProperty(null)
      setIsDialogOpen(false)
      toast({
        title: "Property Updated",
        description: "The property details have been updated.",
      })
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (file && editingProperty) {
      const newFile = { name: file.name, type: file.name.split('.').pop() || '' }
      setEditingProperty({
        ...editingProperty,
        files: [...editingProperty.files, newFile]
      })
    }
  }

  const handleFileDelete = (fileName) => {
    if (editingProperty) {
      setEditingProperty({
        ...editingProperty,
        files: editingProperty.files.filter(file => file.name !== fileName)
      })
    }
  }

  const filteredProperties = properties.filter(property =>
    property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.constructionCompany.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Maintenance Schedule Management</h1>
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            <TableHead>Next Inspection</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProperties.map((property) => (
            <TableRow key={property.id}>
              <TableCell>{property.address}</TableCell>
              <TableCell>{property.clientName}</TableCell>
              <TableCell>{property.constructionCompany}</TableCell>
              <TableCell>{property.nextInspection}</TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => handleEdit(property)}>
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit details</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
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
                name="nextInspection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Next Inspection</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <h4 className="mb-2 text-sm font-medium">Associated Files</h4>
                <ScrollArea className="h-[100px] w-full rounded-md border p-2">
                  {editingProperty?.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between py-1">
                      <div className="flex items-center">
                        <FileIcon className="mr-2 h-4 w-4" />
                        <span>{file.name}</span>
                      </div>
                      <div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <DownloadIcon className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Download file</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleFileDelete(file.name)}>
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete file</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </div>
              <div>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex items-center space-x-2 text-sm text-blue-500">
                    <PlusIcon className="h-4 w-4" />
                    <span>Add File</span>
                  </div>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.txt"
                />
              </div>
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

