'use client'
import { useEffect, useState} from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CalendarIcon, HomeIcon, AlertTriangleIcon, CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'
import { Badge } from "@/components/ui/badge"
import {
   ColumnDef,
   flexRender,
   getCoreRowModel,
   useReactTable,
   getPaginationRowModel,
   getSortedRowModel,
   SortingState,
   getFilteredRowModel,
   ColumnFiltersState,
 } from "@tanstack/react-table"

//  const data = [
//   { id: 1, address: '123 Main St', nextInspection: '2023-12-01', type: '6 months', status: 'upcoming' },
//   { id: 2, address: '456 Elm St', nextInspection: '2024-06-15', type: '1 year', status: 'upcoming' },
//   { id: 3, address: '789 Oak St', nextInspection: '2023-07-10', type: '3 years', status: 'overdue' },
//   { id: 4, address: '101 Pine St', nextInspection: '2033-09-22', type: '10 years', status: 'upcoming' },
//   // Add more dummy data here to demonstrate pagination
//   { id: 5, address: '202 Maple Ave', nextInspection: '2023-11-05', type: '6 months', status: 'upcoming' },
//   { id: 6, address: '303 Birch Blvd', nextInspection: '2023-08-20', type: '1 year', status: 'overdue' },
//   { id: 7, address: '404 Cedar Ct', nextInspection: '2024-02-28', type: '3 years', status: 'upcoming' },
//   { id: 8, address: '505 Dogwood Dr', nextInspection: '2023-10-12', type: '6 months', status: 'upcoming' },
//   { id: 9, address: '606 Elm Ext', nextInspection: '2023-09-01', type: '1 year', status: 'upcoming' },
//   { id: 10, address: '707 Fir Fwy', nextInspection: '2023-12-25', type: '3 years', status: 'upcoming' },
// ]

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
    cell: ({ row }) => {
      return getStatusBadge(row.getValue("6_months_flag"))
    },
  },
]

const getStatusBadge = (status) => {
   switch (status) {
     case 0:
       return <Badge variant="outline">Upcoming</Badge>;
     case 1:
       return <Badge variant="destructive">Overdue</Badge>;
     default:
       return null;
   }
 };


export default function Dashboard() {
  const router = useRouter();
   const [data,setData]=useState({})
   const [user,setUser]=useState()
   const [openDialog, setOpenDialog]=useState(null)
   const [globalFilter,setGlobalFilter]=useState('')
   const [sorting, setSorting] = useState([])
   const [columnFilters, setColumnFilters] = useState([])
   const [loading, setLoading] = useState(true); // State to track loading
   const [authChecked, setAuthChecked] = useState(false);

   useEffect(()=>{
      const fetchData=async()=>{
         try{
            const response=await fetch("/api/construction",{
              method:"GET",
              headers:{
                "Content-Type":"application/json",
              },
              credentials:"include"
            });
            const result=await response.json();
            setData(result);
         }
         catch(error){
            console.log("Error fetching construction data:", error);
         }
      };
      fetchData();
   },[])

   const table=useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
   })
   const handleCardClick=(cardType)=>{
      setOpenDialog(cardType)
   }
   const closeDialog = () => {
      setOpenDialog(null)
    }

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await fetch('/api/auth/verify-token', {
            method: 'GET',
          });
          if (!response.ok) {
            console.log('Unauthorized');
            router.push('/');
            return;
          }
          const resp = await response.json();
          setUser(resp.payload.user_id);
          console.log('Authenticated user:', resp.payload.user_id);
          setAuthChecked(true);
        } catch (error) {
          console.error('Authentication failed:', error);
          router.push('/');
        } finally{
          setLoading(false);
        }
      };
    
      checkAuth();
    }, [router]);
    

    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <p>Loading...</p> {/* Replace this with a spinner or loading indicator */}
        </div>
      );
    }

    const handleRowClick = (userId) => {
      console.log('Navigating to:', userId);
      router.push(`/homeowner_user/${userId}`);
    };
    

    return(
      <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer transition-shadow hover:shadow-lg" onClick={() => handleCardClick('properties')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <HomeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-shadow hover:shadow-lg" onClick={() => handleCardClick('upcoming')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Inspections</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-shadow hover:shadow-lg" onClick={() => handleCardClick('overdue')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Inspections</CardTitle>
            <AlertTriangleIcon className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">2</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-shadow hover:shadow-lg" onClick={() => handleCardClick('completed')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Inspections</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">89</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Maintenance Schedules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4">
            <Input
              placeholder="Search all columns..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder ? null : (
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? "cursor-pointer select-none"
                                  : "",
                                onClick: header.column.getToggleSortingHandler(),
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: " 🔼",
                                desc: " 🔽",
                              }[header.column.getIsSorted()] ?? null}
                            </div>
                          )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={()=> handleRowClick(row.original.id)}
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={openDialog === 'properties'} onOpenChange={() => closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Total Properties</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Total number of properties: 24</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Residential: 18</li>
              <li>Commercial: 6</li>
            </ul>
            <p className="mt-4">Recent additions:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>123 New St (Added on 2023-06-15)</li>
              <li>456 Modern Ave (Added on 2023-06-10)</li>
            </ul>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'upcoming'} onOpenChange={() => closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upcoming Inspections</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Number of upcoming inspections: 7</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead>Inspection Date</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>123 Main St</TableCell>
                  <TableCell>2023-12-01</TableCell>
                  <TableCell>6 months</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>456 Elm St</TableCell>
                  <TableCell>2024-06-15</TableCell>
                  <TableCell>1 year</TableCell>
                </TableRow>
                {/* Add more rows as needed */}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'overdue'} onOpenChange={() => closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Overdue Inspections</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Number of overdue inspections: 2</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Days Overdue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>789 Oak St</TableCell>
                  <TableCell>2023-07-10</TableCell>
                  <TableCell>5</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>321 Pine St</TableCell>
                  <TableCell>2023-07-12</TableCell>
                  <TableCell>3</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'completed'} onOpenChange={() => closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Completed Inspections</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Total completed inspections: 89</p>
            <p className="mt-4">Recent completions:</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead>Completion Date</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>567 Maple Ave</TableCell>
                  <TableCell>2023-07-14</TableCell>
                  <TableCell>1 year</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>890 Cedar Ln</TableCell>
                  <TableCell>2023-07-13</TableCell>
                  <TableCell>6 months</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    )
}