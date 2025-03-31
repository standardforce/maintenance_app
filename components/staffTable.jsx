'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';
import EditStaffDialog from './EditStaffDialog';

export default function StaffTable({ staff }) {
  const [query, setQuery] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);

  const filteredStaff = useMemo(() => {
    const safeStaff = staff || []; 
  
    if (!query) return safeStaff;
  
    return safeStaff.filter((user) => {
      const name = user.staff_name?.toLowerCase() || '';
      const email = user.email?.toLowerCase() || '';
      const loginId = user.login_id?.toLowerCase() || '';
      return (
        name.includes(query.toLowerCase()) ||
        email.includes(query.toLowerCase()) ||
        loginId.includes(query.toLowerCase())
      );
    });
  }, [query, staff]);
  

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Input
          placeholder="Search by name, email, or login ID"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-64"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Staff Name</TableHead>
            <TableHead>Kana</TableHead>
            <TableHead>Emp Code</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Login ID</TableHead>
            <TableHead>Password</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStaff.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.staff_name}</TableCell>
              <TableCell>{user.staff_kana}</TableCell>
              <TableCell>{user.employee_code}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.login_id}</TableCell>
              <TableCell>{user.password}</TableCell>
              <TableCell>{user.tel_1}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Button size="sm" onClick={() => setSelectedStaff(user)}>
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedStaff && (
        <EditStaffDialog
          staff={selectedStaff}
          onClose={() => setSelectedStaff(null)}
        />
      )}
    </div>
  );
}


