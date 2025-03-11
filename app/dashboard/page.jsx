'use client'
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  CalendarIcon, 
  HomeIcon, 
  AlertTriangleIcon, 
  CheckCircleIcon 
} from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from "@/components/ui/badge"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel
} from "@tanstack/react-table"

const columns = [
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "client_name",
    header: "Client Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "6_months_flag",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.getValue("6_months_flag")),
  },
]

const getStatusBadge = (status) => {
  switch (status) {
    case 0:
      return <Badge variant="outline">Upcoming</Badge>
    case 1:
      return <Badge variant="destructive">Overdue</Badge>
    default:
      return null
  }
}

export default function Dashboard() {
  const router = useRouter()
  const [data, setData] = useState([])
  const [user, setUser] = useState()
  const [openDialog, setOpenDialog] = useState(null)
  const [globalFilter, setGlobalFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/construction", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        })
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error("Error fetching construction data:", error)
      }
    }
    fetchData()
  }, [])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter
  })

  const handleCardClick = (cardType) => setOpenDialog(cardType)
  const closeDialog = () => setOpenDialog(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify-token', {
          method: 'GET',
        })
        if (!response.ok) {
          console.log('Unauthorized')
          router.push('/')
          return
        }
        const resp = await response.json()
        setUser(resp.payload.user_id)
        console.log('Authenticated user:', resp.payload.user_id)
      } catch (error) {
        console.error('Authentication failed:', error)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Cards Section */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Properties", icon: HomeIcon, count: "24", type: "properties" },
          { title: "Upcoming Inspections", icon: CalendarIcon, count: "7", type: "upcoming" },
          { title: "Overdue Inspections", icon: AlertTriangleIcon, count: "2", type: "overdue", color: "text-red-500" },
          { title: "Completed Inspections", icon: CheckCircleIcon, count: "89", type: "completed", color: "text-green-500" },
        ].map(({ title, icon: Icon, count, type, color }) => (
          <Card key={type} className="cursor-pointer transition-shadow hover:shadow-lg" onClick={() => handleCardClick(type)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <Icon className={`h-4 w-4 ${color || "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${color || ""}`}>{count}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Maintenance Schedules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-4 py-4">
            <Input
              placeholder="Search..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="w-full md:max-w-sm"
            />
          </div>

          {/* Responsive Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="whitespace-nowrap px-4 py-2">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="cursor-pointer hover:bg-gray-100">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="whitespace-nowrap px-4 py-2">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center py-4">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs for More Details */}
      <Dialog open={openDialog !== null} onOpenChange={closeDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{openDialog ? `${openDialog.replace(/_/g, ' ')} Details` : ''}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Details about {openDialog} will go here.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
